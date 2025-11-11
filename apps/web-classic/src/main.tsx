import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'

// Import components
import { PixelChatAdvanced } from './components/PixelChatAdvanced'

// Main App Component
function App() {
  const [isChatOpen, setIsChatOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-carbon text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-magenta p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">SON1KVERS3</h1>
          <button
            onClick={() => setIsChatOpen(true)}
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
          >
            💬 Pixel AI
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Bienvenido a SON1KVERS3</h2>
          <p className="text-xl text-white/80 mb-8">
            Ecosistema artístico-tecnológico con IA
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/5 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">🎵 The Generator</h3>
              <p>Crea música con IA avanzada</p>
            </div>
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
