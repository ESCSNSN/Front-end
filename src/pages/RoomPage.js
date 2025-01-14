import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import Header from './_.js';  // 상단바 컴포넌트

import main_mascot from '../images/대학 심볼 횃불이.png';  // 로고 이미지 불러오기
import main_bell from '../images/bell.png';  // 로고 이미지 불러오기
import main_message from '../images/message.png';  // 로고 이미지 불러오기
import main_my from '../images/my.png';  // 로고 이미지 불러오기

import { useMediaQuery } from 'react-responsive'; // 반응형 페이지 만들기 위함
import Header from './_.js';  // 상단바 컴포넌트
import axiosInstance from '../utils/api'; // Axios 인스턴스
import { jwtDecode } from 'jwt-decode'; // default가 아닌 named import 사용. authToken에서 사용자 ID 추출하기. npm install jwt-decode
import styles from './Class_Room.module.css';
import CommunicationRoom_goBack from '../images/왼쪽 나가기 버튼.png';
import menuIcon from '../images/메뉴버튼.png';
import Icon1 from '../images/하트이모지.png';  // 방 1의 아이콘
import Icon2 from '../images/눈이모지.png';   // 방 2의 아이콘
import Icon3 from '../images/폭죽이모지.png'; // 방 3의 아이콘
import Icon4 from '../images/내가속한방 횃불이.png';  // 하단바 아이콘들
import Icon5 from '../images/수업소통방 횃불이.png';
import Icon6 from '../images/자유소통방 횃불이.png';

