# ⚠️ WIZARD NO APARECE - DIAGNÓSTICO Y SOLUCIÓN

## 🔍 DIAGNÓSTICO

**Fecha:** 2025-11-24 11:11:21  
**Problema:** El wizard de instalación no aparece en https://web-classic.vercel.app  
**Causa:** Vercel aún no ha desplegado la versión más reciente con el wizard

### Evidencia:

1. **Build local funciona:** ✅
   - Comando: `npm run build` en `apps/web-classic`
   - Resultado: Build exitoso con bundle `index-BRlQ40yF.js`

2. **Vercel tiene versión antigua:** ❌
   - Bundle actual en producción: `index-BG5BN3Hv.js`
   - No incluye componente `ExtensionInstallWizard`

3. **Trigger de deploy enviado:** ✅
   - Commit `66e5fb1` enviado a GitHub
   - Vercel debería detectarlo y redesplegar automáticamente

---

## ✅ SOLUCIONES

### OPCIÓN 1: Instalar extensión AHORA (sin esperar wizard)

**Método más rápido** - 5 minutos

#### Pasos:

1. Ejecuta este script en tu terminal:
   ```bash
   cd /Users/nov4-ix/Sub-Son1k-2.2/Sub-Son1k-2.2
   ./scripts/install-extension-now.sh
   ```

2. El script te guiará paso a paso y abrirá automáticamente la carpeta de la extensión

3. Sigue las instrucciones en pantalla:
   - Abre `chrome://extensions/`
   - Activa "Modo de desarrollador"
   - Carga la carpeta que se abrió

4. **Verificación:**
   ```bash
   curl https://sub-son1k-2-2.fly.dev/api/tokens/pool/status
   ```
   Deberías ver `totalTokens > 4`

---

### OPCIÓN 2: Esperar a que Vercel despliegue (15-30 minutos)

**Estado del despliegue:**
- ✅ Push enviado a GitHub (commit `66e5fb1`)
- ⏳ Vercel detectando cambios...
- ⏳ Build en progreso (estimado: 5-10 min)
- ⏳ Deploy a producción (estimado: 5-10 min)
- ⏳ Propagación CDN (estimado: 5-10 min)

**Cómo verificar:**
```bash
# Verifica si el nuevo bundle está desplegado
curl -s https://web-classic.vercel.app | grep "index-BRlQ40yF"

# Si devuelve algo, el wizard ya está disponible
# Si no devuelve nada, espera unos minutos más
```

**Una vez desplegado:**
1. Abre ventana incógnito: `Cmd+Shift+N`
2. Ve a: https://web-classic.vercel.app
3. Intenta generar música
4. El wizard debería aparecer automáticamente

---

### OPCIÓN 3: Deploy manual a Vercel (si tienes acceso)

Si tienes acceso a Vercel CLI:

```bash
cd apps/web-classic
vercel --prod
```

Esto fuerza un despliegue inmediato.

---

## 📊 ESTADO ACTUAL

### ✅ Componentes listos:
- [x] `ExtensionInstallWizard.tsx` - Creado y funcional
- [x] `TheGeneratorExpress.tsx` - Integración completa
- [x] Extensión empaquetada - `son1kverse-extension.zip` (24KB)
- [x] Backend configurado - Fly.io con CORS correcto
- [x] Build local exitoso - Sin errores

### ⏳ Pendientes:
- [ ] Vercel deployment de la nueva versión
- [ ] Instalación de la extensión (manual por ahora)
- [ ] Verificación end-to-end

---

## 🎯 RECOMENDACIÓN

**Para poder usar la aplicación AHORA:**

👉 **Usa OPCIÓN 1** (script de instalación)

Esto te permitirá:
- ✅ Instalar la extensión en 5 minutos
- ✅ Generar música inmediatamente
- ✅ No depender del wizard web

**Cuando Vercel despliegue:**
- El wizard estará disponible para nuevos usuarios
- Tu extensión ya estará funcionando
- Todo seguirá trabajando sin cambios

---

## 📝 PRÓXIMOS PASOS

### 1. Instala la extensión ahora (OPCIÓN 1)
```bash
cd /Users/nov4-ix/Sub-Son1k-2.2/Sub-Son1k-2.2
./scripts/install-extension-now.sh
```

### 2. Verifica que funciona
```bash
# Deberías ver tokens > 4
curl https://sub-son1k-2-2.fly.dev/api/tokens/pool/status
```

### 3. Prueba generación de música
- Ve a: https://web-classic.vercel.app
- Genera una canción
- ✅ Debería funcionar sin el error `NO_TOKENS_AVAILABLE`

### 4. Verifica el wizard más tarde
Cuando Vercel termine de desplegar (check con el comando curl arriba), el wizard estará disponible para nuevos usuarios.

---

## 🐛 TROUBLESHOOTING

### Si el script no funciona:

**Instalación manual completa:**

1. Abre Chrome
2. Ve a: `chrome://extensions/`
3. Activa "Modo de desarrollador" (arriba a la derecha)
4. Haz clic en "Cargar extensión sin empaquetar"
5. Navega a: `/Users/nov4-ix/Sub-Son1k-2.2/Sub-Son1k-2.2/extensions/suno-extension`
6. Selecciona esa carpeta
7. ✅ Extensión instalada

### Si los tokens no llegan:

1. Abre la consola del Service Worker (en chrome://extensions/)
2. Pega:
   ```javascript
   chrome.runtime.sendMessage({
     type: 'EXTRACT_AND_SEND_TO_POOL',
     label: 'manual-test'
   }, (response) => {
     console.log('Resultado:', response);
   });
   ```
3. Debes tener sesión activa en Suno

---

**Última actualización:** 2025-11-24 11:15:00  
**Status:** Wizard desplegándose, extensión lista para instalación manual  
**Acción recomendada:** Ejecutar script de instalación ahora
