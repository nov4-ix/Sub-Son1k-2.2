# 🚀 Deploy CLI - Guía Completa

**Fecha:** 30 de enero, 2025  
**Estado:** ✅ **LISTO PARA DEPLOY POR CLI**

---

## 📋 **PRE-REQUISITOS**

### **Instalar Railway CLI**
```bash
# Windows (PowerShell)
iwr https://railway.app/install.ps1 | iex

# O con npm
npm i -g @railway/cli
```

### **Instalar Vercel CLI**
```bash
npm i -g vercel
```

### **Login**
```bash
# Railway
railway login

# Vercel
vercel login
```

---

## 🚀 **DEPLOY BACKEND (Railway CLI)**

### **Paso 1: Inicializar Proyecto**
```bash
cd packages/backend
railway init
```

### **Paso 2: Conectar a Proyecto Existente (Opcional)**
```bash
railway link
```

### **Paso 3: Configurar Variables de Entorno**
```bash
# Variables obligatorias
railway variables set DATABASE_URL=<tu-postgres-url>
railway variables set REDIS_URL=<tu-redis-url>
railway variables set JWT_SECRET=<generar-secreto-min-32-chars>
railway variables set SUPABASE_URL=<tu-supabase-url>
railway variables set SUPABASE_SERVICE_ROLE_KEY=<tu-supabase-service-key>
railway variables set SUNO_API_KEY=<tu-suno-api-key>
railway variables set FRONTEND_URL=https://the-generator.son1kvers3.com
railway variables set BACKEND_SECRET=<generar-secreto-min-32-chars>

# Variables opcionales
railway variables set GENERATION_API_URL=https://ai.imgkits.com/suno
railway variables set GENERATION_POLLING_URL=https://usa.imgkits.com/node-api/suno
railway variables set NODE_ENV=production
railway variables set PORT=3001
railway variables set LOG_LEVEL=info
```

### **Paso 4: Deploy**
```bash
railway up
```

### **Paso 5: Ejecutar Migración**
```bash
railway run pnpm prisma migrate deploy
```

### **Paso 6: Verificar**
```bash
railway status
railway logs
```

---

## 🚀 **DEPLOY FRONTENDS (Vercel CLI)**

### **The Generator**

#### **1. Inicializar Proyecto**
```bash
cd apps/the-generator
vercel --prod
```

#### **2. Configurar Variables de Entorno**
```bash
vercel env add VITE_BACKEND_URL production
# Ingresa: https://tu-backend.railway.app

vercel env add VITE_SUPABASE_URL production
# Ingresa: <tu-supabase-url>

vercel env add VITE_SUPABASE_ANON_KEY production
# Ingresa: <tu-supabase-anon-key>
```

#### **3. Deploy**
```bash
vercel --prod
```

---

### **Ghost Studio**

#### **1. Inicializar Proyecto**
```bash
cd apps/ghost-studio
vercel --prod
```

#### **2. Configurar Variables de Entorno**
```bash
vercel env add VITE_BACKEND_URL production
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
```

#### **3. Deploy**
```bash
vercel --prod
```

---

### **Web Classic**

#### **1. Inicializar Proyecto**
```bash
cd apps/web-classic
vercel --prod
```

#### **2. Configurar Variables de Entorno**
```bash
vercel env add VITE_BACKEND_URL production
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
```

#### **3. Deploy**
```bash
vercel --prod
```

---

### **Nova Post Pilot**

#### **1. Inicializar Proyecto**
```bash
cd apps/nova-post-pilot
vercel --prod
```

#### **2. Configurar Variables de Entorno**
```bash
vercel env add VITE_BACKEND_URL production
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
```

#### **3. Deploy**
```bash
vercel --prod
```

---

## 🧪 **VERIFICACIÓN POST-DEPLOY**

### **Backend**
```bash
# Health check
curl https://tu-backend.railway.app/health

# Logs
railway logs
```

### **Frontends**
```bash
# Verificar URLs
vercel ls

# Verificar logs
vercel logs
```

---

## 📋 **COMANDOS ÚTILES**

### **Railway**
```bash
# Ver estado
railway status

# Ver logs
railway logs

# Ver variables
railway variables

# Abrir en navegador
railway open

# Conectar a shell
railway shell
```

### **Vercel**
```bash
# Listar proyectos
vercel ls

# Ver logs
vercel logs

# Ver variables de entorno
vercel env ls

# Abrir en navegador
vercel open
```

---

## ✅ **ESTADO FINAL**

**Estado:** ✅ **LISTO PARA DEPLOY POR CLI**

**Próximo paso:** Ejecutar comandos de deploy

---

**¡Listo para deploy por CLI! 🚀**

