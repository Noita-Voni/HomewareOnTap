-- Homeware On Tap Database Setup
-- Run this script in your MySQL database

-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS homeware_on_tap;
USE homeware_on_tap;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    address VARCHAR(255),
    city VARCHAR(100),
    province VARCHAR(50),
    postal_code VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP NULL
);

-- Create indexes for better performance
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_phone ON users(phone);
CREATE INDEX idx_created_at ON users(created_at);

-- Create sessions table for login sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create index for session token
CREATE INDEX idx_session_token ON user_sessions(session_token);
CREATE INDEX idx_expires_at ON user_sessions(expires_at);

-- Insert some sample data (optional - for testing)
INSERT INTO users (first_name, last_name, email, phone, password_hash, city, province) VALUES 
('John', 'Doe', 'john.doe@example.com', '+27123456789', 'R2bR10Rsample_hash_here', 'Johannesburg', 'gauteng'),
('Jane', 'Smith', 'jane.smith@example.com', '+27987654321', 'R2bR10Rsample_hash_here', 'Cape Town', 'western-cape');
