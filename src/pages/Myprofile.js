import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Myprofile.module.css'; // 필요한 스타일 가져오기
import profileIcon from '../images/프로필.png'; // 프로필 아이콘
import main_mascot from '../images/대학 심볼 횃불이.png'; // 로고 이미지 불러오기
import main_bell from '../images/bell.png'; // 로고 이미지 불러오기
import main_message from '../images/message.png'; // 로고 이미지 불러오기
import main_my from '../images/my.png'; // 로고 이미지 불러오기
import { useMediaQuery } from 'react-responsive'; // 반응형 페이지 만들기 위함
import CommunicationRoom_goBack from '../images/왼쪽 나가기 버튼.png';
import UserContext from './UserContext'; // 유저 프로필

import Header from './_2.js'; // 상단바 컴포넌트

const Myprofile = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [profileData, setProfileData] = useState({ userName: '', userId: '' });

  // API 호출로 프로필 데이터 로드
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userId = '202301641'; // 현재 로그인된 사용자 ID user?.userId
      //  if (!userId) return;
      const roomType = roomData?.type;
        // 사용자 채팅방 목록 조회
        const response = await fetch(`https://rmation-chat.kro.kr/Room/userId/${userId}/${roomType}`, {
          headers: {
              contentType: 'application/json',
              'ngrok-skip-browser-warning': 'abc',
              
          },
          method: 'GET',
      });
        
        const data = await response.json();
        
        const userRooms = data.data;

        console.log(userRooms);
        if (userRooms && userRooms.length > 0) {
          // 필요한 데이터만 추출해 저장
          setProfileData({
            userName: userRooms[0]?.userName || '닉네임 없음',
            userId,
          });
        } else {
          console.error('No rooms found for this user.');
          setProfileData({ userName: '채팅방 없음', userId });
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setProfileData({ userName: '오류 발생', userId: user?.userId || '' });
      }
    };

    fetchProfileData();
  }, [user]);

  // 반응형 페이지 처리를 위한 useMediaQuery 사용
  const isDesktop = useMediaQuery({ query: '(min-width: 769px)' });

  const handleEditProfile = () => {
    navigate('/Profileedit'); // 프로필 편집 페이지로 이동
  };

  return (
    <div className={styles.app}>
       <Header />
      {/* 상단바 
      <header
        className={`${styles["app-header"]} ${isDesktop ? styles.desktopHeader : styles.mobileHeader}`}
      >
        <div className={styles["title-group"]}>
          <img
            src={main_mascot}
            className={`${styles["app-main_mascot"]} ${
              isDesktop ? styles.desktopMascot : styles.mobileMascot
            }`}
            alt="main_mascot"
          />
          <h2>INFO!</h2>
          <div className={styles["right-section"]}>
            <div className={styles["mascot-logo"]}></div>
            <h2 className={styles["title-text"]}>공지사항</h2>
            <img
              src={main_bell}
              className={`${styles["app-main_bell"]} ${
                isDesktop ? styles.desktopBell : styles.mobileBell
              }`}
              alt="main_bell"
            />
            <img
              src={main_message}
              className={`${styles["app-main_message"]} ${
                isDesktop ? styles.desktopMessage : styles.mobileMessage
              }`}
              alt="main_message"
            />
            <img
              src={main_my}
              className={`${styles["app-main_my"]} ${
                isDesktop ? styles.desktopMy : styles.mobileMy
              }`}
              alt="main_my"
            />
          </div>
        </div>
      </header>
      */}

      <div className={styles.container}>
        {/* 제목 영역 */}
        <div
          className={`${styles.content} ${
            isDesktop ? styles.desktopContent : styles.mobileContent
          }`}
        >
          <div
            className={`${styles.titleContainer} ${
              isDesktop ? styles.desktopTitleContainer : styles.mobileTitleContainer
            }`}
          >
            <img
              src={CommunicationRoom_goBack}
              className={`${styles.goBackButton} ${
                isDesktop ? styles.desktopGoBackButton : styles.mobileGoBackButton
              }`}
              alt="뒤로가기"
              onClick={() => navigate(-1)} // 뒤로 가기 동작 추가
            />
            <h1 className={styles.pageTitle}>내 프로필</h1>
          </div>
        </div>

        {/* 프로필 영역 */}
        <div className={styles.content}>
          <div
            className={`${styles.profilePictureContainer} ${
              isDesktop
                ? styles.desktopProfilePictureContainer
                : styles.mobileProfilePictureContainer
            }`}
          >
            <img
              src={profileIcon}
              alt="Profile"
              className={`${styles.profilePicture} ${
                isDesktop ? styles.desktopProfilePicture : styles.mobileProfilePicture
              }`}
            />
          </div>
          <div
            className={`${styles.profileInfo} ${
              isDesktop ? styles.desktopProfileInfo : styles.mobileProfileInfo
            }`}
          >
            <div className={styles.nickname}>
              {profileData.userName || '로딩 중...'}
            </div>
            <button
              className={`${styles.editButton} ${
                isDesktop ? styles.desktopEditButton : styles.mobileEditButton
              }`}
              onClick={handleEditProfile}
            >
              프로필 편집
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Myprofile;
