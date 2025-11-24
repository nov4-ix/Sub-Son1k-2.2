# 🚀 PRÓXIMOS PASOS - Sub-Son1k 2.2

**Status Actual:** Backend online, frontends conectados, sistema funcional pero degradado (sin tokens)

---

## 🔴 PRIORIDAD ALTA (Hacer YA)

### 1. Habilitar Migraciones de Base de Datos ⚡
**Por qué:** Las tablas de la DB necesitan crearse/actualizarse.

```bash
# Descomentar el release_command en fly.toml
# Luego ejecutar:
cd /Users/nov4-ix/Sub-Son1k-2.2/Sub-Son1k-2.2
export FLYCTL_INSTALL="$HOME/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"

# Opción A: Ejecutar migración manual
fly ssh console -a sub-son1k-2-2
cd /app && npx prisma db push

# Opción B: Redeploy con release_command habilitado
# (Editar fly.toml línea 16: descomentar)
fly deploy -a sub-son1k-2-2
```

**Resultado esperado:** Tablas creadas en PostgreSQL.

---

### 2. Inicializar Token Pool 🎫
**Por qué:** El backend reporta `tokenPoolSize: 0`, la generación de música no funcionará.

**Tienes 2 opciones:**

#### Opción A: Usar tokens existentes del .env.production.local
```bash
# Los tokens ya están en .env.production.local
# Necesitas agregarlos a la base de datos

# Conectar a la máquina y ejecutar script
fly ssh console -a sub-son1k-2-2

# Dentro de la máquina:
export SUNO_TOKENS="eyJ0eXAiOiJKV1QiLCJhbGci..."  # (copiar de .env.production.local)
node -e "
const tokens = process.env.SUNO_TOKENS.split(',');
tokens.forEach(token => {
  fetch('http://localhost:3000/api/tokens/add-public', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({token})
  }).then(r => r.json()).then(console.log);
});
"
```

#### Opción B: Agregar tokens manualmente vía API
```bash
# Desde tu máquina local:
curl -X POST https://sub-son1k-2-2.fly.dev/api/tokens/add-public \
  -H "Content-Type: application/json" \
  -d '{"token":"TU_TOKEN_AQUI"}'
```

**Resultado esperado:** `tokenPoolSize > 0`, status: `healthy`.

---

### 3. Conectar The Generator Next.js 🔗
**Por qué:** Es el único frontend que falta.

**Paso a paso:**

1. **Push tu repo a GitHub/GitLab** (si no lo has hecho):
   ```bash
   git remote -v  # Verificar remote
   git push origin main
   ```

2. **Conectar a Vercel:**
   - Ir a https://vercel.com/dashboard
   - Click "Add New Project"
   - Importar desde Git
   - Seleccionar tu repositorio
   - Configurar:
     - **Framework Preset:** Next.js
     - **Root Directory:** `apps/the-generator-nextjs`
     - **Build Command:** `cd ../.. && pnpm install && cd apps/the-generator-nextjs && pnpm build`
     - **Install Command:** `pnpm install`
   - Variables de entorno ya están configuradas ✅
   - Deploy

**Resultado esperado:** The Generator Next.js online.

---

## 🟡 PRIORIDAD MEDIA (Hacer Pronto)

### 4. Pruebas End-to-End 🧪

```bash
# Ejecutar script de verificación
./scripts/verify-deployment.sh

# Prueba manual de generación:
# 1. Abrir frontend
# 2. Registrar usuario
# 3. Intentar generar música
# 4. Verificar que funciona el polling
```

### 5. Configurar Redis para Producción 🔴
**Actual:** Redis en Dallas (dfw), app en Ashburn (iad) = latencia.

**Crear Redis en iad:**
```bash
fly redis create --name sub-son1k-redis-iad --region iad
# Obtener URL
fly redis status sub-son1k-redis-iad
# Actualizar REDIS_URL en secrets
fly secrets set REDIS_URL="redis://..." -a sub-son1k-2-2
```

### 6. URLs de Frontend Permanentes 🌐
**Problema:** Los frontends tienen URLs genéricas (`dist-xxx...`).

**Solución:** Configurar dominios custom o reconectar a proyectos con nombres correctos.

---

## 🟢 PRIORIDAD BAJA (Optimizaciones)

### 7. Monitoreo y Alertas 📊
- Configurar Sentry/LogRocket
- Alertas para token pool vacío
- Métricas de requests

### 8. CI/CD Automatizado 🤖
- GitHub Actions para deploy automático
- Tests antes de deploy
- Rollback automático si falla

### 9. Documentación de Usuario 📚
- Guía de uso de la plataforma
- API docs
- Troubleshooting guide

---

## ⚡ QUICK START (5 minutos)

Si quieres ver la plataforma funcional **AHORA MISMO**, ejecuta esto:

```bash
# 1. Migraciones (30 seg)
fly ssh console -a sub-son1k-2-2 -C "cd /app && npx prisma db push"

# 2. Agregar 1 token (10 seg)
TOKEN="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJrNk4wZHJHYkdWRWNyTmdNdm02bzZ6OEM2Zko5QkV6NCIsImV4cCI6MTc2MDkzNjYyMn0.tZBli7kyOZGv5PHyxT4Nb6R8qDyTfLYdoR0i5pWaTNE"

curl -X POST https://sub-son1k-2-2.fly.dev/api/tokens/add-public \
  -H "Content-Type: application/json" \
  -d "{\"token\":\"$TOKEN\"}"

# 3. Verificar
curl https://sub-son1k-2-2.fly.dev/api/tokens/pool/status
```

**Resultado:** Backend funcional con tokens, listo para generar música.

---

## 📋 Checklist de Completitud

- [x] Backend deployed y online
- [x] Database conectada
- [x] Redis conectado
- [ ] Migraciones ejecutadas
- [ ] Token pool inicializado
- [x] 3 frontends Vite conectados
- [ ] The Generator Next.js deployed
- [ ] E2E testing pasando
- [ ] Documentación actualizada

---

**🎯 Siguiente acción recomendada:** Ejecutar el QUICK START de arriba para tener todo funcional en 5 minutos.
