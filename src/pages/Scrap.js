import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Scrap.module.css';
import Header from './_.js'; // 상단바 컴포넌트
import arrow from '../images/arrow.png';
import bar from '../images/bar.png';
import IconScrap from '../images/횃불이스크랩.png';
import IconUnscrap from '../images/횃불이스크랩X.png';

const Scrap = () => {
    const [scrapStatus, setScrapStatus] = useState({
        1: true,
        2: false,
        3: false,
        4: true,
        5: false,
        6: false,
        7: false,
        8: false,
    }); // 각 게시물의 스크랩 상태 관리

    const toggleScrap = async (id) => {
        // 백엔드에 스크랩 상태를 업데이트하는 요청 보내기
        try {
            const response = await fetch('https://your-backend-api.com/api/scrap', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId: id,
                    scrapStatus: !scrapStatus[id], // 새로운 스크랩 상태 전송
                }),
            });

            if (!response.ok) {
                throw new Error('스크랩 상태 업데이트에 실패했습니다.');
            }

            // 서버 응답이 성공적일 경우 상태 업데이트
            setScrapStatus((prevState) => ({
                ...prevState,
                [id]: !prevState[id],
            }));

            // 성공적으로 백엔드와 통신 완료
            console.log('스크랩 상태가 성공적으로 업데이트되었습니다.');
        } catch (error) {
            console.error('스크랩 상태 업데이트 중 오류가 발생했습니다:', error);
            alert('스크랩 상태 업데이트에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState('대회정보'); // 현재 선택된 상위 탭
    const [selectedSubTab, setSelectedSubTab] = useState('부트캠프'); // 자기개발방 하위 탭

    const handlePostClick = (postId) => {
        navigate(`/post/${postId}`); // 해당 게시물 상세 페이지로 이동
    };

    const mainTabs = ['대회정보', '코드 질문방', '자기 개발방', '자유 게시판'];
    const subTabs = ['부트캠프', '스터디', '산업 연계'];

    return (
        <div className={styles.app}>
            <Header />
            <div className={styles.appHeader}>
                <img src={arrow} className={styles['app-arrow']} alt="back_arrow" onClick={() => navigate(-1)} />
                <h1 className={styles['title-text2']}>스크랩</h1>
                <img src={bar} className={styles['app-bar']} alt="bar" />
            </div>

            <div className={styles.classroomContainer}>
                {/* 상위 탭 */}
                <div className={styles.floorNav}>
                    {mainTabs.map((tab) => (
                        <span
                            key={tab}
                            className={`${styles.floor} ${selectedTab === tab ? styles.activeFloor : ''}`}
                            onClick={() => setSelectedTab(tab)}
                        >
                            {tab}
                        </span>
                    ))}
                </div>

                {/* "자기개발방" 하위 탭 */}
                {selectedTab === '자기 개발방' && (
                    <div className={styles.subTabNav}>
                        {subTabs.map((subTab) => (
                            <span
                                key={subTab}
                                className={`${styles.subTab} ${selectedSubTab === subTab ? styles.activeSubTab : ''}`}
                                onClick={() => setSelectedSubTab(subTab)}
                            >
                                {subTab}
                            </span>
                        ))}
                    </div>
                )}

                {/* 콘텐츠 영역 */}
                <div className={styles.postList}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((id) => (
                        <div key={id} className={styles.postItem}>
                            {/* HOT 표시 (상단 3개의 게시물) */}
                            {id <= 3 && <span className={styles.hotTag}>HOT</span>}
                            {/* 게시물 제목 및 정보 */}
                            <div className={styles.postInfo}>
                                <span
                                    className={styles.postTitle}
                                    onClick={() => handlePostClick(id)} // 게시물 제목 클릭 시 상세 페이지로 이동
                                >
                                    게시판 제목 {id}
                                </span>
                                <span className={styles.postDate}>2024.01.01</span>
                            </div>
                            {/* 스크랩 버튼 */}
                            <img
                                src={scrapStatus[id] ? IconScrap : IconUnscrap}
                                alt={scrapStatus[id] ? '스크랩됨' : '스크랩안됨'}
                                className={styles.scrapIcon}
                                onClick={() => toggleScrap(id)} // 스크랩 상태 변경 및 백엔드 전송
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Scrap;
