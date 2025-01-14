import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ChatRoom.module.css';
import Header from './_.js'; // 상단바 컴포넌트
import axiosInstance from '../utils/api'; // Axios 인스턴스
import { Client } from '@stomp/stompjs'; // STOMP 클라이언트 라이브러리 // npm install @stomp/stompjs
import {jwtDecode} from 'jwt-decode';
import CommunicationRoom_goBack from '../images/왼쪽 나가기 버튼.png';
import sendIcon from '../images/메시지전송버튼.png'; // 메시지 전송 아이콘 이미지
import heartIcon from '../images/하트횃불이.png';

const ChatRoom = () => {
    const { id } = useParams(); // URL에서 동적 방 ID를 가져옵니다.
    const navigate = useNavigate(); // 뒤로가기 버튼 동작을 위해 사용
    const [roomData, setRoomData] = useState(null); // 채팅방 정보 상태
    const [messages, setMessages] = useState([]); // 채팅 메시지 목록 상태 관리
    const [inputMessage, setInputMessage] = useState(''); // 입력한 메시지 상태 관리
    const messageListRef = useRef(null); // 스크롤을 제어하기 위한 참조
    const stompClientRef = useRef(null); // STOMP 클라이언트 참조
    const [usId, setUsId] = useState("");

    useEffect(() => {
        const fetchRoomData = async () => {
            const userResponse = await axiosInstance.get('http://info-rmation.kro.kr/api/auth/get-username');
                
                setUsId(userResponse.data.userId);
                console.log(usId);

            try {
                const response = await axiosInstance.get(`https://934ef54da7b8.ngrok.app/Room/${id}`,{
                    headers: {
                        'ngrok-skip-browser-warning': 'true', // 필요 시 유지
                    },
                });
                if (response.data.code !== 200) {
                    throw new Error('채팅방 정보를 불러오는데 실패했습니다.');
                }
                setRoomData(response.data.data);
            } catch (error) {
                console.error('채팅방 정보를 불러오는 중 오류가 발생했습니다:', error);
            }
        };
        
        const fetchChatData = async () => {
            try {
                // 백엔드 API 호출
                const response = await axiosInstance.get(`https://934ef54da7b8.ngrok.app/GetChatData/${id}`, {
                    headers: {
                        'ngrok-skip-browser-warning': 'true', // 필요 시 유지
                    },
                });
        
                // 응답 상태 확인
                if (response.data.code !== 200) {
                    throw new Error('채팅방 대화 내용을 불러오는데 실패했습니다.');
                }
        
                // 메시지 데이터를 상태에 저장
                setMessages(response.data.data.data); // 백엔드에서 가져온 메시지 데이터를 저장
                console.log('채팅 내역:', response.data.data);
            } catch (error) {
                console.error('채팅 내역 불러오는 중 오류 발생:', error);
            }
        };

        fetchRoomData();
        fetchChatData();

        // STOMP 클라이언트 설정
        const stompClient = new Client({
            brokerURL: 'ws://192.168.156.161:8080/ws-stomp', // WebSocket 서버 URL
            reconnectDelay: 5000, // 재연결 딜레이
            heartbeatIncoming: 4000, // 서버로부터 heartbeat 수신 간격
            heartbeatOutgoing: 4000, // 서버로 heartbeat 전송 간격
        });

        stompClient.onConnect = () => {
            console.log('STOMP 연결 성공');

            // 메시지 구독
            stompClient.subscribe(`/sub/message/${id}`, (message) => {
                const messageData = JSON.parse(message.body);
                setMessages((prevMessages) => [...prevMessages, messageData]);
            });
        };

        stompClient.onStompError = (frame) => {
            console.error('STOMP 오류:', frame.headers['message']);
        };

        stompClient.activate();
        stompClientRef.current = stompClient;

        return () => {
            if (stompClient) {
              stompClient.deactivate();
            }
          };
    }, [id]);
    

    useEffect(() => {
        // 새로운 메시지가 추가되면 스크롤을 가장 하단으로 이동
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [messages]);

    // 메시지 전송 핸들러
    const handleSendMessage = () => {
        if (inputMessage.trim() !== '') {
            const token = localStorage.getItem('authToken'); // JWT 토큰 가져오기
            const decodedToken = jwtDecode(token); // JWT 디코딩

            const messageData = {
                roomId: id,
                message: inputMessage,
                userId: usId, // 사용자 ID
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            // STOMP 클라이언트를 통해 메시지 전송
            if (stompClientRef.current && stompClientRef.current.connected) {
                stompClientRef.current.publish({
                    destination: `/pub/messages/${id}`,
                    body: JSON.stringify(messageData),
                });

                setInputMessage('');
            } else {
                console.error('STOMP 클라이언트 연결이 닫혀 있습니다.');
            }
        }
    };

    // 엔터키로 메시지 전송하는 핸들러
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    if (!roomData) {
        return <div>Loading...</div>; // 데이터가 없을 때 로딩 상태 표시
    }

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.content}>
                <h2 className={styles.sectionTitle}>쪽지</h2>
                <div className={styles.headerRow}>
                    {/* 왼쪽 나가기 버튼 */}
                    <img
                        src={CommunicationRoom_goBack}
                        className={styles.goBackButton}
                        alt="뒤로가기"
                        onClick={() => navigate(-1)}
                    />
                    {/* 사용자 이름 및 글 제목 */}
                    <div className={styles.roomHeaderInfo}>
                        <span className={styles.roomUsername}>{roomData.userName}</span>
                        <span className={styles.separator}>|</span>
                        <span className={styles.roomTitle}>{roomData.roomName}</span>
                    </div>
                </div>

                {/* 기존 메시지 스타일 유지 */}
                <div className={styles.messageList} ref={messageListRef}>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`${message.userId == usId ? styles.sentMessage: styles.receivedMessage}`}
                        >
                            <span className={styles.messageText}>{message.message}</span>
                            <span className={styles.messageTime}>{message.time}</span>
                        </div>
                    ))}
                </div>

                {/* 채팅 입력창 - 화면 하단 고정 */}
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

export default ChatRoom;