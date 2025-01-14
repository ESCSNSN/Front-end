import axios from 'axios';


// Axios 인스턴스 생성
const BASE_URL = "https://fd5ca3755e85.ngrok.app/api"; // 실제 백엔드 URL

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// 요청 인터셉터: Authorization 헤더에 토큰 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // 로컬 스토리지에서 토큰 가져오기
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 Unauthorized 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          console.warn('리프레시 토큰이 없습니다. 로그인 페이지로 리다이렉트합니다.');
          window.location.href = '/loginPage';
          return Promise.reject('리프레시 토큰이 없습니다.');
        }

        // 토큰 갱신 요청
        const refreshResponse = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${refreshToken}`  // refreshToken을 Authorization 헤더에 추가
            }
          }
        );

        console.log('Refresh Response:', refreshResponse);
        const newAccessToken = refreshResponse.data.authorization;
        if (newAccessToken) {
          localStorage.setItem('accessToken', newAccessToken); // 새로운 토큰 저장
          error.config.headers = error.config.headers || {};
          error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosInstance(error.config); // 원래 요청 재시도
        }
      } catch (refreshError) {
        console.error('토큰 갱신 실패:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/loginPage'; // 로그인 페이지로 리다이렉트
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;