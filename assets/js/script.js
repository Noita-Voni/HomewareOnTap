// script.js - Main functionality for Homeware On Tap

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileNav();
    initEmailForm();
    initFooterYear();
    initQuickAddDemo();
    initKeyboardHandlers();
});

/**
 * Mobile Navigation Toggle
 */
function initMobileNav() {
    const mobileToggle = document.querySelector('[data-mobile-toggle]');
    const nav = document.querySelector('[data-nav]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!mobileToggle || !nav) return;

    // Toggle mobile menu
    mobileToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        mobileToggle.classList.toggle('active');
        
        // Update aria-expanded for accessibility
        const isExpanded = nav.classList.contains('active');
        mobileToggle.setAttribute('aria-expanded', isExpanded);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isExpanded ? 'hidden' : '';
    });

    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            mobileToggle.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !mobileToggle.contains(e.target)) {
            nav.classList.remove('active');
            mobileToggle.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Email Subscription Form with Validation
 */
function initEmailForm() {
    const emailForm = document.querySelector('[data-email-form]');
    const emailStatus = document.querySelector('[data-email-status]');

    if (!emailForm || !emailStatus) return;

    emailForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = emailForm.querySelector('input[name="email"]');
        const email = emailInput.value.trim();
        
        // Clear previous status
        emailStatus.textContent = '';
        emailStatus.className = 'form-status';
        
        // Validate email
        if (!email) {
            showEmailStatus('Please enter your email address.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showEmailStatus('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate subscription process
        const submitButton = emailForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Subscribing...';
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            showEmailStatus('Thanks for subscribing! Check your email for confirmation.', 'success');
            emailInput.value = '';
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 1500);
    });

    function showEmailStatus(message, type) {
        emailStatus.textContent = message;
        emailStatus.className = `form-status ${type}`;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

/**
 * Auto-update footer year
 */
function initFooterYear() {
    const yearElement = document.querySelector('[data-year]');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/**
 * Quick Add Demo Button Enhancement
 */
function initQuickAddDemo() {
    const quickAddButtons = document.querySelectorAll('[data-add]');
    
    quickAddButtons.forEach(button => {
        button.addEventListener('click', function() {
            const originalText = button.textContent;
            
            // Visual feedback
            button.textContent = 'Added!';
            button.style.backgroundColor = 'var(--color-success)';
            button.disabled = true;
            
            // Reset after animation
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = '';
                button.disabled = false;
            }, 1000);
        });
    });
}

/**
 * Keyboard Navigation Handlers
 */
function initKeyboardHandlers() {
    // Handle escape key for modals and drawers
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close mobile nav
            const nav = document.querySelector('[data-nav]');
            const mobileToggle = document.querySelector('[data-mobile-toggle]');
            
            if (nav && nav.classList.contains('active')) {
                nav.classList.remove('active');
                if (mobileToggle) {
                    mobileToggle.classList.remove('active');
                    mobileToggle.setAttribute('aria-expanded', 'false');
                }
                document.body.style.overflow = '';
            }
            
            // Close cart drawer (will be handled by cart.js)
            const cartDrawer = document.querySelector('[data-cart-drawer]');
            if (cartDrawer && cartDrawer.classList.contains('active')) {
                cartDrawer.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Utility Functions
 */

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Format number with thousands separator
function formatNumber(number) {
    return new Intl.NumberFormat('en-ZA').format(number);
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Show notification (can be extended for toast notifications)
function showNotification(message, type = 'info', duration = 3000) {
    console.log(`${type.toUpperCase()}: ${message}`);
    // TODO: Implement toast notification system if needed
}

// Local storage helpers
function getFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
    }
}

function setToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Error writing to localStorage:', error);
        return false;
    }
}

// Export functions for use in other scripts
window.HWT = {
    formatCurrency,
    formatNumber,
    debounce,
    throttle,
    showNotification,
    getFromStorage,
    setToStorage
};
