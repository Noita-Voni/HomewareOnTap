// Dashboard JavaScript for Homeware On Tap
// Handles both buyer and admin dashboard functionality

// Mock Data for Prototype
const mockData = {
    // User Data
    users: {
        'john@email.com': {
            role: 'buyer',
            name: 'John Smith',
            email: 'john@email.com',
            phone: '+1 (555) 123-4567',
            address: '123 Main St, Anytown, ST 12345',
            joined: '2024-08-15',
            orders: 12,
            totalSpent: 450.75
        },
        'sarah@email.com': {
            role: 'buyer',
            name: 'Sarah Johnson',
            email: 'sarah@email.com',
            phone: '+1 (555) 987-6543',
            address: '456 Oak Ave, Somewhere, ST 67890',
            joined: '2024-07-22',
            orders: 8,
            totalSpent: 320.50
        },
        'admin@homewareontap.com': {
            role: 'admin',
            name: 'Store Administrator',
            email: 'admin@homewareontap.com',
            phone: '+1 (555) 000-0000',
            address: 'Homeware On Tap HQ',
            joined: '2024-01-01',
            orders: 0,
            totalSpent: 0
        }
    },

    // Orders Data
    orders: [
        {
            id: 'HOT1005',
            customerId: 'john@email.com',
            customerName: 'John Smith',
            email: 'john@email.com',
            date: '2024-09-01',
            status: 'pending',
            total: 89.00,
            items: [
                { name: 'Glass Water Bottles Set', quantity: 2, price: 29.99 },
                { name: 'Ceramic Storage Jars', quantity: 1, price: 29.02 }
            ],
            address: '123 Main St, Anytown, ST 12345'
        },
        {
            id: 'HOT1004',
            customerId: 'sarah@email.com',
            customerName: 'Sarah Johnson',
            email: 'sarah@email.com',
            date: '2024-08-30',
            status: 'shipped',
            total: 123.45,
            items: [
                { name: 'Premium Coffee Mugs Set', quantity: 1, price: 45.99 },
                { name: 'Kitchen Organization Set', quantity: 2, price: 38.73 }
            ],
            address: '456 Oak Ave, Somewhere, ST 67890',
            tracking: 'TRK123456789'
        },
        {
            id: 'HOT1003',
            customerId: 'john@email.com',
            customerName: 'John Smith',
            email: 'john@email.com',
            date: '2024-08-28',
            status: 'delivered',
            total: 67.99,
            items: [
                { name: 'Drinking Glasses Set', quantity: 1, price: 67.99 }
            ],
            address: '123 Main St, Anytown, ST 12345',
            deliveredDate: '2024-08-30'
        }
    ],

    // Products Data
    products: [
        {
            id: 'P001',
            name: 'Glass Water Bottles Set',
            category: 'Bottles',
            price: 29.99,
            stock: 5,
            status: 'low-stock',
            image: 'assets/img/pic3-glass.png',
            description: 'Set of 4 premium glass water bottles'
        },
        {
            id: 'P002',
            name: 'Ceramic Storage Jars',
            category: 'Storage',
            price: 29.02,
            stock: 15,
            status: 'in-stock',
            image: 'assets/img/pic2-jar.png',
            description: 'Beautiful ceramic jars for kitchen storage'
        },
        {
            id: 'P003',
            name: 'Premium Coffee Mugs Set',
            category: 'Mugs',
            price: 45.99,
            stock: 22,
            status: 'in-stock',
            image: 'assets/img/pic1-mug.png',
            description: 'Set of 6 premium ceramic coffee mugs'
        }
    ],

    // Notifications
    notifications: [
        {
            id: 1,
            type: 'order',
            message: 'New order #HOT1005 received',
            time: '5 minutes ago',
            read: false
        },
        {
            id: 2,
            type: 'stock',
            message: 'Glass Bottles running low (5 remaining)',
            time: '2 hours ago',
            read: false
        },
        {
            id: 3,
            type: 'customer',
            message: 'New customer registration',
            time: '1 day ago',
            read: true
        }
    ]
};

