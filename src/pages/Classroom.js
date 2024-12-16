import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Classroom.module.css';
import Header from './_.js'; // 상단바 컴포넌트
import arrow from '../images/arrow.png';
import bar from '../images/bar.png';
import mainMascot from '../images/횃불이_빈강의.png';
import emptytime from '../images/횃불이_빈.png';

const Footer = () => {
    return (
      <footer>
        <button>취소</button>
        <button>예약 확인</button>
      </footer>
    );
};

const Classroom = () => {
    const navigate = useNavigate();
    const [selectedFloor, setSelectedFloor] = useState(1); // 선택된 층
    // 층별, 강의실별 시간 선택 상태 (5층 * 8강의실 * 10시간대)
    const [selectedTimes, setSelectedTimes] = useState(
        Array.from({ length: 5 }, () => Array.from({ length: 8 }, () => Array(10).fill(true))) // true = 사용 가능
    );
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [reservationDetails, setReservationDetails] = useState({ date: '', people: '', time: '' });

    // 층 선택 함수
    const handleFloorClick = (floor) => {
        setSelectedFloor(floor);
    };

    // 층, 강의실, 시간대 선택 토글 함수
    const toggleTimeSlot = (floorIndex, roomIndex, timeIndex) => {
        // 선택된 시간대만 반전
        setSelectedTimes(prevState => {
            const newState = prevState.map((floorTimes, fIndex) =>
                fIndex === floorIndex // 현재 층만 변경
                    ? floorTimes.map((roomTimes, rIndex) =>
                        rIndex === roomIndex
                            ? roomTimes.map((time, tIndex) => tIndex === timeIndex ? !time : time) // 해당 시간만 반전
                            : roomTimes
                    )
                    : floorTimes // 다른 층은 그대로 유지
            );
            return newState;
        });
        setIsPopupOpen(true); // 시간대 클릭 시 팝업 열기
    };

    // 예약 완료 함수
    const handleReservationSubmit = () => {
        // 예약 정보를 저장하거나 처리하는 로직 추가
        setIsPopupOpen(false); // 팝업 닫기
    };

    // 취소 버튼 클릭 시 상태 유지 (시간대 변경 안 함)
    const handleCancel = () => {
        setIsPopupOpen(false); // 팝업 닫기
    };

    return (
        <div className={styles.app}>
            <Header />
            <div className={styles.appHeader}>
                <img src={arrow} className={styles['app-arrow']} alt="back_arrow" onClick={() => navigate(-1)} />
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

                {/* 검색 바 */}
                <div className={styles.searchContainer}>
                    <input type="text" className={styles.searchInput} placeholder="Search" />
                </div>

                {/* 시간대 라벨 */}
                <div className={styles.timeLabels}>
                    {['9', '10', '11', '12', '13', '14', '15', '16', '17', '18'].map((time, index) => (
                        <div key={index} className={styles.timeLabel}>{time}</div>
                    ))}
                </div>

                {/* 빈 강의실 리스트 */}
                <div className={styles.classroomList}>
                    {[...Array(8).keys()].map(roomIndex => (
                        <div className={styles.classroomRow} key={roomIndex}>
                            <div className={styles.roomNumber}>{selectedFloor * 100 + (roomIndex + 1)}호</div>
                            <div className={styles.availability}>
                                {/* 사용 가능 시간대 렌더링 */}
                                {[...Array(10).keys()].map(timeIndex => (
                                    <div
                                        key={timeIndex}
                                        className={`${styles.timeSlot} 
                                            ${selectedTimes[selectedFloor - 1][roomIndex][timeIndex] ? styles.available : styles.unavailable}`}
                                        onClick={() => {
                                            if (selectedTimes[selectedFloor - 1][roomIndex][timeIndex]) {
                                                toggleTimeSlot(selectedFloor - 1, roomIndex, timeIndex);
                                            }
                                        }}
                                    ></div>
                                ))}
                            </div>
                            <img src={mainMascot} alt="Mascot" className={styles.mascotIcon} />
                        </div>
                    ))}
                </div>

                {/* 페이지 네비게이션 */}
                <div className={styles.pagination}>
                    {[1, 2, 3, 4, 5].map(page => (
                        <span key={page} className={styles.pageNumber}>{page}</span>
                    ))}
                </div>

                
            </div>
        </div>
    );
};

export default Classroom;