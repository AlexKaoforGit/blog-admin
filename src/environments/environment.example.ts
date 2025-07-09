// 開發環境變數範本檔案
// 複製此檔案為 environment.ts 並填入實際的 Firebase 配置

export const environment = {
  production: false,

  // Firebase 配置 - 請從 Firebase Console 獲取您的開發專案配置
  firebase: {
    apiKey: 'your-dev-api-key-here',
    authDomain: 'your-dev-project.firebaseapp.com',
    projectId: 'your-dev-project-id',
    storageBucket: 'your-dev-project.appspot.com',
    messagingSenderId: 'your-dev-sender-id',
    appId: 'your-dev-app-id',
    measurementId: 'your-dev-measurement-id', // Google Analytics (可選)
  },
};
