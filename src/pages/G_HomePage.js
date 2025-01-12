/*import React from 'react';*/

import React, { useState,useEffect } from 'react';
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

import S_cute from '../assets/S_cuteButton'; //스크랩

import { useMediaQuery } from 'react-responsive'; // 반응형 페이지 만들기 위함

import {  G_fetchFreeBoardData
  , G_fetchQuestBoardData, TopfetchFreeBoardData, TopfetchQuestBoardData} from '../api/GraduateBoardApi.js'; //Api


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
      const [G_freeData, G_questData, TopfreeData, TopquestData, ] = await Promise.all([
       
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
    const userId = '202301641'; // 추후 삭제제
    const baseUrl = 'https://rmation-chat.kro.kr';
    fetch(`${baseUrl}/Room/userId/${userId}`, {
        headers: {
            contentType: 'application/json',
            'ngrok-skip-browser-warning': 'abc',
        },
        method: 'GET'
    }).then((res) => { return res.json() })
      .then((data) => {
        setRooms(data.data);
      });
    const roomsData = [
      { roomId: 1, roomName: '내가 속한 방 제목 1', lastMessage: '마지막 내용', icon: Icon1, selected: false },
    ];
  };
  fetchRooms();
}, []);

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
                    {/* 로딩 중일 경우 */}
                    {!loading && !error && (
  <div className={styles.postList}>
    {/* 질문 게시판 데이터 렌더링 */}
    <h1>질문 게시판</h1>
    {G_questBoardData.map((item, index) => (
      <div
        key={`quest-${item.id}`}
        className={styles.postItem}
        onClick={() => handleQuestionClick(item.id, item.boardID)} // boardID를 함께 전달
      >
        <span className={styles.index2}>{index + 1}</span>
        <span className={styles.question}>{item.graduateTitle}</span>
        <span className={styles.date}>
          {new Date(item.graduateCreatedTime).toLocaleDateString()}
        </span>
        <S_cute className={styles.S_cute} />
      </div>
    ))}

    {/* 자유 게시판 데이터 렌더링 */}
    <h1>자유 게시판</h1>
    {G_freeBoardData.map((item, index) => (
      <div
        key={`free-${item.id}`}
        className={styles.postItem}
        onClick={() => handleFreeBoardClick(item.id, item.boardID)} // boardID를 함께 전달
      >
        <span className={styles.index2}>{index + 1}</span>
        <span className={styles.question}>{item.graduateTitle || 'No Title'}</span>
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
  <div className={styles.Roomcontainer}>

    {/* 방 목록 */}
    <div className={styles.roomsList}>
    <a href="/Chat_" className={styles.plusButtonLink}>
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
                      onClick={() => handleRoomClick(room.id)}
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

  // 게시판 데이터 (예시 데이터)
  const hotPosts = [
    {
      id: 1,
      title: "임베디드 취업률 실화냐..",
      description: "임베디드 취업률 법학과보다 낮아서 교수님께 한 소리 들었다.",
    },
    {
      id: 2,
      title: "정보대 앞 토끼..",
      description: "정보대 앞 토끼.. 왜 안 보이냐...",
    },
  ];

  const questionPosts = [
    {
      id: 3,
      title: "과 CC 다 말리던데... 하면 안돼요?",
      description: "이번에 입학했는데 과 CC 하면 안돼요?",
    },
    {
      id: 4,
      title: "코딩 언어 뭐가 좋을까요?",
      description:
        "학교에서 C언어 주로 배우는데... 요즘 파이썬이랑 자바스크립트... 쓰는... 더보기",
    },
  ];

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
        {/* 상단바 */}
        <header className={`${styles["app-header"]} ${isDesktop ? styles.desktopHeader : ''}`}>
          <div className={`${styles["title-group"]} ${isDesktop ? styles.desktopTitleGroup : ''}`}>
            <img
              src={main_mascot}
              className={styles["app-main_mascot"]}
              alt="main_mascot"
              onClick={() => navigate("/HomePage")}
            />
            <h2 onClick={() => navigate("/HomePage")} style={{ cursor: "pointer" }}>
              INFO!
            </h2>
  
            {/* 오른쪽 섹션 */}
            <div className={`${styles["right-section"]} ${isDesktop ? styles.desktopRightSection : ''}`}>
              <h2
                className={styles["title-text"]}
                onClick={() => navigate("/notice")}
                style={{ cursor: "pointer" }}
              >
                공지사항
              </h2>
              <img
                src={main_bell}
                className={styles["app-main_bell"]}
                alt="main_bell"
                onClick={() => navigate("/notification")}
              />
              <img
                src={main_message}
                className={styles["app-main_message"]}
                alt="main_message"
                onClick={() => navigate("/message")}
              />
              <img
                src={main_my}
                className={styles["app-main_my"]}
                alt="main_my"
                onClick={toggleDropdown}
              />
            </div>
          </div>
        </header>
  
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
          <a href="/self-development" className={styles.plusButtonLink}>
            <PlusButton className={styles.plusButton} />
          </a>
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
            onClick={() => handleTopNavigate(post.id, post.boardID)} // boardID와 함께 전달
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
            onClick={() => handleTopNavigate(post.id, post.boardID)} // boardID와 함께 전달
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
