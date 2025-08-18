import DOMPurify from 'dompurify'
import validator from 'validator'

// Create a DOMPurify instance for server-side use
const createDOMPurify = () => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined' && window.document) {
    return DOMPurify
  }
  
  // Server-side: use jsdom for DOMPurify
  try {
    const { JSDOM } = require('jsdom')
    const dom = new JSDOM('')
    return DOMPurify(dom.window)
  } catch (error) {
    // Fallback: if jsdom is not available, return a simple text sanitizer
    return {
      sanitize: (input, options) => {
        if (!input || typeof input !== 'string') return ''
        // Simple HTML tag removal
        return input.replace(/<[^>]*>/g, '')
      }
    }
  }
}

// Sanitize text input to prevent XSS
export function sanitizeText(input) {
  if (!input || typeof input !== 'string') {
    return ''
  }

  // Trim whitespace
  let sanitized = input.trim()

  // Remove any HTML tags and scripts
  const purify = createDOMPurify()
  sanitized = purify.sanitize(sanitized, { 
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [] // No attributes allowed
  })

  // Additional XSS pattern removal
  const xssPatterns = [
    /javascript:/gi,
    /vbscript:/gi,
    /onload=/gi,
    /onerror=/gi,
    /onclick=/gi,
    /onmouseover=/gi,
    /onfocus=/gi,
    /onblur=/gi,
    /onchange=/gi,
    /onsubmit=/gi,
    /<script[\s\S]*?<\/script>/gi,
    /<iframe[\s\S]*?<\/iframe>/gi,
    /<object[\s\S]*?<\/object>/gi,
    /<embed[\s\S]*?>/gi,
    /<link[\s\S]*?>/gi,
    /<style[\s\S]*?<\/style>/gi
  ]

  xssPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '')
  })

  return sanitized
}

// Sanitize email input
export function sanitizeEmail(email) {
  if (!email || typeof email !== 'string') {
    return ''
  }

  const sanitized = sanitizeText(email).toLowerCase()
  
  // Validate email format
  if (!validator.isEmail(sanitized)) {
    return ''
  }

  return sanitized
}

// Sanitize and validate city name
export function sanitizeCity(city) {
  if (!city || typeof city !== 'string') {
    return ''
  }

  let sanitized = sanitizeText(city)

  // Allow only letters, spaces, hyphens, and accented characters
  sanitized = sanitized.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-]/g, '')

  // Limit length
  if (sanitized.length > 100) {
    sanitized = sanitized.substring(0, 100)
  }

  return sanitized
}

// Sanitize company name
export function sanitizeCompanyName(name) {
  if (!name || typeof name !== 'string') {
    return ''
  }

  let sanitized = sanitizeText(name)

  // Allow letters, numbers, spaces, common business characters
  sanitized = sanitized.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\-\.\&\,]/g, '')

  // Limit length
  if (sanitized.length > 150) {
    sanitized = sanitized.substring(0, 150)
  }

  return sanitized
}

// Sanitize role/position name
export function sanitizeRole(role) {
  if (!role || typeof role !== 'string') {
    return ''
  }

  let sanitized = sanitizeText(role)

  // Allow letters, spaces, hyphens, and slashes for roles like "Mesero/a"
  sanitized = sanitized.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-\/]/g, '')

  // Limit length
  if (sanitized.length > 100) {
    sanitized = sanitized.substring(0, 100)
  }

  return sanitized
}

// Sanitize general text fields (needs, descriptions, etc.)
export function sanitizeGeneralText(text) {
  if (!text || typeof text !== 'string') {
    return ''
  }

  let sanitized = sanitizeText(text)

  // Limit length for general text
  if (sanitized.length > 500) {
    sanitized = sanitized.substring(0, 500)
  }

  return sanitized
}

// Validate input against common XSS patterns
export function hasXSSPattern(input) {
  if (!input || typeof input !== 'string') {
    return false
  }

  const xssPatterns = [
    /<script/i,
    /<\/script>/i,
    /javascript:/i,
    /vbscript:/i,
    /onload=/i,
    /onerror=/i,
    /onclick=/i,
    /onmouseover=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<link/i,
    /<style/i,
    /expression\(/i,
    /url\(/i,
    /import/i
  ]

  return xssPatterns.some(pattern => pattern.test(input))
}

// Sanitize error messages for safe display
export function sanitizeErrorMessage(message) {
  if (!message || typeof message !== 'string') {
    return 'An error occurred'
  }

  // Remove any potential HTML/script content from error messages
  let sanitized = sanitizeText(message)

  // Limit length
  if (sanitized.length > 200) {
    sanitized = sanitized.substring(0, 200) + '...'
  }

  return sanitized
}

// Comprehensive form data sanitization
export function sanitizeFormData(data) {
  const sanitized = {}

  if (data.email) {
    sanitized.email = sanitizeEmail(data.email)
  }

  if (data.city) {
    sanitized.city = sanitizeCity(data.city)
  }

  if (data.companyName) {
    sanitized.companyName = sanitizeCompanyName(data.companyName)
  }

  if (data.role) {
    sanitized.role = sanitizeRole(data.role)
  }

  if (data.needs) {
    sanitized.needs = sanitizeGeneralText(data.needs)
  }

  if (data.audience) {
    // Audience should only be 'employer' or 'candidate'
    sanitized.audience = ['employer', 'candidate'].includes(data.audience) ? data.audience : ''
  }

  if (typeof data.consent === 'boolean') {
    sanitized.consent = data.consent
  }

  return sanitized
}