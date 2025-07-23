// Production-specific configurations and debugging helpers

const isDevelopment = process.env.NODE_ENV !== 'production';

const checkEnvironment = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isDevelopment) {
        console.log('🔧 Environment Check:');
        console.log('- NODE_ENV:', process.env.NODE_ENV || 'undefined');
        console.log('- Is Production:', isProduction);
        console.log('- JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Missing');
        console.log('- PORT:', process.env.PORT || 'undefined');
    }
    
    // Check required environment variables
    const requiredVars = ['JWT_SECRET'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
        if (isDevelopment) {
            console.error('❌ Missing required environment variables:', missingVars);
        }
        return false;
    }
    
    if (isDevelopment) {
        console.log('✅ All required environment variables are set');
    }
    return true;
};

const getCookieConfig = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    
    return {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction,
        domain: isProduction ? undefined : undefined
    };
};

const logCookieDebug = (req, action = 'check') => {
    if (!isDevelopment) return;
    
    console.log(`🍪 Cookie Debug (${action}):`);
    console.log('- All cookies:', Object.keys(req.cookies || {}));
    console.log('- Token cookie present:', !!req.cookies?.token);
    console.log('- Authorization header:', req.headers.authorization ? 'present' : 'missing');
    console.log('- User-Agent:', req.headers['user-agent']?.substring(0, 50));
    console.log('- Origin:', req.headers.origin || 'not set');
};

module.exports = {
    checkEnvironment,
    getCookieConfig,
    logCookieDebug
};
