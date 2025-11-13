# 🚀 Deploy Completo - Beta Estable

**Fecha:** 30 de enero, 2025  
**Estado:** ✅ **LISTO PARA DEPLOY COMPLETO**

---

## ✅ **VERIFICACIÓN PRE-DEPLOY**

### **Builds Exitosos** ✅
- ✅ Backend: `pnpm build:backend` - Exit code: 0
- ✅ The Generator: `pnpm --filter @super-son1k/the-generator build` - Exit code: 0
- ✅ Ghost Studio: `pnpm --filter ghost-studio build` - Exit code: 0
- ✅ Web Classic: `pnpm build:frontend` - Exit code: 0

### **Type-Checks** ✅
- ✅ Backend: Sin errores críticos
- ✅ Frontends: Sin errores críticos
- ⚠️ Shared packages: Advertencias de configuración (no críticas)

---

## 🚀 **DEPLOY BACKEND (Railway/Render)**

### **Opción 1: Railway (Recomendado)**

#### **1. Conectar Repositorio**
1. Ve a https://railway.app
2. Click "New Project"
3. Selecciona "Deploy from GitHub repo"
4. Conecta tu repositorio: `super-son1k/super-son1k-2.0`

#### **2. Configurar Servicio**
- **Root Directory:** `packages/backend`
- **Build Command:** `pnpm install && pnpm run build`
- **Start Command:** `pnpm run start`
- **Health Check Path:** `/health`
- **Health Check Timeout:** 300

#### **3. Variables de Entorno (Railway Dashboard)**

**Obligatorias:**
```env
DATABASE_URL=<tu-postgres-url>
REDIS_URL=<tu-redis-url>
JWT_SECRET=<generar-secreto-min-32-chars>
SUPABASE_URL=<tu-supabase-url>
SUPABASE_SERVICE_ROLE_KEY=<tu-supabase-service-key>
SUNO_API_KEY=<tu-suno-api-key>
FRONTEND_URL=https://the-generator.son1kvers3.com
BACKEND_SECRET=<generar-secreto-min-32-chars>
```

**Opcionales (con valores por defecto):**
```env
GENERATION_API_URL=https://ai.imgkits.com/suno
GENERATION_POLLING_URL=https://usa.imgkits.com/node-api/suno
SUNO_API_URL=https://ai.imgkits.com/suno
SUNO_POLLING_URL=https://usa.imgkits.com/node-api/suno
NODE_ENV=production
PORT=3001
LOG_LEVEL=info
GENERATION_CONCURRENCY=50
GENERATION_RATE_LIMIT=100
MIN_TOKENS=50
MAX_TOKENS=2000
```

**Stripe (opcional):**
```env
STRIPE_SECRET_KEY=<tu-stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<tu-stripe-webhook-secret>
STRIPE_PRO_PRICE_ID=<tu-stripe-pro-price-id>
STRIPE_PREMIUM_PRICE_ID=<tu-stripe-premium-price-id>
STRIPE_ENTERPRISE_PRICE_ID=<tu-stripe-enterprise-price-id>
```

#### **4. Ejecutar Migración**
```bash
# En Railway CLI o Dashboard Terminal
railway run pnpm prisma migrate deploy
```

#### **5. Verificar Deploy**
- ✅ Health check: `https://tu-backend.railway.app/health`
- ✅ Debe retornar: `{ "status": "ok", "timestamp": "..." }`

---

### **Opción 2: Render**

#### **1. Crear Servicio Web**
1. Ve a https://render.com
2. Click "New +" → "Web Service"
3. Conecta tu repositorio

#### **2. Configurar**
- **Name:** `son1kverse-backend`
- **Root Directory:** `packages/backend`
- **Environment:** `Node`
- **Build Command:** `pnpm install && pnpm run build`
- **Start Command:** `pnpm run start`

#### **3. Variables de Entorno**
Mismas que Railway (ver arriba)

#### **4. Ejecutar Migración**
```bash
# En Render Shell
cd packages/backend
pnpm prisma migrate deploy
```

---

## 🚀 **DEPLOY FRONTENDS (Vercel)**

### **1. The Generator**

#### **A. Conectar Proyecto**
```bash
cd apps/the-generator
vercel --prod
```

#### **B. Variables de Entorno (Vercel Dashboard)**
```env
VITE_BACKEND_URL=https://tu-backend.railway.app
VITE_SUPABASE_URL=<tu-supabase-url>
VITE_SUPABASE_ANON_KEY=<tu-supabase-anon-key>
```

#### **C. Verificar**
- ✅ URL: `https://the-generator.son1kvers3.com`
- ✅ Debe cargar sin errores
- ✅ Autenticación funcionando

---

### **2. Ghost Studio**

#### **A. Conectar Proyecto**
```bash
cd apps/ghost-studio
vercel --prod
```

#### **B. Variables de Entorno (Vercel Dashboard)**
```env
VITE_BACKEND_URL=https://tu-backend.railway.app
VITE_SUPABASE_URL=<tu-supabase-url>
VITE_SUPABASE_ANON_KEY=<tu-supabase-anon-key>
```

#### **C. Verificar**
- ✅ URL: `https://ghost-studio.son1kvers3.com`
- ✅ Debe cargar sin errores
- ✅ Audio recorder funcionando

