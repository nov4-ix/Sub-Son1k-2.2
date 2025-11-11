# 🚀 Configuración de Escalabilidad - Super-Son1k-2.1

## ✅ Optimizaciones Aplicadas para Escala

### **1. Rate Limits (Valores Originales Restaurados)**

**Configuración Actual:**
- FREE: 10 req/min
- PRO: 50 req/min
- PREMIUM: 200 req/min
- ENTERPRISE: 1000 req/min

**Nota:** Rate limits por tier restaurados a valores originales. La escalabilidad se logra mediante worker concurrency y rate limits del worker.

**Archivo:** `packages/backend/src/middleware/rateLimit.ts`

---

### **2. Worker Concurrencia Aumentada (10x)**

**Antes:**
- Concurrencia: 5 jobs simultáneos
- Rate limit: 10 jobs/segundo

**Después:**
- Concurrencia: **50 jobs simultáneos** (10x)
- Rate limit: **100 jobs/segundo** (10x)

**Archivo:** `packages/backend/src/queue/generation.worker.ts`

**Variables de Entorno:**
```bash
GENERATION_CONCURRENCY=50
GENERATION_RATE_LIMIT=100
```

---

### **3. Queue Limits Aumentados**

**Antes:**
- Completed jobs: 1000 max
- Failed jobs: 500 max

**Después:**
- Completed jobs: **10000 max** (10x)
- Failed jobs: **5000 max** (10x)

**Archivo:** `packages/backend/src/queue/generation.queue.ts`

---

### **4. Token Pool Optimizado**

**Antes:**
- MIN_TOKENS: 20
- MAX_TOKENS: 500

**Después:**
- MIN_TOKENS: **50** (2.5x)
- MAX_TOKENS: **2000** (4x)

**Archivo:** `railway.toml`

---

### **5. System User - Unlimited**

**Configuración:**
- Credits: 999,999,999 (unlimited)
- Monthly Generations: 999,999,999 (unlimited)

**Archivo:** `packages/backend/src/middleware/auth.ts`

---

## 📊 Capacidad Estimada

### **Con Configuración Actual:**

**Rate Limits por Tier (Requests por minuto):**
- FREE: 10 req/min
- PRO: 50 req/min
- PREMIUM: 200 req/min
- ENTERPRISE: 1000 req/min

**Worker Capacity (Procesamiento paralelo):**
- Concurrencia: 50 jobs simultáneos
- Rate limit: 100 jobs/segundo
- Capacidad total: ~6,000 generaciones/minuto (sin límites de tier)

**Nota:** Los rate limits por tier controlan requests HTTP, mientras que el worker procesa jobs en paralelo sin restricciones de tier una vez en la cola.

---

## 🔧 Configuración Railway para Auto-Scaling

### **1. Horizontal Scaling**

En Railway → Settings → Scaling:

```yaml
Auto-scaling:
  Enabled: true
  Min instances: 1
  Max instances: 10
  Scale up: CPU > 70% for 2 minutes
  Scale down: CPU < 30% for 5 minutes
```

### **2. Resource Limits**

```yaml
CPU: 2-4 cores (auto-scale)
Memory: 2-8 GB (auto-scale)
```

### **3. Queue Workers**

Para más capacidad, puedes crear workers adicionales:

```bash
# Worker 1 (main service)
GENERATION_CONCURRENCY=50

# Worker 2 (separate service)
GENERATION_CONCURRENCY=50

# Worker 3 (separate service)
GENERATION_CONCURRENCY=50
```

**Total:** 150 jobs simultáneos con 3 workers

---

## 📈 Monitoreo de Escalabilidad

### **Métricas a Monitorear:**

1. **Queue Size:**
   - Waiting: < 100 (ideal)
   - Active: < 50 por worker
   - Si > 100 waiting, agregar más workers

2. **Response Time:**
   - P95: < 2 segundos
   - P99: < 5 segundos

3. **Error Rate:**
   - < 1% de requests fallan
   - Si > 5%, revisar recursos

4. **CPU/Memory:**
   - CPU: < 80% promedio
   - Memory: < 80% promedio
   - Si > 80%, auto-scaling activará

---

## 🚀 Escalado Horizontal

### **Opción 1: Múltiples Workers en Mismo Servicio**

Railway puede escalar automáticamente el mismo servicio.

### **Opción 2: Workers Separados (Recomendado para Alta Carga)**

1. Crear nuevo servicio en Railway
2. Mismo código, pero solo ejecuta worker
3. Configurar `WORKER_ONLY=true` (si implementas)

**Ventajas:**
- Escalado independiente
- Mejor aislamiento
- Más control sobre recursos

---

## ⚙️ Variables de Entorno para Escala

```bash
# Worker Configuration
GENERATION_CONCURRENCY=50
GENERATION_RATE_LIMIT=100

# Token Pool
MIN_TOKENS=50
MAX_TOKENS=2000

# Redis (para alta carga)
REDIS_MAX_RETRIES=10
REDIS_CONNECT_TIMEOUT=10000

# Database (connection pooling)
DATABASE_POOL_MIN=5
DATABASE_POOL_MAX=50
```

---

## ✅ Checklist de Escalabilidad

- [x] Rate limits aumentados (10x)
- [x] Worker concurrencia aumentada (10x)
- [x] Queue limits aumentados (10x)
- [x] Token pool optimizado
- [x] System user con unlimited
- [ ] Auto-scaling configurado en Railway
- [ ] Monitoreo configurado
- [ ] Load testing realizado

---

## 🎯 Resultado

**Rate Limits por Tier (Restaurados):**
- FREE: 10 req/min
- PRO: 50 req/min
- PREMIUM: 200 req/min
- ENTERPRISE: 1000 req/min

**Worker Capacity (Sin límites restrictivos):**
- **50 jobs simultáneos** por worker
- **100 jobs/segundo** de throughput
- **~6,000 generaciones/minuto** capacidad total del worker

**Con 3 workers:**
- **150 jobs simultáneos**
- **300 jobs/segundo** de throughput
- **~18,000 generaciones/minuto** capacidad total

---

**Última actualización:** Enero 2025  
**Estado:** ✅ Optimizado para Escala

