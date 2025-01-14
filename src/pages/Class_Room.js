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


const roomsData = [];

const Class_Room = () => {
  const [rooms, setRooms] = useState(roomsData);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSelectingForReport, setIsSelectingForReport] = useState(false);
  const [isSelectingForEdit, setIsSelectingForEdit] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [socket, setSocket] = useState(null);  // 웹소켓 연결 상태 관리
  const navigate = useNavigate();

  const isDesktop = useMediaQuery({ query: '(min-width: 769px)' });
  const baseUrl = 'https://rmation-chat.kro.kr'
  useEffect(() => {
    const fetchRooms = async () => {
        fetch(`${baseUrl}/Room/RoomList`, {
            headers: {  "ngrok-skip-browser-warning": "abc",
                'Content-Type': 'application/json' },
            method: 'GET',
        }).then((res)=> {return res.json()})
        .then((data) => {
            console.log(data);
            setRooms(data.data);
        });
    };

    fetchRooms();
    
    // 웹소켓 서버와 연결 (서버 URL을 실제 백엔드 주소로 변경)
    const newSocket = io(`${baseUrl}`);  // 실제 백엔드 URL로 변경
    setSocket(newSocket);

    // 채팅 메시지 수신 이벤트 처리
    newSocket.on('chat-message', (message) => {
      console.log('New message received:', message);
      // 채팅방 리스트나 메시지 상태를 업데이트하는 로직을 추가해야 함
    });

    // 컴포넌트 언마운트 시 웹소켓 연결 종료
    return () => newSocket.close();
  }, []);


  // 방 ID에 맞는 ChatPreview 페이지로 이동하기
  const handleRoomClick = (roomId) => {
    navigate(`/ChatPreview/${roomId}`);
  };


  {/*
  
  const handleRoomClick = (roomId) => {
    // 채팅방 입장 API 호출 (백엔드 URL로 변경)
    fetch(`${baseUrl}/JoinRoom`, {  // 백엔드 엔드포인트로 변경
      method: 'POST',
      headers: {  "ngrok-skip-browser-warning": "abc",
                'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomId: roomId,
        userName: '김수빈', // 실제 사용자 이름으로 변경
        userId: '202301641',  // 실제 사용자 ID로 변경  // 프로필 이미지 URL
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200) {
          // 서버에서 'join-room' 이벤트를 처리하도록 설정
          //socket.emit('join-room', roomId);  
          navigate(`/Room/${roomId}`);
        }
      });
  };
 */}
  return (
    <div className={`${styles.app} ${isDesktop ? styles.desktopApp : ''}`}>
       <Header />
       {/*
      <header className={`${styles["app-header"]} ${isDesktop ? styles.desktopHeader : ''}`}>
        <div className={`${styles["title-group"]} ${isDesktop ? styles.desktopTitleGroup : ''}`}>
          <img src={main_mascot} className={`${styles["app-main_mascot"]} ${isDesktop ? styles.desktopMascot : ''}`} alt="main_mascot" />
          <h2>INFO!</h2>
          <div className={`${styles["right-section"]} ${isDesktop ? styles.desktopRightSection : ''}`}>
            <div className={`${styles["mascot-logo"]} ${isDesktop ? styles.desktopLogo : ''}`}></div>
            <h2 className={`${styles["title-text"]} ${isDesktop ? styles.desktopTitleText : ''}`}>공지사항</h2>
            <img src={main_bell} className={`${styles["app-main_bell"]} ${isDesktop ? styles.desktopBell : ''}`} alt="main_bell" />
            <img src={main_message} className={`${styles["app-main_message"]} ${isDesktop ? styles.desktopMessage : ''}`} alt="main_message" />
            <img src={main_my} className={`${styles["app-main_my"]} ${isDesktop ? styles.desktopMy : ''}`} alt="main_my" />
          </div>
        </div>
      </header>
 */}
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
