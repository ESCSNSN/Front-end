import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive'; // 반응형 페이지 만들기 위함
import Header from './_.js';  // 상단바 컴포넌트
import styles from './AlarmPage.module.css';
import menuIcon from '../images/메뉴버튼.png';
import bar from '../images/bar.png';
import CommunicationRoom_goBack from '../images/왼쪽 나가기 버튼.png';

const AlarmPage = () => {

    const [messages, setMessages] = useState([]); // 메시지 목록 상태 관리 
    
    const [visibleMessages, setVisibleMessages] = useState(5); // 처음에는 4개의 메시지만 표시
    const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });
    const navigate = useNavigate();
    useEffect(() => {
        const fetchNoti = async () => {
            const userId = 200204263//localStorage.getItem('authToken'); // 로그인 url 고치고 나면 authToken 받아오는 코드로
            console.log(userId);
            fetch(`https://rmation-chat.kro.kr/notification/${userId}`, {
                method : 'get'
            }).then((res) => {
                return res.json();
            }).then((data) => {
                console.log(data);
                setMessages(data.data);
            })
        }
        fetchNoti();
    }, []);


    // 방 클릭 시 해당 채팅방으로 이동하는 함수
    const handleRoomClick = (id) => {
        navigate(`/chatroom/${id}`); // 방 ID를 기반으로 동적 경로로 이동
    };

    // 더보기 버튼 클릭 시 화면에 보이는 메시지 수를 증가시키는 함수
    const handleLoadMore = () => {
        setVisibleMessages((prevVisibleMessages) => prevVisibleMessages + 4);
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
       
        fetch(`https://rmation-chat.kro.kr/notification/${id}`,{
            method : 'delete'
        }).then((res) => {
            return res.json();
        }).then((data) => {
            
        });
        event.stopPropagation(); // 삭제하기 버튼 클릭 시 이벤트 전파 방지
        setSelectedMessageId(id);
        setShowDeleteModal(true);
    };

    // 삭제 확인 모달에서 삭제 버튼 클릭 시
    const handleConfirmDelete = () => {
       
        setMessages((prevMessages) => prevMessages.filter((message) => message.id !== selectedMessageId));
        setShowDeleteModal(false);
        setSelectedMessageId(null);
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
                <div className={`${styles.titleContainer} ${isDesktop ? styles.desktopTitleContainer : ''}`}>
                    <img
                        src={CommunicationRoom_goBack}
                        className={`${styles.goBackButton} ${isDesktop ? styles["desktopGoBackButton"]: ''}`}
                        alt="뒤로가기"
                        onClick={() => navigate(-1)}  /* 뒤로 가기 동작 추가 */
                    />
                    <h1 className={styles["title-text2"]}>알림</h1>
                    <img src={bar} className={styles["app-bar"]} alt="bar" />

                </div>

                <div className={`${styles.messageList} ${isDesktop ? styles.desktopmessageList : ''}`}>
                    {messages.slice(0, visibleMessages).map((message) => (
                        <div
                            key={message.id}
                            className={styles.messageItem}
                            onClick={() => handleRoomClick(message.id)} // 방 클릭 시 이동하도록 수정
                        >
                            <div className={styles.messageInfo}>
                                <div className={styles.headerInfo}>
                                    <span className={styles.nickname}>{message.username}</span>
                                    <span className={styles.title}>{message.title}</span>
                                </div>
                                <span className={styles.lastMessage}>{message.content}</span>
                            </div>
                            <img
                                src={menuIcon}
                                className={styles.menuIcon}
                                alt="메뉴"
                                onClick={(e) => {
                                    e.stopPropagation(); // 메뉴 클릭 시 방 클릭 이벤트 무시
                                    toggleMenu(message.id);
                                }}
                            />
                            {menuOpenId === message.id && (
                                <div className={styles.dropdownMenu}>
                                    <button
                                        className={styles.deleteButton}
                                        onClick={(e) => handleDeleteClick(message.id, e)} // 삭제하기 클릭 시 이벤트 전파 방지
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

export default AlarmPage;

