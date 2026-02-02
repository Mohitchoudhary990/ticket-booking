# Render Deployment Guide - Backend

This guide will walk you through deploying your Ticket Booking System backend to Render.

## Prerequisites

- [ ] GitHub account
- [ ] Render account (sign up at https://render.com)
- [ ] MongoDB Atlas database (already configured)
- [ ] Razorpay account credentials

---

## Step 1: Prepare Your Code

### 1.1 Update Your Local .env File

Add the FRONTEND_URL to your local `.env` file:

```bash
PORT=5000
MONGO_URI=mongodb+srv://mohit:mohit123@cluster0.hdk8vb.mongodb.net/test
JWT_SECRET=ewdcrtfvbghnjm
RAZORPAY_KEY_ID=rzp_test_gfds
RAZORPAY_KEY_SECRET=fcghjb
FRONTEND_URL=http://localhost:3000
```

> **Note**: You'll add the production frontend URL later after deploying the frontend.

### 1.2 Push Code to GitHub

```bash
# Initialize git if not already done
cd c:\Users\Mohit\OneDrive\Desktop\ticket-booking
git init

# Add all files
git add .

# Commit
git commit -m "Prepare backend for Render deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/ticket-booking.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy on Render

### 2.1 Create New Web Service

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account if not already connected
4. Select your `ticket-booking` repository

### 2.2 Configure Web Service

Fill in the following settings:

| Setting | Value |
|---------|-------|
| **Name** | `ticket-booking-backend` (or your preferred name) |
| **Region** | Choose closest to your users |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` (or paid plan) |

### 2.3 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add each of these:

| Key | Value | Notes |
|-----|-------|-------|
| `PORT` | `5000` | Render will override this automatically |
| `MONGO_URI` | `mongodb+srv://mohit:mohit123@cluster0.hdk8vb.mongodb.net/test` | Your MongoDB connection string |
| `JWT_SECRET` | `ewdcrtfvbghnjm` | ⚠️ Use a stronger secret in production! |
| `RAZORPAY_KEY_ID` | `rzp_test_gfds` | Your Razorpay key |
| `RAZORPAY_KEY_SECRET` | `fcghjb` | Your Razorpay secret |
| `FRONTEND_URL` | `http://localhost:3000` | Update after deploying frontend |
| `NODE_ENV` | `production` | Optional but recommended |

> **⚠️ IMPORTANT SECURITY NOTES:**
> 
> 1. **Generate a strong JWT_SECRET**: Use a random 64-character string
>    ```bash
>    # Generate on Windows PowerShell:
>    -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | % {[char]$_})
>    ```
> 
> 2. **Use Production Razorpay Keys**: Replace test keys with live keys from your Razorpay dashboard
> 
> 3. **Secure MongoDB**: Ensure your MongoDB Atlas cluster has proper IP whitelisting

### 2.4 Deploy

1. Click **"Create Web Service"**
2. Render will start building and deploying your backend
3. Wait for the deployment to complete (usually 2-5 minutes)
4. You'll get a URL like: `https://ticket-booking-backend.onrender.com`

---

## Step 3: Verify Deployment

### 3.1 Test the API

Open your backend URL in a browser:
```
https://ticket-booking-backend.onrender.com
```

You should see: **"Ticket Booking API is running"**

### 3.2 Test API Endpoints

Use Postman or curl to test:

```bash
# Test health check
curl https://ticket-booking-backend.onrender.com/

# Test events endpoint
curl https://ticket-booking-backend.onrender.com/api/events
```

---

## Step 4: Configure MongoDB Atlas

### 4.1 Whitelist Render IP

1. Go to MongoDB Atlas → Network Access
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Or add Render's specific IPs for better security

### 4.2 Verify Connection

Check Render logs to ensure MongoDB connection is successful:
- Go to your Render dashboard
- Click on your service
- Check the **"Logs"** tab
- Look for: `✅ MongoDB Connected Successfully`

---

## Step 5: Update Frontend Configuration

Once backend is deployed, update your frontend to use the production API:

1. Create `client/.env.production`:
   ```bash
   REACT_APP_API_URL=https://ticket-booking-backend.onrender.com/api
   ```

2. Update `FRONTEND_URL` in Render:
   - After deploying frontend (e.g., on Vercel)
   - Go to Render dashboard → Environment
   - Update `FRONTEND_URL` to your frontend URL
   - Example: `https://ticket-booking.vercel.app`

---

## Step 6: Enable Auto-Deploy (Optional)

Render automatically deploys when you push to GitHub:

1. Make any code changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update backend"
   git push
   ```
3. Render will automatically rebuild and deploy

---

## Troubleshooting

### Deployment Fails

**Check Build Logs:**
- Go to Render dashboard → Logs
- Look for error messages during build

**Common Issues:**
- Missing dependencies: Ensure all packages are in `package.json`
- Node version: Render uses Node 18+ by default
- Environment variables: Double-check all are set correctly

### MongoDB Connection Fails

**Solutions:**
1. Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
2. Check connection string format
3. Ensure database user has proper permissions
4. Check Render logs for specific error messages

### CORS Errors

**Solutions:**
1. Ensure `FRONTEND_URL` is set correctly in Render
2. Update `app.js` CORS configuration if needed
3. Check browser console for specific CORS errors

### API Returns 404

**Solutions:**
1. Verify the URL includes `/api` prefix
2. Check route definitions in backend
3. Ensure build completed successfully

---

## Free Tier Limitations

Render's free tier has some limitations:

- ⏰ **Spins down after 15 minutes of inactivity**
  - First request after inactivity takes 30-60 seconds
  - Consider upgrading to paid plan for production

- 💾 **750 hours/month free**
  - Enough for one service running 24/7

- 🔄 **Auto-deploys on git push**
  - Unlimited deployments

---

## Next Steps

1. ✅ Backend deployed on Render
2. 📱 Deploy frontend (see `DEPLOYMENT_FRONTEND.md`)
3. 🔐 Update CORS with frontend URL
4. 🧪 Test full application flow
5. 🚀 Share your live app!

---

## Useful Commands

```bash
# View logs
# Go to Render dashboard → Logs

# Restart service
# Go to Render dashboard → Manual Deploy → "Clear build cache & deploy"

# Update environment variables
# Go to Render dashboard → Environment → Edit
```

---

## Support

- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com
- MongoDB Atlas Support: https://www.mongodb.com/docs/atlas/

---

**Your Backend URL:** `https://ticket-booking-backend.onrender.com`

Save this URL - you'll need it for frontend deployment!
