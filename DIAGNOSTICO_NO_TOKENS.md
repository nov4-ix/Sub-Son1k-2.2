# 🔴 DIAGNÓSTICO: NO_TOKENS_AVAILABLE

## Estado Actual
- ✅ Extensión instalada (íconos corregidos)
- ❌ Tokens NO llegan al backend
- ❌ Error: `NO_TOKENS_AVAILABLE`

---

## 🔍 DIAGNÓSTICO RÁPIDO

### PASO 1: Verificar estado del backend

Ejecuta en terminal:
```bash
curl https://sub-son1k-2-2.fly.dev/api/tokens/pool/status
```

**Resultado esperado:**
```json
{
  "success": true,
  "data": {
    "totalTokens": 4,  // ← Debería ser mayor si funcionara
    "activeTokens": 4,
    "healthyTokens": 4
  }
}
```

Si `totalTokens` es 4 o menos, la extensión NO está enviando tokens.

---

### PASO 2: Verificar configuración de la extensión

1. Abre `chrome://extensions/`
2. Busca "Son1kVerse AI Music Engine"
3. Haz clic en **"Service worker"** (abrirá consola de DevTools)
4. En la consola, pega:

```javascript
chrome.storage.local.get(['backendUrl', 'generatorUrl'], (result) => {
  console.log('📊 Configuración actual:');
  console.log('Backend URL:', result.backendUrl || 'https://sub-son1k-2-2.fly.dev (default)');
  console.log('Generator URL:', result.generatorUrl || 'https://web-classic.vercel.app (default)');
});
```

**Resultado esperado:**
```
Backend URL: https://sub-son1k-2-2.fly.dev (default)
Generator URL: https://web-classic.vercel.app (default)
```

---

### PASO 3: Verificar si hay sesión en Suno

La extensión solo puede capturar tokens si tienes sesión activa en Suno.

1. Abre en otra pestaña: **https://suno.com**
2. Si no has iniciado sesión, **inicia sesión**
3. Verifica que puedes ver tu dashboard (no solo la landing page)

---

### PASO 4: Forzar extracción manual de token

Con sesión activa en Suno y la consola del Service Worker abierta, ejecuta:

```javascript
chrome.runtime.sendMessage({
  type: 'EXTRACT_AND_SEND_TO_POOL',
  label: 'manual-diagnostic'
}, (response) => {
  console.log('📊 Resultado completo:', response);
  
  if (response && response.success) {
    console.log('✅ ¡Token enviado exitosamente!');
    if (response.data) {
      console.log('📄 Detalles:', response.data);
    }
  } else {
    console.error('❌ Error al enviar token:', response);
  }
});
```

**Resultados posibles:**

#### ✅ ÉXITO:
```javascript
{
  success: true,
  data: {
    extracted: { token: "...", ... },
    pool: { success: true, results: [...] }
  }
}
```

#### ❌ ERROR - Sin sesión en Suno:
```javascript
{
  success: false,
  error: "Not on target site" // o similar
}
```
**Solución:** Abre Suno e inicia sesión.

#### ❌ ERROR - No se pudo extraer:
```javascript
{
  success: false,
  error: "Failed to extract token from cookies"
}
```
**Posibles causas:**
- No tienes sesión activa en Suno
- La pestaña de Suno no está abierta
- Las cookies no son accesibles

---

### PASO 5: Verificar permisos de la extensión

En `chrome://extensions/`, verifica que la extensión tenga estos permisos:

✅ Debe tener:
- Leer y modificar todos tus datos en los sitios web que visitas
- Ver tu historial de navegación
- Leer las cookies

Si falta alguno, la extensión no está correctamente configurada.

---

### PASO 6: Verificar logs del Service Worker

Con la consola del Service Worker abierta:

1. Busca errores en rojo
2. Busca mensajes de la extensión (deberían empezar con emojis: 📤, ✅, ⚠️, ❌)

**Logs esperados cuando funciona:**
```
📤 Sending token to pools...
   Generator: https://web-classic.vercel.app
   Backend: https://sub-son1k-2-2.fly.dev
✅ Token sent to Backend pool: {...}
```

**Problemas comunes:**
```
⚠️ Backend pool API error: 404
```
→ URL incorrecta

```
⚠️ Error sending to Backend pool: CORS error
```
→ Problema de CORS (ya debería estar solucionado)

---

## 🛠️ SOLUCIONES SEGÚN DIAGNÓSTICO

### Si no tienes sesión en Suno:
1. Abre https://suno.com
2. Inicia sesión con tu cuenta
3. Deja la pestaña abierta
4. Espera 5 minutos (auto-captura) O ejecuta PASO 4 (manual)

---

### Si la URL está mal configurada:

En la consola del Service Worker:
```javascript
chrome.storage.local.set({
  backendUrl: 'https://sub-son1k-2-2.fly.dev',
  generatorUrl: 'https://web-classic.vercel.app'
}, () => {
  console.log('✅ URLs actualizadas');
  console.log('Por favor, recarga la extensión desde chrome://extensions/');
});
```

Luego recarga la extensión haciendo clic en 🔄

---

### Si hay errores de permisos:

1. Desinstala la extensión
2. Vuelve a cargarla desde `chrome://extensions/` → "Cargar extensión sin empaquetar"
3. Chrome te pedirá que aceptes los permisos
4. Acepta todos los permisos

---

## 📋 CHECKLIST DE VERIFICACIÓN

Completa cada item y reporta los resultados:

- [ ] Backend responde correctamente (PASO 1)
- [ ] URLs configuradas correctamente (PASO 2)
- [ ] Sesión activa en Suno (PASO 3)
- [ ] Extracción manual exitosa (PASO 4)
- [ ] Todos los permisos aceptados (PASO 5)
- [ ] No hay errores en Service Worker (PASO 6)

---

## 🚑 SOLUCIÓN DE EMERGENCIA

Si nada funciona, prueba esto:

### 1. Reiniciar todo
```bash
# En Chrome:
# 1. chrome://extensions/ → Eliminar extensión
# 2. Cerrar todas las pestañas de Suno
# 3. Reiniciar Chrome

# Reinstalar extensión
cd /Users/nov4-ix/Sub-Son1k-2.2/Sub-Son1k-2.2
# Cargar desde chrome://extensions/
```

### 2. Verificar que el backend acepta tokens públicos

```bash
curl -X POST https://sub-son1k-2-2.fly.dev/api/tokens/add-public \
  -H "Content-Type: application/json" \
  -d '{"token": "test-token-abc123-def456-ghi789", "label": "test-manual", "source": "manual"}'
```

Si esto responde con error 400 o 503, el problema es del backend.

---

## 📊 REPORTE LOS RESULTADOS

Por favor, después de ejecutar los pasos, reporta:

1. **PASO 1** - ¿Cuántos totalTokens muestra?
2. **PASO 2** - ¿Qué URLs muestra la configuración?
3. **PASO 3** - ¿Tienes sesión activa en Suno?
4. **PASO 4** - ¿Qué mensaje devolvió la extracción manual?
5. **PASO 6** - ¿Qué errores aparecen en el Service Worker?

Con esta información podré darte una solución específica.

---

**Última actualización:** 2025-11-24 14:32:00  
**Prioridad:** 🔴 CRÍTICA  
**Bloqueador para:** Generación de música
