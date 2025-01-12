import axios from 'axios';
import jwtDecode from 'jwt-decode';
const getAuthHeaders = () => {
    const accessToken = localStorage.getItem('authToken'); // 로컬 스토리지에서 'authToken'을 가져옴
  
    console.log('Access Token:', accessToken); // 토큰이 잘 저장되어 있는지 확인
  
    if (!accessToken) {
      console.warn('Access token is missing');
      return {}; // 토큰이 없으면 빈 객체 반환
    }
  
    try {
      const decodedToken = jwtDecode(accessToken); // jwt 토큰 디코딩
      const userId = decodedToken.userId;
      return {
        'Authorization': `Bearer ${accessToken}`,  // Authorization 헤더에 Bearer 토큰 추가
        'X-USER-ID': userId,  // userId 추가
        'ngrok-skip-browser-warning': 1,
      };
    } catch (error) {
      console.error('Token decoding error:', error);  // 디코딩 오류 처리
      return {};  // 오류 발생 시 빈 객체 반환
    }
  };
  

// axios 인스턴스 설정
const axiosInstance = axios.create({
    baseURL: 'https://1c9e-2406-5900-10f0-c886-dc6f-be50-3736-d1bc.ngrok-free.app',
    withCredentials: true,
    headers: {
        ...getAuthHeaders(),
        'ngrok-skip-browser-warning': 1, // 헤더 추가
    },
});


console.log('Headers:', axiosInstance.defaults.headers); 

// 요청 인터셉터에 인증 헤더 추가
axiosInstance.interceptors.request.use(
    (config) => {
        const authHeaders = getAuthHeaders(); // 인증 헤더 가져오기
        config.headers = { 
            ...config.headers, 
            ...authHeaders  // 기존 헤더에 인증 헤더 추가
        };
        return config;
    },
    (error) => {
        console.error('Axios Request Error:', error);
        return Promise.reject(error);
    }
);

export default axiosInstance;
