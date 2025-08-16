# Deployment Guide

## Frontend Deployment (Vercel)

Your frontend is configured for deployment on Vercel with admin panel access.

### Access URLs after deployment:
- **User booking system**: `https://your-vercel-domain.com/`
- **Admin panel**: `https://your-vercel-domain.com/admin`

### Setup Steps:

1. **Deploy to Vercel:**
   ```bash
   # Install Vercel CLI (if not already installed)
   npm i -g vercel
   
   # Deploy from your project root
   vercel
   ```

2. **Configure Environment Variables in Vercel:**
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add: `VITE_API_BASE_URL` = `https://your-backend-domain.com/api`

3. **Backend Deployment:**
   You need to deploy your backend separately. Options include:
   - **Railway**: Easy Node.js deployment
   - **Render**: Free tier available
   - **Heroku**: Popular platform
   - **DigitalOcean App Platform**
   - **AWS/Google Cloud/Azure**

## Backend Deployment

### Option 1: Railway (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway deploy
```

### Option 2: Render
1. Connect your GitHub repo to Render
2. Create a new Web Service
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables from `backend/.env.example`

### Option 3: Heroku
```bash
# Install Heroku CLI and login
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_jwt_secret
# ... add all other environment variables

# Deploy
git push heroku main
```

## Environment Variables for Production

### Frontend (.env):
```
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

### Backend (Platform environment variables):
```
NODE_ENV=production
PORT=5000
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_PORT=5432
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
SENDGRID_API_KEY=SG.your_sendgrid_key
FROM_EMAIL=your_verified_email@domain.com
ADMIN_INVITE_SECRET=your_admin_secret
FRONTEND_URL=https://your-vercel-domain.com
```

## Testing Admin Panel

1. **Create admin user:**
   ```bash
   # POST to your backend
   curl -X POST https://your-backend-domain.com/api/auth/admin/register \
     -H "Content-Type: application/json" \
     -d '{
       "inviteSecret": "your_admin_invite_secret",
       "email": "admin@example.com",
       "password": "secure_password",
       "familyName": "Admin",
       "firstName": "System"
     }'
   ```

2. **Access admin panel:**
   - Go to `https://your-vercel-domain.com/admin`
   - Login with admin credentials
   - Manage bookings, schedules, and users

## Troubleshooting

### Admin panel shows 404:
- Check `vercel.json` is deployed
- Verify routing configuration

### API calls fail:
- Check `VITE_API_BASE_URL` environment variable
- Verify backend is deployed and accessible
- Check CORS configuration in backend

### Admin login fails:
- Verify admin user was created successfully
- Check backend logs for authentication errors
- Ensure JWT secrets are set correctly

## Security Checklist

- ✅ Environment variables set correctly
- ✅ CORS configured for your frontend domain
- ✅ Database credentials secured
- ✅ API keys not in code
- ✅ Admin routes protected
- ✅ HTTPS enabled (Vercel provides this automatically)
