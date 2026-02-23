/**
 * Main Entry Point
 * Initializes components, auth, and global logic
 */

import { initSidebar, initPasswordToggles, initAnimations, showToast, renderArtisans } from './ui.js';
import { initAuthForms } from './auth.js';
import { apiRequest } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Load Components (Navbar/Sidebar/Footer)
    // Note: We keep loadNavbar/loadSidebar global or import them if they were modularized. 
    // Assuming components.js is still used for layout injection but logic is here.
    if (window.loadNavbar) window.loadNavbar();
    if (window.loadSidebar) window.loadSidebar();

    // 2. Initialize i18n
    const savedLang = localStorage.getItem('HRFA_LANG') || 'ar';
    if (typeof initI18n === 'function') {
        setTimeout(() => initI18n(savedLang), 50);
    }

    // 3. Initialize UI Modules
    initSidebar();
    initPasswordToggles();
    initAnimations();

    // 4. Initialize Auth Logic
    initAuthForms();

    // 5. PWA Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            const swPath = window.location.pathname.includes('/pages/') ? '../sw.js' : './sw.js';
            navigator.serviceWorker.register(swPath)
                .then(reg => console.log('SW Registered'))
                .catch(err => console.log('SW Registration Failed:', err));
        });
    }

    console.log('RayMo/Khidma Professionalized 2.0 Initialized');

    // 6. Global Search Logic (Hero Section)
    const heroSearchBtn = document.getElementById('hero-search-btn');
    if (heroSearchBtn) {
        heroSearchBtn.addEventListener('click', () => {
            const service = document.getElementById('hero-service-input')?.value.trim();
            const city = document.getElementById('hero-city-input')?.value;

            const params = new URLSearchParams();
            if (service) params.append('service', service);
            if (city) params.append('city', city);

            window.location.href = `pages/client-dashboard.html?${params.toString()}`;
        });
    }

    // 7. Dashboard Logic (if on dashboard)
    const userDisplay = document.getElementById('user-welcome-name');
    if (userDisplay) {
        const userData = JSON.parse(localStorage.getItem('HRFA_USER') || '{}');
        const lang = document.documentElement.lang || 'ar';
        const displayName = userData.full_name || userData.name || (lang === 'ar' ? 'مستخدم' : 'User');

        // Simple welcome logic, assuming i18n handles the rest via data-i18n
        // But for dynamic text:
        userDisplay.textContent = displayName;
    }

    // 8. Real-time Search (Artisan Dashboard / Search Page)
    const searchInput = document.getElementById('artisan-search');
    if (searchInput) {
        let timeout = null;
        searchInput.addEventListener('input', function () {
            clearTimeout(timeout);
            timeout = setTimeout(async () => {
                const term = this.value.toLowerCase();
                try {
                    const artisans = await apiRequest(`/api/artisans?query=${term}`);
                    renderArtisans(artisans);
                } catch (error) {
                    console.error('Search failed', error);
                }
            }, 500);
        });
    }
});
