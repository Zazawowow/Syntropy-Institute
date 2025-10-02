# Portainer Stack Deployment Guide

## Overview
This guide explains how to deploy the Syntropy Website as a Portainer stack using Git repository integration.

## Prerequisites
- Portainer instance running and accessible
- Git repository accessible from your Portainer host
- Port 8080 available on your host machine

## Repository Information
- **Repository URL**: `http://192.168.1.191:8085/lfg2025/Syntropy.git`
- **Branch**: `institute-transfer` (or `main` depending on your setup)
- **Username**: `lfg2025`
- **Password**: `buybitcoin44`

## Deployment Steps

### Option 1: Deploy via Portainer Web UI

1. **Log into Portainer**
   - Navigate to your Portainer instance
   - Select your environment (local/Docker)

2. **Create New Stack**
   - Go to **Stacks** → **Add stack**
   - Choose **Git Repository** as the deployment method

3. **Configure Git Settings**
   - **Repository URL**: `http://192.168.1.191:8085/lfg2025/Syntropy.git`
   - **Repository reference**: `refs/heads/institute-transfer`
   - **Compose path**: `docker-compose.portainer.yml`
   
4. **Add Authentication**
   - Enable **Authentication**
   - Username: `lfg2025`
   - Password: `buybitcoin44`

5. **Deploy**
   - Click **Deploy the stack**
   - Wait for the build and deployment to complete

### Option 2: Deploy via Portainer API

```bash
curl -X POST \
  'http://YOUR_PORTAINER_HOST:9000/api/stacks' \
  -H 'X-API-Key: YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "syntropy-website",
    "repositoryURL": "http://192.168.1.191:8085/lfg2025/Syntropy.git",
    "repositoryReferenceName": "refs/heads/institute-transfer",
    "composeFile": "docker-compose.portainer.yml",
    "repositoryAuthentication": true,
    "repositoryUsername": "lfg2025",
    "repositoryPassword": "buybitcoin44",
    "env": []
  }'
```

## Stack Configuration

### Compose File
The stack uses `docker-compose.portainer.yml` which includes:
- **Service Name**: `syntropy-website`
- **Container Name**: `syntropy-website`
- **Port Mapping**: `8080:80` (host:container)
- **Restart Policy**: `unless-stopped`
- **Health Check**: Enabled with 30s interval
- **Network**: Custom bridge network `syntropy-network`

### Build Process
The Dockerfile uses a multi-stage build:
1. **Builder Stage**: Node.js 20 Alpine builds the Vite/React app
2. **Production Stage**: Nginx Alpine serves the static files

### Accessing the Application
Once deployed, access the website at:
- **URL**: `http://YOUR_HOST_IP:8080`
- **Example**: `http://192.168.1.191:8080`

## Port Configuration

If port 8080 is already in use, you can change it:

1. **Via Portainer UI**:
   - After creating the stack, edit it
   - Change the port mapping from `8080:80` to `YOUR_PORT:80`
   - Redeploy the stack

2. **In Git Repository**:
   - Edit `docker-compose.portainer.yml`
   - Change the ports section: `"YOUR_PORT:80"`
   - Commit and push changes
   - Redeploy in Portainer

## Environment Variables

Currently configured environment variables:
- `NODE_ENV=production`

To add more environment variables:
1. Edit the stack in Portainer
2. Add variables in the environment section
3. Or add them to `docker-compose.portainer.yml` under the `environment` key

## Auto-Update Configuration

To enable automatic updates from Git:

1. **In Portainer Stack Settings**:
   - Enable **Automatic updates**
   - Set **Polling interval** (e.g., 5 minutes)
   - Configure **Webhook** (optional)

2. **Git Webhook** (Optional):
   - In your Git repository settings, add a webhook
   - URL: `http://YOUR_PORTAINER:9000/api/stacks/webhooks/YOUR_WEBHOOK_ID`
   - Trigger on push events

## Troubleshooting

### Build Fails
- Check if Node.js dependencies can be installed
- Verify the repository is accessible from Portainer host
- Check build logs in Portainer

### Container Won't Start
- Check port 8080 is not already in use: `netstat -tulpn | grep 8080`
- Review container logs in Portainer
- Verify health check is passing

### Authentication Issues
- Verify Git credentials are correct
- Ensure repository URL is accessible from Portainer host
- Try cloning the repository manually from the Portainer host

### Update Stack
To update the running stack:
1. Push changes to Git repository
2. In Portainer: **Stacks** → Select stack → **Pull and redeploy**

## Health Monitoring

The stack includes a health check that:
- Runs every 30 seconds
- Times out after 10 seconds
- Retries 3 times before marking unhealthy
- Waits 40 seconds before starting checks

Monitor health status in Portainer's container view.

## Logs

View logs in Portainer:
1. Go to **Stacks** → Select `syntropy-website`
2. Click on the container name
3. View **Logs** tab

Or via command line:
```bash
docker logs syntropy-website
```

## Cleanup

To remove the stack:
1. In Portainer: **Stacks** → Select stack → **Delete**
2. Or via CLI: `docker stack rm syntropy-website`

## Additional Resources

- [Portainer Documentation](https://docs.portainer.io/)
- [Docker Compose File Reference](https://docs.docker.com/compose/compose-file/)
- [Nginx Documentation](https://nginx.org/en/docs/)

