import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './My_message.module.css';
import Header from './_.js'; // 상단바 컴포넌트
import arrow from '../images/arrow.png';
import bar from '../images/bar.png';
import IconScrap from '../images/횃불이스크랩.png';
import IconUnscrap from '../images/횃불이스크랩X.png';
import menuIcon from '../images/메뉴버튼.png';

const My_message = () => {
    const navigate = useNavigate();
    // const [messages, setMessages] = useState([]); // 메시지 목록 상태 관리 
    const [visibleMessages, setVisibleMessages] = useState(4); // 처음에는 4개의 메시지만 표시
    // 방 클릭 시 해당 채팅방으로 이동하는 함수
    const handleRoomClick = (id) => {
        navigate(`/chatroom/${id}`); // 방 ID를 기반으로 동적 경로로 이동
    };
    
    // 하드코딩된 방 목록 (백엔드 연동 시 주석 처리)
    const [messages, setMessages] = useState([
        { id: 1, username: 'char1', title: '글 제목 1', lastMessage: '마지막 내용 1' },
        { id: 2, username: 'char4', title: '글 제목 2', lastMessage: '마지막 내용 2' },
        { id: 3, username: 'float2', title: '글 제목 3', lastMessage: '마지막 내용 3' },
        { id: 4, username: 'int2', title: '글 제목 4', lastMessage: '마지막 내용 4' },
        { id: 5, username: 'char3', title: '글 제목 5', lastMessage: '마지막 내용 5' },
    ]); // 하드코딩된 메시지 목록
    

    

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
