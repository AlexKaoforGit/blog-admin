// 環境變數範本檔案
// 複製此檔案為 environment.ts 和 environment.prod.ts 並填入實際值

export const environment = {
  production: false,

  // Firebase 配置 - 請從 Firebase Console 獲取
  firebase: {
    apiKey: 'your-api-key-here',
    authDomain: 'your-project.firebaseapp.com',
    projectId: 'your-project-id',
    storageBucket: 'your-project.appspot.com',
    messagingSenderId: 'your-sender-id',
    appId: 'your-app-id',
    measurementId: 'your-measurement-id', // 可選
  },
};
