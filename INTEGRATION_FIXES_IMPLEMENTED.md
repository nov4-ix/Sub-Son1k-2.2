# 🔧 Correcciones de Integración Backend-Frontend

## ✅ Implementadas

### 1. **Validación de Variables de Entorno**

**Archivos modificados:**
- `apps/the-generator-nextjs/app/api/generate-music/route.ts`
- `apps/ghost-studio/src/components/BackendGenerateButton.tsx`
- `apps/ghost-studio/src/hooks/useSunoCover.ts`

**Cambios:**
- ✅ Validación temprana de `BACKEND_URL` antes de hacer requests
- ✅ Mensajes de error claros indicando qué variable falta
- ✅ Sugerencias en consola para developers
- ✅ Eliminadas URLs hardcoded de Railway

**Ejemplo de validación:**
```typescript
const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
if (!BACKEND_URL) {
  console.error('❌ BACKEND_URL not configured');
  console.error('💡 TIP: Define BACKEND_URL o NEXT_PUBLIC_BACKEND_URL en .env');
  return NextResponse.json({
    error: 'Backend URL not configured',
    tip: 'Ejemplo: BACKEND_URL=https://your-backend.fly.dev'
  }, { status: 500 });
}
```

---

### 2. **Utilidades de Retry con Exponential Backoff**

**Archivo creado:**
- `packages/shared-utils/src/retry.ts`

**Funcionalidades:**
- ✅ `withRetry()` - Ejecuta función con retry automático
- ✅ `pollWithRetry()` - Polling robusto con timeout
- ✅ `fetchWithRetry()` - Fetch con retry en errores 5xx
- ✅ Exponential backoff configurable
- ✅ Callbacks de progreso
- ✅ Manejo de timeouts

**Uso en frontend:**
```typescript
import { fetchWithRetry, pollWithRetry } from '@super-son1k/shared-utils';

// Fetch con retry
const response = await fetchWithRetry(
  `${BACKEND_URL}/api/generation/create`,
  {
    method: 'POST',
    headers: { ... },
    body: JSON.stringify(data)
  },
  {
    maxRetries: 3,
    initialDelay: 1000,
    onRetry: (attempt, error) => {
      console.log(`Intento ${attempt} falló:`, error.message);
    }
  }
);

// Polling con retry
const result = await pollWithRetry(
  async () => {
    const res = await fetch(`${BACKEND_URL}/api/generation/${id}/status`);
    const data = await res.json();
    
    if (data.data.status === 'COMPLETED') {
      return data.data; // Retorna resultado
    }
    return null; // Continuar polling
  },
  {
    interval: 5000,      // Poll cada 5 segundos
    timeout: 300000,     // Timeout en 5 minutos
    retryOptions: {
      maxRetries: 3,     // 3 reintentos por polling
      initialDelay: 1000
    },
    onPoll: (result, attempt) => {
      console.log(`Polling attempt ${attempt}...`);
    }
  }
);
```

---

## 📝 Siguiente Paso: Aplicar Retry Logic

### **The Generator (Next.js)**

**Archivo:** `apps/the-generator-nextjs/app/generator/page.tsx`

**Antes:**
```typescript
const res = await fetch('/api/generate-music', {
  method: 'POST',
  body: JSON.stringify(data)
});

if (!res.ok) throw new Error('Failed');
```

**Después (recomendado):**
```typescript
import { fetchWithRetry } from '@super-son1k/shared-utils';

const res = await fetchWithRetry('/api/generate-music', {
  method: 'POST',
  body: JSON.stringify(data)
}, {
  maxRetries: 3,
  initialDelay: 1000,
  onRetry: (attempt) => {
    setRetryAttempt(attempt);
    showToast(`Reintentando... (${attempt}/3)`, 'warning');
  }
});
```

---

### **Ghost Studio - Polling de Cover**

**Archivo:** `apps/ghost-studio/src/hooks/useSunoCover.ts`

**Antes:**
```typescript
const pollInterval = setInterval(async () => {
  const response = await fetch(`${BACKEND_URL}/api/generation/cover/status/${taskId}`);
  // ...
}, 5000);
```

