# 🎵 PLAN DE RESTAURACIÓN COMPLETA DEL SISTEMA DE GENERACIÓN MUSICAL

## 📊 Estado Actual vs. Objetivo

### ✅ Funcionando Ahora:
- Frontend v2.2 con Pixel AI
- Backend mínimo con CORS
- Comunicación frontend ↔ backend
- Respuestas demo de API

### 🎯 Objetivo Final:
- Sistema completo de generación musical
- Base de datos PostgreSQL
- Sistema de tokens funcional
- Colas de procesamiento
- Generación real de música

---

## 🔧 FASE 1: INFRAESTRUCTURA (15-20 min)

### 1.1 Base de Datos PostgreSQL
```bash
flyctl postgres create --name sub-son1k-db
flyctl postgres attach sub-son1k-db --app sub-son1k-2-2
```

**Variables que se crearán automáticamente:**
- `DATABASE_URL`
- `DATABASE_PRIVATE_URL`

### 1.2 Ejecutar Migraciones de Prisma
```bash
cd packages/backend
npx prisma migrate deploy
npx prisma generate
```

### 1.3 Redis (Opcional para colas)
```bash
flyctl redis create --name sub-son1k-redis
flyctl redis attach sub-son1k-redis --app sub-son1k-2-2
```

---

## 🛠️ FASE 2: SERVICIOS BACKEND (10-15 min)

### 2.1 TokenManager Service
**Archivo:** `packages/backend/src/services/tokenManager.ts`
- ✅ Ya existe en el código
- Gestiona tokens de Suno API
- Rotación automática
- Pool de tokens

### 2.2 MusicGenerationService
**Archivo:** `packages/backend/src/services/musicGenerationService.ts`
- ✅ Ya existe en el código
- Integración con Suno API
- Polling de estado
- Manejo de errores

### 2.3 AnalyticsService
**Archivo:** `packages/backend/src/services/analyticsService.ts`
- ✅ Ya existe en el código
- Tracking de generaciones
- Métricas de uso

---

## 🔌 FASE 3: RUTAS DE API (5-10 min)

### 3.1 Restaurar Rutas de Generación
**Archivo:** `packages/backend/src/routes/generation.ts`
- ✅ Código completo ya existe
- Necesita importarse en `index.ts`

### 3.2 Rutas Adicionales Necesarias
- `/api/generation/create-public` - Crear generación pública
- `/api/generation/:id/status` - Verificar estado
- `/api/generation/:id` - Obtener detalles
- `/api/tokens/sync` - Sincronizar tokens

---

## 🎫 FASE 4: SISTEMA DE TOKENS (5 min)

### 4.1 Variables de Entorno en Fly.io
```bash
flyctl secrets set \
  SUNO_TOKENS="token1,token2,token3" \
  SUNO_API_URL="https://ai.imgkits.com/suno" \
  SUNO_POLLING_URL="https://usa.imgkits.com/node-api/suno" \
  --app sub-son1k-2-2
```

### 4.2 Tokens Disponibles
```
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJrNk4wZHJHYkdWRWNyTmdNdm02bzZ6OEM2Zko5QkV6NCIsImV4cCI6MTc2MDkzNjYyMn0.tZBli7kyOZGv5PHyxT4Nb6R8qDyTfLYdoR0i5pWaTNE
```
(y 3 más desde `.env.production.local`)

---

## 🧪 FASE 5: TESTING (5 min)

### 5.1 Verificar Servicios
```bash
curl https://sub-son1k-2-2.fly.dev/health
curl -X POST https://sub-son1k-2-2.fly.dev/api/generation/create-public \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Una canción de rock"}'
```

### 5.2 Verificar desde Frontend
- Abrir deployment de Vercel
- Intentar generar música
- Verificar que se cree la tarea
- Esperar resultado

---

## ⏱️ TIEMPO ESTIMADO TOTAL: 40-50 minutos

## 📝 CHECKLIST DE PROGRESO:

- [ ] Fase 1.1: PostgreSQL creado
- [ ] Fase 1.2: Migraciones ejecutadas
- [ ] Fase 2: Servicios importados en index.ts
- [ ] Fase 3: Rutas restauradas
- [ ] Fase 4: Tokens configurados
- [ ] Fase 5: Sistema funcionando end-to-end

---

## 🚨 NOTAS IMPORTANTES:

1. **Sin Redis:** Si no queremos Redis, podemos usar un sistema de polling simple
2. **Tokens limitados:** Los tokens de Suno tienen rate limits, considerar
3. **Costos:** PostgreSQL en Fly.io puede tener costos (verificar plan free tier)

---

**Última actualización:** 2025-12-15 22:46
**Estado:** Iniciando Fase 1
