#!/bin/bash

echo "🔧 Setting up environment files for CI/CD..."

# 檢查 CI 環境檔案是否存在
if [ ! -f "src/environments/environment.ci.ts" ]; then
    echo "❌ Error: environment.ci.ts not found!"
    exit 1
fi

echo "📁 Current environment files:"
ls -la src/environments/

echo "📋 Copying CI environment files..."
cp src/environments/environment.ci.ts src/environments/environment.ts
cp src/environments/environment.ci.ts src/environments/environment.prod.ts

echo "✅ Environment files setup complete!"
echo "📁 Updated environment files:"
ls -la src/environments/

echo "🔍 Verifying environment.ts content:"
head -5 src/environments/environment.ts

echo "🔍 Verifying environment.prod.ts content:"
head -5 src/environments/environment.prod.ts
