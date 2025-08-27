// models/User.js - User Model for Database Operations
const bcrypt = require('bcrypt');
const db = require('../config/database');

class User {
    constructor(userData) {
        this.id = userData.id;
        this.firstName = userData.first_name;
        this.lastName = userData.last_name;
        this.email = userData.email;
        this.phone = userData.phone;
        this.dateOfBirth = userData.date_of_birth;
        this.address = userData.address;
        this.city = userData.city;
        this.province = userData.province;
        this.postalCode = userData.postal_code;
        this.createdAt = userData.created_at;
        this.updatedAt = userData.updated_at;
        this.isActive = userData.is_active;
        this.emailVerified = userData.email_verified;
        this.lastLogin = userData.last_login;
    }

    // Create a new user
    static async create(userData) {
        const {
            firstName,
            lastName,
            email,
            phone,
            password,
            dateOfBirth,
            address,
            city,
            province,
            postalCode
        } = userData;

        // Hash password
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const sql = `
            INSERT INTO users (
                first_name, last_name, email, phone, password_hash,
                date_of_birth, address, city, province, postal_code
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [
            firstName,
            lastName,
            email,
            phone,
            passwordHash,
            dateOfBirth || null,
            address || null,
            city || null,
            province || null,
            postalCode || null
        ];

        try {
            const result = await db.query(sql, params);
            return await User.findById(result.insertId);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Email already exists');
            }
            throw error;
        }
    }

    // Find user by ID
    static async findById(id) {
        const sql = 'SELECT * FROM users WHERE id = ? AND is_active = TRUE';
        const results = await db.query(sql, [id]);
        
        if (results.length === 0) {
            return null;
        }
        
        return new User(results[0]);
    }

    // Find user by email
    static async findByEmail(email) {
        const sql = 'SELECT * FROM users WHERE email = ? AND is_active = TRUE';
        const results = await db.query(sql, [email]);
        
        if (results.length === 0) {
            return null;
        }
        
        return new User(results[0]);
    }

    // Verify password
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    // Authenticate user
    static async authenticate(email, password) {
        const sql = 'SELECT * FROM users WHERE email = ? AND is_active = TRUE';
        const results = await db.query(sql, [email]);
        
        if (results.length === 0) {
            return null;
        }

        const user = results[0];
        const isValidPassword = await User.verifyPassword(password, user.password_hash);
        
        if (!isValidPassword) {
            return null;
        }

        // Update last login
        await db.query(
            'UPDATE users SET last_login = NOW() WHERE id = ?',
            [user.id]
        );

        return new User(user);
    }

    // Update user profile
    async update(updateData) {
        const allowedFields = [
            'first_name', 'last_name', 'phone', 'date_of_birth',
            'address', 'city', 'province', 'postal_code'
        ];

        const updateFields = [];
        const values = [];

        Object.keys(updateData).forEach(key => {
            if (allowedFields.includes(key) && updateData[key] !== undefined) {
                updateFields.push(`${key} = ?`);
                values.push(updateData[key]);
            }
        });

        if (updateFields.length === 0) {
            throw new Error('No valid fields to update');
        }

        values.push(this.id);
        const sql = `UPDATE users SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = ?`;
        
        await db.query(sql, values);
        return await User.findById(this.id);
    }

    // Change password
    async changePassword(currentPassword, newPassword) {
        const sql = 'SELECT password_hash FROM users WHERE id = ?';
        const results = await db.query(sql, [this.id]);
        
        if (results.length === 0) {
            throw new Error('User not found');
        }

        const isValidPassword = await User.verifyPassword(currentPassword, results[0].password_hash);
        if (!isValidPassword) {
            throw new Error('Current password is incorrect');
        }

        const saltRounds = 12;
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
        
        await db.query(
            'UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?',
            [newPasswordHash, this.id]
        );

        return true;
    }

    // Get user's public data (without sensitive information)
    getPublicData() {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            phone: this.phone,
            dateOfBirth: this.dateOfBirth,
            address: this.address,
            city: this.city,
            province: this.province,
            postalCode: this.postalCode,
            createdAt: this.createdAt,
            emailVerified: this.emailVerified,
            lastLogin: this.lastLogin
        };
    }
}

module.exports = User;
