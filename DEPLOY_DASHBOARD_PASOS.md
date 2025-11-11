# 🚀 Deploy desde Dashboard Railway - Pasos Exactos

## ✅ Dashboard Abierto - Listo para Deploy

El dashboard de Railway ya está abierto en tu navegador. Sigue estos pasos:

---

## 📋 PASO 1: Crear Servicio Backend desde GitHub

1. **En el proyecto `son1kvers3-backend`:**
   - Busca el botón **"New"** (verde, arriba a la derecha)
   - Click en **"New"**

2. **Seleccionar tipo de servicio:**
   - Aparecerá un menú
   - Selecciona **"GitHub Repo"**

3. **Conectar repositorio:**
   - Si no está conectado, Railway pedirá autorización a GitHub
   - Busca: `Super-Son1k-2.1-main`
   - O ingresa: `nov4-ix/Super-Son1k-2.1-main`
   - Selecciona la rama: `main`
   - Click **"Deploy"**

4. **Railway detectará automáticamente:**
   - ✅ `railway.toml` en la raíz
   - ✅ Configuración de build y start
   - ✅ Variables de entorno requeridas

5. **Nombre del servicio:**
   - Railway sugerirá un nombre
   - Puedes cambiarlo a `backend` si quieres

---

## 📋 PASO 2: Agregar Redis

1. En el mismo proyecto, click **"New"** nuevamente
2. Selecciona **"Database"**
3. Selecciona **"Redis"**
4. Railway creará automáticamente el servicio Redis
5. La variable `REDIS_URL` se compartirá automáticamente con el servicio backend

---

## 📋 PASO 3: Configurar Variables de Entorno

1. **Ve al servicio `backend`** (el que acabas de crear)
2. Click en la pestaña **"Variables"**
3. Click en **"Raw Editor"** (para editar todas a la vez)
4. **Agrega estas variables** (reemplaza con tus valores reales):

```bash
# Supabase (OBLIGATORIO)
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui

# Suno API (OBLIGATORIO)
SUNO_API_KEY=tu-suno-api-key-aqui

# Frontend URLs (OBLIGATORIO)
FRONTEND_URL=https://the-generator.vercel.app,https://ghost-studio.vercel.app,https://son1kverse.vercel.app

# Backend Secret (OBLIGATORIO - genera uno seguro de 32+ caracteres)
BACKEND_SECRET=tu-backend-secret-super-seguro-minimo-32-caracteres-aqui
```

5. **Variables que Railway crea automáticamente:**
   - `DATABASE_URL` ✅ (del Postgres - ya compartida)
   - `REDIS_URL` ✅ (del Redis - se compartirá automáticamente)
   - `JWT_SECRET` ✅ (Railway lo genera según railway.toml)

6. Click **"Save"** o **"Update"**

---

## 📋 PASO 4: Deploy Automático

Una vez configuradas las variables:
- Railway comenzará el deploy automáticamente
- Puedes ver el progreso en la pestaña **"Deployments"**
- Los logs aparecerán en tiempo real

**Tiempo estimado:** 5-10 minutos para el build y deploy

---

## 📋 PASO 5: Ejecutar Migraciones

Después del primer deploy exitoso:

1. Ve al servicio `backend`
2. Click en **"Deployments"**
3. Click en **"New Deployment"** o **"Redeploy"**
4. En **"Command"**, ingresa:
   ```
   cd packages/backend && npm run db:migrate
   ```
5. Click **"Deploy"**

---

## ✅ Verificación

### **1. Obtener URL del servicio:**
- Ve al servicio `backend`
- Click en **"Settings"** → **"Networking"**
- Copia la URL (ej: `https://backend-production-xxxx.up.railway.app`)

### **2. Health Check:**
Abre en el navegador o usa curl:
```
https://tu-backend.railway.app/health
```

**Debería retornar:**
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

### **3. Verificar Logs:**
En **"Deployments"** → **"View Logs"**, busca:
```
✅ "🚀 Super-Son1k-2.0 Backend running"
✅ "⚙️ BullMQ queue system active"
✅ "🔗 WebSocket server ready"
✅ "Generation worker initialized"
```

---

## 🎯 Resumen

**Estado:** ✅ Dashboard abierto, listo para crear servicios  
**Tiempo estimado:** 20-30 minutos total  
**Siguiente:** Crear servicio backend desde GitHub en el dashboard

---

**Dashboard:** Ya abierto en tu navegador  
**Proyecto:** son1kvers3-backend  
**Repositorio:** nov4-ix/Super-Son1k-2.1-main

