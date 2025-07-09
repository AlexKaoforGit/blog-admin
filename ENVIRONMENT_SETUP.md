# 環境變數設定指南

## 📝 概述

此專案使用環境變數來管理不同環境的配置，包括 Firebase 設定、API 端點等敏感資訊。

## 🔧 設定步驟

### 1. 複製範本檔案

```bash
# 開發環境
cp src/environments/environment.example.ts src/environments/environment.ts

# 生產環境
cp src/environments/environment.prod.example.ts src/environments/environment.prod.ts
```

### 2. 填入實際值

編輯 `src/environments/environment.ts` 和 `src/environments/environment.prod.ts`，填入以下資訊：

#### Firebase 配置
1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 選擇您的專案
3. 點擊「專案設定」
4. 在「您的應用程式」區塊中，選擇 Web 應用程式
5. 複製配置物件中的值

#### API 端點
- 開發環境：通常是本地端 API 伺服器位址
- 生產環境：您的線上 API 伺服器位址

### 3. 驗證設定

```bash
# 確認檔案存在且格式正確
ng build --configuration development
```

## 🔐 安全注意事項

- ❌ **絕對不要**將真實的環境變數檔案提交到 git
- ✅ 只提交 `.example.ts` 範本檔案
- 🔄 定期更新 API 金鑰和敏感資訊
- 👥 團隊成員間私下分享環境變數值

## 📁 檔案結構

```
src/environments/
├── environment.example.ts      # 開發環境範本（可提交）
├── environment.prod.example.ts # 生產環境範本（可提交）
├── environment.ts              # 開發環境實際值（不提交）
└── environment.prod.ts         # 生產環境實際值（不提交）
```

## 🚫 .gitignore 規則

以下檔案類型已被忽略：
- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`
- `src/environments/environment.development.ts`
- `.env*` 檔案
- `firebase-config.*` 檔案

## 💡 提示

如果您是新的開發者，請聯繫專案維護者獲取正確的環境變數值。
