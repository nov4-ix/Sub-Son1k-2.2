import { NextRequest, NextResponse } from 'next/server'
import { getUnifiedTokenPool } from '@/lib/unified-token-pool'

export async function POST(req: NextRequest) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🎵 API generate-music LLAMADA')

  try {
    const body = await req.json()
    const { lyrics, prompt, voice, instrumental, knobs } = body

    console.log('📝 Request body (INVERTIDO):', {
      prompt: prompt?.substring(0, 50) + '... (LETRA EN ESPAÑOL)',
      lyrics: lyrics?.substring(0, 50) + '... (ESTILO)',
      voice,
      instrumental
    })

    if (!prompt?.trim()) {
      console.log('❌ Prompt vacío')
      return NextResponse.json({ error: 'Prompt requerido' }, { status: 400 })
    }

    // ✅ Usar Unified Token Pool (auto-rotación y auto-mantenimiento)
    const tokenPool = getUnifiedTokenPool()
    let SUNO_TOKEN: string

    try {
      SUNO_TOKEN = await tokenPool.getToken()
      console.log('🔑 Token del pool:', SUNO_TOKEN.substring(0, 20) + '...')
    } catch (error) {
      console.log('❌ No hay tokens disponibles en el pool')
      return NextResponse.json({
        error: 'No tokens available',
        message: 'Por favor agrega tokens al pool desde el dashboard'
      }, { status: 503 })
    }

    // Interpretar configuración de voz e instrumental para crear prompt completo
    const GROQ_API_KEY = process.env.GROQ_API_KEY
    let baseStyle = lyrics?.trim() || ''

    // Crear prompt interpretando solo la configuración de voz/instrumental
    let interpretedPrompt = baseStyle

    // ✅ INTERPRETAR CONFIGURACIÓN DE VOZ (se añadirá al prompt antes de traducir)
    let voiceContext = ''
    if (instrumental) {
      voiceContext = 'instrumental only'
    } else {
      if (voice === 'male') voiceContext = 'male vocals'
      else if (voice === 'female') voiceContext = 'female vocals'
      else if (voice === 'duet') voiceContext = 'male and female duet vocals'
      else if (voice === 'random') voiceContext = 'varied vocals'
    }

    // Combinar estilo base + contexto de voz
    const contextParts = []
    if (baseStyle) contextParts.push(baseStyle)
    if (voiceContext) contextParts.push(voiceContext)

    interpretedPrompt = contextParts.join(', ')

    console.log('🎤 Interpretación de configuración de voz:')
    console.log('  - Estilo base:', baseStyle)
    console.log('  - Contexto de voz:', voiceContext)
    console.log('  - Prompt interpretado:', interpretedPrompt)

    // ✅ TRADUCIR EL PROMPT A INGLÉS automáticamente (sin mostrar al usuario)
    let translatedStyle = interpretedPrompt

    if (GROQ_API_KEY && interpretedPrompt) {
      try {
        console.log('🌐 Traduciendo prompt musical a inglés...')
        console.log('📝 Original (español):', interpretedPrompt)

        const translateResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: 'llama-3.1-70b-versatile',
            messages: [{
              role: 'user',
              content: `Translate this music style description to English. Keep ALL musical terms intact (genre names, instruments, tempo, mood). ONLY return the translation separated by commas, NO explanations or labels:\n\n"${interpretedPrompt}"`
            }],
            max_tokens: 200,
            temperature: 0.3
          })
        })

        if (translateResponse.ok) {
          const translateData = await translateResponse.json()
          translatedStyle = translateData.choices[0].message.content.trim()

          // Limpiar formato
          translatedStyle = translatedStyle.replace(/\*\*[^*]+\*\*/g, '')
          translatedStyle = translatedStyle.replace(/^["\s\n:]+|["\s\n:]+$/g, '')
          translatedStyle = translatedStyle.replace(/\n+/g, ', ')
          translatedStyle = translatedStyle.trim()

          console.log('✅ Traducido a inglés:', translatedStyle)

          // ✅ LIMITAR A 180 CARACTERES
          if (translatedStyle.length > 180) {
            console.log(`⚠️ Traducción larga (${translatedStyle.length}), truncando a 180...`)
            translatedStyle = translatedStyle.substring(0, 180).replace(/,\s*$/, '')
            console.log('✅ Truncado a:', translatedStyle)
          }
        } else {
          console.log('⚠️ Error en traducción, usando estilo original')
        }
      } catch (error) {
        console.log('⚠️ Error traduciendo, usando estilo original:', error)
      }
    } else {
      console.log('⚠️ GROQ_API_KEY no configurada, usando estilo original')
    }

    // Payload FINAL: Todo concatenado en prompt con estilo al principio
    // prompt = [ESTILO] + LETRA completa
    // lyrics = vacío (no se usa)
    const finalPrompt = instrumental
      ? `[${translatedStyle}]`
      : `[${translatedStyle}]\n\n${prompt?.trim() || ""}`

    const payload = {
      prompt: finalPrompt, // [ESTILO] + LETRA concatenados
      lyrics: "", // Vacío - todo va en prompt
      title: "",
      customMode: !instrumental && prompt?.trim().length > 0,
      instrumental: instrumental,
      gender: instrumental ? "" : (voice === 'male' ? 'male' : voice === 'female' ? 'female' : '')
    }

    console.log('📤 Payload CONCATENADO (Suno API):')
    console.log('  prompt ([ESTILO] + LETRA):', payload.prompt.substring(0, 120) + '...')
    console.log('  lyrics (vacío):', payload.lyrics.length)
    console.log('  customMode:', payload.customMode)
    console.log('  instrumental:', payload.instrumental)
    console.log('  gender:', payload.gender)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(JSON.stringify(payload, null, 2))
    console.log('📡 Llamando al nuevo backend Super-Son1k-2.0...')

    // ✅ VALIDAR Y OBTENER BACKEND_URL
    const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL
    if (!BACKEND_URL) {
      console.error('❌ BACKEND_URL not configured')
      console.error('💡 TIP: Define BACKEND_URL o NEXT_PUBLIC_BACKEND_URL en .env o .env.local')
      return NextResponse.json({
        error: 'Backend URL not configured',
        message: 'Define BACKEND_URL o NEXT_PUBLIC_BACKEND_URL en las variables de entorno',
        tip: 'Ejemplo: BACKEND_URL=https://your-backend.fly.dev'
      }, { status: 500 })
    }

    console.log('✅ BACKEND_URL configurada:', BACKEND_URL)

    const response = await fetch(`${BACKEND_URL}/api/generation/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BACKEND_SECRET || 'dev-token'}`
      },
      body: JSON.stringify({
        prompt: payload.prompt,
        style: baseStyle || 'pop',
        duration: 120,
        quality: 'standard',
        custom_mode: payload.customMode,
        tags: []
      })
    })

    console.log('📊 Response Status:', response.status)
    console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()))

    // Manejar errores del nuevo backend
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No response body')
      console.log('❌ Error Response del backend:', errorText)
      throw new Error(`Backend error ${response.status}: ${errorText}`)
    }

    const responseText = await response.text()
    console.log('📦 Raw Response:', responseText)

    let data: any
    try {
      data = JSON.parse(responseText)
      console.log('📦 Parsed Response:', JSON.stringify(data, null, 2))
    } catch (parseError) {
      console.error('❌ Error parseando JSON:', parseError)
      throw new Error('Respuesta inválida del servidor Suno')
    }

    // ✅ Extraer datos del nuevo backend Super-Son1k-2.0
    // El backend devuelve: { success: true, data: { generationId, sunoId, ... } }
    const generationId = data.data?.generationId || data.generationId
    const sunoId = data.data?.sunoId || data.sunoId
    const status = data.data?.status || data.status || 'processing'

    if (!generationId) {
      console.error('❌ No generationId en respuesta')
      console.error('📦 Data completa:', JSON.stringify(data, null, 2))
      throw new Error('No se recibió generationId del backend')
    }

    console.log('✅ GenerationId extraído:', generationId)
    console.log('📊 Status:', status)
    console.log('🔍 SunoId:', sunoId || 'N/A')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    return NextResponse.json({
      trackId: sunoId || generationId, // sunoId para polling directo si backend falla
      generationId: generationId, // generationId para usar backend
      sunoId: sunoId, // ID de Suno para fallback
      status: status === 'pending' ? 'processing' : status,
      message: 'Generación iniciada exitosamente'
    })

  } catch (error: any) {
    console.error('❌ ERROR en generate-music:', error)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    return NextResponse.json({
      error: error.message || 'Error generando música',
      details: error.stack
    }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
