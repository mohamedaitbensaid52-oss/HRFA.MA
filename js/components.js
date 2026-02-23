
function handleLogout() {
    localStorage.removeItem('HRFA_TOKEN');
    localStorage.removeItem('HRFA_USER');

    const isSubPage = window.location.pathname.includes('/pages/');
    const homeLink = isSubPage ? '../index.html' : 'index.html';

    if (typeof showToast === 'function') {
        const isAr = document.documentElement.lang === 'ar';
        showToast(isAr ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully', 'info');
    }

    setTimeout(() => {
        window.location.href = homeLink;
    }, 1000);
}

window.handleLogout = handleLogout;

function loadNavbar() {
    const placeholder = document.getElementById('navbar-placeholder');
    if (!placeholder) return;

    const isSubPage = window.location.pathname.includes('/pages/');
    const isVercel = window.location.hostname.includes('vercel.app');
    const homeLink = isVercel ? '/' : (isSubPage ? '../index.html' : 'index.html');

    placeholder.innerHTML = `
        <nav class="navbar">
            <div class="navbar-brand-group">
                <a href="${homeLink}" class="logo">HRFA.<span class="logo-accent">MA</span></a>
            </div>
            <div class="navbar-actions">
                <div class="lang-selector">
                    <button class="lang-btn" onclick="switchLanguage('ar')">العربية</button>
                    <span class="lang-divider"></span>
                    <button class="lang-btn" onclick="switchLanguage('en')">EN</button>
                </div>
            </div>
        </nav>
    `;
}

function loadBottomNav() {
    const placeholder = document.getElementById('bottom-nav-placeholder');
    if (!placeholder) return;

    const isSubPage = window.location.pathname.includes('/pages/');
    const isVercel = window.location.hostname.includes('vercel.app');
    const basePath = isSubPage ? '../' : './';
    const homeLink = isVercel ? '/' : (isSubPage ? '../index.html' : 'index.html');

    const currentPage = window.location.pathname;

    placeholder.innerHTML = `
        <div class="bottom-nav">
            <a href="${homeLink}" class="nav-item ${currentPage.endsWith('index.html') || currentPage.endsWith('/') || (isVercel && currentPage === '/') ? 'active' : ''}">
                <i class="fas fa-home"></i>
                <span data-i18n="nav_home">الرئيسية</span>
            </a>
            <a href="${basePath}pages/client-dashboard.html" class="nav-item ${currentPage.includes('client-dashboard') ? 'active' : ''}">
                <i class="fas fa-search"></i>
                <span data-i18n="nav_search_short">قلب</span>
            </a>
            <a href="${basePath}pages/request-service.html" class="nav-item ${currentPage.includes('request-service') ? 'active' : ''}">
                <i class="fas fa-plus-circle"></i>
                <span data-i18n="nav_request_short">طلب</span>
            </a>
            <a href="${basePath}pages/jobs.html" class="nav-item ${currentPage.includes('jobs.html') ? 'active' : ''}">
                <i class="fas fa-briefcase"></i>
                <span data-i18n="jobs_title">طلباتي</span>
            </a>
            <a href="${basePath}pages/profile.html" class="nav-item ${currentPage.includes('profile') ? 'active' : ''}">
                <i class="fas fa-user"></i>
                <span data-i18n="nav_profile_short">بروفيل</span>
            </a>
        </div>
    `;

    if (window.updateContent) window.updateContent();
}

function loadSidebar() {
    const placeholder = document.getElementById('sidebar-placeholder');
    if (!placeholder) return;

    const isSubPage = window.location.pathname.includes('/pages/');
    const isVercel = window.location.hostname.includes('vercel.app');
    const basePath = isSubPage ? '../' : './';
    const homeLink = isVercel ? '/' : (isSubPage ? '../index.html' : 'index.html');

    placeholder.innerHTML = `
        <div class="sidebar-overlay" id="sidebar-overlay"></div>
        <aside class="sidebar">
            <div class="sidebar-header">
                <a href="${homeLink}" class="logo">HRFA.<span class="logo-accent">MA</span></a>
                <button class="close-sidebar" id="close-sidebar" onclick="document.getElementById('menu-toggle').click()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="sidebar-content">
                <div class="sidebar-menu">
                    <a href="${homeLink}" class="sidebar-link active">
                        <i class="fas fa-home"></i>
                        <span data-i18n="nav_home">الرئيسية</span>
                    </a>
                    <a href="${basePath}pages/client-dashboard.html" class="sidebar-link">
                        <i class="fas fa-search"></i>
                        <span data-i18n="nav_search">البحث عن حرفي</span>
                    </a>
                    <a href="${basePath}pages/request-service.html" class="sidebar-link">
                        <i class="fas fa-plus-circle"></i>
                        <span data-i18n="nav_request">طلب خدمة</span>
                    </a>
                    <a href="${basePath}pages/artisan-login.html" class="sidebar-link">
                        <i class="fas fa-hard-hat"></i>
                        <span data-i18n="pioneer_badge">منطقة الحرفيين</span>
                    </a>
                    <a href="${basePath}pages/profile.html" class="sidebar-link">
                        <i class="fas fa-user-circle"></i>
                        <span data-i18n="nav_profile">حسابي</span>
                    </a>
                    <a href="javascript:void(0)" class="sidebar-link" onclick="window.handleLogout()" style="color: var(--color-accent); margin-top: 20px; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 20px;">
                        <i class="fas fa-sign-out-alt"></i>
                        <span data-i18n="nav_logout">خروج</span>
                    </a>
                </div>

                <div class="sidebar-footer">
                    <div class="lang-selector-mobile">
                        <button class="lang-btn" onclick="switchLanguage('ar')">العربية</button>
                        <span class="lang-divider">|</span>
                        <button class="lang-btn" onclick="switchLanguage('en')">English</button>
                    </div>
                </div>
            </div>
        </aside>
    `;
}

function loadFooter() {
    const placeholder = document.getElementById('footer-placeholder');
    if (!placeholder) return;

    const isSubPage = window.location.pathname.includes('/pages/');
    const isVercel = window.location.hostname.includes('vercel.app');
    const homeLink = isVercel ? '/' : (isSubPage ? '../index.html' : 'index.html');
    const basePath = isSubPage ? '../' : './';

    placeholder.innerHTML = `
        <footer class="main-footer">
            <div class="container footer-grid">
                <div class="footer-brand">
                    <a href="${homeLink}" class="logo">HRFA.<span class="logo-accent">MA</span></a>
                    <p class="footer-tagline" data-i18n="subtitle">صلة الوصل بين الخدامة والكليان فكاع مدن المغرب</p>
                </div>
                <div class="footer-links-group">
                    <div class="footer-col">
                        <h4 data-i18n="nav_main">الرئيسية</h4>
                        <a href="${homeLink}" data-i18n="nav_home">الرئيسية</a>
                        <a href="${basePath}pages/search-results.html" data-i18n="nav_search_short">قلب</a>
                        <a href="${basePath}pages/about.html" data-i18n="nav_about">من نحن</a>
                    </div>
                    <div class="footer-col">
                        <h4 data-i18n="nav_contact">اتصل بنا</h4>
                        <a href="${basePath}pages/contact.html" data-i18n="nav_contact">اتصل بنا</a>
                        <a href="${basePath}pages/404.html"><i class="fab fa-whatsapp"></i> WhatsApp</a>
                        <a href="${basePath}pages/404.html"><i class="fab fa-instagram"></i> Instagram</a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <div class="container">
                    <p data-i18n="copyright">جميع الحقوق محفوظة - hrfa.ma &copy; 2026</p>
                </div>
            </div>
        </footer>
    `;
}

function showSkeleton(containerId, type = 'card', count = 3) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let skeletonHTML = '';
    for (let i = 0; i < count; i++) {
        if (type === 'card') {
            skeletonHTML += `
                <div class="flat-card" style="height: 250px; padding: 20px; overflow: hidden; border: 2px solid var(--color-primary);">
                    <div class="skeleton" style="height: 150px; margin-bottom: 15px;"></div>
                    <div class="skeleton" style="height: 20px; width: 70%; margin-bottom: 10px;"></div>
                    <div class="skeleton" style="height: 15px; width: 40%;"></div>
                </div>
            `;
        } else if (type === 'list') {
            skeletonHTML += `
                <div style="padding: 15px; border-bottom: 2px solid var(--flat-border);">
                    <div class="skeleton" style="height: 20px; width: 80%; margin-bottom: 10px;"></div>
                    <div class="skeleton" style="height: 15px; width: 30%;"></div>
                </div>
            `;
        }
    }
    container.innerHTML = `<div class="${type === 'card' ? 'artisan-grid' : ''}">${skeletonHTML}</div>`;
}

function handleFormValidation(formId) {
    const form = document.getElementById(formId);
    if (!form) return true;

    let isValid = true;
    form.querySelectorAll('[required]').forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('input-error');
            isValid = false;
        } else {
            input.classList.remove('input-error');
        }
    });

    return isValid;
}

window.showSkeleton = showSkeleton;
window.handleFormValidation = handleFormValidation;
window.loadNavbar = loadNavbar;
window.loadSidebar = loadSidebar;
window.loadBottomNav = loadBottomNav;
window.loadFooter = loadFooter;

document.addEventListener('DOMContentLoaded', () => {

    loadNavbar();
    loadBottomNav();
    loadFooter();
});
