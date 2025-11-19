import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import './index.css'

// Import components
import { PixelChatAdvanced } from './components/PixelChatAdvanced'
import { StripeCheckout, pricingTiers } from './components/StripeCheckout'
import { TheGeneratorPage } from './components/Generator/TheGeneratorPage'
import { TransitionOverlay } from './components/TransitionOverlay'
import { useSecretKey } from './hooks/useSecretKey'

// Main App Component
function App() {
  const location = useLocation()
  const [isChatOpen, setIsChatOpen] = React.useState(false)
  const isGeneratorPage = location.pathname === '/generator'

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
    <div className="min-h-screen bg-background text-foreground">
      {/* Xentric Corp Header */}
      <header className="corporate-header">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="static-logo text-xl tracking-wider">
            XENTRIC CORP
          </Link>
          {!isGeneratorPage && (
            <div className="flex gap-3">
              <Link
                to="/generator"
                className="bg-white/10 hover:bg-white/20 px-5 py-2 rounded text-white text-sm font-medium transition-all"
              >
                Generator
              </Link>
              <button
                onClick={() => setIsChatOpen(true)}
                className="bg-white/10 hover:bg-white/20 px-5 py-2 rounded text-white text-sm font-medium transition-all"
              >
                AI Assistant
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <Routes>
        <Route path="/generator" element={<TheGeneratorPage />} />
        <Route path="/" element={
          <main className="container mx-auto px-8 py-16">
            <div className="max-w-4xl mx-auto">
              {/* Hero Section */}
              <div className="text-center mb-16">
                <h1 className="text-5xl font-semibold text-foreground mb-4 tracking-tight">
                  Audio Technology Solutions
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Professional-grade AI-powered music generation and audio processing
                </p>
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <Link
                  to="/generator"
                  className="professional-card p-8 corporate-hover text-center group"
                >
                  <div className="text-4xl mb-4">🎵</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">The Generator</h3>
                  <p className="text-sm text-muted-foreground">
                    Advanced AI music generation platform
                  </p>
                </Link>

                <div className="professional-card p-8 text-center opacity-60">
                  <div className="text-4xl mb-4">🎨</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Ghost Studio</h3>
                  <p className="text-sm text-muted-foreground">
                    Professional audio workstation
                  </p>
                  <span className="text-xs text-secondary mt-2 block">Coming Soon</span>
                </div>

                <div className="professional-card p-8 text-center opacity-60">
                  <div className="text-4xl mb-4">🎬</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Video AI</h3>
                  <p className="text-sm text-muted-foreground">
                    Intelligent video generation tools
                  </p>
                  <span className="text-xs text-secondary mt-2 block">Coming Soon</span>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="bg-muted/50 rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold text-center mb-8">Enterprise Plans</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {pricingTiers.map(tier => (
                    <div key={tier.id} className="bg-card rounded-lg p-6 border border-border">
                      <h3 className="text-lg font-semibold mb-2">{tier.name}</h3>
                      <p className="text-3xl font-bold mb-4">
                        ${tier.price}<span className="text-sm text-muted-foreground">/mo</span>
                      </p>
                      <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                        <li>✓ {tier.generations} generations/month</li>
                        <li>✓ {tier.features.join(', ')}</li>
                      </ul>
                      <StripeCheckout tier={tier} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        } />
      </Routes>

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
