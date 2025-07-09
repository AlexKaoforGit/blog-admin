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

## 問題排除

### 404 錯誤修正 ✅

**問題**：部署後網站 JavaScript chunk 文件出現 404 錯誤

**解決方案**：

1. **正確設置 base-href**：

   - GitHub Actions 中的建置命令已修正為：`npm run build:prod -- --base-href=/blog-admin/`
   - 這確保所有資源路徑正確指向 GitHub Pages 子路徑

2. **添加 .nojekyll 文件**：

   - 創建 `src/.nojekyll` 空文件
   - 防止 GitHub Pages 嘗試處理 Jekyll，避免忽略以 `_` 開頭的文件

3. **SPA 路由支援**：
   - `404.html` 文件處理客戶端路由
   - `index.html` 包含 SPA GitHub Pages 腳本

**驗證**：

```bash
# 本地測試建置
npm run build:prod -- --base-href=/blog-admin/

# 檢查輸出文件
ls dist/blog-admin/browser/
# 應該包含：.nojekyll, 404.html, index.html 及所有 chunk 文件
```

### CI/CD 依賴問題 ✅

**問題**：ERESOLVE 錯誤、依賴版本衝突

**解決方案**：

1. **統一 Angular 版本**：所有 `@angular/*` 套件版本為 `^20.0.5`
2. **Legacy peer deps**：`.npmrc` 設定 `legacy-peer-deps=true`
3. **GitHub Actions**：使用 `npm ci --legacy-peer-deps`

### 環境變數問題 ✅

**問題**：CI 環境中找不到環境變數文件

**解決方案**：

1. **CI 環境配置**：`src/environments/environment.ci.ts`
2. **自動複製腳本**：`pretest:ci` 和 `prebuild:prod` hooks
3. **條件性 Firebase 載入**：在 CI 環境中跳過 Firebase 初始化

### 測試環境 ✅

**問題**：Jasmine + Karma 測試在 CI 中失敗

**解決方案**：

1. **Headless Chrome**：`test:ci` 腳本使用 `ChromeHeadless`
2. **Watch 模式關閉**：CI 環境中 `--watch=false`
3. **環境隔離**：測試前自動設置 CI 環境

## 🔥 Firebase 配置問題 ✅

**問題**：部署後出現 Firestore 連線錯誤，顯示 `fake-project-id`

**解決方案**：使用 GitHub Secrets 安全地管理 Firebase 配置

### 🔐 GitHub Secrets 設置步驟

#### 1. 獲取 Firebase 配置

前往 [Firebase Console](https://console.firebase.google.com/)：

1. 選擇您的專案
2. 點擊設定齒輪 → 專案設定
3. 向下滾動到「您的應用程式」區段
4. 選擇 Web 應用程式
5. 複製 Firebase 配置物件

#### 2. 在 GitHub 倉庫中設置 Secrets

1. 前往您的 GitHub 倉庫
2. 點擊 **Settings** → **Secrets and variables** → **Actions**
3. 點擊 **New repository secret**
4. 添加以下 secrets：

| Secret 名稱                    | 說明              |
| ------------------------------ | ----------------- |
| `FIREBASE_API_KEY`             | Firebase API 金鑰 |
| `FIREBASE_AUTH_DOMAIN`         | 認證網域          |
| `FIREBASE_PROJECT_ID`          | 專案 ID           |
| `FIREBASE_STORAGE_BUCKET`      | 儲存體桶          |
| `FIREBASE_MESSAGING_SENDER_ID` | 訊息發送者 ID     |
| `FIREBASE_APP_ID`              | 應用程式 ID       |
| `FIREBASE_MEASUREMENT_ID`      | 測量 ID（可選）   |

#### 3. 自動部署

GitHub Actions 工作流程現已配置為：

- 從 Secrets 動態生成生產環境配置
- 確保敏感資訊不會出現在代碼中
- 自動建置和部署

**詳細設置指南**：參考 `GITHUB_SECRETS_SETUP.md`

### 🛡️ 安全性優點

✅ **敏感資訊保護**：Firebase 配置不在代碼中  
✅ **版本控制安全**：不會意外提交敏感資訊  
✅ **團隊協作友善**：無需共享敏感配置  
✅ **環境隔離**：不同環境使用不同 secrets

## 部署流程

### 自動部署

1. 推送到 `main` 分支
2. GitHub Actions 自動執行：
   - 安裝依賴 (`npm ci --legacy-peer-deps`)
   - 運行測試 (`npm run test:ci`)
   - 建置應用 (`npm run build:prod -- --base-href=/blog-admin/`)
   - 部署到 GitHub Pages

### 手動部署

```bash
# 1. 確保依賴正確安裝
npm install --legacy-peer-deps

# 2. 運行測試
npm run test:ci

# 3. 建置應用
npm run build:prod -- --base-href=/blog-admin/

# 4. 檢查輸出
ls dist/blog-admin/browser/

# 5. 推送變更
git add .
git commit -m "deploy: 修正部署配置"
git push origin main
```

## 關鍵文件

### GitHub Actions 工作流程

- `.github/workflows/deploy.yml`：自動化 CI/CD 流程

### 環境配置

- `src/environments/environment.ci.ts`：CI 環境配置
- `.npmrc`：npm 配置，啟用 legacy-peer-deps

### 部署資產

- `src/.nojekyll`：防止 Jekyll 處理
- `src/404.html`：SPA 路由支援
- `angular.json`：建置配置和資產設定

### 腳本

- `scripts/setup-ci-env.sh`：環境設置腳本
- `package.json`：npm scripts 和依賴版本

## 成功指標

✅ **依賴安裝**：無 ERESOLVE 錯誤  
✅ **測試通過**：所有 33 個測試成功  
✅ **建置成功**：生成正確的 base-href  
✅ **部署成功**：網站可正常訪問，無 404 錯誤  
✅ **路由正常**：客戶端路由正確工作  
✅ **安全配置**：使用 GitHub Secrets 管理 Firebase 配置  
⏳ **Firebase 連線**：等待設置 GitHub Secrets

## 目前狀態

- **CI/CD 建置**：✅ 正常運行
- **GitHub Pages 部署**：✅ 成功部署
- **靜態文件載入**：✅ 無 404 錯誤
- **安全配置**：✅ GitHub Secrets 工作流程已配置
- **Firebase 連線**：⏳ 需要在 GitHub 設置 Secrets

## 下一步

部署後檢查項目：

1. 訪問 `https://alexkaoforgit.github.io/blog-admin/`
2. 確認所有頁面可正常載入
3. 測試客戶端路由（直接訪問 `/login`, `/articles` 等）
4. 檢查瀏覽器開發者工具是否有錯誤

如果仍有問題，請檢查 GitHub Actions 日誌和瀏覽器網路標籤。
