# 🚀 GUÍA RÁPIDA DE CONFIGURACIÓN

## ⚡ Configuración Rápida (3 pasos)

### **Paso 1: Instalar Fly CLI**

```bash
./scripts/install-fly-cli.sh
```

O manualmente:
```bash
curl -L https://fly.io/install.sh | sh
```

### **Paso 2: Autenticarse en Fly.io**

```bash
fly auth login
```

Esto abrirá tu navegador para iniciar sesión.

### **Paso 3: Ejecutar configuración automática**

```bash
./scripts/setup-all.sh
```

---

## 🎯 Opción Alternativa: Configurar Solo Vercel (Sin Fly.io)

Si prefieres configurar solo Vercel por ahora:

```bash
./scripts/setup-vercel-env.sh
```

---

## 📊 Desarrollo Local (Ya funciona sin Fly.io)

El desarrollo local **ya está configurado** y funciona:

```bash
# Backend
cd packages/backend
pnpm dev

# Frontends
cd apps/the-generator-nextjs
pnpm dev
```

Todos los archivos `.env.local` ya están creados y funcionando.

---

## 🔍 Verificar qué tienes instalado

```bash
# Verificar Fly CLI
fly version

# Verificar Vercel CLI
vercel --version

# Ver archivos .env.local creados
ls apps/*/.env.local
```

---

## 💡 Comandos Útiles

```bash
# Si ya instalaste Fly CLI, autentica:
fly auth login

# Ver apps en Fly.io:
fly apps list

# Ver secrets configurados:
fly secrets list -a sub-son1k-2-2

# Configurar solo Vercel:
./scripts/setup-vercel-env.sh

# Configurar todo (requiere Fly CLI + Vercel CLI):
./scripts/setup-all.sh
```

---

## ✅ Lo que YA está listo

- ✅ Archivos `.env.local` para desarrollo (4 archivos)
- ✅ Archivos `.env.example` para referencia (4 archivos)
- ✅ Scripts de configuración automatizados (4 archivos)
- ✅ Documentación completa (5 documentos)
- ✅ Script de testing E2E
- ✅ Problemas críticos solucionados

**Puedes empezar a desarrollar localmente AHORA MISMO sin configurar Fly.io.**

---

## 🚀 Deployment (cuando estés listo)

### **Frontend only (Vercel):**
```bash
./scripts/setup-vercel-env.sh
cd apps/the-generator-nextjs
vercel --prod
```

### **Backend + Frontend (Fly.io + Vercel):**
```bash
# 1. Instalar y configurar Fly CLI
./scripts/install-fly-cli.sh
fly auth login

# 2. Configurar todo
./scripts/setup-all.sh

# 3. Deploy
fly deploy
```

---

**Última actualización:** 2025-11-22 09:05 CST  
**Estado actual:** 🟢 Desarrollo local listo, pendiente Fly CLI para producción
