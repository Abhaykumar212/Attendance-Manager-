# Production Deployment Troubleshooting Guide

## Issues Fixed

### 1. Cookie Configuration
- **Problem**: Cookies weren't working properly in production due to different security requirements
- **Solution**: Updated cookie settings for production:
  - `sameSite: 'none'` for cross-origin requests in production
  - `secure: true` for HTTPS in production
  - Proper domain configuration

### 2. CORS Configuration
- **Problem**: Cross-origin requests being blocked in production
- **Solution**: Enhanced CORS settings:
  - Added specific headers: `Content-Type`, `Authorization`, `Cookie`
  - Added `exposedHeaders: ['Set-Cookie']`
  - Added all HTTP methods

### 3. Authentication Debugging
- **Problem**: Hard to debug authentication issues in production
- **Solution**: Added comprehensive logging:
  - Cookie presence debugging
  - Token payload verification
  - User lookup confirmation
  - Environment variable validation

## Environment Variables Required

Make sure these are set in your production environment (Vercel):

### Backend Environment Variables
```
NODE_ENV=production
JWT_SECRET=your_jwt_secret_here
MONGODB_URI=your_mongodb_connection_string
EMAIL=your_smtp_email
EMAIL_PASSWORD=your_smtp_password
```

### Frontend Environment Variables
```
VITE_BACKEND_URL=https://your-backend-domain.vercel.app
```

## Deployment Checklist

### Backend (Vercel)
1. ✅ Environment variables set
2. ✅ `vercel.json` configured properly
3. ✅ CORS allows your frontend domain
4. ✅ Cookie settings configured for production
5. ✅ MongoDB connection string updated

### Frontend (Vercel)
1. ✅ `VITE_BACKEND_URL` points to backend URL
2. ✅ Build process completes successfully
3. ✅ `vercel.json` configured for SPA routing

## Testing Production Issues

### 1. Check Console Logs
Open browser dev tools and look for:
- Cookie debugging messages
- CORS errors
- Authentication failures
- API call logs

### 2. Network Tab Analysis
- Check if cookies are being sent with requests
- Verify response headers include `Set-Cookie`
- Confirm all API calls use HTTPS

### 3. Backend Logs (Vercel)
Check Vercel function logs for:
- Environment variable validation
- Authentication errors
- Database connection issues

## Common Production Issues

### Issue 1: "No auth-token provided"
**Cause**: Cookies not being sent/received
**Debug**: Check cookie settings and CORS configuration
**Solution**: Ensure `sameSite: 'none'` and `secure: true` in production

### Issue 2: "CORS not allowed"
**Cause**: Frontend domain not in allowed origins
**Debug**: Check CORS origin list in backend
**Solution**: Add your frontend domain to `allowedOrigins` array

### Issue 3: "Invalid or Expired Token"
**Cause**: JWT_SECRET mismatch or missing
**Debug**: Check environment variables
**Solution**: Ensure JWT_SECRET is set in production environment

### Issue 4: "User not found"
**Cause**: Database connection or user lookup issues
**Debug**: Check MongoDB connection and user data
**Solution**: Verify database connection string and user records

## Browser Compatibility

### Third-party Cookie Blocking
Some browsers block third-party cookies by default:
- **Chrome**: Settings > Privacy > Cookies
- **Firefox**: Settings > Privacy > Cookies
- **Safari**: Most restrictive by default

### Testing in Different Browsers
1. Chrome (normal and incognito)
2. Firefox
3. Safari
4. Edge

## Additional Debugging

### Frontend Debug Console
Add this to browser console on your frontend:
```javascript
// Check if cookies work
document.cookie = "test=1; SameSite=None; Secure";
console.log('Cookie test:', document.cookie.includes('test=1'));

// Check backend connectivity
fetch('https://your-backend.vercel.app/profile', {
  credentials: 'include'
}).then(r => console.log('Backend status:', r.status));
```

### Backend Debug Route
Add a debug route to test basic functionality:
```javascript
app.get('/debug', (req, res) => {
  res.json({
    environment: process.env.NODE_ENV,
    hasJwtSecret: !!process.env.JWT_SECRET,
    cookies: Object.keys(req.cookies || {}),
    headers: req.headers
  });
});
```

## Next Steps

1. Deploy the updated code to production
2. Check browser console for debug messages
3. Test login/logout flow
4. Verify authentication persistence across page refreshes
5. Test in multiple browsers

If issues persist, check the specific error messages in console and compare with this troubleshooting guide.
