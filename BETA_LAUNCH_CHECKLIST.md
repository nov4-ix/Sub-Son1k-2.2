# 🚀 CHECKLIST BETA LAUNCH - HOY

**Fecha:** Oct 31, 2025  
**Objetivo:** Lanzar beta funcional en producción  
**Prioridad:** ⚡ CRÍTICO - Lo que está 80%+ primero

---

## ✅ PRIORIDAD 1: APPS YA LIVE (Verificar y Quick Fixes)

### 1. Ghost Studio ⚡ (90% listo)
- [x] Deploy en Vercel ✅
- [x] **Verificar** que carga correctamente
- [x] **Test** upload audio + generate cover
- [x] **Fix** cualquier error de consola
- [ ] **Añadir** Pixel AI integration (opcional hoy)

**URL:** `ghost-studio.vercel.app`
**Tiempo estimado:** 15 min

---

### 2. Nova Post Pilot ⚡ (90% listo)
- [x] Deploy en Vercel ✅
- [x] Auth funcionando ✅
- [ ] **Verificar** login/signup works
- [ ] **Test** dashboard carga
- [ ] **Quick fix** cualquier bug visual

**URL:** `nova-post-pilot.vercel.app`  
**Tiempo estimado:** 10 min

---

### 3. The Generator ⚡ (85% listo)
- [x] Deploy en Vercel ✅
- [ ] **Verificar** que carga
- [ ] **Test** generate lyrics básico
- [ ] **Conectar** con backend si falta

**URL:** `the-generator.vercel.app`  
**Tiempo estimado:** 20 min

---

### 4. Nexus Visual ⚡ (80% listo)
- [x] Deploy en Vercel ✅
- [ ] **Verificar** que carga
- [ ] **Test** pixels se renderizan
- [ ] **Quick polish** visual si crítico

**URL:** `nexus-visual.vercel.app`  
**Tiempo estimado:** 15 min

---

## ✅ PRIORIDAD 2: PIXEL AI (Completar Integration)

### Pixel AI Status:
- ❌ **Código NO existe** - necesita ser creado
- ❌ **NO funciona local** - Ollama no configurado
- ⚠️ **FALTA:** Todo el sistema Pixel AI

### Tasks:
- [ ] **Crear** código Pixel (`pixelAI.ts`, `qwenClient.ts`, `PixelChatAdvanced.tsx`)
- [ ] **Setup** Ollama local con Qwen 2.5
- [ ] **Test** local: `ollama serve` + `cd apps/web-classic && npm run dev`
- [ ] **Integrar** Pixel button en 1-2 apps principales (beta mínimo)
- [ ] **Deploy** web-classic con Pixel básico

**Tiempo estimado:** 30-45 min

---

## ✅ PRIORIDAD 3: BACKEND (Verificar Funcionalidad Mínima)

### Backend Status:
- ✅ Código completo existe (`packages/backend/src/`)
- ✅ Rutas: auth, generation, tokens, etc.
- ✅ Variables de entorno configuradas
- ✅ Configuración de deployment (Vercel + Railway)
- ⚠️ **FALTA:** Probar funcionamiento (bloqueado por PowerShell)

### Tasks:
- [x] **Setup** `.env` en `packages/backend/`
- [x] **Crear** `vercel.json` y `railway.toml`
- [ ] **Test** `cd packages/backend && npm run dev` (bloqueado por PowerShell)
- [ ] **Verificar** `/health` endpoint responde
- [ ] **Test** `/api/auth/register` funciona
- [ ] **Deploy** a Railway/Vercel para testing real

**Tiempo estimado:** 20-30 min

---

## ✅ PRIORIDAD 4: SHARED UI (Crear Componentes Mínimos)

### Shared UI Status:
- ⚠️ Solo esqueleto existe
- ❌ **FALTA:** Componentes base

### Tasks RÁPIDOS (solo lo esencial):
- [x] **Crear** `packages/shared-ui/src/Button.tsx` (con glassmorphism)
- [x] **Crear** `packages/shared-ui/src/Input.tsx`
- [x] **Crear** `packages/shared-ui/src/Card.tsx`
- [x] **Exportar** desde `index.ts`
- [x] **Test** que se importa en apps (Nova Post Pilot NO usa componentes compartidos)

**Tiempo estimado:** 30 min

---

## ✅ PRIORIDAD 5: VARIABLES DE ENTORNO (Verificar)

- [x] ✅ Vercel envs configuradas (SUPABASE_URL, SUPABASE_ANON_KEY)
- [x] **Verificar** cada app tiene su `.env.local.example` (usa Vercel envs)
- [x] **Documentar** qué vars necesita cada app (completado en summary)

**Tiempo estimado:** 10 min

---

## ✅ PRIORIDAD 6: PRUEBAS RÁPIDAS (Smoke Tests)

### Apps:
- [ ] Ghost Studio: Upload → Generate → Download
- [ ] Nova Post Pilot: Login → Dashboard → Create Post
- [ ] The Generator: Write prompt → Generate lyrics
- [ ] Nexus Visual: Load → Pixels animate
- [ ] Pixel AI: Open chat → Send message → Get response

### Backend:
- [ ] Health check: `GET /health`
- [ ] Register: `POST /api/auth/register`
- [ ] Login: `POST /api/auth/login`

**Tiempo estimado:** 15 min

---

## ⏱️ TIEMPO TOTAL ESTIMADO: 2-3 horas

---

## 🎯 PLAN DE ACCIÓN (Orden de Ejecución):

### FASE 1 (30 min): Verificar Apps Live
1. Abrir cada app en Vercel
2. Probar flujo básico
3. Fix errores críticos

### FASE 2 (45 min): Pixel AI
1. Verificar código existe
2. Test local
3. Integrar en 2-3 apps principales

### FASE 3 (30 min): Backend
1. Setup .env
2. Test local
3. Fix errores críticos

### FASE 4 (30 min): Shared UI
1. Crear 3 componentes esenciales
2. Test import

### FASE 5 (25 min): Smoke Tests + Documentación
1. Probar todo end-to-end
2. Documentar URLs y credenciales

---

## 🚨 CRÍTICO ANTES DE LANZAR:

- [ ] **TODAS** las apps cargan sin errores de consola
- [ ] **Auth** funciona en al menos 1 app
- [ ] **Backend** responde a /health
- [ ] **Pixel AI** funciona localmente (Ollama)
- [ ] **URLs** documentadas y accesibles
- [ ] **Disclaimer** copyright visible

---

## 📝 POST-LANZAMIENTO (Para después):

- [ ] Tests automatizados
- [ ] CI/CD completo
- [ ] Analytics tracking
- [ ] Error monitoring (Sentry)
- [ ] Performance optimization
- [ ] Mobile responsive fixes

---

## 🎉 ÉXITO = BETA FUNCIONAL HOY

**Objetivo mínimo:**
- 3-4 apps funcionando
- Auth básico
- Pixel AI integrado en 1-2 apps
- Backend responde

**Objetivo ideal:**
- Todas las apps funcionando
- Pixel AI en todas
- Backend completo
- Sin errores críticos

---

**¡Vamos a hacerlo! 💪✨**
