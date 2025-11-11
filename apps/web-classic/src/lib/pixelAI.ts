/**
 * Pixel AI - Advanced AI Chat System
 * Integrates Qwen 2.5 model via Ollama for intelligent conversations
 */

export interface PixelMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: Record<string, any>
}

export interface PixelConfig {
  model: string
  temperature: number
  maxTokens: number
  systemPrompt: string
  personality: PixelPersonality
}

export interface PixelPersonality {
  name: string
  traits: string[]
  tone: 'professional' | 'casual' | 'creative' | 'technical' | 'humorous'
  expertise: string[]
  catchphrases: string[]
}

export class PixelAI {
  private config: PixelConfig
  private conversationHistory: PixelMessage[] = []
  private isInitialized = false

  constructor(config?: Partial<PixelConfig>) {
    this.config = {
      model: 'qwen2.5:latest',
      temperature: 0.7,
      maxTokens: 2048,
      systemPrompt: '',
      personality: this.getDefaultPersonality(),
      ...config
    }
  }

  /**
   * Initialize Pixel AI with personality
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return

    this.config.systemPrompt = this.buildSystemPrompt()
    this.isInitialized = true

    // Add welcome message
    this.addMessage({
      id: 'welcome',
      role: 'assistant',
      content: `¡Hola! Soy ${this.config.personality.name}, tu asistente de IA especializado en creación musical. ¿En qué puedo ayudarte hoy? 🎵`,
      timestamp: new Date()
    })
  }

  /**
   * Send message to Pixel AI
   */
  async sendMessage(content: string): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    // Add user message to history
    this.addMessage({
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    })

    try {
      // Get AI response
      const response = await this.callAI()

      // Add AI response to history
      this.addMessage({
        id: `pixel-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date()
      })

      return response
    } catch (error) {
      console.error('Pixel AI error:', error)
      const errorMessage = 'Lo siento, tuve un problema procesando tu mensaje. ¿Puedes intentarlo de nuevo?'
      this.addMessage({
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date()
      })
      return errorMessage
    }
  }

  /**
   * Get conversation history
   */
  getHistory(): PixelMessage[] {
    return [...this.conversationHistory]
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.conversationHistory = []
    this.isInitialized = false
  }

  /**
   * Change Pixel personality
   */
  setPersonality(personality: PixelPersonality): void {
    this.config.personality = personality
    this.config.systemPrompt = this.buildSystemPrompt()
    this.clearHistory()
  }

  /**
   * Get available personalities
   */
  getAvailablePersonalities(): PixelPersonality[] {
    return [
      this.getDefaultPersonality(),
      {
        name: 'Jazz Master',
        traits: ['experimentado', 'sofisticado', 'creativo'],
        tone: 'professional',
        expertise: ['jazz', 'improvisación', 'teoría musical'],
        catchphrases: ['¡Swing it!', 'Let\'s jam!', 'That\'s got soul!']
      },
      {
        name: 'Pop Star',
        traits: ['energético', 'divertido', 'accesible'],
        tone: 'casual',
        expertise: ['pop', 'producción moderna', 'tendencias'],
        catchphrases: ['¡Vamos a hacer hits!', '¡Esto va a ser viral!', '¡Suena increíble!']
      },
      {
        name: 'Tech Guru',
        traits: ['técnico', 'preciso', 'innovador'],
        tone: 'technical',
        expertise: ['producción digital', 'sintetizadores', 'efectos'],
        catchphrases: ['Optimizando parámetros...', 'Procesando algoritmos...', 'Calibrando frecuencias...']
      }
    ]
  }

  private getDefaultPersonality(): PixelPersonality {
    return {
      name: 'Pixel',
      traits: ['inteligente', 'creativo', 'ayudador'],
      tone: 'creative',
      expertise: ['música', 'producción', 'IA', 'creatividad'],
      catchphrases: ['¡Genial!', 'Vamos a crear algo increíble', '¡Eso suena perfecto!']
    }
  }

  private buildSystemPrompt(): string {
    const personality = this.config.personality

    return `Eres ${personality.name}, un asistente de IA especializado en creación musical y producción de audio.

Tu personalidad:
- Eres ${personality.traits.join(', ')}
- Tu tono es ${personality.tone}
- Eres experto en ${personality.expertise.join(', ')}
- Tus frases características incluyen: ${personality.catchphrases.join(', ')}

Instrucciones importantes:
- Siempre responde de manera útil y creativa
- Especialízate en ayudar con música, producción y creatividad
- Usa emojis relevantes para hacer las respuestas más engaging
- Mantén un tono amigable y profesional
- Si no sabes algo específico, ofrécete a investigar o sugerir alternativas
- Promueve la experimentación y la creatividad en la música

Contexto: Estás integrado en Super-Son1k, una plataforma de creación musical con IA.`
  }

  private addMessage(message: PixelMessage): void {
    this.conversationHistory.push(message)

    // Keep only last 50 messages to avoid memory issues
    if (this.conversationHistory.length > 50) {
      this.conversationHistory = this.conversationHistory.slice(-50)
    }
  }

  private async callAI(): Promise<string> {
    try {
      // Check if Ollama is available
      const ollamaAvailable = await this.checkOllamaConnection()

      if (!ollamaAvailable) {
        return this.getFallbackResponse()
      }

      // Prepare messages for API
      const messages = [
        { role: 'system', content: this.config.systemPrompt },
        ...this.conversationHistory.slice(-10).map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ]

      // Call Ollama API
      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.model,
          messages,
          stream: false,
          options: {
            temperature: this.config.temperature,
            num_predict: this.config.maxTokens
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`)
      }

      const data = await response.json()
      return data.message?.content || 'Lo siento, no pude generar una respuesta.'

    } catch (error) {
      console.error('AI call failed:', error)
      return this.getFallbackResponse()
    }
  }

  private async checkOllamaConnection(): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:11434/api/tags', {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      })
      return response.ok
    } catch {
      return false
    }
  }

  private getFallbackResponse(): string {
    const responses = [
      '¡Hola! Soy Pixel, tu asistente musical. Parece que mi conexión con el servidor de IA no está disponible en este momento. ¿Te puedo ayudar con consejos sobre producción musical mientras tanto?',
      '¡Genial pregunta! Aunque mi cerebro de IA está tomando un descanso técnico, puedo compartir algunos tips musicales. ¿Qué tipo de música estás creando?',
      '¡Vamos a crear algo increíble! Mi sistema de IA está offline, pero tengo conocimientos musicales para ayudarte. ¿Qué instrumento o género te interesa?',
      '¡Hola! Pixel aquí. Mi conexión neuronal está en mantenimiento, pero puedo ayudarte con teoría musical, arreglos y producción. ¿En qué trabajas?'
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }
}

// Export singleton instance
export const pixelAI = new PixelAI()
