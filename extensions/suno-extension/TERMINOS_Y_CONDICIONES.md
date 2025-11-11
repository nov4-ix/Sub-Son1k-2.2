# 📋 Términos y Condiciones - Extensión Son1kVerse

## 🎯 ¿Qué hace la extensión?

La extensión **Son1kVerse AI Music Engine** es una herramienta que mejora tu experiencia en la plataforma Son1kVerse permitiendo la generación ilimitada de música.

### Funcionalidad Principal

1. **Extracción de Tokens JWT**
   - La extensión extrae tokens JWT de forma segura desde tu sesión activa
   - Estos tokens se utilizan para acceder a servicios de generación de música
   - Los tokens se extraen únicamente cuando estás activamente usando el servicio

2. **Envío al Pool Compartido**
   - Los tokens extraídos se envían a un pool compartido de la plataforma
   - Este pool permite que todos los usuarios de Son1kVerse tengan acceso a generación de música
   - Los tokens se comparten de forma anónima y segura

3. **Funcionamiento Automático**
   - La extensión funciona automáticamente en segundo plano
   - No requiere intervención del usuario una vez instalada
   - Extrae tokens periódicamente (cada 5 minutos) cuando detecta actividad

---

## 🔐 Permisos Requeridos

### 1. Lectura de Cookies (`cookies`)

**¿Por qué lo necesitamos?**
- Para extraer tokens JWT de forma segura desde tu sesión activa
- Solo lee la cookie `__client` que contiene tu token de autenticación
- No lee otras cookies ni información personal

**¿Qué hace exactamente?**
```javascript
// Solo lee esta cookie específica:
const token = getCookie('__client');
// No accede a otras cookies ni datos personales
```

### 2. Acceso a Pestañas Activas (`activeTab`, `tabs`)

**¿Por qué lo necesitamos?**
- Para detectar cuando estás en el sitio objetivo
- Para saber cuándo extraer tokens (solo cuando estás activo)
- Para verificar que estás en la página correcta

**¿Qué hace exactamente?**
- Verifica si estás en el sitio objetivo
- No lee el contenido de las pestañas
- No accede a información personal

### 3. Almacenamiento Local (`storage`)

**¿Por qué lo necesitamos?**
- Para guardar tokens temporalmente antes de enviarlos
- Para mantener configuración de la extensión
- Para recordar preferencias del usuario

**¿Qué hace exactamente?**
- Almacena tokens encriptados localmente
- Solo en tu navegador, no se comparte con terceros
- Se elimina automáticamente después de enviar

### 4. Solicitudes Web (`webRequest`)

**¿Por qué lo necesitamos?**
- Para enviar tokens al pool de forma segura
- Para comunicarse con nuestros servidores
- Para verificar el estado de los tokens

**¿Qué hace exactamente?**
- Envía tokens encriptados a nuestros servidores seguros
- Solo a nuestros servidores, no a terceros
- Usa conexiones HTTPS encriptadas

### 5. Scripting (`scripting`)

**¿Por qué lo necesitamos?**
- Para inyectar scripts necesarios para extraer tokens
- Solo en el sitio objetivo, no en otros sitios
- Para leer cookies de forma segura

**¿Qué hace exactamente?**
- Inyecta un script mínimo para leer cookies
- Solo en el sitio objetivo
- No modifica el contenido de la página

---

## 🔒 Privacidad y Seguridad

### ¿Qué datos se recopilan?

1. **Tokens JWT**
   - Solo tokens de autenticación necesarios para la generación
   - No incluyen información personal identificable
   - Se encriptan antes de almacenar

2. **Metadatos Técnicos**
   - Timestamp de extracción
   - URL del sitio (solo para verificación)
   - ID del dispositivo (anonimizado)

### ¿Qué NO se recopila?

- ❌ Información personal (nombre, email, etc.)
- ❌ Contraseñas o credenciales
- ❌ Historial de navegación
- ❌ Datos de otras pestañas
- ❌ Información de tarjetas de crédito
- ❌ Cualquier otro dato personal

### ¿Cómo se protegen los datos?

1. **Encriptación**
   - Los tokens se encriptan antes de almacenar localmente
   - Las comunicaciones con el servidor usan HTTPS
   - Los tokens se envían de forma segura

2. **Almacenamiento Local**
   - Los datos solo se almacenan en tu navegador
   - No se comparten con terceros
   - Se eliminan automáticamente después de usar

3. **Acceso Limitado**
   - Solo accede al sitio objetivo
   - No accede a otros sitios web
   - No modifica contenido de páginas

---

## ✅ Tus Derechos

### Puedes:

1. **Desinstalar en cualquier momento**
   - Ve a `chrome://extensions/`
   - Click en "Eliminar" junto a la extensión
   - Todos los datos locales se eliminarán

2. **Revisar qué datos se almacenan**
   - Abre el popup de la extensión
   - Ve a "Tokens Capturados"
   - Revisa qué tokens se han extraído

3. **Desactivar extracción automática**
   - Abre el popup de la extensión
   - Desactiva "Extracción Automática"
   - La extensión dejará de extraer tokens automáticamente

4. **Contactarnos**
   - Si tienes preguntas o preocupaciones
   - Email: team@son1kverse.com
   - Abre un issue en GitHub

---

## ⚠️ Limitaciones

1. **Solo funciona en sitios específicos**
   - La extensión solo funciona en el sitio objetivo
   - No funciona en otros sitios web
   - No accede a información de otros sitios

2. **Requiere sesión activa**
   - Debes estar logueado en el sitio objetivo
   - La extensión no puede crear sesiones
   - Solo extrae tokens de sesiones existentes

3. **No garantiza disponibilidad**
   - Los tokens pueden expirar
   - El servicio puede tener límites
   - No garantizamos disponibilidad 24/7

---

## 📝 Aceptación de Términos

Al instalar y usar esta extensión, aceptas:

1. ✅ Que la extensión extraiga tokens JWT de tu sesión activa
2. ✅ Que los tokens se envíen al pool compartido de la plataforma
3. ✅ Que la extensión funcione automáticamente en segundo plano
4. ✅ Que se recopilen los metadatos técnicos mencionados
5. ✅ Que se almacenen datos localmente en tu navegador
6. ✅ Que se comunique con nuestros servidores de forma segura

**Si no estás de acuerdo con estos términos, no instales la extensión.**

---

## 🔄 Actualizaciones

Estos términos pueden actualizarse. Te notificaremos de cambios importantes.

**Última actualización:** Enero 2025

---

## 📧 Contacto

Si tienes preguntas sobre estos términos:
- Email: team@son1kverse.com
- GitHub: [Issues](https://github.com/nov4-ix/Super-Son1k-2.1-main/issues)

---

**Al instalar la extensión, confirmas que has leído, entendido y aceptado estos términos y condiciones.**

