# ✅ Checklist de Verificación Post-Despliegue

**Úsalo después de desplegar para asegurar que todo funciona correctamente.**

---

## 🔍 Verificación Inicial

### Backend (Railway)

- [ ] **Health Check funciona**
  ```bash
  curl https://tu-backend.railway.app/health
  ```
  - Debe responder con `{"status": "healthy", ...}`

- [ ] **Token Pool Status**
  ```bash
  curl https://tu-backend.railway.app/api/tokens/pool/status
  ```
  - Debe responder con estadísticas del pool

- [ ] **Logs sin errores críticos**
  - Revisa Railway Dashboard > Deployments > Logs
  - No debe haber errores de conexión a base de datos
  - No debe haber errores de autenticación

- [ ] **Variables de entorno configuradas**
  - [ ] `BACKEND_SECRET` configurado
  - [ ] `FRONTEND_URL` incluye todas las URLs
  - [ ] `DATABASE_URL` configurado (auto-provisionado)
  - [ ] `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` (si usas Supabase)

---

### Frontends (Vercel)

#### The Generator Next.js

- [ ] **Sitio carga correctamente**
  - Abre `https://the-generator.vercel.app`
  - No debe haber errores en la consola del navegador
  - La página debe cargar completamente

- [ ] **Variables de entorno configuradas**
  - [ ] `BACKEND_URL` apunta al backend de Railway
  - [ ] `BACKEND_SECRET` coincide con el backend
  - [ ] `NEXT_PUBLIC_BACKEND_URL` configurado
  - [ ] `SUPABASE_URL` y `SUPABASE_ANON_KEY` (si usas Supabase)
  - [ ] `GROQ_API_KEY` (para traducción)

- [ ] **Generación de música funciona**
  1. Escribe un prompt musical
  2. Click en "Generate"
  3. Espera 60-120 segundos
  4. El audio debe reproducirse ✅

- [ ] **Logs sin errores**
  - Revisa Vercel Dashboard > Functions > Logs
  - No debe haber errores de conexión al backend

#### Ghost Studio

- [ ] **Sitio carga correctamente**
  - Abre `https://ghost-studio.vercel.app`
  - No debe haber errores en la consola
  - La interfaz debe cargar completamente

- [ ] **Variables de entorno configuradas**
  - [ ] `VITE_BACKEND_URL` apunta al backend
  - [ ] `VITE_BACKEND_SECRET` coincide con el backend
  - [ ] `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
  - [ ] `VITE_SUNO_API_KEY` (fallback)

- [ ] **Generación de covers funciona**
  1. Sube un archivo de audio
  2. Escribe un prompt para el cover
  3. Click en "Generate Cover"
  4. Espera 60-120 segundos
  5. El audio debe reproducirse ✅

- [ ] **Análisis de audio funciona**
  - Sube un archivo de audio
  - Verifica que se analiza correctamente

#### Web Classic

- [ ] **Sitio carga correctamente**
  - Abre `https://web-classic.vercel.app`
  - No debe haber errores en la consola
  - El dashboard debe cargar

- [ ] **Variables de entorno configuradas**
  - [ ] `VITE_BACKEND_URL` configurado
  - [ ] `VITE_BACKEND_SECRET` configurado
  - [ ] `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
  - [ ] `VITE_GROQ_API_KEY` (para Pixel AI)

- [ ] **Navegación funciona**
  - Navega entre las diferentes secciones
  - Verifica que no hay errores

- [ ] **Pixel AI funciona**
  - Envía un mensaje a Pixel AI
  - Verifica que responde correctamente

#### Nova Post Pilot

- [ ] **Sitio carga correctamente**
  - Abre `https://nova-post-pilot.vercel.app`
  - No debe haber errores en la consola

- [ ] **Variables de entorno configuradas**
  - [ ] `VITE_BACKEND_URL` configurado
  - [ ] `VITE_BACKEND_SECRET` configurado
  - [ ] `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`

- [ ] **Autenticación funciona**
  - Intenta hacer login/signup
  - Verifica que funciona correctamente

---

## 🔗 Verificación de Conexiones

### Backend ↔ Frontends

- [ ] **CORS configurado correctamente**
  - Las apps frontend pueden hacer requests al backend
  - No hay errores de CORS en la consola del navegador

