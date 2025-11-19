# 🔐 Guía de Implementación: Sistema de Tiers Premium

## Instalación de Dependencias

### Backend
```bash
cd packages/backend
npm install jsonwebtoken @types/jsonwebtoken
```

### Frontends
```bash
# The Generator
cd apps/the-generator-nextjs
npm install socket.io-client tone framer-motion

# Ghost Studio
cd apps/ghost-studio
npm install socket.io-client framer-motion

# Nexus Visual
cd apps/nexus-visual
npm install socket.io-client
```

---

## Configuración Backend

### 1. Variables de Entorno

Añade a `packages/backend/.env`:

```env
JWT_SECRET=your-super-secret-jwt-key-here
REDIS_URL=redis://localhost:6379
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-anon-key
```

### 2. Integrar Middleware en `index.ts`

```typescript
import { Server } from 'socket.io';
import { CollaborationService } from './services/collaboration.service';
import { collaborationRoutes } from './routes/collaboration.routes';
import { generationWebSocketRoutes } from './routes/generation.websocket';
import { authenticateSocket } from './middleware/auth.middleware';

// Setup Socket.io
const io = new Server(server, {
  cors: { origin: '*' },
  transports: ['websocket']
});

// Apply auth middleware to Socket.io
io.use(authenticateSocket);

// Initialize collaboration service
const collabService = new CollaborationService(
  io,
  process.env.REDIS_URL!,
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

// Register routes
fastify.register(collaborationRoutes, { collabService });
fastify.register(generationWebSocketRoutes, { redis });
```

---

## Configuración Frontend

### 1. The Generator: Music Preview con Tier Check

```tsx
'use client';

import { MusicPreview } from '@/components/MusicPreview';
import { PremiumPaywall } from '@/components/ui/PremiumPaywall';
import { useAuth } from '@/hooks/useAuth';

export default function GenerationPage({ generationId }: { generationId: string }) {
  const { isPremium, tier } = useAuth();

  if (!isPremium) {
    return (
      <PremiumPaywall 
        feature="Real-Time Music Preview" 
        currentTier={tier}
        description="Get instant audio preview with waveform visualization and advanced controls"
      />
    );
  }

  return <MusicPreview generationId={generationId} />;
}
```

### 2. Ghost Studio: Collaboration con Tier Check

```tsx
'use client';

import { useCollaboration } from '@/hooks/useCollaboration';
import { CollaborativeCursors } from '@/components/CollaborativeCursor';
import { PremiumPaywall } from '@/components/ui/PremiumPaywall';
import { useAuth } from '@/hooks/useAuth';

export function CollaborativeStudio() {
  const { isPremium, user, tier } = useAuth();
  const { users, cursors, joinRoom } = useCollaboration();

  useEffect(() => {
    if (isPremium && user) {
      joinRoom('studio-room-1', {
        id: user.id,
        name: user.email,
        color: '#00bfff'
      });
    }
  }, [isPremium, user]);

  if (!isPremium) {
    return (
      <PremiumPaywall 
        feature="Real-Time Collaboration" 
        currentTier={tier}
        description="Collaborate with other producers in real-time with cursor awareness and shared state"
      />
    );
  }

  return (
    <div className="relative">
      <CollaborativeCursors 
        users={users} 
        cursors={cursors} 
        localUserId={user!.id} 
      />
      {/* Your DAW interface */}
    </div>
  );
}
```

---

## Jerarquía de Tiers

```typescript
TIER 1: INITIATE (Iniciado) - FREE:
  - Acceso básico a la red
  - Límite de 5 generaciones/día
  - Sin colaboración

TIER 2: VANGUARD (Vanguardia) - PREMIUM:
  ✓ Generación ilimitada
  ✓ Real-time music preview
  ✓ Colaboración multiusuario
  ✓ Waveform analytics

TIER 3: COMMANDER (Comandante) - ULTIMATE:
  ✓ Todo lo de VANGUARD
  ✓ Stems separation
  ✓ AI mastering
  ✓ API access
  ✓ Priority queue

---

## STATUS MÍTICO: ALVAE
*No se compra, se gana.*
- Símbolo ALVAE junto al nickname.
- Requiere completar "The Impossible Tasks".
- Desbloquea el "Modo Dios" en el generador.
```

---

## Testing

### 1. Generar Token de Test (FREE)

```bash
# En packages/backend, ejecuta:
node -e "
const jwt = require('jsonwebtoken');
console.log(jwt.sign({
  userId: 'test-free',
  email: 'free@test.com',
  tier: 'FREE'
}, 'your-super-secret-jwt-key-here', { expiresIn: '7d' }));
"
```

### 2. Generar Token de Test (PREMIUM)

```bash
node -e "
const jwt = require('jsonwebtoken');
console.log(jwt.sign({
  userId: 'test-premium',
  email: 'premium@test.com',
  tier: 'PREMIUM'
}, 'your-super-secret-jwt-key-here', { expiresIn: '7d' }));
"
```

### 3. Probar en Frontend

```javascript
// En la consola del navegador:
localStorage.setItem('auth_token', 'TU_TOKEN_AQUI');
location.reload();
```

---

## Endpoints Protegidos

### REST API (Requieren `Authorization: Bearer <token>`)

- `POST /api/rooms` - PREMIUM
- `GET /api/rooms` - PREMIUM
- `GET /api/rooms/:id` - PREMIUM
- `POST /api/rooms/:id/join` - PREMIUM

### Socket.io Events (Requieren token en handshake)

```javascript
const socket = io('http://localhost:3001', {
  auth: { token: 'YOUR_JWT_TOKEN' }
});
```

---

## Stripe Integration (Opcional para producción)

Ver `packages/backend/src/routes/payment.routes.ts` si necesitas integrar Stripe para pagos reales.

---

## Rate Limiting por Tier

Puedes añadir rate limiting diferenciado:

```typescript
// FREE: 10 requests/min
// PREMIUM: 100 requests/min
// ULTIMATE: Unlimited

const rateLimit = {
  FREE: { max: 10, window: 60000 },
  PREMIUM: { max: 100, window: 60000 },
  ULTIMATE: { max: Infinity, window: 60000 }
};
```