---

### **3. Web Classic (Landing Page)**

#### **A. Conectar Proyecto**
```bash
cd apps/web-classic
vercel --prod
```

#### **B. Variables de Entorno (Vercel Dashboard)**
```env
VITE_BACKEND_URL=https://tu-backend.railway.app
VITE_SUPABASE_URL=<tu-supabase-url>
VITE_SUPABASE_ANON_KEY=<tu-supabase-anon-key>
```

#### **C. Verificar**
- ✅ URL: `https://son1kvers3.com`
- ✅ Todos los enlaces funcionando
- ✅ Navegación correcta

---

### **4. Nova Post Pilot**

#### **A. Conectar Proyecto**
```bash
cd apps/nova-post-pilot
vercel --prod
```

#### **B. Variables de Entorno (Vercel Dashboard)**
```env
VITE_BACKEND_URL=https://tu-backend.railway.app
VITE_SUPABASE_URL=<tu-supabase-url>
VITE_SUPABASE_ANON_KEY=<tu-supabase-anon-key>
```

---

## 🧪 **TESTING POST-DEPLOY**

### **1. Backend**
```bash
# Health Check
curl https://tu-backend.railway.app/health

# Debe retornar:
# { "status": "ok", "timestamp": "..." }
```

### **2. The Generator**
- [ ] ✅ Abrir `https://the-generator.son1kvers3.com`
- [ ] ✅ Login/Signup funcionando
- [ ] ✅ Generar música
- [ ] ✅ Verificar que solo un audio suena
- [ ] ✅ Historial funcionando
- [ ] ✅ Descargar audio

### **3. Ghost Studio**
- [ ] ✅ Abrir `https://ghost-studio.son1kvers3.com`
- [ ] ✅ Login/Signup funcionando
- [ ] ✅ Grabar audio
- [ ] ✅ Subir archivo
- [ ] ✅ Analizar pista
- [ ] ✅ Ajustar knobs creativos
- [ ] ✅ Generar cover
- [ ] ✅ Verificar que solo un audio suena

### **4. Web Classic**
- [ ] ✅ Abrir `https://son1kvers3.com`
- [ ] ✅ Todos los enlaces funcionando
- [ ] ✅ Navegación correcta
- [ ] ✅ Responsive en móvil

---

## 📋 **CHECKLIST DEPLOY COMPLETO**

### **Pre-Deploy:**
- [x] ✅ Builds exitosos
- [x] ✅ Type-checks exitosos
- [x] ✅ Cambios commiteados
- [x] ✅ Documentación actualizada

### **Deploy Backend:**
- [ ] ⏳ Proyecto creado en Railway/Render
- [ ] ⏳ Variables de entorno configuradas
- [ ] ⏳ Migración ejecutada
- [ ] ⏳ Health check funcionando
- [ ] ⏳ Logs sin errores críticos

### **Deploy Frontends:**
- [ ] ⏳ The Generator deployado
- [ ] ⏳ Ghost Studio deployado
- [ ] ⏳ Web Classic deployado
- [ ] ⏳ Nova Post Pilot deployado
- [ ] ⏳ Variables de entorno configuradas

### **Post-Deploy:**
- [ ] ⏳ Testing end-to-end
- [ ] ⏳ Verificar en múltiples navegadores
- [ ] ⏳ Verificar en móvil
- [ ] ⏳ Verificar que solo un audio suena
- [ ] ⏳ Monitorear logs
- [ ] ⏳ Recopilar feedback

---

## 🚀 **COMANDOS RÁPIDOS**

### **Deploy Backend (Railway)**
```bash
# 1. Conectar repositorio en Railway Dashboard
# 2. Configurar variables de entorno
# 3. Ejecutar migración:
railway run pnpm prisma migrate deploy
```

### **Deploy Frontends (Vercel)**
```bash
# The Generator
cd apps/the-generator && vercel --prod

# Ghost Studio
cd apps/ghost-studio && vercel --prod

# Web Classic
cd apps/web-classic && vercel --prod

# Nova Post Pilot
cd apps/nova-post-pilot && vercel --prod
```

### **Verificar Deploys**
```bash
# Backend Health
curl https://tu-backend.railway.app/health

# Frontends
# Abrir en navegador y verificar
```

---

## ✅ **ESTADO ACTUAL**

**Builds:** ✅ Todos exitosos  
**Type-checks:** ✅ Sin errores críticos  
**Commits:** ✅ Listos  
**Documentación:** ✅ Completa

**Estado:** ✅ **LISTO PARA DEPLOY COMPLETO**

---

## 🎯 **PRÓXIMOS PASOS**

1. ✅ **Deploy Backend**
   - Railway o Render
   - Configurar variables de entorno
   - Ejecutar migración

2. ✅ **Deploy Frontends**
   - Vercel para cada frontend
   - Configurar variables de entorno
   - Verificar deploys

3. ✅ **Testing**
   - End-to-end
   - Múltiples navegadores
   - Móvil

4. ✅ **Lanzamiento Beta**
   - Monitorear
   - Feedback
   - Iterar

---

**¡Listo para deploy completo! 🚀**

