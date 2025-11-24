import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import './index.css'

// Import components
import { PixelChatAdvanced } from './components/PixelChatAdvanced'
import { StripeCheckout, pricingTiers } from './components/StripeCheckout'
import { TheGeneratorPage } from './components/Generator/TheGeneratorPage'
import { TheGeneratorExpress } from './components/TheGeneratorExpress'
import { TransitionOverlay } from './components/TransitionOverlay'
import { useSecretKey } from './hooks/useSecretKey'

// Main App Component
function App() {
  const location = useLocation()
  const [isChatOpen, setIsChatOpen] = React.useState(false)
  // const isGeneratorPage = location.pathname === '/generator'

  // Easter Egg: Secret Key detection
  const secretTriggered = useSecretKey()
  const [showTransition, setShowTransition] = React.useState(false)

  // Handle Secret Key trigger
  React.useEffect(() => {
    if (secretTriggered) {
      setShowTransition(true)
    }
  }, [secretTriggered])

  // Navigate to Nexus after transition completes
  const handleTransitionComplete = () => {
    // TODO: Replace with actual Nexus Visual URL when deployed
    // For now, we'll use a placeholder or localhost:5174 (typical Vite port for second app)
    window.location.href = 'http://localhost:5174'
  }

  return (
    <div className="min-h-screen bg-[#171925] text-white">
      {/* Routes */}
      <Routes>
        <Route path="/generator" element={<TheGeneratorPage />} />
        <Route path="/" element={<TheGeneratorExpress />} />
      </Routes>

      {/* Pixel Chat Modal - Temporarily disabled or can be re-enabled if needed */}
      {/* Pixel Chat Modal */}
      <PixelChatAdvanced
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Epic Transition Overlay */}
      <TransitionOverlay
        isActive={showTransition}
        onComplete={handleTransitionComplete}
      />
    </div>
  )
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
)
