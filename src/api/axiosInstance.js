import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const BASE_URL = 'https://2ecb-2406-5900-10f0-c886-1c07-11ef-e410-ee21.ngrok-free.app';

// 인증 헤더 가져오기 함수
const getAuthHeaders = () => {
  const accessToken = localStorage.getItem('authToken'); // 로컬 스토리지에서 토큰 가져오기

  if (!accessToken) {
    console.warn('Access token is missing');
    return {};
  }

  try {
    const decodedToken = jwtDecode(accessToken); // JWT 토큰 디코딩
    const userId = decodedToken?.userId || ''; // 디코딩된 토큰에서 userId 추출
    console.log('Decoded Token:', decodedToken);

    return {
      Authorization: `Bearer ${accessToken}`, // Authorization 헤더 추가
      'X-USER-ID': userId, // 사용자 ID 추가 (필요시)
    };
  } catch (error) {
    console.error('Token decoding error:', error);
    return {};
  }
};

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // 인증 쿠키 포함
});

// 요청 인터셉터 설정
axiosInstance.interceptors.request.use(
  (config) => {
    const authHeaders = getAuthHeaders();
    config.headers = {
      ...config.headers,
      ...authHeaders,
      'ngrok-skip-browser-warning': 1, // ngrok 관련 헤더 추가
    };
    console.log('Request Config:', config);
    return config;
  },
  (error) => {
    console.error('Axios Request Error:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정 (401 처리)
axiosInstance.interceptors.response.use(
  (response) => response, // 응답 성공 시 그대로 반환
  async (error) => {
    if (error.response?.status === 401) {
      console.warn('401 Unauthorized - Attempting to refresh token');

      // 액세스 토큰 갱신 로직
      try {
        const refreshToken = localStorage.getItem('refreshToken'); // 갱신 토큰 가져오기
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const newAccessToken = refreshResponse.data?.accessToken;
        if (newAccessToken) {
          localStorage.setItem('authToken', newAccessToken); // 새로운 토큰 저장
          error.config.headers.Authorization = `Bearer ${newAccessToken}`; // 요청에 새 토큰 추가
          return axiosInstance.request(error.config); // 원래 요청 재전송
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        // 로그아웃 또는 로그인 페이지로 이동
        //window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
