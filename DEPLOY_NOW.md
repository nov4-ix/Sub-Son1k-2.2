# 🚀 Despliegue Rápido - Guía CLI

## 📋 BACKEND_SECRET Generado

**⚠️ IMPORTANTE: Guarda este valor - lo necesitarás en Railway y Vercel**

```
d0a238b61777b7ab94c8a1df612e6aa8eead9c01736b847508d5cb48240c06a1
```

---

## 🔐 Paso 1: Autenticación

### Vercel (ya iniciado)
1. Presiona **ENTER** en la terminal (o abre manualmente: https://vercel.com/oauth/device?user_code=NFSV-GFGS)
2. Autentícate en el navegador
3. Vuelve a la terminal cuando esté listo

### Railway (después de Vercel)
```bash
railway login
```

---

## 🚂 Paso 2: Desplegar Backend (Railway)

### 2.1. Conectar proyecto
```bash
cd packages/backend
railway link
# Selecciona o crea un proyecto nuevo
```

### 2.2. Configurar variables de entorno
```bash
# BACKEND_SECRET (CRÍTICO)
railway variables set BACKEND_SECRET=d0a238b61777b7ab94c8a1df612e6aa8eead9c01736b847508d5cb48240c06a1

# FRONTEND_URL (actualiza con tus URLs reales después del deploy)
railway variables set FRONTEND_URL=https://the-generator.vercel.app,https://ghost-studio.vercel.app,https://web-classic.vercel.app,https://nova-post-pilot.vercel.app

# Supabase (si lo usas)
railway variables set SUPABASE_URL=tu-supabase-url
railway variables set SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# Suno API (opcional)
railway variables set SUNO_API_URL=https://ai.imgkits.com/suno
railway variables set SUNO_POLLING_URL=https://usa.imgkits.com/node-api/suno
```

### 2.3. Deploy
```bash
railway up
```

### 2.4. Obtener URL del backend
```bash
railway domain
# O en Railway Dashboard > Settings > Networking > Generate Domain
```

**Guarda la URL del backend** - la necesitarás para los frontends.

---

## 🌐 Paso 3: Desplegar Frontends (Vercel)

### 3.1. The Generator Next.js

```bash
cd apps/the-generator-nextjs

# Conectar proyecto (primera vez)
vercel link

# Configurar variables de entorno
vercel env add BACKEND_URL production
# Pega: https://tu-backend.railway.app

vercel env add BACKEND_SECRET production
# Pega: d0a238b61777b7ab94c8a1df612e6aa8eead9c01736b847508d5cb48240c06a1

vercel env add NEXT_PUBLIC_BACKEND_URL production
# Pega: https://tu-backend.railway.app

# Supabase (si lo usas)
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# Groq (para traducción)
vercel env add GROQ_API_KEY production

# Deploy
vercel --prod
```

### 3.2. Ghost Studio

```bash
cd ../ghost-studio

# Conectar proyecto
vercel link

# Configurar variables
vercel env add VITE_BACKEND_URL production
# Pega: https://tu-backend.railway.app

vercel env add VITE_BACKEND_SECRET production
# Pega: d0a238b61777b7ab94c8a1df612e6aa8eead9c01736b847508d5cb48240c06a1

vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production

# Deploy
vercel --prod
```

### 3.3. Web Classic

```bash
cd ../web-classic

vercel link

vercel env add VITE_BACKEND_URL production
vercel env add VITE_BACKEND_SECRET production
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
vercel env add VITE_GROQ_API_KEY production

vercel --prod
```

### 3.4. Nova Post Pilot

```bash
cd ../nova-post-pilot

vercel link

vercel env add VITE_BACKEND_URL production
vercel env add VITE_BACKEND_SECRET production
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production

vercel --prod
```

---

## ✅ Paso 4: Actualizar FRONTEND_URL en Railway

Después de desplegar todos los frontends, actualiza `FRONTEND_URL` en Railway con las URLs reales:

```bash
cd ../../packages/backend
railway variables set FRONTEND_URL=https://the-generator.vercel.app,https://ghost-studio.vercel.app,https://web-classic.vercel.app,https://nova-post-pilot.vercel.app
```

---

## 🧪 Paso 5: Verificar

```bash
# Backend
curl https://tu-backend.railway.app/health

# Frontends - abre en navegador:
# https://the-generator.vercel.app
# https://ghost-studio.vercel.app
# https://web-classic.vercel.app
# https://nova-post-pilot.vercel.app
```

---

## 📝 Resumen de Comandos Rápidos

```bash
# BACKEND_SECRET (usa este valor en todas partes)
d0a238b61777b7ab94c8a1df612e6aa8eead9c01736b847508d5cb48240c06a1

# Backend
cd packages/backend
railway link
railway variables set BACKEND_SECRET=d0a238b61777b7ab94c8a1df612e6aa8eead9c01736b847508d5cb48240c06a1
railway up

# Frontends (repetir para cada app)
cd apps/nombre-app
vercel link
vercel env add VARIABLE_NAME production
vercel --prod
```

---

¡Sigue estos pasos y estarás desplegado en minutos! 🚀

