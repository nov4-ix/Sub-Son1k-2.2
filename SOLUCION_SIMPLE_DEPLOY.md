# 🚀 Solución Simple - Deploy Backend

## 🔍 Problema Actual

El deploy no está funcionando. Vamos a solucionarlo paso a paso.

---

## ✅ OPCIÓN 1: Deploy Manual desde Dashboard (MÁS FÁCIL)

### **Paso 1: Verificar que el servicio existe**

1. Ve a tu proyecto en Railway: https://railway.com/project/d1e9aa4d-3522-4fec-9277-913101ea4780
2. Verifica que hay un servicio conectado a GitHub
3. Si NO hay servicio, crea uno:
   - Click **"New"** → **"GitHub Repo"**
   - Selecciona: `nov4-ix/Super-Son1k-2.1-main`
   - Branch: `main`

### **Paso 2: Forzar Deploy Manual**

1. Ve al servicio backend
2. Click en **"Deployments"**
3. Click en **"New Deployment"** o **"Redeploy"**
4. Selecciona la rama: `main`
5. Click **"Deploy"**

### **Paso 3: Ver Logs en Tiempo Real**

1. Mientras se despliega, click en **"View Logs"**
2. Busca errores en rojo
3. Los errores más comunes:
   - ❌ "Missing environment variable" → Falta una variable
   - ❌ "Build failed" → Error en el build
   - ❌ "Module not found" → Dependencia faltante

---

## ✅ OPCIÓN 2: Verificar Variables de Entorno

### **Variables OBLIGATORIAS que debes tener:**

En el servicio backend → **"Variables"**, verifica que tengas:

```bash
✅ DATABASE_URL (automática del Postgres)
✅ REDIS_URL (automática del Redis)
✅ JWT_SECRET (Railway lo genera)
✅ SUPABASE_URL (tu valor)
✅ SUPABASE_SERVICE_ROLE_KEY (tu valor)
✅ SUNO_API_KEY (tu valor)
✅ FRONTEND_URL (tu valor)
✅ BACKEND_SECRET (tu valor)
```

**Si falta alguna, el deploy fallará.**

---

## ✅ OPCIÓN 3: Verificar Build Command

Railway debería detectar automáticamente desde `railway.toml`:

```toml
buildCommand = "cd packages/backend && npm install && npm run build"
startCommand = "cd packages/backend && npm run start"
```

**Si no funciona, configura manualmente:**

1. Ve al servicio → **"Settings"** → **"Build & Deploy"**
2. **Build Command:** `cd packages/backend && npm install && npm run build`
3. **Start Command:** `cd packages/backend && npm run start`
4. **Root Directory:** `/` (raíz del repo)

---

## ✅ OPCIÓN 4: Deploy desde CLI (Si tienes plan)

Si el dashboard no funciona, intenta desde terminal:

```bash
# Cambiar al servicio backend
railway service backend

# Hacer deploy
railway up
```

---

## 🐛 Troubleshooting Común

### **Error: "Build failed"**

**Causa:** Error en npm install o build
**Solución:**
1. Ver logs completos
2. Busca el error específico
3. Puede ser falta de dependencias o error de TypeScript

### **Error: "Missing environment variable"**

**Causa:** Falta una variable requerida
**Solución:**
1. Ve a Variables
2. Verifica que todas las OBLIGATORIAS estén configuradas
3. Revisa `railway.toml` para ver cuáles son requeridas

### **Error: "Cannot find module"**

**Causa:** Dependencia faltante
**Solución:**
1. Verifica `packages/backend/package.json`
2. Asegúrate que todas las dependencias estén listadas
3. Puede necesitar `npm install` en el build

### **Error: "Port already in use"**

**Causa:** Puerto ocupado
**Solución:**
- Railway maneja esto automáticamente
- Verifica que `PORT` no esté hardcodeado

---

## 🎯 Pasos Rápidos para Resolver

1. **Abre el proyecto en Railway**
2. **Ve al servicio backend**
3. **Click "Deployments" → "View Logs"**
4. **Copia el error completo**
5. **Compártelo y te ayudo a resolverlo**

---

## 💡 Alternativa: Render.com (Más Simple)

Si Railway sigue dando problemas, Render.com es más simple:

1. Ve a https://render.com
2. New → Web Service
3. Conecta GitHub: `Super-Son1k-2.1-main`
4. Configura:
   - **Build Command:** `cd packages/backend && npm install && npm run build`
   - **Start Command:** `cd packages/backend && npm run start`
5. Agrega variables de entorno
6. Deploy

---

## 📞 ¿Qué Error Ves Exactamente?

Para ayudarte mejor, necesito saber:

1. ¿Qué dice en los logs cuando intenta deployar?
2. ¿Hay algún error en rojo?
3. ¿En qué paso falla? (Build, Start, etc.)

**Comparte el error y te ayudo a resolverlo específicamente.**

