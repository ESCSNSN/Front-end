//다른사람프로필 연동 2트,,,

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './Otherprofile.module.css'; // 필요한 스타일 가져오기
import profileIcon from '../images/프로필.png'; // 기본 프로필 이미지
import main_mascot from '../images/대학 심볼 횃불이.png'; // 로고 이미지
import main_bell from '../images/bell.png'; 
import main_message from '../images/message.png';
import main_my from '../images/my.png';
import CommunicationRoom_goBack from '../images/왼쪽 나가기 버튼.png';

import Header from './_2.js'; // 상단바 컴포넌트
import { useMediaQuery } from 'react-responsive'; // 반응형 페이지 만들기 위함
import axios from 'axios';

// 백엔드 기본 URL 설정
const BASE_URL = 'https://rmation-chat.kro.kr';

const Otherprofile = () => {
  const navigate = useNavigate();
  const { roomId, userId } = useParams(); // roomId와 userId를 URL에서 가져옴
  const [roomName, setRoomName] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState(''); // 신고 사유

  // 반응형 페이지 처리를 위한 useMediaQuery 사용
  const isDesktop = useMediaQuery({ query: '(min-width: 769px)' });

  useEffect(() => {
    // 방 제목 가져오기
    const fetchRoomInfo = async () => {
      try {
        let response = await fetch(`${BASE_URL}/Room/${roomId}`, {
            headers: {
                'ngrok-skip-browser-warning': 'abc',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' // CORS
            },
            method: 'GET',
        });
        response = await response.json();
        console.log(response.data.roomId);
        if (response.code === 200) {
          setRoomName(response.data.roomName);
        } else {
          throw new Error('Failed to fetch room data');
        }
      } catch (err) {
        setError('방 정보를 가져오는 데 실패했습니다.');
      }
    };
    // 사용자 정보 가져오기
    const fetchUserInfo = async () => {
      try {
        let response = await fetch(`${BASE_URL}/Room/GetUserList/${roomId}`, {
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'abc',
            },
            method: 'GET',
        });
        response = await response.json();   
        console.log(response.data);
       
        if (response.code === 200) {
          const user = response.data.find((user) => user.userId === userId);
          console.log(user);
          if (user) {
            setUserInfo(user);
          } else {
            throw new Error('사용자를 찾을 수 없습니다.');
          }
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (err) {
        setError('사용자 정보를 가져오는 데 실패했습니다.');
      }
    };

    fetchRoomInfo();
    fetchUserInfo();
  }, [roomId, userId]);

  const handleSendMessage = () => {
    navigate(`/message/${userId}`); // 쪽지 보내기 페이지로 이동
  };

  const handleReportClick = () => {
    setIsModalOpen(true); // 신고하기 모달 열기
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // 신고하기 모달 닫기
    setReportReason(''); // 신고 사유 초기화
  };

  const handleSubmitReport = async () => {
    if (!reportReason.trim()) {
      alert('신고 사유를 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/Report/User`, {
        reportedUserId: userId,
        reason: reportReason,
        roomId: roomId,
      });

      if (response.data.code === 200) {
        alert('신고가 정상적으로 접수되었습니다.');
        handleCloseModal();
      } else {
        throw new Error('신고 처리 실패');
      }
    } catch (err) {
      alert('신고를 처리하는 도중 오류가 발생했습니다.');
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!userInfo) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className={styles.app}>
       <Header />
      {/* 상단바       <header className={`${styles["app-header"]} ${isDesktop ? styles.desktopHeader : styles.mobileHeader}`}>
        <div className={styles["title-group"]}>
          <img src={main_mascot} className={styles["app-main_mascot"]} alt="main_mascot" />
          <h2>INFO!</h2>
          <div className={`${styles["right-section"]} ${isDesktop ? styles.desktopRightSection : ''}`}>
            <h2 className={styles["title-text"]}>공지사항</h2>
            <img src={main_bell} className={styles["app-main_bell"]} alt="main_bell" />
            <img src={main_message} className={styles["app-main_message"]} alt="main_message" />
            <img src={main_my} className={styles["app-main_my"]} alt="main_my" />
          </div>
        </div>
      </header>*/}


      <div className={styles.container}>
        <div className={styles.content}>
          <div className={`${styles.titleContainer} ${isDesktop ? styles.desktopTitleContainer : styles.mobileTitleContainer}`}>
            <img
              src={CommunicationRoom_goBack}
              className={`${styles.goBackButton} ${isDesktop ? styles.desktopGoBackButton : styles.mobileGoBackButton}`}
              alt="뒤로가기"
              onClick={() => navigate(-1)}
            />
            <h1 className={styles.pageTitle}>{roomName}</h1>
          </div>
        </div>

        <div className={styles.content}>
          <div className={`${styles.profilePictureContainer} ${isDesktop ? styles.desktopProfilePictureContainer : ''}`}>
            <img
              src={userInfo.profileUrl || profileIcon}
              alt="Profile"
              className={`${styles.profilePicture} ${isDesktop ? styles.desktopProfilePicture : styles.mobileProfilePicture}`}
            />
          </div>
          <div className={`${styles.profileInfo} ${isDesktop ? styles.desktopProfileInfo : styles.mobileProfileInfo}`}>
            <div className={styles.nickname}>{userInfo.userName}</div>
            <button className={styles.sentButton} onClick={handleSendMessage}>
              쪽지 보내기
            </button>
            <button className={styles.reportButton} onClick={handleReportClick}>
              신고하기
            </button>
          </div>
        </div>
      </div>

      {/* 신고하기 모달 */}
{isModalOpen && (
  <div className={styles.modalOverlay}>
    <div className={`${styles.modalContent} ${isDesktop ? styles.desktopModalContent : ''}`}>
      <h3>신고하기</h3>
      <textarea
        className={`${styles.reportTextarea} ${isDesktop ? styles.desktopReportTextarea : ''}`}
        value={reportReason}
        onChange={(e) => setReportReason(e.target.value)}
        placeholder="신고 사유를 입력하세요"
      />
      <div className={styles.modalButtons}>
        <button 
          onClick={handleSubmitReport} 
          className={`${styles.submitButton} ${isDesktop ? styles.desktopSubmitButton : ''}`}>
          신고하기
        </button>
        <button 
          onClick={handleCloseModal} 
          className={`${styles.cancelButton} ${isDesktop ? styles.desktopCancelButton : ''}`}>
          취소
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Otherprofile;
