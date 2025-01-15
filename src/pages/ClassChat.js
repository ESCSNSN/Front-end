import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive'; // 반응형 페이지 만들기 위함
import Header from './_.js';  // 상단바 컴포넌트
import styles from './ClassChat.module.css';
import CommunicationRoom_goBack from '../images/왼쪽 나가기 버튼.png';
import menuIcon from '../images/메뉴버튼.png';
import Icon1 from '../images/하트이모지.png';  // 방 1의 아이콘
import Icon2 from '../images/눈이모지.png';   // 방 2의 아이콘
import Icon3 from '../images/폭죽이모지.png'; // 방 3의 아이콘
import Icon4 from '../images/내가속한방 횃불이.png';  // 하단바 아이콘들
import Icon5 from '../images/수업소통방 횃불이.png';
import Icon6 from '../images/자유소통방 횃불이.png';
/*
const roomsData = [
    { id: 1, title: '내가 속한 방 제목 1', lastMessage: '마지막 내용', icon: Icon1, selected: false },
    { id: 2, title: '내가 속한 방 제목 2', lastMessage: '마지막 내용', icon: Icon2, selected: false },
    { id: 3, title: '내가 속한 방 제목 3', lastMessage: '마지막 내용', icon: Icon3, selected: false },
];*/

