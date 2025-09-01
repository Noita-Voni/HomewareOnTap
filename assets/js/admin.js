// Admin-specific JavaScript for Homeware On Tap Admin Dashboard
// Handles admin-only functionality and UI interactions

// Admin Dashboard Initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminDashboard();
});

function initializeAdminDashboard() {
    // Verify admin access
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
        alert('Access denied. Admin privileges required.');
        window.location.href = 'login.html';
        return;
    }

    // Initialize admin-specific features
    setupAdminEventListeners();
    loadAdminMetrics();
    setupRealTimeUpdates();
}

function setupAdminEventListeners() {
    // Mobile menu toggle for admin
    const mobileToggle = document.querySelector('[data-mobile-toggle]');
    const nav = document.querySelector('[data-nav]');
    
    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', function() {
            nav.classList.toggle('nav-open');
            mobileToggle.classList.toggle('active');
        });
    }

    // Admin navigation clicks
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('onclick')) return; // Skip if onclick is defined
            
            e.preventDefault();
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
        });
    });

    // Quick action buttons
    setupQuickActions();
}

function setupQuickActions() {
    // Order status update buttons
    document.querySelectorAll('.order-row').forEach(row => {
        if (row.classList.contains('header')) return;
        
        row.addEventListener('click', function() {
            const orderId = this.querySelector('.order-id').textContent;
            showOrderManagementModal(orderId);
        });
    });

    // Metric cards click handlers
    document.querySelectorAll('.metric-card').forEach(card => {
        card.addEventListener('click', function() {
            const metricType = this.querySelector('h3').textContent;
            showMetricDetails(metricType);
        });
    });
}

function loadAdminMetrics() {
    // Update metrics with real-time data (simulated)
    updateRevenueMetric();
    updateOrdersMetric();
    updateCustomersMetric();
    updateProductsMetric();
}

function updateRevenueMetric() {
    const revenueElement = document.querySelector('.metric-card h3');
    if (revenueElement && revenueElement.textContent.includes('R')) {
        // Simulate real-time revenue updates
        const currentRevenue = 12450;
        const formatted = 'R' + currentRevenue.toLocaleString();
        revenueElement.textContent = formatted;
    }
}

function updateOrdersMetric() {
    const ordersMetric = document.querySelectorAll('.metric-card h3')[1];
    if (ordersMetric) {
        const currentOrders = mockData.orders.length;
        ordersMetric.textContent = currentOrders.toString();
    }
}

function updateCustomersMetric() {
    const customersMetric = document.querySelectorAll('.metric-card h3')[2];
    if (customersMetric) {
        const totalCustomers = Object.values(mockData.users).filter(u => u.role === 'buyer').length;
        customersMetric.textContent = totalCustomers.toString();
    }
}

function updateProductsMetric() {
    const productsMetric = document.querySelectorAll('.metric-card h3')[3];
    if (productsMetric) {
        const totalProducts = mockData.products.length;
        productsMetric.textContent = totalProducts.toString();
    }
}

function setupRealTimeUpdates() {
    // Simulate real-time updates every 30 seconds
    setInterval(() => {
        updateNotificationBadge();
        checkLowStockAlerts();
        updateOrderStatuses();
    }, 30000);
}

function updateNotificationBadge() {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        const unreadCount = mockData.notifications.filter(n => !n.read).length;
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'block' : 'none';
    }
}

function checkLowStockAlerts() {
    const lowStockProducts = mockData.products.filter(p => p.stock < 10);
    if (lowStockProducts.length > 0) {
        // Update alerts section
        updateStockAlerts(lowStockProducts);
    }
}

function updateStockAlerts(lowStockProducts) {
    const alertsContainer = document.querySelector('.alerts-list');
    if (!alertsContainer) return;

    // Update existing stock alert or add new one
    const existingAlert = alertsContainer.querySelector('.alert-item.warning');
    if (existingAlert) {
        const alertContent = existingAlert.querySelector('.alert-content p');
        if (alertContent) {
            const productNames = lowStockProducts.map(p => `R{p.name}: R{p.stock} units`).join(', ');
            alertContent.textContent = `Low stock items: R{productNames}`;
        }
    }
}

function updateOrderStatuses() {
    // Simulate order status changes
    const orderRows = document.querySelectorAll('.order-row:not(.header)');
    orderRows.forEach(row => {
        const statusElement = row.querySelector('.status');
        if (statusElement && Math.random() < 0.1) { // 10% chance to update
            // Simulate status progression
            updateOrderStatus(row, statusElement);
        }
    });
}

