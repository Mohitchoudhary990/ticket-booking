# Vercel Deployment Guide - Frontend

This guide will walk you through deploying your Ticket Booking System frontend to Vercel.

## Prerequisites

- [ ] GitHub account
- [ ] Vercel account (sign up at https://vercel.com)
- [ ] Backend deployed on Render (get the URL first!)
- [ ] Razorpay credentials

---

## Step 1: Get Your Backend URL

Before deploying the frontend, you need your backend URL from Render.

**Example:** `https://ticket-booking-backend.onrender.com`

> **Important:** Make sure your backend is deployed and working before proceeding!

---

## Step 2: Update Environment Variables

### 2.1 Update `.env.production` File

Open `client/.env.production` and replace the placeholder with your actual Render backend URL:

```bash
# Backend API URL - REPLACE WITH YOUR ACTUAL RENDER URL
REACT_APP_API_URL=https://ticket-booking-backend.onrender.com/api

# Razorpay Key (Production Mode)
REACT_APP_RAZORPAY_KEY_ID=rzp_live_your_production_key
```

**Replace:**
- `https://ticket-booking-backend.onrender.com/api` with your actual Render URL
- `rzp_live_your_production_key` with your production Razorpay key (or keep test key for testing)

### 2.2 Update Backend CORS

After you get your Vercel URL, you'll need to update the backend's `FRONTEND_URL` environment variable in Render.

---

## Step 3: Push Code to GitHub

```bash
# Navigate to project root
cd c:\Users\Mohit\OneDrive\Desktop\ticket-booking

# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "Configure frontend for Vercel deployment"

# Push to GitHub
git push origin main
```

---

## Step 4: Deploy on Vercel

### 4.1 Import Project

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Select the `ticket-booking` repository

### 4.2 Configure Project

| Setting | Value |
|---------|-------|
| **Framework Preset** | Create React App |
| **Root Directory** | `client` |
| **Build Command** | `npm run build` (auto-detected) |
| **Output Directory** | `build` (auto-detected) |
| **Install Command** | `npm install` (auto-detected) |

### 4.3 Add Environment Variables

Click **"Environment Variables"** and add:

| Name | Value | Notes |
|------|-------|-------|
| `REACT_APP_API_URL` | `https://your-backend.onrender.com/api` | Your Render backend URL |
| `REACT_APP_RAZORPAY_KEY_ID` | `rzp_test_gfds` or `rzp_live_xxx` | Your Razorpay key |

> **⚠️ Important:** 
> - Make sure to include `/api` at the end of your backend URL
> - Use production Razorpay key for live payments
> - Environment variables are case-sensitive!

### 4.4 Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy your frontend (usually takes 1-3 minutes)
3. You'll get a URL like: `https://ticket-booking-xyz.vercel.app`

---

## Step 5: Update Backend CORS

Now that you have your Vercel URL, update the backend to allow requests from your frontend:

### 5.1 Update Render Environment Variables

1. Go to Render dashboard → Your backend service
2. Go to **"Environment"** tab
3. Update `FRONTEND_URL` to your Vercel URL:
   ```
   FRONTEND_URL=https://ticket-booking-xyz.vercel.app
   ```
4. Click **"Save Changes"**
5. Render will automatically redeploy

---

## Step 6: Verify Deployment

### 6.1 Test the Application

Open your Vercel URL in a browser:
```
https://ticket-booking-xyz.vercel.app
```

### 6.2 Test Key Features

- [ ] Homepage loads correctly
- [ ] Events are displayed (fetched from backend)
- [ ] User registration works
- [ ] User login works
- [ ] Booking flow works
- [ ] Admin login works
- [ ] Admin dashboard loads
- [ ] No CORS errors in browser console (F12)

### 6.3 Check Browser Console

Press `F12` to open Developer Tools and check for:
- ✅ No CORS errors
- ✅ API calls are going to your Render backend
- ✅ No 404 errors on API endpoints

---

## Step 7: Custom Domain (Optional)

### 7.1 Add Custom Domain

1. Go to Vercel dashboard → Your project
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Follow Vercel's instructions to update DNS records

### 7.2 Update Backend CORS

After adding a custom domain, update `FRONTEND_URL` in Render to include your custom domain.

---

## Auto-Deploy Setup

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Update frontend"
git push origin main
```

Vercel will automatically:
1. Detect the push
2. Build your project
3. Deploy the new version
4. Keep the same URL

---

## Troubleshooting

### Build Fails on Vercel

**Check Build Logs:**
- Go to Vercel dashboard → Deployments
- Click on the failed deployment
- Check the build logs for errors

**Common Issues:**
- Missing dependencies in `package.json`
- Environment variables not set
- Build errors in React code

### CORS Errors

**Symptoms:**
- Browser console shows CORS errors
- API requests fail with CORS policy errors

**Solutions:**
1. Verify `FRONTEND_URL` is set correctly in Render
2. Ensure backend CORS configuration includes your Vercel URL
3. Check that backend is running and accessible
4. Clear browser cache and try again

### API Calls Fail (404/500)

**Solutions:**
1. Verify `REACT_APP_API_URL` is set correctly in Vercel
2. Check that backend URL includes `/api` at the end
3. Test backend API directly in browser or Postman
4. Check Render logs for backend errors

### Environment Variables Not Working

**Solutions:**
1. Ensure variable names start with `REACT_APP_`
2. Redeploy after adding/changing environment variables
3. Check for typos in variable names
4. Verify values don't have extra spaces

### Blank Page After Deployment

**Solutions:**
1. Check browser console for JavaScript errors
2. Verify build completed successfully
3. Check that `build` directory is being served
4. Test locally with `npm run build` then `npx serve -s build`

---

## Performance Optimization

### Enable Vercel Analytics (Optional)

1. Go to Vercel dashboard → Your project
2. Click **"Analytics"** tab
3. Enable Web Analytics
4. Monitor performance and user behavior

### Enable Vercel Speed Insights (Optional)

Add to your `index.js`:
```javascript
import { SpeedInsights } from '@vercel/speed-insights/react';

// In your root component
<SpeedInsights />
```

---

## Environment-Specific URLs

| Environment | Frontend URL | Backend URL |
|-------------|--------------|-------------|
| **Local** | `http://localhost:3000` | `http://localhost:5000` |
| **Production** | `https://ticket-booking.vercel.app` | `https://ticket-booking-backend.onrender.com` |

---

## Important Notes

> [!WARNING]
> **Environment Variables**
> 
> - Vercel environment variables are set in the dashboard, NOT in `.env` files
> - `.env.production` is for local production builds only
> - Changes to environment variables require a redeploy

> [!CAUTION]
> **Security**
> 
> - Never commit `.env.local` or `.env.production` to Git
> - Use production Razorpay keys only for live payments
> - Keep API keys secure in Vercel dashboard

> [!TIP]
> **Free Tier Limits**
> 
> Vercel's free tier includes:
> - Unlimited deployments
> - 100GB bandwidth/month
> - Automatic HTTPS
> - Global CDN
> - Preview deployments for PRs

---

## Next Steps

1. ✅ Frontend deployed on Vercel
2. ✅ Backend CORS updated
3. 🧪 Test full application flow
4. 📱 Test on mobile devices
5. 🚀 Share your live app!

---

## Useful Commands

```bash
# Build locally to test
cd client
npm run build

# Serve build locally
npx serve -s build

# Check for build errors
npm run build 2>&1 | tee build.log
```

---

## Support Resources

- **Vercel Documentation:** https://vercel.com/docs
- **React Deployment:** https://create-react-app.dev/docs/deployment/
- **Vercel Community:** https://github.com/vercel/vercel/discussions

---

## Your Deployment URLs

**Frontend (Vercel):** `https://your-app.vercel.app`  
**Backend (Render):** `https://your-backend.onrender.com`

---

**Congratulations! Your app is now live! 🎉**

Share your Vercel URL with users and start accepting bookings!
