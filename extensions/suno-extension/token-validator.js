// Token validation utility for Chrome Extension
// Validates tokens before sending to pool

class TokenValidator {
  constructor() {
    this.validationCache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5 minutes
  }

  async validateToken(token, apiUrl = null) {
    // Check cache first
    const cached = this.validationCache.get(token)
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.valid
    }

    try {
      // Use provided API URL or default
      const url = apiUrl || 'https://ai.imgkits.com/suno'
      
      // Simple validation: check if token format is valid
      if (!token || typeof token !== 'string' || token.length < 20) {
        this.cacheResult(token, false)
        return false
      }

      // Try to validate with a lightweight API call
      const response = await fetch(`${url}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt: 'test',
          duration: 30
        }),
        // Use HEAD or OPTIONS for lighter validation
        signal: AbortSignal.timeout(5000) // 5 second timeout
      })

      const isValid = response.status !== 401 && response.status !== 403
      this.cacheResult(token, isValid)
      return isValid

    } catch (error) {
      console.warn('Token validation error:', error)
      // On error, assume valid (let backend handle it)
      this.cacheResult(token, true)
      return true
    }
  }

  cacheResult(token, valid) {
    this.validationCache.set(token, {
      valid,
      timestamp: Date.now()
    })

    // Clean old cache entries
    if (this.validationCache.size > 100) {
      const now = Date.now()
      for (const [key, value] of this.validationCache.entries()) {
        if (now - value.timestamp > this.cacheTimeout) {
          this.validationCache.delete(key)
        }
      }
    }
  }

  clearCache() {
    this.validationCache.clear()
  }

  async validateBatch(tokens) {
    const results = await Promise.all(
      tokens.map(token => this.validateToken(token))
    )
    return results
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TokenValidator
} else {
  window.TokenValidator = TokenValidator
}

