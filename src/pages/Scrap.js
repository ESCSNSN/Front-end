import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Scrap.module.css';
import Header from './_.js'; // 상단바 컴포넌트
import arrow from '../images/arrow.png';
import bar from '../images/bar.png';
import IconScrap from '../images/횃불이스크랩.png';
import IconUnscrap from '../images/횃불이스크랩X.png';


// API에서 사용할 기본 URL과 헤더 설정
const BASE_URL = 'http://info-rmation.kro.kr/api/board';
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

const Scrap = () => {
    const [posts, setPosts] = useState([]); // 게시물 데이터를 관리
    const [loading, setLoading] = useState(false); // 로딩 상태 관리
    const [error, setError] = useState(null); // 에러 메시지 관리
    const navigate = useNavigate();
    const [topLikedPosts, setTopLikedPosts] = useState([]); // 좋아요 10개 이상 게시물
    const [scrapStatus, setScrapStatus] = useState({}); // 각 게시물의 스크랩 상태 관리
    const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
    const [page, setPage] = useState(0); // 현재 페이지 번호



    const [selectedTab, setSelectedTab] = useState('대회정보'); // 현재 선택된 상위 탭
    const [selectedSubTab, setSelectedSubTab] = useState('부트캠프'); // 자기개발방 하위 탭

    // 게시물 데이터 가져오기
    const fetchPosts = async (tab, subTab, options = {}) => {
        let endpoint = '/scraps/competition';

        // Main tab별 엔드포인트 처리
        if (tab === '대회정보') {
            endpoint = '/scraps/competition';
        } else if (tab === '코드 질문방') {
            endpoint = '/scraps/coding';
        } else if (tab === '자유 게시판') {
            endpoint = '/scraps/free';
        } else if (tab === '자기 개발방') {
            const studyIDMap = {
                '부트캠프': 'bootcamp',
                '스터디': 'study',
                '산업 연계': 'industry',
            };
            const studyId = studyIDMap[subTab];

            if (studyId) {
                endpoint = `/scraps/study`;
                options.studyId = studyId; // options 객체에 studyId 추가
            } else {
                console.error('잘못된 자기개발방 하위 탭입니다.');
                return;
            }
        }

        // Optional query parameters 처리
        const params = new URLSearchParams(options); // options에 포함된 모든 키-값 쌍 추가

        const finalUrl = `${BASE_URL}${endpoint}${params.toString() ? `?${params.toString()}` : ''}`;

        try {
            const response = await fetch(finalUrl, {
                method: 'GET',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error('API 요청 실패');
            }

            const result = await response.json();

            console.log('API 응답:', result);


            // 데이터 처리
            if ((result.studies && result.studies.length > 0) || (result.data && result.data.length > 0)) {
                const posts = result.studies || result.data; // studies 또는 data 중 존재하는 것을 사용
                setPosts(posts); // 게시글 상태 업데이트
                setScrapStatus(
                    posts.reduce(
                        (status, item) => ({ ...status, [item.id]: item.scrap || item.scrapped }),
                        {}
                    )
                ); // 스크랩 상태 초기화
                console.log("posts:", posts);
            } else {
                console.warn('데이터를 찾을 수 없습니다.');
                setPosts([]); // 게시글 상태 초기화
            }

        } catch (error) {
            console.error('API 요청 에러:', error);
            setError(error.message);
        } finally {
            setLoading(false); // 로딩 상태 해제
        }
    };



    // 초기 데이터 가져오기
    useEffect(() => {
        setLoading(true); // 로딩 상태 활성화
        if (selectedTab === '자기 개발방') {
            fetchPosts(selectedTab, selectedSubTab);
        } else {
            fetchPosts(selectedTab);
        }
    }, [selectedTab, selectedSubTab]);

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
    };

    const handleSubTabChange = (subTab) => {
        setSelectedSubTab(subTab);
    };

    const handlePostClick = (postId) => {
        let url = `/post/${postId}`; // 기본 경로

        if (selectedTab === '대회정보') {
            url = `/InformationContestBoard/${postId}`;
        } else if (selectedTab === '코드 질문방') {
            url = `/BoardCode/${postId}`;
        } else if (selectedTab === '자기 개발방') {
            if (selectedSubTab === '부트캠프') {
                url = `/Bootboard/${postId}`;
            } else if (selectedSubTab === '스터디') {
                url = `/StudyBoard/${postId}`;
            } else if (selectedSubTab === '산업 연계') {
                url = `/IndustryBoard/${postId}`;
            }
        } else if (selectedTab === '자유 게시판') {
            url = `/freepostingPage/${postId}`;
        }

        navigate(url);
    };

    const toggleScrap = async (id, scrapped) => {
        try {
            const endpoint = `/scraps/${selectedTab}/${id}`;
            const finalUrl = `${BASE_URL}${endpoint}`;

            const response = await fetch(finalUrl, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify({ scrapped: !scrapped }),
            });

            if (!response.ok) {
                throw new Error('스크랩 상태를 업데이트하는 데 실패했습니다.');
            }

            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === id ? { ...post, scrapped: !scrapped } : post
                )
            );
        } catch (err) {
            console.error(err.message);
            alert('스크랩 상태 업데이트에 실패했습니다. 다시 시도해주세요.');
        }
    };

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>오류 발생: {error}</div>;
    }

    const mainTabs = ['대회정보', '코드 질문방', '자기 개발방', '자유 게시판'];
    const subTabs = ['부트캠프', '스터디', '산업 연계'];

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
                <h1 className={styles['title-text2']}>스크랩</h1>
                <img src={bar} className={styles['app-bar']} alt="bar" />
            </div>

            <div className={styles.classroomContainer}>
                {/* 상위 탭 */}
                <div className={styles.floorNav}>
                    {mainTabs.map((tab) => (
                        <span
                            key={tab}
                            className={`${styles.floor} ${selectedTab === tab ? styles.activeFloor : ''
                                }`}
                            onClick={() => handleTabChange(tab)}
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
                                className={`${styles.subTab} ${selectedSubTab === subTab ? styles.activeSubTab : ''
                                    }`}
                                onClick={() => handleSubTabChange(subTab)}
                            >
                                {subTab}
                            </span>
                        ))}
                    </div>
                )}

                {/* 게시물 목록 */}
                <div className={styles.postList}>
                    {posts.map((post) => (
                        <div key={post.id} className={styles.postItem}>
                            {/* HOT 표시 (좋아요 10개 이상 게시물) */}
                            {topLikedPosts.includes(post.id) && (
                                <span className={styles.hotTag}>HOT</span>
                            )}

                            {/* 게시물 제목 및 정보 */}
                            <div className={styles.postInfo}>
                                <span
                                    className={styles.postTitle}
                                    onClick={() => handlePostClick(post.id)} // 게시물 제목 클릭 시 상세 페이지로 이동
                                >
                                    {post.questTitle || '제목 없음'} {/* 제목 없을 경우 기본값 */}
                                </span>
                                <span className={styles.postDate}>
                                    {post.questCreatedTime
                                        ? new Date(post.questCreatedTime).toLocaleDateString() // 작성 날짜 표시
                                        : '날짜 없음'}
                                </span>
                            </div>

                            {/* 스크랩 버튼 */}
                            <img
                                src={scrapStatus[post.id] ? IconScrap : IconUnscrap}
                                alt={scrapStatus[post.id] ? '스크랩됨' : '스크랩안됨'}
                                className={styles.scrapIcon}
                                onClick={() => toggleScrap(post.id)} // 스크랩 상태 변경
                            />
                        </div>
                    ))}
                </div>

                {/* 페이지네이션 */}
                <div className={styles.pagination}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (pageNumber) => (
                            <button
                                key={pageNumber}
                                className={`${styles.pageButton} ${page === pageNumber - 1
                                        ? styles.activePageButton
                                        : ''
                                    }`} // 현재 페이지 강조
                                onClick={() => setPage(pageNumber - 1)} // 페이지 번호 업데이트
                            >
                                {pageNumber}
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    );

};

export default Scrap;