const RoomPage = () => {
  const [rooms, setRooms] = useState([]); // 여기는 하드코딩 되어있는 상태
  const [menuOpenId, setMenuOpenId] = useState(false);  // 메뉴 열림/닫힘 상태
  const [isSelectingForReport, setIsSelectingForReport] = useState(false); // 방 신고 모드 여부
  const [isSelectingForEdit, setIsSelectingForEdit] = useState(false); // 방 편집 모드 여부
  const [selectedRooms, setSelectedRooms] = useState([]); // 신고 및 편집을 위해 선택된 방 목록
  const [isModalOpen, setIsModalOpen] = useState(false); // 신고 모달 열림/닫힘 상태
  const [reportReason, setReportReason] = useState(''); // 신고 사유 상태
  const [UserId, setUserId] = useState(''); // 토큰에서 userid 추출하기

  const navigate = useNavigate();

  // 반응형 페이지 처리를 위한 useMediaQuery 사용
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });


  // 방 목록을 백엔드에서 가져오기 위한 useEffect
  useEffect(() => {
    const fetchRooms = async () => {
      const token = localStorage.getItem('authToken');
      fetch('https://fd5ca3755e85.ngrok.app/api/auth/get-username', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
            },
        method: 'GET',
      }).then((res) => {return res.json();})
      .then((data) => {
           // setUserId(data.userId); // 올바른 데이터 추출
            try {
  
                if (!token) {
                  throw new Error('로그인 토큰이 없습니다.'); // 로그인되지 않은 상태 
                }
        
                fetch(`https://rmation-chat.kro.kr/Tel/${data.userId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true',
                    },
                    method: 'GET',
                }).then((res2) => {return res2.json();})
                .then((data2) => {
                    setRooms(data2.data);
                });
        
                // 응답 데이터 상태에 저장
                
              } catch (error) {
                console.error('메시지 목록 불러오는 중 오류가 발생했습니다:', error);
              }
      });
      

      console.log(UserId);
      
    };
    fetchRooms();
  }, []);


  // 방 ID에 맞는 페이지로 이동하기
  const handleRoomClick = async (id) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      console.log(accessToken);

        // 방 입장 API 호출
        await axiosInstance.post('https://rmation-chat.kro.kr/JoinRoom', {
            headers: {
                'ngrok-skip-browser-warning': 'true', // 필요 시 유지
            },
            roomId: id,
            userId: UserId,
            userName: "익명",
        });

        // 성공 시 채팅방으로 이동
        navigate(`/chatroom/${id}`); // 여기는 단체 채팅방주소로 나중에 바꿔주자
    } catch (error) {
        console.error('방 입장 중 오류가 발생했습니다:', error);
        alert('채팅방에 입장할 수 없습니다. 다시 시도해주세요.');
    }
  };

  const toggleMenu = (id) => {
    setMenuOpenId(menuOpenId === id ? null : id);
};

  // 신고하기 버튼 클릭 시 방 신고 선택 모드로 전환
  const handleReportClick = () => {
    setIsSelectingForReport(true);
    setIsSelectingForEdit(false);
    setMenuOpenId(false);
  };

  // 편집하기 버튼 클릭 시 방 편집 선택 모드로 전환
  const handleEditClick = () => {
    setIsSelectingForEdit(true);
    setIsSelectingForReport(false);
    setMenuOpenId(false);
  };

  // 방 신고 또는 편집 모드에서 체크박스 클릭 시 선택된 방 관리
  const handleSelectRoom = (id) => {
    if (selectedRooms.includes(id)) {
      setSelectedRooms(selectedRooms.filter((roomId) => roomId !== id));
    } else {
      setSelectedRooms([...selectedRooms, id]);
    }
  };

  // 신고 모드 취소 함수
  const handleCancelReport = () => {
    setIsSelectingForReport(false); // 신고 모드 종료
    setSelectedRooms([]); // 선택된 방 초기화
  };

  // 편집 모드 취소 함수
  const handleCancelEdit = () => {
    setIsSelectingForEdit(false); // 편집 모드 종료
    setSelectedRooms([]); // 선택된 방 초기화
  };

  // 신고 버튼 클릭 시 신고 팝업 열기
  const handleOpenReportModal = () => {
    if (selectedRooms.length !== 1) {
      alert("신고할 방을 하나만 선택하세요.");
    } else {
      setReportReason('');  // 신고 모달을 열기 전에 신고 사유를 빈 문자열로 초기화
      setIsModalOpen(true);
    }
  };

  // 신고 팝업에서 신고하기 버튼 클릭 - fetch 사용 추가
  const handleSubmitReport = async () => {
    if (reportReason.trim() === '') {
      alert('신고 사유를 입력해주세요.');
      return;
    }

    const reportedRoomId = selectedRooms[0];
    const reportData = {
      roomId: reportedRoomId,
      reason: reportReason,
    };

    try {
      // fetch API 호출
      const response = await fetch('https://rmation-chat.kro.kr/Room/TelList/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        throw new Error('신고 요청이 실패했습니다.');
      }

      alert('신고가 성공적으로 접수되었습니다.');

      // 상태 초기화
      setReportReason('');
      setIsModalOpen(false);
      setSelectedRooms([]);
      setIsSelectingForReport(false);
    } catch (error) {
      console.error('신고하는 동안 오류가 발생했습니다:', error);
      alert('신고에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 신고 팝업에서 취소 버튼 클릭
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRooms([]);
    setIsSelectingForReport(false);
    setReportReason('');  // 신고 사유 초기화
  };

  // 선택된 방 삭제 함수 (백엔드 연동)
  const handleDeleteRooms = async () => {
    if (selectedRooms.length === 0) {
      alert("삭제할 방을 선택하세요.");
    } else {
      try {
        // 각 선택된 방에 대해 DELETE 요청을 보냄
        for (const roomId of selectedRooms) {
          const response = await fetch(`https://rmation-chat.kro.kr/Room/TelList/rooms/${roomId}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error(`방 ID ${roomId}을(를) 삭제하는 데 실패했습니다.`);
          }
        }

        // 상태 업데이트: 클라이언트 측에서도 방 삭제
        setRooms(rooms.filter((room) => !selectedRooms.includes(room.id)));
        setSelectedRooms([]);
        setIsSelectingForEdit(false);
        alert("선택된 방이 삭제되었습니다.");

      } catch (error) {
        console.error('방 삭제 중 오류 발생:', error);
        alert('방 삭제 중 문제가 발생했습니다.');
      }
    }
  };


  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <div className={`${styles.titleContainer} ${isDesktop ? styles.desktopTitleContainer : ''}`}>
          <img
            src={CommunicationRoom_goBack}
            className={`${styles.goBackButton} ${isDesktop ? styles.desktopGoBackButton : ''}`}
            alt="뒤로가기"
            onClick={() => navigate(-1)}  /* 뒤로 가기 동작 추가 */
          />
          <h1 className={`${styles.pageTitle} ${isDesktop ? styles.desktopPageTitle : ''}`}>
            내가 속한 방
          </h1>
        </div>

        {/* 방 목록 추가 */}
        <div className={`${styles.roomsList} ${isDesktop ? styles.desktopRoomsList : ''}`}>
          {rooms.map((room) => (
            <div
              key={room.roomId} className={`${styles.roomItem} ${isDesktop ? styles.desktopRoomItem : ''} ${room.selected ? styles.selected : ''
                }`}
            >
              <img src={room.icon} alt={`방 아이콘 ${room.roomId}`} className={styles.roomIcon} />
              <div className={`${styles.roomInfo} ${isDesktop ? styles.desktopRoomInfo : ''}`}>
                <div className={`${styles.roomTitle} ${isDesktop ? styles.desktopRoomTitle : ''}`}>{room.roomName}</div>
                <div className={styles.roomMessage}>{room.lastMessage}</div>
              </div>

              {(isSelectingForReport || isSelectingForEdit) ? (
                <input
                  type="checkbox"
                  checked={selectedRooms.includes(room.roomId)}
                  onChange={() => handleSelectRoom(room.roomId)}
                  className={styles.reportCheckbox}
                />
              ) : (
                <button
                  className={styles.joinButton}
                  onClick={() => handleRoomClick(room.roomId)}
                >
                  참여하기
                </button>
              )}
            </div>
          ))}
        </div>

        {/* 방 신고 및 취소 버튼
        {isSelectingForReport && (
          <div className={styles.reportActions}>
            <button className={`${styles.reportButton} ${isDesktop ? styles["desktopReportButton"] : ''}`} onClick={handleOpenReportModal}>
              선택된 방 신고하기
            </button>
            <button className={`${styles.cancelButton} ${isDesktop ? styles["desktopCancelButton"] : ''}`} onClick={handleCancelReport}>
              신고 모드 취소
            </button>
          </div>
        )} */}

        {/* 방 삭제 및 취소 버튼
        {isSelectingForEdit && (
          <div className={styles.reportActions}>
            <button className={`${styles.reportButton} ${isDesktop ? styles.desktopReportButton : ''}`} onClick={handleDeleteRooms}>
              선택된 방 삭제하기
            </button>
            <button className={`${styles.cancelButton} ${isDesktop ? styles.desktopCancelButton : ''}`} onClick={handleCancelEdit}>
              편집 모드 취소
            </button>
          </div>
        )} */}

        {/* 신고 모달
        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h4>신고하기</h4>
              <textarea
                className={styles.reportTextarea}
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="신고 사유를 입력하세요"
              />
              <div className={styles.modalButtons}>
                <button onClick={handleSubmitReport} className={`${styles.reportButton} ${isDesktop ? styles.desktopAnotherReportButton : ''}`}>
                  신고하기
                </button>
                <button onClick={handleCloseModal} className={`${styles.cancelButton} ${isDesktop ? styles.desktopAnotherCancelButton : ''}`}>
                  취소
                </button>
              </div>
            </div>
          </div>
        )} */}

        {/* 하단바 */}
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
  );
};

export default RoomPage;
