// CI/CD 環境的預設環境變數文件
// 這個文件用於自動化部署，不包含敏感資訊

export const environment = {
  production: false,

  // 空的 Firebase 配置 - 在 CI 環境中不執行 Firebase 功能
  firebase: {
    apiKey: 'fake-api-key-for-build',
    authDomain: 'fake-project.firebaseapp.com',
    projectId: 'fake-project-id',
    storageBucket: 'fake-project.appspot.com',
    messagingSenderId: '000000000000',
    appId: 'fake-app-id',
    measurementId: 'fake-measurement-id',
  },

  // API 端點
  apiUrl: 'http://localhost:3000/api',

  // 其他設定
  enableAnalytics: false,
  logLevel: 'error',

  // CI 標識
  isCI: true,
};
