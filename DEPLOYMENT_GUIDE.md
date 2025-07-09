# 部署指南

## 🚀 部署問題解決方案

### 問題描述

在 CI/CD 環境中部署時遇到 peer dependency 衝突錯誤：

```
ERESOLVE could not resolve
While resolving: @angular/fire@20.0.1
Could not resolve dependency: peer @angular/platform-browser-dynamic@"^20.0.0"
```

### ✅ 解決方案

#### 1. 更新 package.json

添加缺失的依賴並統一 Angular 版本：

```json
{
  "dependencies": {
    "@angular/platform-browser-dynamic": "^20.0.5"
  }
}
```

#### 2. 創建 .npmrc 文件

```
legacy-peer-deps=true
fund=false
audit=false
```

#### 3. 更新 GitHub Actions 工作流程

```yaml
- name: Install dependencies
  run: npm ci --legacy-peer-deps
```

#### 4. 修正 Angular 建置設定

在 `angular.json` 中：

- 調整 budget 限制
- 添加 CommonJS 依賴允許列表

### 📋 部署步驟

#### 本地測試

```bash
# 清理並重新安裝依賴
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# 測試建置
npm run build:prod

# 執行測試
npm run test:ci
```

#### CI/CD 環境

使用 GitHub Actions 自動部署到 GitHub Pages：

1. 推送到 `main` 分支
2. GitHub Actions 自動觸發
3. 安裝依賴：`npm ci --legacy-peer-deps`
4. 執行測試：`npm run test:ci`
5. 建置專案：`npm run build:prod`
6. 部署到 GitHub Pages

### 🔧 技術細節

#### Peer Dependency 衝突原因

- `@angular/fire@20.0.1` 需要 `@angular/platform-browser-dynamic`
- 版本不匹配導致解析失敗

#### 解決方法

1. **添加缺失依賴**：確保所有 peer dependencies 都已安裝
2. **統一版本號**：所有 Angular 套件使用相同版本
3. **使用 legacy-peer-deps**：繞過嚴格的 peer dependency 檢查

#### Bundle 大小優化

- 調整 `angular.json` 中的 budget 設定
- 允許 CommonJS 依賴（SweetAlert2）

### 🛡️ 注意事項

1. **環境變數**：確保 CI/CD 環境有正確的環境變數設定
2. **測試覆蓋率**：所有測試必須通過才能部署
3. **建置性能**：監控 bundle 大小和載入時間

### 📱 驗證部署

部署完成後，檢查以下項目：

- [ ] 網站可正常載入
- [ ] 所有路由功能正常
- [ ] 認證系統運作
- [ ] Firebase 連線正常
- [ ] 響應式設計正確
- [ ] 測試全部通過
