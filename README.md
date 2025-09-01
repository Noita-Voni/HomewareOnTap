# 🏠 Homeware On Tap

A modern, professional e-commerce website for premium homeware products, featuring a complete user authentication system, responsive design, and curated product catalog.

![Homeware On Tap](assets/img/logo2.png)

## 🌟 Features

### 🔐 Complete Authentication System
- **User Registration & Login**: Secure signup/signin with form validation
- **MySQL Database Integration**: Full user management with sessions
- **Password Security**: bcrypt hashing and JWT token authentication
- **Session Management**: Persistent login state with localStorage
- **Input Validation**: Server-side validation with express-validator
- **Rate Limiting**: Protection against brute force attacks

### 🎨 Modern Design & User Experience
- **Full-Screen Hero Video**: Immersive homepage with overlay text
- **Responsive Design**: Mobile-first approach with CSS Grid/Flexbox
- **Professional Icons**: Clean SVG icons throughout (no emojis)
- **Smooth Animations**: CSS transitions and hover effects
- **Custom Color Scheme**: Earth-tone palette with CSS custom properties

### 🛍️ Product Management
- **Curated Product Catalog**: 6 premium homeware categories
- **Real Product Images**: High-quality product photography
- **Interactive Cart System**: Add to cart functionality with badge counter
- **Product Filtering**: Filter by category (Kitchen, Dining, Storage, Cookware)
- **Product Details**: Comprehensive product information and pricing

### 📱 Navigation & Pages
- **Multi-Page Architecture**: 
  - Homepage with hero section and product showcase
  - Dedicated Products page with filtering
  - About Us page with company story and team
  - Why Choose Us page with comparisons and testimonials
  - Login/Signup pages with authentication
- **Consistent Navigation**: Professional header across all pages
- **Breadcrumb Navigation**: Clear page hierarchy
- **Mobile-Responsive Menu**: Hamburger menu for mobile devices

## 🛠️ Technology Stack

### Frontend
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Custom properties, Grid, Flexbox, animations
- **Vanilla JavaScript**: Authentication, cart management, form validation
- **SVG Icons**: Professional iconography throughout

### Backend
- **Node.js**: Server runtime environment
- **Express.js**: Web application framework
- **MySQL**: Relational database for user data
- **bcrypt**: Password hashing library
- **jsonwebtoken**: JWT authentication
- **express-validator**: Input validation middleware
- **express-rate-limit**: Rate limiting middleware
- **cors**: Cross-origin resource sharing

### Database Schema
```sql
-- Users table with comprehensive user information
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address_line1 VARCHAR(100),
    address_line2 VARCHAR(100),
    city VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Session management for secure authentication
CREATE TABLE user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 📂 Project Structure

```
homeware-on-tap/
├── assets/
│   ├── css/
│   │   └── styles.css          # Main stylesheet with CSS variables
│   ├── js/
│   │   ├── script.js           # Main JavaScript functionality
│   │   ├── cart.js             # Shopping cart management
│   │   └── auth.js             # Authentication handling
│   ├── img/                    # Product images and branding
│   └── fonts/                  # Custom fonts
├── backend/
│   ├── server.js               # Express server setup
│   ├── config/
│   │   └── database.js         # MySQL connection configuration
│   ├── models/
│   │   └── User.js             # User model with bcrypt methods
│   └── routes/
│       └── auth.js             # Authentication API routes
├── database/
│   └── setup.sql               # Database schema and setup
├── index.html                  # Homepage with hero video
├── products.html               # Products catalog with filtering
├── about.html                  # Company information and team
├── why.html                    # Value proposition and testimonials
├── login.html                  # User authentication
├── signup.html                 # User registration
├── checkout.html               # Shopping cart and checkout
└── README.md                   # Project documentation
```

## 🚀 Setup Instructions

### 1. Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- Git

### 2. Clone Repository
```bash
git clone https://github.com/Noita-Voni/HomewareOnTap.git
cd HomewareOnTap/homeware-on-tap
```

### 3. Database Setup
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE homeware_on_tap;
USE homeware_on_tap;
SOURCE database/setup.sql;
```

