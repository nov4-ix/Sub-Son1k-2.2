# 📁 Estructura de Componentes Recomendada

## Estructura Actual vs Recomendada

### Estructura Actual
```
src/components/
  PricingCard.tsx
  ui/
    button.tsx
    card.tsx
```

### Estructura Recomendada
```
src/components/
  ui/                    # Componentes de UI genéricos y reutilizables
    Button.tsx
    Card.tsx
    Input.tsx
    Modal.tsx
    Loading.tsx
    ErrorMessage.tsx
  
  layout/                # Componentes estructurales
    Header.tsx
    Sidebar.tsx
    Footer.tsx
    Navigation.tsx
  
  features/              # Componentes específicos de funcionalidades
    music/
      MusicGenerator.tsx
      MusicList.tsx
      MusicPlayer.tsx
      MusicItem.tsx
    cover/
      CoverGenerator.tsx
      CoverUploader.tsx
    pricing/
      PricingCard.tsx
      PricingPlan.tsx
```

---

## 🎯 Beneficios de la Nueva Estructura

### 1. Organización Clara
- ✅ Fácil de navegar
- ✅ Componentes agrupados por propósito
- ✅ Escalable para proyectos grandes

### 2. Reutilización
- ✅ Componentes UI genéricos en `ui/`
- ✅ Componentes de layout reutilizables
- ✅ Features independientes y modulares

### 3. Mantenibilidad
- ✅ Cambios localizados por feature
- ✅ Fácil de encontrar componentes
- ✅ Tests organizados por feature

---

## 📦 Paquetes Compartidos

Los componentes compartidos ya están en paquetes separados:

```
packages/
  shared-ui/             # Componentes UI compartidos
    src/
      components/
        TrackItem.tsx
        MusicList.tsx
      examples/
        MusicListExample.tsx
  
  shared-hooks/          # Hooks compartidos
    src/
      useMusicGeneration.ts
      useUserMusic.ts
  
  shared-services/       # Servicios API
    src/
      musicService.ts
      apiService.ts
  
  shared-types/          # Tipos TypeScript
    src/
      index.ts
```

---

## 🔄 Migración Gradual

### Paso 1: Crear Estructura
```bash
mkdir -p src/components/{ui,layout,features/{music,cover,pricing}}
```

### Paso 2: Mover Componentes Existentes
- `PricingCard.tsx` → `features/pricing/PricingCard.tsx`
- `ui/button.tsx` → `ui/Button.tsx`
- `ui/card.tsx` → `ui/Card.tsx`

### Paso 3: Usar Componentes Compartidos
```typescript
// En lugar de crear componentes locales
import { TrackItem, MusicList } from '@super-son1k/shared-ui';
import { useMusicGeneration } from '@super-son1k/shared-hooks';
```

---

## 📝 Convenciones

### Nombres de Archivos
- Componentes: `PascalCase.tsx` (ej: `MusicPlayer.tsx`)
- Hooks: `camelCase.ts` con prefijo `use` (ej: `useMusicGeneration.ts`)
- Servicios: `camelCase.ts` con sufijo `Service` (ej: `musicService.ts`)
- Types: `camelCase.ts` o `index.ts` (ej: `types.ts`)

### Estructura de Componente
```typescript
// 1. Imports
import React from 'react';
import { useMusicGeneration } from '@super-son1k/shared-hooks';

// 2. Types/Interfaces
interface MusicGeneratorProps {
  userId: string;
  onSuccess?: (track: MusicTrack) => void;
}

// 3. Component
export const MusicGenerator: React.FC<MusicGeneratorProps> = ({
  userId,
  onSuccess
}) => {
  // 4. Hooks
  const { generateMusic, isGenerating, error } = useMusicGeneration({
    onSuccess
  });

  // 5. Handlers
  const handleGenerate = () => {
    generateMusic({ prompt: '...' });
  };

  // 6. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

---

## 🎨 Componentes UI Genéricos

### Componentes Recomendados
- `Button` - Botón reutilizable
- `Card` - Tarjeta contenedora
- `Input` - Input de texto
- `Modal` - Modal/dialog
- `Loading` - Spinner de carga
- `ErrorMessage` - Mensaje de error
- `Toast` - Notificaciones
- `Dropdown` - Menú desplegable

### Uso
```typescript
import { Button, Card, Loading, ErrorMessage } from '@/components/ui';

function MyComponent() {
  return (
    <Card>
      <Button onClick={handleClick}>Click me</Button>
      {isLoading && <Loading />}
      {error && <ErrorMessage message={error} />}
    </Card>
  );
}
```

---

## 🏗️ Componentes de Layout

### Estructura
```typescript
// layout/Header.tsx
export const Header = () => {
  return (
    <header>
      <Navigation />
      <UserMenu />
    </header>
  );
};

// layout/Sidebar.tsx
export const Sidebar = () => {
  return (
    <aside>
      <NavLinks />
    </aside>
  );
};
```

---

## 🎵 Componentes de Features

### Música
```
features/music/
  MusicGenerator.tsx    # Formulario de generación
  MusicList.tsx         # Lista de música (usa shared-ui)
  MusicPlayer.tsx       # Reproductor
  MusicItem.tsx         # Item individual (usa shared-ui)
```

### Cover
```
features/cover/
  CoverGenerator.tsx    # Generador de covers
  CoverUploader.tsx     # Upload de audio
```

---

## ✅ Checklist de Migración

- [ ] Crear estructura de carpetas
- [ ] Mover componentes existentes
- [ ] Actualizar imports
- [ ] Usar componentes compartidos donde sea posible
- [ ] Crear componentes UI genéricos faltantes
- [ ] Documentar componentes nuevos
- [ ] Actualizar tests

---

**Nota**: Esta es una guía recomendada. La migración puede hacerse gradualmente sin romper funcionalidad existente.

