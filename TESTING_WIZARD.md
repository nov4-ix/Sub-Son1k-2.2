# 🧪 GUÍA DE TESTING - WIZARD DE INSTALACIÓN

## ✅ ESTADO DEL DESPLIEGUE

**Fecha:** 2025-11-24 05:19:00  
**URL Frontend:** https://web-classic.vercel.app  
**Bundle JS:** `/assets/index-BG5BN3Hv.js` (✅ Nueva versión desplegada)  
**Backend:** https://sub-son1k-2-2.fly.dev (✅ Activo)

---

## 🎯 PRUEBA DEL WIZARD - PASOS DETALLADOS

### PASO 1: Abrir la aplicación

1. Abre una ventana de incógnito en Chrome (para simular usuario nuevo)
   - **Mac:** `Cmd + Shift + N`
   - **Windows:** `Ctrl + Shift + N`

2. Navega a: **https://web-classic.vercel.app**

3. Espera a que cargue completamente la página

---

### PASO 2: Activar el wizard

1. Busca el campo de texto "Describe tu canción..."

2. Escribe cualquier prompt, por ejemplo:
   ```
   upbeat electronic dance music with energetic beats
   ```

3. Haz clic en el botón **"Generar Canción"** (botón verde brillante)

4. **RESULTADO ESPERADO:**
   - ⏳ Verás mensaje "Conectando con Neural Engine..."
   - ❌ Error en consola: `NO_TOKENS_AVAILABLE`
   - 🎯 **El modal del wizard debería aparecer automáticamente**

---

### PASO 3: Navegar por el wizard

#### **PANTALLA 1: Términos y Condiciones**

**Qué deberías ver:**
- ✅ Título: "Términos y Condiciones"
- ✅ Barra de progreso (1/6 verde)
- ✅ Texto de términos scrolleable
- ✅ Checkbox: "He leído y acepto los términos y condiciones"
- ✅ Botón "Siguiente" (deshabilitado hasta marcar checkbox)

**Acción:**
1. Lee los términos (o scroll hasta abajo)
2. Marca el checkbox
3. Haz clic en "Siguiente"

---

#### **PANTALLA 2: Descargar Extensión**

**Qué deberías ver:**
- ✅ Título: "Descargar Extensión"
- ✅ Barra de progreso (2/6)
- ✅ Ícono de descarga
- ✅ Botón verde: "Descargar Extensión"

**Acción:**
1. Haz clic en "Descargar Extensión"
2. **VERIFICAR:** Se descarga archivo `son1kverse-extension.zip` (24KB)
3. El wizard avanza automáticamente al siguiente paso

---

#### **PANTALLA 3: Abrir Chrome Extensions**

**Qué deberías ver:**
- ✅ Título: "Abrir Chrome Extensions"
- ✅ Código: `chrome://extensions/` con botón "Copiar"
- ✅ Ícono de configuración

**Acción:**
1. Haz clic en "Copiar"
2. Abre nueva pestaña
3. Pega la URL `chrome://extensions/` en la barra de direcciones
4. Presiona Enter
5. Vuelve al wizard y haz clic en "Siguiente"

---

#### **PANTALLA 4: Activar Modo Desarrollador**

**Qué deberías ver:**
- ✅ Instrucciones para activar modo desarrollador
- ✅ Indicación de ubicación (esquina superior derecha)

**Acción:**
1. En la pestaña de extensiones, busca "Modo de desarrollador" (arriba a la derecha)
2. Activa el interruptor (debe quedar azul)
3. Vuelve al wizard y haz clic en "Siguiente"

---

#### **PANTALLA 5: Cargar Extensión**

**Qué deberías ver:**
- ✅ Instrucciones de instalación
- ✅ Pasos numerados (1. Cargar extensión sin empaquetar, 2. Seleccionar carpeta, 3. Listo)

**Acción:**
1. En `chrome://extensions/`, haz clic en "Cargar extensión sin empaquetar"
2. **IMPORTANTE:** Primero descomprime el archivo `son1kverse-extension.zip` que descargaste
3. Selecciona la carpeta descomprimida (NO el archivo .zip)
4. ✅ La extensión debería aparecer en la lista
5. Vuelve al wizard y haz clic en "Siguiente"

---

#### **PANTALLA 6: ¡Completado!**

**Qué deberías ver:**
- ✅ Ícono de checkmark verde
- ✅ Mensaje: "¡La extensión está instalada correctamente!"
- ✅ Botón "Finalizar"

**Acción:**
1. Haz clic en "Finalizar"
2. El wizard se cierra
3. ✅ Deberías ver un toast notification: "¡Extensión instalada! Ya puedes generar música."

---

### PASO 4: Verificar instalación

**En la pestaña de extensiones (`chrome://extensions/`):**

1. Busca "Son1kVerse AI Music Engine"
2. Verifica que:
   - ✅ Está activada (interruptor azul)
   - ✅ Tiene ID único
   - ✅ Muestra versión (2.0.0)

