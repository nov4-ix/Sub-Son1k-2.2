# 🚨 PLAN DE DEPLOYMENT CRÍTICO - Backend Super-Son1k-2.1

**Prioridad:** 🔴 CRÍTICA  
**Tiempo Estimado:** 2-3 horas  
**Estado:** ⏳ PENDIENTE

---

## ✅ PRE-DEPLOYMENT CHECKLIST

### 1. Código Verificado ✅
- [x] BullMQ implementado y funcionando
- [x] WebSocket implementado y funcionando
- [x] Error handling robusto
- [x] Todas las rutas configuradas
- [x] Servicios inicializados correctamente
- [x] Railway.toml configurado

### 2. Dependencias Verificadas ✅
- [x] `bullmq` en package.json
- [x] `socket.io` en package.json
- [x] `ioredis` en package.json
- [x] Todas las dependencias instaladas

### 3. Archivos de Configuración ✅
- [x] `railway.toml` existe y está configurado
- [x] `packages/backend/package.json` tiene scripts correctos
- [x] Variables de entorno documentadas

---

## 🚀 PASOS CRÍTICOS PARA DEPLOYMENT

### **PASO 1: Setup Railway (15 minutos)**

```bash
1. Ir a https://railway.app
2. Login con GitHub
3. Click "New Project"
4. Seleccionar "Deploy from GitHub repo"
5. Conectar repositorio: Super-Son1k-2.1-main
6. Railway detectará automáticamente railway.toml
```

**✅ Verificación:**
- Proyecto creado en Railway
- Repositorio conectado
- Railway detecta `railway.toml`

---

### **PASO 2: Crear PostgreSQL Database (5 minutos)**

```bash
1. En Railway proyecto, click "New"
2. Seleccionar "Database" → "PostgreSQL"
3. Railway creará automáticamente DATABASE_URL
4. Copiar DATABASE_URL (se usará para migraciones)
```

**✅ Verificación:**
- PostgreSQL service creado
- `DATABASE_URL` aparece en variables automáticamente

---

### **PASO 3: Crear Redis Instance (5 minutos)**

```bash
1. En Railway proyecto, click "New"
2. Seleccionar "Database" → "Redis"
3. Railway creará automáticamente REDIS_URL
```

**✅ Verificación:**
- Redis service creado
- `REDIS_URL` aparece en variables automáticamente

---

### **PASO 4: Configurar Variables de Entorno (10 minutos)**

En Railway → Tu servicio backend → "Variables", agregar:

#### **Variables Requeridas (CRÍTICAS):**

```bash
# ✅ Automáticas (ya configuradas por Railway):
# DATABASE_URL - PostgreSQL
# REDIS_URL - Redis

# 🔐 JWT Secret (generar uno seguro):
JWT_SECRET=tu-secret-super-seguro-minimo-32-caracteres-aqui

# 🔐 Supabase (OBLIGATORIO):
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui

# 🎵 Suno API (OBLIGATORIO):
SUNO_API_KEY=tu-suno-api-key-aqui
SUNO_API_URL=https://ai.imgkits.com/suno
SUNO_POLLING_URL=https://usa.imgkits.com/node-api/suno

# 🌐 Frontend URLs (OBLIGATORIO - separadas por coma):
FRONTEND_URL=https://the-generator.vercel.app,https://ghost-studio.vercel.app,https://son1kverse.vercel.app

# 🔐 Backend Secret (OBLIGATORIO - para autenticación):
BACKEND_SECRET=tu-backend-secret-super-seguro-aqui
```

#### **Variables Opcionales:**

```bash
# Queue Configuration (valores por defecto si no se configuran):
GENERATION_CONCURRENCY=5
GENERATION_RATE_LIMIT=10

# Stripe (solo si quieres habilitar pagos):
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_PREMIUM_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...
```

**✅ Verificación:**
- Todas las variables requeridas configuradas
- No hay variables faltantes

---

### **PASO 5: Ejecutar Migraciones de Base de Datos (10 minutos)**

**Opción A: Railway CLI (Recomendado)**

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link al proyecto
railway link

# Ejecutar migraciones
cd packages/backend
railway run npm run db:migrate
```

**Opción B: Desde Railway Dashboard**

1. Ve a tu servicio backend
2. Click "Deployments" → "New Deployment"
3. En "Command", usar: `cd packages/backend && npm run db:migrate`
4. Click "Deploy"

**✅ Verificación:**
- Migraciones ejecutadas sin errores
- Tablas creadas en PostgreSQL

---

### **PASO 6: Deploy Backend (15-20 minutos)**

Railway detectará automáticamente:
- `railway.toml` para configuración
- `packages/backend/package.json` para dependencias
- Build command: `cd packages/backend && npm install && npm run build`
- Start command: `cd packages/backend && npm run start`

**✅ Verificación:**
- Build completado sin errores
- Servicio iniciado correctamente
- Logs muestran: `🚀 Super-Son1k-2.0 Backend running`
- Logs muestran: `⚙️ BullMQ queue system active`
- Logs muestran: `🔗 WebSocket server ready`

---

### **PASO 7: Verificar Health Endpoint (5 minutos)**

```bash
# Obtener URL del servicio desde Railway
curl https://tu-backend.railway.app/health
```

**Respuesta esperada:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-XX...",
  "version": "1.0.0",
  "environment": "production",
  "services": {
    "database": "healthy",
    "tokenManager": "healthy",
    "sunoService": "healthy"
  }
}
```

