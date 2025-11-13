# 🧪 Testing & Deploy Guide

**Fecha:** 30 de enero, 2025  
**Estado:** Listo para testing y deploy

---

## 🧪 **TESTING**

### **1. Testing Local**

#### **Backend:**
```bash
cd packages/backend
pnpm dev

# Verificar health check
curl http://localhost:3001/health
```

#### **Frontends:**
```bash
# The Generator
cd apps/the-generator
pnpm dev

# Ghost Studio
cd apps/ghost-studio
pnpm dev

# Web Classic (Landing)
cd apps/web-classic
pnpm dev
```

### **2. Testing de Funcionalidad**

#### **A. Audio Player (CRÍTICO)**
- [ ] ✅ Solo una canción suena a la vez
- [ ] ✅ Botón play/pause funciona
- [ ] ✅ Cambiar de canción detiene la anterior
- [ ] ✅ No hay audio "fantasma"

**Cómo probar:**
1. Generar una canción
2. Reproducir
3. Generar otra canción
4. Reproducir la nueva
5. Verificar que la anterior se detuvo

#### **B. Autenticación**
- [ ] ✅ Login funciona
- [ ] ✅ Registro funciona
- [ ] ✅ Google OAuth funciona
- [ ] ✅ Facebook OAuth funciona
- [ ] ✅ Logout funciona

#### **C. Generación de Música**
- [ ] ✅ Generación inicia correctamente
- [ ] ✅ Polling actualiza estado
- [ ] ✅ Audio se descarga cuando está listo
- [ ] ✅ Historial funciona

#### **D. Ghost Studio**
- [ ] ✅ Grabación funciona
- [ ] ✅ Upload funciona
- [ ] ✅ Análisis funciona
- [ ] ✅ Knobs afectan el prompt
- [ ] ✅ Generación de letras funciona
- [ ] ✅ Cover generation funciona

### **3. Testing de Navegadores**

#### **Chrome:**
```bash
# Abrir en Chrome
# Probar todas las funcionalidades
```

#### **Firefox:**
```bash
# Abrir en Firefox
# Probar todas las funcionalidades
```

#### **Safari:**
```bash
# Abrir en Safari (si es posible)
# Probar todas las funcionalidades
```

#### **Móvil:**
```bash
# Abrir en dispositivo móvil
# Probar responsive design
# Probar touch interactions
```

### **4. Testing de Build**

#### **Type Check:**
```bash
cd apps/the-generator
pnpm type-check

cd ../ghost-studio
pnpm type-check
```

#### **Build:**
```bash
cd apps/the-generator
pnpm build

cd ../ghost-studio
pnpm build

cd ../web-classic
pnpm build
```

---

## 🚀 **DEPLOY**

### **1. Backend (Railway/Render)**

#### **Railway:**

1. **Crear proyecto:**
   - Ve a https://railway.app
   - Click "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Conecta tu repositorio

2. **Configurar:**
   - **Root Directory:** `packages/backend`
   - **Build Command:** `pnpm install && pnpm run build`
   - **Start Command:** `pnpm run start`

3. **Variables de entorno:**
   ```env
   DATABASE_URL=postgresql://...
   REDIS_URL=redis://...
   SUPABASE_URL=https://...
   SUPABASE_SERVICE_ROLE_KEY=...
   GENERATION_API_URL=https://ai.imgkits.com/suno
   BACKEND_SECRET=...
   PORT=3001
   NODE_ENV=production
   ```

4. **Migración:**
   ```bash
   # En Railway, ejecutar:
   pnpm prisma migrate deploy
   ```

5. **Health Check:**
   ```bash
   curl https://tu-backend.railway.app/health
   ```

#### **Render:**

1. **Crear servicio:**
   - Ve a https://render.com
   - Click "New +" → "Web Service"
   - Conecta tu repositorio

2. **Configurar:**
   - **Name:** `son1kverse-backend`
   - **Root Directory:** `packages/backend`
   - **Build Command:** `cd packages/backend && pnpm install && pnpm run build`
   - **Start Command:** `cd packages/backend && pnpm run start`

3. **Variables de entorno:** (igual que Railway)

4. **Health Check:**
   ```bash
   curl https://tu-backend.onrender.com/health
   ```

---

### **2. Frontends (Vercel)**

#### **A. The Generator**

1. **Conectar proyecto:**
   ```bash
   cd apps/the-generator
   vercel login
   vercel link
   ```

2. **Configurar en Vercel Dashboard:**
   - **Root Directory:** `apps/the-generator`
   - **Framework Preset:** Vite
   - **Build Command:** `pnpm install && pnpm run build`
   - **Output Directory:** `dist`

