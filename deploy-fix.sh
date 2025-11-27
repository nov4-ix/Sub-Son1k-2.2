#!/bin/bash
set -e

# Function to deploy app with local packages
deploy_app() {
  APP_DIR=$1
  APP_NAME=$2
  
  echo "🚀 Deploying $APP_NAME..."
  cd $APP_DIR
  
  # Copy packages
  echo "📦 Copying packages..."
  rm -rf packages_temp
  cp -r ../../packages packages_temp
  
  # Backup package.json
  cp package.json package.json.bak
  
  # Update app package.json with EXPLICIT paths
  # We use temporary file to avoid sed mess
  
  # Replace workspace:* or file:../../packages/... with correct local paths
  sed -i '' 's|@super-son1k/shared-hooks": ".*"|@super-son1k/shared-hooks": "file:./packages_temp/shared-hooks"|g' package.json
  sed -i '' 's|@super-son1k/shared-ui": ".*"|@super-son1k/shared-ui": "file:./packages_temp/shared-ui"|g' package.json
  sed -i '' 's|@super-son1k/shared-types": ".*"|@super-son1k/shared-types": "file:./packages_temp/shared-types"|g' package.json
  sed -i '' 's|@super-son1k/shared-services": ".*"|@super-son1k/shared-services": "file:./packages_temp/shared-services"|g' package.json
  sed -i '' 's|@super-son1k/shared-utils": ".*"|@super-son1k/shared-utils": "file:./packages_temp/shared-utils"|g' package.json
  
  # Update ALL packages in packages_temp to use file:../<package>
  echo "🔄 Fixing dependencies in shared packages..."
  find packages_temp -name "package.json" -maxdepth 2 | while read pkg_json; do
    sed -i '' 's|@super-son1k/shared-hooks": ".*"|@super-son1k/shared-hooks": "file:../shared-hooks"|g' "$pkg_json"
    sed -i '' 's|@super-son1k/shared-ui": ".*"|@super-son1k/shared-ui": "file:../shared-ui"|g' "$pkg_json"
    sed -i '' 's|@super-son1k/shared-types": ".*"|@super-son1k/shared-types": "file:../shared-types"|g' "$pkg_json"
    sed -i '' 's|@super-son1k/shared-services": ".*"|@super-son1k/shared-services": "file:../shared-services"|g' "$pkg_json"
    sed -i '' 's|@super-son1k/shared-utils": ".*"|@super-son1k/shared-utils": "file:../shared-utils"|g' "$pkg_json"
  done

  # Create .vercelignore to ignore packages_temp/node_modules
  echo "packages_temp/**/node_modules" >> .vercelignore
  
  echo "🚀 Running Vercel Deploy..."
  # We use || true to ensure cleanup happens even if deploy fails
  vercel --prod || echo "❌ Deploy failed"
  
  # Cleanup
  echo "🧹 Cleaning up..."
  rm -rf packages_temp
  mv package.json.bak package.json
  
  cd ../..
  echo "✅ $APP_NAME deployment attempt finished."
}

# Deploy Ghost Studio
deploy_app "apps/ghost-studio" "Ghost Studio"

# Deploy The Generator
deploy_app "apps/the-generator-nextjs" "The Generator NextJS"
