# 🧪 Guía de Pruebas Locales y Reales - Super-Son1k-2.2

**Versión:** 2.2.0  
**Fecha:** $(Get-Date -Format "yyyy-MM-dd")  
**Estado:** ✅ Listo para pruebas

---

## 📋 Índice

1. [Pruebas Locales](#pruebas-locales)
2. [Pruebas Reales (Producción)](#pruebas-reales-producción)
3. [Checklist de Verificación](#checklist-de-verificación)
4. [Troubleshooting](#troubleshooting)

---

## 🏠 Pruebas Locales

### Requisitos Previos

- ✅ Node.js 18+ instalado
- ✅ pnpm instalado (`npm install -g pnpm`)
- ✅ PostgreSQL instalado y corriendo (o acceso a una base de datos remota)
- ✅ Redis instalado y corriendo (opcional, pero recomendado)
- ✅ Cuenta de Supabase configurada
- ✅ Tokens de Suno API disponibles

### Paso 1: Configuración Inicial

#### 1.1 Clonar y Preparar el Proyecto

```bash
# Si aún no lo has hecho, clona el repositorio
git clone https://github.com/nov4-ix/Super-Son1k-2.2.git
cd Super-Son1k-2.2
```

#### 1.2 Instalar Dependencias

```bash
# Instalar todas las dependencias del monorepo
pnpm install
```

#### 1.3 Configurar Variables de Entorno

**Backend (`packages/backend/.env`):**

```env
# Database
DATABASE_URL="postgresql://usuario:password@localhost:5432/super_son1k"

# Redis (opcional para desarrollo local)
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="tu-secret-jwt-aqui"
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
HOST=0.0.0.0
NODE_ENV=development
LOG_LEVEL=debug

# Frontend URLs
FRONTEND_URL="http://localhost:3002,http://localhost:3003"

# Backend Secret (genera uno seguro)
BACKEND_SECRET="genera-con: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
```

**The Generator (`apps/the-generator-nextjs/.env.local`):**

```env
BACKEND_URL=http://localhost:3001
BACKEND_SECRET=<mismo-valor-que-backend>
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
GROQ_API_KEY=tu-groq-api-key-para-traduccion
```

**Ghost Studio (`apps/ghost-studio/.env.local`):**

```env
VITE_BACKEND_URL=http://localhost:3001
VITE_BACKEND_SECRET=<mismo-valor-que-backend>
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

#### 1.4 Generar Prisma Client y Ejecutar Migraciones

```bash
cd packages/backend
pnpm db:generate
pnpm db:push
cd ../..
```

### Paso 2: Iniciar Servicios Localmente

#### Opción A: Script Automático (Windows PowerShell)

```powershell
.\scripts\deploy-local.ps1
```

Este script:
- ✅ Verifica dependencias
- ✅ Instala paquetes
- ✅ Genera Prisma Client
- ✅ Ejecuta migraciones
- ✅ Inicia todos los servicios en ventanas separadas

#### Opción B: Manual (Multi-terminal)

**Terminal 1 - Backend:**
```bash
cd packages/backend
pnpm dev
```

**Terminal 2 - The Generator:**
```bash
cd apps/the-generator-nextjs
pnpm dev
```

**Terminal 3 - Ghost Studio:**
```bash
cd apps/ghost-studio
pnpm dev
```

### Paso 3: Verificar que Todo Funciona

#### 3.1 Health Check del Backend

```bash
curl http://localhost:3001/health
```

Deberías ver:
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "services": {
    "database": "connected",
    "redis": "connected",
    "tokenPool": "active"
  }
}
```

#### 3.2 Verificar URLs

- ✅ Backend: http://localhost:3001
- ✅ The Generator: http://localhost:3002
- ✅ Ghost Studio: http://localhost:3003

### Paso 4: Probar Generación Musical Local

#### 4.1 Prueba en The Generator

1. Abre http://localhost:3002 en tu navegador
2. Escribe un prompt musical:
   - Ejemplo: "indie rock energético con guitarras distorsionadas"
3. Opcional: Genera letra con IA o marca "Instrumental"
4. Click en **"Generar Música"**
5. Espera 60-120 segundos
6. Verifica que el audio se reproduce correctamente

**Logs esperados en terminal del backend:**
```
🎵 Generación iniciada
📝 Prompt: indie rock energético...
📡 Llamando a Suno API...
✅ TaskId recibido: abc123...
🔄 Polling iniciado...
✅ Generación completada!
```

#### 4.2 Prueba en Ghost Studio

1. Abre http://localhost:3003
2. Sube un archivo de audio o graba uno nuevo
3. Ajusta los knobs creativos (Expressivity, Rareza, etc.)
4. Escribe un prompt para el cover
5. Click en **"Generar Cover"**
6. Espera 60-120 segundos
7. Compara el original vs el generado (A/B player)

---

## 🌐 Pruebas Reales (Producción)

### Requisitos Previos

- ✅ Cuenta de Railway configurada
- ✅ Cuenta de Vercel configurada
- ✅ Base de datos PostgreSQL en producción
- ✅ Redis en producción (Railway lo provee automáticamente)
- ✅ Tokens de Suno agregados al pool

### Paso 1: Deploy del Backend (Railway)

#### 1.1 Conectar Repositorio a Railway

1. Ve a [Railway Dashboard](https://railway.app/dashboard)
2. Click en **"New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Conecta el repositorio `Super-Son1k-2.2`

#### 1.2 Configurar Variables de Entorno en Railway

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
# Obtén la URL de tu backend de Railway
curl https://tu-backend.railway.app/health
```

### Paso 2: Deploy de Frontends (Vercel)

#### 2.1 Deploy The Generator

```bash
cd apps/the-generator-nextjs
vercel --prod
```

**Variables de entorno en Vercel:**
```env
BACKEND_URL=https://tu-backend.railway.app
BACKEND_SECRET=<mismo-valor-que-backend>
NEXT_PUBLIC_BACKEND_URL=https://tu-backend.railway.app
GROQ_API_KEY=<tu-groq-api-key>
```

**Configurar Root Directory:**
- Settings > General > Root Directory: `apps/the-generator-nextjs`

#### 2.2 Deploy Ghost Studio

```bash
cd apps/ghost-studio
vercel --prod
```

**Variables de entorno en Vercel:**
```env
VITE_BACKEND_URL=https://tu-backend.railway.app
VITE_BACKEND_SECRET=<mismo-valor-que-backend>
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=<tu-anon-key>
```

**Configurar Root Directory:**
- Settings > General > Root Directory: `apps/ghost-studio`

### Paso 3: Agregar Tokens al Pool

#### Opción A: Usando la Extensión Chrome

1. Instala la extensión desde `extensions/suno-extension`
2. Navega a https://suno.com
3. La extensión capturará automáticamente los tokens
4. Los tokens se agregarán al pool en Supabase

#### Opción B: Manualmente

```bash
# Usa el script de agregar tokens
cd packages/backend
node add_token.js
```

### Paso 4: Probar Generación Musical en Producción

#### 4.1 Prueba en The Generator (Producción)

1. Abre https://the-generator.vercel.app
2. Inicia sesión o crea una cuenta
3. Escribe un prompt musical
4. Click en **"Generar Música"**
5. Espera 60-120 segundos
6. Verifica que el audio se reproduce correctamente

#### 4.2 Prueba en Ghost Studio (Producción)

1. Abre https://ghost-studio.vercel.app
2. Inicia sesión
3. Sube audio o graba uno nuevo
4. Genera un cover
5. Verifica que funciona correctamente

---

## ✅ Checklist de Verificación

### Pruebas Locales

- [ ] Backend responde en http://localhost:3001/health
- [ ] The Generator carga en http://localhost:3002
- [ ] Ghost Studio carga en http://localhost:3003
- [ ] Base de datos conectada (verificar logs del backend)
- [ ] Redis conectado (opcional, verificar logs)
- [ ] Tokens disponibles en el pool
- [ ] Generación de música funciona en The Generator
- [ ] Generación de covers funciona en Ghost Studio
- [ ] Audio se reproduce correctamente después de generación
- [ ] Logs muestran el proceso completo de generación

### Pruebas Reales (Producción)

- [ ] Backend responde en https://tu-backend.railway.app/health
- [ ] The Generator desplegado en Vercel
- [ ] Ghost Studio desplegado en Vercel
- [ ] Variables de entorno configuradas correctamente
- [ ] CORS configurado para URLs de producción
- [ ] Tokens agregados al pool en producción
- [ ] Generación de música funciona en producción
- [ ] Generación de covers funciona en producción
- [ ] Audio se reproduce correctamente
- [ ] Sin errores en logs de Railway/Vercel

---

## 🔧 Troubleshooting

### Problema: Backend no inicia

**Solución:**
1. Verifica que PostgreSQL esté corriendo
2. Verifica que `DATABASE_URL` sea correcta
3. Verifica que las migraciones se ejecutaron: `pnpm db:push`
4. Revisa los logs del backend para errores específicos

### Problema: "SUNO_API_KEY no configurada"

**Solución:**
1. Verifica que `SUNO_API_KEY` esté en `.env`
2. Reinicia el servidor después de agregar la variable
3. Verifica que el archivo `.env` esté en `packages/backend/`

### Problema: "Token pool vacío"

**Solución:**
1. Agrega tokens usando la extensión Chrome
2. O manualmente usando el script `add_token.js`
3. Verifica en Supabase que los tokens estén en la tabla `suno_tokens`

### Problema: Frontend no se conecta al backend

**Solución:**
1. Verifica que `BACKEND_URL` sea correcta en el frontend
2. Verifica que `BACKEND_SECRET` sea el mismo en backend y frontend
3. Verifica que `FRONTEND_URL` en el backend incluya la URL del frontend
4. Verifica CORS en el backend

### Problema: Generación tarda mucho o falla

**Solución:**
1. Verifica que los tokens de Suno sean válidos
2. Verifica la conexión a internet
3. Revisa los logs del backend para errores específicos
4. Verifica que Redis esté funcionando (para la cola)

### Problema: Audio no se reproduce

**Solución:**
1. Verifica que la URL del audio sea accesible
2. Verifica CORS en el servidor que aloja el audio
3. Verifica que el formato del audio sea compatible (MP3, WAV)
4. Revisa la consola del navegador para errores

---

## 📊 Monitoreo y Logs

### Logs Locales

**Backend:**
```bash
# Los logs aparecen en la terminal donde ejecutaste `pnpm dev`
# Busca mensajes como:
# 🎵 Generación iniciada
# 📡 Llamando a Suno API...
# ✅ Generación completada
```

**Frontend:**
- Abre DevTools (F12)
- Ve a la pestaña Console
- Busca mensajes de generación

### Logs de Producción

**Railway (Backend):**
- Ve a tu proyecto en Railway
- Click en "Deployments" > Selecciona el deployment > "View Logs"

**Vercel (Frontend):**
- Ve a tu proyecto en Vercel
- Click en "Deployments" > Selecciona el deployment > "View Function Logs"

---

## 🎯 Próximos Pasos

Después de verificar que las pruebas locales y reales funcionan:

1. ✅ Documentar cualquier problema encontrado
2. ✅ Optimizar tiempos de generación si es necesario
3. ✅ Agregar más tests automatizados
4. ✅ Configurar monitoreo en producción
5. ✅ Preparar para beta pública

---

**Versión:** 2.2.0  
**Última actualización:** $(Get-Date -Format "yyyy-MM-dd")  
**Estado:** ✅ Listo para pruebas

