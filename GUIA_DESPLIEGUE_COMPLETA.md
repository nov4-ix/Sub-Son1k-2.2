# 🚀 Guía Completa de Despliegue - Super-Son1k 2.1

**Estado:** ✅ **LISTO PARA DESPLEGAR**

---

## 📋 Índice

1. [Preparación](#preparación)
2. [Despliegue del Backend (Railway)](#despliegue-del-backend-railway)
3. [Despliegue de Frontends (Vercel)](#despliegue-de-frontends-vercel)
4. [Verificación Post-Despliegue](#verificación-post-despliegue)
5. [Troubleshooting](#troubleshooting)

---

## 🔧 Preparación

### 1. Generar BACKEND_SECRET

**⚠️ CRÍTICO:** Este secret debe ser el MISMO en todas las aplicaciones.

```bash
# Generar un secret seguro
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Guarda este valor** - lo necesitarás en Railway y Vercel.

### 2. Verificar que tienes las cuentas necesarias

- ✅ [Railway](https://railway.app) - Para el backend
- ✅ [Vercel](https://vercel.com) - Para los frontends
- ✅ [Supabase](https://supabase.com) - Para autenticación (opcional para beta)

### 3. Preparar las URLs de producción

Anota estas URLs (las recibirás después del despliegue):
- Backend: `https://tu-backend.railway.app`
- The Generator: `https://the-generator.vercel.app`
- Ghost Studio: `https://ghost-studio.vercel.app`
- Web Classic: `https://web-classic.vercel.app`

---

## 🚂 Despliegue del Backend (Railway)

### Paso 1: Conectar Repositorio a Railway

1. Ve a [Railway Dashboard](https://railway.app/dashboard)
2. Click en **"New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Conecta tu repositorio `Super-Son1k-2.1-main`

### Paso 2: Configurar el Servicio

Railway detectará automáticamente el `railway.toml` en la raíz del proyecto.

**Configuración automática:**
- ✅ Builder: Nixpacks
- ✅ Start Command: `cd packages/backend && npm run start`
- ✅ Health Check: `/health`
- ✅ PostgreSQL: Auto-provisionado
- ✅ Redis: Auto-provisionado (si está disponible)

### Paso 3: Configurar Variables de Entorno

Ve a **Settings > Variables** y agrega:

```env
# ⚠️ CRÍTICO - Mismo valor en todas las apps
BACKEND_SECRET=tu-secret-generado-anteriormente

# URLs de Frontends (comma-separated)
FRONTEND_URL=https://the-generator.vercel.app,https://ghost-studio.vercel.app,https://web-classic.vercel.app

# Supabase (Opcional para beta, pero recomendado)
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# Suno API (Opcional - si tienes tokens en el pool no es necesario)
SUNO_API_URL=https://ai.imgkits.com/suno
SUNO_POLLING_URL=https://usa.imgkits.com/node-api/suno
SUNO_API_KEY=tu-suno-api-key

# Stripe (Opcional - solo si usas pagos)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_PREMIUM_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...

# Configuración del Pool de Tokens (Opcional - valores por defecto)
MIN_TOKENS=20
MAX_TOKENS=500
ROTATION_INTERVAL=180000
HEALTH_CHECK_INTERVAL=30000
```

**Variables auto-provisionadas por Railway:**
- `DATABASE_URL` - PostgreSQL
- `REDIS_URL` - Redis (si está disponible)
- `JWT_SECRET` - Auto-generado

### Paso 4: Deploy

1. Railway desplegará automáticamente al hacer push al repositorio
2. O manualmente: Click en **"Deploy"** en el dashboard
3. Espera a que el build termine (2-5 minutos)

### Paso 5: Obtener URL del Backend

1. Ve a **Settings > Networking**
2. Click en **"Generate Domain"**
3. Copia la URL: `https://tu-backend.railway.app`
4. **Guarda esta URL** - la necesitarás para los frontends

### Paso 6: Verificar Backend

```bash
# Health Check
curl https://tu-backend.railway.app/health

# Debe responder con:
# {
#   "status": "healthy",
#   "timestamp": "...",
#   "version": "2.0.0",
#   ...
# }
```

---

## 🌐 Despliegue de Frontends (Vercel)

### A. The Generator Next.js

#### Paso 1: Conectar a Vercel

```bash
cd apps/the-generator-nextjs
vercel login
vercel link
```

O desde el dashboard:
1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Conecta tu repositorio
4. **Root Directory**: `apps/the-generator-nextjs`

#### Paso 2: Configurar Build

Vercel detectará automáticamente Next.js. Verifica:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (automático)
- **Output Directory**: `.next` (automático)

#### Paso 3: Variables de Entorno

En **Settings > Environment Variables**, agrega:

```env
# Backend Connection
BACKEND_URL=https://tu-backend.railway.app
BACKEND_SECRET=tu-secret-generado-anteriormente
NEXT_PUBLIC_BACKEND_URL=https://tu-backend.railway.app

# Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key

# Groq API (para traducción)
GROQ_API_KEY=tu-groq-api-key
```

#### Paso 4: Deploy

```bash
vercel --prod
```

O desde el dashboard: Click **"Deploy"**

### B. Ghost Studio

#### Paso 1: Conectar a Vercel

```bash
cd apps/ghost-studio
vercel link
```

O desde el dashboard:
1. **Root Directory**: `apps/ghost-studio`

#### Paso 2: Configurar Build

Vercel detectará Vite. Verifica:
- **Framework Preset**: Vite
- **Build Command**: `npm run build` (automático)
- **Output Directory**: `dist` (automático)

#### Paso 3: Variables de Entorno

```env
# Backend Connection
VITE_BACKEND_URL=https://tu-backend.railway.app
VITE_BACKEND_SECRET=tu-secret-generado-anteriormente

# Supabase
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key

# Suno API (Fallback - solo si backend no disponible)
VITE_SUNO_API_KEY=tu-suno-api-key
```

#### Paso 4: Deploy

```bash
vercel --prod
```

### C. Web Classic

#### Paso 1: Conectar a Vercel

```bash
cd apps/web-classic
vercel link
```

O desde el dashboard:
1. **Root Directory**: `apps/web-classic`

#### Paso 2: Configurar Build

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

#### Paso 3: Variables de Entorno

```env
# Backend Connection
VITE_BACKEND_URL=https://tu-backend.railway.app
VITE_BACKEND_SECRET=tu-secret-generado-anteriormente

# Supabase
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key

# Groq API (para Pixel AI)
VITE_GROQ_API_KEY=tu-groq-api-key
```

#### Paso 4: Deploy

```bash
vercel --prod
```

### D. Nova Post Pilot

#### Paso 1-4: Similar a Web Classic

```env
# Variables de entorno
VITE_BACKEND_URL=https://tu-backend.railway.app
VITE_BACKEND_SECRET=tu-secret-generado-anteriormente
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

---

## ✅ Verificación Post-Despliegue

### 1. Backend Health Check

```bash
curl https://tu-backend.railway.app/health
```

**Respuesta esperada:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-XX...",
  "version": "2.0.0",
  "environment": "production",
  "services": {
    "database": "healthy",
    "tokenManager": "healthy"
  }
}
```

### 2. Token Pool Status

```bash
curl https://tu-backend.railway.app/api/tokens/pool/status
```

### 3. The Generator - Probar Generación

1. Abre `https://the-generator.vercel.app`
2. Escribe un prompt musical
3. Click en **"Generate"**
4. Espera 60-120 segundos
5. Verifica que el audio se reproduce ✅

### 4. Ghost Studio - Probar Cover

1. Abre `https://ghost-studio.vercel.app`
2. Sube un archivo de audio
3. Escribe un prompt para el cover
4. Click en **"Generate Cover"**
5. Espera 60-120 segundos
6. Verifica que el audio se reproduce ✅

### 5. Web Classic - Verificar Dashboard

1. Abre `https://web-classic.vercel.app`
2. Verifica que carga sin errores
3. Navega entre las secciones
4. Verifica que Pixel AI funciona

### 6. Verificar Logs

**Railway:**
- Dashboard > Deployments > Logs
- Verifica que no hay errores críticos

**Vercel:**
- Dashboard > Project > Functions > Logs
- Verifica que no hay errores de build

---

## 🔧 Troubleshooting

### Error: Backend no responde

**Solución:**
1. Verifica que Railway está corriendo
2. Revisa los logs en Railway Dashboard
3. Verifica que `BACKEND_SECRET` está configurado
4. Verifica que `FRONTEND_URL` incluye todas las URLs

### Error: CORS en Frontend

**Solución:**
1. Verifica que `FRONTEND_URL` en Railway incluye todas las URLs de Vercel
2. Reinicia el deployment en Railway después de cambiar variables
3. Verifica que las URLs están separadas por comas sin espacios

### Error: Build falla en Vercel

**Solución:**
1. Verifica que el **Root Directory** está correcto
2. Verifica que todas las dependencias están en `package.json`
3. Revisa los logs de build en Vercel
4. Verifica que `node_modules` no está en `.gitignore` incorrectamente

### Error: Variables de entorno no funcionan

**Solución:**
1. Para Next.js: Usa `NEXT_PUBLIC_` para variables públicas
2. Para Vite: Usa `VITE_` para todas las variables
3. Reinicia el deployment después de cambiar variables
4. Verifica que los nombres coinciden exactamente

### Error: Backend no encuentra base de datos

**Solución:**
1. Verifica que Railway provisionó PostgreSQL
2. Verifica que `DATABASE_URL` está configurado
3. Revisa los logs del backend
4. Ejecuta `npm run db:push` localmente y verifica el schema

### Error: Generación de música falla

**Solución:**
1. Verifica que hay tokens en el pool
2. Verifica que `SUNO_API_URL` está correcto
3. Revisa los logs del backend para errores específicos
4. Verifica que `BACKEND_SECRET` coincide en frontend y backend

---

## 📊 Checklist Final

### Backend (Railway)
- [ ] Deploy exitoso
- [ ] Health check responde 200
- [ ] Variables de entorno configuradas
- [ ] `BACKEND_SECRET` configurado
- [ ] `FRONTEND_URL` incluye todas las URLs
- [ ] Base de datos conectada

### Frontends (Vercel)
- [ ] The Generator desplegado
- [ ] Ghost Studio desplegado
- [ ] Web Classic desplegado
- [ ] Variables de entorno configuradas
- [ ] `BACKEND_SECRET` coincide con backend
- [ ] Builds exitosos

### Funcionalidad
- [ ] The Generator genera música real
- [ ] Ghost Studio genera covers reales
- [ ] Web Classic carga correctamente
- [ ] Pixel AI funciona
- [ ] Autenticación funciona (si está configurada)

---

## 🎉 ¡Despliegue Completado!

Si todos los checks pasan, ¡tu aplicación está lista para producción!

**Próximos pasos:**
1. Configurar dominio personalizado (opcional)
2. Configurar monitoreo (Sentry, LogRocket, etc.)
3. Configurar analytics (Vercel Analytics, PostHog, etc.)
4. Configurar backups de base de datos
5. Configurar alertas (UptimeRobot, etc.)

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Railway/Vercel
2. Verifica las variables de entorno
3. Consulta `DEPLOY_CHECKLIST.md` para más detalles
4. Consulta `BACKEND_DEPLOYMENT_GUIDE.md` para el backend

---

**Última actualización:** Enero 2025
**Versión:** 2.1

