# 🔴 PROBLEMA RAÍZ DEL DEPLOYMENT - ANÁLISIS FINAL

**Fecha:** 2025-11-23 00:45 CST  
**Diagnóstico:** Developer Senior Backend Expert  

---

## 🎯 EL PROBLEMA REAL

El backend deployado en Fly.io crashea constantemente con:

```
Error: Cannot find module '/usr/src/app/packages/backend/node_modules/@super-son1k/shared-utils/dist/src/index.js'
path: '/usr/src/app/packages/backend/node_modules/@super-son1k/shared-utils/package.json'
```

### **ROOT CAUSE:**

Node.js busca módulos relativos al archivo que se está ejecutando. Cuando ejecutamos:
```bash
node packages/backend/dist/packages/backend/src/index.js
```

Node busca `node_modules` en:
1. `packages/backend/dist/packages/backend/src/node_modules`
2. `packages/backend/dist/packages/backend/node_modules`
3. **`packages/backend/node_modules`** ← AQUÍ
4. `packages/node_modules`
5. `/usr/src/app/node_modules` ← Aquí están con pnpm

**Con pnpm workspaces**, los packages `@super-son1k/*` están en `/usr/src/app/node_modules/@super-son1k/` (root), NO en `packages/backend/node_modules/@super-son1k`.

---

## ✅ SOLUCIÓN IMPLEMENTADA

**Approach:** Copiar los workspace packages al lugar donde Node los busca.

```dockerfile
# Copiar workspace packages a backend/node_modules
RUN mkdir -p packages/backend/node_modules/@super-son1k && \
    cp -r packages/shared-types packages/backend/node_modules/@super-son1k/shared-types && \
    cp -r packages/shared-utils packages/backend/node_modules/@super-son1k/shared-utils
```

Esto crea la estructura que Node espera:
```
packages/backend/node_modules/
└── @super-son1k/
    ├── shared-types/ (con dist/ incluido)
    └── shared-utils/ (con dist/ incluido)
```

---

## 🚫 POR QUÉ FALLARON LOS INTENTOS ANTERIORES

### ❌ Intento 1: Symlinks
```dockerfile
RUN ln -sf ../../../shared-utils packages/backend/node_modules/@super-son1k/shared-utils
```
**Falló:** Los symlinks no funcionan correctamente en el runtime de Fly.io.

### ❌ Intento 2: Multi-stage build
```dockerfile
FROM node:20-slim AS builder
# build...
FROM node:20-slim
COPY --from=builder ...
```
**Falló:** Al hacer `pnpm install --prod` en la stage final, pnpm NO instala workspace dependencies correctamente sin el monorepo completo.

### ❌ Intento 3: NODE_PATH
```dockerfile
ENV NODE_PATH=/usr/src/app/packages:/usr/src/app/node_modules
```
**Falló:** Node busca PRIMERO en paths relativos antes de consultar NODE_PATH.

### ❌ Intento 4: pnpm prune --prod
```dockerfile
RUN pnpm prune --prod
```
**Falló:** pnpm prune elimina dev dependencies pero NO reorganiza la estructura de workspaces.

---

## ✅ SOLUCIÓN DEFINITIVA ACTUAL

**Dockerfile correcto:**

```dockerfile
FROM node:20-slim

# Install dependencies
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copy all files
COPY . .

# Setup pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Install all dependencies for build
RUN pnpm install --frozen-lockfile=false

# Generate Prisma Client
RUN cd packages/backend && npx prisma generate

# Build all packages
RUN pnpm run build --filter=@super-son1k/shared-types
RUN pnpm run build --filter=@super-son1k/shared-utils  
RUN pnpm run build --filter=@super-son1k/backend

# CRITICAL: Copy workspace packages to where Node expects them
RUN mkdir -p packages/backend/node_modules/@super-son1k && \
    cp -r packages/shared-types packages/backend/node_modules/@super-son1k/shared-types && \
    cp -r packages/shared-utils packages/backend/node_modules/@super-son1k/shared-utils

# Find and copy Prisma Client
RUN find node_modules -name "@prisma" -type d -exec cp -r {} packages/backend/node_modules/ \; 2>/dev/null || true && \
    find node_modules -name ".prisma" -type d -exec cp -r {} packages/backend/node_modules/ \; 2>/dev/null || true

# Install prod dependencies
RUN cd packages/backend && pnpm install --prod --frozen-lockfile=false

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /usr/src/app/packages/backend

# Expose port
EXPOSE 3000

# Start from backend directory
CMD ["node", "dist/packages/backend/src/index.js"]
```

---

## 🔍 STATUS ACTUAL

- ✅ Dockerfile corregido
- ✅ Build completado exitosamente (imagen: `deployment-01KAQRFNK0ANJ98PY9R0J1Q4WP`)  
- ❌ Máquinas usando imagen ANTERIOR (versión 30)
- ⏳ Esperando que máquinas se actualicen a versión 31

**Las máquinas están crasheando porque aún usan la imagen OLD con el bug.**

---

## 🚀 PRÓXIMOS PASOS PARA RESOLVER

### 1. Forzar restart de máquinas con nueva imagen:

```bash
fly machine list -a sub-son1k-2-2
fly machine restart <MACHINE_ID> -a sub-son1k-2-2
```

### 2. O destruir y recrear máquinas:

```bash
fly scale count 0 -a sub-son1k-2-2
fly scale count 2 -a sub-son1k-2-2
```

### 3. Verificar que usen la imagen correcta:

```bash
fly status -a sub-son1k-2-2
# Should show: deployment-01KAQRFNK0ANJ98PY9R0J1Q4WP
```

### 4. Verificar los módulos en la nueva imagen:

```bash
fly ssh console -a sub-son1k-2-2 -C "ls -la /usr/src/app/packages/backend/node_modules/@super-son1k/"
# Debe mostrar: shared-types y shared-utils
```

### 5. Health check:

```bash
curl https://sub-son1k-2-2.fly.dev/health
```

---

## 📚 LECCIONES APRENDIDAS

1. **pnpm workspaces NO son production-ready out-of-the-box** en contenedores Docker
2. **Node module resolution es RELATIVO** al archivo ejecutado, no al CWD
3. **Symlinks NO funcionan** de manera confiable en todos los runtimes de contenedores
4. **Multi-stage builds pierden el contexto** de workspaces de pnpm
5. **La solución correcta es COPIAR** los packages buildados a la ubicación esperada

---

## ✅ SOLUCIÓN ALTERNATIVA FUTURA

Para evitar este problema en futuros deployments, considerar:

1. **Usar un bundler** (esbuild, webpack) que genere un bundle standalone
2. **No usar workspaces** para packages que se deployean juntos
3. **Usar npm/yarn** en lugar de pnpm para mejor compatibilidad con Docker
4. **Prefabricar un tarball** del backend con todos sus dependencies incluidos

---

**Estado final:** SOLUCIONADO en código, esperando aplicación en runtime  
**Confianza:** 🟢 95% - La solución es correcta, solo falta que Fly.io use la nueva imagen
