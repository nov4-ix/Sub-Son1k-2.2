# 🚨 INSTRUCCIONES PARA LIBERAR PROYECTOS EN VERCEL

## Problema
Has alcanzado el límite de 10 proyectos conectados al repositorio Git `nov4-ix/Sub-Son1k-2.2`.

## Solución Manual (5 minutos)

### Paso 1: Ir al Dashboard de Vercel
Abre: https://vercel.com/son1kvers3s-projects-c805d053

### Paso 2: Eliminar Proyectos Obsoletos/Con Errores
Busca y **DELETE** estos proyectos (si existen):
- `dist`
- `sub-son1k-2-2-ghost-studio-1jkj`
- `sub-son1k-2-2-ghost-studio`
- `nov4-ix`
- `super-son1k`
- `sub-son1k-2-2` (si tiene errores de build)
- `son1k-web-v3`

**MANTÉN SOLO**:
- `son1k-web-classic` (el que usaremos para producción)
- `nexus-visual` (si lo necesitas)

### Paso 3: Limpiar Variables de Entorno del Proyecto Principal

Ve a: https://vercel.com/son1kvers3s-projects-c805d053/son1k-web-classic/settings/environment-variables

**ELIMINA** las siguientes variables (tienen secretos rotos):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` 
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### Paso 4: Agregar Variable de Entorno Correcta

En la misma página, **AGREGA**:
- **Key**: `VITE_BACKEND_URL`
- **Value**: `https://sub-son1k-2-2.fly.dev`
- **Environments**: Production, Preview, Development (todos)

### Paso 5: Configurar Build Settings

Ve a: https://vercel.com/son1kvers3s-projects-c805d053/son1k-web-classic/settings

En **General** → **Build & Development Settings**:
- **Root Directory**: `apps/web-classic`
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Paso 6: Redesplegar

Click en **Deployments** → Selecciona el último deployment → Click **Redeploy**

---

## ✅ Verificación Final

Una vez desplegado, verifica:
1. La app carga en: `https://son1k-web-classic.vercel.app`
2. No hay errores de CORS (el backend ya está configurado)
3. Pixel AI usa Groq v3.3 (modelo actualizado)

---

## 🎯 Estado Actual del Sistema

### Backend ✅
- URL: https://sub-son1k-2-2.fly.dev
- Status: Funcionando con CORS habilitado
- Health: `curl https://sub-son1k-2-2.fly.dev/health` → `{"status":"ok"}`

### Frontend ⏳
- Build: ✅ Compilado exitosamente con `npx vite`
- Deploy: ⏳ Pendiente de configuración manual en Vercel
- Groq Model: ✅ Actualizado a `llama-3.3-70b-versatile`

### Extensión Neural Bridge v2.2 📦
- Location: `apps/web-classic/public/son1k-engine-v2.2.zip`
- Status: Lista para descargar desde el wizard
- Fix: `DEV_MODE` definido correctamente
