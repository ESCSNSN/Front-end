/*import React from 'react';*/

import React, { useState, useEffect } from 'react'; // 이 라인이 빠져 있을 수 있습니다.

import { Link, useNavigate } from 'react-router-dom';
import styles from "./HomePage.module.css";

import main_mascot from '../images/대학 심볼 횃불이.png';  // 로고 이미지 불러오기
import main_bell from '../images/bell.png';  // 로고 이미지 불러오기
import main_message from '../images/message.png';  // 로고 이미지 불러오기
import main_my from '../images/my.png';  // 로고 이미지 불러오기
import competitionImage1 from '../images/대회1.png'; // 대회 이미지 1 (추가)
import competitionImage2 from '../images/대회2.png'; // 대회 이미지 2 (추가)
import competitionImage3 from '../images/대회3.png'; // 대회 이미지 3 (추가)
import PlusButton from '../assets/MoreButton'; // 플러스 버튼 컴포넌트 import
import Icon1 from '../images/하트이모지.png';
import Icon2 from '../images/눈이모지.png';
import Icon3 from '../images/폭죽이모지.png';

import S_cute from '../assets/S_cuteButton'; //스크랩

import { useMediaQuery } from 'react-responsive'; // 반응형 페이지 만들기 위함



import {  fetchFreeBoardData, fetchQuestBoardData, fetchCompetitionBoardData,fetchCodingBoardData, fetchStudyBoardData } from '../api/boardApi'; //Api
//fetchMainPageData,
const HomePage = () => {
  const navigate = useNavigate(); // useNavigate 훅 선언-> 최상단에 호출
  //Api..

  const [rooms, setRooms] = useState([]);
  
  const [freeBoardData, setFreeBoardData] = useState([]);//자유게시판
  //const [mainPageData, setMainPageData] = useState([]);
  const [questBoardData, setQuestBoardData] = useState([]);//질문게시판
  const [competitionBoardData, setCompetitionBoardData] = useState([]); //대회 게시판
  const [codingBoardData, setCodingBoardData] = useState([]); // 코딩 게시판
  const [studyBoardData, setStudyBoardData] = useState({ // 스터디 게시판
    bootcampStudies: [],
    industryStudies: [],
    regularStudies: [],
}); 


const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

  // 반응형 페이지 처리를 위한 useMediaQuery 사용
  const isDesktop = useMediaQuery({ query: '(min-width: 769px)' });


  useEffect(() => {
    const loadData = async () => {
      try {


        const [freeData, questData, ComData, codingData, studyData,] = await Promise.all([//mainData, 
         // fetchMainPageData(),
          fetchFreeBoardData(),
          fetchQuestBoardData(),
          fetchCompetitionBoardData(),
          fetchCodingBoardData(),
          fetchStudyBoardData(),
        ]);

        //setMainPageData(mainData);
        setFreeBoardData(freeData);
        setQuestBoardData(questData);
        setCompetitionBoardData(ComData);
        setCodingBoardData(codingData);
        setStudyBoardData(studyData);


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
        console.log(data);
        setRooms(data.data);
      });
    const roomsData = [
      { roomId: 1, roomName: '내가 속한 방 제목 1', lastMessage: '마지막 내용', icon: Icon1, selected: false },
    ];
  };
  fetchRooms();
}, []);



  //여기까지 Api..

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





  const [dropdownVisible, setDropdownVisible] = useState(false);  // 드롭다운 상태 관리
  const [activeTab, setActiveTab] = useState('정보게시판'); // Default active tab
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); //logout

    const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = (e) => {
    e.target.src = competitionImage1; // 이미지 로딩 실패 시 기본 이미지
  };



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

