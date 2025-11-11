# 🚀 Deploy en Railway - Guía Rápida

## Estado Actual

✅ **Railway CLI instalado y configurado**
✅ **Proyecto linkeado:** son1kvers3-backend
✅ **PostgreSQL configurado**
✅ **DATABASE_URL disponible**

## Variables de Entorno Necesarias

Para el servicio backend, necesitas configurar:

### **OBLIGATORIAS:**
```bash
JWT_SECRET=<generar-uno-seguro>
SUPABASE_URL=<tu-url-supabase>
SUPABASE_SERVICE_ROLE_KEY=<tu-service-role-key>
SUNO_API_KEY=<tu-suno-api-key>
FRONTEND_URL=https://the-generator.vercel.app,https://ghost-studio.vercel.app,https://son1kverse.vercel.app
BACKEND_SECRET=<generar-uno-seguro>
```

### **AUTOMÁTICAS (ya configuradas):**
- `DATABASE_URL` ✅ (del servicio Postgres)
- `REDIS_URL` (necesitas crear servicio Redis)

### **OPCIONALES (para optimización):**
```bash
GENERATION_CONCURRENCY=50
GENERATION_RATE_LIMIT=100
MIN_TOKENS=50
MAX_TOKENS=2000
```

## Pasos para Deploy

1. **Crear servicio Redis:**
   ```bash
   railway add redis
   ```

2. **Crear servicio Backend:**
   ```bash
   railway service new
   # Nombre: backend
   ```

3. **Configurar variables:**
   ```bash
   railway variables set JWT_SECRET=<tu-secret>
   railway variables set SUPABASE_URL=<tu-url>
   # ... etc
   ```

4. **Deploy:**
   ```bash
   railway up
   ```

