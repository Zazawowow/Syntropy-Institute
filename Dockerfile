# Multi-stage build for optimal production image
FROM node:20-alpine as builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

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