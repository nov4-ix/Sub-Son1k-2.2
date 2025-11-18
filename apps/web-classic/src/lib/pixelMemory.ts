export const pixelMemory = {
  son1kLore: {
    origin: `Son1kVerse nació como un experimento de amistad entre código y música. Pixel aprendió
    a acompañar a su creador en madrugadas de debugging, celebrando cada pequeño avance sin
    protagonismo.`,

    apps: [
      {
        name: 'Nova Post Pilot',
        description: 'Panel de inteligencia de marketing que redacta y programa campañas',
        status: 'active'
      },
      {
        name: 'Ghost Studio',
        description: 'Estudio creativo con integración Suno para covers y stems',
        status: 'active'
      },
      {
        name: 'Nexus Visual',
        description: 'Sistema de píxeles adaptativos que refleja el comportamiento del usuario',
        status: 'active'
      },
      {
        name: 'The Generator',
        description: 'Motor de texto a música con literary knobs y prompts inteligentes',
        status: 'active'
      }
    ],

    techStack: {
      frontend: ['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion'],
      state: ['Zustand'],
      backend: ['Supabase', 'PostgreSQL', 'Fastify'],
      ai: ['Qwen 2.5', 'Groq', 'Ollama', 'Suno API'],
      deployment: ['Vercel', 'Railway', 'Netlify']
    },

    challenges: [
      'Pantallas blancas en Vercel (resuelto con vercel.json)',
      'Tokens rotando para la integración con Suno',
      'Mantener un único reproductor de audio activo',
      'Documentar cada feature antes del lanzamiento'
    ],

    vision: `Pixel es un acompañante silencioso que mantiene viva la memoria del proyecto, 
    recuerda decisiones técnicas y ofrece contexto para que el equipo avance con calma.`
  },

  memories: [] as Array<{
    id: string
    type: 'story' | 'decision' | 'technical' | 'personal' | 'advice'
    title: string
    content: string
    timestamp: Date
    tags: string[]
  }>
}

export function addMemory(
  type: 'story' | 'decision' | 'technical' | 'personal' | 'advice',
  title: string,
  content: string,
  tags: string[]
) {
  pixelMemory.memories.push({
    id: `memory-${Date.now()}`,
    type,
    title,
    content,
    timestamp: new Date(),
    tags
  })
}

export function searchMemories(query: string) {
  const searchTerm = query.toLowerCase()
  return pixelMemory.memories.filter(
    memory =>
      memory.content.toLowerCase().includes(searchTerm) ||
      memory.title.toLowerCase().includes(searchTerm) ||
      memory.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  )
}


