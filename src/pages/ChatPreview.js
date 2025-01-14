import React, { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ChatPreview.module.css';  // 필요한 스타일 가져오기
import main_mascot from '../images/대학 심볼 횃불이.png';  // 로고 이미지 불러오기
import main_bell from '../images/bell.png';  // 로고 이미지 불러오기
import main_message from '../images/message.png';  // 로고 이미지 불러오기
import main_my from '../images/my.png';  // 로고 이미지 불러오기
import CommunicationRoom_goBack from '../images/왼쪽 나가기 버튼.png';
import { useMediaQuery } from 'react-responsive'; // 반응형 페이지 만들기 위함
import axios from 'axios';


import Header from './_2.js'; // 상단바 컴포넌트


// 백엔드 기본 URL 설정
const BASE_URL = 'https://rmation-chat.kro.kr';

function ChatPreview() {
  const navigate = useNavigate();
  const { roomId } = useParams(); // roomId를 URL에서 가져옴

  const [roomData, setRoomData] = useState(null); // 채팅방 정보 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  // 반응형 페이지 처리를 위한 useMediaQuery 사용
  const isDesktop = useMediaQuery({ query: '(min-width: 769px)' });

  // 특정 채팅방 정보 가져오기
  const fetchRoomData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Room/${roomId}`, {
        headers: {
          'ngrok-skip-browser-warning': 'abc',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // CORS 문제 방지
        },
      });
      if (response.data.code === 200) {
        setRoomData(response.data.data);
      } else {
        throw new Error('Failed to fetch room data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    console.log(roomData);
  };

  // 컴포넌트 마운트 시 API 호출
  React.useEffect(() => {
    fetchRoomData();
  }, [roomId]);

  const handleJoinClick = () => {
    // 참여하기 버튼 클릭 로직 추가 가능
    //alert('채팅방에 참여합니다!');
    navigate(`/FreeChat/${roomId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.app}>
       <Header />
    

      {/* 메인 컨텐츠 */}
      <div className={`${styles.container} ${isDesktop ? styles.desktopContainer : styles.mobileContainer}`}>
        <div className={styles.content}>
          <div className={`${styles.titleContainer} ${isDesktop ? styles.desktopTitleContainer : styles.mobileTitleContainer}`}>
            <img
              src={CommunicationRoom_goBack}
              className={`${styles.goBackButton} ${isDesktop ? styles.desktopGoBackButton : styles.mobileGoBackButton}`}
              alt="뒤로가기"
              onClick={() => navigate(-1)} /* 뒤로 가기 동작 추가 */
            />
            <h1 className={`${styles.pageTitle} ${isDesktop ? styles.desktopPageTitle : styles.mobilePageTitle}`}>
              소통 채팅방
            </h1>
          </div>
        </div>
      </div>

      {/* 채팅방 카드 */}
      <div className="container">
        <div className={`${styles.roomCard} ${isDesktop ? styles.desktopRoomCard : styles.mobileRoomCard}`}>
          <div className={styles.roomHeader}>
            <h3 className={`${styles.roomTitle} ${isDesktop ? styles.desktopRoomTitle : styles.mobileRoomTitle}`}>
              {roomData.roomName}
            </h3>
            <span className={styles.date}>24.01.01</span>
            <span className={styles.participants}>{roomData.userCount}/100</span>
          </div>

          <p className={`${styles.roomDescription} ${isDesktop ? styles.desktopRoomDescription : styles.mobileRoomDescription}`}>
            {roomData.description}
          </p>

          <button
            className={`${styles.Joinbutton} ${isDesktop ? styles.desktopJoinbutton : styles.mobileJoinbutton}`}
            onClick={handleJoinClick}
          >
            참여하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPreview;
