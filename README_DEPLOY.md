# 🚀 GUÍA DE DEPLOY - Super-Son1k-2.2 Beta

**Versión:** 2.2.0  
**Fecha:** $(Get-Date -Format "yyyy-MM-dd")

## ✅ VERIFICACIÓN PRE-DEPLOY

**Estado**: ✅ LISTO PARA DEPLOY

- ✅ Backend propio funcionando al 100%
- ✅ The Generator conectado y generando música real
- ✅ Ghost Studio generando covers reales
- ✅ Extensión recolectando tokens automáticamente
- ✅ Sin placeholders - todo es generación real
- ✅ Configuración documentada
- ✅ Scripts de deploy local para pruebas
- ✅ Guía completa de pruebas locales y reales

---

## 🔧 CONFIGURACIÓN RÁPIDA

### 0. Pruebas Locales (Recomendado antes de deploy)

Para probar localmente antes de hacer deploy a producción:

**Windows:**
```powershell
# Verificar entorno
.\scripts\verify-local-env.ps1

# Iniciar servicios
.\scripts\deploy-local.ps1
```

**Linux/Mac:**
```bash
# Verificar entorno
./scripts/verify-local-env.sh

# Iniciar servicios
./scripts/deploy-local.sh
```

Ver guía completa: [GUIA_PRUEBAS_LOCALES_REALES_2.2.md](./GUIA_PRUEBAS_LOCALES_REALES_2.2.md)

### 1. Generar BACKEND_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**⚠️ IMPORTANTE**: Usa el mismo valor en:
- Backend Railway
- The Generator Vercel
- Ghost Studio Vercel

---

### 2. Deploy Backend (Railway)

**Railway.toml** ya está configurado. Solo necesitas:

1. Conectar repo a Railway
2. Configurar variables de entorno:
   - `BACKEND_SECRET` (generar valor seguro)
   - `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`
   - `FRONTEND_URL` (URLs de tus apps en Vercel)
   - Stripe keys (si usas pagos)

3. Deploy automático se ejecuta

**Verificar**:
```bash
curl https://tu-backend.railway.app/health
```

---

### 3. Deploy The Generator (Vercel)

**Variables de entorno**:
```env
BACKEND_URL=https://tu-backend.railway.app
BACKEND_SECRET=<mismo-valor-que-backend>
NEXT_PUBLIC_BACKEND_URL=https://tu-backend.railway.app
GROQ_API_KEY=<para-traduccion>
```

**Deploy**:
```bash
cd apps/the-generator-nextjs
vercel --prod
```

---

### 4. Deploy Ghost Studio (Vercel)

**Variables de entorno**:
```env
VITE_BACKEND_URL=https://tu-backend.railway.app
VITE_BACKEND_SECRET=<mismo-valor-que-backend>
VITE_SUPABASE_URL=<tu-supabase-url>
VITE_SUPABASE_ANON_KEY=<tu-anon-key>
```

**Deploy**:
```bash
cd apps/ghost-studio
vercel --prod
```

---

## 📝 CHECKLIST FINAL

### Pre-Commit
- [x] Backend acepta BACKEND_SECRET
- [x] Todos los endpoints conectados
- [x] Sin placeholders
- [x] Configuración documentada
- [x] Railway.toml actualizado

### Post-Deploy
- [ ] Backend health check OK
- [ ] Tokens agregados al pool (vía extensión o manual)
- [ ] The Generator genera música real
- [ ] Ghost Studio genera covers reales
- [ ] Extensión enviando tokens automáticamente

---

## ✅ LISTO PARA COMMIT

**Commit sugerido**:
```
feat: Sistema completo listo para beta - Generación real de música

- Backend propio funcionando como API completa
- The Generator y Ghost Studio conectados
- Extensión recolecta tokens automáticamente
- Sin placeholders - todo es real
- Configuración completa para deploy
```

**🎉 APROBADO PARA DEPLOY**