const ClassChat = () => {
    const [rooms, setRooms] = useState([]); // 여기는 하드코딩 되어있는 상태
    // const [rooms, setRooms] = useState([]); // 방 목록 상태를 빈 배열로 초기화 --> 백엔드에서 가져오려면 이 코드로 
    const [menuOpen, setMenuOpen] = useState(false);  // 메뉴 열림/닫힘 상태
    const [isSelectingForReport, setIsSelectingForReport] = useState(false); // 방 신고 모드 여부
    const [isSelectingForEdit, setIsSelectingForEdit] = useState(false); // 방 편집 모드 여부
    const [selectedRooms, setSelectedRooms] = useState([]); // 신고 및 편집을 위해 선택된 방 목록
    const [isModalOpen, setIsModalOpen] = useState(false); // 신고 모달 열림/닫힘 상태
    const [reportReason, setReportReason] = useState(''); // 신고 사유 상태
    const navigate = useNavigate();

    // 반응형 페이지 처리를 위한 useMediaQuery 사용
    const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });

    {/*
   // 방 목록을 백엔드에서 가져오기 위한 useEffect
   useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://your-backend-api.com/rooms');
        if (!response.ok) {
          throw new Error('방 목록을 가져오는 데 실패했습니다.');
        }
        const data = await response.json();
        setRooms(data); // 방 목록 상태 업데이트
      } catch (error) {
        console.error('방 목록을 가져오는 중 오류 발생:', error);
        alert('방 목록을 가져오는 데 문제가 발생했습니다.');
      }
    };

    fetchRooms();
  }, []);
  */}

    // 실제 서버에서 개인 수업 정보 받아오면 됨
    /*
      useEffect(() => {
          const fetchCourses = async () => {
              try {
                  const response = await fetch('http://your-backend-api.com/user-courses');
                  if (!response.ok) {
                      throw new Error('수업 정보를 가져오는 데 실패했습니다.');
                  }
                  const data = await response.json();
  
                  // 서버에서 받은 데이터를 채팅방 형식으로 변환하여 설정
                  const roomsData = data.map((course) => ({
                      id: course.id,
                      title: course.title,
                      lastMessage: course.lastMessage || '마지막 메시지가 없습니다.',
                      icon: course.icon, // 각 수업의 아이콘 경로를 서버에서 제공하도록 설정
                      selected: false,
                  }));
  
                  setRooms(roomsData); // 수업 목록 상태 업데이트
              } catch (error) {
                  console.error('수업 정보를 가져오는 중 오류 발생:', error);
                  alert('수업 정보를 가져오는 데 문제가 발생했습니다.');
              }
          };
  
          fetchCourses(); // 수업 정보를 가져오는 함수 호출
      }, []);
  
  */
    // 임시 수업 데이터 설정
    useEffect(() => {
        const testRoomsData = [
            { id: 1, title: '컴퓨터 과학 입문', lastMessage: '안녕하세요!', icon: Icon1, selected: false },
            { id: 2, title: '웹 개발 기초', lastMessage: '수업 준비 완료.', icon: Icon2, selected: false },
            { id: 3, title: '알고리즘 심화', lastMessage: '숙제 확인하세요.', icon: Icon3, selected: false },
        ];

        setRooms(testRoomsData); // 테스트용 데이터로 rooms 상태 업데이트
    }, []);


    // 방 ID에 맞는 페이지로 이동하기
    const handleRoomClick = (id) => {
        navigate(`/classChatRoom/${id}`); // id에 맞는 채팅방 페이지로 이동
    };



    const toggleMenu = () => {
        setMenuOpen(!menuOpen);  // 메뉴 토글
    };

    // 신고하기 버튼 클릭 시 방 신고 선택 모드로 전환
    const handleReportClick = () => {
        setIsSelectingForReport(true);
        setIsSelectingForEdit(false);
        setMenuOpen(false);
    };

    // 편집하기 버튼 클릭 시 방 편집 선택 모드로 전환
    const handleEditClick = () => {
        setIsSelectingForEdit(true);
        setIsSelectingForReport(false);
        setMenuOpen(false);
    };

    const handleSendMessage = () => {
        // 메시지를 보내는 로직을 여기에 추가하세요
        console.log('메시지 전송');
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();  // Enter 키 기본 동작 방지
            handleSendMessage();
        }
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
            const response = await fetch('http://info-rmation.kro.kr/reports', {
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

    {/* 백엔드 연동하기 전 코드
  // 선택된 방 삭제 함수
  const handleDeleteRooms = () => {
    if (selectedRooms.length === 0) {
      alert("삭제할 방을 선택하세요.");
    } else {
      setRooms(rooms.filter((room) => !selectedRooms.includes(room.id)));
      setSelectedRooms([]);
      setIsSelectingForEdit(false);
      alert("선택된 방이 삭제되었습니다.");
    }
  };
  */}

    // 선택된 방 삭제 함수 (백엔드 연동)
    const handleDeleteRooms = async () => {
        if (selectedRooms.length === 0) {
            alert("삭제할 방을 선택하세요.");
        } else {
            try {
                // 각 선택된 방에 대해 DELETE 요청을 보냄
                for (const roomId of selectedRooms) {
                    const response = await fetch(`http://info-rmation.kro.kr/rooms/${roomId}`, {
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
                        onClick={() => navigate(-1)}
                    />
                    <h1 className={`${styles.pageTitle} ${isDesktop ? styles.desktopPageTitle : ''}`}>
                        수업 소통방
                    </h1>
                </div>

                <img
                    src={menuIcon}
                    className={`${styles.menuButton} ${isDesktop ? styles.desktopMenuButton : ''}`}
                    alt="메뉴"
                    onClick={() => setMenuOpen(!menuOpen)}
                />

                {/* 방 목록 추가 */}
                <div className={`${styles.roomsList} ${isDesktop ? styles.desktopRoomsList : ''}`}>
                    {rooms.map((room) => (
                        <div
                            key={room.id}
                            className={`${styles.roomItem} ${isDesktop ? styles.desktopRoomItem : ''}`}
                        >
                            <img src={room.icon} alt={`방 아이콘 ${room.id}`} className={styles.roomIcon} />
                            <div className={`${styles.roomInfo} ${isDesktop ? styles.desktopRoomInfo : ''}`}>
                                <div className={`${styles.roomTitle} ${isDesktop ? styles.desktopRoomTitle : ''}`}>{room.title}</div>
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
        </div>
    );
};

export default ClassChat;