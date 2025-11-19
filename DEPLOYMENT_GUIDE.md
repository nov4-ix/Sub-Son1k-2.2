# 🚀 DEPLOYMENT GUIDE - SON1KVERS3

Este archivo te guía paso a paso para deployar todo el ecosistema.

---

## 📋 PRE-REQUISITOS

### Cuentas Necesarias
- ✅ GitHub cuenta (para código fuente)
- ✅ Railway cuenta (para backend)
- ✅ Vercel cuenta (para frontends)
- ✅ Groq API key (https://console.groq.com)
- ⚠️ Stripe cuenta (opcional, para pagos)

### URLs de Referencia
- **Groq Console**: https://console.groq.com/keys
- **Railway**: https://railway.app
- **Vercel**: https://vercel.com

---

## 🔧 PASO 1: BACKEND EN RAILWAY

### 1.1 Crear Proyecto en Railway

```bash
# Opción A: Railway CLI
npm i -g @railway/cli
railway login
railway init
railway link

# Opción B: Dashboard Web
# 1. Ve a https://railway.app/new
# 2. Click "Deploy from GitHub repo"
# 3. Selecciona: Sub-Son1k-2.2
# 4. Root directory: packages/backend
```

### 1.2 Configurar Variables de Entorno

En Railway Dashboard → Variables:

```env
# Groq AI
GROQ_API_KEY=gsk_...

# Database (Railway lo provee automáticamente)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Suno API (Neural Engine)
SUNO_API_URL=https://ai.imgkits.com/suno
SUNO_POLLING_URL=https://usa.imgkits.com/node-api/suno

# Seguridad
JWT_SECRET=TU_SECRET_SUPER_SEGURO_AQUI
BACKEND_SECRET=TU_BACKEND_SECRET_AQUI

# CORS
ALLOWED_ORIGINS=https://classic.son1kvers3.com,https://nexus.son1kvers3.com

# Node
NODE_VERSION=18
NODE_ENV=production
```

### 1.3 Agregar PostgreSQL Database

```bash
# En Railway Dashboard:
# 1. Click "+ New"
# 2. Selecciona "Database"
# 3. Escoge "PostgreSQL"
# 4. Conecta al servicio backend
```

### 1.4 Deploy Backend

```bash
# Si usas CLI:
railway up

# O desde Dashboard:
# Click "Deploy" (automático con GitHub conectado)
```

### 1.5 Obtener URL del Backend

```bash
# CLI:
railway domain

# Dashboard:
# Settings → Generate Domain
# Ejemplo: https://son1kverse-backend.up.railway.app
```

**📝 GUARDA ESTA URL**: La necesitarás para los frontends

---

## 💻 PASO 2: FRONTENDS EN VERCEL

### 2.1 Web Classic (Xentric Corp)

#### Conectar Repositorio
```bash
# Opción A: Vercel CLI
npm i -g vercel
cd apps/web-classic
vercel

# Opción B: Dashboard
# 1. Ve a https://vercel.com/new
# 2. Import Git Repository
# 3. Selecciona: Sub-Son1k-2.2
# 4. Framework Preset: Vite
# 5. Root Directory: apps/web-classic
```

#### Configurar Variables de Entorno

En Vercel Dashboard → Settings → Environment Variables:

```env
VITE_GROQ_API_KEY=gsk_...
VITE_BACKEND_URL=https://son1kverse-backend.up.railway.app
VITE_BACKEND_SECRET=TU_BACKEND_SECRET_AQUI
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_... (o pk_test_...)
VITE_NEXUS_URL=https://nexus.son1kvers3.com
```

#### Build Settings

```
Build Command: pnpm build
Output Directory: dist
Install Command: pnpm install
Node Version: 18.x
```

#### Deploy

```bash
# CLI:
vercel --prod

# Dashboard:
# Click "Deploy" (automático)
```

#### Configurar Dominio Personalizado

```
Settings → Domains → Add Domain
- classic.son1kvers3.com
- www.son1kvers3.com (redirect a classic)
```

---

### 2.2 Nexus Visual (SON1KVERS3)

#### Conectar Repositorio

```bash
# CLI:
cd apps/nexus-visual
vercel

# Dashboard:
# 1. New Project
# 2. Import Git Repository
# 3. Root Directory: apps/nexus-visual
# 4. Framework: Vite
```

#### Variables de Entorno

```env
VITE_BACKEND_URL=https://son1kverse-backend.up.railway.app
VITE_GROQ_API_KEY=gsk_...
```

#### Build Settings

```
Build Command: pnpm build
Output Directory: dist
Install Command: pnpm install
Node Version: 18.x
```

#### Deploy y Dominio

```bash
# Deploy
vercel --prod

# Dominio personalizado
nexus.son1kvers3.com
```

---

### 2.3 The Generator (Next.js) - OPCIONAL

Si quieres deployar la versión standalone de Next.js:

```bash
cd apps/the-generator-nextjs
vercel

# Variables:
GROQ_API_KEY=gsk_...
NEXT_PUBLIC_BACKEND_URL=https://son1kverse-backend.up.railway.app

# Dominio:
generator.son1kvers3.com
```

---

## 🔗 PASO 3: CONECTAR TODO

### 3.1 Actualizar URLs en el Código

Una vez que tengas los dominios, actualiza:

#### En `web-classic/src/main.tsx`:
```typescript
// Línea ~34: handleTransitionComplete
window.location.href = 'https://nexus.son1kvers3.com'
```

#### En `web-classic/src/components/TransitionOverlay.tsx`:
```typescript
// onComplete callback debe llevar a producción
```

### 3.2 Actualizar CORS en Backend

Railway → Backend → Variables:
```env
ALLOWED_ORIGINS=https://classic.son1kvers3.com,https://nexus.son1kvers3.com,https://generator.son1kvers3.com
```

### 3.3 Redeploy Todo

```bash
# Backend (Railway)
railway up

# Web Classic (Vercel)
cd apps/web-classic
vercel --prod

# Nexus Visual (Vercel)
cd apps/nexus-visual
vercel --prod
```

---

## ✅ PASO 4: VERIFICACIÓN

### 4.1 Check Backend

```bash
curl https://son1kverse-backend.up.railway.app/health

# Debe retornar:
# {"status":"ok","timestamp":"..."}
```

### 4.2 Check Web Classic

1. Abre https://classic.son1kvers3.com
2. Verifica que carga correctamente
3. Prueba "Generator" → Verifica llamadas a Groq
4. Prueba "AI Assistant" → Verifica Pixel AI

### 4.3 Check Easter Egg

1. En Web Classic, presiona: `Cmd + Option + H`
2. Observa transición épica
3. Verifica redirección a: https://nexus.son1kvers3.com
4. Confirma que Nexus Visual carga

### 4.4 Check Nexus Visual

1. Verifica Matrix Rain background
2. Click "Access Codex"
3. Navega entre vistas
4. Prueba cambio de idioma (ES/EN)

### 4.5 Check Generación de Música

1. En The Generator:
   - Genera letra con Groq
   - Genera prompt musical
   - Haz generación completa
   - Verifica polling con backend
   - Prueba reproducción y descarga

---

## 🔒 PASO 5: SEGURIDAD

### 5.1 Proteger API Keys

**NUNCA** hagas commit de:

```env
GROQ_API_KEY
STRIPE_SECRET_KEY
JWT_SECRET
DATABASE_URL
```

### 5.2 Configurar Rate Limiting

El backend ya tiene rate limiting, pero verifica que esté activo:

```typescript
// packages/backend/src/middleware/rateLimiter.ts
// Ya está configurado ✅
```

### 5.3 HTTPS Forzado

Railway y Vercel ya fuerzan HTTPS automáticamente ✅

---

## 📊 PASO 6: MONITOREO

### 6.1 Railway Logs

```bash
# CLI
railway logs

# Dashboard
# Deploy → Logs (real-time)
```

### 6.2 Vercel Analytics

```
Dashboard → Analytics
- Page views
- Build times
- Error rates
```

### 6.3 Groq Usage

```
https://console.groq.com/usage
- Tokens usados
- Rate limits
- Costs
```

---

## 🆘 TROUBLESHOOTING

### Backend no responde
```bash
# Check logs
railway logs

# Restart service
railway restart

# Check variables
railway variables
```

### Frontend muestra error CORS
```bash
# Verificar ALLOWED_ORIGINS en Railway
railway variables

# Debe incluir tu dominio de Vercel
```

### Groq API error 429 (Rate Limit)
```bash
# Espera 1 minuto
# O upgrade a plan de pago en Groq
```

### Build falla en Vercel
```bash
# Check build logs en Vercel Dashboard
# Verifica que pnpm install funcione local
cd apps/web-classic
pnpm install
pnpm build
```

---

## 📝 CHECKLIST FINAL

```markdown
Backend (Railway):
- [ ] PostgreSQL database creada
- [ ] Variables de entorno configuradas
- [ ] Deploy exitoso
- [ ] Health check pasa: /health
- [ ] URL guardada

Web Classic (Vercel):
- [ ] Repo conectado
- [ ] Variables configuradas
- [ ] Build exitoso
- [ ] Dominio personalizado asignado
- [ ] Easter Egg funciona

Nexus Visual (Vercel):
- [ ] Repo conectado
- [ ] Variables configuradas
- [ ] Build exitoso
- [ ] Dominio personalizado asignado
- [ ] Matrix Rain se ve

Integración:
- [ ] Easter Egg redirige a Nexus correcto
- [ ] Generación de música funciona
- [ ] Groq AI responde (letra + prompt)
- [ ] Pixel AI conversa
- [ ] Downloads funcionan

Seguridad:
- [ ] HTTPS forzado (automático)
- [ ] API keys en variables (no en código)
- [ ] CORS configurado correctamente
- [ ] Rate limiting activo
```

---

## 🎉 ¡LISTO!

Tu ecosistema SON1KVERS3 está en producción:

- 🌐 **Web Classic**: https://classic.son1kvers3.com
- 🚀 **Nexus Visual**: https://nexus.son1kvers3.com
- ⚙️ **Backend API**: https://son1kverse-backend.up.railway.app

---

**Creado**: 2025-11-19  
**Mantenedor**: Sub-Son1k Team  
**Soporte**: La Resistencia (Ctrl+Alt+Humanity)
