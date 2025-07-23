// Production-safe logging utility

const isDevelopment = process.env.NODE_ENV !== 'production';

const logger = {
    info: (message, ...args) => {
        if (isDevelopment) {
            console.log(message, ...args);
        }
    },
    
    warn: (message, ...args) => {
        if (isDevelopment) {
            console.warn(message, ...args);
        }
    },
    
    error: (message, ...args) => {
        // Keep errors in production for debugging, but make them cleaner
        if (isDevelopment) {
            console.error(message, ...args);
        } else {
            // In production, log errors to console but without stack traces for users
            console.error(`Error: ${message}`);
        }
    },
    
    debug: (message, ...args) => {
        if (isDevelopment) {
            console.log(`[DEBUG] ${message}`, ...args);
        }
    }
};

module.exports = logger;
