# 🚀 GUÍA DE CONFIGURACIÓN DE VARIABLES DE ENTORNO

**Fecha:** 2025-11-21  
**Status:** ✅ **AUTOMATIZADO - LISTO PARA EJECUTAR**  

---

## 📋 RESUMEN

He creado **scripts automatizados** que configuran todas las variables de entorno por ti. Solo necesitas ejecutar 2 comandos.

---

## ✅ ARCHIVOS CREADOS

### **1. Archivos .env.local (para desarrollo local)** ✅

Ya están configurados y listos:
- ✅ `apps/ghost-studio/.env.local`
- ✅ `apps/the-generator/.env.local`
- ✅ `apps/web-classic/.env.local`
- ✅ `apps/the-generator-nextjs/.env.local`

**Ahora puedes ejecutar las apps localmente sin configurar nada!**

### **2. Scripts de configuración automática** ✅

- ✅ `scripts/setup-flyio-secrets.sh` - Configura Fly.io
- ✅ `scripts/setup-vercel-env.sh` - Configura Vercel

---

## 🚀 PASOS PARA CONFIGURAR (SOLO 2 COMANDOS)

### **Paso 1: Configurar Backend en Fly.io**

```bash
# Ejecutar desde la raíz del proyecto
./scripts/setup-flyio-secrets.sh
```

**Este script automáticamente:**
- ✅ Lee todas las variables desde `.env.production.local`
- ✅ Configura todos los secrets en Fly.io
- ✅ Usa la URL correcta de Fly.io (`https://sub-son1k-2-2.fly.dev`)
- ✅ Configura DATABASE_URL, JWT_SECRET, SUNO tokens, etc.

**Requisitos previos:**
- Fly CLI instalado: `curl -L https://fly.io/install.sh | sh`
- Autenticado: `fly auth login`
- Base de datos PostgreSQL creada (o el script te ayudará)

---

### **Paso 2: Configurar Frontends en Vercel**

```bash
# Ejecutar desde la raíz del proyecto
./scripts/setup-vercel-env.sh
```

**Este script automáticamente:**
- ✅ Configura variables en todos los proyectos Vercel
- ✅ Usa la URL de Fly.io como BACKEND_URL
- ✅ Configura GROQ_API_KEY y BACKEND_SECRET
- ✅ Diferencia entre Next.js y Vite (variables correctas para cada uno)

**Proyectos configurados:**
- ✅ the-generator-nextjs
- ✅ ghost-studio
- ✅ web-classic
- ✅ the-generator

**Requisitos previos:**
- Vercel CLI instalado: `npm install -g vercel`
- Autenticado: `vercel login`

---

## 📊 VARIABLES CONFIGURADAS

### **Backend (Fly.io):**
```bash
DATABASE_URL=postgresql://...           # De Fly.io Postgres
JWT_SECRET=son1k-jwt-secret-super-secure-2024
BACKEND_SECRET=son1k-backend-secret-2024-prod
BACKEND_URL=https://sub-son1k-2-2.fly.dev
GROQ_API_KEY=[REDACTED]
SUNO_API_URL=https://ai.imgkits.com/suno
SUNO_POLLING_URL=https://usa.imgkits.com/node-api/suno
TOKEN_POOL_SIZE=5
TOKEN_ROTATION_INTERVAL=30000
NODE_ENV=production
```

### **Frontends Vite (Ghost Studio, The Generator, Web Classic):**
```bash
VITE_BACKEND_URL=https://sub-son1k-2-2.fly.dev
VITE_BACKEND_SECRET=son1k-backend-secret-2024-prod
VITE_GROQ_API_KEY=[REDACTED]
```

### **Frontend Next.js (The Generator Next.js):**
```bash
BACKEND_URL=https://sub-son1k-2-2.fly.dev
NEXT_PUBLIC_BACKEND_URL=https://sub-son1k-2-2.fly.dev
BACKEND_SECRET=son1k-backend-secret-2024-prod
GROQ_API_KEY=[REDACTED]
```

---

## 🧪 DESARROLLO LOCAL (YA CONFIGURADO)

Todo está listo para desarrollo local:

```bash
# 1. Backend
cd packages/backend
pnpm dev

# 2. The Generator (Next.js)
cd apps/the-generator-nextjs
pnpm dev

# 3. Ghost Studio
cd apps/ghost-studio
pnpm dev

# 4. Web Classic
cd apps/web-classic
pnpm dev
```

