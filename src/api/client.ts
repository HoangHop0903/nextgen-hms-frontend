import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://nextgen-hms-backend-8r2z.onrender.com/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ở đây ta có thể giả lập việc lấy token từ localStorage của phiên Bệnh nhân.
// Trong thực tế, NextJS xử lý auth qua cookies (NextAuth/Auth.js) ở cả Server lẫn Client.
apiClient.interceptors.request.use(
  (config) => {
    // Để tích hợp với RoleChecker backend, Patient portal sẽ cần gửi token hợp lệ 
    // hoặc API endpoint ở Backend phải được public. Tạm thời Bypass Token bằng Role PATIENT mock.
    if (typeof window !== 'undefined') {
       const userToken = localStorage.getItem('hms-patient-token');
       if (userToken && config.headers) {
          config.headers.Authorization = `Bearer ${userToken}`;
       }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Lỗi kết nối từ API Client (Patient Portal):", error.message);
    return Promise.reject(error);
  }
);
