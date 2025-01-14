import axiosInstance from '../utils/api.js'; // 미리 설정된 axios 인스턴스

// 1. 퀘스트 게시글 상위 3개 조회
export const G_fetchQuestBoardData = async () => {
    try {
        const response = await axiosInstance.get('/api/board/graduate/top-quest'); // 퀘스트 게시글 상위 3개 조회 엔드포인트 호출
        return response.data; // 응답 데이터를 반환
    } catch (error) {
        console.error('Error fetching G_top quest board data:', error);
        throw error; // 에러 발생 시 throw
    }
};



// 2. 프리 게시글 상위 3개 조회
export const G_fetchFreeBoardData = async () => {
    try {
        const response = await axiosInstance.get('/api/board/graduate/top-free'); // 프리 게시글 상위 3개 조회 엔드포인트 호출
        return response.data; // 응답 데이터를 반환
    } catch (error) {
        console.error('Error fetching G_top free board data:', error);
        throw error; // 에러 발생 시 throw
    }
};

// 3. 프리 졸업생 상위 3개 조회
export const TopfetchFreeBoardData = async () => {
    try {
        const response = await axiosInstance.get('/api/board/graduate/main/free'); // 프리 졸업생 상위 3개 조회 엔드포인트 호출
        return response.data; // 응답 데이터를 반환
    } catch (error) {
        console.error('Error fetching top free data:', error);
        throw error; // 에러 발생 시 throw
    }
};

// 4. 퀘스트 졸업생 상위 3개 조회
export const TopfetchQuestBoardData = async () => {
    try {
        const response = await axiosInstance.get('/api/board/graduate/main/quest'); // 퀘스트 졸업생 상위 3개 조회 엔드포인트 호출
        return response.data; // 응답 데이터를 반환
    } catch (error) {
        console.error('Error fetching top quest data:', error);
        throw error; // 에러 발생 시 throw
    }
};