// Dashboard Initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    updateDashboardGreeting(currentUser);
    updateCurrentDate();
    
    // Load dashboard data based on user role
    if (window.location.pathname.includes('buyer-dashboard')) {
        loadBuyerDashboard(currentUser);
    } else if (window.location.pathname.includes('admin-dashboard')) {
        loadAdminDashboard();
    }
}

function updateDashboardGreeting(user) {
    const greetingElement = document.getElementById('userGreeting') || document.getElementById('adminGreeting');
    if (greetingElement) {
        const userData = mockData.users[user.email] || user;
        const greeting = getTimeBasedGreeting();
        greetingElement.textContent = `R{greeting}, R{userData.name || user.email}!`;
    }
}

function getTimeBasedGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
}

function updateCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        dateElement.textContent = new Date().toLocaleDateString('en-US', options);
    }
}

// Buyer Dashboard Functions
function loadBuyerDashboard(user) {
    loadUserOrders(user.email);
    loadUserProfile(user.email);
    loadRecommendedProducts();
}

function loadUserOrders(userEmail) {
    const userOrders = mockData.orders.filter(order => order.customerId === userEmail);
    const ordersContainer = document.querySelector('.orders-list');
    
    if (!ordersContainer) return;
    
    if (userOrders.length === 0) {
        ordersContainer.innerHTML = '<p class="no-orders">No orders found. <a href="index.html">Start shopping</a></p>';
        return;
    }

    ordersContainer.innerHTML = userOrders.map(order => `
        <div class="order-item">
            <div class="order-header">
                <div class="order-info">
                    <h4>Order R{order.id}</h4>
                    <p class="order-date">R{formatDate(order.date)}</p>
                </div>
                <div class="order-status">
                    <span class="status-badge status-R{order.status}">R{capitalizeFirst(order.status)}</span>
                </div>
            </div>
            <div class="order-details">
                <div class="order-items">
                    R{order.items.map(item => `
                        <div class="order-item-detail">
                            <span>R{item.name} (xR{item.quantity})</span>
                            <span>RR{item.price.toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-total">
                    <strong>Total: RR{order.total.toFixed(2)}</strong>
                </div>
                R{order.tracking ? `<div class="order-tracking">
                    <p>Tracking: <strong>R{order.tracking}</strong></p>
                </div>` : ''}
            </div>
        </div>
    `).join('');
}

function loadUserProfile(userEmail) {
    const userData = mockData.users[userEmail];
    if (!userData) return;

    const profileElements = {
        userName: document.getElementById('userName'),
        userEmail: document.getElementById('userEmail'),
        userPhone: document.getElementById('userPhone'),
        userAddress: document.getElementById('userAddress'),
        userJoined: document.getElementById('userJoined'),
        userOrders: document.getElementById('userOrders'),
        userSpent: document.getElementById('userSpent')
    };

    if (profileElements.userName) profileElements.userName.textContent = userData.name;
    if (profileElements.userEmail) profileElements.userEmail.textContent = userData.email;
    if (profileElements.userPhone) profileElements.userPhone.textContent = userData.phone;
    if (profileElements.userAddress) profileElements.userAddress.textContent = userData.address;
    if (profileElements.userJoined) profileElements.userJoined.textContent = formatDate(userData.joined);
    if (profileElements.userOrders) profileElements.userOrders.textContent = userData.orders;
    if (profileElements.userSpent) profileElements.userSpent.textContent = `RR{userData.totalSpent.toFixed(2)}`;
}

function loadRecommendedProducts() {
    const recommendationsContainer = document.querySelector('.recommendations-grid');
    if (!recommendationsContainer) return;

    const recommendations = mockData.products.slice(0, 3);
    
    recommendationsContainer.innerHTML = recommendations.map(product => `
        <div class="recommendation-item">
            <img src="R{product.image}" alt="R{product.name}" class="recommendation-image">
            <div class="recommendation-info">
                <h4>R{product.name}</h4>
                <p class="price">RR{product.price.toFixed(2)}</p>
                <button class="btn btn-sm btn-primary" onclick="addToCart('R{product.id}')">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Admin Dashboard Functions
function loadAdminDashboard() {
    // Admin dashboard is already loaded with static data
    // In a real application, this would fetch live data
    console.log('Admin dashboard loaded');
}

// Buyer Dashboard Actions
function showOrderDetails(orderId) {
    const order = mockData.orders.find(o => o.id === orderId);
    if (!order) return;

    alert(`Order Details for R{orderId}:\n\nStatus: R{order.status}\nTotal: RR{order.total.toFixed(2)}\nItems: R{order.items.length}\n\nThis would open a detailed view in a real application.`);
}

function reorderItems(orderId) {
    const order = mockData.orders.find(o => o.id === orderId);
    if (!order) return;

    // Simulate adding items to cart
    order.items.forEach(item => {
        addToCart(item.name, item.quantity);
    });
    
    alert(`R{order.items.length} items from order R{orderId} have been added to your cart!`);
}

function trackOrder(orderId) {
    const order = mockData.orders.find(o => o.id === orderId);
    if (!order) return;

    if (order.tracking) {
        alert(`Tracking Number: R{order.tracking}\n\nStatus: R{capitalizeFirst(order.status)}\n\nThis would open the carrier's tracking page in a real application.`);
    } else {
        alert('Tracking information not yet available for this order.');
    }
}

function editProfile() {
    alert('Profile editing would open a form in a real application.\n\nFor this prototype, profile data is stored locally.');
}

function changePassword() {
    alert('Password change would open a secure form in a real application.\n\nFor this prototype, authentication is simplified.');
}

function viewOrderHistory() {
    alert('Complete order history would be displayed in a real application.\n\nFor this prototype, only recent orders are shown.');
}

function addToCart(productId, quantity = 1) {
    // Simulate adding to cart
    console.log(`Added R{quantity} of product R{productId} to cart`);
    
    // Update cart count if element exists
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const currentCount = parseInt(cartCount.textContent) || 0;
        cartCount.textContent = currentCount + quantity;
    }
    
    // Show notification
    showNotification(`Product added to cart!`, 'success');
}

// Admin Dashboard Actions
function showProductManagement() {
    alert('Product Management Interface\n\nThis would show:\n- Product list with edit/delete options\n- Add new product form\n- Bulk operations\n- Category management\n\nFor this prototype, data is stored locally.');
}

function showOrderManagement() {
    alert('Order Management Interface\n\nThis would show:\n- Complete order list\n- Order status updates\n- Customer communication\n- Shipping management\n\nFor this prototype, data is stored locally.');
}

function showCustomerManagement() {
    alert('Customer Management Interface\n\nThis would show:\n- Customer profiles\n- Order history per customer\n- Customer communication\n- Customer analytics\n\nFor this prototype, data is stored locally.');
}

function showAddProduct() {
    alert('Add Product Form\n\nThis would open a form with:\n- Product name, description\n- Pricing and inventory\n- Images and categories\n- SEO settings\n\nFor this prototype, new products would be added to local data.');
}

function showProductList() {
    const products = mockData.products;
    const productList = products.map(p => `R{p.name} - RR{p.price} (Stock: R{p.stock})`).join('\n');
    alert(`Current Products:\n\nR{productList}\n\nThis would show an editable table in a real application.`);
}

function showInventory() {
    const lowStock = mockData.products.filter(p => p.stock < 10);
    const lowStockList = lowStock.map(p => `R{p.name}: R{p.stock} remaining`).join('\n');
    alert(`Inventory Status:\n\nR{lowStockList || 'All products are well stocked!'}\n\nThis would show detailed inventory management in a real application.`);
}

function showCategories() {
    const categories = [...new Set(mockData.products.map(p => p.category))];
    alert(`Product Categories:\n\nR{categories.join('\n')}\n\nThis would show category management with add/edit/delete options in a real application.`);
}

function showCustomers() {
    const customers = Object.values(mockData.users).filter(u => u.role === 'buyer');
    const customerList = customers.map(c => `R{c.name} (R{c.email}) - R{c.orders} orders`).join('\n');
    alert(`Customers:\n\nR{customerList}\n\nThis would show detailed customer profiles in a real application.`);
}

function showReports() {
    alert('Reports & Analytics\n\nThis would show:\n- Sales reports\n- Customer analytics\n- Product performance\n- Revenue tracking\n- Export options\n\nFor this prototype, sample data would be displayed.');
}

function showSalesReport() {
    const totalRevenue = mockData.orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = mockData.orders.length;
    const avgOrderValue = totalRevenue / totalOrders;
    
    alert(`Sales Report:\n\nTotal Revenue: RR{totalRevenue.toFixed(2)}\nTotal Orders: R{totalOrders}\nAverage Order Value: RR{avgOrderValue.toFixed(2)}\n\nThis would show detailed charts and graphs in a real application.`);
}

function showInventoryReport() {
    const totalProducts = mockData.products.length;
    const lowStockCount = mockData.products.filter(p => p.stock < 10).length;
    const totalStock = mockData.products.reduce((sum, p) => sum + p.stock, 0);
    
    alert(`Inventory Report:\n\nTotal Products: R{totalProducts}\nLow Stock Items: R{lowStockCount}\nTotal Units in Stock: R{totalStock}\n\nThis would show detailed inventory analytics in a real application.`);
}

function showCustomerReport() {
    const totalCustomers = Object.values(mockData.users).filter(u => u.role === 'buyer').length;
    const totalSpent = Object.values(mockData.users).filter(u => u.role === 'buyer').reduce((sum, u) => sum + u.totalSpent, 0);
    const avgSpentPerCustomer = totalSpent / totalCustomers;
    
    alert(`Customer Report:\n\nTotal Customers: R{totalCustomers}\nTotal Revenue from Customers: RR{totalSpent.toFixed(2)}\nAverage Spent per Customer: RR{avgSpentPerCustomer.toFixed(2)}\n\nThis would show detailed customer analytics in a real application.`);
}

function showPerformanceReport() {
    alert('Performance Report\n\nThis would show:\n- Website traffic\n- Conversion rates\n- Popular products\n- Peak shopping times\n- Performance metrics\n\nFor this prototype, sample analytics would be displayed.');
}

function showNotifications() {
    const notifications = mockData.notifications;
    const notificationList = notifications.map(n => `R{n.message} (R{n.time})`).join('\n');
    alert(`Notifications:\n\nR{notificationList}\n\nThis would show a notifications panel in a real application.`);
}

function showSystemSettings() {
    alert('System Settings\n\nThis would provide:\n- Store configuration\n- Payment settings\n- Shipping options\n- Email templates\n- Security settings\n\nFor this prototype, settings would be stored locally.');
}

function showBackup() {
    alert('Data Backup\n\nThis would provide:\n- Manual backup creation\n- Scheduled backups\n- Backup restoration\n- Data export options\n\nFor this prototype, this is demonstration only.');
}

function showLogs() {
    alert('System Logs\n\nThis would show:\n- User activity logs\n- Error logs\n- Security events\n- Performance metrics\n- Audit trails\n\nFor this prototype, this is demonstration only.');
}

// Utility Functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function showNotification(message, type = 'info') {
    // Simple notification system for prototype
    const notification = document.createElement('div');
    notification.className = `notification notification-R{type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: R{type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Export functions for use in other scripts
window.dashboardFunctions = {
    showOrderDetails,
    reorderItems,
    trackOrder,
    editProfile,
    changePassword,
    viewOrderHistory,
    addToCart,
    showProductManagement,
    showOrderManagement,
    showCustomerManagement,
    showAddProduct,
    showProductList,
    showInventory,
    showCategories,
    showCustomers,
    showReports,
    showSalesReport,
    showInventoryReport,
    showCustomerReport,
    showPerformanceReport,
    showNotifications,
    showSystemSettings,
    showBackup,
    showLogs
};