**Después (recomendado):**
```typescript
import { pollWithRetry } from '@super-son1k/shared-utils';

try {
  const result = await pollWithRetry(
    async () => {
      const { backendUrl: BACKEND_URL } = await import('../lib/config/env');
      const response = await fetch(`${BACKEND_URL}/api/generation/cover/status/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_BACKEND_SECRET || 'dev-token'}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) return null; // Continuar polling
        throw new Error(`Status check failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.data?.status === 'COMPLETED' && data.data?.audioUrl) {
        return data.data; // Retornar resultado
      }
      
      if (data.data?.status === 'FAILED') {
        throw new Error(data.error?.message || 'Cover generation failed');
      }
      
      return null; // Continuar polling
    },
    {
      interval: 5000,
      timeout: 300000,
      retryOptions: {
        maxRetries: 3,
        initialDelay: 2000
      },
      onPoll: (result, attempt) => {
        console.log(`Polling cover status... attempt ${attempt}`);
      }
    }
  );
  
  setResult({
    status: 'completed',
    taskId: taskId,
    audio_url: result.audioUrl
  });
  setIsGenerating(false);
  
} catch (error) {
  console.error('Polling failed:', error);
  setError(error.message || 'Error checking cover status');
  setIsGenerating(false);
}
```

---

## 🧪 Testing

### **Test de Retry Logic**

```typescript
// test/retry.test.ts
import { withRetry, pollWithRetry, RetryError } from '@super-son1k/shared-utils';

describe('Retry Logic', () => {
  it('should retry on failure', async () => {
    let attempts = 0;
    const fn = async () => {
      attempts++;
      if (attempts < 3) throw new Error('Transient error');
      return 'success';
    };
    
    const result = await withRetry(fn, { maxRetries: 3 });
    expect(result).toBe('success');
    expect(attempts).toBe(3);
  });
  
  it('should throw RetryError after max retries', async () => {
    const fn = async () => {
      throw new Error('Permanent error');
    };
    
    await expect(
      withRetry(fn, { maxRetries: 2 })
    ).rejects.toThrow(RetryError);
  });
  
  it('should poll until result', async () => {
    let pollCount = 0;
    const pollFn = async () => {
      pollCount++;
      if (pollCount < 3) return null;
      return { status: 'completed' };
    };
    
    const result = await pollWithRetry(pollFn, { interval: 100 });
    expect(result.status).toBe('completed');
    expect(pollCount).toBe(3);
  });
});
```

---

## 📊 Configuración Recomendada

### **Desarrollo Local**

**.env.local** (The Generator Next.js)
```bash
BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
BACKEND_SECRET=dev-backend-secret
GROQ_API_KEY=your-groq-key
```

**.env** (Ghost Studio, Web Classic - Vite)
```bash
VITE_BACKEND_URL=http://localhost:3001
VITE_BACKEND_SECRET=dev-backend-secret
VITE_GROQ_API_KEY=your-groq-key
```

### **Producción (Fly.io)**

**Variables de entorno en Fly.io:**
```bash
fly secrets set \
  BACKEND_URL=https://your-app.fly.dev \
  NEXT_PUBLIC_BACKEND_URL=https://your-app.fly.dev \
  BACKEND_SECRET=your-production-secret \
  GROQ_API_KEY=your-groq-key
```

**Variables de entorno en Vercel (Frontend):**
```bash
# The Generator (Next.js)
BACKEND_URL=https://your-backend.fly.dev
NEXT_PUBLIC_BACKEND_URL=https://your-backend.fly.dev
BACKEND_SECRET=your-production-secret

# Ghost Studio, Web Classic (Vite)
VITE_BACKEND_URL=https://your-backend.fly.dev
VITE_BACKEND_SECRET=your-production-secret
```

---

## 🎯 Resumen de Mejoras

### **Antes:**
- ❌ No validaba BACKEND_URL
- ❌ URLs hardcoded difíciles de cambiar
- ❌ Sin retry logic en requests
- ❌ Errores confusos cuando falla la red
- ❌ Polling sin manejo de timeouts

### **Después:**
- ✅ Validación temprana de variables
- ✅ Mensajes de error claros
- ✅ Retry automático con exponential backoff
- ✅ Polling robusto con timeouts
- ✅ Mejor experiencia de desarrollo
- ✅ Más resiliente a fallos de red

---

## 📚 Documentación de API

### **withRetry()**

```typescript
withRetry<T>(
  fn: () => Promise<T>,
  options?: {
    maxRetries?: number;           // Default: 3
    initialDelay?: number;         // Default: 1000ms
    maxDelay?: number;             // Default: 30000ms
    backoffMultiplier?: number;    // Default: 2
    onRetry?: (attempt: number, error: Error) => void;
  }
): Promise<T>
```

### **pollWithRetry()**

```typescript
pollWithRetry<T>(
  pollFn: () => Promise<T | null>,
  options?: {
    interval?: number;             // Default: 5000ms
    timeout?: number;              // Default: 300000ms (5 min)
    retryOptions?: RetryOptions;
    onPoll?: (result: T | null, attempt: number) => void;
  }
): Promise<T>
```

### **fetchWithRetry()**

```typescript
fetchWithRetry(
  url: string,
  options?: RequestInit,
  retryOptions?: RetryOptions
): Promise<Response>
```

Retries automáticamente en errores 5xx (servidor).  
No retries en errores 4xx (cliente).

---

**Última actualización:** 2025-11-21 20:45 CST  
**Estado:** ✅ Validación implementada, retry utilities creadas  
**Siguiente paso:** Aplicar retry logic en componentes frontend
