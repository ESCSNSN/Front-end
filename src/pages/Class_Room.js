import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';  // 웹소켓 클라이언트

import main_mascot from '../images/대학 심볼 횃불이.png';
import main_bell from '../images/bell.png';
import main_message from '../images/message.png';
import main_my from '../images/my.png';
import { useMediaQuery } from 'react-responsive';

import Header from './_.js'; // 상단바 컴포넌트
import styles from './Class_Room.module.css';
import CommunicationRoom_goBack from '../images/왼쪽 나가기 버튼.png';
import menuIcon from '../images/메뉴버튼.png';
import Icon1 from '../images/하트이모지.png';
import Icon2 from '../images/눈이모지.png';
import Icon3 from '../images/폭죽이모지.png';

import Icon7 from '../images/임베디드시스템공학과 횃불이.png';
import Icon4 from '../images/내가속한방 횃불이.png';
import Icon5 from '../images/수업소통방 횃불이.png';
import Icon6 from '../images/자유소통방 횃불이.png';


//const roomsData = [];

const Class_Room = () => {

  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]); // 초기값을 빈 배열로 설정
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSelectingForReport, setIsSelectingForReport] = useState(false);
  const [isSelectingForEdit, setIsSelectingForEdit] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [socket, setSocket] = useState(null); // 웹소켓 연결 상태 관리

  const isDesktop = useMediaQuery({ query: '(min-width: 769px)' });
  const baseUrl = 'https://info-rmation.kro.kr';

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomType = roomData?.type || 'room'; // roomData에서 type을 가져오되, 없으면 'room'으로 기본값 설정
        const response = await fetch(`${baseUrl}/Room/RoomList/${roomType}`, {
          headers: {
            'ngrok-skip-browser-warning': 'abc',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 1,
          },
          method: 'GET',
        });
        const data = await response.json();
        console.log(data);
        setRooms(data.data || []); // 데이터가 없으면 빈 배열로 설정
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();

    // 웹소켓 서버와 연결
    const newSocket = io(`${baseUrl}`); // 실제 백엔드 URL로 변경
    setSocket(newSocket);

    // 채팅 메시지 수신 이벤트 처리
    newSocket.on('chat-message', (message) => {
      console.log('New message received:', message);
      // 채팅방 리스트나 메시지 상태를 업데이트하는 로직 추가
    });

    // 컴포넌트 언마운트 시 웹소켓 연결 종료
    return () => newSocket.close();
  }, []);

  const [roomData, setRoomData] = useState({ type: 'class' });  // 기본값 설정
  
  // 방 ID에 맞는 ChatPreview 페이지로 이동하기
  const handleRoomClick = (roomId) => {
    navigate(`/ClassChatRoom/${roomId}`);
  };

  if (!Array.isArray(rooms)) {
    return <div>Error: Invalid room data</div>; // rooms가 배열이 아닌 경우 에러 메시지 표시
  }

  return (
    <div className={`${styles.app} ${isDesktop ? styles.desktopApp : ''}`}>
       <Header />
      
      <div className={`${styles.container} ${isDesktop ? styles.desktopContainer : ''}`}>
        <div className={`${styles.content} ${isDesktop ? styles.desktopContent : ''}`}>
          <div className={`${styles.titleContainer} ${isDesktop ? styles.desktopTitleContainer : ''}`}>
            <img
              src={CommunicationRoom_goBack}
              className={`${styles.goBackButton} ${isDesktop ? styles.desktopGoBackButton : ''}`}
              alt="뒤로가기"
              onClick={() => navigate(-1)}
            />
            <h1 className={`${styles.pageTitle} ${isDesktop ? styles.desktopPageTitle : ''}`}>수업 소통방</h1>
          </div>

          <div className={`${styles.roomsList} ${isDesktop ? styles.desktopRoomsList : ''}`}>
            {rooms.map((room) => (
              <div
                key={room.id}
                className={`${styles.roomItem} ${room.selected ? styles.selected : ''} ${
                  isDesktop ? styles.desktopRoomItem : ''
                }`}
              >
                <img src={room.icon} alt={`방 아이콘 ${room.id}`} className={`${styles.roomIcon} ${isDesktop ? styles.desktopRoomIcon : ''}`} 
                 onError={(e) => (e.target.src = '../images/하트이모지.png')}/>
                <div className={`${styles.roomInfo} ${isDesktop ? styles.desktopRoomInfo : ''}`}>
                  <div className={`${styles.roomTitle} ${isDesktop ? styles.desktopRoomTitle : ''}`}>{room.roomName}</div>
                  
                  <div className={`${styles.roomMessage} ${isDesktop ? styles.desktopRoomMessage : ''}`}>{room.lastMessage}</div>
               
                </div>

                

                <button
                  className={`${styles.joinButton} ${isDesktop ? styles.desktopJoinButton : ''}`}
                  onClick={() => handleRoomClick(room.roomId)}
                >
                  참여하기
                </button>
              </div>
            ))}
          </div>

          <div className={`${styles.bottomNav} ${isDesktop ? styles.desktopBottomNav : ''}`}>
            <div className={`${styles.navItem} ${isDesktop ? styles.desktopNavItem : ''}`}>
              <img
                src={Icon4}
                alt="내가 속한 방"
                className={`${styles.navIcon} ${isDesktop ? styles.desktopNavIcon : ''}`}
                onClick={() => navigate("/RoomPage")}
              />
              <span className={`${styles.navText} ${isDesktop ? styles.desktopNavText : ''}`}>내가 속한 방</span>
            </div>

            <div className={`${styles.navItem} ${isDesktop ? styles.desktopNavItem : ''}`}>
              <img
                src={Icon5}
                alt="수업 소통 방"
                className={`${styles.navIcon} ${isDesktop ? styles.desktopNavIcon : ''}`}
                onClick={() => navigate("/Class_Room")}
              />
              <span className={`${styles.navText} ${isDesktop ? styles.desktopNavText : ''}`}>수업 소통 방</span>
            </div>

            <div className={`${styles.navItem} ${isDesktop ? styles.desktopNavItem : ''}`}>
              <img
                src={Icon6}
                alt="자유 소통 방"
                className={`${styles.navIcon} ${isDesktop ? styles.desktopNavIcon : ''}`}
                onClick={() => navigate("/FreeRoom")}
              />
              <span className={`${styles.navText} ${isDesktop ? styles.desktopNavText : ''}`}>자유 소통 방</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Class_Room;
