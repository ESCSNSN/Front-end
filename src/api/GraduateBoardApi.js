import axiosInstance from './axiosInstance'; // 미리 설정된 axios 인스턴스

// 1. 퀘스트 게시글 상위 3개 조회
export const fetchTopQuestBoardData = async () => {
    try {
        const response = await axiosInstance.get('/api/board/graduate/main/quest'); // 퀘스트 게시글 상위 3개 조회 엔드포인트 호출
        return response.data; // 응답 데이터를 반환
    } catch (error) {
        console.error('Error fetching top quest board data:', error);
        throw error; // 에러 발생 시 throw
    }
};

// 2. 프리 게시글 상위 3개 조회
export const fetchTopFreeBoardData = async () => {
    try {
        const response = await axiosInstance.get('/api/board/graduate/main/free'); // 프리 게시글 상위 3개 조회 엔드포인트 호출
        return response.data; // 응답 데이터를 반환
    } catch (error) {
        console.error('Error fetching top free board data:', error);
        throw error; // 에러 발생 시 throw
    }
};

// 3. 프리 졸업생 상위 3개 조회
export const fetchTopFreeGraduatesData = async () => {
    try {
        const response = await axiosInstance.get('/api/board/graduate/top-free'); // 프리 졸업생 상위 3개 조회 엔드포인트 호출
        return response.data; // 응답 데이터를 반환
    } catch (error) {
        console.error('Error fetching top free graduates data:', error);
        throw error; // 에러 발생 시 throw
    }
};

// 4. 퀘스트 졸업생 상위 3개 조회
export const fetchTopQuestGraduatesData = async () => {
    try {
        const response = await axiosInstance.get('/api/board/graduate/top-quest'); // 퀘스트 졸업생 상위 3개 조회 엔드포인트 호출
        return response.data; // 응답 데이터를 반환
    } catch (error) {
        console.error('Error fetching top quest graduates data:', error);
        throw error; // 에러 발생 시 throw
    }
};
