import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import './index.css'

// Import components
import { PixelChatAdvanced } from './components/PixelChatAdvanced'
import { StripeCheckout, pricingTiers } from './components/StripeCheckout'
import { TheGeneratorPage } from './components/Generator/TheGeneratorPage'

// Main App Component
function App() {
  const location = useLocation()
  const [isChatOpen, setIsChatOpen] = React.useState(false)
  const isGeneratorPage = location.pathname === '/generator'

  return (
    <div className="min-h-screen bg-carbon text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-magenta p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold hover:opacity-80">
            SON1KVERS3
          </Link>
          {!isGeneratorPage && (
            <div className="flex gap-4">
              <Link
                to="/generator"
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
              >
                🎵 Generator Express
              </Link>
              <button
                onClick={() => setIsChatOpen(true)}
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
              >
                💬 Pixel AI
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <Routes>
        <Route path="/generator" element={<TheGeneratorPage />} />
        <Route path="/" element={
          <main className="container mx-auto p-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4">Bienvenido a SON1KVERS3</h2>
              <p className="text-xl text-white/80 mb-8">
                Ecosistema artístico-tecnológico con IA
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <Link to="/generator" className="bg-white/5 p-6 rounded-lg hover:bg-white/10 transition-colors">
                  <h3 className="text-xl font-bold mb-2">🎵 The Generator</h3>
                  <p>Crea música con IA avanzada</p>
                </Link>
                <div className="bg-white/5 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">🎨 Ghost Studio</h3>
                  <p>Estudio de producción virtual</p>
                </div>
                <div className="bg-white/5 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">🤖 Pixel AI</h3>
                  <p>Asistente musical inteligente</p>
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
