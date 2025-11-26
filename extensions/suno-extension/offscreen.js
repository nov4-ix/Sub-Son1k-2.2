// Background Worker for Neural Engine Session Maintenance
// Handles silent keep-alive pings and token refresh

// Configuration
const TARGET_ORIGIN = 'https://suno.com'; // Internal reference only
const KEEPALIVE_INTERVAL_MIN = 3 * 60 * 1000; // 3 minutes
const KEEPALIVE_INTERVAL_MAX = 7 * 60 * 1000; // 7 minutes

// Message handler
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'MAINTAIN_SESSION') {
        performSilentKeepAlive(msg.data)
            .then(result => sendResponse({ success: true, data: result }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // Async response
    }
});

async function performSilentKeepAlive(data) {
    try {
        // 1. Add human-like delay (jitter) before action
        const jitter = Math.floor(Math.random() * 2000) + 500;
        await new Promise(resolve => setTimeout(resolve, jitter));

        // 2. Perform a lightweight fetch to the target domain
        // This refreshes the session cookie without loading the full page
        // We use a specific endpoint that returns user data (lightweight)
        const response = await fetch('https://studio-api.prod.suno.com/api/client/profile', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            }
            // Credentials (cookies) are automatically included by Chrome in offscreen docs
        });

        if (!response.ok) {
            throw new Error(`Keep-alive failed: ${response.status}`);
        }

        // 3. Extract fresh token if available in response
        // (Though usually we rely on the cookie being refreshed)
        const profileData = await response.json();

        return {
            status: 'active',
            timestamp: Date.now(),
            refreshed: true
        };

    } catch (error) {
        // Silent failure - do not log specific errors to console to maintain stealth
        return {
            status: 'error',
            timestamp: Date.now(),
            refreshed: false
        };
    }
}

// Self-destruct mechanism: Close offscreen document if idle for too long
// to save resources and reduce footprint
let idleTimer;
function resetIdleTimer() {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
        window.close();
    }, 30000); // 30 seconds max life
}

resetIdleTimer();
