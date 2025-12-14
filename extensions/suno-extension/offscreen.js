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
        // 1. Add human-like delay (jitter)
        const jitter = Math.floor(Math.random() * 2000) + 500;
        await new Promise(resolve => setTimeout(resolve, jitter));

        console.log('👻 Ghost Protocol: Spawning shadow iframe...');

        // 2. Create a shadow iframe
        // This loads the actual site in the background
        // The content-engine.js script will automatically run inside this iframe,
        // intercept the token, and send it to background.js
        return new Promise((resolve) => {
            const iframe = document.createElement('iframe');
            iframe.src = 'https://suno.com/create'; // Page that forces auth check
            iframe.style.display = 'none';

            // Set a timeout to kill it
            const timeout = setTimeout(() => {
                if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
                resolve({ status: 'timeout', refreshed: false });
            }, 20000);

            iframe.onload = () => {
                console.log('👻 Ghost Protocol: Shadow iframe loaded');
                // Give it a moment to run scripts then clean up
                setTimeout(() => {
                    if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
                    clearTimeout(timeout);
                    resolve({ status: 'success', refreshed: true });
                }, 5000);
            };

            iframe.onerror = () => {
                resolve({ status: 'error', refreshed: false });
            };

            document.body.appendChild(iframe);
        });

    } catch (error) {
        return {
            status: 'error',
            error: error.message,
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
