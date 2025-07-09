// 生產環境變數範本檔案
// 複製此檔案為 environment.prod.ts 並填入實際值

export const environment = {
  production: true,

  // Firebase 配置 - 請從 Firebase Console 獲取
  firebase: {
    apiKey: 'your-production-api-key-here',
    authDomain: 'your-production-project.firebaseapp.com',
    projectId: 'your-production-project-id',
    storageBucket: 'your-production-project.appspot.com',
    messagingSenderId: 'your-production-sender-id',
    appId: 'your-production-app-id',
    measurementId: 'your-production-measurement-id', // 可選
  },
};
