# 🚀 Instrucciones de Deploy - Son1kVerse 2.2

**Fecha:** 30 de enero, 2025  
**Estado:** Listo para deploy

---

## 📋 **PRE-DEPLOY CHECKLIST**

### **1. Verificar Preparación**

Ejecuta el script de verificación:

```powershell
.\scripts\deploy-check.ps1
```

Este script verifica:
- ✅ Estructura del proyecto
- ✅ Dependencias instaladas
- ✅ Variables de entorno
- ✅ Builds exitosos
- ✅ Type-check
- ✅ Configuraciones de deploy

---

## 🚀 **DEPLOY BACKEND**

### **Opción A: Railway (Recomendado)**

#### **1. Crear Proyecto en Railway**

1. Ve a https://railway.app
2. Click "New Project"
3. Selecciona "Deploy from GitHub repo"
4. Conecta tu repositorio

#### **2. Configurar Proyecto**

- **Root Directory:** `packages/backend`
- **Build Command:** `pnpm install && pnpm run build`
- **Start Command:** `pnpm run start`
- **Health Check Path:** `/health`

#### **3. Variables de Entorno**

Configura las siguientes variables en Railway Dashboard:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Redis
REDIS_URL=redis://host:port

# Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# JWT
JWT_SECRET=tu-jwt-secret-generado

# Generation API
GENERATION_API_URL=https://ai.imgkits.com/suno
SUNO_API_URL=https://ai.imgkits.com/suno
SUNO_POLLING_URL=https://usa.imgkits.com/node-api/suno

# Backend Secret
BACKEND_SECRET=tu-backend-secret-generado

# Frontend URL
FRONTEND_URL=https://tu-frontend.vercel.app

# Environment
NODE_ENV=production
PORT=3001
LOG_LEVEL=info
```

#### **4. Ejecutar Migración**

Después del primer deploy, ejecuta la migración:

```bash
# Desde Railway CLI o terminal
cd packages/backend
pnpm prisma migrate deploy
```

O desde Railway Dashboard:
1. Ve a tu proyecto
2. Click "Deployments"
3. Click "View Logs"
4. Ejecuta: `pnpm prisma migrate deploy`

#### **5. Verificar Health Check**

```bash
curl https://tu-backend.railway.app/health
```

Debe responder:
```json
{
  "status": "ok",
  "timestamp": "..."
}
```

---

### **Opción B: Render**

#### **1. Crear Servicio en Render**

1. Ve a https://render.com
2. Click "New +" → "Web Service"
3. Conecta tu repositorio GitHub

#### **2. Configurar Servicio**

- **Name:** `son1kverse-backend`
- **Root Directory:** `packages/backend`
- **Build Command:** `cd packages/backend && pnpm install && pnpm run build`
- **Start Command:** `cd packages/backend && pnpm run start`
- **Health Check Path:** `/health`

#### **3. Variables de Entorno**

Configura las mismas variables que en Railway (ver arriba).

#### **4. Ejecutar Migración**

Igual que en Railway (ver arriba).

---

## 🌐 **DEPLOY FRONTENDS**

### **The Generator**

#### **1. Conectar a Vercel**

```bash
cd apps/the-generator
vercel login
vercel link
```

#### **2. Configurar en Vercel Dashboard**

- **Root Directory:** `apps/the-generator`
- **Framework Preset:** Vite
- **Build Command:** `pnpm install && pnpm run build`
- **Output Directory:** `dist`

#### **3. Variables de Entorno**

```env
VITE_BACKEND_URL=https://tu-backend.railway.app
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

#### **4. Deploy**

```bash
vercel --prod
```

O desde Vercel Dashboard:
1. Ve a tu proyecto
2. Click "Deployments"
3. Click "Deploy"

---

### **Ghost Studio**

#### **1. Conectar a Vercel**

```bash
cd apps/ghost-studio
vercel login
vercel link
```

#### **2. Configurar en Vercel Dashboard**

- **Root Directory:** `apps/ghost-studio`
- **Framework Preset:** Vite
- **Build Command:** `pnpm install && pnpm run build`
- **Output Directory:** `dist`

