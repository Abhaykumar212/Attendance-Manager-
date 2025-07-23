// Frontend production debugging helpers

export const debugProdIssues = () => {
    console.log('🔧 Frontend Debug Info:');
    console.log('- Environment:', import.meta.env.MODE);
    console.log('- Backend URL:', import.meta.env.VITE_BACKEND_URL);
    console.log('- Protocol:', window.location.protocol);
    console.log('- Host:', window.location.host);
    console.log('- User-Agent:', navigator.userAgent.substring(0, 100));
    
    // Check if cookies are enabled
    document.cookie = "test=1; SameSite=None; Secure";
    const cookieEnabled = document.cookie.indexOf("test=1") !== -1;
    console.log('- Cookies enabled:', cookieEnabled);
    
    // Clean up test cookie
    document.cookie = "test=1; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

export const logApiCall = (url, method, data) => {
    console.log(`📡 API Call: ${method} ${url}`);
    if (data) {
        console.log('- Data:', data);
    }
    console.log('- Timestamp:', new Date().toISOString());
};

export const logApiResponse = (url, status, data) => {
    console.log(`📥 API Response: ${status} ${url}`);
    console.log('- Data:', data);
    console.log('- Timestamp:', new Date().toISOString());
};

export const checkCors = async (backendUrl) => {
    try {
        console.log('🌐 CORS Check...');
        const response = await fetch(`${backendUrl}/profile`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('- CORS Response Status:', response.status);
        console.log('- CORS Response Headers:', Object.fromEntries(response.headers.entries()));
        return response.ok;
    } catch (error) {
        console.error('- CORS Error:', error.message);
        return false;
    }
};
