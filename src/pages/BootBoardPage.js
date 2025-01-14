import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive'; // 반응형 페이지 만들기 위함
import axiosInstance from '../utils/api';
import Header from './_.js';  // 상단바 컴포넌트
import styles from './BootBoardPage.module.css';  // BoardPage용 CSS 파일
import CommunicationRoom_goBack from '../images/arrow.png';
import DownMenu from '../images/아래방향메뉴선택.png';
import SearchIcon from '../images/돋보기아이콘.png';  // 돋보기 아이콘
import IconScrap from '../images/횃불이스크랩.png';
import IconUnscrap from '../images/횃불이스크랩X.png';

const BootBoardPage = () => {
    const [menuOpen, setMenuOpen] = useState(false);  // 드롭다운 상태 관리
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 관리
    const [scrapStatus, setScrapStatus] = useState({}); // 각 게시물의 스크랩 상태 관리
    const [topLikedPosts, setTopLikedPosts] = useState([]); // 좋아요 10개 이상 게시물
    const [posts, setPosts] = useState([]); // 게시물 목록 상태 관리
    const [sortType, setSortType] = useState('latest'); // 초기 정렬 상태는 'latest'
    const [initialPosts, setInitialPosts] = useState([]); // 최초 데이터 로드한 거 저장시키기
    const [selectedCategory, setSelectedCategory] = useState('부트캠프'); // 선택된 항목 상태

    // 페이징 및 추가 필터링 상태
    const [page, setPage] = useState(0); // 현재 페이지 번호
    const [size, setSize] = useState(10); // 페이지당 항목 수
    const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
    const [hashtagKeyword, setHashtagKeyword] = useState(''); // 해시태그 필터
    const [typeKeyword, setTypeKeyword] = useState(''); // 타입 필터


    // 로딩 상태 관리
    const [isLoading, setIsLoading] = useState(false); // 데이터 로딩 상태

    const navigate = useNavigate();  // useNavigate 훅을 컴포넌트 내부에서 호출

    // 반응형 처리를 위한 useMediaQuery 사용
    const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);  // 드롭다운 토글
    };

    useEffect(() => {
        const fetchPosts = async () => {
            const accessToken = localStorage.getItem('authToken');
            console.log(accessToken);

            setIsLoading(true); // 로딩 시작

            try {
                const response = await axiosInstance.get('https://2ecb-2406-5900-10f0-c886-1c07-11ef-e410-ee21.ngrok-free.app/api/board/studies', {
                    params: {
                        page,
                        size,
                        studyid: selectedCategory === '부트캠프' ? 'bootcamp' : selectedCategory === '산업 연계' ? 'industry' : 'study',
                    },
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'ngrok-skip-browser-warning': 'true', // 경고 페이지를 우회하는 헤더 추가
                    },
                });

                const data = response.data;

                if (!data.content || data.content.length === 0) {
                    console.warn('게시물이 없습니다.');
                    setPosts([]); // 빈 데이터로 상태 초기화
                    return;
                }

                setPosts(data.content); // 게시물 데이터 설정
                setInitialPosts(data.content); // 초기 데이터 저장
                setTotalPages(data.totalPages); // 전체 페이지 수 설정
                console.log('게시물 데이터:', data);
            } catch (error) {
                console.error('게시물 목록을 불러오는 중 오류가 발생했습니다:', error);
                alert('게시물 데이터를 불러오는데 문제가 발생했습니다. 다시 시도해주세요.');
            } finally {
                setIsLoading(false); // 로딩 종료
            }
        };

        fetchPosts();
    }, [selectedCategory, page, size]); // selectedCategory가 변경될 때마다 호출

    // 카테고리 선택 핸들러
    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };


    const toggleScrap = async (id) => {
        const accessToken = localStorage.getItem('authToken');
        console.log(accessToken);

        try {
            // 카테고리에 따라 엔드포인트 동적으로 설정
            const categoryPath = selectedCategory === '부트캠프'
                ? 'bootcamp'
                : selectedCategory === '산업 연계'
                    ? 'industry'
                    : 'study';

            const response = await axiosInstance.post(`https://2ecb-2406-5900-10f0-c886-1c07-11ef-e410-ee21.ngrok-free.app/api/board/studies/${id}/scrap`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'ngrok-skip-browser-warning': 'true', // 경고 페이지를 우회하는 헤더 추가
                },
            });

            // 서버 응답이 성공적일 경우 상태 업데이트
            setScrapStatus((prevState) => ({
                ...prevState,
                [id]: !prevState[id], // 현재 상태를 토글
            }));

            console.log('스크랩 상태가 성공적으로 업데이트되었습니다.');
        } catch (error) {
            console.error('스크랩 상태 업데이트 중 오류가 발생했습니다:', error);
            alert('스크랩 상태 업데이트에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // 검색 입력값을 변경하는 함수
    const handleSearch = async () => {
        console.log('검색 버튼 클릭됨');
        if (searchTerm.trim() !== '') {
            try {
                console.log(`검색어: ${searchTerm}`);

                // 카테고리에 따라 엔드포인트 동적으로 설정
                const categoryPath = selectedCategory === '부트캠프'
                    ? 'bootcamp'
                    : selectedCategory === '산업 연계'
                        ? 'industry'
                        : 'study';

                const response = await axiosInstance.get(`https://2ecb-2406-5900-10f0-c886-1c07-11ef-e410-ee21.ngrok-free.app/api/board/studies/${categoryPath}`, {
                    params: {
                        searchKeyword: searchTerm, // 검색어 전달
                        page: 0,
                        size: 10,
                        studyid: selectedCategory === '부트캠프' ? 'bootcamp' : selectedCategory === '산업 연계' ? 'industry' : 'study',
                    },
                    headers: {
                        'ngrok-skip-browser-warning': 'true', // 경고 페이지를 우회하는 헤더 추가
                    },
                });

                const data = response.data;
                console.log('검색 결과:', data);

                // 검색 결과를 게시물 목록으로 업데이트 (명세서에 따른 구조 반영)
                setPosts(data.content); // 'content' 필드가 검색 결과로 가정

                alert('검색이 완료되었습니다. 결과가 화면에 표시됩니다.');
            } catch (error) {
                console.error('검색 결과를 불러오는 중 오류가 발생했습니다:', error);
                alert('검색 결과를 불러오는 중 오류가 발생했습니다.');
            }
        } else {
            alert('검색어를 입력해주세요.');
        }
    };


    const handlePostClick = (postId) => { // 선택된 카테고리별로 네비게이트 다르게 하게 수정함.
        if (selectedCategory === '부트캠프') {
            navigate(`/BootBoard/${postId}`);  // 해당 게시물 상세 페이지로 이동
        }
        else if (selectedCategory === '스터디') {
            navigate(`/StudyBoard/${postId}`);
        }
        else {
            navigate(`/IndustryBoard/${postId}`);
        }
    };


    // 정렬 버튼 클릭 시 정렬 상태 업데이트
    const handleSort = async (type) => {
        setSortType(type); // 정렬 상태 업데이트

        if (type === 'latest') {
            setPosts(initialPosts); // 초기 데이터로 복원
            return;
        }
        else if (type === 'daysleft') {
            const sortedPosts = [...posts].sort((a, b) => a.daysLeft - b.daysLeft); // daysleft 오름차순 정렬
            setPosts(sortedPosts);
        }

        try {
            // 카테고리에 따라 엔드포인트 동적으로 설정
            const categoryPath = selectedCategory === '부트캠프'
                ? 'bootcamp'
                : selectedCategory === '산업 연계'
                    ? 'industry'
                    : 'study';

            const response = await axiosInstance.get(`https://2ecb-2406-5900-10f0-c886-1c07-11ef-e410-ee21.ngrok-free.app/api/board/studies/sort-by-deadline`, {
                params: {
                    page: 0,
                    size: 10,
                    searchKeyword: '', // 필요 시 값 설정
                    contentKeyword: '', // 필요 시 값 설정
                    hashtagKeyword: '', // 필요 시 값 설정
                    typeKeyword: '', // 필요 시 값 설정
                    studyid: selectedCategory === '부트캠프' ? 'bootcamp' : selectedCategory === '산업 연계' ? 'industry' : 'study',
                },
                headers: {
                    'ngrok-skip-browser-warning': 'true', // 경고 페이지를 우회하는 헤더 추가
                },
            });

            const data = response.data;

            if (!data || !data.content) {
                throw new Error('API 응답이 올바르지 않습니다.');
            }

            setPosts(data.content); // 정렬된 데이터로 게시물 목록 업데이트
        } catch (error) {
            console.error('정렬 데이터 로드 중 오류 발생:', error);
            alert('정렬된 데이터를 가져오는 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.content}>
                <div className={`${styles.titleContainer} ${isDesktop ? styles.desktopTitleContainer : ''}`}>
                    {/* 왼쪽 나가기 버튼 */}
                    <img
                        src={CommunicationRoom_goBack}
                        className={`${styles.goBackButton} ${isDesktop ? styles.desktopGoBackButton : ''}`}
                        alt="뒤로가기"
                        onClick={() => navigate(-1)}  /* 뒤로 가기 동작 추가 */
                    />
                    {/* 페이지 타이틀 */}
                    <h1 className={`${styles.pageTitle} ${isDesktop ? styles.desktopPageTitle : ''}`}>
                        정보 게시판
                    </h1>
                </div>
                <div className={styles.categoryContainer}>
                    {['부트캠프', '산업 연계', '스터디'].map((category) => (
                        <span
                            key={category}
                            className={`${styles.category} ${selectedCategory === category ? styles.activeCategory : ''
                                }`}
                            onClick={() => handleCategorySelect(category)}
                        >
                            {category}
                        </span>
                    ))}
                </div>

                {/* 컨트롤 패널 */}
                <div className={`${styles.controlPanel} ${isDesktop ? styles["desktopControlPanel"] : ''}`}>
                    {/* 글쓰기 버튼 */}
                    <button
                        className={`${styles.writeButton} ${isDesktop ? styles["desktopWriteButton"] : ''}`}
                        // 각 카테고리에 맞는 글쓰기 페이지로 이동하도록 수정함.
                        onClick={() => {
                            const path = selectedCategory === '부트캠프'
                                ? '/bootcamp'
                                : selectedCategory === '산업 연계'
                                    ? '/industry'
                                    : '/study';
                            navigate(path);
                        }}
                    >
                        글쓰기
                    </button>

                    {/* 검색창 */}
                    <div className={`${styles.searchBar} ${isDesktop ? styles.desktopSearchBar : ''}`}>
                        <input
                            type="text"
                            value={searchTerm} // 상태에서 가져온 검색 키워드
                            onChange={handleSearchChange} // 기존 함수명을 새 함수명으로 교체
                            className={`${styles.searchInput} ${isDesktop ? styles.desktopSearchInput : ''}`}
                            placeholder="검색어 입력"
                        />
                        <img
                            src={SearchIcon}
                            className={`${styles.searchIcon} ${isDesktop ? styles.desktopSearchIcon : ''}`}
                            alt="검색"
                            onClick={handleSearch} // 검색 버튼 클릭 시 호출
                        />
                    </div>

                    {/* 정렬 버튼들 */}
                    <div className={`${styles.sortButtons} ${isDesktop ? styles.desktopSortButtons : ''}`}>
                        <button
                            className={`${styles.latestSortButton} ${isDesktop ? styles.desktopLatestSortButton : ''} ${sortType === 'latest' ? styles.activeSortButton : ''}`}
                            onClick={() => {
                                setSortType('latest');
                                handleSort('latest');
                            }}
                        >
                            최신순
                        </button>

                        {/* 추천순 정렬 버튼 */}
                        <button
                            className={`${styles.latestSortButton} ${isDesktop ? styles.desktopRecommendSortButton : ''} ${sortType === 'recommend' ? styles.activeSortButton : ''}`}
                            onClick={() => {
                                setSortType('daysleft');
                                handleSort('daysleft');
                            }}
                        >
                            마감순
                        </button>
                    </div>
                </div>

                {/* 게시물 목록 */}
                <div className={styles.postList}>
                    {posts.map((post) => (
                        <div key={post.id} className={styles.postItem}>
                            {/* 남은 마감일 표시 */}
                            <span
                                className={styles.hotTag}
                                style={{
                                    color: post.daysLeft < 0 ? 'gray' : 'red',
                                    fontWeight: post.daysLeft < 0 ? 'bold' : 'bold',
                                }}
                            >
                                {post.daysLeft < 0 ? '마감됨' : `${post.daysLeft}일 남음`}
                            </span>

                            {/* 게시물 제목 및 정보 */}
                            <div className={styles.postInfo}>
                                <span
                                    className={styles.postTitle}
                                    onClick={() => handlePostClick(post.id)} // 게시물 제목 클릭 시 상세 페이지로 이동
                                >
                                    {post.studyTitle}
                                </span>

                                <span className={styles.postDate}>{post.date}</span>
                            </div>

                            {/* 스크랩 상태 아이콘 */}
                            {/* 스크랩 상태 아이콘 */}
                            <img
                                src={scrapStatus[post.id] !== undefined ? (
                                    scrapStatus[post.id] ? IconScrap : IconUnscrap
                                ) : (
                                    post.scrapped ? IconScrap : IconUnscrap
                                )} // scrapStatus 또는 post.scrapped 값에 따라 이미지 변경
                                alt={scrapStatus[post.id] ? '스크랩됨' : '스크랩안됨'}
                                className={styles.scrapIcon}
                                onClick={() => toggleScrap(post.id)} // 스크랩 상태 변경 및 백엔드 전송
                            />
                        </div>
                    ))}
                </div>

                {/* 페이지네이션 */}
                <div className={styles.pagination}>
                    {[1, 2, 3, 4, 5].map((pageNumber) => (
                        <button
                            key={pageNumber}
                            className={`${styles.pageButton} ${page === pageNumber - 1 ? styles.activePageButton : ''}`} // 현재 페이지 강조
                            onClick={() => setPage(pageNumber - 1)} // 페이지 번호 업데이트
                        >
                            {pageNumber}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};


export default BootBoardPage;