**Verificar configuración:**

1. Haz clic en "Service worker" en la extensión
2. En la consola que se abre, pega:
   ```javascript
   chrome.storage.local.get(['backendUrl', 'generatorUrl'], (result) => {
     console.log('Backend URL:', result.backendUrl || 'https://sub-son1k-2-2.fly.dev (default)');
     console.log('Generator URL:', result.generatorUrl || 'https://web-classic.vercel.app (default)');
   });
   ```
3. Deberías ver las URLs correctas

---

### PASO 5: Probar captura de tokens

**Opción A: Automática (esperar 5 minutos)**
1. Abre `https://suno.com` en otra pestaña
2. Inicia sesión si no lo has hecho
3. Espera 5 minutos
4. La extensión capturará tokens automáticamente

**Opción B: Manual (inmediato)**
1. En la consola del Service Worker (del paso anterior), pega:
   ```javascript
   chrome.runtime.sendMessage({
     type: 'EXTRACT_AND_SEND_TO_POOL',
     label: 'test-wizard'
   }, (response) => {
     console.log('📊 Resultado:', response);
   });
   ```
2. Si tienes sesión en Suno, deberías ver: `{success: true, ...}`

---

### PASO 6: Verificar tokens en backend

En tu terminal, ejecuta:

```bash
curl https://sub-son1k-2-2.fly.dev/api/tokens/pool/status
```

**Resultado esperado:**
```json
{
  "success": true,
  "data": {
    "totalTokens": 5,  // ← Debería ser > 4 ahora
    "activeTokens": 5,
    "healthyTokens": 5
  }
}
```

---

### PASO 7: Probar generación de música

1. Vuelve a `https://web-classic.vercel.app`
2. Escribe un nuevo prompt
3. Haz clic en "Generar Canción"

**RESULTADO ESPERADO:**
- ✅ NO aparece el wizard (ya está instalado)
- ✅ Mensaje: "Conectando con Neural Engine..."
- ✅ Mensaje: "Generando audio (esto toma unos segundos)..."
- ✅ La generación completa exitosamente (o si falla, NO es por tokens)

---

## 🐛 TROUBLESHOOTING

### Problema: El wizard NO aparece

**Posibles causas:**
1. Vercel no terminó de desplegar → Espera 2-3 minutos más
2. Cache del navegador → Presiona Ctrl+Shift+R (hard refresh)
3. Bundle antiguo cargado → Verifica en DevTools > Network que carga el bundle correcto

**Solución:**
```bash
# Verifica la versión desplegada
curl -s https://web-classic.vercel.app | grep "index-"
# Deberías ver: index-BG5BN3Hv.js
```

---

### Problema: Descarga del ZIP no funciona

**Posibles causas:**
1. Archivo no disponible en Vercel
2. Bloqueador de descargas activo

**Solución:**
1. Descarga manualmente desde: https://web-classic.vercel.app/downloads/son1kverse-extension.zip
2. Si da 404, espera a que Vercel sincronice archivos estáticos

---

### Problema: Extensión no captura tokens

**Posibles causas:**
1. No tienes sesión activa en Suno
2. URLs mal configuradas

**Solución:**
1. Abre Suno e inicia sesión
2. Verifica configuración con el comando del PASO 4
3. Fuerza extracción manual con el comando del PASO 5, Opción B

---

## 📊 CHECKLIST DE VERIFICACIÓN

Marca cada item conforme lo completes:

- [ ] Wizard se abre automáticamente al intentar generar
- [ ] PASO 1: Términos y condiciones funciona correctamente
- [ ] PASO 2: Descarga el archivo .zip (24KB)
- [ ] PASO 3: Copia URL correctamente
- [ ] PASO 4: Instrucciones claras para modo desarrollador
- [ ] PASO 5: Instalación exitosa de la extensión
- [ ] PASO 6: Mensaje de éxito y toast notification
- [ ] Extensión aparece en chrome://extensions/
- [ ] Service worker funciona (sin errores en consola)
- [ ] Tokens llegan al backend (totalTokens > 4)
- [ ] Generación de música funciona sin wizard

---

## 📸 CAPTURAS RECOMENDADAS

Por favor toma screenshots de:

1. ✅ Modal del wizard abierto (PASO 1 - Términos)
2. ✅ Descarga exitosa del archivo .zip
3. ✅ Extensión instalada en chrome://extensions/
4. ✅ Consola del Service Worker mostrando configuración
5. ✅ Resultado de `curl .../tokens/pool/status`
6. ✅ Toast notification "¡Extensión instalada!"

Esto me ayudará a verificar que todo funciona correctamente.

---

**Última actualización:** 2025-11-24 05:19:00  
**Versión del wizard:** 1.0.0  
**Soporte:** Reporta cualquier issue o comportamiento inesperado
