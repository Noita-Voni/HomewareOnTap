// cart.js - Shopping Cart Functionality for Homeware On Tap

/**
 * Shopping Cart Class
 */
class ShoppingCart {
    constructor() {
        this.storageKey = 'hot_cart_v1';
        this.items = this.loadFromStorage();
        this.init();
    }

    /**
     * Initialize cart functionality
     */
    init() {
        this.bindEvents();
        this.updateUI();
    }

    /**
     * Bind all cart-related events
     */
    bindEvents() {
        // Cart drawer controls
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-cart-open]') || e.target.closest('[data-cart-open]')) {
                this.openDrawer();
            }
            
            if (e.target.matches('[data-cart-close]') || e.target.closest('[data-cart-close]')) {
                this.closeDrawer();
            }
            
            if (e.target.matches('[data-cart-clear]')) {
                this.clear();
            }
            
            if (e.target.matches('[data-checkout-btn]')) {
                this.handleCheckout();
            }
            
            if (e.target.matches('[data-add]')) {
                this.handleQuickAdd(e.target);
            }
        });

        // Cart drawer overlay
        document.addEventListener('click', (e) => {
            if (e.target.matches('.cart-overlay')) {
                this.closeDrawer();
            }
        });

        // Quantity changes and item removal
        document.addEventListener('change', (e) => {
            if (e.target.matches('.cart-item-qty')) {
                const id = e.target.dataset.itemId;
                const qty = parseInt(e.target.value) || 1;
                this.setQty(id, qty);
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.matches('.cart-item-remove') || e.target.closest('.cart-item-remove')) {
                const button = e.target.matches('.cart-item-remove') ? e.target : e.target.closest('.cart-item-remove');
                const id = button.dataset.itemId;
                this.remove(id);
            }
        });

        // Keyboard handlers
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeDrawer();
            }
        });
    }

    /**
     * Add item to cart
     * @param {Object} item - Item object with id, name, price
     */
    add(item) {
        const existingItem = this.items.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
            existingItem.qty += 1;
        } else {
            this.items.push({
                id: item.id,
                name: item.name,
                price: item.price,
                qty: 1
            });
        }
        
        this.saveToStorage();
        this.updateUI();
        this.showAddedFeedback(item.name);
    }

    /**
     * Remove item from cart
     * @param {string|number} id - Item ID
     */
    remove(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.saveToStorage();
        this.updateUI();
    }

    /**
     * Set item quantity
     * @param {string|number} id - Item ID
     * @param {number} qty - New quantity
     */
    setQty(id, qty) {
        const item = this.items.find(cartItem => cartItem.id === id);
        
        if (item) {
            if (qty <= 0) {
                this.remove(id);
            } else {
                item.qty = qty;
                this.saveToStorage();
                this.updateUI();
            }
        }
    }

    /**
     * Get total item count
     * @returns {number}
     */
    count() {
        return this.items.reduce((total, item) => total + item.qty, 0);
    }

    /**
     * Get cart subtotal
     * @returns {number}
     */
    subtotal() {
        return this.items.reduce((total, item) => total + (item.price * item.qty), 0);
    }

    /**
     * Clear entire cart
     */
    clear() {
        if (this.items.length === 0) return;
        
        if (confirm('Are you sure you want to clear your cart?')) {
            this.items = [];
            this.saveToStorage();
            this.updateUI();
        }
    }

    /**
     * Handle quick add button clicks
     * @param {HTMLElement} button - The clicked button
     */
    handleQuickAdd(button) {
        const productCard = button.closest('[data-product]');
        
        if (!productCard) return;
        
        const item = {
            id: productCard.dataset.id,
            name: productCard.dataset.name,
            price: parseFloat(productCard.dataset.price)
        };
        
        this.add(item);
    }

    /**
     * Update all cart UI elements
     */
    updateUI() {
        this.updateBadge();
        this.updateDrawer();
    }

    /**
     * Update cart badge count
     */
    updateBadge() {
        const badges = document.querySelectorAll('[data-cart-count]');
        const count = this.count();
        
        badges.forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        });
    }

    /**
     * Update cart drawer contents
     */
    updateDrawer() {
        const cartList = document.querySelector('[data-cart-list]');
        const cartEmpty = document.querySelector('[data-cart-empty]');
        const cartSubtotal = document.querySelector('[data-cart-subtotal]');
        
        if (!cartList) return;
        
        if (this.items.length === 0) {
            cartList.style.display = 'none';
            if (cartEmpty) cartEmpty.style.display = 'block';
        } else {
            cartList.style.display = 'block';
            if (cartEmpty) cartEmpty.style.display = 'none';
            
            cartList.innerHTML = this.items.map(item => this.renderCartItem(item)).join('');
        }
        
        // Update subtotal
        if (cartSubtotal) {
            cartSubtotal.textContent = this.formatCurrency(this.subtotal());
        }
    }

    /**
     * Render individual cart item
     * @param {Object} item - Cart item
     * @returns {string} HTML string
     */
    renderCartItem(item) {
        const lineTotal = item.price * item.qty;
        
        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">R{this.escapeHtml(item.name)}</div>
                    <div class="cart-item-controls">
                        <input 
                            type="number" 
                            min="1" 
                            max="99"
                            value="R{item.qty}"
                            class="cart-item-qty"
                            data-item-id="R{item.id}"
                            aria-label="Quantity for R{this.escapeHtml(item.name)}"
                        >
                        <button 
                            class="cart-item-remove"
                            data-item-id="R{item.id}"
                            aria-label="Remove R{this.escapeHtml(item.name)} from cart"
                            title="Remove item"
                        >×</button>
                    </div>
                </div>
                <div class="cart-item-total">RR{this.formatNumber(lineTotal)}</div>
            </div>
        `;
    }

    /**
     * Open cart drawer
     */
    openDrawer() {
        const drawer = document.querySelector('[data-cart-drawer]');
        if (drawer) {
            drawer.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus management for accessibility
            const closeButton = drawer.querySelector('[data-cart-close]');
            if (closeButton) {
                closeButton.focus();
            }
        }
    }

    /**
     * Close cart drawer
     */
    closeDrawer() {
        const drawer = document.querySelector('[data-cart-drawer]');
        if (drawer) {
            drawer.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    /**
     * Show feedback when item is added
     * @param {string} itemName - Name of added item
     */
    showAddedFeedback(itemName) {
        // Simple console feedback - can be enhanced with toast notifications
        console.log(`Added "R{itemName}" to cart`);
        
        // Optional: Show a brief animation or notification
        // This could be enhanced with a toast notification system
    }

    /**
     * Load cart from localStorage
     * @returns {Array} Cart items
     */
    loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading cart from storage:', error);
            return [];
        }
    }

    /**
     * Save cart to localStorage
     */
    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.items));
        } catch (error) {
            console.error('Error saving cart to storage:', error);
        }
    }

    /**
     * Format currency value
     * @param {number} amount - Amount to format
     * @returns {string} Formatted currency
     */
    formatCurrency(amount) {
        return amount.toLocaleString('en-ZA');
    }

    /**
     * Format number with thousands separator
     * @param {number} number - Number to format
     * @returns {string} Formatted number
     */
    formatNumber(number) {
        return number.toLocaleString('en-ZA');
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Get all cart items (for checkout)
     * @returns {Array} Cart items
     */
    getItems() {
        return [...this.items];
    }

    /**
     * Get cart summary for checkout
     * @returns {Object} Cart summary
     */
    getSummary() {
        return {
            items: this.getItems(),
            count: this.count(),
            subtotal: this.subtotal(),
            isEmpty: this.items.length === 0
        };
    }
    
    /**
     * Handle checkout button click
     */
    handleCheckout() {
        // Check if cart is empty
        if (this.items.length === 0) {
            alert('Your cart is empty! Add some items before checkout.');
            return;
        }
        
        // Check if user is logged in
        const userData = localStorage.getItem('homewareUserData');
        if (!userData) {
            // User not logged in, show options
            const userChoice = confirm('You need to sign in to continue.\n\nClick OK to Sign Up (new users)\nClick Cancel to Sign In (existing users)');
            
            if (userChoice) {
                // User wants to sign up
                window.location.href = 'signup.html?return=checkout.html';
            } else {
                // User wants to sign in
                window.location.href = 'login.html?return=checkout.html';
            }
            return;
        }
        
        // User is logged in, proceed to checkout
        window.location.href = 'checkout.html';
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create global cart instance
    window.cart = new ShoppingCart();
    
    // Expose cart methods globally for potential external use
    window.HWT = window.HWT || {};
    window.HWT.cart = {
        add: (item) => window.cart.add(item),
        remove: (id) => window.cart.remove(id),
        setQty: (id, qty) => window.cart.setQty(id, qty),
        count: () => window.cart.count(),
        subtotal: () => window.cart.subtotal(),
        clear: () => window.cart.clear(),
        getItems: () => window.cart.getItems(),
        getSummary: () => window.cart.getSummary(),
        checkout: () => window.cart.handleCheckout()
    };
});
