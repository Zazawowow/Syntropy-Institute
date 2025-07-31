# Multi-stage build with explicit path and version checks
FROM node:20-alpine as builder

# Install required packages
RUN apk add --no-cache git python3 make g++

# Verify node and npm are working
RUN node --version && npm --version

# Set working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Clean npm cache and install dependencies
RUN npm cache clean --force
RUN npm install --verbose --no-optional

# Copy source code
COPY . .

# List all files to debug
RUN echo "=== Files in /app ===" && ls -la
RUN echo "=== Package.json scripts ===" && cat package.json | grep -A 10 '"scripts"'

# Check if vite is available
RUN npx vite --version || echo "Vite not found, trying global install"
RUN npm list vite || echo "Vite not in node_modules"

# Try building with full path
RUN ./node_modules/.bin/vite build || npm run build

# Verify build output exists
RUN ls -la dist/ && echo "Build completed successfully"

# Production stage with nginx
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy PWA assets to nginx html directory
COPY --from=builder /app/public/manifest.json /usr/share/nginx/html/
COPY --from=builder /app/public/*.png /usr/share/nginx/html/
COPY --from=builder /app/public/*.ico /usr/share/nginx/html/
COPY --from=builder /app/public/*.jpg /usr/share/nginx/html/
COPY --from=builder /app/public/*.svg /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]