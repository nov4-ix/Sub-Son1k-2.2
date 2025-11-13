# 🚀 Deploy Full - Instrucciones Completas

**Fecha:** 30 de enero, 2025  
**Estado:** ✅ **COMMIT Y PUSH EXITOSOS - LISTO PARA DEPLOY**

---

## ✅ **ESTADO ACTUAL**

- ✅ **79 archivos** modificados/creados
- ✅ **Commit exitoso:** `ab356f5`
- ✅ **Push exitoso:** `origin/main`
- ✅ **Builds exitosos:** Backend, The Generator, Ghost Studio, Web Classic
- ✅ **Documentación completa**

---

## 🚀 **DEPLOY BACKEND (Railway)**

### **Paso 1: Crear Proyecto**
1. Ve a https://railway.app
2. Click **"New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Conecta: `nov4-ix/Sub-Son1k-2.2`

### **Paso 2: Configurar Servicio**
- **Name:** `son1kverse-backend`
- **Root Directory:** `packages/backend`
- **Build Command:** `pnpm install && pnpm run build`
- **Start Command:** `pnpm run start`
- **Health Check Path:** `/health`
- **Health Check Timeout:** `300`

### **Paso 3: Variables de Entorno**

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
NODE_ENV=production
PORT=3001
LOG_LEVEL=info
GENERATION_CONCURRENCY=50
GENERATION_RATE_LIMIT=100
MIN_TOKENS=50
MAX_TOKENS=2000
```

### **Paso 4: Ejecutar Migración**
```bash
# En Railway Dashboard → Deployments → View Logs → Shell
railway run pnpm prisma migrate deploy
```

### **Paso 5: Verificar**
```bash
curl https://tu-backend.railway.app/health
# Debe retornar: { "status": "ok", "timestamp": "..." }
```

---

## 🚀 **DEPLOY FRONTENDS (Vercel)**

### **The Generator**

#### **1. Conectar Proyecto**
```bash
cd apps/the-generator
vercel --prod
```

#### **2. Configurar en Vercel Dashboard**
- **Framework Preset:** Vite
- **Root Directory:** `apps/the-generator`
- **Build Command:** `pnpm install && pnpm run build`
- **Output Directory:** `dist`
- **Install Command:** `pnpm install`

#### **3. Variables de Entorno**
```env
VITE_BACKEND_URL=https://tu-backend.railway.app
VITE_SUPABASE_URL=<tu-supabase-url>
VITE_SUPABASE_ANON_KEY=<tu-supabase-anon-key>
```

#### **4. Verificar**
- URL: `https://the-generator.son1kvers3.com`
- Debe cargar sin errores
- Login/Signup funcionando

---

### **Ghost Studio**

#### **1. Conectar Proyecto**
```bash
cd apps/ghost-studio
vercel --prod
```

#### **2. Configurar en Vercel Dashboard**
- **Framework Preset:** Vite
- **Root Directory:** `apps/ghost-studio`
- **Build Command:** `pnpm install && pnpm run build`
- **Output Directory:** `dist`
- **Install Command:** `pnpm install`

#### **3. Variables de Entorno**
```env
VITE_BACKEND_URL=https://tu-backend.railway.app
VITE_SUPABASE_URL=<tu-supabase-url>
VITE_SUPABASE_ANON_KEY=<tu-supabase-anon-key>
```

#### **4. Verificar**
- URL: `https://ghost-studio.son1kvers3.com`
- Debe cargar sin errores
- Audio recorder funcionando

---

### **Web Classic**

#### **1. Conectar Proyecto**
```bash
cd apps/web-classic
vercel --prod
```

#### **2. Configurar en Vercel Dashboard**
- **Framework Preset:** Vite
- **Root Directory:** `apps/web-classic`
- **Build Command:** `pnpm install && pnpm run build`
- **Output Directory:** `dist`
- **Install Command:** `pnpm install`

