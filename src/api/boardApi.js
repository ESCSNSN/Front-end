import axiosInstance from '../utils/api.js'; // 미리 설정된 axios 인스턴스

{/*// 메인 페이지 데이터 가져오기
export const fetchMainPageData = async () => {
    try {
        const response = await axiosInstance.get('/board'); // 기본 엔드포인트 호출
        return response.data; // 응답 데이터 반환
    } catch (error) {
        console.error('Error fetching main page data:', error);
        throw error;
    }
}; */}

// 자유게시판 상위 3개 조회
export const fetchFreeBoardData = async () => {
    try {
      const response = await axiosInstance.get('api/board/main/free'); // 자유게시판 엔드포인트 호출
      return response.data; // 응답 데이터를 반환
    } catch (error) {
      console.error('Error fetching free board data:', error);
      throw error;
    }
  };



// 질문 게시판 데이터 가져오기
export const fetchQuestBoardData = async () => {
    try {
        const response = await axiosInstance.get('api/board/main/quest'); // 질문 게시판 엔드포인트 호출
        return response.data; // 응답 데이터 반환
    } catch (error) {
        console.error('Error fetching quest board data:', error);
        throw error;
    }
};

export const fetchCompetitionBoardData = async () => {
    try {
        const response = await axiosInstance.get('api/board/main/competition'); // 대회게시판 엔드포인트 호출
        return response.data; // 응답 데이터를 반환
    } catch (error) {
        console.error('Error fetching competition board data:', error);
        throw error; // 에러 발생 시 throw
    }
};

//코딩게시판
export const fetchCodingBoardData = async () => {
    try {
      const response = await axiosInstance.get('api/board/main/coding'); // 코딩 게시판 엔드포인트 호출
      return response.data; // 응답 데이터를 반환
    } catch (error) {
      console.error('Error fetching coding board data:', error);
      throw error;
    }
  };



//정보게시판

export const fetchStudyBoardData = async () => {
    try {
        const response = await axiosInstance.get('api/board/main/study'); // 스터디 게시판 API 호출
        return response.data; // 응답 데이터 반환
    } catch (error) {
        console.error('Error fetching study board data:', error);
        throw error;
    }
};

// 필요 시 추가적인 게시판 함수 작성
// 예: export const fetchOtherBoardData = async () => {...}
