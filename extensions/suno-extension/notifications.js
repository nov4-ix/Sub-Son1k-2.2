// Notification system for Chrome Extension
// Provides better user feedback

class NotificationManager {
  constructor() {
    this.notificationContainer = null
    this.createContainer()
  }

  createContainer() {
    // Create notification container if it doesn't exist
    if (!document.getElementById('notification-container')) {
      const container = document.createElement('div')
      container.id = 'notification-container'
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
      `
      document.body.appendChild(container)
      this.notificationContainer = container
    } else {
      this.notificationContainer = document.getElementById('notification-container')
    }
  }

  show(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div')
    notification.style.cssText = `
      background: ${this.getBackgroundColor(type)};
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      min-width: 250px;
      max-width: 400px;
      pointer-events: auto;
      animation: slideIn 0.3s ease-out;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      font-weight: 500;
    `

    // Add icon
    const icon = document.createElement('span')
    icon.textContent = this.getIcon(type)
    icon.style.fontSize = '18px'
    notification.appendChild(icon)

    // Add message
    const messageText = document.createElement('span')
    messageText.textContent = message
    notification.appendChild(messageText)

    // Add close button
    const closeBtn = document.createElement('button')
    closeBtn.textContent = '×'
    closeBtn.style.cssText = `
      margin-left: auto;
      background: transparent;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    `
    closeBtn.onclick = () => this.remove(notification)
    notification.appendChild(closeBtn)

    this.notificationContainer.appendChild(notification)

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.remove(notification)
      }, duration)
    }

    return notification
  }

  remove(notification) {
    if (notification && notification.parentNode) {
      notification.style.animation = 'slideOut 0.3s ease-out'
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 300)
    }
  }

  getBackgroundColor(type) {
    const colors = {
      success: '#00FFE7',
      error: '#ff4444',
      warning: '#ffaa00',
      info: '#00bfff'
    }
    return colors[type] || colors.info
  }

  getIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    }
    return icons[type] || icons.info
  }

  success(message, duration) {
    return this.show(message, 'success', duration)
  }

  error(message, duration) {
    return this.show(message, 'error', duration || 5000)
  }

  warning(message, duration) {
    return this.show(message, 'warning', duration)
  }

  info(message, duration) {
    return this.show(message, 'info', duration)
  }
}

// Add CSS animations
if (!document.getElementById('notification-styles')) {
  const style = document.createElement('style')
  style.id = 'notification-styles'
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `
  document.head.appendChild(style)
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NotificationManager
} else {
  window.NotificationManager = NotificationManager
}

