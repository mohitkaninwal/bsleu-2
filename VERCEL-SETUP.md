# Vercel Full-Stack Deployment Setup

## 🚀 Your Deployment Status: PUSHED ✅

The code has been pushed to GitHub and Vercel should now be redeploying with both frontend and backend!

## 📋 Next Steps:

### 1. **Set Environment Variables in Vercel Dashboard**

Go to your Vercel project dashboard and add these environment variables:

**Go to: [vercel.com](https://vercel.com) → Your Project → Settings → Environment Variables**

Add the following variables (use the same values from your local `backend/.env` file):

```
NODE_ENV=production
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
SENDGRID_API_KEY=SG.your_sendgrid_key_here
FROM_EMAIL=your_verified_email@domain.com
ADMIN_INVITE_SECRET=your_admin_secret_here
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=your_database_host
DB_PORT=5432
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
FRONTEND_URL=https://your-vercel-app.vercel.app
EXAM_CENTER=BSLEU Main Center, New Delhi
```

### 2. **After Environment Variables are Set**

1. **Trigger a new deployment:**
   - In Vercel dashboard → Deployments → Click "Redeploy" on the latest deployment
   - OR make a small change and push to GitHub

2. **Test your endpoints:**
   ```bash
   # Test API (should return data, not error)
   curl https://your-vercel-app.vercel.app/api/schedules
   
   # Test admin panel (should show login page)
   # Visit: https://your-vercel-app.vercel.app/admin
   ```

### 3. **Create Admin User**

Once the API is working, create an admin user by running this in your browser console or using a tool like Postman:

```javascript
fetch('https://your-vercel-app.vercel.app/api/auth/admin/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    inviteSecret: 'your_admin_invite_secret', // Same as in environment variables
    email: 'admin@bsleu.com',
    password: 'your_secure_password',
    familyName: 'Administrator',
    firstName: 'System',
    telephone: '+1234567890',
    placeOfResidence: 'New Delhi',
    countryOfResidence: 'India'
  })
})
.then(r => r.json())
.then(console.log);
```

### 4. **Final URLs**

After setup completes:
- **📱 User Booking**: `https://your-vercel-app.vercel.app/`
- **👤 Admin Panel**: `https://your-vercel-app.vercel.app/admin`
- **🔌 API Endpoints**: `https://your-vercel-app.vercel.app/api/*`

## 🔧 Troubleshooting

### If admin panel shows 404:
- Check if the latest deployment includes the `vercel.json` file
- Verify the deployment completed successfully

### If API calls fail:
- Ensure all environment variables are set in Vercel
- Check the Function logs in Vercel dashboard for errors
- Verify database connection details

### If admin login fails:
- Verify the admin user was created successfully
- Check the browser console for API errors
- Ensure JWT secrets are set correctly

## 🎯 What's Deployed Now

✅ **Frontend (React)**: Exam booking system
✅ **Backend (Node.js)**: API endpoints for bookings, admin, etc.
✅ **Admin Panel**: Available at `/admin` route
✅ **Database Integration**: Ready for your database
✅ **Authentication**: JWT-based admin auth
✅ **Email Service**: SendGrid integration

Your full-stack application is now ready! 🚀
