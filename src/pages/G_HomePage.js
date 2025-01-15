/*import React from 'react';*/

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from "./G_HomePage.module.css";
//import { jwtDecode } from 'jwt-decode';
import main_mascot from '../images/졸업생횃불이.png';  // 로고 이미지 불러오기
import main_bell from '../images/bell.png';  // 로고 이미지 불러오기
import main_message from '../images/message.png';  // 로고 이미지 불러오기
import main_my from '../images/my.png';  // 로고 이미지 불러오기
import PlusButton from '../assets/MoreButton'; // 플러스 버튼 컴포넌트 import
import Icon1 from '../images/하트이모지.png';
import Icon2 from '../images/눈이모지.png';
import Icon3 from '../images/폭죽이모지.png';


import Header from './G_.js'; // 상단바 컴포넌트

import S_cute from '../assets/S_cuteButton'; //스크랩

import { useMediaQuery } from 'react-responsive'; // 반응형 페이지 만들기 위함

//import {  G_fetchFreeBoardData  , G_fetchQuestBoardData, TopfetchFreeBoardData, TopfetchQuestBoardData
//} from '../api/GraduateBoardApi.js'; //Api


import axios from 'axios';
import jwtDecode from 'jwt-decode';


const BASE_URL = 'http://info-rmation.kro.kr';


//import {  fetchFreeBoardData, fetchQuestBoardData, fetchCompetitionBoardData,fetchCodingBoardData, fetchStudyBoardData } from '../api/boardApi'; //Api
//fetchMainPageData,


// 인증 헤더 가져오기 함수
const getAuthHeaders = () => {
  const accessToken = localStorage.getItem('authToken');

  if (!accessToken) {
    console.warn('Access token is missing');
    return {};
  }

  try {
    const decodedToken = jwtDecode(accessToken);
    const userId = decodedToken?.userId || '';
    console.log('Decoded Token:', decodedToken);

    return {
      Authorization: `Bearer ${accessToken}`,
      'X-USER-ID': userId,
    };
  } catch (error) {
    console.error('Token decoding error:', error);
    return {};
  }
};

// axios 인스턴스 설정
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const authHeaders = getAuthHeaders();
    console.log('Auth Headers:', authHeaders);
    config.headers = {
      ...config.headers,
      ...authHeaders,
      'ngrok-skip-browser-warning': 1,
    };
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);








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


