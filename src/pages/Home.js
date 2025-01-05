//메인페이지 기존 코드

/*import React from 'react';*/

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from "./Home.module.css";

import main_mascot from '../images/대학 심볼 횃불이.png';  // 로고 이미지 불러오기
import main_bell from '../images/bell.png';  // 로고 이미지 불러오기
import main_message from '../images/message.png';  // 로고 이미지 불러오기
import main_my from '../images/my.png';  // 로고 이미지 불러오기
import competitionImage1 from '../images/대회1.png'; // 대회 이미지 1 (추가)
import competitionImage2 from '../images/대회2.png'; // 대회 이미지 2 (추가)
import competitionImage3 from '../images/대회3.png'; // 대회 이미지 3 (추가)
import PlusButton from '../assets/MoreButton'; // 플러스 버튼 컴포넌트 import

import Icon1 from '../images/하트이모지.png';  // 방 1의 아이콘
import Icon2 from '../images/눈이모지.png';   // 방 2의 아이콘
import Icon3 from '../images/폭죽이모지.png'; // 방 3의 아이콘

import S_cute from '../assets/S_cuteButton'; //스크랩

import { useMediaQuery } from 'react-responsive'; // 반응형 페이지 만들기 위함




const Home = () => {

  //Api..


  const [dropdownVisible, setDropdownVisible] = useState(false);  // 드롭다운 상태 관리
  const [activeTab, setActiveTab] = useState('정보게시판'); // Default active tab
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); //logout
  const navigate = useNavigate(); // useNavigate 훅 선언

 // 반응형 페이지 처리를 위한 useMediaQuery 사용
 const isDesktop = useMediaQuery({ query: '(min-width: 769px)' });

  // 질문 항목 클릭 시 이동할 링크
  const handleQuestionClick = (questionId) => {
    navigate(`/page/${questionId}`);  // 질문 상세 페이지로 이동
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

  //소통방
    // 방 ID에 맞는 페이지로 이동하기
    const handleRoomClick = (path) => {
        navigate(`/${path}`);  // 방 ID에 맞는 페이지로 이동
      };

      const roomsData = [
        { id: 1, title: '내가 속한 방 제목 1', lastMessage: '마지막 내용', icon: Icon1, selected: false },
        { id: 2, title: '내가 속한 방 제목 2', lastMessage: '마지막 내용', icon: Icon2, selected: false },
        { id: 3, title: '내가 속한 방 제목 3', lastMessage: '마지막 내용', icon: Icon3, selected: false },
      ];


  const [rooms, setRooms] = useState(roomsData);




{/*
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  }; */}

    // 드롭다운 메뉴 토글 함수
    const toggleDropdown = () => {
      setDropdownVisible((prev) => !prev);
    };



  // Render content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case '정보게시판':
        return (
          <>

          {/*  <ul>
                {data.map((item, index) => (
                    <li key={index}>
                        {item.title} - {item.description}
                    </li>
                ))}
            </ul> */}



          {/* 코드 정보 섹션 */}


    <div className={styles.container}>
      <div className={styles.infoheader}>
      <h2 className={styles.comtext}>코드 질문</h2>
        <a href="/new-link" className={styles.plusButtonLink}>
          <PlusButton className={styles.plusButton} />
        </a>
      </div>
      

      <div className={styles.postList}>
        <div className={styles.postItem} onClick={() => handleQuestionClick(1)}>
          <span className={styles.index}>1</span>
          <span className={styles.question}>[C언어] 정렬 오류</span>
          <span className={styles.date}>2024.01.01</span>
          <S_cute className={styles.S_cute} />
        </div>

        <div className={styles.postItem} onClick={() => handleQuestionClick(2)}>
          <span className={styles.index}>2</span>
          <span className={styles.question}>[JS] 런타임 에러</span>
          <span className={styles.date}>2024.01.01</span>
          <S_cute className={styles.S_cute} />
        </div>
      </div>
    </div>



    <div className={styles.container}>
      <div className={styles.infoheader}>
      <h2 className={styles.comtext}>빈 강의실 현황</h2>
        <a href="/room-status" className={styles.plusButtonLink}>
          <PlusButton className={styles.plusButton} />
        </a>
      </div>
      

      <div className={styles.postList}>
        <div className={styles.postItem} onClick={() => handleQuestionClick(1)}>
          <span className={styles.index}>1</span>
          <span className={styles.question}>A동 210호</span>
          <S_cute className={styles.S_cute} />
        </div>

        <div className={styles.postItem} onClick={() => handleQuestionClick(2)}>
          <span className={styles.index}>2</span>
          <span className={styles.question}>B동 530호</span>
          
          <S_cute className={styles.S_cute} />
        </div>
      </div>
    </div>






    <div className={styles.container}>
      <div className={styles.infoheader}>
      <h2 className={styles.comtext}>자기 개발</h2>
        <a href="/self-development" className={styles.plusButtonLink}>
          <PlusButton className={styles.plusButton} />
        </a>
      </div>
      

      <div className={styles.postList}>
        <div className={styles.postItem} onClick={() => handleQuestionClick(1)}>
          <span className={styles.index}>1</span>
          <span className={styles.question}>[부트 캠프] SSAFY</span>
          <span className={styles.date}>2024.01.01</span>
          <S_cute className={styles.S_cute} />
        </div>

        <div className={styles.postItem} onClick={() => handleQuestionClick(2)}>
          <span className={styles.index}>2</span>
          <span className={styles.question}>[산업 연계] CJ 클라우드 네트워크스</span>
          <span className={styles.date}>2024.01.01</span>
          <S_cute className={styles.S_cute} />
        </div>

        <div className={styles.postItem} onClick={() => handleQuestionClick(3)}>
          <span className={styles.index}>3</span>
          <span className={styles.question}>[스터디 모집] 운영체제 스터디 모집</span>
          <span className={styles.date}>2024.01.01</span>
          <S_cute className={styles.S_cute} />
        </div>

      </div>
    </div>



          </>
        );
      // Handle other tabs here
      case '자유 게시판':
        return (
          <>
 
 
 <div className={styles.container}>
      <div className={styles.infoheader}>
      <h2 className={styles.comtext}>자유 게시판</h2>
        <a href="/self-development" className={styles.plusButtonLink}>
          <PlusButton className={styles.plusButton} />
        </a>
      </div>
      

      <div className={styles.postList}>
        <div className={styles.postItem} onClick={() => handleQuestionClick(1)}>
          <span className={styles.index2}>HOT</span>
          <span className={styles.question}>[부트 캠프] SSAFY</span>
          <span className={styles.date}>2024.01.01</span>
          <S_cute className={styles.S_cute} />
        </div>

        <div className={styles.postItem} onClick={() => handleQuestionClick(2)}>
          <span className={styles.index2}>HOT</span>
          <span className={styles.question}>[산업 연계] CJ 클라우드 네트워크스</span>
          <span className={styles.date}>2024.01.01</span>
          <S_cute className={styles.S_cute} />
        </div>

        <div className={styles.postItem} onClick={() => handleQuestionClick(3)}>
          <span className={styles.index2}>HOT</span>
          <span className={styles.question}>[스터디 모집] 운영체제 스터디 모집</span>
          <span className={styles.date}>2024.01.01</span>
          <S_cute className={styles.S_cute} />
        </div>

      </div>
    </div>


    <div className={styles.container}>
      <div className={styles.infoheader}>
      <h2 className={styles.comtext}>질문 게시판</h2>
        <a href="/self-development" className={styles.plusButtonLink}>
          <PlusButton className={styles.plusButton} />
        </a>
      </div>
      

      <div className={styles.postList}>
        <div className={styles.postItem} onClick={() => handleQuestionClick(1)}>
          <span className={styles.index2}>HOT</span>
          <span className={styles.question}>[부트 캠프] SSAFY</span>
          <span className={styles.date}>2024.01.01</span>
          <S_cute className={styles.S_cute} />
        </div>

        <div className={styles.postItem} onClick={() => handleQuestionClick(2)}>
          <span className={styles.index2}>HOT</span>
          <span className={styles.question}>[산업 연계] CJ 클라우드 네트워크스</span>
          <span className={styles.date}>2024.01.01</span>
          <S_cute className={styles.S_cute} />
        </div>

        <div className={styles.postItem} onClick={() => handleQuestionClick(3)}>
          <span className={styles.index2}>HOT</span>
          <span className={styles.question}>[스터디 모집] 운영체제 스터디 모집</span>
          <span className={styles.date}>2024.01.01</span>
          <S_cute className={styles.S_cute} />
        </div>

      </div>
    </div>


            
          </>
        );case '소통 채팅방':
        return (
          
    <>
    {/* 방 목록 */}
    <div className={styles.roomsList}>
      {rooms.map((room) => (
        <div
          key={room.id}
          className={`${styles.roomItem} ${room.selected ? styles.selected : ''}`}
        >
          <img src={room.icon} alt={`방 아이콘 ${room.id}`} className={styles.roomIcon} /> {/* 아이콘 추가 */}
          <div className={styles.roomInfo}>
            <div className={styles.roomTitle}>{room.title}</div>
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
    </>
        );
      
      default:
        return null;
    }
  };



  return (
    <div className={styles.app}>
      {/* 상단바 */}
      <header className={`${styles["app-header"]} ${isDesktop ? styles.desktopHeader : ''}`}>
        <div className={`${styles["title-group"]} ${isDesktop ? styles.desktopTitleGroup : ''}`}>
          <img
            src={main_mascot}
            className={`${styles["app-main_mascot"]} ${isDesktop ? styles.desktopMainMascot : ''}`}
            alt="main_mascot"
            onClick={() => navigate("/HomePage")}
          />
          <h2
            onClick={() => navigate("/HomePage")}
            style={{ cursor: "pointer" }}
          >
            INFO!
          </h2>
  
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
              className={`${styles["app-main_bell"]} ${isDesktop ? styles.desktopMainBell : ''}`}
              alt="main_bell"
              onClick={() => navigate("/notification")}
            />
            <img
              src={main_message}
              className={`${styles["app-main_message"]} ${isDesktop ? styles.desktopMainMessage : ''}`}
              alt="main_message"
              onClick={() => navigate("/message")}
            />
            <img
              src={main_my}
              className={`${styles["app-main_my"]} ${isDesktop ? styles.desktopMainMy : ''}`}
              alt="main_my"
              onClick={toggleDropdown}
            />
  
            {/* 드롭다운 메뉴 */}
            {dropdownVisible && (
              <div className={`${styles["dropdown-menu"]} ${isDesktop ? styles.desktopDropdownMenu : ''}`}>
                <a href="/scrap" className={styles["menu-item"]}>스크랩</a>
                <a href="/write-post" className={styles["menu-item"]}>작성 게시글</a>
                <a href="/write-comment" className={styles["menu-item"]}>작성 댓글</a>
                <a href="/User_auth" className={styles["menu-item"]}>사용자 권한 인증</a>
                <a
                  href="#"
                  onClick={handleLogoutClick}
                  className={`${styles["menu-item"]} ${styles["logout"]}`}
                >
                  로그아웃
                </a>
              </div>
            )}
          </div>
        </div>
      </header>
  
      {/* 대회 정보 부분 */}
      <div className={`${styles.comheader} ${isDesktop ? styles.desktopComHeader : ''}`}>
        <h2 className={styles.comtext}>대회 정보</h2>
        <a href="/com" className={styles.plusButtonLink}>
          <PlusButton className={styles.plusButton} />
        </a>
      </div>
  
      {/* 대회 정보 이미지 부분 */}
      <div className={`${styles.competitions} ${isDesktop ? styles.desktopCompetitions : ''}`}>
        <a className={styles.competitionItem} href="https://example.com/competition1" target="_blank" rel="noopener noreferrer">
          <img src={competitionImage1} className={styles.competitionImage} alt="대회 1" />
        </a>
        <a className={styles.competitionItem} href="https://example.com/competition2" target="_blank" rel="noopener noreferrer">
          <img src={competitionImage2} className={styles.competitionImage} alt="대회 2" />
        </a>
        <a className={styles.competitionItem} href="https://example.com/competition3" target="_blank" rel="noopener noreferrer">
          <img src={competitionImage3} className={styles.competitionImage} alt="대회 3" />
        </a>
      </div>
  
      {/* 탭 네비게이션 */}
      <div className={`${styles.tabContainer} ${isDesktop ? styles.desktopTabContainer : ''}`}>
        <button
          className={activeTab === '정보게시판' ? styles.activeTab : styles.inactiveTab}
          onClick={() => setActiveTab('정보게시판')}
        >
          정보게시판
        </button>
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

export default Home;
