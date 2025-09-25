# 🚀 Deployment Guide - Online XOX

## Quick Deployment Instructions

### 🎯 Automated Deployment (Recommended)

1. **Push to GitHub:**
```bash
git add .
git commit -m "Deploy modernized XOX game"
git push origin main
```

2. **Backend Deployment (Render):**
   - Connect your GitHub repository to [Render](https://render.com)
   - Select "Web Service"
   - Use the existing `render.yaml` configuration
   - Backend will auto-deploy on port specified in render.yaml

3. **Frontend Deployment Options:**

#### Option A: Vercel (Recommended)
```bash
npm i -g vercel
cd frontend
vercel --prod
```

#### Option B: Netlify
```bash
cd frontend
pnpm run build
# Upload the 'out' folder to Netlify
```

#### Option C: Static Hosting
```bash
cd frontend
pnpm run build
# Deploy the 'out' folder to your preferred static host
```

### 🔧 Environment Variables

#### Production Frontend
```bash
NEXT_PUBLIC_WS_URL=https://your-backend-url.onrender.com
```

#### Local Development
```bash
NEXT_PUBLIC_WS_URL=http://localhost:3001
```

## 📋 Pre-Deployment Checklist

- [ ] All dependencies installed with `pnpm install`
- [ ] Frontend builds successfully with `pnpm run build`
- [ ] Backend starts without errors
- [ ] Environment variables are set correctly
- [ ] CORS settings include your frontend domain
- [ ] Socket.IO transports are configured properly

## 🧪 Testing the Deployment

1. **🌐 Open your deployed frontend URL**
2. **🎮 Create a game** and note the room code
3. **🔄 Open another browser/incognito window**
4. **🚀 Join the game** with the room code
5. **✅ Verify real-time gameplay** works correctly

## 🛠️ Troubleshooting

### Common Issues & Solutions:

#### 🔴 Connection Failed
- **Problem**: Cannot connect to backend
- **Solution**: 
  - Verify `NEXT_PUBLIC_WS_URL` in frontend environment variables
  - Check if backend is running and accessible
  - Test backend URL directly in browser

#### 🔴 CORS Errors
- **Problem**: Cross-origin requests blocked
- **Solution**: 
  - Ensure backend CORS settings include frontend domain
  - Check backend logs for CORS-related errors
  - Verify origin URLs match exactly

#### 🔴 WebSocket Connection Issues
- **Problem**: Real-time features not working
- **Solution**:
  - Verify Socket.IO configuration
  - Check if both WebSocket and polling transports are enabled
  - Test connection with network tab in developer tools

#### 🔴 Build Errors
- **Problem**: Frontend build fails
- **Solution**:
  - Check for TypeScript errors
  - Ensure all dependencies are installed
  - Verify Tailwind CSS configuration

### 🔍 Debug Steps:

1. **Check Browser Console**:
   ```bash
   # Open Developer Tools → Console
   # Look for JavaScript errors or warnings
   ```

2. **Verify Backend Status**:
   ```bash
   curl https://your-backend-url.onrender.com/health
   ```

3. **Test WebSocket Connection**:
   ```javascript
   // In browser console
   const socket = io('https://your-backend-url.onrender.com');
   socket.on('connect', () => console.log('Connected!'));
   ```

4. **Environment Variables Check**:
   ```bash
   # In frontend console
   console.log(process.env.NEXT_PUBLIC_WS_URL);
   ```

## 🚀 Advanced Deployment Options

### Docker Deployment
```dockerfile
# Dockerfile for backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### PM2 Process Manager
```bash
# Install PM2
npm install -g pm2

# Start backend with PM2
cd backend
pm2 start index.js --name "xox-backend"

# Monitor
pm2 monit
```

### Custom Domain Setup
1. **Add custom domain** to your hosting provider
2. **Update CORS settings** in backend to include new domain
3. **Update environment variables** to use new domain
4. **Test thoroughly** with new domain

## 📊 Performance Monitoring

### Frontend Monitoring
- Use Vercel Analytics or similar
- Monitor Core Web Vitals
- Track user interactions and errors

### Backend Monitoring
- Monitor Socket.IO connections
- Track response times
- Set up alerts for downtime

## 🔒 Security Considerations

1. **Environment Variables**: Never expose sensitive data
2. **CORS Configuration**: Only allow trusted domains
3. **Rate Limiting**: Implement if needed for production
4. **HTTPS**: Always use HTTPS in production
5. **Input Validation**: Validate all user inputs

## 📈 Scaling Considerations

### Single Instance (Current)
- Good for demo and small-scale usage
- Easy to deploy and maintain

### Multiple Instances
- Use Redis adapter for Socket.IO
- Implement session affinity
- Consider load balancing

---

🎉 **Congratulations!** Your modern XOX game is now deployed and ready for players worldwide!