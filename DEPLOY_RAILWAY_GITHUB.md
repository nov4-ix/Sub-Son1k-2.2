# 🚀 Deploy Railway con GitHub - Guía Completa

## ✅ Estado Actual

- ✅ Proyecto linkeado: `son1kvers3-backend`
- ✅ Servicio Postgres existente
- ✅ Railway CLI configurado
- ✅ Código pusheado a GitHub: `nov4-ix/Super-Son1k-2.1-main`

## 📋 PASOS PARA DEPLOY

### **PASO 1: Crear Servicio Backend desde GitHub (Dashboard)**

El dashboard ya está abierto. Sigue estos pasos:

1. **En el proyecto `son1kvers3-backend`:**
   - Click en **"New"** (botón verde)
   - Selecciona **"GitHub Repo"**

2. **Configurar Repositorio:**
   - Busca: `Super-Son1k-2.1-main`
   - O ingresa: `nov4-ix/Super-Son1k-2.1-main`
   - Click **"Deploy"**

3. **Railway detectará automáticamente:**
   - ✅ `railway.toml` para configuración
   - ✅ `packages/backend/` como directorio del servicio
   - ✅ Build y start commands

4. **Nombre del servicio:**
   - Railway sugerirá un nombre, puedes cambiarlo a `backend`

### **PASO 2: Agregar Redis**

1. En el mismo proyecto, click **"New"**
2. Selecciona **"Database"** → **"Redis"**
3. Railway creará automáticamente `REDIS_URL`

### **PASO 3: Configurar Variables de Entorno**

En el servicio `backend` → **"Variables"** → **"Raw Editor"**, agrega:

```bash
# Supabase (OBLIGATORIO - reemplaza con tus valores)
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui

# Suno API (OBLIGATORIO - reemplaza con tu API key)
SUNO_API_KEY=tu-suno-api-key-aqui

# Frontend URLs (OBLIGATORIO)
FRONTEND_URL=https://the-generator.vercel.app,https://ghost-studio.vercel.app,https://son1kverse.vercel.app

# Backend Secret (OBLIGATORIO - genera uno seguro)
BACKEND_SECRET=tu-backend-secret-super-seguro-minimo-32-caracteres
```

**Variables AUTOMÁTICAS (Railway las crea):**
- `DATABASE_URL` ✅ (del servicio Postgres - compartida automáticamente)
- `REDIS_URL` ✅ (del servicio Redis - compartida automáticamente)
- `JWT_SECRET` ✅ (Railway lo genera automáticamente según `railway.toml`)

**Variables OPCIONALES (ya configuradas en railway.toml):**
- `GENERATION_CONCURRENCY=50`
- `GENERATION_RATE_LIMIT=100`
- `MIN_TOKENS=50`
- `MAX_TOKENS=2000`

### **PASO 4: Deploy Automático**

Una vez creado el servicio:
- Railway comenzará el deploy automáticamente
- Puedes ver el progreso en **"Deployments"**
- Los logs aparecerán en tiempo real

### **PASO 5: Ejecutar Migraciones**

Después del primer deploy, ejecuta migraciones:

**Opción A: Desde Railway CLI**
```bash
railway service backend
railway run npm run db:migrate
```

**Opción B: Desde Dashboard**
1. Ve al servicio `backend`
2. Click **"Deployments"** → **"New Deployment"**
3. Command: `cd packages/backend && npm run db:migrate`
4. Click **"Deploy"**

---

## ✅ Verificación Post-Deploy

### **1. Health Check:**

Obtén la URL del servicio desde Railway dashboard y prueba:

```bash
curl https://tu-backend.railway.app/health
```

**Respuesta esperada:**
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
✅ "Token pool initialized"
```

### **3. Test Generación:**

```bash
curl -X POST https://tu-backend.railway.app/api/generation/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer tu-token" \
  -d '{
    "prompt": "test song",
    "style": "pop",
    "duration": 60
  }'
```

---

## 🔄 Auto-Deploy desde GitHub

Una vez configurado, Railway hará auto-deploy cuando:
- Haces push a la rama `main`
- Se activa automáticamente si está habilitado

Para habilitar:
1. Ve al servicio `backend`
2. Click **"Settings"** → **"Source"**
3. Asegúrate que **"Auto Deploy"** esté activado

---

## 🎯 Resumen

**Estado:** ✅ Código listo, Railway configurado  
**Siguiente:** Crear servicio desde dashboard (ya abierto)  
**Tiempo:** 15-20 minutos

**Dashboard abierto:** Listo para crear servicios

---

**Última actualización:** Enero 2025

