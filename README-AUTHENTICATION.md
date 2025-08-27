# Homeware On Tap - MySQL Authentication Setup

This guide will help you set up MySQL database authentication for your Homeware On Tap website.

## Prerequisites

1. **MySQL Server** - Make sure you have MySQL installed and running
2. **Node.js** - Version 14 or higher
3. **npm** - Comes with Node.js

## Step 1: Database Setup

1. **Create the database and tables:**
   ```sql
   -- Connect to your MySQL server and run the setup script
   mysql -u your_username -p < database/setup.sql
   ```
   
   Or manually run the SQL commands from `database/setup.sql` in your MySQL client.

2. **Update database credentials:**
   - Copy `backend/.env.example` to `backend/.env`
   - Update the database connection details:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=homeware_on_tap
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   ```

## Step 2: Backend Server Setup

1. **Navigate to the backend directory:**
   ```powershell
   cd backend
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Start the server:**
   ```powershell
   # For development with auto-restart
   npm run dev
   
   # Or for production
   npm start
   ```

   The server will start on `http://localhost:3001`

## Step 3: Frontend Setup

Your frontend is already configured! The authentication script (`assets/js/auth.js`) will automatically handle:

- User registration (signup)
- User login
- Session management
- Logout functionality
- UI updates based on authentication state

## Step 4: Testing

1. **Start your backend server** (Step 2 above)

2. **Serve your frontend** - You can use any local server:
   ```powershell
   # Using Python (if installed)
   python -m http.server 8000
   
   # Or using Node.js live-server (if installed globally)
   npx live-server
   
   # Or just open the HTML files directly in your browser
   ```

3. **Test the registration flow:**
   - Open `signup.html`
   - Fill out the form and submit
   - Check if user is created in the database
   - Verify redirection to home page

4. **Test the login flow:**
   - Open `login.html`
   - Use the credentials you just created
   - Verify successful login and redirection

## Database Structure

The setup creates the following tables:

### `users` table:
- `id` - Primary key
- `first_name`, `last_name` - User names
- `email` - Unique email address
- `phone` - Phone number
- `password_hash` - Encrypted password
- `date_of_birth` - Optional birth date
- `address`, `city`, `province`, `postal_code` - Address information
- `created_at`, `updated_at` - Timestamps
- `is_active` - Account status
- `email_verified` - Email verification status
- `last_login` - Last login timestamp

### `user_sessions` table:
- Session management for login tokens
- Automatic cleanup of expired sessions

## API Endpoints

Your backend provides these endpoints:

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (requires authentication)
- `PUT /api/auth/profile` - Update user profile (requires authentication)
- `POST /api/auth/change-password` - Change password (requires authentication)
- `POST /api/auth/logout` - Logout user

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting to prevent abuse
- Input validation and sanitization
- CORS protection
- Helmet security headers

## Troubleshooting

### Common Issues:

1. **Database connection failed:**
   - Check your MySQL server is running
   - Verify credentials in `.env` file
   - Ensure database `homeware_on_tap` exists

2. **CORS errors:**
   - Make sure your frontend is served from an allowed origin
   - Check the `corsOptions` in `server.js`

3. **Authentication not working:**
   - Check browser console for JavaScript errors
   - Verify the backend server is running on port 3001
   - Check network tab for API request/response details

4. **"Email already exists" error:**
   - This is normal if you're trying to register with an email that's already in the database
   - Try a different email or use the login form instead

### Development Tips:

1. **Check server logs** for detailed error messages
2. **Use browser developer tools** to inspect network requests
3. **Check database directly** to verify data is being stored
4. **Test API endpoints** using tools like Postman or curl

## Next Steps

Once authentication is working, you can:

1. **Add password reset functionality**
2. **Implement email verification**
3. **Add user profile management pages**
4. **Integrate authentication with shopping cart**
5. **Add admin panel for user management**

## File Structure

```
homeware-on-tap/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── auth.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── database/
│   └── setup.sql
├── assets/
│   └── js/
│       └── auth.js
├── signup.html
├── login.html
└── index.html
```
