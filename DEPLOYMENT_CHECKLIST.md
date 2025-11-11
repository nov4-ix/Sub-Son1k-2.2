# ✅ Deployment Checklist - Backend Super-Son1k-2.1

## 📊 Estado Actual

```
✅ Código commiteado: commit 729ce51
✅ Push a GitHub: exitoso
✅ BullMQ implementado: completo
⏳ Deployment: pendiente
```

---

## 🚀 Pasos para Deployment en Railway

### Paso 1: Instalar Dependencias (Local - Opcional)

Si quieres probar localmente primero:

```bash
cd packages/backend
npm install
```

Esto instalará `bullmq` y otras dependencias.

---

### Paso 2: Setup Railway

1. **Ir a [railway.app](https://railway.app)**
2. **Iniciar sesión con GitHub**
3. **Nuevo Proyecto** → **Deploy from GitHub repo**
4. **Seleccionar:** `nov4-ix/Super-Son1k-2.1-main`
5. **Railway detectará automáticamente** `railway.toml`

---

### Paso 3: Agregar Servicios

#### 3.1 PostgreSQL Database

1. En el proyecto Railway, click **"New"** → **"Database"** → **"PostgreSQL"**
2. Railway creará automáticamente la variable `DATABASE_URL`
3. **Copiar la URL** (la necesitarás para migraciones)

#### 3.2 Redis

1. Click **"New"** → **"Database"** → **"Redis"**
2. Railway creará automáticamente la variable `REDIS_URL`

---

### Paso 4: Configurar Variables de Entorno

En tu servicio backend en Railway, ve a **"Variables"** y agrega:

#### Variables Requeridas:

```bash
# Database (automático si usas Railway PostgreSQL)
DATABASE_URL=postgresql://... (ya configurado por Railway)

# Redis (automático si usas Railway Redis)
REDIS_URL=redis://... (ya configurado por Railway)

# JWT Secret (generar uno seguro)
JWT_SECRET=tu-secret-super-seguro-aqui-minimo-32-caracteres

# Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# Suno API
SUNO_API_URL=https://ai.imgkits.com/suno
SUNO_POLLING_URL=https://usa.imgkits.com/node-api/suno
SUNO_API_KEY=tu-suno-api-key

# Frontend URLs (separadas por coma)
FRONTEND_URL=https://the-generator.vercel.app,https://ghost-studio.vercel.app,https://son1kverse.vercel.app

# Backend Secret
BACKEND_SECRET=tu-backend-secret-super-seguro

# Environment
NODE_ENV=production
PORT=3001
LOG_LEVEL=info

# Queue Configuration (opcional, valores por defecto)
GENERATION_CONCURRENCY=5
GENERATION_RATE_LIMIT=10
```

#### Variables Opcionales (Stripe):

```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_PREMIUM_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...
```

---

### Paso 5: Ejecutar Migraciones

**Opción A: Desde Railway CLI**

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link al proyecto
railway link

# Ejecutar migraciones
railway run --service backend npm run db:migrate
```

**Opción B: Desde Railway Dashboard**

1. Ve a tu servicio backend
2. Click en **"Deployments"** → **"New Deployment"**
3. En **"Command"**, usa: `cd packages/backend && npm run db:migrate`
4. Click **"Deploy"**

---

### Paso 6: Verificar Deployment

1. **Esperar a que el build termine** (verás logs en Railway)
2. **Verificar health endpoint:**

```bash
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

---

### Paso 7: Test Generación

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

Debería retornar:
```json
{
  "success": true,
  "data": {
    "generationId": "...",
    "status": "pending",
    "message": "Generation queued successfully..."
  }
}
```

---

### Paso 8: Actualizar Frontend

En cada app frontend (Vercel), actualiza las variables de entorno:

#### The Generator:
```bash
VITE_BACKEND_URL=https://tu-backend.railway.app
VITE_BACKEND_SECRET=tu-backend-secret
```

#### Ghost Studio:
```bash
VITE_BACKEND_URL=https://tu-backend.railway.app
VITE_BACKEND_SECRET=tu-backend-secret
```

Los cambios se aplicarán automáticamente en Vercel.

---

## ✅ Checklist Final

- [ ] Railway proyecto creado
- [ ] PostgreSQL configurado
- [ ] Redis configurado
- [ ] Variables de entorno configuradas
- [ ] Migraciones ejecutadas
- [ ] Backend deployado
- [ ] Health endpoint responde
- [ ] Test generación funciona
- [ ] Frontend actualizado
- [ ] WebSocket conecta correctamente

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'bullmq'"

**Solución:** Verificar que `npm install` se ejecutó correctamente en el build.

### Error: "Redis connection failed"

**Solución:** 
- Verificar `REDIS_URL` en variables
- Verificar que Redis service esté corriendo en Railway

### Error: "Database connection failed"

**Solución:**
- Verificar `DATABASE_URL` en variables
- Ejecutar migraciones: `railway run npm run db:migrate`

### Error: "Worker not processing jobs"

**Solución:**
- Verificar logs del worker en Railway
- Verificar que Redis esté conectado
- Verificar `GENERATION_CONCURRENCY` en variables

---

## 📊 Monitoreo

### Railway Metrics

- Ve a **"Metrics"** en Railway
- Monitorea:
  - CPU usage
  - Memory usage
  - Network traffic
  - Request count

### Logs

- Ve a **"Deployments"** → **"View Logs"**
- Busca:
  - `Generation worker initialized`
  - `BullMQ queue system active`
  - `WebSocket server ready`

---

## 🎉 ¡Listo!

Una vez completado el checklist, tu backend estará:
- ✅ Deployado en producción
- ✅ Procesando generaciones asíncronamente
- ✅ Enviando updates en tiempo real
- ✅ Escalable horizontalmente

---

**Última actualización:** Enero 2025

