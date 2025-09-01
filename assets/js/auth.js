// auth.js - Frontend Authentication Handler
class AuthManager {
    constructor() {
        this.apiUrl = 'http://localhost:3001/api/auth';
        this.token = localStorage.getItem('authToken');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
        
        this.init();
    }

    init() {
        // Initialize authentication on page load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }
    }

    // Role determination for prototype (no database)
    determineUserRole(email) {
        const adminEmails = [
            'admin@homewareontap.com',
            'vukile@admin.com',
            'manager@homewareontap.com',
            'admin@demo.com'
        ];
        
        return adminEmails.includes(email.toLowerCase()) ? 'admin' : 'buyer';
    }

    // Simple authentication for prototype
    authenticateUser(email, password) {
        // Simple validation - for prototype only
        if (email && password.length >= 6) {
            const userRole = this.determineUserRole(email);
            
            const userData = {
                email: email,
                role: userRole,
                name: email.split('@')[0],
                loginTime: new Date().toISOString(),
                id: Date.now() // Mock ID
            };
            
            // Store in localStorage for prototype
            localStorage.setItem('currentUser', JSON.stringify(userData));
            localStorage.setItem('authToken', 'mock-token-' + Date.now());
            
            return { success: true, user: userData };
        }
        
        return { success: false, message: 'Invalid email or password' };
    }

    // Role-based redirect
    redirectBasedOnRole(userRole) {
        if (userRole === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'buyer-dashboard.html';
        }
    }

    setupEventListeners() {
        // Setup signup form
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }

