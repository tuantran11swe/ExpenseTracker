// Import các hàm cần thiết từ Firebase SDKs
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Thêm các SDK cho các sản phẩm Firebase khác nếu cần
// https://firebase.google.com/docs/web/setup#available-libraries

// Cấu hình Firebase cho ứng dụng web
// Với Firebase JS SDK v7.20.0 trở lên, measurementId là tùy chọn
const firebaseConfig = {
  apiKey: "AIzaSyB6ABNqh8fmSCAOCMVQO8PsleJ2LbMNu7g",
  appId: "1:445149847570:web:b3958da372c15aeffcf8cb",
  authDomain: "expense-tracker-d2b43.firebaseapp.com",
  measurementId: "G-BC9YDEGYX5",
  messagingSenderId: "445149847570",
  projectId: "expense-tracker-d2b43",
  storageBucket: "expense-tracker-d2b43.firebasestorage.app",
};

// Khởi tạo Firebase app
const app = initializeApp(firebaseConfig);
// Khởi tạo Analytics
const analytics = getAnalytics(app);
// Khởi tạo Authentication
const auth = getAuth(app);

export { app, analytics, auth };
