/**
 * Notification System Module
 * Handles storage and display of system notifications and alerts.
 */

const STORAGE_KEY = 'HRFA_NOTIFICATIONS';

/**
 * Add a new notification to storage and show a toast
 * @param {string} title - The notification title
 * @param {string} body - The notification message
 * @param {string} type - 'info', 'success', 'warning', 'error'
 * @param {Object} meta - Additional data (e.g., chat link)
 */
export function addNotification(title, body, type = 'info', meta = null) {
    const notifications = getNotifications();
    const newNotif = {
        id: Date.now(),
        title,
        body,
        type,
        meta,
        read: false,
        timestamp: new Date().toISOString()
    };

    notifications.unshift(newNotif);
    // Keep only last 20 notifications
    if (notifications.length > 20) notifications.pop();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));

    // Trigger Toast (UI feedback)
    // We import showToast dynamically or assume it's available globally via ui.js/main.js
    if (typeof window.showToast === 'function') {
        window.showToast(`${title}: ${body}`, type);
    }

    // Update bell badge if it exists
    updateNotifBadge();
}

/**
 * Get all notifications from storage
 * @returns {Array} List of notifications
 */
export function getNotifications() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

/**
 * Mark all notifications as read
 */
export function markAllAsRead() {
    const notifications = getNotifications();
    notifications.forEach(n => n.read = true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    updateNotifBadge();
}

/**
 * Update the unread count badge on the notification bell
 */
export function updateNotifBadge() {
    const notifications = getNotifications();
    const unreadCount = notifications.filter(n => !n.read).length;
    const badge = document.getElementById('notif-badge');

    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

/**
 * Toggle the notification dropdown UI
 */
export function toggleNotifDropdown() {
    const dropdown = document.getElementById('notif-dropdown');
    if (!dropdown) return;

    const isOpen = dropdown.classList.contains('active');

    if (!isOpen) {
        renderNotifications();
        dropdown.classList.add('active');
        // Close on outside click
        const closeHandler = (e) => {
            if (!dropdown.contains(e.target) && !e.target.closest('#notif-bell-btn')) {
                dropdown.classList.remove('active');
                document.removeEventListener('click', closeHandler);
            }
        };
        setTimeout(() => document.addEventListener('click', closeHandler), 10);
    } else {
        dropdown.classList.remove('active');
    }
}

/**
 * Render notification items into the dropdown
 */
function renderNotifications() {
    const container = document.getElementById('notif-items');
    if (!container) return;

    const notifications = getNotifications();
    const lang = document.documentElement.lang || 'ar';
    const isAr = lang === 'ar';

    if (notifications.length === 0) {
        const emptyMsg = translations[lang]?.empty_notif || (isAr ? 'ماعندك حتى تنبيه دابا' : 'No notifications yet');
        container.innerHTML = `
            <div class="empty-notif" style="padding: 40px; text-align: center; color: var(--color-silver);">
                <i class="fas fa-bell-slash" style="font-size: 2rem; display: block; margin-bottom: 10px; opacity: 0.3;"></i>
                <p>${emptyMsg}</p>
            </div>
        `;
        return;
    }

    container.innerHTML = notifications.map(n => `
        <div class="notif-item ${n.read ? '' : 'unread'}" onclick="handleNotifClick(${n.id})">
            <div class="notif-icon ${n.type}">
                <i class="fas ${getIcon(n.type)}"></i>
            </div>
            <div class="notif-content">
                <div class="notif-title">${n.title}</div>
                <div class="notif-body">${n.body}</div>
                <div class="notif-time">${formatTime(n.timestamp)}</div>
            </div>
        </div>
    `).join('');
}

function getIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-times-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || 'fa-bell';
}

function formatTime(isoString) {
    const lang = document.documentElement.lang || 'ar';
    const date = new Date(isoString);
    const now = new Date();
    const diff = (now - date) / 1000; // seconds

    if (lang === 'ar') {
        if (diff < 60) return 'الآن';
        if (diff < 3600) return `قبل ${Math.floor(diff / 60)} د`;
        if (diff < 86400) return `قبل ${Math.floor(diff / 3600)} س`;
    } else {
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    }
    return date.toLocaleDateString(lang);
}

// Global exposure for event handlers
window.handleNotifClick = (id) => {
    const notifications = getNotifications();
    const notif = notifications.find(n => n.id === id);
    if (notif) {
        notif.read = true;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));

        if (notif.meta && notif.meta.url) {
            window.location.href = notif.meta.url;
        } else {
            updateNotifBadge();
            renderNotifications();
        }
    }
};

window.addNotification = addNotification;
window.toggleNotifDropdown = toggleNotifDropdown;
window.markAllAsRead = markAllAsRead;

// Initialize badge on load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(updateNotifBadge, 500);
});