3. **Variables de entorno:**
   ```env
   VITE_BACKEND_URL=https://tu-backend.railway.app
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key
   ```

4. **Deploy:**
   ```bash
   vercel --prod
   ```

#### **B. Ghost Studio**

1. **Conectar proyecto:**
   ```bash
   cd apps/ghost-studio
   vercel login
   vercel link
   ```

2. **Configurar en Vercel Dashboard:**
   - **Root Directory:** `apps/ghost-studio`
   - **Framework Preset:** Vite
   - **Build Command:** `pnpm install && pnpm run build`
   - **Output Directory:** `dist`

3. **Variables de entorno:**
   ```env
   VITE_BACKEND_URL=https://tu-backend.railway.app
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key
   ```

4. **Deploy:**
   ```bash
   vercel --prod
   ```

#### **C. Web Classic (Landing)**

1. **Conectar proyecto:**
   ```bash
   cd apps/web-classic
   vercel login
   vercel link
   ```

2. **Configurar en Vercel Dashboard:**
   - **Root Directory:** `apps/web-classic`
   - **Framework Preset:** Vite
   - **Build Command:** `pnpm install && pnpm run build`
   - **Output Directory:** `dist`

3. **Variables de entorno:**
   ```env
   VITE_BACKEND_URL=https://tu-backend.railway.app
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key
   ```

4. **Deploy:**
   ```bash
   vercel --prod
   ```

#### **D. Nova Post Pilot**

1. **Conectar proyecto:**
   ```bash
   cd apps/nova-post-pilot
   vercel login
   vercel link
   ```

2. **Configurar en Vercel Dashboard:**
   - **Root Directory:** `apps/nova-post-pilot`
   - **Framework Preset:** Vite
   - **Build Command:** `pnpm install && pnpm run build`
   - **Output Directory:** `dist`

3. **Variables de entorno:**
   ```env
   VITE_BACKEND_URL=https://tu-backend.railway.app
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key
   ```

4. **Deploy:**
   ```bash
   vercel --prod
   ```

---

### **3. Verificación Post-Deploy**

#### **Backend:**
```bash
# Health check
curl https://tu-backend.railway.app/health

# Debe responder:
# {"status":"ok","timestamp":"..."}
```

#### **Frontends:**
```bash
# The Generator
curl https://the-generator.vercel.app

# Ghost Studio
curl https://ghost-studio.vercel.app

# Web Classic
curl https://web-classic.vercel.app
```

#### **End-to-End:**
1. ✅ Abrir landing page
2. ✅ Login funciona
3. ✅ Generar música funciona
4. ✅ Audio se reproduce
5. ✅ Solo un audio suena a la vez
6. ✅ Historial funciona
7. ✅ Descarga funciona

---

## 📋 **CHECKLIST DEPLOY**

### **Pre-Deploy:**
- [x] ✅ Store de audio implementado
- [x] ✅ Variables de entorno validadas
- [x] ✅ Framer Motion actualizado
- [x] ✅ TypeScript estricto
- [x] ✅ Accesibilidad agregada
- [ ] ⏳ Build verificado
- [ ] ⏳ Type-check verificado

### **Deploy:**
- [ ] ⏳ Backend deployado (Railway/Render)
- [ ] ⏳ Variables de entorno configuradas
- [ ] ⏳ Migración ejecutada
- [ ] ⏳ Frontends deployados (Vercel)
- [ ] ⏳ Variables de entorno configuradas
- [ ] ⏳ Health checks funcionando

### **Post-Deploy:**
- [ ] ⏳ Testing end-to-end
- [ ] ⏳ Verificar en múltiples navegadores
- [ ] ⏳ Verificar en móvil
- [ ] ⏳ Verificar que solo un audio suena

---

## 🚨 **Troubleshooting**

### **Error: Build failed**
```bash
# Verificar dependencias
pnpm install

# Verificar TypeScript
pnpm type-check

# Verificar build
pnpm build
```

### **Error: Variables de entorno no encontradas**
```bash
# Verificar que estén configuradas en Vercel/Railway
# Verificar que tengan el prefijo correcto (VITE_ para Vite)
```

### **Error: Audio múltiple**
```bash
# Verificar que se use useAudioStore
# Verificar que no se creen múltiples Audio instances
```

---

## ✅ **ESTADO FINAL**

**Listo para:**
- ✅ Testing manual
- ✅ Build verification
- ✅ Deploy

**Siguiente paso:**
1. Verificar build local
2. Deploy backend
3. Deploy frontends
4. Testing end-to-end

---

**¡Listo para lanzar beta! 🚀**