const G_HomePage = () => {
  const navigate = useNavigate(); // useNavigate 훅 선언

  const [G_freeBoardData, G_setFreeBoardData] = useState([]); //졸 자유게시판
  const [G_questBoardData, G_setQuestBoardData] = useState([]); //졸 질문게시판
  const [TopFreeBoardData, setTopFreeBoardData] = useState([]); //재 자유게시판
  const [TopQuestBoardData, setTopQuestBoardData] = useState([]); //재 질문문게시판

  const [dropdownVisible, setDropdownVisible] = useState(false);  // 드롭다운 상태 관리
  const [activeTab, setActiveTab] = useState('자유 게시판'); // Default active tab
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); //logout


  // 반응형 페이지 처리를 위한 useMediaQuery 사용
  const isDesktop = useMediaQuery({ query: '(min-width: 769px)' });


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const loadData = async () => {
      try {
        const [G_freeData, G_questData, TopfreeData, TopquestData,] = await Promise.all([

          G_fetchFreeBoardData(),
          G_fetchQuestBoardData(),

          TopfetchFreeBoardData(),
          TopfetchQuestBoardData(),

        ]);

        //setMainPageData(mainData);
        G_setFreeBoardData(G_freeData);
        G_setQuestBoardData(G_questData);
        setTopFreeBoardData(TopfreeData);
        setTopQuestBoardData(TopquestData);


      } catch (err) {
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    loadData();




    const fetchRooms = async () => {
      const userId = '202301641'; // 추후 삭제 예정
      const roomType = roomData?.type || 'room'; // roomData에서 type을 가져오되, 없으면 'room'으로 기본값 설정
      const baseUrl = 'https://rmation-chat.kro.kr';
  
      try {
        const response = await fetch(`${baseUrl}/Room/RoomList/${roomType}`, {
          headers: {
            'Content-Type': 'application/json', // 'contentType'을 'Content-Type'으로 변경
            'ngrok-skip-browser-warning': 'abc',
          },
          method: 'GET',
        });
        const data = await response.json();
        setRooms(data.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };
  
    fetchRooms();
  }, []);
  
  
    const [roomData, setRoomData] = useState({ type: 'room' });  // 기본값 설정
  

  const [rooms, setRooms] = useState([]);
  //소통방
  // 방 ID에 맞는 페이지로 이동하기
  const handleRoomClick = (path) => {
    navigate(`/${path}`);  // 방 ID에 맞는 페이지로 이동
  };
  //   const accessToken = localStorage.getItem('accessToken');
  // if (!accessToken) throw new Error('사용자 인증 정보가 없습니다.');

  //const decodedToken = jwtDecode(accessToken);
  //const userId = decodedToken.userId;









  // 질문 게시판 상세 페이지 이동
  const handleQuestionClick = (id, boardID) => {
    if (boardID === 'quest') {
      navigate(`/G_questionpostingPage/${id}`); // 질문 게시판 상세 페이지로 이동
    }
  };

  //자유게시판 상세 페이지 이동
  const handleFreeBoardClick = (id, boardID) => {
    if (boardID === 'free') {
      navigate(`/G_freepostingPage/${id}`); // 자유 게시판 상세 페이지로 이동
    }
  };


  // PlusButton 클릭 시 링크로 이동하는 함수
  const handlePlusClick = (link) => {
    navigate(link); // 페이지 이동
  };

  //로그아웃
  const handleLogoutClick = (e) => {
    e.preventDefault();
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false); navigate('/Start');
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };


  if (loading) return <p>Loading...</p>; // 로딩 상태 표시
  if (error) return <p>{error}</p>; // 에러 메시지 표시


  {/*
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  }; */}

  // 드롭다운 메뉴 토글 함수
  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };


  const renderTabContent = () => {
    switch (activeTab) {
      case '자유 게시판':
        return (
          <>
            <div className={styles.container}>
              {/* 로딩 중일경우 */}
              {!loading && !error && (
                <div className={styles.postList}>
                  {/* 자유 게시판 데이터 렌더링 */}
                  <a href="/G_freeboardPage" className={styles.plusButtonLink}>
                    <PlusButton className={styles.plusButton} />
                  </a>


                  <h1  className={styles["notetext"]}>자유 게시판</h1>
                  {G_freeBoardData.map((item, index) => (
                    <div
                      key={`free-${item.id}`}
                      className={styles.postItem}
                      onClick={() => navigate(`/G_freepostingPage/${item.id}`)} // boardID와 함께 전달
                    >
                      <span className={styles.index2}>{index + 1}</span>
                      <span className={styles.question}>{item.graduateTitle || 'No Title'}</span>
                      <span className={styles.date}>
                        {new Date(item.graduateCreatedTime).toLocaleDateString()}
                      </span>
                      <S_cute className={styles.S_cute} />

                    </div>
                  ))}
                  {/* 질문 게시판 데이터 렌더링 */}
                  <a href="/G_questionboardPage" className={styles.plusButtonLink}>
                    <PlusButton className={styles.plusButton} />
                  </a>
                  <h1 className={styles["notetext"]}>질문 게시판</h1>
                  {G_questBoardData.map((item, index) => (
                    <div
                      key={`quest-${item.id}`}
                      className={styles.postItem}
                      onClick={() => navigate(`/G_questionpostingPage/${item.id}`)} // boardID와 함께 전달
                    >
                      <span className={styles.index2}>{index + 1}</span>
                      <span className={styles.question}>{item.graduateTitle}</span>
                      <span className={styles.date}>
                        {new Date(item.graduateCreatedTime).toLocaleDateString()}
                      </span>
                      <S_cute className={styles.S_cute} />
                    </div>
                  ))}

                </div>
              )}

            </div>
          </>
        );
      case '소통 채팅방':
        return (


          <>
            <div className={styles.Roomcontainer2}>

              {/* 방 목록 */}
              <div className={styles.roomsList}>
                <a href="/RoomPage" className={styles.plusButtonLink2}>
                  <PlusButton className={styles.plusButton3} />
                </a>
                {rooms.map((room) => (
                  <div
                    key={room.roomId}
                    className={`${styles.roomItem} ${room.selected ? styles.selected : ''}`}
                  >
                    <img src={room.icon} alt={`방 아이콘 ${room.roomId}`} className={styles.roomIcon} /> {/* 아이콘 추가 */}
                    <div className={styles.roomInfo}>
                      <div className={styles.roomTitle}>{room.roomName}</div>
                      <div className={styles.roomMessage}>{room.lastMessage}</div>
                    </div>
                    <button
                      className={styles.joinButton}
                      onClick={() => navigate(`/FreeChat/${room.roomId}`)}
                    >
                      참여하기
                    </button>
                  </div>
                ))}
              </div>

            </div>
          </>

        );
      default:
        return null;
    }
  };


  // 댓글 달기 버튼 클릭 시 해당 게시판으로 이동
  const handleTopNavigate = (id, boardID) => {
    if (boardID === 'quest') {
      navigate(`/QuestionpostingPage/${id}`);  // 질문 게시판 상세 페이지로 이동
    } else if (boardID === 'free') {
      navigate(`/FreepostingPage/${id}`);  // 자유 게시판 상세 페이지로 이동
    }
  };




  return (
    <div className={styles.app}>
        <Header />

      {/* 탭 네비게이션 */}
      <div className={`${styles.tabContainer} ${isDesktop ? styles.desktopTabContainer : ''}`}>
        <button
          className={activeTab === '자유 게시판' ? styles.activeTab : styles.inactiveTab}
          onClick={() => setActiveTab('자유 게시판')}
        >
          자유 게시판
        </button>
        <button
          className={activeTab === '소통 채팅방' ? styles.activeTab : styles.inactiveTab}
          onClick={() => setActiveTab('소통 채팅방')}
        >
          소통 채팅방
        </button>

      </div>
      {/* 탭 내용 */}
      <div className={`${styles.tabContent} ${isDesktop ? styles.desktopTabContent : ''}`}>
        {renderTabContent()}
      </div>

      {/* 게시판 컨테이너 */}
      <div className={`${styles.container2} ${isDesktop ? styles.desktopContainer : ''}`}>
        <h1 className={styles.title}>재학생들의 자유게시판</h1>

        {/* 핫한 게시판 */}
        <section>
          <h4 className={styles.subtitle}>〈핫한 게시판〉</h4>
          <div className={styles.postList2}>
            {TopFreeBoardData.map((post) => ( // 자유 게시판 데이터 순회
              <div key={post.id} className={styles.post}>
                <h3 className={styles.postTitle}>{post.freeTitle || '제목 없음'}</h3>
                <p className={styles.postDescription}>{post.freeContents || '내용 없음'}</p>
                <button
                  className={styles.commentButton}
                  onClick={() => navigate(`/FreepostingPage/${post.id}`)} // boardID와 함께 전달
                >
                  댓글 달기
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 질문 게시판 */}
        <section>
          <h4 className={styles.subtitle}>〈질문 게시판〉</h4>
          <div className={styles.postList2}>
            {TopQuestBoardData.map((post) => ( // 질문 게시판 데이터 순회
              <div key={post.id} className={styles.post}>
                <h3 className={styles.postTitle}>{post.questTitle || '제목 없음'}</h3>
                <p className={styles.postDescription}>{post.questContents || '내용 없음'}</p>
                <button
                  className={styles.commentButton}
                  onClick={() => navigate(`/QuestionpostingPage/${post.id}`)} // boardID와 함께 전달
                >
                  댓글 달기
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>



      {/* 하단바 */}
      <div className={`${styles.footer} ${isDesktop ? styles.desktopFooter : ''}`}>
        <div className={styles.footerItem}>
          <span>문의하기 </span>
          <a href="mailto:abcd@gmail.com">abcd@gmail.com</a>
        </div>
        <div className={styles.footerItem}>
          <span>개인정보처리방침</span>
        </div>
      </div>
    </div>
  );
};

export default G_HomePage;
