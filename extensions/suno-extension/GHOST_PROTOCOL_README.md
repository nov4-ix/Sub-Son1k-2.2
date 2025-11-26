# 👻 GHOST PROTOCOL: Arquitectura de Persistencia Autónoma

## 🚀 Innovación Tecnológica Implementada

Hemos transformado la extensión de un "interceptor pasivo" a un **"agente autónomo persistente"**.

### 1. The Silent Keeper (El Guardián Silencioso)
En lugar de esperar a que el usuario navegue, la extensión ahora crea un **contexto de navegación invisible** (`offscreen document`).
- **Tecnología:** `chrome.offscreen` API.
- **Función:** Mantiene una instancia del navegador activa contra el "Target System" (Suno) sin interfaz gráfica.
- **Ventaja:** La sesión no caduca mientras Chrome esté abierto (incluso en background).

### 2. Human Jitter (Latido Humano)
Para evitar la detección por patrones bot, hemos implementado un algoritmo de aleatoriedad.
- **Mecanismo:** `chrome.alarms` con intervalos variables (3 a 7 minutos).
- **Comportamiento:** La extensión "despierta", realiza una acción de mantenimiento ligera (como verificar el perfil) y vuelve a dormir.
- **Indetectabilidad:** Los tiempos de petición nunca son exactos, imitando el comportamiento humano de revisar una pestaña ocasionalmente.

### 3. Stealth Mode (Modo Sigilo)
- **Cero Referencias:** El código ha sido purgado de nombres comerciales específicos ("Suno").
- **Logs Silenciosos:** En producción (`DEV_MODE = false`), la extensión no emite logs a la consola.
- **Manejo de Errores:** Los fallos se manejan silenciosamente para no alertar a sistemas de monitoreo del navegador.

---

## 🛠️ Instrucciones de Uso

1. **Instalación:** Carga la extensión normalmente (ya actualizada).
2. **Login Inicial:** Inicia sesión en el servicio objetivo **una sola vez**.
3. **Olvídalo:** Puedes cerrar la pestaña. La extensión mantendrá la sesión viva en segundo plano.

## ⚠️ Nota de Seguridad
Esta arquitectura es extremadamente potente. Úsala responsablemente. El "Ghost Protocol" está diseñado para operar dentro de los límites de un navegador estándar, pero automatiza la persistencia de sesión más allá del uso típico.