function updateOrderStatus(row, statusElement) {
    const currentStatus = statusElement.textContent.toLowerCase();
    let newStatus = currentStatus;
    
    switch (currentStatus) {
        case 'pending':
            newStatus = 'processing';
            break;
        case 'processing':
            newStatus = 'shipped';
            break;
        case 'shipped':
            newStatus = 'delivered';
            break;
    }
    
    if (newStatus !== currentStatus) {
        statusElement.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
        statusElement.className = `status status-R{newStatus}`;
        
        // Add animation
        statusElement.style.animation = 'pulse 0.5s ease-in-out';
        setTimeout(() => {
            statusElement.style.animation = '';
        }, 500);
    }
}

// Admin Modal Functions
function showOrderManagementModal(orderId) {
    const order = mockData.orders.find(o => o.id === orderId);
    if (!order) return;

    const modalContent = `
        <div class="admin-modal-overlay" onclick="closeAdminModal()">
            <div class="admin-modal" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3>Order Management - R{orderId}</h3>
                    <button onclick="closeAdminModal()" class="modal-close">&times;</button>
                </div>
                <div class="modal-content">
                    <div class="order-details-admin">
                        <div class="detail-section">
                            <h4>Customer Information</h4>
                            <p><strong>Name:</strong> R{order.customerName}</p>
                            <p><strong>Email:</strong> R{order.email}</p>
                            <p><strong>Address:</strong> R{order.address}</p>
                        </div>
                        <div class="detail-section">
                            <h4>Order Information</h4>
                            <p><strong>Date:</strong> R{formatDate(order.date)}</p>
                            <p><strong>Status:</strong> R{capitalizeFirst(order.status)}</p>
                            <p><strong>Total:</strong> RR{order.total.toFixed(2)}</p>
                        </div>
                        <div class="detail-section">
                            <h4>Items</h4>
                            R{order.items.map(item => `
                                <div class="item-row">
                                    <span>R{item.name}</span>
                                    <span>Qty: R{item.quantity}</span>
                                    <span>RR{item.price.toFixed(2)}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="detail-section">
                            <h4>Actions</h4>
                            <div class="admin-actions">
                                <button class="btn btn-primary" onclick="updateOrderStatus('R{orderId}', 'processing')">Mark Processing</button>
                                <button class="btn btn-primary" onclick="updateOrderStatus('R{orderId}', 'shipped')">Mark Shipped</button>
                                <button class="btn btn-success" onclick="updateOrderStatus('R{orderId}', 'delivered')">Mark Delivered</button>
                                <button class="btn btn-secondary" onclick="contactCustomer('R{order.email}')">Contact Customer</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalContent);
}

function closeAdminModal() {
    const modal = document.querySelector('.admin-modal-overlay');
    if (modal) {
        modal.remove();
    }
}

function updateOrderStatus(orderId, newStatus) {
    // Update order in mock data
    const order = mockData.orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        
        // Update UI
        const orderRow = document.querySelector(`[data-order-id="R{orderId}"]`) || 
                        Array.from(document.querySelectorAll('.order-row')).find(row => 
                            row.querySelector('.order-id')?.textContent === orderId
                        );
        
        if (orderRow) {
            const statusElement = orderRow.querySelector('.status');
            if (statusElement) {
                statusElement.textContent = capitalizeFirst(newStatus);
                statusElement.className = `status status-R{newStatus}`;
            }
        }
        
        showAdminNotification(`Order R{orderId} status updated to R{newStatus}`, 'success');
        closeAdminModal();
    }
}

function contactCustomer(email) {
    const subject = encodeURIComponent('Regarding your Homeware On Tap order');
    const body = encodeURIComponent('Hello,\n\nI hope this message finds you well. I am contacting you regarding your recent order.\n\nBest regards,\nHomeware On Tap Team');
    
    const mailtoLink = `mailto:R{email}?subject=R{subject}&body=R{body}`;
    window.open(mailtoLink, '_blank');
    
    showAdminNotification(`Email client opened for R{email}`, 'info');
}

function showMetricDetails(metricType) {
    let details = '';
    
    switch (metricType.toLowerCase()) {
        case 'R12,450':
        case 'total revenue':
            details = `Revenue Breakdown:\n\n- Last 7 days: R2,450\n- Last 30 days: R8,900\n- This month: R12,450\n- Growth: +12.3%\n\nTop performing products:\n1. Coffee Mugs Set - R3,200\n2. Storage Jars - R2,800\n3. Glass Bottles - R2,100`;
            break;
        case '156':
        case 'total orders':
            details = `Order Statistics:\n\n- Pending: 5 orders\n- Processing: 12 orders\n- Shipped: 23 orders\n- Delivered: 116 orders\n\nAverage order value: R79.80\nRepeat customer rate: 34%`;
            break;
        case '89':
        case 'total customers':
            details = `Customer Analytics:\n\n- New this month: 12\n- Returning customers: 67\n- Active customers: 89\n- Customer retention: 78%\n\nTop customer segments:\n1. Kitchen enthusiasts\n2. Home organizers\n3. Eco-conscious buyers`;
            break;
        case '24':
        case 'products':
            details = `Product Information:\n\n- Active products: 24\n- Categories: 6\n- Low stock: 3 items\n- Out of stock: 0 items\n\nTop performers:\n1. Coffee Mugs\n2. Storage Solutions\n3. Glassware`;
            break;
        default:
            details = 'Detailed analytics would be displayed here in a full application.';
    }
    
    alert(details);
}

function showAdminNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `admin-notification admin-notification-R{type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                R{type === 'success' ? '✓' : type === 'warning' ? '⚠' : 'ℹ'}
            </span>
            <span class="notification-message">R{message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: R{getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 6px;
        z-index: 2000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        min-width: 300px;
        font-weight: 500;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

function getNotificationColor(type) {
    switch (type) {
        case 'success': return '#4CAF50';
        case 'warning': return '#FF9800';
        case 'error': return '#F44336';
        default: return '#2196F3';
    }
}

// Advanced Admin Functions
function exportData(type) {
    let data = '';
    let filename = '';
    
    switch (type) {
        case 'orders':
            data = JSON.stringify(mockData.orders, null, 2);
            filename = 'orders_export.json';
            break;
        case 'customers':
            data = JSON.stringify(mockData.users, null, 2);
            filename = 'customers_export.json';
            break;
        case 'products':
            data = JSON.stringify(mockData.products, null, 2);
            filename = 'products_export.json';
            break;
        default:
            data = JSON.stringify(mockData, null, 2);
            filename = 'full_data_export.json';
    }
    
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showAdminNotification(`R{type} data exported successfully`, 'success');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const importedData = JSON.parse(e.target.result);
                    // In a real application, this would validate and merge data
                    console.log('Imported data:', importedData);
                    showAdminNotification('Data import completed', 'success');
                } catch (error) {
                    showAdminNotification('Invalid file format', 'error');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

function bulkUpdateProducts() {
    alert('Bulk Product Update\n\nThis would allow:\n- Price adjustments\n- Category changes\n- Stock updates\n- Status modifications\n\nFor this prototype, individual product management is simulated.');
}

function generateReport(type, period = 'month') {
    const reportData = generateReportData(type, period);
    showReportModal(type, period, reportData);
}

function generateReportData(type, period) {
    // Simulate report generation
    switch (type) {
        case 'sales':
            return {
                totalSales: 'R12,450',
                orderCount: 156,
                avgOrderValue: 'R79.80',
                growth: '+12.3%'
            };
        case 'inventory':
            return {
                totalProducts: 24,
                lowStock: 3,
                outOfStock: 0,
                totalValue: 'R8,960'
            };
        case 'customers':
            return {
                totalCustomers: 89,
                newCustomers: 12,
                retentionRate: '78%',
                avgLifetimeValue: 'R245'
            };
        default:
            return {};
    }
}

function showReportModal(type, period, data) {
    const modalContent = `
        <div class="admin-modal-overlay" onclick="closeAdminModal()">
            <div class="admin-modal report-modal" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3>R{capitalizeFirst(type)} Report - R{capitalizeFirst(period)}</h3>
                    <button onclick="closeAdminModal()" class="modal-close">&times;</button>
                </div>
                <div class="modal-content">
                    <div class="report-content">
                        R{Object.entries(data).map(([key, value]) => `
                            <div class="report-item">
                                <span class="report-label">R{key.replace(/([A-Z])/g, ' R1').replace(/^./, str => str.toUpperCase())}:</span>
                                <span class="report-value">R{value}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="report-actions">
                        <button class="btn btn-primary" onclick="exportReport('R{type}', 'R{period}')">Export Report</button>
                        <button class="btn btn-secondary" onclick="printReport()">Print Report</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalContent);
}

function exportReport(type, period) {
    showAdminNotification(`R{type} report for R{period} exported`, 'success');
    closeAdminModal();
}

function printReport() {
    window.print();
}

// CSS for admin modals and notifications
const adminStyles = `
<style>
.admin-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1500;
    display: flex;
    align-items: center;
    justify-content: center;
}

.admin-modal {
    background: white;
    border-radius: 8px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
    padding: 20px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
}

.modal-content {
    padding: 20px;
}

.order-details-admin {
    display: grid;
    gap: 20px;
}

.detail-section h4 {
    margin-bottom: 10px;
    color: #333;
    border-bottom: 1px solid #eee;
    padding-bottom: 5px;
}

.item-row {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
    border-bottom: 1px solid #f5f5f5;
}

.admin-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.admin-badge {
    background: #ff4444;
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.8em;
    margin-left: 10px;
}

.admin-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}
</style>
`;

// Inject admin styles
document.head.insertAdjacentHTML('beforeend', adminStyles);

// Export admin functions
window.adminFunctions = {
    showOrderManagementModal,
    closeAdminModal,
    updateOrderStatus,
    contactCustomer,
    showMetricDetails,
    exportData,
    importData,
    bulkUpdateProducts,
    generateReport,
    showAdminNotification
};
