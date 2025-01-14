import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Classroom.module.css';
import Header from './_.js'; // 상단바 컴포넌트
import arrow from '../images/arrow.png';
import bar from '../images/bar.png';
import { jwtDecode } from 'jwt-decode';


const getAuthHeaders = () => {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) throw new Error('사용자 인증 정보가 없습니다.');

  const decodedToken = jwtDecode(authToken);
  const userId = decodedToken.userId;

  return {
    'Authorization': `Bearer ${authToken}`,
    'X-USER-ID': userId,
    'ngrok-skip-browser-warning': 1
  };
};

const Classroom = () => {
    const navigate = useNavigate();
    const [selectedFloor, setSelectedFloor] = useState(1); // 선택된 층
    // availability: [층(5)] x [방(최대 100)] x [시간슬롯(20)]
    const [availability, setAvailability] = useState(
        Array.from({ length: 5 }, () => 
            Array.from({ length: 100 }, () => 
                Array(20).fill(true)
            )
        )
    );
    const [rooms, setRooms] = useState([]);

    // 층 선택 함수
    const handleFloorClick = (floor) => {
        setSelectedFloor(floor);
    };

    // 9시부터 30분 단위로 끊어서 20칸 (9:00 ~ 19:00)
    // 예) 9:00 => 인덱스 0, 9:30 => 인덱스 1, 10:00 => 인덱스 2, ...
    const timeToIndex = (time) => {
        const [hour, minute] = time.split(':').map(Number);
        const totalMinutes = hour * 60 + minute;
        // 9시(=540분) 기준으로 30분 단위
        return (totalMinutes - 540) / 30;
    };

    // roomNumber -> availability에서 사용할 인덱스 계산
    //  예) 111 -> remainder=11 -> 11-1=10
    //  예) 205 -> remainder=5  -> 5-1=4
    //  예) 100 -> remainder=0  -> 99
    const getRoomIndex = (roomNumber) => {
        const remainder = parseInt(roomNumber, 10) % 100;
        if (remainder === 0) return 99; // 100, 200, 300... 은 99 인덱스로 처리
        return remainder - 1;
    };

    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                // 인증 헤더 가져오기
                const headers = getAuthHeaders();
    
                const response = await fetch('http://info-rmation.kro.kr/api/rooms/all', {
                    method: 'GET',
                    headers: {
                        ...headers,
                        'Content-Type': 'application/json',
                    },
                });
    
                if (!response.ok) {
                    throw new Error('데이터 요청 실패');
                }
    
                const data = await response.json();
    
                // 선택된 층에 해당하는 방만 필터링
                const filteredRooms = data.filter(room => {
                    const floor = Math.floor(parseInt(room.roomNumber, 10) / 100);
                    return floor === selectedFloor;
                });
    
                // 새로운 3차원 배열을 "깊은 복사" (기존 초기값 true로 리셋)
                const newAvailability = Array.from({ length: 5 }, () => 
                    Array.from({ length: 100 }, () => 
                        Array(20).fill(true)
                    )
                );
    
                // 데이터 기반으로 newAvailability 갱신
                filteredRooms.forEach(room => {
                    room.lectureTimes.forEach(lecture => {
                        const roomIndex = getRoomIndex(room.roomNumber);
                        const startIndex = timeToIndex(lecture.startTime);
                        const endIndex = timeToIndex(lecture.endTime);
    
                        for (let i = startIndex; i < endIndex; i++) {
                            // 범위 확인
                            if (
                                selectedFloor - 1 >= 0 && 
                                selectedFloor - 1 < 5 &&
                                roomIndex >= 0 &&
                                roomIndex < 100 &&
                                i >= 0 && 
                                i < 20
                            ) {
                                newAvailability[selectedFloor - 1][roomIndex][i] = false;
                            }
                        }
                    });
                });
    
                setRooms(filteredRooms);
                setAvailability(newAvailability);
            } catch (error) {
                console.error('Error fetching room data:', error);
            }
        };
    
        fetchRoomData();
    }, [selectedFloor]); // selectedFloor 변경 시마다 재요청

    return (
        <div className={styles.app}>
            <Header />
            <div className={styles.appHeader}>
                <img 
                  src={arrow} 
                  className={styles['app-arrow']} 
                  alt="back_arrow" 
                  onClick={() => navigate(-1)} 
                />
                <h1 className={styles['title-text2']}>정보 게시판 - 빈 강의실</h1>
                <img src={bar} className={styles['app-bar']} alt="bar" />
            </div>

            <div className={styles.classroomContainer}>
                {/* 층 네비게이션 */}
                <div className={styles.floorNav}>
                    {[1, 2, 3, 4, 5].map(floor => (
                        <span
                            key={floor}
                            className={`${styles.floor} ${selectedFloor === floor ? styles.activeFloor : ''}`}
                            onClick={() => handleFloorClick(floor)}
                        >
                            {floor}층
                        </span>
                    ))}
                </div>

                {/* 시간대 라벨 (1시간 단위) */}
                <div className={styles.timeLabels}>
                    {['9', '10', '11', '12', '13', '14', '15', '16', '17', '18'].map((time, index) => (
                        <div key={index} className={styles.timeLabel}>{time}</div>
                    ))}
                </div>

                {/* 빈 강의실 리스트 */}
                <div className={styles.classroomList}>
                    {rooms.map(room => {
                        const roomIndex = getRoomIndex(room.roomNumber);
                        return (
                            <div className={styles.classroomRow} key={room.roomNumber}>
                                <div className={styles.roomNumber}>
                                    {room.roomNumber}호
                                </div>
                                <div className={styles.availability}>
                                    {/* 30분 단위 20칸 렌더링 */}
                                    {[...Array(20).keys()].map(timeIndex => {
                                        const isAvailable = availability[selectedFloor - 1][roomIndex][timeIndex];
                                        return (
                                            <div
                                                key={timeIndex}
                                                className={
                                                    `${styles.timeSlot} ${isAvailable ? styles.available : styles.unavailable}`
                                                }
                                            ></div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Classroom;