//이 밑 2줄도 Api (위에 배치할 시 오류나기도 함)
  
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
               <a href="/InformationCode" className={styles.plusButtonLink}>
                    <PlusButton className={styles.plusButton} />
               </a>
          </div>

          {/* 코딩 게시판 상위 2개 게시물 리스트 */}
          <div className={styles.postList}>
  {codingBoardData.slice(0, 2).map((post) => (
    <div
      key={post.id}
      className={styles.postItem}
      onClick={() => navigate(`/BoardCode/${post.id}`)} // 바로 navigate 호출
      >
      <span className={styles.index}>{codingBoardData.indexOf(post) + 1}</span>
      <span className={styles.question}>{post.codingTitle || '제목 없음'}</span>
      <span className={styles.date}>
        {new Date(post.codingCreatedTime).toLocaleDateString()}
      </span>
      {/* 첨부파일 여부와 관계없이 S_cute 표시 */}
      <S_cute className={styles.S_cute} />
    </div>
  ))} 
</div>

          </div>



    <div className={styles.container}>
      <div className={styles.infoheader}>
      <h2 className={styles.comtext}>빈 강의실 현황</h2>
        <a href="ClassRoom" className={styles.plusButtonLink}>
          <PlusButton className={styles.plusButton} />
        </a>
      </div>
      

      <div className={styles.postList}>
        <div className={styles.postItem}onClick={() => navigate(`/ClassRoom`)} >
          <span className={styles.index}>1</span>
          <span className={styles.question}>A동 210호</span>
          <S_cute className={styles.S_cute} />
        </div>

        <div className={styles.postItem} onClick={() => navigate(`/ClassRoom`)} >
          <span className={styles.index}>2</span>
          <span className={styles.question}>B동 530호</span>
          
          <S_cute className={styles.S_cute} />
        </div>
      </div>
    </div>





    <div className={styles.container}>
          <div className={styles.infoheader}>
               <h2 className={styles.comtext}>자기 개발</h2>
               <a href="/BootBoardPage" className={styles.plusButtonLink}>
                    <PlusButton className={styles.plusButton} />
               </a>
          </div>

          {/* 스터디 게시판 각 카테고리별 상위 1개 게시물 */}
          <div className={styles.postList}>
               <div className={styles.postItem} onClick={() => navigate((`/BootBoard/${studyBoardData.bootcampStudies[0]?.id}`))}>
                    <span className={styles.index}>1</span>
                    <span className={styles.question}>
                         {studyBoardData.bootcampStudies[0]?.studyTitle || '제목 없음'}
                    </span>
                    <span className={styles.date}>
                         {studyBoardData.bootcampStudies[0]?.studyCreatedTime
                              ? new Date(studyBoardData.bootcampStudies[0]?.studyCreatedTime).toLocaleDateString()
                              : 'N/A'}
                    </span>
                    <S_cute className={styles.S_cute} />
               </div>

               <div className={styles.postItem} onClick={() => navigate(`/IndustryBoard/${studyBoardData.industryStudies[0]?.id}`)}>
                    <span className={styles.index}>2</span>
                    <span className={styles.question}>
                         {studyBoardData.industryStudies[0]?.studyTitle || '제목 없음'}
                    </span>
                    <span className={styles.date}>
                         {studyBoardData.industryStudies[0]?.studyCreatedTime
                              ? new Date(studyBoardData.industryStudies[0]?.studyCreatedTime).toLocaleDateString()
                              : 'N/A'}
                    </span>
                    <S_cute className={styles.S_cute} />
               </div>

               <div className={styles.postItem} onClick={() => navigate(`/StudyBoard/${studyBoardData.regularStudies[0]?.id}`)}>
                    <span className={styles.index}>3</span>
                    <span className={styles.question}>
                         {studyBoardData.regularStudies[0]?.studyTitle || '제목 없음'}
                    </span>
                    <span className={styles.date}>
                         {studyBoardData.regularStudies[0]?.studyCreatedTime
                              ? new Date(studyBoardData.regularStudies[0]?.studyCreatedTime).toLocaleDateString()
                              : 'N/A'}
                    </span>
                    <S_cute className={styles.S_cute} />
               </div>
          </div>
     </div>

          </>
        );

   // Handle other tabs here
   case '자유 게시판':
     return (
       <div className={styles.container}>
         {/* 자유 게시판 */}
         <div className={styles.infoheader}>
           <h2 className={styles.comtext}>자유 게시판</h2>
           <a href="/FreeboardPage" className={styles.plusButtonLink}>
             <PlusButton className={styles.plusButton} />
           </a>
         </div>

         {/* 자유 게시판 리스트 (상위 3개 게시물) */}
         <div className={styles.postList}>
           {freeBoardData.slice(0, 3).map((post) => (
             // 상위 3개 게시물만 렌더링
             <div
               key={post.id}
               className={styles.postItem}
               onClick={() => handleQuestionClick(post.id)} // 클릭 시 상세 페이지로 이동
             >
               <span className={styles.index2}>HOT</span>
               <span className={styles.question}>{post.freeTitle}</span>
               <span className={styles.date}>{new Date(post.freeCreatedTime).toLocaleDateString()}</span>
               <S_cute className={styles.S_cute} />
             </div>
           ))}
         </div>

         {/* 질문 게시판 */}
         <div className={styles.infoheader}>
           <h2 className={styles.comtext}>질문 게시판</h2>
           <a href="/QuestionboardPage" className={styles.plusButtonLink}>
             <PlusButton className={styles.plusButton} />
           </a>
         </div>

         {/* 질문 게시판 리스트 (상위 3개 게시물) */}
         <div className={styles.postList}>
           {questBoardData.slice(0, 3).map((post) => (
             // 상위 3개 게시물만 렌더링
             <div
               key={post.id}
               className={styles.postItem}
               onClick={() => handleQuestionClick(post.id)} // 클릭 시 상세 페이지로 이동
             >
               <span className={styles.index2}>HOT</span>
               <span className={styles.question}>{post.questTitle}</span>
               <span className={styles.date}>{new Date(post.questCreatedTime).toLocaleDateString()}</span>
               <S_cute className={styles.S_cute} />
             </div>
           ))}
         </div>
       </div>
     );
   
      case '소통 채팅방':
        return (
    
          <>
 
 
                  
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
    </>                      </>
       
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
              onClick={() => navigate("/Announcement")}
              style={{ cursor: "pointer" }}
            >
              공지사항
            </h2>
  
            <img
              src={main_bell}
              className={`${styles["app-main_bell"]} ${isDesktop ? styles.desktopMainBell : ''}`}
              alt="main_bell"
              onClick={() => navigate("/AlarmPage")}
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
                <a href="/User_auth" className={styles["menu-item"]}>스터디 신청 확인</a>
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
            <a href="/InformationContest" className={styles.plusButtonLink}>
                  <PlusButton className={styles.plusButton} />
            </a>
      </div>

      {/* 대회 정보 리스트 (상위 3개 게시물) */}
      <div className={`${styles.competitions} ${isDesktop ? styles.desktopCompetitions : ''}`}>
            {competitionBoardData.slice(0, 3).map((post) => (  // 상위 3개 게시물만 렌더링
                  <div key={post.id} className={styles.competitionItem}>
  
                        {post.imageUrls && post.imageUrls.length > 0 ? (
        <div className={styles.imageContainer}>
          {post.imageUrls.slice(0, 3).map((url, index) => (
            <div key={index} className={styles.imageWrapper}>
              {!imageLoaded && <div className={styles.loader}>Loading...</div>} {/* 로딩 표시 */}
              <img
                src={url}
                alt={`Competition Image ${index + 1}`}
                className={styles.competitionImage}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </div>
          ))}
        </div>
      ) : (
        <span className={styles.noImageText}>이미지가 없습니다</span>
      )}

                  </div>
            ))}
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

export default HomePage;