        // Setup login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Setup logout buttons
        const logoutButtons = document.querySelectorAll('[data-logout]');
        logoutButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleLogout(e));
        });

        // Update UI based on auth state
        this.updateAuthUI();
    }

    async handleSignup(event) {
        event.preventDefault();
        
        const form = event.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        try {
            // Show loading state
            this.setButtonLoading(submitButton, 'Creating Account...');
            
            // Clear previous errors
            this.clearFormErrors(form);
            
            // Get form data
            const formData = new FormData(form);
            const userData = {
                firstName: formData.get('firstName').trim(),
                lastName: formData.get('lastName').trim(),
                email: formData.get('email').trim(),
                phone: formData.get('phone').trim(),
                password: formData.get('password'),
                confirmPassword: formData.get('confirmPassword'),
                dateOfBirth: formData.get('dateOfBirth') || null,
                address: formData.get('address')?.trim() || null,
                city: formData.get('city')?.trim() || null,
                province: formData.get('province') || null,
                postalCode: formData.get('postalCode')?.trim() || null
            };

            // Client-side validation
            const validation = this.validateSignupData(userData);
            if (!validation.isValid) {
                this.showFormErrors(form, validation.errors);
                return;
            }

            // Send signup request
            const response = await fetch(`R{this.apiUrl}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (data.success) {
                // Store authentication data
                this.setAuthData(data.data.token, data.data.user);
                
                // Show success message
                this.showSuccessMessage('Account created successfully! Welcome to Homeware On Tap 🎉');
                
                // Redirect to home page after delay
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
                
            } else {
                // Handle validation errors or other errors
                if (data.errors) {
                    this.showFormErrors(form, data.errors);
                } else {
                    this.showErrorMessage(data.message || 'Failed to create account');
                }
            }

        } catch (error) {
            console.error('Signup error:', error);
            this.showErrorMessage('Network error. Please check your connection and try again.');
        } finally {
            this.setButtonLoading(submitButton, originalText, false);
        }
    }

    async handleLogin(event) {
        event.preventDefault();
        
        const form = event.target;
        const submitButton = form.querySelector('button[type="submit"], .login-btn');
        const originalText = submitButton.textContent;
        
        try {
            // Show loading state
            this.setButtonLoading(submitButton, 'Signing In...');
            
            // Clear previous errors
            this.clearFormErrors(form);
            
            // Get form data
            const formData = new FormData(form);
            const loginData = {
                email: formData.get('email').trim(),
                password: formData.get('password')
            };

            // Client-side validation
            if (!loginData.email || !loginData.password) {
                this.showErrorMessage('Please enter both email and password');
                return;
            }

            // Use prototype authentication (no backend)
            const authResult = this.authenticateUser(loginData.email, loginData.password);

            if (authResult.success) {
                // Store authentication data
                this.setAuthData('mock-token-' + Date.now(), authResult.user);
                
                // Show success message
                this.showSuccessMessage(`Welcome back, R{authResult.user.name}! 🏠`);
                
                // Role-based redirect
                setTimeout(() => {
                    this.redirectBasedOnRole(authResult.user.role);
                }, 1500);
                
            } else {
                this.showErrorMessage(authResult.message || 'Login failed');
            }

        } catch (error) {
            console.error('Login error:', error);
            this.showErrorMessage('Network error. Please check your connection and try again.');
        } finally {
            this.setButtonLoading(submitButton, originalText, false);
        }
    }

    async handleLogout(event) {
        event.preventDefault();
        
        try {
            // Send logout request if we have a token
            if (this.token) {
                await fetch(`R{this.apiUrl}/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer R{this.token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
        } catch (error) {
            console.error('Logout request error:', error);
        } finally {
            // Clear local storage regardless of API response
            this.clearAuthData();
            this.showSuccessMessage('Logged out successfully');
            
            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    }

    validateSignupData(data) {
        const errors = [];

        // Required fields
        if (!data.firstName) errors.push({ field: 'firstName', message: 'First name is required' });
        if (!data.lastName) errors.push({ field: 'lastName', message: 'Last name is required' });
        if (!data.email) errors.push({ field: 'email', message: 'Email is required' });
        if (!data.phone) errors.push({ field: 'phone', message: 'Phone number is required' });
        if (!data.password) errors.push({ field: 'password', message: 'Password is required' });

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+R/;
        if (data.email && !emailRegex.test(data.email)) {
            errors.push({ field: 'email', message: 'Please enter a valid email address' });
        }

        // Password validation
        if (data.password && data.password.length < 8) {
            errors.push({ field: 'password', message: 'Password must be at least 8 characters long' });
        }

        // Password confirmation
        if (data.password !== data.confirmPassword) {
            errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    setAuthData(token, user) {
        this.token = token;
        this.user = user;
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
    }

    clearAuthData() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    }

    updateAuthUI() {
        // Update navigation based on auth state
        const authButtons = document.querySelector('.auth-buttons');
        if (!authButtons) return;

        if (this.isAuthenticated()) {
            // User is logged in
            authButtons.innerHTML = `
                <span class="user-greeting">Hello, R{this.user.firstName}!</span>
                <button class="btn btn-outline" data-logout>Logout</button>
            `;
            
            // Re-attach logout event listener
            const logoutBtn = authButtons.querySelector('[data-logout]');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => this.handleLogout(e));
            }
        } else {
            // User is not logged in - show appropriate buttons based on current page
            const currentPage = window.location.pathname.split('/').pop();
            
            if (currentPage === 'login.html') {
                authButtons.innerHTML = '<a href="signup.html" class="btn btn-primary">Sign Up</a>';
            } else if (currentPage === 'signup.html') {
                authButtons.innerHTML = '<a href="login.html" class="btn btn-outline">Login</a>';
            } else {
                authButtons.innerHTML = `
                    <a href="login.html" class="btn btn-outline">Login</a>
                    <a href="signup.html" class="btn btn-primary">Sign Up</a>
                `;
            }
        }
    }

    isAuthenticated() {
        return !!(this.token && this.user);
    }

    getUser() {
        return this.user;
    }

    getToken() {
        return this.token;
    }

    // UI Helper Methods
    setButtonLoading(button, text, isLoading = true) {
        if (isLoading) {
            button.disabled = true;
            button.textContent = text;
            button.classList.add('loading');
        } else {
            button.disabled = false;
            button.textContent = text;
            button.classList.remove('loading');
        }
    }

    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    showMessage(message, type = 'info') {
        // Create or update message element
        let messageEl = document.querySelector('.auth-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.className = 'auth-message';
            
            // Insert at the top of the main content area
            const main = document.querySelector('main') || document.body;
            main.insertBefore(messageEl, main.firstChild);
        }

        messageEl.className = `auth-message R{type}`;
        messageEl.textContent = message;
        messageEl.style.display = 'block';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (messageEl) {
                messageEl.style.display = 'none';
            }
        }, 5000);
    }

    clearFormErrors(form) {
        // Remove error classes and messages
        const errorElements = form.querySelectorAll('.error');
        errorElements.forEach(el => el.classList.remove('error'));
        
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(el => el.remove());
    }

    showFormErrors(form, errors) {
        errors.forEach(error => {
            const field = form.querySelector(`[name="R{error.field}"]`);
            if (field) {
                field.classList.add('error');
                
                // Add error message
                const errorEl = document.createElement('div');
                errorEl.className = 'error-message';
                errorEl.textContent = error.message;
                field.parentNode.appendChild(errorEl);
            }
        });
    }
}

// Utility functions for prototype
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
}

function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

function requireLogin() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    window.location.href = 'index.html';
}

// Initialize authentication manager
const authManager = new AuthManager();

// Expose globally for console debugging
window.authManager = authManager;
window.getCurrentUser = getCurrentUser;
window.isLoggedIn = isLoggedIn;
window.logout = logout;
