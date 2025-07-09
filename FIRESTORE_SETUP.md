# Firestore 設定指南

## 概述

專案已成功整合 Firestore 作為文章儲存解決方案，支援多用戶環境，每個用戶只能看到和編輯自己的文章。

## 主要功能

### 🔐 用戶隔離

- 每個用戶的文章獨立儲存
- 使用 `authorId` 欄位（用戶 email）來區分文章所有者
- 自動從當前登入用戶獲取作者資訊

### 📊 文章結構

```typescript
interface Article {
  id?: string; // Firestore 自動生成的 ID
  title: string; // 文章標題
  content: string; // 文章內容
  author: string; // 作者姓名
  authorId: string; // 作者 ID（email）
  tags: string[]; // 標籤陣列
  status: "draft" | "published"; // 文章狀態
  createdAt: Date; // 建立時間
  updatedAt: Date; // 更新時間
}
```

### 🔄 自動同步

- 文章清單即時更新
- 自動監聽用戶登入狀態變化
- 用戶登出時清空文章列表

## Firebase 設定

### 1. 啟用 Firestore

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 選擇您的專案
3. 在左側選單中點擊 "Firestore Database"
4. 點擊 "建立資料庫"
5. 選擇起始模式（建議選擇「測試模式」進行開發）

### 2. 設定安全規則

在 Firestore Database 的 "Rules" 標籤中設定以下規則：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /articles/{articleId} {
      // 基本規則：只允許已登入用戶操作
      allow read, write: if request.auth != null;

      // 進階規則：用戶只能存取自己的文章
      // allow read, write: if request.auth != null &&
      //   request.auth.token.email == resource.data.authorId;
    }
  }
}
```

### 3. 建立複合索引

為了支援排序查詢，需要建立複合索引：

1. 前往 Firestore Database > 索引
2. 建立複合索引：
   - 集合 ID: `articles`
   - 欄位：
     - `authorId` (升冪)
     - `updatedAt` (降冪)

## 使用方式

### 建立文章

```typescript
const articleData = {
  title: "文章標題",
  content: "文章內容",
  tags: ["Angular", "Firestore"],
  status: "published",
};

this.articleService.createArticle(articleData).subscribe((article) => {
  console.log("文章建立成功:", article);
});
```

### 讀取文章列表

```typescript
this.articleService.getArticles().subscribe((articles) => {
  console.log("用戶文章:", articles);
});
```

### 更新文章

```typescript
const updates = {
  title: "新標題",
  content: "新內容",
};

this.articleService.updateArticle(articleId, updates).subscribe((article) => {
  console.log("文章更新成功:", article);
});
```

### 刪除文章

```typescript
this.articleService.deleteArticle(articleId).subscribe((success) => {
  if (success) {
    console.log("文章刪除成功");
  }
});
```

## 注意事項

### 🔒 安全性

- 確保 Firestore 安全規則正確設定
- 生產環境應使用更嚴格的權限控制
- 定期檢查安全規則是否符合需求

### 📈 效能優化

- 文章列表按 `updatedAt` 降冪排序
- 使用複合索引提升查詢效能
- 考慮分頁載入大量文章

### 🚨 錯誤處理

- 所有 Firestore 操作都包含錯誤處理
- 網路錯誤會顯示適當的錯誤訊息
- 未登入用戶會自動重定向到登入頁面

## 開發時的注意事項

1. **本地開發**：確保 Firebase 專案設定正確
2. **測試**：使用測試帳號進行功能測試
3. **部署**：確保生產環境的 Firebase 設定正確
4. **監控**：定期檢查 Firebase 使用量和錯誤日誌

## 故障排除

### 常見問題

**Q: 文章無法載入**
A: 檢查 Firebase 專案設定、網路連線和 Firestore 安全規則

**Q: 權限錯誤**
A: 確認用戶已登入且 Firestore 安全規則允許該操作

**Q: 文章重複顯示**
A: 檢查 `authorId` 欄位是否正確設定

**Q: 排序不正確**
A: 確認已建立必要的複合索引
