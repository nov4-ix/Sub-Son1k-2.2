# 🚀 Guía de Deploy - Super-Son1k-2.2

**Versión:** 2.2.0  
**Estado:** ✅ Listo para deploy

---

## 📋 Índice

1. [Pruebas Locales](#pruebas-locales)
2. [Deploy a Producción](#deploy-a-producción)
3. [Verificación Post-Deploy](#verificación-post-deploy)
4. [Troubleshooting](#troubleshooting)

---

## 🏠 Pruebas Locales

### Paso 1: Verificar Entorno

**Windows:**
```powershell
.\scripts\verify-local-env.ps1
```

**Linux/Mac:**
```bash
./scripts/verify-local-env.sh
```

Este script verifica:
- ✅ Node.js 18+ instalado
- ✅ pnpm instalado
- ✅ PostgreSQL disponible
- ✅ Redis disponible (opcional)
- ✅ Archivo .env configurado
- ✅ Dependencias instaladas
- ✅ Puertos disponibles

### Paso 2: Configurar Variables de Entorno

Copia `env.example` a `packages/backend/.env` y configura:

```env
# Database
DATABASE_URL="postgresql://usuario:password@localhost:5432/super_son1k"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="genera-uno-seguro"
JWT_EXPIRES_IN="7d"

# Suno API
SUNO_API_URL="https://ai.imgkits.com/suno"
SUNO_POLLING_URL="https://usa.imgkits.com/node-api/suno"
SUNO_API_KEY="tu-suno-api-key"

# Supabase
SUPABASE_URL="https://tu-proyecto.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="tu-service-role-key"

# Server
PORT=3001
NODE_ENV=development
LOG_LEVEL=debug

# Frontend URLs
FRONTEND_URL="http://localhost:3002,http://localhost:3003"

# Backend Secret (genera uno seguro)
BACKEND_SECRET="genera-con: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
```

### Paso 3: Iniciar Servicios

**Windows:**
```powershell
.\scripts\deploy-local.ps1
```

**Linux/Mac:**
```bash
./scripts/deploy-local.sh
```

Este script:
- ✅ Instala dependencias
- ✅ Genera Prisma Client
- ✅ Ejecuta migraciones
- ✅ Compila el backend
- ✅ Inicia todos los servicios

### Paso 4: Probar Generación Musical

1. Abre http://localhost:3002 (The Generator)
2. Escribe un prompt: "indie rock energético"
3. Click en "Generar Música"
4. Espera 60-120 segundos
5. Verifica que el audio se reproduce

**Ver logs:**
- Backend: Terminal donde ejecutaste el script
- Frontend: DevTools del navegador (F12)

---

## 🌐 Deploy a Producción

### Paso 1: Deploy Backend (Railway)

#### 1.1 Conectar Repositorio

1. Ve a [Railway Dashboard](https://railway.app/dashboard)
2. Click en **"New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Conecta `Super-Son1k-2.2`

#### 1.2 Configurar Variables de Entorno

Ve a **Settings > Variables** y agrega:

```env
# Database (Railway lo provee automáticamente)
DATABASE_URL=<proveído-por-railway>

# Redis (Railway lo provee automáticamente)
REDIS_URL=<proveído-por-railway>

# JWT
JWT_SECRET=<genera-uno-seguro>
JWT_EXPIRES_IN=7d

# Suno API
SUNO_API_URL=https://ai.imgkits.com/suno
SUNO_POLLING_URL=https://usa.imgkits.com/node-api/suno
SUNO_API_KEY=<tu-suno-api-key>

# Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<tu-service-role-key>

# Server
PORT=3001
NODE_ENV=production
LOG_LEVEL=info

# Frontend URLs (actualiza con tus URLs de Vercel)
FRONTEND_URL=https://the-generator.vercel.app,https://ghost-studio.vercel.app

# Backend Secret (mismo valor que en frontends)
BACKEND_SECRET=<mismo-valor-que-frontends>

# Queue Configuration
GENERATION_CONCURRENCY=50
GENERATION_RATE_LIMIT=100
MIN_TOKENS=50
MAX_TOKENS=2000
```

#### 1.3 Verificar Deploy

```bash
curl https://tu-backend.railway.app/health
```

Deberías ver:
```json
{
  "status": "ok",
  "services": {
    "database": "connected",
    "redis": "connected"
  }
}
```

### Paso 2: Deploy The Generator (Vercel)

#### 2.1 Conectar Repositorio

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Click en **"Add New Project"**
3. Importa `Super-Son1k-2.2`
4. Configura:
   - **Root Directory:** `apps/the-generator-nextjs`
   - **Framework Preset:** Next.js

#### 2.2 Configurar Variables de Entorno

Ve a **Settings > Environment Variables**:

```env
BACKEND_URL=https://tu-backend.railway.app
BACKEND_SECRET=<mismo-valor-que-backend>
NEXT_PUBLIC_BACKEND_URL=https://tu-backend.railway.app
GROQ_API_KEY=<tu-groq-api-key>
```

#### 2.3 Deploy

Vercel desplegará automáticamente. O manualmente:

```bash
cd apps/the-generator-nextjs
vercel --prod
```

### Paso 3: Deploy Ghost Studio (Vercel)

#### 3.1 Conectar Repositorio

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Click en **"Add New Project"**
3. Importa `Super-Son1k-2.2` (mismo repo)
4. Configura:
   - **Root Directory:** `apps/ghost-studio`
   - **Framework Preset:** Vite

#### 3.2 Configurar Variables de Entorno

```env
VITE_BACKEND_URL=https://tu-backend.railway.app
VITE_BACKEND_SECRET=<mismo-valor-que-backend>
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=<tu-anon-key>
```

#### 3.3 Deploy

```bash
cd apps/ghost-studio
vercel --prod
```

### Paso 4: Agregar Tokens al Pool

#### Opción A: Extensión Chrome

1. Instala la extensión desde `extensions/suno-extension`
2. Navega a https://suno.com
3. La extensión capturará tokens automáticamente

#### Opción B: Manualmente

```bash
cd packages/backend
node add_token.js
```

---

## ✅ Verificación Post-Deploy

### Checklist de Verificación

#### Backend
- [ ] Health check responde: `curl https://tu-backend.railway.app/health`
- [ ] Base de datos conectada
- [ ] Redis conectado
- [ ] Logs sin errores críticos

#### The Generator
- [ ] Carga correctamente en https://the-generator.vercel.app
- [ ] Se conecta al backend
- [ ] Generación de música funciona
- [ ] Audio se reproduce correctamente

#### Ghost Studio
- [ ] Carga correctamente en https://ghost-studio.vercel.app
- [ ] Se conecta al backend
- [ ] Generación de covers funciona
- [ ] A/B player funciona

#### Tokens
- [ ] Tokens agregados al pool
- [ ] Token pool activo y saludable
- [ ] Generaciones usando tokens válidos

### Pruebas de Generación Musical

1. **The Generator:**
   - Abre https://the-generator.vercel.app
   - Inicia sesión
   - Genera una canción
   - Verifica que el audio se reproduce

2. **Ghost Studio:**
   - Abre https://ghost-studio.vercel.app
   - Inicia sesión
   - Sube audio o graba uno nuevo
   - Genera un cover
   - Verifica que funciona

---

## 🔧 Troubleshooting

### Backend no inicia

**Solución:**
1. Verifica variables de entorno en Railway
2. Verifica logs en Railway Dashboard
3. Verifica que DATABASE_URL sea correcta
4. Verifica que las migraciones se ejecutaron

### Frontend no se conecta al backend

**Solución:**
1. Verifica que `BACKEND_URL` sea correcta
2. Verifica que `BACKEND_SECRET` sea el mismo en ambos
3. Verifica que `FRONTEND_URL` en backend incluya la URL del frontend
4. Verifica CORS en el backend

### Generación falla o tarda mucho

**Solución:**
1. Verifica que los tokens sean válidos
2. Verifica logs del backend para errores específicos
3. Verifica que Redis esté funcionando (para la cola)
4. Verifica conexión a Suno API

### Audio no se reproduce

**Solución:**
1. Verifica que la URL del audio sea accesible
2. Verifica CORS en el servidor que aloja el audio
3. Verifica formato del audio (MP3, WAV)
4. Revisa consola del navegador para errores

---

## 📊 Monitoreo

### Logs de Producción

**Railway (Backend):**
- Dashboard > Proyecto > Deployments > View Logs

**Vercel (Frontend):**
- Dashboard > Proyecto > Deployments > View Function Logs

### Métricas

- Generaciones por día
- Tiempo promedio de generación
- Tasa de éxito/fallo
- Tokens activos en el pool

---

## 🎯 Próximos Pasos

Después de verificar que todo funciona:

1. ✅ Configurar monitoreo y alertas
2. ✅ Optimizar tiempos de generación
3. ✅ Agregar más tests automatizados
4. ✅ Preparar para beta pública
5. ✅ Documentar problemas encontrados

---

**Versión:** 2.2.0  
**Última actualización:** $(Get-Date -Format "yyyy-MM-dd")  
**Estado:** ✅ Listo para deploy

