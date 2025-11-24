FROM node:20-slim AS builder

# Install build dependencies
RUN apt-get update -y && apt-get install -y openssl ca-certificates python3 make g++

# Setup pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy all source files
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile=false

# Generate Prisma Client (needed for type checking and bundling if not external)
RUN cd packages/backend && npx prisma generate

# Build the bundle
# This will create packages/backend/dist/server.js with internal packages bundled
RUN cd packages/backend && pnpm run build:bundle

# --- Production Stage ---
FROM node:20-slim

# Install runtime dependencies
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the bundled server
COPY --from=builder /app/packages/backend/dist/server.js ./server.js

# Copy Prisma schema
COPY --from=builder /app/packages/backend/prisma ./prisma

# Copy package.json to install external dependencies
COPY --from=builder /app/packages/backend/package.json ./package.json

# Remove workspace dependencies from package.json because they are already bundled
# We use sed to delete lines containing "@super-son1k/"
RUN sed -i '/@super-son1k\//d' package.json

# Install production dependencies (only external ones like fastify, prisma, etc.)
# We use npm here for simplicity and robustness in the final image
RUN npm install --production --no-package-lock

# Generate Prisma Client for production
RUN npx prisma generate

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]
