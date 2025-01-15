import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive'; // 반응형 페이지 만들기 위함
import Header from './_.js';  // 상단바 컴포넌트
import axiosInstance from '../utils/api'; // Axios 인스턴스
import { jwtDecode } from 'jwt-decode'; // default가 아닌 named import 사용. authToken에서 사용자 ID 추출하기. npm install jwt-decode
import styles from './Message.module.css';
import menuIcon from '../images/메뉴버튼.png';
import CommunicationRoom_goBack from '../images/왼쪽 나가기 버튼.png';

const Message = () => {

    const [messages, setMessages] = useState([]); // 메시지 목록 상태 관리
    const [visibleMessages, setVisibleMessages] = useState(4); // 처음에는 4개의 메시지만 표시
    const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });
    const navigate = useNavigate();
    const [UserId, setUserId] = useState(); // 토큰에서 userid 추출하기

    useEffect(() => {
        const fetchMessages = async () => {
            const userResponse = await axiosInstance.get('https://info-rmation.kro.kr/api/auth/get-username');
                setUserId(userResponse.data.userId); // 올바른 데이터 추출

                console.log(UserId);
                
            try {
                // 로컬 스토리지에서 JWT 토큰 가져오기
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('로그인 토큰이 없습니다.'); // 로그인되지 않은 상태
                }

                // 백엔드 API 호출
                const response = await axiosInstance.get(`http://info-rmation.kro.kr/Room/TelList`, {

                    headers: {
                        'ngrok-skip-browser-warning': 'true', // 필요 시 유지
                    },
                });
                if (response.data.code !== 200) {
                    throw new Error('메시지 목록을 불러오는데 실패했습니다.');
                }
                console.log(response);

                // 응답 데이터 상태에 저장
                setMessages(response.data.data);
            } catch (error) {
                console.error('메시지 목록 불러오는 중 오류가 발생했습니다:', error);
            }
        };

        fetchMessages();
    }, []);


    // 방 클릭 시 해당 채팅방으로 이동하는 함수
    const handleRoomClick = async (id) => {
        try {
            // 사용자 정보 가져오기 (JWT 토큰에서 디코딩하거나 상태에서 가져오기)
            const token = localStorage.getItem('authToken');
            const decodedToken = jwtDecode(token); // JWT 디코딩
            const userId = UserId;
            const userName = '신상윤';

            // 방 입장 API 호출
            await axiosInstance.post('http://info-rmation.kro.kr/JoinRoom', {
                headers: {
                    'ngrok-skip-browser-warning': 'true', // 필요 시 유지
                },
                roomId: id,
                userId: userId,
                userName: userName,
            });

            // 성공 시 채팅방으로 이동
            navigate(`/chatroom/${id}`);
        } catch (error) {
            console.error('방 입장 중 오류가 발생했습니다:', error);
            alert('채팅방에 입장할 수 없습니다. 다시 시도해주세요.');
        }
    };



    // 더보기 버튼 클릭 시 화면에 보이는 메시지 수를 증가시키는 함수
    const handleLoadMore = async () => {
        try {
            const nextPage = Math.ceil(visibleMessages / 4); // 현재 페이지 계산
            const token = localStorage.getItem('authToken'); // JWT 토큰 가져오기
            const decodedToken = jwtDecode(token); // JWT 디코딩
            const userId = decodedToken.userId;

            // 백엔드에서 다음 페이지 메시지 요청
            const response = await axiosInstance.get(`http://info-rmation.kro.kr/Room/userId/${userId}`, {
                params: { page: nextPage, size: 4 }, // 다음 페이지와 크기 설정
                headers: {
                    'ngrok-skip-browser-warning': 'true', // 필요 시 유지
                },
            });

            if (response.data.code !== 200) {
                throw new Error('메시지를 불러오는 데 실패했습니다.');
            }

            // 기존 메시지에 새로운 데이터 추가
            setMessages((prevMessages) => [...prevMessages, ...response.data.data]);

            // 화면에 표시되는 메시지 수 증가
            setVisibleMessages((prevVisibleMessages) => prevVisibleMessages + 4);
        } catch (error) {
            console.error('메시지를 더 불러오는 중 오류가 발생했습니다:', error);
            alert('메시지를 불러오는 데 실패했습니다.');
        }
    };


    // 메뉴 버튼 클릭 시 삭제 메뉴 표시
    const [menuOpenId, setMenuOpenId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedMessageId, setSelectedMessageId] = useState(null);

    const toggleMenu = (id) => {
        setMenuOpenId(menuOpenId === id ? null : id);
    };

    // 삭제 확인 모달 열기
    const handleDeleteClick = (id, event) => {
        event.stopPropagation(); // 삭제하기 버튼 클릭 시 이벤트 전파 방지
        setSelectedMessageId(id);
        setShowDeleteModal(true);
    };

    // 삭제 확인 모달에서 삭제 버튼 클릭 시
    const handleConfirmDelete = async () => {
        try {
            // 백엔드로 메시지 삭제 요청
            await axiosInstance.delete(`https://info-rmation.kro.kr/Room/message/${selectedMessageId}`,{
                headers: {
                    'ngrok-skip-browser-warning': 'true', // 필요 시 유지
                },
            }); // API 호출

            // 로컬 상태에서 삭제된 메시지 제거
            setMessages((prevMessages) =>
                prevMessages.filter((message) => message.id !== selectedMessageId)
            );

            setShowDeleteModal(false); // 모달 닫기
            setSelectedMessageId(null); // 선택된 메시지 ID 초기화
        } catch (error) {
            console.error('메시지를 삭제하는 중 오류가 발생했습니다:', error);
            alert('메시지를 삭제할 수 없습니다. 다시 시도해주세요.');
        }
    };

    // 삭제 확인 모달에서 취소 버튼 클릭 시
    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedMessageId(null);
    };

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.content}>
                <h2 className={styles.sectionTitle}>쪽지</h2>
                <div className={styles.messageList}>
                    {messages.slice(0, visibleMessages).map((message) => (
                        <div
                            key={message.id}
                            className={styles.messageItem}
                            onClick={() => handleRoomClick(message.roomId)} // 방 클릭 시 이동하도록 수정
                        >
                            <div className={styles.messageInfo}>
                                <div className={styles.headerInfo}>
                                    <span className={styles.nickname}>{message.userName}</span>
                                    <span className={styles.title}>{message.roomName}</span>
                                </div>
                                <span className={styles.lastMessage}>{message.lastMessage}</span>
                            </div>
                            <img
                                src={menuIcon}
                                className={styles.menuIcon}
                                alt="메뉴"
                                onClick={(e) => {
                                    e.stopPropagation(); // 메뉴 클릭 시 방 클릭 이벤트 무시
                                    toggleMenu(message.roomId);
                                }}
                            />
                            {menuOpenId === message.roomId && (
                                <div className={styles.dropdownMenu}>
                                    <button
                                        className={styles.deleteButton}
                                        onClick={(e) => handleDeleteClick(message.roomId, e)} // 삭제하기 클릭 시 이벤트 전파 방지
                                    >
                                        삭제하기
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {visibleMessages < messages.length && (
                    <button className={styles.loadMoreButton} onClick={handleLoadMore}>
                        더보기
                    </button>
                )}

                {/* 삭제 확인 모달 */}
                {showDeleteModal && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <p>삭제하시겠습니까?</p>
                            <div className={styles.modalButtons}>
                                <button className={styles.cancelButton} onClick={handleCancelDelete}>
                                    취소
                                </button>
                                <button className={styles.deleteConfirmButton} onClick={handleConfirmDelete}>
                                    삭제
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Message;