/**
 * Authentication Module
 * Handles Login, Signup, and Form Validation
 */

import { showToast, setLoading } from './ui.js';
import { apiRequest } from './api.js';

// --- Form Validation ---
export function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    const isAr = document.documentElement.lang === 'ar';

    // 1. Basic Required Check
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('input-error');
            isValid = false;
        } else {
            input.classList.remove('input-error');
        }
    });

    if (!isValid) {
        showToast('fill_required_fields', 'error');
        return false;
    }

    // 2. Specific Validations
    const password = form.querySelector('input[type="password"]');
    const phoneInput = form.querySelector('input[type="tel"]');
    const confirmPass = form.querySelector('[name="confirm_password"]') || form.querySelector('input[placeholder*="تأكيد"]'); // Fallback selector

    // Phone Validation (Morocco)
    if (phoneInput) {
        const phoneVal = phoneInput.value.trim().replace(/\s/g, '');
        const phoneRegex = /^(?:(?:\+|00)212|0)[5-7]\d{8}$/; // More robust regex
        if (!phoneRegex.test(phoneVal)) {
            showToast('invalid_phone', 'error');
            phoneInput.classList.add('input-error');
            return false;
        }
    }

    // Password Length
    if (password && password.value.length < 8) {
        showToast('pass_too_short', 'error');
        password.classList.add('input-error');
        return false;
    }

    // Password Confirmation
    if (confirmPass && password && password.value !== confirmPass.value) {
        showToast('pass_mismatch', 'error');
        confirmPass.classList.add('input-error');
        return false;
    }

    return true;
}

// --- Auth Handling ---
export function initAuthForms() {
    const forms = document.querySelectorAll('form[data-auth-action]'); // Use data attributes for cleaner selection

    forms.forEach(form => {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            if (!validateForm(this)) return;

            const submitBtn = this.querySelector('button[type="submit"]');
            setLoading(submitBtn, true);

            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());

            // Determine Action and Role from URL or Form Data
            const action = this.dataset.authAction; // 'login' or 'register'
            const role = window.location.href.includes('artisan') ? 'artisan' : 'client';

            const endpoint = `/api/auth/${action}`; // e.g., /api/auth/login
            const isRegister = action === 'signup' || action === 'register';

            try {
                const payload = isRegister ? { ...data, role } : data;
                const result = await apiRequest(endpoint, 'POST', payload);

                // Success Handling
                if (result.token) localStorage.setItem('HRFA_TOKEN', result.token);
                if (result.user) localStorage.setItem('HRFA_USER', JSON.stringify(result.user.profile || result.user));

                showToast('auth_success', 'success');

                setTimeout(() => {
                    if (isRegister) {
                        // Redirect to login (or auto-login if API supported it)
                        const loginPage = window.location.href.replace('register', 'login').replace('signup', 'login');
                        window.location.href = loginPage;
                    } else {
                        // Redirect to dashboard
                        window.location.href = `${role}-dashboard.html`;
                    }
                }, 1000);

            } catch (error) {
                showToast(error.message, 'error');
            } finally {
                setLoading(submitBtn, false);
            }
        });
    });
}
