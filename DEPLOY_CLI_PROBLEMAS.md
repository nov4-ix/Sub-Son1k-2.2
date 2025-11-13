# ⚠️ Deploy CLI - Problemas Encontrados y Soluciones

**Fecha:** 30 de enero, 2025  
**Estado:** ⚠️ **PROBLEMAS DETECTADOS - REQUIERE ACCIÓN MANUAL**

---

## 🔴 **PROBLEMAS ENCONTRADOS**

### **1. Railway - Límite de Plan Gratuito**
```
Error: Free plan resource provision limit exceeded. 
Please upgrade to provision more resources!
```

**Causa:** El plan gratuito de Railway ha excedido el límite de recursos.

**Solución:**
- Opción A: Actualizar a un plan de pago en Railway
- Opción B: Usar el proyecto existente `son1kvers3-backend` (ya vinculado)
- Opción C: Eliminar recursos no utilizados

**Estado:** ✅ Proyecto `son1kvers3-backend` vinculado exitosamente

---

### **2. Railway - Deploy Fallido**
```
Error: Your account is on a limited plan. 
Please visit railway.com/account/plans for details.
```

**Causa:** El plan limitado no permite nuevos deploys.

**Solución:**
- Actualizar plan en Railway Dashboard
- O usar el proyecto existente y hacer deploy manual desde Railway Dashboard

---

### **3. Railway - Migración de Base de Datos**
```
Error: P1001: Can't reach database server at `db.xxx.supabase.co:5432`
```

**Causa:** La base de datos de Supabase no es accesible desde Railway o la URL no está configurada correctamente.

**Solución:**
1. Verificar que `DATABASE_URL` esté configurada en Railway Dashboard
2. Verificar que la base de datos de Supabase permita conexiones externas
3. Usar la URL de conexión correcta de Supabase (con contraseña y puerto)

---

### **4. Vercel - Permisos de Equipo**
```
Error: Git author [email] must have access 
to the team [team-name]'s projects on Vercel to create deployments.
```

**Causa:** El autor del git no tiene acceso al equipo en Vercel.

**Solución:**
- Opción A: Agregar el usuario al equipo en Vercel Dashboard
- Opción B: Cambiar el scope de Vercel CLI al usuario personal
- Opción C: Configurar el git author para usar el email del equipo

**Estado:** ✅ Proyectos vinculados exitosamente:
- `the-generator`
- `ghost-studio`
- `web-classic`
- `nova-post-pilot`

---

## ✅ **LOGROS**

1. ✅ **Railway CLI:** Conectado al proyecto `son1kvers3-backend`
2. ✅ **Vercel CLI:** Proyectos vinculados exitosamente
3. ✅ **Configuración:** Archivos `.vercel` creados en cada frontend

---

## 🔧 **SOLUCIONES PASO A PASO**

### **Railway - Usar Proyecto Existente**

1. **Verificar proyecto vinculado:**
```bash
cd packages/backend
railway status
```

2. **Configurar variables de entorno en Railway Dashboard:**
   - Ve a https://railway.app
   - Selecciona proyecto `son1kvers3-backend`
   - Ve a "Variables"
   - Agrega todas las variables requeridas

3. **Deploy desde Railway Dashboard:**
   - Ve a "Deployments"
   - Click "Redeploy" o "New Deployment"
   - O espera a que se despliegue automáticamente desde GitHub

---

### **Vercel - Resolver Permisos**

#### **Opción A: Agregar Usuario al Equipo**
1. Ve a https://vercel.com/teams
2. Selecciona tu equipo
3. Ve a "Members"
4. Invita al usuario que necesita acceso

#### **Opción B: Cambiar Scope**
```bash
# Cambiar a scope personal
vercel switch

# O usar el scope del equipo directamente
vercel --scope [team-scope-id]
```

#### **Opción C: Configurar Git Author**
```bash
# Configurar git author para el equipo
git config user.email "email-del-equipo@ejemplo.com"
git config user.name "Nombre del Equipo"
```

---

### **Vercel - Deploy Manual desde Dashboard**

1. **Para cada frontend:**
   - Ve a https://vercel.com
   - Selecciona el proyecto (the-generator, ghost-studio, etc.)
   - Click "Deployments"
   - Click "Redeploy" o espera a que se despliegue desde GitHub

2. **Configurar variables de entorno:**
   - Ve a "Settings" → "Environment Variables"
   - Agrega:
     - `VITE_BACKEND_URL`
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

---

## 📋 **CHECKLIST DE ACCIONES REQUERIDAS**

### **Railway**
- [ ] ⏳ Actualizar plan o usar proyecto existente
- [ ] ⏳ Configurar variables de entorno en Railway Dashboard
- [ ] ⏳ Verificar `DATABASE_URL` es accesible
- [ ] ⏳ Ejecutar migración desde Railway Dashboard o CLI
- [ ] ⏳ Verificar deploy en Railway Dashboard

### **Vercel**
- [ ] ⏳ Resolver permisos del equipo
- [ ] ⏳ Configurar variables de entorno en Vercel Dashboard
- [ ] ⏳ Deploy manual desde Vercel Dashboard o resolver permisos CLI
- [ ] ⏳ Verificar deploys en Vercel Dashboard

---

## 🚀 **PRÓXIMOS PASOS RECOMENDADOS**

1. **Railway:**
   - Usar Railway Dashboard para deploy (más confiable con plan limitado)
   - Configurar todas las variables de entorno
   - Ejecutar migración desde Railway Dashboard Terminal

2. **Vercel:**
   - Resolver permisos del equipo
   - O hacer deploy manual desde Vercel Dashboard
   - Configurar variables de entorno para cada proyecto

3. **Verificación:**
   - Verificar health check del backend
   - Verificar que todos los frontends carguen correctamente
   - Probar funcionalidad end-to-end

---

## ✅ **ESTADO FINAL**

**Railway:** ⚠️ Requiere acción manual (plan o proyecto existente)  
**Vercel:** ⚠️ Requiere permisos del equipo o deploy manual

**Recomendación:** Usar Railway y Vercel Dashboards para deploy manual

---

**¡Problemas identificados y soluciones documentadas! 🔧**