**Todas las apps ya tienen sus archivos `.env.local` configurados!**

---

## ✅ VERIFICACIÓN

### **Verificar Fly.io:**
```bash
# Ver secrets configurados
fly secrets list -a sub-son1k-2-2

# Debería mostrar:
# - DATABASE_URL
# - JWT_SECRET
# - BACKEND_SECRET
# - GROQ_API_KEY
# - SUNO_API_URL
# etc.
```

### **Verificar Vercel:**
```bash
# Ver variables de un proyecto
cd apps/the-generator-nextjs
vercel env ls

# Debería mostrar:
# - BACKEND_URL (production)
# - NEXT_PUBLIC_BACKEND_URL (production)
# - BACKEND_SECRET (production)
# - GROQ_API_KEY (production)
```

---

## 🚀 DEPLOYMENT

Una vez configuradas las variables:

### **1. Deploy Backend:**
```bash
fly deploy
```

### **2. Deploy Frontends:**
```bash
# The Generator (Next.js)
cd apps/the-generator-nextjs
vercel --prod

# Ghost Studio
cd apps/ghost-studio
vercel --prod

# Web Classic
cd apps/web-classic
vercel --prod

# The Generator (Vite)
cd apps/the-generator
vercel --prod
```

---

## 🔍 TROUBLESHOOTING

### **Si falta DATABASE_URL en Fly.io:**

```bash
# Crear PostgreSQL database
fly postgres create --name sub-son1k-db --region iad

# Conectar a tu app
fly postgres attach sub-son1k-db -a sub-son1k-2-2

# Esto agregará DATABASE_URL automáticamente
```

### **Si los scripts fallan:**

**Opción manual para Fly.io:**
```bash
fly secrets set \
  JWT_SECRET="son1k-jwt-secret-super-secure-2024" \
  BACKEND_SECRET="son1k-backend-secret-2024-prod" \
  BACKEND_URL="https://sub-son1k-2-2.fly.dev" \
  GROQ_API_KEY="[REDACTED]" \
  SUNO_API_URL="https://ai.imgkits.com/suno" \
  SUNO_POLLING_URL="https://usa.imgkits.com/node-api/suno" \
  NODE_ENV="production" \
  -a sub-son1k-2-2
```

**Opción manual para Vercel:**
```bash
cd apps/the-generator-nextjs
vercel env add BACKEND_URL production
# Luego pegar: https://sub-son1k-2-2.fly.dev

vercel env add BACKEND_SECRET production
# Luego pegar: son1k-backend-secret-2024-prod

# Repetir para cada variable...
```

---

## 📊 CHECKLIST FINAL

Antes de hacer deployment:

- [ ] **Fly.io:**
  - [ ] Ejecutado `./scripts/setup-flyio-secrets.sh`
  - [ ] Verificado secrets con `fly secrets list`
  - [ ] DATABASE_URL configurada
  
- [ ] **Vercel:**
  - [ ] Ejecutado `./scripts/setup-vercel-env.sh`
  - [ ] Verificado variables con `vercel env ls`
  
- [ ] **Pool de Tokens:**
  - [ ] Agregados al menos 2-3 tokens al pool
  - [ ] Verificado con `curl https://sub-son1k-2-2.fly.dev/api/tokens/pool/status`
  
- [ ] **Testing:**
  - [ ] Ejecutado `./scripts/test-music-generation-integration.sh`
  - [ ] Verificado que genera música correctamente

---

## 🎉 CONCLUSIÓN

**¡TODO ESTÁ LISTO!**

1. ✅ Archivos .env.local creados para desarrollo
2. ✅ Scripts automatizados creados
3. ✅ BACKEND_URL actualizada a Fly.io
4. ✅ Solo necesitas ejecutar 2 comandos

**Comandos resumidos:**
```bash
# 1. Configurar Fly.io
./scripts/setup-flyio-secrets.sh

# 2. Configurar Vercel
./scripts/setup-vercel-env.sh

# 3. Deploy!
fly deploy
cd apps/the-generator-nextjs && vercel --prod
```

---

**Última actualización:** 2025-11-21 21:00 CST  
**Nivel de automatización:** 🟢 95% AUTOMATIZADO  
**Complejidad:** 🟢 SUPER FÁCIL (solo 2 comandos)