#### **3. Variables de Entorno**
```env
VITE_BACKEND_URL=https://tu-backend.railway.app
VITE_SUPABASE_URL=<tu-supabase-url>
VITE_SUPABASE_ANON_KEY=<tu-supabase-anon-key>
```

#### **4. Verificar**
- URL: `https://son1kvers3.com`
- Todos los enlaces funcionando

---

### **Nova Post Pilot**

#### **1. Conectar Proyecto**
```bash
cd apps/nova-post-pilot
vercel --prod
```

#### **2. Configurar en Vercel Dashboard**
- **Framework Preset:** Vite
- **Root Directory:** `apps/nova-post-pilot`
- **Build Command:** `pnpm install && pnpm run build`
- **Output Directory:** `dist`
- **Install Command:** `pnpm install`

#### **3. Variables de Entorno**
```env
VITE_BACKEND_URL=https://tu-backend.railway.app
VITE_SUPABASE_URL=<tu-supabase-url>
VITE_SUPABASE_ANON_KEY=<tu-supabase-anon-key>
```

---

## 🧪 **TESTING POST-DEPLOY**

### **Backend**
```bash
# Health Check
curl https://tu-backend.railway.app/health

# Debe retornar:
# { "status": "ok", "timestamp": "..." }
```

### **The Generator**
- [ ] ✅ Abrir `https://the-generator.son1kvers3.com`
- [ ] ✅ Login/Signup funcionando
- [ ] ✅ Generar música
- [ ] ✅ Solo un audio suena
- [ ] ✅ Historial funcionando
- [ ] ✅ Descargar audio

### **Ghost Studio**
- [ ] ✅ Abrir `https://ghost-studio.son1kvers3.com`
- [ ] ✅ Login/Signup funcionando
- [ ] ✅ Grabar audio
- [ ] ✅ Subir archivo
- [ ] ✅ Analizar pista
- [ ] ✅ Ajustar knobs
- [ ] ✅ Generar cover
- [ ] ✅ Solo un audio suena

### **Web Classic**
- [ ] ✅ Abrir `https://son1kvers3.com`
- [ ] ✅ Todos los enlaces funcionando
- [ ] ✅ Navegación correcta
- [ ] ✅ Responsive en móvil

---

## 📋 **CHECKLIST DEPLOY**

### **Backend**
- [ ] ⏳ Proyecto creado en Railway
- [ ] ⏳ Variables de entorno configuradas
- [ ] ⏳ Migración ejecutada
- [ ] ⏳ Health check funcionando
- [ ] ⏳ Logs sin errores

### **Frontends**
- [ ] ⏳ The Generator deployado
- [ ] ⏳ Ghost Studio deployado
- [ ] ⏳ Web Classic deployado
- [ ] ⏳ Nova Post Pilot deployado
- [ ] ⏳ Variables de entorno configuradas
- [ ] ⏳ Todos los deploys verificados

### **Testing**
- [ ] ⏳ Backend health check
- [ ] ⏳ The Generator funcionando
- [ ] ⏳ Ghost Studio funcionando
- [ ] ⏳ Web Classic funcionando
- [ ] ⏳ Solo un audio suena
- [ ] ⏳ Autenticación funcionando

---

## ✅ **ESTADO FINAL**

**Commits:** ✅ Exitosos  
**Push:** ✅ Exitoso  
**Builds:** ✅ Todos exitosos  
**Documentación:** ✅ Completa

**Estado:** ✅ **100% LISTO PARA DEPLOY COMPLETO**

---

## 🚀 **PRÓXIMOS PASOS**

1. ✅ **Deploy Backend a Railway**
   - Crear proyecto
   - Configurar variables
   - Ejecutar migración

2. ✅ **Deploy Frontends a Vercel**
   - The Generator
   - Ghost Studio
   - Web Classic
   - Nova Post Pilot

3. ✅ **Testing**
   - End-to-end
   - Múltiples navegadores
   - Móvil

4. ✅ **Lanzamiento Beta**
   - Monitorear
   - Feedback
   - Iterar

---

**¡Todo listo para deploy completo! 🚀**

