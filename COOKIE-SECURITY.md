# Cookie Security Implementation Guide

## Overview

This document outlines the comprehensive cookie security measures implemented in the Taco Empleos application. Our implementation follows security best practices and OWASP guidelines to protect user data and prevent common web vulnerabilities.

## Security Features Implemented

### 1. Cookie Prefixes
- **`__Host-` prefix**: Used in production for session and CSRF tokens
  - Requires `secure=true`, `path=/`, and no `domain` attribute
  - Provides maximum security guarantees from the browser
- **`__Secure-` prefix**: Alternative for high-security cookies
  - Requires `secure=true` but allows domain specification

### 2. Enhanced Cookie Configuration
- **HttpOnly**: Prevents XSS attacks by blocking client-side access
- **Secure**: Ensures cookies only transmitted over HTTPS
- **SameSite=strict**: Prevents CSRF attacks for sensitive cookies
- **Path restriction**: Limits cookie scope to necessary paths
- **Domain control**: Configurable domain restrictions

### 3. Security Headers
Comprehensive security headers implemented in middleware:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `Cross-Origin-Embedder-Policy: require-corp`
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Resource-Policy: same-site`
- `Content-Security-Policy` with strict rules

## Configuration

### Environment Variables
```bash
# Force secure cookies even in development
FORCE_SECURE_COOKIES=true

# Cookie domain restriction (optional)
COOKIE_DOMAIN=.yourdomain.com

# Strict SameSite for all cookies
STRICT_SAME_SITE=true

# Required secrets (change in production!)
JWT_SECRET=your-secure-random-secret
CSRF_SECRET=your-secure-csrf-secret
```

### Cookie Types and Security Levels

#### Session Cookies
- **Name**: `session-token` (dev) / `__Host-session-token` (prod)
- **Security Level**: HIGHEST
- **Expiry**: 7 days
- **Features**: HttpOnly, Secure, SameSite=strict

#### CSRF Tokens
- **Name**: `csrf-token` (dev) / `__Host-csrf-token` (prod)
- **Security Level**: HIGHEST
- **Expiry**: 1 hour
- **Features**: HttpOnly, Secure, SameSite=strict

## Security Utilities

### Cookie Security Module (`lib/security/cookie-security.js`)
Provides centralized cookie security configuration:

```javascript
import { getSecureCookieConfig, COOKIE_SECURITY_LEVELS } from '@/lib/security/cookie-security'

// Get secure configuration for a cookie
const cookieOptions = getSecureCookieConfig(
  cookieName,
  COOKIE_SECURITY_LEVELS.HIGHEST,
  { maxAge: 3600 }
)
```

### Security Audit (`lib/security/cookie-audit.js`)
Development utilities for cookie security validation:
- Runtime security checks
- Configuration validation
- Security recommendations
- Compliance reporting

## Security Levels

### HIGHEST (Session & CSRF tokens)
- `__Host-` prefix in production
- `secure=true`
- `sameSite=strict`
- `httpOnly=true`
- `path=/`
- No domain attribute

### HIGH (Secure user preferences)
- `__Secure-` prefix in production
- `secure=true`
- `sameSite=strict`
- `httpOnly=true`
- Domain configurable

### MEDIUM (Application preferences)
- `secure=true` in production
- `sameSite=strict`
- `httpOnly=true`
- Domain configurable

### BASIC (Analytics, non-sensitive)
- `secure=true` in production
- `sameSite=lax`
- Domain configurable

## Compliance & Standards

### OWASP Alignment
Our implementation addresses OWASP Top 10 vulnerabilities:
- **A01 Broken Access Control**: Secure session management
- **A02 Cryptographic Failures**: Proper cookie encryption/signing
- **A03 Injection**: Protected against cookie injection
- **A04 Insecure Design**: Security-by-design cookie architecture
- **A05 Security Misconfiguration**: Comprehensive security headers
- **A07 Authentication Failures**: Secure session handling

### Browser Security Features
- **Cookie prefixes**: Leverages browser-level security guarantees
- **SameSite**: Modern CSRF protection
- **Secure flag**: HTTPS-only transmission
- **HttpOnly**: XSS protection

## Testing & Validation

### Development Testing
1. **Build verification**: `npm run build`
2. **Security headers**: Check browser DevTools
3. **Cookie attributes**: Inspect Application tab
4. **HTTPS testing**: Use `FORCE_SECURE_COOKIES=true`

### Production Checklist
- [ ] Environment secrets configured
- [ ] Cookie prefixes enabled
- [ ] HTTPS enforced
- [ ] Security headers active
- [ ] CSP policy tested
- [ ] CSRF protection working

## Security Recommendations

### Immediate Actions
1. Change default JWT and CSRF secrets
2. Configure proper domain restrictions
3. Test with HTTPS in development
4. Enable security audit logging

### Ongoing Monitoring
1. Regular security header verification
2. Cookie audit reports
3. CSRF token validation monitoring
4. Session security metrics

### Advanced Security
1. Consider Certificate Transparency monitoring
2. Implement Subresource Integrity (SRI)
3. Add Public Key Pinning (with caution)
4. Monitor for cookie-related vulnerabilities

## Troubleshooting

### Common Issues
1. **Cookies not set**: Check `secure` flag and HTTPS
2. **Prefix requirements**: Verify `__Host-` requirements
3. **Cross-origin requests**: Review SameSite settings
4. **Development testing**: Use `FORCE_SECURE_COOKIES`

### Debug Commands
```bash
# Check security headers
curl -I https://yourdomain.com

# Validate cookie configuration
npm run audit:security  # (if implemented)

# Test HTTPS in development
FORCE_SECURE_COOKIES=true npm run dev
```

## References

- [OWASP Cookie Security](https://owasp.org/www-community/controls/SecureCookieAttribute)
- [MDN Cookie Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#security)
- [RFC 6265bis Cookie Prefixes](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis)
- [SameSite Cookie Explained](https://web.dev/samesite-cookies-explained/)

---

**Note**: This implementation prioritizes security while maintaining functionality. Regular security reviews and updates are recommended as standards evolve.