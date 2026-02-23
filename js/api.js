/**
 * API Request Wrapper
 * Handles token injection, error parsing, and global feedback
 */
export async function apiRequest(endpoint, method = 'GET', body = null) {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('HRFA_TOKEN');
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = { method, headers };
    
    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        if (!navigator.onLine) {
            throw new Error(document.documentElement.lang === 'ar' ? 'لا يوجد اتصال بالإنترنت' : 'No internet connection');
        }

        const response = await fetch(endpoint, options);
        
        // Handle 401 Unauthorized (Token expired)
        if (response.status === 401) {
            localStorage.removeItem('HRFA_TOKEN');
            localStorage.removeItem('HRFA_USER');
            window.location.href = '/pages/client-login.html'; // Default redirect
            throw new Error('Session expired. Please login again.');
        }

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Operation failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error; // Re-throw for UI to handle (show toast)
    }
}
