# 🚀 Deploy Automático - Pasos Rápidos

## ⚠️ Plan Limitado Detectado

Railway CLI requiere un plan activo para hacer deploy. Vamos a hacerlo desde el dashboard.

---

## 📋 PASOS RÁPIDOS (Dashboard)

### **1. Crear Servicio Backend**

1. Dashboard ya abierto en tu navegador
2. En el proyecto `son1kvers3-backend`, click **"New"**
3. Selecciona **"GitHub Repo"**
4. Repo: `nov4-ix/Super-Son1k-2.1-main`
5. Railway detectará automáticamente `railway.toml`
6. Nombre: `backend`

### **2. Agregar Redis**

1. Click **"New"** → **"Database"** → **"Redis"**
2. Railway creará automáticamente `REDIS_URL`

### **3. Configurar Variables (Backend Service)**

En el servicio `backend` → **"Variables"**, agrega:

```bash
# Supabase (OBLIGATORIO)
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# Suno API (OBLIGATORIO)
SUNO_API_KEY=tu-suno-api-key

# Frontend URLs (OBLIGATORIO)
FRONTEND_URL=https://the-generator.vercel.app,https://ghost-studio.vercel.app,https://son1kverse.vercel.app

# Backend Secret (OBLIGATORIO)
BACKEND_SECRET=tu-backend-secret-super-seguro
```

**AUTOMÁTICAS (Railway las crea):**
- `DATABASE_URL` ✅ (del Postgres existente)
- `REDIS_URL` ✅ (del Redis que creaste)
- `JWT_SECRET` ✅ (Railway lo genera automáticamente)

### **4. Deploy Automático**

Railway detectará automáticamente y desplegará cuando:
- Haces push a `main` (si auto-deploy está activado)
- O manualmente desde **"Deployments"** → **"Redeploy"**

---

## ✅ Verificación

Después del deploy, verifica:

1. **Health Check:**
   ```
   https://tu-backend.railway.app/health
   ```

2. **Logs:**
   Busca en logs:
   - ✅ "🚀 Super-Son1k-2.0 Backend running"
   - ✅ "⚙️ BullMQ queue system active"
   - ✅ "🔗 WebSocket server ready"

---

**Estado:** Dashboard abierto, listo para crear servicios