**✅ Verificación:**
- Health endpoint responde correctamente
- Todos los servicios muestran "healthy"

---

### **PASO 8: Test Generación (10 minutos)**

```bash
# Obtener token de autenticación primero (desde Supabase)
curl -X POST https://tu-backend.railway.app/api/generation/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer tu-token-aqui" \
  -d '{
    "prompt": "test song",
    "style": "pop",
    "duration": 60
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "generationId": "...",
    "status": "pending",
    "message": "Generation queued successfully. You will receive updates via WebSocket."
  }
}
```

**✅ Verificación:**
- Generación se encola correctamente
- Job aparece en BullMQ queue
- WebSocket emite updates

---

### **PASO 9: Actualizar Frontend (10 minutos)**

En cada app frontend (Vercel), actualizar variables de entorno:

#### **The Generator:**
```bash
NEXT_PUBLIC_BACKEND_URL=https://tu-backend.railway.app
NEXT_PUBLIC_BACKEND_SECRET=tu-backend-secret
```

#### **Ghost Studio:**
```bash
VITE_BACKEND_URL=https://tu-backend.railway.app
VITE_BACKEND_SECRET=tu-backend-secret
```

**✅ Verificación:**
- Variables actualizadas en Vercel
- Frontend redeployado automáticamente
- Frontend conecta al backend correctamente

---

## 🐛 TROUBLESHOOTING RÁPIDO

### Error: "Cannot find module 'bullmq'"
**Solución:** Verificar que `npm install` se ejecutó en el build. Revisar logs de Railway.

### Error: "Redis connection failed"
**Solución:**
- Verificar `REDIS_URL` en variables
- Verificar que Redis service esté corriendo
- Revisar logs: `redisConnection.on('error', ...)`

### Error: "Database connection failed"
**Solución:**
- Verificar `DATABASE_URL` en variables
- Ejecutar migraciones: `railway run npm run db:migrate`
- Verificar que PostgreSQL esté corriendo

### Error: "Worker not processing jobs"
**Solución:**
- Verificar logs del worker en Railway
- Verificar que Redis esté conectado
- Verificar `GENERATION_CONCURRENCY` en variables
- Buscar en logs: `Generation worker initialized`

### Error: "WebSocket connection failed"
**Solución:**
- Verificar `FRONTEND_URL` incluye todas las URLs del frontend
- Verificar CORS configurado correctamente
- Revisar logs: `WebSocket server ready`

---

## 📊 MONITOREO POST-DEPLOYMENT

### Logs a Verificar:

```bash
✅ "🚀 Super-Son1k-2.0 Backend running"
✅ "⚙️ BullMQ queue system active"
✅ "🔗 WebSocket server ready"
✅ "🎵 Suno integration active"
✅ "🔐 Advanced token management system active"
✅ "Generation worker initialized"
```

### Métricas a Monitorear:

- **CPU Usage:** Debe estar bajo (< 50%) en idle
- **Memory Usage:** Debe estar estable
- **Network Traffic:** Debe aumentar con requests
- **Queue Size:** Debe procesar jobs correctamente

---

## ✅ CHECKLIST FINAL

- [ ] Railway proyecto creado
- [ ] PostgreSQL configurado y migrado
- [ ] Redis configurado
- [ ] Todas las variables de entorno configuradas
- [ ] Backend deployado y saludable
- [ ] Health endpoint responde correctamente
- [ ] Test generación funciona
- [ ] WebSocket conecta correctamente
- [ ] Queue system procesa jobs
- [ ] Frontend actualizado con nueva URL
- [ ] Logs monitoreados

---

## 🎯 RESULTADO ESPERADO

Una vez completado, tendrás:

✅ Backend deployado en producción  
✅ Generaciones asíncronas funcionando  
✅ Updates en tiempo real vía WebSocket  
✅ Queue system procesando jobs  
✅ Escalable horizontalmente  

---

## 📝 NOTAS IMPORTANTES

1. **Secrets:** NUNCA commits secrets. Usa Railway Secrets.
2. **URLs:** Actualiza `FRONTEND_URL` con todas las URLs de tus apps.
3. **Migraciones:** Ejecuta migraciones ANTES del primer deploy.
4. **Logs:** Monitorea logs durante las primeras 24 horas.
5. **Health Checks:** Railway verificará `/health` automáticamente.

---

**Última actualización:** Enero 2025  
**Prioridad:** 🔴 CRÍTICA - Completar ASAP

