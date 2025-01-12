import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './RoomChat.module.css';
import CommunicationRoom_goBack from '../images/chatback.png';
import sendIcon from '../images/메시지전송버튼.png';
import heartIcon from '../images/하트횃불이.png';

import main_mascot from '../images/대학 심볼 횃불이.png';
import main_bell from '../images/bell.png';
import main_message from '../images/message.png';
import main_my from '../images/my.png';

import Header from './_2.js'; // 상단바 컴포넌트
import { useMediaQuery } from 'react-responsive'; // 반응형 페이지 만들기 위함
import axios from 'axios'; // API 요청을 위한 axios

const RoomChat = () => {
    const websocketRef = useRef(null); // 웹소켓 참조
    const reconnectIntervalRef = useRef(null); // 재연결 타이머
    const { classId } = useParams();
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [userCount, setUserCount] = useState(0); // 채팅방 인원 수
    const [users, setUsers] = useState([]); // 채팅방 사용자 목록
    const messageListRef = useRef(null);
    const [room, setRoom] = useState([]); // 채팅방 정보
    //const token = localStorage.getItem('token'); // 로컬 스토리지에서 JWT 토큰 가져오기
    const token = 'abc';
    const roomId = '91f3411b-1433-4fdd-b3ac-c0a594b5f407'; // 채팅방 ID는 classId로 설정
    const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });
    const baseUrl = 'https://rmation-chat.kro.kr'; // 백엔드 서버 URL
    // 웹소켓 초기화 함수
    const initializeWebSocket = () => {
        if (!token) {
            console.error('인증되지 않은 사용자입니다. 토큰이 없습니다.');
            return;
        }

        const socketUrl = `ws://${baseUrl}/ws/chat/${roomId}`; // WebSocket 서버 URL
        websocketRef.current = new WebSocket(socketUrl, [], { 
            headers: { Authorization: `Bearer ${token}` }  // JWT 토큰을 헤더에 추가
        });

        websocketRef.current.onopen = () => {
            console.log('WebSocket 연결 수립');
            if (reconnectIntervalRef.current) {
                clearInterval(reconnectIntervalRef.current); // 재연결 타이머 정리
            }
        };

        websocketRef.current.onmessage = (event) => {
            try {
                const receivedData = JSON.parse(event.data);

                // 사용자 수 업데이트 메시지 처리
                if (receivedData.type === 'userCount') {
                    setUserCount(receivedData.count);
                } else if (receivedData.type === 'message') {
                    setMessages((prevMessages) => [...prevMessages, receivedData]);
                }
            } catch (error) {
                console.error('메시지 파싱 실패:', error);
            }
        };

        websocketRef.current.onclose = () => {
            console.error('WebSocket 연결 끊김. 재연결 시도');
            attemptReconnect(); // 재연결
        };

        websocketRef.current.onerror = (error) => {
            console.error('WebSocket 오류:', error);
            websocketRef.current.close(); // 오류 발생 시 연결 종료
        };
    };

    // 웹소켓 재연결 시도
    const attemptReconnect = () => {
        if (!reconnectIntervalRef.current) {
            reconnectIntervalRef.current = setInterval(() => {
                console.log('WebSocket 재연결 시도 중...');
                initializeWebSocket();
            }, 5000); // 5초마다 재연결
        }
    };

    // 메시지 전송 함수
    const sendMessage = () => {
        if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
            const message = {
                sender: 'me',
                text: inputMessage,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            websocketRef.current.send(JSON.stringify(message)); // 서버에 메시지 전송
            setMessages((prevMessages) => [...prevMessages, message]); // 클라이언트 메시지 상태 업데이트
            setInputMessage(''); // 입력창 초기화
        } else {
            console.error('WebSocket 연결 상태가 아닙니다.');
        }
    };

    // 채팅방 입장 API 호출
    const joinRoom = async () => {
        try {
            const response = await axios.post(`${baseUrl}/JoinRoom`, {
                roomId: roomId,
                userName: '김수빈', // 예시로 고정된 이름, 실제 사용자 이름을 사용
                userId: '202301641', // 예시로 고정된 사용자 ID, 실제 사용자 ID를 사용
            }, {
                headers: {
                    "ngrok-skip-browser-warning": "abc",
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.code === 200) {
                console.log('채팅방 입장 성공');
            }
        } catch (error) {
            console.error('채팅방 입장 실패:', error);
        }
    };

    // 채팅방 정보 및 사용자 목록 조회
    const fetchRoomInfo = async () => {
        try {
            fetch(`${baseUrl}/Room/${roomId}`, {
                headers: { Authorization: `Bearer ${token}`,"ngrok-skip-browser-warning": "abc" },
                method: 'GET'
            }).then((res)=> {
                console.log(res);
                return res.json()})
            .then((data) => {
                console.log(data);
                setRoom(data.data);
                setUserCount(data.data.userCount);

            });
            fetch(`${baseUrl}/GetChatData/${roomId}`, {
                headers: { Authorization: `Bearer ${token}`,"ngrok-skip-browser-warning": "abc" },
                method: 'GET'
            }).then((res)=> {return res.json()})
            .then((data) => {
                console.log(data);
                setMessages(data.data.data);
            });
        } catch (error) {
            console.error('채팅방 정보 또는 사용자 목록 조회 실패:', error);
        }
    };

    useEffect(() => {
        //initializeWebSocket(); // 웹소켓 초기화

        fetchRoomInfo(); // 채팅방 정보 및 사용자 목록 조회
      //  joinRoom(); // 채팅방 입장


        return () => {
            if (websocketRef.current) {
                websocketRef.current.close(); // 컴포넌트 언마운트 시 연결 종료
            }
            if (reconnectIntervalRef.current) {
                clearInterval(reconnectIntervalRef.current); // 재연결 타이머 정리
            }
        };
    }, []);

    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [messages.length]);

    const handleSendMessage = () => {
        if (inputMessage.trim()) {
            sendMessage();
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className={styles.container}>
          <Header />

            <div className={styles.content}>
                <div className={`${styles.headerRow} ${isDesktop ? styles.desktopHeaderRow : styles.mobileHeaderRow}`}>
                    <img
                        src={CommunicationRoom_goBack}
                        alt="뒤로가기"
                        className={`${styles.goBackButton} ${isDesktop ? styles.desktopGoBackButton : styles.mobileGoBackButton}`}
                        onClick={() => navigate(-1)}
                    />
                    <h2 className={`${styles.sectionTitle} ${isDesktop ? styles.desktopSectionTitle : styles.mobileSectionTitle}`}>{room.roomName}</h2>
                </div>

                <div className={`${styles.classInfo} ${isDesktop ? styles.desktopClassInfo : styles.mobileClassInfo}`}>
                    <span></span>
                    <span>인원 : {userCount}</span>
                </div>

                <div className={styles.messageList} ref={messageListRef}>
                    {messages.map((msg, index) => (
                        <div key={index} className={msg.userId === '202301641' ? styles.sentMessage : styles.receivedMessage}>
                            <span className={styles.messageText}>{msg.message}</span>
                            <span className={styles.messageTime}>{msg.time.split('T')[1].slice(0, 5)}</span>
                        </div>
                    ))}
                </div>

                {/* 채팅 입력창*/}
                <div className={styles.inputContainer}>
                    <img src={heartIcon} alt="Icon" className={styles.heartIcon} />
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyDown} // 엔터키로 메시지 전송
                        placeholder="입력하세요..."
                        className={styles.inputField}
                    />
                    <button className={styles.sendButton} onClick={handleSendMessage}>
                        <img src={sendIcon} alt="전송" className={styles.sendIcon} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomChat;
