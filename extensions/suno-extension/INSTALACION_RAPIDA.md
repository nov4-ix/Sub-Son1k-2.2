# 🚀 INSTALACIÓN RÁPIDA DE LA EXTENSIÓN

## ✅ PASO 1: Cargar la extensión en Chrome

1. Abre Chrome
2. Ve a: `chrome://extensions/`
3. Activa el **"Modo de desarrollador"** (interruptor arriba a la derecha)
4. Haz clic en **"Cargar extensión sin empaquetar"**
5. Navega a: `/Users/nov4-ix/Sub-Son1k-2.2/Sub-Son1k-2.2/extensions/suno-extension`
6. Selecciona la carpeta y haz clic en **"Seleccionar"**

## ✅ PASO 2: Verificar la instalación

La extensión debería aparecer con el nombre **"Son1kVerse AI Music Engine"**.

**Si la extensión YA estaba instalada**, haz clic en el ícono de **RELOAD** (🔄) para recargarla con la nueva configuración.

## ✅ PASO 3: Iniciar captura de tokens

### Opción A: Automática (recomendada)

1. Abre una pestaña de Suno en Chrome: `https://suno.com`
2. Inicia sesión si no lo has hecho
3. La extensión **automáticamente** empezará a capturar y enviar tokens al backend cada 5 minutos

### Opción B: Manual (para probar inmediatamente)

1. En `chrome://extensions/`, encuentra la extensión
2. Haz clic en **"Service worker"** (abrirá la consola)
3. En la consola, pega este comando:

```javascript
chrome.runtime.sendMessage({
  type: 'EXTRACT_AND_SEND_TO_POOL',
  label: 'manual-install'
}, (response) => {
  if (response.success) {
    console.log('✅ Token enviado correctamente:', response);
  } else {
    console.error('❌ Error:', response.error);
  }
});
```

## 📊 PASO 4: Verificar que funcionó

Ejecuta este comando en tu terminal para ver el estado del pool:

```bash
curl https://sub-son1k-2-2.fly.dev/api/tokens/pool/status
```

Deberías ver que `totalTokens` aumentó.

## 🎵 PASO 5: Probar generación de música

1. Ve a: `https://web-classic.vercel.app`
2. Escribe un prompt y haz clic en **"Generar Canción"**
3. ¡Debería funcionar sin el error `NO_TOKENS_AVAILABLE`!

---

## 🔧 Troubleshooting

**La extensión no captura tokens:**
- Asegúrate de estar logueado en Suno
- Espera 5 minutos (o usa la Opción B manual)
- Verifica que la extensión esté activa en `chrome://extensions/`

**Error "Cannot read property of undefined":**
- Recarga la extensión haciendo clic en 🔄 en `chrome://extensions/`

**Tokens no llegan al backend:**
- Verifica la configuración ejecutando en la consola del Service Worker:
  ```javascript
  chrome.storage.local.get(['backendUrl'], (result) => {
    console.log('Backend URL:', result.backendUrl || 'https://sub-son1k-2-2.fly.dev (default)');
  });
  ```

---

**Última actualización:** 2025-11-24T03:39:00  
**Configuración:** URLs de producción pre-configuradas ✅
