# ⚙️ CONFIGURACIÓN DE LA EXTENSIÓN - PASOS RÁPIDOS

## 🚨 PROBLEMA ACTUAL

La extensión está enviando tokens a la URL antigua de Railway en lugar de Fly.io.
Por eso el backend dice "No hay tokens disponibles".

## ✅ SOLUCIÓN (3 minutos)

### Paso 1: Abrir la consola de la extensión

1. Abre Chrome
2. Ve a `chrome://extensions/`
3. Activa "Modo de desarrollador" (arriba a la derecha)
4. Busca "Son1kVerse AI Music Engine" o similar
5. Haz clic en **"Service worker"** o **"background page"**
   - Esto abrirá la consola de DevTools para la extensión

### Paso 2: Configurar las URLs correctas

En la consola que se abrió, pega este código y presiona Enter:

```javascript
chrome.storage.local.set({
  backendUrl: 'https://sub-son1k-2-2.fly.dev',
  generatorUrl: 'https://web-classic.vercel.app'
}, () => {
  console.log('✅ URLs configuradas correctamente');
  console.log('Backend:', 'https://sub-son1k-2-2.fly.dev');
  console.log('Generator:', 'https://web-classic.vercel.app');
});
```

### Paso 3: Forzar extracción de tokens

Todavía en la misma consola, ejecuta:

```javascript
chrome.runtime.sendMessage({
  type: 'EXTRACT_AND_SEND_TO_POOL',
  label: 'manual-config'
}, (response) => {
  console.log('Resultado:', response);
});
```

### Paso 4: Verificar que funcionó

Ejecuta esto para verificar la configuración:

```javascript
chrome.storage.local.get(['backendUrl', 'generatorUrl'], (result) => {
  console.log('Configuración actual:', result);
});
```

## 🔄 ALTERNATIVA: Reinstalar extensión

Si los pasos anteriores no funcionan:

1. En `chrome://extensions/`, **elimina** la extensión actual
2. Haz clic en **"Cargar extensión sin empaquetar"**
3. Selecciona la carpeta: `/Users/nov4-ix/Sub-Son1k-2.2/Sub-Son1k-2.2/extensions/suno-extension`
4. Una vez cargada, repite **Paso 2** y **Paso 3**

## 📊 Verificar que llegaron tokens al backend

Después de completar los pasos, verifica en el backend:

```bash
curl https://sub-son1k-2-2.fly.dev/api/tokens/pool/status
```

Deberías ver un incremento en `totalTokens`.

## ❓ Troubleshooting

**Error "chrome.storage is not defined":**
- Asegúrate de estar en la consola del Service Worker de la extensión, NO en la consola de la página web

**Extension no aparece en chrome://extensions/:**
- Cárgala manualmente como se indica en "ALTERNATIVA"

**Tokens no llegan al backend:**
- Verifica que tengas sesión activa en Suno (abre `suno.com` en otra pestaña)
- Espera 30 segundos y vuelve a ejecutar el Paso 3

---

**Última actualización:** 2025-11-24
**Soporte:** Ejecuta los comandos exactamente como están escritos
