# L484 PWA Deployment Guide

This project is configured as a Progressive Web App (PWA) with multiple deployment options.

## 🚀 Deployment Options

### 1. GitHub Pages (Automatic)
- **Setup**: Push to `main` branch
- **URL**: `https://[username].github.io/[repository-name]`
- **Features**: Automatic builds via GitHub Actions

### 2. Docker Container (Portainer)
- **File**: `docker-compose.yml`
- **Registry**: GitHub Container Registry (`ghcr.io`)
- **Command**: `docker-compose up -d`

### 3. Local Docker Build
```bash
# Build image
npm run docker:build

# Run container
npm run docker:run

# Or use docker-compose
npm run docker:compose
```

## 📱 PWA Features

### Offline Support
- Service Worker caches all static assets
- Workbox manages cache strategies
- Fallback to cached content when offline

### Caching Strategy
- **App Shell**: Cache First (1 year)
- **Images**: Cache First (30 days) 
- **Fonts**: Cache First (1 year)
- **API**: Network First with cache fallback

### Install Prompt
- Automatic PWA install prompt
- Works on mobile and desktop
- Icon shortcuts to key sections

## 🐳 Portainer Stack Deployment

1. **Create New Stack** in Portainer
2. **Copy** `docker-compose.yml` content
3. **Update** the domain in labels:
   ```yaml
   - "traefik.http.routers.l484.rule=Host(`your-domain.com`)"
   ```
4. **Deploy** the stack

## 🔧 Configuration

### Environment Variables
- `NODE_ENV=production` (set automatically)
- `BASE_URL` (for GitHub Pages, set automatically)

### Nginx Configuration
- Gzip compression enabled
- PWA headers configured
- SPA routing support
- Security headers included

### Health Checks
- Endpoint: `/health`
- Docker health check included
- Returns "healthy" status

## 📋 Build Process

### GitHub Actions Workflow
1. **Install dependencies**
2. **Run linting**
3. **Build application**
4. **Build Docker image**
5. **Push to GitHub Container Registry**
6. **Deploy to GitHub Pages**

### Multi-stage Docker Build
1. **Build stage**: Node.js Alpine with npm build
2. **Production stage**: Nginx Alpine serving static files
3. **Size optimized**: Only production assets included

## 🔐 Security Features

### Headers
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- X-XSS-Protection: enabled
- Referrer-Policy: strict-origin-when-cross-origin

### HTTPS
- Traefik labels for automatic SSL
- PWA requires HTTPS for full functionality

## 📊 Performance

### Optimizations
- Gzip compression
- Asset caching (1 year for static assets)
- Code splitting (vendor chunks)
- Image optimization support

### Monitoring
- Health check endpoint
- Service worker logging
- Docker health checks

## 🛠️ Development

### Local Development
```bash
npm run dev
# Runs on http://localhost:5180
```

### Testing PWA Features
```bash
npm run build
npm run preview
# Test service worker and caching
```

### Docker Development
```bash
npm run docker:build
npm run docker:run
# Test production Docker build locally
```