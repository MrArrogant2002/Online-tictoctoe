# Render Deployment Guide

## Overview
This project requires **TWO separate services** on Render because:
- Backend: Socket.IO server (Web Service)
- Frontend: Static Next.js site (Static Site)

## Method 1: Manual Deployment (Recommended)

### Step 1: Deploy Backend
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect GitHub repository: `MrArrogant2002/Online-tictoctoe`
4. Configure:
   - **Name**: `online-xox-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

### Step 2: Deploy Frontend
1. Click "New +" → "Static Site"
2. Select same repository: `MrArrogant2002/Online-tictoctoe`
3. Configure:
   - **Name**: `online-xox-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `out`

### Step 3: Configure Environment Variables

**Backend Service Environment Variables:**
```
NODE_ENV=production
PORT=10000
CORS_ORIGIN=https://online-xox-frontend.onrender.com
```

**Frontend Service Environment Variables:**
```
NEXT_PUBLIC_WS_URL=https://online-xox-backend.onrender.com
```

## Method 2: Blueprint Deployment

If you want to use the render.yaml blueprint:
1. Go to Render Dashboard
2. Click "New +" → "Blueprint"
3. Connect your repository
4. Render will create both services automatically

## Important Notes

- ✅ Each service deploys from the same repository but different directories
- ✅ Backend runs as a Web Service (Node.js)
- ✅ Frontend deploys as a Static Site (pre-built files)
- ✅ Services communicate via environment variables
- ❌ Do NOT try to deploy as a single service

## Troubleshooting

If you get deployment errors:
1. Make sure you're using the correct Root Directory for each service
2. Verify environment variables are set correctly
3. Check that both services are using the free plan
4. Ensure the repository is connected to both services

## URLs After Deployment

- Backend: `https://online-xox-backend.onrender.com`
- Frontend: `https://online-xox-frontend.onrender.com`
- Health Check: `https://online-xox-backend.onrender.com/health`