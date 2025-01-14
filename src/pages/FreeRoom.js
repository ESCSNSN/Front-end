//2.FreeRoom

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive'; // 반응형 페이지 만들기 위함
import main_mascot from '../images/대학 심볼 횃불이.png';
import main_bell from '../images/bell.png';
import main_message from '../images/message.png';
import main_my from '../images/my.png';

import styles from './FreeRoom.module.css';
import CommunicationRoom_goBack from '../images/왼쪽 나가기 버튼.png';
import menuIcon from '../images/메뉴버튼.png';
import Icon1 from '../images/하트이모지.png';
import Icon2 from '../images/눈이모지.png';
import Icon3 from '../images/폭죽이모지.png';
import Icon4 from '../images/내가속한방 횃불이.png';
import Icon5 from '../images/수업소통방 횃불이.png';
import Icon6 from '../images/자유소통방 횃불이.png';
import Icon8 from '../images/프로필.png';
import Icon9 from '../images/검색.png';
import Icon10 from '../images/Make.png'


import Header from './_.js'; // 상단바 컴포넌트

const FreeRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]); // 필터된 방 목록
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const isDesktop = useMediaQuery({ query: '(min-width: 769px)' });
  const baseUrl = 'https://rmation-chat.kro.kr';
  // 열린 채팅방 목록 조회
  useEffect(() => {
    fetch(`${baseUrl}/Room/RoomList`, {
      headers: {
        "ngrok-skip-browser-warning": "abc",
        'Content-Type': 'application/json'
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          const roomsWithIcons = data.data.map((room, index) => ({
            id: room.roomId,
            title: room.roomName,
            lastMessage: room.lastMessage || '대화가 없습니다.',
            icon: [Icon1, Icon2, Icon3][index % 3],
          }));
          setRooms(roomsWithIcons);
          setFilteredRooms(roomsWithIcons);
        }
      })
      .catch((error) => console.error('채팅방 목록 불러오기 실패:', error));
  }, []);

  // 검색 기능 처리 함수
  const handleSearch = () => {
    const filtered = rooms.filter(
      (room) =>
        room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRooms(filtered);
  };

  // 검색어가 변경될 때마다 검색 실행
  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  // 방 ID에 맞는 ChatPreview 페이지로 이동하기
  const handleRoomClick = (roomId) => {
    navigate(`/ChatPreview/${roomId}`);
  };

  // 프로필로 이동
  const handleProfileClick = () => {
    navigate('/myprofile');
  };

  // 프로필로 이동
  const handleMakeRoomClick = () => {
    navigate('/Makechat');
  };

  return (
    <div className={styles.app}>
      <Header />

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={`${styles.titleContainer} ${isDesktop ? styles.desktopTitleContainer : ''}`}>
            <img
              src={CommunicationRoom_goBack}
              className={styles.goBackButton}
              alt="뒤로가기"
              onClick={() => navigate(-1)}
            />
            <h1 className={`${styles.pageTitle} ${isDesktop ? styles.desktopPageTitle : ''}`}>
              자유 소통방
            </h1>
          </div>

          <div className={`${styles.searchContainer} ${isDesktop ? styles.desktopSearchContainer : ''}`}>
            
            <div className={styles.profileIcon} onClick={handleProfileClick}>
              <img src={Icon8} alt="Profile Icon" />
            </div>


            <input
              type="text"
              className={styles.searchInput}
              placeholder="검색어를 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className={styles.searchButton} onClick={handleSearch}>
              <img src={Icon9} alt="Search Icon" />
            </button>
            <div className={styles.makeroomicon} onClick={handleMakeRoomClick}>
              <img src={Icon10} alt="MakeChat icon" />
            </div>
          </div>

          <div className={styles.roomsList}>
            {filteredRooms.map((room) => (
              <div key={room.id} className={styles.roomItem}>
                <img src={room.icon} alt={`방 아이콘 ${room.id}`} className={styles.roomIcon} />
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
            {/* 하단바 */}
            <div className={styles.bottomNav}>
              <div className={styles.navItem}>
                <img
                  src={Icon4}
                  alt="내가 속한 방"
                  className={styles.navIcon}
                  onClick={() => navigate("/RoomPage")}
                />
                <span className={styles.navText}>내가 속한 방</span>
              </div>
              <div className={styles.navItem}>
                <img
                  src={Icon5}
                  alt="수업 소통 방"
                  className={styles.navIcon}
                  onClick={() => navigate('/Class_Room')}
                />
                <span className={styles.navText}>수업 소통 방</span>
              </div>
              <div className={styles.navItem}>
                <img
                  src={Icon6}
                  alt="자유 소통 방"
                  className={styles.navIcon}
                  onClick={() => navigate("/FreeRoom")}
                />
                <span className={styles.navText}>자유 소통 방</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeRoom;
