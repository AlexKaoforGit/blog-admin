# Blog Admin System - Angular SPA

這是一個使用 Angular 20 開發的文章管理系統（Blog Admin SPA），提供完整的文章 CRUD 功能和使用者認證。

## 🚀 功能特色

- **使用者認證** - 登入/登出功能
- **文章管理** - 新增、編輯、刪除、查看文章
- **搜尋功能** - 即時搜尋文章標題
- **分頁功能** - 支援自訂每頁顯示數量
- **標籤系統** - 支援預設標籤和自訂標籤
- **狀態管理** - 文章草稿/發布狀態
- **響應式設計** - 適配各種螢幕尺寸
- **SweetAlert2 整合** - 美觀的彈出對話框
- **RWD 支援** - 完整的響應式網頁設計

## 🛠️ 技術規格

- **框架**: Angular 20
- **語言**: TypeScript
- **表單**: Reactive Forms
- **路由**: Angular Router
- **狀態管理**: RxJS BehaviorSubject
- **資料儲存**: localStorage
- **樣式**: SCSS + 自訂 CSS
- **變更檢測**: OnPush Strategy

## 📦 安裝與執行

### 前置需求
- Node.js 18+ 
- npm 或 yarn

### 安裝依賴
```bash
npm install
```

### 開發模式
```bash
npm start
```
應用程式將在 `http://localhost:4200` 啟動

### 建置生產版本
```bash
npm run build
```

### 執行測試
```bash
npm test
```

## 🔐 測試帳號

- **Email**: admin@example.com
- **密碼**: password

## 🎨 SweetAlert2 整合

專案已整合 SweetAlert2 提供美觀的彈出對話框：

### 使用方式

```typescript
import { SweetAlertService } from './core/sweet-alert.service';

constructor(private sweetAlert: SweetAlertService) {}

// 成功訊息
this.sweetAlert.success('成功', '操作已完成');

// 錯誤訊息
this.sweetAlert.error('錯誤', '操作失敗');

// 確認對話框
const result = await this.sweetAlert.confirm('確認', '確定要執行此操作？');
if (result.isConfirmed) {
  // 執行操作
}

// 刪除確認
const result = await this.sweetAlert.deleteConfirm('文章標題');
if (result.isConfirmed) {
  // 執行刪除
}

// 載入中
this.sweetAlert.showLoading('處理中...');
// 完成後關閉
this.sweetAlert.closeLoading();
```

### 可用方法

- `success(title, message?)` - 成功訊息
- `error(title, message?)` - 錯誤訊息  
- `warning(title, message?)` - 警告訊息
- `info(title, message?)` - 資訊訊息
- `confirm(title, message?, confirmText?, cancelText?)` - 確認對話框
- `deleteConfirm(itemName)` - 刪除確認對話框
- `showLoading(title?)` - 顯示載入中
- `closeLoading()` - 關閉載入中
- `custom(options)` - 自訂對話框

## 📁 專案結構

```
src/
├── app/
│   ├── auth/                    # 認證模組
│   │   └── login/              # 登入元件
│   ├── article/                # 文章模組
│   │   ├── article-list/       # 文章列表元件
│   │   └── article-form/       # 文章表單元件
│   ├── core/                   # 核心服務
│   │   ├── auth.service.ts     # 認證服務
│   │   ├── auth.guard.ts       # 認證守衛
│   │   └── article.service.ts  # 文章服務
│   ├── shared/                 # 共用元件
│   │   └── confirm-dialog/     # 確認對話框
│   ├── app.routes.ts           # 路由配置
│   ├── app.config.ts           # 應用程式配置
│   └── app.ts                  # 主元件
├── index.html
└── main.ts
```

## 🎯 實作重點

### 1. 路由守衛 (AuthGuard)
- 保護需要登入的路由
- 自動導向登入頁面

### 2. 服務層設計
- **AuthService**: 處理登入狀態和 localStorage
- **ArticleService**: 管理文章的 CRUD 操作

### 3. 表單處理
- 使用 Reactive Forms
- 即時驗證
- 自訂驗證訊息

### 4. 狀態管理
- 使用 RxJS BehaviorSubject
- 本地資料持久化
- 模擬 API 延遲

### 5. 使用者體驗
- Loading 狀態
- 錯誤處理
- 確認對話框
- 響應式設計

## 🔧 開發說明

### 新增功能
1. 在對應模組下建立新元件
2. 更新路由配置
3. 實作相關服務方法
4. 加入樣式

### 樣式指南
- 使用 SCSS 變數管理顏色
- 響應式設計支援
- 一致的間距和圓角

### 測試策略
- 單元測試（Jasmine + Karma）
- 元件測試
- 服務測試

## 📝 未來改進

- [ ] 加入單元測試
- [ ] 實作後端 API 整合
- [ ] 加入圖片上傳功能
- [ ] 實作文章預覽
- [ ] 加入更多篩選選項
- [ ] 實作拖拽排序
- [ ] 加入鍵盤快捷鍵

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📄 授權

MIT License

## 📱 響應式設計 (RWD)

專案支援完整的響應式設計，適配各種裝置：

### 斷點設計
- **桌面版** (1200px+) - 完整功能展示
- **平板版** (768px-1199px) - 適中佈局調整
- **手機版** (480px-767px) - 簡化佈局，隱藏次要欄位
- **小螢幕** (480px以下) - 最小化佈局，優化觸控操作

### 響應式特色
- **文章列表** - 小螢幕隱藏標籤、作者、建立時間欄位
- **搜尋功能** - 全寬度搜尋欄，垂直排列按鈕
- **分頁控制** - 自適應按鈕大小，支援換行
- **表單設計** - 垂直排列表單元素，優化觸控體驗
- **SweetAlert** - 響應式對話框，適配小螢幕
- **導航列** - 自適應標題大小和按鈕排列
