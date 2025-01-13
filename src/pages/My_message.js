import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './My_message.module.css';
import Header from './_.js'; // 상단바 컴포넌트
import arrow from '../images/arrow.png';
import bar from '../images/bar.png';
import IconScrap from '../images/횃불이스크랩.png';
import IconUnscrap from '../images/횃불이스크랩X.png';
import menuIcon from '../images/메뉴버튼.png';

// API에서 사용할 기본 URL과 헤더 설정
const BASE_URL = 'https://3e319465b029.ngrok.app/api';
const getAuthHeaders = () => {
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId'); // 이 부분이 사용자 ID를 가져옵니다.
    console.log(localStorage.getItem('userId'));

    return {
        'Authorization': `Bearer ${accessToken}`,
        'X-USER-ID': userId, // 사용자 ID를 X-USER-ID로 추가
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 1
    };
};


const My_message = () => {
    const navigate = useNavigate();
    const [visibleMessages, setVisibleMessages] = useState(8); // 처음에는 4개의 메시지만 표시
    const [messages, setMessages] = useState([]); // 메시지 목록 상태 관리 

    // 방 클릭 시 해당 채팅방으로 이동하는 함수
    const handleRoomClick = (id, type) => {
        let path = ""; // 기본 경로 변수

        // 게시글 type에 따라 경로를 설정
        switch (type) {
            case "coding":
                path = `/BoardCode/${id}`;
                break;
            case "competition":
                path = `/InformationContestBoard/${id}`;
                break;
            case "free":
                path = `/freepostingPage/${id}`;
                break;
            case "study":
                path = `/BootBoard/${id}`;
                break;
            case "quest":
                path = `/QuestionpostingPage/${id}`;
                break;
            default:
                console.error(`알 수 없는 type: ${type}`); // 예외 처리
                return;
        }

        navigate(path); // 동적으로 생성된 경로로 이동
    };

    // 백엔드에서 메시지 목록을 받아오는 함수
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`${BASE_URL}/mypage/my-comments`, {
                    method: 'GET',
                    headers: getAuthHeaders(), // getAuthHeaders를 호출하여 헤더 설정
                });

                if (response.ok) {
                    const data = await response.json();

                    // 데이터 가공
                    const reformattedData = data.map(item => ({
                        id: item.id,
                        content: item.content, // content로 매핑
                        parentCommentId: item.parentCommentId, // parentCommentId로 매핑
                        targetType: item.targetType, // targetType으로 매핑
                        targetId: item.targetId, // targetId로 매핑
                        createdAt: item.createdAt, // createdAt으로 매핑
                        updatedAt: item.updatedAt, // updatedAt으로 매핑
                        replies: item.replies, // replies로 매핑
                        anonymousId: item.anonymousId, // anonymousId로 매핑
                    }));

                    setMessages(reformattedData); // 상태에 데이터 저장
                    console.log(reformattedData); // 데이터 확인용 로그
                } else {
                    console.error('메시지 목록을 가져오는 데 실패했습니다.');
                }
            } catch (error) {
                console.error('API 호출 중 오류 발생:', error);
            }
        };

        fetchMessages();
    }, []);





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
        <div className={styles.app}>
            <Header />
            <div className={styles.appHeader}>
                <img src={arrow} className={styles['app-arrow']} alt="back_arrow" onClick={() => navigate(-1)} />
                <h1 className={styles['title-text2']}>작성 댓글</h1>
                <img src={bar} className={styles['app-bar']} alt="bar" />
            </div>
            <div className={styles.messageList}>
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
                            {/* 메시지 내용 표시 */}
                            <p className={styles.content}>{message.content}</p>
                            <span className={styles.lastMessage}>{message.lastMessage}</span>
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
    );
};

export default My_message;