#### **3. Variables de Entorno**

```env
VITE_BACKEND_URL=https://tu-backend.railway.app
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

#### **4. Deploy**

```bash
vercel --prod
```

---

### **Web Classic (Landing)**

#### **1. Conectar a Vercel**

```bash
cd apps/web-classic
vercel login
vercel link
```

#### **2. Configurar en Vercel Dashboard**

- **Root Directory:** `apps/web-classic`
- **Framework Preset:** Vite
- **Build Command:** `pnpm install && pnpm run build`
- **Output Directory:** `dist`

#### **3. Variables de Entorno**

```env
VITE_BACKEND_URL=https://tu-backend.railway.app
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

#### **4. Deploy**

```bash
vercel --prod
```

---

### **Nova Post Pilot**

#### **1. Conectar a Vercel**

```bash
cd apps/nova-post-pilot
vercel login
vercel link
```

#### **2. Configurar en Vercel Dashboard**

- **Root Directory:** `apps/nova-post-pilot`
- **Framework Preset:** Vite
- **Build Command:** `pnpm install && pnpm run build`
- **Output Directory:** `dist`

#### **3. Variables de Entorno**

```env
VITE_BACKEND_URL=https://tu-backend.railway.app
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

#### **4. Deploy**

```bash
vercel --prod
```

---

## 🔧 **SCRIPTS DE DEPLOY**

### **Verificar Preparación**

```powershell
.\scripts\deploy-check.ps1
```

### **Deploy Backend**

```powershell
.\scripts\deploy-backend.ps1 -Platform railway
```

### **Deploy Frontend**

```powershell
# Deploy todos los frontends
.\scripts\deploy-frontend.ps1 -App all -Production

# Deploy solo The Generator
.\scripts\deploy-frontend.ps1 -App the-generator -Production

# Deploy solo Ghost Studio
.\scripts\deploy-frontend.ps1 -App ghost-studio -Production
```

---

## ✅ **POST-DEPLOY VERIFICATION**

### **1. Backend**

```bash
# Health check
curl https://tu-backend.railway.app/health

# Debe responder:
# {"status":"ok","timestamp":"..."}
```

### **2. Frontends**

```bash
# The Generator
curl https://the-generator.vercel.app

# Ghost Studio
curl https://ghost-studio.vercel.app

# Web Classic
curl https://web-classic.vercel.app
```

### **3. End-to-End Testing**

1. ✅ Abrir landing page
2. ✅ Login funciona
3. ✅ Generar música funciona
4. ✅ Audio se reproduce
5. ✅ Solo un audio suena a la vez
6. ✅ Historial funciona
7. ✅ Descarga funciona

---

## 🚨 **TROUBLESHOOTING**

### **Error: Build failed**

```bash
# Verificar dependencias
pnpm install

# Verificar TypeScript
pnpm type-check

# Verificar build
pnpm build
```

### **Error: Variables de entorno no encontradas**

- Verifica que estén configuradas en Vercel/Railway
- Verifica que tengan el prefijo correcto (`VITE_` para Vite, `NEXT_PUBLIC_` para Next.js)

### **Error: Audio múltiple**

- Verifica que se use `useAudioStore`
- Verifica que no se creen múltiples `Audio` instances

### **Error: Migración falló**

```bash
# Verificar conexión a base de datos
pnpm prisma studio

# Verificar migraciones pendientes
pnpm prisma migrate status

# Aplicar migraciones
pnpm prisma migrate deploy
```

---

## 📊 **ESTADO FINAL**

**Listo para:**
- ✅ Deploy backend (Railway/Render)
- ✅ Deploy frontends (Vercel)
- ✅ Testing end-to-end
- ✅ Lanzamiento beta

**Siguiente paso:**
1. Ejecutar `deploy-check.ps1`
2. Deploy backend
3. Deploy frontends
4. Testing end-to-end
5. Lanzar beta 🚀

---

**¡Listo para lanzar beta! 🎉**

