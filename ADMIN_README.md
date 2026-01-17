# Admin Panel - Setup Guide

## Overview
The admin panel provides comprehensive management capabilities for the ticket booking system, including event management, booking oversight, and user administration.

## Features

### 🔐 Admin Authentication
- Separate admin login system
- JWT-based authentication
- Admin privilege verification

### 📊 Dashboard
- Total events count
- Total bookings count
- Total users count
- Total revenue calculation
- Recent bookings overview

### 🎪 Event Management
- Create new events
- Edit existing events
- Delete events (with booking validation)
- View all events with availability

### 📋 Booking Management
- View all bookings
- Search bookings by user or event
- Cancel bookings
- Automatic seat restoration

### 👥 User Management
- View all registered users
- Search users by name or email
- User registration tracking

## Setup Instructions

### 1. Create Admin User

Run the admin creation script to create your first admin user:

```bash
cd backend
node createAdmin.js
```

**Default Admin Credentials:**
- Email: `admin@ticketbooking.com`
- Password: `admin123`

⚠️ **Important:** Change the password after first login!

### 2. Start the Application

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd client
npm start
```

### 3. Access Admin Panel

Navigate to: `http://localhost:3000/admin/login`

## Admin Routes

- `/admin/login` - Admin login page
- `/admin/dashboard` - Main dashboard with statistics
- `/admin/events` - Event management interface
- `/admin/bookings` - Booking management interface
- `/admin/users` - User management interface

## API Endpoints

All admin endpoints require authentication with admin privileges.

### Dashboard
- `GET /api/admin/stats` - Get dashboard statistics

### Event Management
- `POST /api/admin/events` - Create new event
- `PUT /api/admin/events/:id` - Update event
- `DELETE /api/admin/events/:id` - Delete event

### Booking Management
- `GET /api/admin/bookings` - Get all bookings
- `DELETE /api/admin/bookings/:id` - Cancel booking

### User Management
- `GET /api/admin/users` - Get all users

## Security Notes

1. Admin users are identified by the `isAdmin: true` flag in the User model
2. All admin routes are protected by the `adminAuth` middleware
3. Admin tokens are stored separately from user tokens (`adminToken` vs `token`)
4. Non-admin users cannot access admin endpoints

## Customization

### Creating Additional Admin Users

You can modify the `createAdmin.js` script or manually set `isAdmin: true` in MongoDB:

```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { isAdmin: true } }
)
```

### Changing Admin Credentials

Edit the `createAdmin.js` file before running:

```javascript
const adminData = {
  name: "Your Name",
  email: "your-email@example.com",
  password: "your-secure-password",
  isAdmin: true
};
```

## Troubleshooting

### Cannot Access Admin Panel
- Verify the user has `isAdmin: true` in the database
- Check that the admin token is valid
- Ensure backend server is running

### Admin Creation Script Fails
- Verify MongoDB connection string in `.env`
- Check that all dependencies are installed
- Ensure MongoDB is running

### Events Won't Delete
- Events with existing bookings cannot be deleted
- Cancel all bookings for that event first
- Or modify the delete logic in `adminController.js`

## Support

For issues or questions, please refer to the main project documentation.
