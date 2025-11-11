# 🌐 ESTRATEGIA DE LANDING PAGE - BETA LAUNCH

## 📋 SITUACIÓN ACTUAL

### ✅ **WEB CLASSIC = LANDING PAGE PRINCIPAL**

**Ubicación**: `apps/web-classic/`

**Contenido**:
- ✅ Hero section con branding "SON1KVERS3"
- ✅ Filosofía del proyecto
- ✅ Sección de noticias
- ✅ Links a todas las apps principales
- ✅ Diseño cyberpunk completo

**Stack**: 
- Vite + React 18
- HTML estático con componentes React
- Tailwind CSS

---

## 🎯 DECISIÓN PARA BETA

### **Web Classic ES la Landing Page**

**Razones**:
1. ✅ Ya tiene todo el contenido de landing page
2. ✅ Diseño completo y profesional
3. ✅ Links a todas las apps funcionando
4. ✅ Branding y filosofía del proyecto

**NO lanzar**:
- ❌ The Generator Next.js como landing (solo redirige a `/generator`)
- ❌ Una landing page separada (no existe)

---

## 🔧 CONFIGURACIÓN PARA DEPLOY

### **Vercel.json Corregido**

El `vercel.json` raíz tenía un error - `web-classic` estaba configurado como Next.js cuando debería ser static-build (Vite).

**Corrección aplicada**:
```json
{
  "src": "apps/web-classic/package.json",
  "use": "@vercel/static-build",  // ✅ CORRECTO (antes era @vercel/next)
  "config": {
    "distDir": "dist"
  }
}
```

---

## 🚀 URLS DE PRODUCCIÓN

### **Landing Page Principal**
- **URL Principal**: `https://son1kverse.vercel.app` (o dominio personalizado)
- **App**: Web Classic (landing page completa)

### **Apps Individuales**
- **The Generator**: `https://the-generator.vercel.app`
- **Ghost Studio**: `https://ghost-studio.vercel.app`
- **Nova Post Pilot**: `https://nova-post-pilot.vercel.app`

---

## 📝 FLUJO DE NAVEGACIÓN

```
Usuario llega a Landing Page (Web Classic)
  ↓
Hero Section con branding
  ↓
Links a apps individuales:
  - The Generator → https://the-generator.vercel.app
  - Ghost Studio → https://ghost-studio.vercel.app
  - Nova Post Pilot → https://nova-post-pilot.vercel.app
  ↓
Cada app funciona independientemente
```

---

## ✅ CHECKLIST PARA DEPLOY DE LANDING

### **Pre-Deploy**
- [x] Verificar que `index.html` tiene todo el contenido
- [x] Corregir `vercel.json` (static-build en lugar de next)
- [x] Verificar que links a apps apuntan a URLs correctas
- [ ] Actualizar links si URLs de apps cambiaron

### **Deploy**
1. Deploy Web Classic a Vercel
2. Configurar dominio personalizado si es necesario
3. Verificar que carga correctamente
4. Test de navegación a apps individuales

### **Post-Deploy**
- [ ] Verificar SEO meta tags
- [ ] Test responsive design
- [ ] Verificar que todos los links funcionan
- [ ] Añadir analytics si es necesario

---

## 🎨 CONTENIDO DE LANDING PAGE

### **Secciones Incluidas**

1. **Hero Section**
   - Logo SON1KVERS3
   - Título: "[Son1kvers3]"
   - Slogan: "Ctrl + Alt = Humanity"
   - Subtítulo: "Lo imperfecto también es sagrado"
   - CTAs: "Entrar al Códex" y "The Generator"

2. **Filosofía**
   - Texto sobre la resistencia sonora
   - Quote: "Cada glitch es una cicatriz. Cada nota, una rebelión."

3. **Noticias**
   - Beta Pública Lanzada
   - The Generator Update
   - Top 10 Semanal

4. **Links a Apps**
   - The Generator
   - Ghost Studio
   - Nova Post Pilot
   - Nexus Visual

---

## 🔍 VERIFICACIÓN FINAL

### **¿Web Classic o Landing Separada?**

**Respuesta**: ✅ **Web Classic ES la landing page**

No hay una landing page separada. Web Classic (`apps/web-classic/`) contiene todo el contenido de la landing page principal.

### **¿Necesita deploy?**

**Sí**, si quieres tener una landing page pública además de las apps individuales.

### **¿Es crítica para beta?**

**Opcional** - Las apps individuales pueden funcionar sin ella, pero es recomendable tenerla para:
- Branding unificado
- Punto de entrada principal
- Navegación entre apps
- SEO y marketing

---

## 📊 RECOMENDACIÓN FINAL

### **Para Beta Pública**

**✅ SÍ LANZAR WEB CLASSIC COMO LANDING PAGE**

**Motivos**:
1. Da un punto de entrada profesional
2. Unifica el branding
3. Facilita navegación entre apps
4. Ya está diseñada y lista
5. Solo necesita deploy

**Alternativa (si no se lanza)**:
- Cada app funciona independientemente
- Sin punto de entrada centralizado
- Menos branding unificado

---

## 🚀 PASOS PARA DEPLOY

```bash
# 1. Verificar build local
cd apps/web-classic
npm run build

# 2. Deploy a Vercel
vercel --prod

# 3. Configurar dominio (opcional)
# En Vercel Dashboard → Settings → Domains

# 4. Verificar
# Abrir URL y testear navegación
```

---

**Última actualización**: $(date)
**Estado**: ✅ WEB CLASSIC = LANDING PAGE PRINCIPAL
**Recomendación**: ✅ LANZAR COMO LANDING PAGE

