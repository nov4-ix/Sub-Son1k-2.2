# 🚀 Guía de Deployment - Backend Super-Son1k-2.1

## 📋 Prerequisitos

- Cuenta en Railway (o Render/Heroku)
- PostgreSQL database
- Redis instance
- Variables de entorno configuradas

---

## 🔧 Paso 1: Setup Railway

### 1.1 Crear cuenta y proyecto

1. Ve a [railway.app](https://railway.app)
2. Inicia sesión con GitHub
3. Click en "New Project"
4. Selecciona "Deploy from GitHub repo"
5. Conecta tu repositorio `Super-Son1k-2.1-main`

### 1.2 Configurar servicio

Railway detectará automáticamente el archivo `railway.toml` en la raíz del proyecto.

---

## 🗄️ Paso 2: Configurar PostgreSQL

### 2.1 Crear database

1. En Railway, click "New" → "Database" → "PostgreSQL"
2. Railway creará automáticamente la variable `DATABASE_URL`
3. Copia la URL (se usará más adelante)

### 2.2 Ejecutar migraciones

```bash
# Opción 1: Desde Railway CLI
railway run npm run db:migrate

# Opción 2: Desde local (conectado a Railway)
railway link
railway run npm run db:migrate
```

---

## 🔴 Paso 3: Configurar Redis

### 3.1 Crear Redis instance

1. En Railway, click "New" → "Database" → "Redis"
2. Railway creará automáticamente la variable `REDIS_URL`
3. Copia la URL

### 3.2 Verificar conexión

Redis se conectará automáticamente cuando el backend inicie.

---

## 🔐 Paso 4: Variables de Entorno

### 4.1 Variables requeridas

En Railway, ve a tu servicio → "Variables" y agrega:

```bash
# Database (automático si usas Railway PostgreSQL)
DATABASE_URL=postgresql://user:pass@host:port/db

# Redis (automático si usas Railway Redis)
REDIS_URL=redis://host:port

# JWT
JWT_SECRET=tu-secret-super-seguro-aqui

# Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# Suno API
SUNO_API_URL=https://ai.imgkits.com/suno
SUNO_POLLING_URL=https://usa.imgkits.com/node-api/suno
SUNO_API_KEY=tu-suno-api-key

# Frontend URLs (separadas por coma)
FRONTEND_URL=https://the-generator.vercel.app,https://ghost-studio.vercel.app,https://son1kverse.vercel.app

# Backend Secret (para autenticación service-to-service)
BACKEND_SECRET=tu-backend-secret-super-seguro

# Environment
NODE_ENV=production
PORT=3001
LOG_LEVEL=info

# Queue Configuration (opcional)
GENERATION_CONCURRENCY=5
GENERATION_RATE_LIMIT=10
```

### 4.2 Variables opcionales (Stripe)

```bash
# Solo si quieres habilitar pagos
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_PREMIUM_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...
```

---

## 🚀 Paso 5: Deploy

### 5.1 Deploy automático

Railway detectará automáticamente:
- `railway.toml` para configuración
- `packages/backend/package.json` para dependencias
- Build command: `cd packages/backend && npm install && npm run build`
- Start command: `cd packages/backend && npm run start`

### 5.2 Verificar deploy

1. Ve a "Deployments" en Railway
2. Espera a que el build termine
3. Verifica logs para errores
4. Test health endpoint: `https://tu-backend.railway.app/health`

---

## ✅ Paso 6: Verificación

### 6.1 Health Check

```bash
curl https://tu-backend.railway.app/health
```

Debería retornar:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-XX...",
  "version": "1.0.0",
  "environment": "production",
  "services": {
    "database": "healthy",
    "tokenManager": "healthy",
    "sunoService": "healthy",
    ...
  }
}
```

### 6.2 Test Generación

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

## 🔄 Paso 7: Actualizar Frontend

### 7.1 Actualizar URLs

En cada app frontend, actualiza `.env` o variables de Vercel:

```bash
# apps/the-generator/.env
VITE_BACKEND_URL=https://tu-backend.railway.app
VITE_BACKEND_SECRET=tu-backend-secret

# apps/ghost-studio/.env
VITE_BACKEND_URL=https://tu-backend.railway.app
VITE_BACKEND_SECRET=tu-backend-secret
```

### 7.2 Redeploy frontend

Los cambios se aplicarán automáticamente en Vercel.

---

## 📊 Paso 8: Monitoreo

### 8.1 Railway Metrics

- Ve a "Metrics" en Railway
- Monitorea CPU, Memory, Network
- Revisa logs en tiempo real

### 8.2 Health Checks

Railway verificará automáticamente `/health` cada 5 minutos.

---

## 🐛 Troubleshooting

### Error: Database connection failed

```bash
# Verificar DATABASE_URL
railway variables

# Test conexión local
psql $DATABASE_URL
```

### Error: Redis connection failed

```bash
# Verificar REDIS_URL
railway variables

# Test conexión local
redis-cli -u $REDIS_URL ping
```

### Error: Build failed

```bash
# Verificar logs
railway logs

# Build local para debug
cd packages/backend
npm install
npm run build
```

### Error: Worker no inicia

```bash
# Verificar que Redis esté disponible
# Verificar GENERATION_CONCURRENCY en variables
# Revisar logs del worker
```

---

## 🔒 Seguridad

### Variables sensibles

- ✅ NUNCA commits variables sensibles
- ✅ Usa Railway Secrets para todas las keys
- ✅ Rota secrets regularmente
- ✅ Usa diferentes secrets para dev/prod

### Rate Limiting

El backend incluye rate limiting automático:
- FREE: 10 requests/minuto
- PREMIUM: 100 requests/minuto
- ENTERPRISE: 1000 requests/minuto

---

## 📈 Escalabilidad

### Horizontal Scaling

Railway permite escalar automáticamente:
1. Ve a "Settings" → "Scaling"
2. Configura auto-scaling basado en CPU/Memory
3. Múltiples instancias compartirán Redis (cola única)

### Queue Workers

Para más workers:
1. Crea nuevo servicio en Railway
2. Mismo código, pero solo ejecuta worker
3. Configura `WORKER_ONLY=true` (si implementas)

---

## ✅ Checklist Final

- [ ] PostgreSQL configurado y migrado
- [ ] Redis configurado y conectado
- [ ] Todas las variables de entorno configuradas
- [ ] Backend deployado y saludable
- [ ] Health endpoint responde correctamente
- [ ] Frontend actualizado con nueva URL
- [ ] Test de generación funciona
- [ ] WebSocket conecta correctamente
- [ ] Queue system procesa jobs
- [ ] Logs monitoreados

---

## 🎉 ¡Listo!

Tu backend está deployado y funcionando. Ahora puedes:

- ✅ Generar música asíncronamente
- ✅ Recibir updates en tiempo real vía WebSocket
- ✅ Procesar múltiples generaciones en paralelo
- ✅ Escalar automáticamente según demanda

---

**Última actualización:** Enero 2025

