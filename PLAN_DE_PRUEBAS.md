# 🧪 PLAN DE PRUEBAS - SUPER-SON1K-2.2

**Fecha:** 2025-11-22 10:19 CST  
**Status:** 🟢 LISTO PARA PRUEBAS  

---

## 📋 PRUEBAS A REALIZAR

### **1. Health Check del Backend** ✅

```bash
# Verificar que el backend está running
curl https://sub-son1k-2-2.fly.dev/health

# Debe retornar:
{
  "status": "healthy",
  "timestamp": "...",
  "services": {
    "database": "connected",
    "redis": "connected",
    "tokenManager": "active"
  }
}
```

---

### **2. Verificar Pool de Tokens** ✅

```bash
# Ver status del token pool
curl https://sub-son1k-2-2.fly.dev/api/tokens/pool/status

# Debe mostrar:
{
  "healthy Tokens": X,
  "totalTokens": Y,
  "...": "..."
}
```

---

### **3. Test de Generación de Música** ✅

Ejecutar el script de testing E2E:

```bash
./scripts/test-music-generation-integration.sh
```

Este script:
- ✅ Verifica health del backend
- ✅ Registra usuario de prueba
- ✅ Crea generación de música
- ✅ Hace polling del status
- ✅ Verifica que retorna audioUrl

---

### **4. Probar Frontends** ✅

#### **The Generator (Next.js):**
```bash
# URL del frontend
https://the-generator-nextjs-son1kvers3s-projects-c805d053.versel.app

Pruebas:
1. Cargar página
2. Generar letra con IA
3. Generar prompt musical
4. Iniciar generación de música
5. Verificar polling de status
6. Reproducir audio cuando complete
```

#### **Ghost Studio:**
```bash
# URL del frontend  
https://ghost-studio-9nzfqsxeg-son1kvers3s-projects-c805d053.vercel.app

Pruebas:
1. Cargar página
2. Subir archivo de audio
3. Generar cover
4. Ver progress bar en tiempo real
5. Descargar resultado
```

#### **Web Classic:**
```bash
# URL del frontend
https://web-classic-823nt5b3j-son1kvers3s-projects-c805d053.vercel.app

Pruebas:
1. Cargar página
2. Generar música
3. Ver historial
4. Reproducir tracks
```

---

### **5. Tests de Integración Backend-Frontend** ✅

```bash
# Test manual con curl
curl -X POST https://sub-son1k-2-2.fly.dev/api/generation/create \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer TOKEN_AQUI' \
  -d '{
    "prompt": "Test song",
    "style": "pop",
    "duration": 60,
    "quality": "standard"
  }'

# Debe retornar:
{
  "success": true,
  "data": {
    "generationId": "...",
    "sunoId": "...",
    "status": "PENDING"
  }
}
```

---

### **6. Test de Errores y Edge Cases** ✅

```bash
# 1. Sin token (debe fallar con 401)
curl https://sub-son1k-2-2.fly.dev/api/generation/create

# 2. Prompt vacío (debe fallar con validación)
curl -X POST https://sub-son1k-2-2.fly.dev/api/generation/create \
  -H 'Authorization: Bearer TOKEN' \
  -d '{"prompt": ""}'

# 3. Sin tokens en el pool (debe retornar error específico)
# (solo si el pool está vacío)
```

---

### **7. Test de Performance** ✅

```bash
# Múltiples requests concurrentes
for i in {1..5}; do
  curl -X POST https://sub-son1k-2-2.fly.dev/api/generation/create \
    -H 'Authorization: Bearer TOKEN' \
    -d '{"prompt": "Test '$i'", "style": "pop"}' &
done

# Verificar que todas se procesen
```

---

### **8. Test de Retry Logic** ✅

Verificar en los frontends:
1. Desconectar internet temporalmente
2. Intentar generar música
3. Reconectar internet
4. Verificar que el retry automático funciona

---

## 📊 CHECKLIST DE PRUEBAS

### **Backend:**
- [ ] Health check responde
- [ ] Pool de tokens funciona
- [ ] API de generación responde
- [ ] Polling de status funciona
- [ ] Database está conectada
- [ ] Redis está conectado (si aplica)

### **Frontends:**
- [ ] The Generator carga correctamente
- [ ] Ghost Studio carga correctamente
- [ ] Web Classic carga correctamente
- [ ] Variables de entorno configuradas
- [ ] Conexión al backend funciona
- [ ] Generación de música funciona
- [ ] Polling de status funciona
- [ ] Audio se reproduce correctamente

### **Integración:**
- [ ] Frontend → Backend funciona
- [ ] Backend → External API funciona
- [ ] Polling actualiza UI en tiempo real
- [ ] Errores se manejan correctamente
- [ ] Retry logic funciona

---

## 🐛 DEBUGGING

Si algo falla:

### **1. Ver logs del backend:**
```bash
export FLYCTL_INSTALL="$HOME/.fly" && export PATH="$FLYCTL_INSTALL/bin:$PATH"
fly logs -a sub-son1k-2-2
```

### **2. Ver logs de un frontend:**
```bash
# En Vercel dashboard
https://vercel.com/son1kvers3s-projects-c805d053/NOMBRE_PROYECTO/logs
```

### **3. Verificar variables:**
```bash
# Backend
fly secrets list -a sub-son1k-2-2

# Frontend  
cd apps/the-generator-nextjs
vercel env ls
```

### **4. SSH al backend:**
```bash
fly ssh console -a sub-son1k-2-2
```

---

## ✅ RESULTADO ESPERADO

Al finalizar las pruebas:

- ✅ Backend responde en https://sub-son1k-2-2.fly.dev
- ✅ Health check muestra "healthy"
- ✅ Pool de tokens tiene al menos 1 token
- ✅ Generación de música funciona end-to-end
- ✅ Todos los frontends cargan y funcionan
- ✅ Polling actualiza status correctamente
- ✅ Audio se genera y reproduce
- ✅ No hay errores críticos en logs

---

**Preparado por:** Antigravity AI  
**Para ejecutar:** Cuando el deployment de Fly.io complete  
**Tiempo estimado:** 15-20 minutos de pruebas
