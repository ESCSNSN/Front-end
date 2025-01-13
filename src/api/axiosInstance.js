// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';

// const getAuthHeaders = () => {
//     const accessToken = localStorage.getItem('authToken');
//     if (!accessToken) {
//         console.warn('Access token is missing');
//         return {};
//     }

//     try {
//         const decodedToken = jwtDecode(accessToken); // 올바른 디코딩
//         const currentTime = Math.floor(Date.now() / 1000); // 현재 시간(초 단위)
//         if (decodedToken.exp && decodedToken.exp < currentTime) {
//             console.warn('Access token has expired');
//             localStorage.removeItem('authToken');
//             localStorage.removeItem('refreshToken');
//             window.location.href = '/loginPage'; // 로그인 페이지로 리다이렉트
//             return {};
//         }

//         const userId = decodedToken.userId;
//         return {
//             'Authorization': `Bearer ${accessToken}`,
//             'X-USER-ID': userId,
//             'ngrok-skip-browser-warning': 1,
//         };
//     } catch (error) {
//         console.error('Token decoding error:', error);
//         return {};
//     }
// };


// const axiosInstance = axios.create({
//     baseURL: 'https://1c9e-2406-5900-10f0-c886-dc6f-be50-3736-d1bc.ngrok-free.app',
//     withCredentials: true,
//     headers: {
//         'ngrok-skip-browser-warning': 1,
//     },
// });

// axiosInstance.interceptors.request.use(
//     (config) => {
//         const authHeaders = getAuthHeaders();
//         config.headers = {
//             ...config.headers,
//             ...authHeaders,
//         };
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// export default axiosInstance;