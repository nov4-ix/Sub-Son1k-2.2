#!/bin/bash
# 🚀 DEPLOY SCRIPT - SON1KVERS3
# Ejecuta este script para deployar todo el ecosistema

set -e  # Exit on error

echo "🚀 SON1KVERS3 DEPLOYMENT SCRIPT"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if CLIs are installed
echo -e "${BLUE}📦 Checking dependencies...${NC}"
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI not found${NC}"
    echo "Install with: npm i -g @railway/cli"
    exit 1
fi

if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI not found${NC}"
    echo "Install with: npm i -g vercel"
    exit 1
fi

echo -e "${GREEN}✅ All CLIs installed${NC}"
echo ""

# Step 1: Backend (Railway)
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📡 STEP 1: BACKEND (Railway)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

read -p "¿Deployar backend en Railway? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd packages/backend
    
    echo -e "${YELLOW}🔐 Login a Railway...${NC}"
    railway login
    
    echo -e "${YELLOW}🔗 Linking or creating project...${NC}"
    if [ ! -f ".railway/config.json" ]; then
        echo -e "${YELLOW}No Railway project found. Creating new one...${NC}"
        railway init
    else
        echo -e "${GREEN}✅ Railway project already linked${NC}"
    fi
    
    echo -e "${YELLOW}📊 Checking required environment variables...${NC}"
    echo ""
    echo "Asegúrate de configurar estas variables en Railway Dashboard:"
    echo "  - GROQ_API_KEY"
    echo "  - JWT_SECRET"
    echo "  - BACKEND_SECRET"
    echo "  - SUNO_API_URL"
    echo "  - SUNO_POLLING_URL"
    echo "  - ALLOWED_ORIGINS"
    echo ""
    read -p "Presiona Enter después de configurar las variables en Railway Dashboard..."
    
    echo -e "${YELLOW}🚀 Deploying backend...${NC}"
    railway up
    
    echo -e "${GREEN}✅ Backend deployed!${NC}"
    echo ""
    echo "Obteniendo URL del backend..."
    BACKEND_URL=$(railway domain)
    echo -e "${GREEN}Backend URL: ${BACKEND_URL}${NC}"
    echo ""
    
    cd ../..
else
    echo -e "${YELLOW}⏭️  Skipping backend deployment${NC}"
    echo ""
    read -p "Ingresa tu Backend URL (ej: https://your-app.railway.app): " BACKEND_URL
fi

# Save backend URL for later
echo "$BACKEND_URL" > .backend-url.tmp

# Step 2: Web Classic (Vercel)
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🌐 STEP 2: WEB CLASSIC (Vercel)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

read -p "¿Deployar Web Classic en Vercel? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd apps/web-classic
    
    echo -e "${YELLOW}🔐 Login a Vercel...${NC}"
    vercel login
    
    echo -e "${YELLOW}📝 Configurando variables de entorno...${NC}"
    echo ""
    echo "Necesitas configurar estas variables:"
    read -p "GROQ_API_KEY: " GROQ_KEY
    read -p "BACKEND_SECRET: " BACKEND_SECRET
    read -p "NEXUS URL (ej: https://nexus.son1kvers3.com): " NEXUS_URL
    
    vercel env add VITE_GROQ_API_KEY production <<< "$GROQ_KEY"
    vercel env add VITE_BACKEND_URL production <<< "$BACKEND_URL"
    vercel env add VITE_BACKEND_SECRET production <<< "$BACKEND_SECRET"
    vercel env add VITE_NEXUS_URL production <<< "$NEXUS_URL"
    
    echo -e "${YELLOW}🚀 Deploying Web Classic...${NC}"
    vercel --prod
    
    echo -e "${GREEN}✅ Web Classic deployed!${NC}"
    cd ../..
else
    echo -e "${YELLOW}⏭️  Skipping Web Classic deployment${NC}"
fi

echo ""

# Step 3: Nexus Visual (Vercel)
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🚀 STEP 3: NEXUS VISUAL (Vercel)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

read -p "¿Deployar Nexus Visual en Vercel? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd apps/nexus-visual
    
    echo -e "${YELLOW}📝 Configurando variables de entorno...${NC}"
    vercel env add VITE_BACKEND_URL production <<< "$BACKEND_URL"
    vercel env add VITE_GROQ_API_KEY production <<< "$GROQ_KEY"
    
    echo -e "${YELLOW}🚀 Deploying Nexus Visual...${NC}"
    vercel --prod
    
    echo -e "${GREEN}✅ Nexus Visual deployed!${NC}"
    cd ../..
else
    echo -e "${YELLOW}⏭️  Skipping Nexus Visual deployment${NC}"
fi

# Cleanup
rm -f .backend-url.tmp

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 DEPLOYMENT COMPLETE!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Next steps:"
echo "1. Configure custom domains in Vercel Dashboard"
echo "2. Update ALLOWED_ORIGINS in Railway with your domains"
echo "3. Test the Easter Egg: Cmd+Option+H"
echo "4. Verify music generation works"
echo ""
echo -e "${BLUE}📚 Check DEPLOYMENT_GUIDE.md for more details${NC}"