- [ ] **Autenticación funcionando**
  - `BACKEND_SECRET` es el mismo en backend y frontends
  - Los requests autenticados funcionan

- [ ] **APIs responden correctamente**
  - `/api/generation/create` funciona
  - `/api/generation/:id/status` funciona
  - `/api/generation/cover` funciona

---

## 🎵 Verificación Funcional

### Generación de Música

- [ ] **The Generator**
  - [ ] Genera música real (no placeholders)
  - [ ] Polling funciona correctamente
  - [ ] Audio se reproduce
  - [ ] Descarga funciona

- [ ] **Ghost Studio**
  - [ ] Genera covers reales
  - [ ] Análisis de audio funciona
  - [ ] Audio se reproduce
  - [ ] Descarga funciona

### Autenticación (si está configurada)

- [ ] **Login funciona**
- [ ] **Signup funciona**
- [ ] **Logout funciona**
- [ ] **Sesión persiste**

### Extensión Chrome (si está desplegada)

- [ ] **Recolecta tokens automáticamente**
- [ ] **Envía tokens al backend**
- [ ] **Envía tokens a Supabase (si aplica)**

---

## 📊 Verificación de Performance

### Backend

- [ ] **Response time < 500ms** (para endpoints simples)
- [ ] **Health check < 200ms**
- [ ] **Base de datos conectada** (sin timeouts)
- [ ] **Token pool operativo**

### Frontends

- [ ] **Time to First Byte (TTFB) < 1s**
- [ ] **Time to Interactive (TTI) < 3s**
- [ ] **No errores de build**
- [ ] **Assets cargan correctamente**

---

## 🔐 Verificación de Seguridad

- [ ] **Variables sensibles no expuestas**
  - No hay secrets en el código del frontend
  - Variables de entorno configuradas correctamente

- [ ] **HTTPS configurado**
  - Todas las URLs usan HTTPS
  - Certificados SSL válidos

- [ ] **Rate limiting activo** (si está configurado)
- [ ] **CORS configurado correctamente**
  - Solo permite los orígenes necesarios

---

## 📝 Verificación de Documentación

- [ ] **URLs documentadas**
  - Backend URL anotada
  - Frontend URLs anotadas
  - Variables de entorno documentadas

- [ ] **Secrets guardados de forma segura**
  - `BACKEND_SECRET` guardado de forma segura
  - No compartido públicamente

---

## 🚨 Problemas Comunes

### Si el backend no responde:

1. Verifica que Railway está corriendo
2. Revisa los logs en Railway
3. Verifica que `DATABASE_URL` está configurado
4. Verifica que `PORT` y `HOST` están correctos

### Si los frontends no se conectan al backend:

1. Verifica que `BACKEND_URL` es correcto
2. Verifica que `BACKEND_SECRET` coincide
3. Verifica que `FRONTEND_URL` en Railway incluye todas las URLs
4. Reinicia el deployment después de cambiar variables

### Si la generación de música falla:

1. Verifica que hay tokens en el pool
2. Verifica que `SUNO_API_URL` es correcto
3. Revisa los logs del backend para errores específicos
4. Verifica que el backend puede hacer requests externos

### Si hay errores de CORS:

1. Verifica que `FRONTEND_URL` incluye todas las URLs
2. Verifica que las URLs están separadas por comas sin espacios
3. Reinicia el deployment después de cambiar variables

---

## ✅ Checklist Final

- [ ] **Backend desplegado y funcionando**
- [ ] **Todos los frontends desplegados y funcionando**
- [ ] **Generación de música funciona**
- [ ] **Generación de covers funciona**
- [ ] **Autenticación funciona (si está configurada)**
- [ ] **No hay errores críticos en logs**
- [ ] **Performance aceptable**
- [ ] **Variables de entorno configuradas correctamente**
- [ ] **Documentación actualizada**

---

## 🎉 ¡Todo Listo!

Si todos los checks pasan, ¡tu aplicación está lista para producción!

**Próximos pasos sugeridos:**
1. Configurar monitoreo (Sentry, LogRocket, etc.)
2. Configurar analytics (Vercel Analytics, PostHog, etc.)
3. Configurar alertas (UptimeRobot, etc.)
4. Configurar backups de base de datos
5. Configurar dominio personalizado (opcional)

---

**Fecha de verificación:** _______________
**Verificado por:** _______________

