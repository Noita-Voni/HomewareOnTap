# 🏠 Homeware On Tap - Technical Overview

## What's Happening Here?

This project implements a **complete MySQL-based authentication system** for an e-commerce homeware website. Here's what makes it special:

### 🎯 **The Problem We Solved**
- ❌ **Before:** Static HTML forms with no real user accounts
- ✅ **After:** Full user registration, login, and session management with MySQL database

### 🔧 **Technology Stack**

| Frontend | Backend | Database | Security |
|----------|---------|----------|----------|
| HTML5 | Node.js | MySQL 8.0 | JWT Tokens |
| CSS3 | Express.js | mysql2 | Bcrypt Hashing |
| Vanilla JS | RESTful API | Connection Pool | Rate Limiting |

### 📊 **Architecture Flow**

```
User Browser ←→ Frontend (HTML/CSS/JS) ←→ Backend API (Node.js) ←→ MySQL Database
```

1. **User fills form** → Frontend validates data
2. **Frontend sends request** → Backend API receives data  
3. **Backend processes** → Validates, hashes passwords, stores in MySQL
4. **Database responds** → Backend sends JWT token back
5. **Frontend stores token** → User stays logged in

### 🗄️ **Database Design**

```sql
-- Main user storage
users (id, first_name, last_name, email, password_hash, phone, address...)

-- Session management  
user_sessions (id, user_id, session_token, expires_at, ip_address...)
```

### 🔐 **Security Implementation**

| Security Layer | Implementation |
|----------------|----------------|
| **Password Protection** | Bcrypt with 12 salt rounds |
| **Authentication** | JWT tokens (24h expiration) |
| **API Protection** | Rate limiting (100 req/15min) |
| **Cross-Origin** | CORS with allowed origins |
| **SQL Injection** | Parameterized queries |
| **Headers** | Helmet.js security headers |

### 🚀 **API Endpoints Created**

```javascript
POST /api/auth/signup     // Register new user
POST /api/auth/login      // User login  
GET  /api/auth/profile    // Get user data (protected)
PUT  /api/auth/profile    // Update user data (protected)
POST /api/auth/logout     // Logout user
```

### 💻 **Frontend Integration**

**Before:** Forms did nothing
```html
<form onsubmit="alert('Thanks for signing up!')">
```

**After:** Real database integration
```javascript
// auth.js handles all authentication
fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
})
```

### 🔄 **User Experience Flow**

1. **Registration:**
   - User fills signup form
   - Data validated client & server side
   - Password hashed and stored in MySQL
   - JWT token generated and returned
   - User automatically logged in

2. **Login:**
   - User enters credentials
   - Backend verifies against MySQL
   - Password checked with bcrypt
   - JWT token issued for session
   - User dashboard available

3. **Session Management:**
   - Token stored in localStorage
   - Automatic logout on expiration
   - Profile updates persist to database
   - Secure password changes

### 📁 **File Structure**

```
homeware-on-tap/
├── Frontend Files
│   ├── signup.html         # Registration form
│   ├── login.html          # Login form  
│   ├── assets/js/auth.js   # Authentication handler
│   └── assets/css/styles.css # UI styling
│
├── Backend Files  
│   ├── server.js           # Main Express server
│   ├── routes/auth.js      # Authentication routes
│   ├── config/database.js  # MySQL connection
│   └── .env               # Database credentials
│
└── Database
    └── setup.sql          # MySQL table creation
```

### 🎨 **UI Features Added**

- ✅ Real-time form validation
- ✅ Loading states on buttons  
- ✅ Success/error messages
- ✅ Responsive design for mobile
- ✅ User greeting in navigation
- ✅ Automatic redirects after login/signup

### 🚦 **Current Status**

| Feature | Status | Notes |
|---------|--------|-------|
| User Registration | ✅ Complete | Validates & stores in MySQL |
| User Login | ✅ Complete | JWT authentication |
| Password Security | ✅ Complete | Bcrypt hashing |
| Session Management | ✅ Complete | Persistent login |
| Profile Updates | ✅ Complete | CRUD operations |
| Security Headers | ✅ Complete | Helmet.js protection |
| Rate Limiting | ✅ Complete | Prevents abuse |
| Responsive UI | ✅ Complete | Mobile-friendly |

### 🔍 **How to Test**

1. **Start the backend:** `cd backend && npm run dev`
2. **Open signup.html** in your browser
3. **Register a new account** with real data
4. **Check MySQL Workbench** - your data should appear in the `users` table
5. **Login with your credentials** - you should see a personalized welcome
6. **Check browser localStorage** - JWT token should be stored

### 🐛 **Troubleshooting Quick Check**

If registration isn't working:

1. **Backend server running?** Check `http://localhost:3001/health`
2. **Database connected?** Look for "✅ Database connected" in console
3. **Environment variables set?** Check your `.env` file
4. **MySQL server running?** Verify with MySQL Workbench
5. **CORS errors?** Check browser console for blocked requests

### 🎯 **What Makes This Special**

- **Production-Ready:** Enterprise-level security practices
- **Scalable:** Connection pooling, rate limiting, efficient queries  
- **User-Friendly:** Smooth UX with real-time feedback
- **Secure:** Multiple layers of protection
- **Maintainable:** Clean code structure and documentation

---

**🏠 The result?** A professional e-commerce authentication system that can handle real users, protect their data, and provide a smooth shopping experience - just like major online stores!
