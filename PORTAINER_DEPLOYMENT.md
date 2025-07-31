# Portainer Deployment Guide for L484

## 🚨 Quick Fix for Build Error

The build error you encountered is due to missing devDependencies. Here are 3 solutions:

## Option 1: Fixed Docker Compose (Recommended)

**Copy this updated docker-compose.yml to Portainer:**

```yaml
version: '3.8'

services:
  l484-app:
    build: 
      context: .
      dockerfile: Dockerfile
    container_name: l484-innovation-platform
    ports:
      - "80:80"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost/health", "||", "exit", "1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

networks:
  default:
    driver: bridge
```

## Option 2: Use Pre-built Image (Fastest)

If you have GitHub Actions set up, use the pre-built image:

```yaml
version: '3.8'

services:
  l484-app:
    image: ghcr.io/[YOUR-GITHUB-USERNAME]/[YOUR-REPO-NAME]:latest
    container_name: l484-innovation-platform
    ports:
      - "80:80"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
```

## Option 3: Simple Build (If Option 1 Fails)

Use the simplified Dockerfile:

```yaml
version: '3.8'

services:
  l484-app:
    build: 
      context: .
      dockerfile: Dockerfile.simple
    container_name: l484-innovation-platform
    ports:
      - "80:80"
    restart: unless-stopped
```

## 🔍 Troubleshooting Steps

### 1. Check Portainer Logs
- Go to Containers → l484-innovation-platform → Logs
- Look for specific error messages during build

### 2. Manual Build Test
```bash
# Clone your repo locally and test:
git clone [your-repo-url]
cd [your-repo]
docker build -t l484-test .
docker run -p 8080:80 l484-test
```

### 3. Verify Files
Ensure these files are in your GitHub repository:
- `package.json` ✓
- `package-lock.json` ✓  
- `Dockerfile` ✓
- `nginx.conf` ✓
- `src/` directory ✓

### 4. Node Version Issue
If you get Node version errors, update Dockerfile first line:
```dockerfile
FROM node:18-alpine as builder
```

## 📝 Deployment Checklist

- [ ] Repository pushed to GitHub
- [ ] Dockerfile updated (fixed npm ci issue)
- [ ] docker-compose.yml copied to Portainer
- [ ] Domain updated in Traefik labels (if using reverse proxy)
- [ ] Network configuration matches your setup

## 🌐 Domain Configuration

Update the domain in docker-compose.yml labels:
```yaml
labels:
  - "traefik.http.routers.l484.rule=Host(`your-actual-domain.com`)"
```

## 🚀 Expected Result

After successful deployment:
- App available at http://localhost or your configured domain
- PWA features working (offline, install prompt)
- All sections and animations functional
- Health check endpoint at `/health`

## 📞 Still Having Issues?

Try Option 2 (pre-built image) first, then Option 1 (fixed compose file). If both fail, use Option 3 (simple build) for debugging.