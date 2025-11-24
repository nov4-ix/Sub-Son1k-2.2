# Guía de Despliegue en Fly.io para el Backend (Actualizada)

Esta guía detalla los pasos probados y exitosos para desplegar el backend de Super-Son1k en Fly.io.

## Estado Actual
**¡Despliegue Exitoso!**
*   **URL:** `https://sub-son1k-2-2.fly.dev/`
*   **Región:** `iad` (Ashburn, Virginia)
*   **Base de Datos:** Postgres (Cluster `sub-son1k-2-2-db`)
*   **Redis:** Upstash Redis

## Prerrequisitos

1.  Tener una cuenta en [Fly.io](https://fly.io/).
2.  Tener instalado `flyctl`.
3.  Estar logueado: `fly auth login`.

## Configuración Realizada

### 1. Archivos de Configuración

**`fly.toml`**:
*   Apunta al `Dockerfile` en la raíz.
*   Define `primary_region = "iad"`.
*   Usa `release_command = "npx prisma db push"` para sincronizar el esquema de la base de datos sin conflictos de historial de migraciones.

**`Dockerfile`**:
*   Ajustado para copiar `pnpm-workspace.yaml` y paquetes compartidos (`shared-types`, `shared-utils`).
*   Genera el cliente de Prisma (`npx prisma generate`) *antes* del build.
*   Eliminada la restricción `--frozen-lockfile` para evitar errores de hash en entornos diferentes (Linux vs Mac).

### 2. Secretos Configurados

Se configuraron las siguientes variables de entorno en Fly:
*   `NODE_ENV`: production
*   `JWT_SECRET`: (Configurado)
*   `BACKEND_SECRET`: (Configurado)
*   `TOKEN_ENCRYPTION_KEY`: (Configurado)
*   `DATABASE_URL`: (Automático)
*   `REDIS_URL`: (Automático)

## Pasos para Redesplegar (Futuros Updates)

Si haces cambios en el código del backend:

1.  **Commit de cambios:**
    ```bash
    git add .
    git commit -m "Descripción de cambios"
    ```

2.  **Desplegar:**
    ```bash
    fly deploy
    ```
    Esto reconstruirá la imagen Docker, aplicará cambios en la DB (vía `db push`) y actualizará las máquinas.

## Solución de Problemas Comunes

### Error de Migraciones (P3019)
Si ves un error como `The datasource provider postgresql specified in your schema does not match the one specified in the migration_lock.toml`, es porque el historial de migraciones local (SQLite u otro) choca con Postgres.
**Solución:** Usamos `npx prisma db push` en el `release_command` del `fly.toml` en lugar de `migrate deploy`.

### Error de Build (Shared Packages)
Si falla el build por no encontrar `shared-types`, asegúrate de que el `Dockerfile` tenga las líneas `COPY` correspondientes para los paquetes del workspace.

### Verificación de Estado
*   Ver logs: `fly logs`
*   Ver estado de máquinas: `fly status`
*   Reiniciar máquinas: `fly apps restart sub-son1k-2-2`