### 4. Backend Configuration
```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=homeware_on_tap
JWT_SECRET=your_jwt_secret_key
PORT=3000
EOF
```

### 5. Start Development Server
```bash
# Start backend server
cd backend
npm start

# Serve frontend (using Live Server or similar)
# Open index.html in browser
```

## 🎯 Key Features Implemented

### Authentication Flow
1. **User Registration**: Complete signup form with validation
2. **Secure Login**: Password verification with JWT tokens
3. **Session Persistence**: Automatic login state management
4. **Protected Routes**: Middleware for authenticated endpoints
5. **Logout Functionality**: Clean session termination

### Product Catalog
- **6 Product Categories**: Kitchen tools, dining sets, storage solutions
- **Professional Photography**: High-quality product images
- **Dynamic Filtering**: JavaScript-powered category filtering
- **Responsive Grid**: CSS Grid layout for all screen sizes
- **Cart Integration**: Add to cart with visual feedback

### Design System
- **CSS Custom Properties**: Consistent color and spacing variables
- **Professional Typography**: Clean, readable font hierarchy
- **SVG Icon Library**: Scalable, professional iconography
- **Responsive Breakpoints**: Mobile, tablet, desktop optimization
- **Accessibility Features**: ARIA labels, semantic HTML

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Token verification

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## 🎨 Design Highlights

### Color Palette
- **Primary**: `#8B4513` (Saddle Brown)
- **Secondary**: `#D2B48C` (Tan)
- **Accent**: `#CD853F` (Peru)
- **Success**: `#228B22` (Forest Green)
- **Background**: `#FEFEFE` (White)

### Typography
- **Font Family**: System font stack for optimal performance
- **Font Sizes**: Responsive scaling with rem units
- **Line Heights**: Optimized for readability

### Iconography
- **SVG Icons**: Professional, scalable vector graphics
- **Consistent Style**: Stroke-based icons throughout
- **Accessible**: Proper ARIA labels and descriptions

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Features
- **Mobile-First**: Progressive enhancement approach
- **Flexible Grid**: CSS Grid with responsive columns
- **Touch-Friendly**: Adequate touch targets (44px+)
- **Performance Optimized**: Efficient CSS and JavaScript

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Server-side validation
- **SQL Injection Protection**: Parameterized queries
- **Rate Limiting**: Brute force attack prevention
- **CORS Configuration**: Proper cross-origin setup

## 🚀 Performance Optimizations

- **CSS Custom Properties**: Efficient styling
- **Vanilla JavaScript**: No framework overhead
- **Optimized Images**: Compressed product photos
- **Minimal Dependencies**: Lean backend packages
- **Responsive Images**: Proper sizing for devices

## 📝 Recent Updates

### Version 2.0 (September 2025)
- ✅ Complete navigation system with dedicated pages
- ✅ Professional SVG icons replacing all emojis
- ✅ Full-screen hero video background
- ✅ Real product images for all 6 categories
- ✅ Comprehensive About and Why pages
- ✅ Mobile-responsive design improvements

### Version 1.0 (Initial Release)
- ✅ MySQL authentication system
- ✅ Product catalog with cart functionality
- ✅ Responsive design foundation
- ✅ Basic navigation structure

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Founder & Developer**: Vukile
- **Design**: Professional UI/UX implementation
- **Backend**: Node.js/Express/MySQL architecture

## 🌐 Live Demo

[View Live Site](https://noita-voni.github.io/HomewareOnTap/) (GitHub Pages)

## 📞 Contact

- **Email**: hello@homewareontap.com
- **GitHub**: [@Noita-Voni](https://github.com/Noita-Voni)
- **Repository**: [HomewareOnTap](https://github.com/Noita-Voni/HomewareOnTap)

---

*Built with ❤️ for modern homeware enthusiasts*