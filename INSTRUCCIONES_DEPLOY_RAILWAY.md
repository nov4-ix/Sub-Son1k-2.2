# 🚀 Instrucciones para Deploy en Railway

## ✅ Estado Actual

- ✅ Railway CLI instalado y configurado
- ✅ Proyecto linkeado: `son1kvers3-backend`
- ✅ PostgreSQL configurado y funcionando
- ✅ Backend código listo y pusheado a GitHub

## ⚠️ Falta: Crear Servicio Backend

El servicio backend aún no existe. Necesitas crearlo desde el dashboard.

---

## 📋 PASOS PARA DEPLOY

### **PASO 1: Crear Servicio Backend (Dashboard)**

1. Ve a https://railway.app
2. Abre el proyecto `son1kvers3-backend`
3. Click en **"New"** → **"GitHub Repo"**
4. Selecciona: `nov4-ix/Super-Son1k-2.1-main`
5. Railway detectará automáticamente `railway.toml`
6. Nombre del servicio: `backend`

### **PASO 2: Crear Servicio Redis**

1. En el mismo proyecto, click **"New"** → **"Database"** → **"Redis"**
2. Railway creará automáticamente `REDIS_URL`

### **PASO 3: Configurar Variables de Entorno**

En el servicio `backend`, ve a **"Variables"** y agrega:

#### **OBLIGATORIAS:**

```bash
# JWT Secret (generar uno seguro de 32+ caracteres)
JWT_SECRET=tu-secret-super-seguro-aqui-minimo-32-caracteres

# Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui

# Suno API
SUNO_API_KEY=tu-suno-api-key-aqui
SUNO_API_URL=https://ai.imgkits.com/suno
SUNO_POLLING_URL=https://usa.imgkits.com/node-api/suno

# Frontend URLs (separadas por coma)
FRONTEND_URL=https://the-generator.vercel.app,https://ghost-studio.vercel.app,https://son1kverse.vercel.app

# Backend Secret (generar uno seguro)
BACKEND_SECRET=tu-backend-secret-super-seguro-aqui
```

#### **OPCIONALES (para optimización):**

```bash
GENERATION_CONCURRENCY=50
GENERATION_RATE_LIMIT=100
MIN_TOKENS=50
MAX_TOKENS=2000
```

#### **AUTOMÁTICAS (Railway las crea):**

- `DATABASE_URL` ✅ (del servicio Postgres - ya configurado)
- `REDIS_URL` ✅ (del servicio Redis - se crea automáticamente)

### **PASO 4: Ejecutar Migraciones**

Desde la terminal (en el directorio del proyecto):

```bash
# Cambiar al servicio backend
railway service backend

# Ejecutar migraciones
railway run npm run db:migrate
```

O desde el dashboard:
1. Ve al servicio `backend`
2. Click en **"Deployments"** → **"New Deployment"**
3. En **"Command"**, usa: `cd packages/backend && npm run db:migrate`
4. Click **"Deploy"**

### **PASO 5: Deploy Automático**

Railway detectará automáticamente:
- `railway.toml` para configuración
- `packages/backend/package.json` para dependencias
- Build y start commands

El deploy comenzará automáticamente cuando:
- Haces push a `main` (si tienes auto-deploy activado)
- O manualmente desde el dashboard

---

## ✅ Verificación Post-Deploy

### **1. Health Check:**

```bash
# Obtener URL del servicio desde Railway dashboard
curl https://tu-backend.railway.app/health
```

Debería retornar:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "services": {
    "database": "healthy",
    "tokenManager": "healthy",
    "sunoService": "healthy"
  }
}
```

### **2. Logs a Verificar:**

En Railway → Servicio `backend` → **"Deployments"** → **"View Logs"**, busca:

```
✅ "🚀 Super-Son1k-2.0 Backend running"
✅ "⚙️ BullMQ queue system active"
✅ "🔗 WebSocket server ready"
✅ "Generation worker initialized"
```

---

## 🎯 Resumen

**Estado:** ✅ Backend 100% listo  
**Falta:** Crear servicio en Railway dashboard  
**Tiempo estimado:** 30-45 minutos

**Siguiente paso:** Ir a Railway dashboard y crear el servicio backend.

---

**Última actualización:** Enero 2025

