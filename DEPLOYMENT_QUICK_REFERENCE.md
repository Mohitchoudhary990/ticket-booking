# Quick Deployment Reference

## 🚀 Deployment Checklist

### Backend (Render)
- [ ] Push code to GitHub
- [ ] Create Web Service on Render
- [ ] Set root directory to `backend`
- [ ] Add environment variables
- [ ] Deploy and get backend URL
- [ ] Test API endpoint

### Frontend (Vercel)
- [ ] Update `.env.production` with backend URL
- [ ] Push code to GitHub
- [ ] Import project on Vercel
- [ ] Set root directory to `client`
- [ ] Add environment variables
- [ ] Deploy and get frontend URL
- [ ] Update backend `FRONTEND_URL`

---

## 📋 Environment Variables

### Backend (Render)
```
PORT=5000
MONGO_URI=mongodb+srv://mohit:mohit123@cluster0.hdk8vb.mongodb.net/test
JWT_SECRET=<generate-strong-secret>
RAZORPAY_KEY_ID=<your-key>
RAZORPAY_KEY_SECRET=<your-secret>
FRONTEND_URL=<your-vercel-url>
NODE_ENV=production
```

### Frontend (Vercel)
```
REACT_APP_API_URL=<your-render-backend-url>/api
REACT_APP_RAZORPAY_KEY_ID=<your-razorpay-key>
```

---

## 🔗 Important URLs

**Backend Deployment Guide:** [DEPLOYMENT_BACKEND_RENDER.md](file:///c:/Users/Mohit/OneDrive/Desktop/ticket-booking/DEPLOYMENT_BACKEND_RENDER.md)

**Frontend Deployment Guide:** [DEPLOYMENT_FRONTEND_VERCEL.md](file:///c:/Users/Mohit/OneDrive/Desktop/ticket-booking/DEPLOYMENT_FRONTEND_VERCEL.md)

---

## ⚡ Quick Commands

```bash
# Push to GitHub
git add .
git commit -m "Deploy to production"
git push origin main

# Test build locally (frontend)
cd client
npm run build
npx serve -s build

# Test backend locally
cd backend
npm start
```

---

## 🧪 Testing After Deployment

1. Open frontend URL
2. Check browser console (F12) for errors
3. Test user registration
4. Test user login
5. Test event booking
6. Test admin panel
7. Verify payment flow

---

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| CORS errors | Update `FRONTEND_URL` in Render |
| API 404 errors | Check `REACT_APP_API_URL` includes `/api` |
| Build fails | Check build logs for errors |
| Blank page | Check browser console for errors |
| Backend slow | Free tier spins down after 15 min |

---

## 📞 Support

- **Render:** https://render.com/docs
- **Vercel:** https://vercel.com/docs
- **MongoDB Atlas:** https://www.mongodb.com/docs/atlas/
