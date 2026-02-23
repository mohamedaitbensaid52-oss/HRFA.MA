/**
 * UI Utilities Module
 * Handles Toasts, Modals, Loading States, and DOM Interactions
 */

// --- Toast Notifications ---
export function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast ${type} glass-morphism`; // Added glass effect class

    // Icon selection
    const iconMap = {
        'success': 'fa-check-circle',
        'error': 'fa-times-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };

    const icon = iconMap[type] || 'fa-info-circle';

    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${icon} toast-icon"></i>
            <span class="toast-message">${message}</span>
        </div>
        <div class="toast-progress"></div>
    `;

    container.appendChild(toast);

    // Animate In
    requestAnimationFrame(() => toast.classList.add('show'));

    // Auto remove
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 400); // Wait for transition
    }, 4000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

// --- Sidebar & Navigation ---
export function initSidebar() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (!menuToggle || !sidebar) return;

    const closeSidebar = () => {
        sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    };

    const openSidebar = () => {
        sidebar.classList.add('active');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.contains('active') ? closeSidebar() : openSidebar();
    });

    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeSidebar();
        }
    });
}

// --- Password Visibility ---
export function initPasswordToggles() {
    document.querySelectorAll('.password-toggle').forEach(btn => {
        btn.addEventListener('click', function () {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            } else {
                input.type = 'password';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            }
        });
    });
}

// --- Animation Observer ---
export function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                // Optional: Stop observing once animated
                // animationObserver.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(el => {
        animationObserver.observe(el);
    });
}

// --- Render Artisans ---
export function renderArtisans(artisans, containerId = 'artisan-grid-container') {
    const grid = document.getElementById(containerId) || document.querySelector('.artisan-grid');
    if (!grid) return;

    if (!artisans || artisans.length === 0) {
        const lang = document.documentElement.lang || 'ar';
        // Assuming 'translations' object is globally available or imported
        const emptyTitle = translations[lang]?.empty_search_title || (lang === 'ar' ? 'مالقينا حتى حرفي' : 'No artisans found');
        const emptyDesc = translations[lang]?.empty_search_desc || (lang === 'ar' ? 'جرب تبدل الفلاتر ولا قلب بسمية أخرى.' : 'Try adjusting your filters or search for something else.');

        grid.innerHTML = `
            <div class="empty-state" style="padding: 100px 40px; text-align: center; color: var(--color-primary);">
                <i class="fas fa-search" style="font-size: 4rem; opacity: 0.2; margin-bottom: 20px; display: block;"></i>
                <h3 style="font-size: 1.4rem; margin-bottom: 10px;">${emptyTitle}</h3>
                <p style="color: var(--color-silver); max-width: 400px; margin: 0 auto;">${emptyDesc}</p>
            </div>`;
        return;
    }

    grid.innerHTML = artisans.map(artisan => {
        const initials = artisan.full_name
            ? artisan.full_name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
            : '??';
        // Generate a consistent color based on name if not provided
        const color = artisan.color || '00D1B2';

        return `
        <div class="artisan-card fade-in" style="background: var(--color-white); border: 2px solid var(--color-primary); border-radius: 0;">
            <div class="artisan-badge" style="background: var(--color-success);">
                <i class="fas fa-check-circle"></i> MOUNTAQI (Verified)
            </div>
            <div class="artisan-header">
                <div class="artisan-info">
                    <h3 style="color: var(--color-dark);">${artisan.full_name}</h3>
                    <p class="location" style="color: var(--color-slate);">
                        <i class="fas fa-map-marker-alt"></i> ${artisan.city}
                    </p>
                    <div class="rating-keywords" style="display: flex; gap: 5px; flex-wrap: wrap; margin-top: 10px;">
                        <span class="keyword-tag" style="background: rgba(56, 161, 105, 0.1); color: var(--color-success); padding: 2px 8px; border-radius: 4px; font-size: 0.75rem;">معقول</span>
                        <span class="keyword-tag" style="background: rgba(var(--color-primary-rgb), 0.1); color: var(--color-primary); padding: 2px 8px; border-radius: 0; font-size: 0.75rem; font-weight: 800;">خدمة نقية</span>
                    </div>
                </div>
                <div class="artisan-avatar" style="background-color: #${color}; color: var(--color-bg);">
                    ${initials}
                </div>
            </div>
            <div class="card-footer" style="padding: 15px; border-top: 1px solid var(--flat-border); display: flex; gap: 10px;">
                <a href="${window.location.pathname.includes('/pages/') ? '' : 'pages/'}chat.html?id=${artisan.id}" class="btn btn-primary" style="flex: 1; padding: 10px; border-radius: 0;">
                    <i class="fas fa-comment-dots"></i> ${translations[document.documentElement.lang]?.chat_btn || 'Message'}
                </a>
                <a href="profile.html?id=${artisan.id}" class="btn btn-outline" style="flex: 1; padding: 10px; border-radius: 0; border: 2px solid var(--color-primary); color: var(--color-primary); font-weight: 800; text-align: center;">
                    ${translations[document.documentElement.lang]?.view_profile || 'Profile'}
                </a>
            </div>
        </div>
    `}).join('');

    // Update count if element exists
    const countDisplay = document.getElementById('artisan-count');
    if (countDisplay) countDisplay.textContent = artisans.length;
}

// --- Loading State ---
export function setLoading(button, isLoading) {
    if (isLoading) {
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;
        button.disabled = true;
    } else {
        button.innerHTML = button.dataset.originalText;
        button.disabled = false;
    }
}
