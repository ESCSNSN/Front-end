import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive'; // 반응형 페이지 만들기 위함
import axiosInstance from '../utils/api';
import Header from './G_.js';  // 상단바 컴포넌트
import styles from './FreeboardPage.module.css';  // BoardPage용 CSS 파일
import CommunicationRoom_goBack from '../images/왼쪽 나가기 버튼.png';
import DownMenu from '../images/아래방향메뉴선택.png';
import SearchIcon from '../images/돋보기아이콘.png';  // 돋보기 아이콘
import IconScrap from '../images/횃불이스크랩.png';
import IconUnscrap from '../images/횃불이스크랩X.png';

// API에서 사용할 기본 URL과 헤더 설정
const BASE_URL = 'http://info-rmation.kro.kr/api/board';
const getAuthHeaders = () => {
  const accessToken = localStorage.getItem('accessToken');
  const userId = localStorage.getItem('userId'); // 이 부분이 사용자 ID를 가져옵니다.
  return {
    'Authorization': `Bearer ${accessToken}`,
    'X-USER-ID': userId, // 사용자 ID를 X-USER-ID로 추가
    'Content-Type': 'application/json',
  };
};


const G_freeboardPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);  // 드롭다운 상태 관리
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 관리
  const [scrapStatus, setScrapStatus] = useState({}); // 각 게시물의 스크랩 상태 관리
  const [topLikedPosts, setTopLikedPosts] = useState([]); // 좋아요 10개 이상 게시물
  const [posts, setPosts] = useState([]); // 게시물 목록 상태 관리
  const [sortType, setSortType] = useState('latest'); // 초기 정렬 상태는 'latest'
  const [initialPosts, setInitialPosts] = useState([]); // 최초 데이터 로드한 거 저장시키기
  const [selectedCategory, setSelectedCategory] = useState(''); // 선택된 항목 상태

  // 페이징 및 추가 필터링 상태
  const [page, setPage] = useState(0); // 현재 페이지 번호
  const [size, setSize] = useState(10); // 페이지당 항목 수
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [hashtagKeyword, setHashtagKeyword] = useState(''); // 해시태그 필터
  const [typeKeyword, setTypeKeyword] = useState(''); // 타입 필터

  // 로딩 상태 관리
  const [isLoading, setIsLoading] = useState(false); // 데이터 로딩 상태

  const navigate = useNavigate(); // useNavigate 훅을 컴포넌트 내부에서 호출
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });

  // 게시물 목록을 백엔드에서 불러오기
  useEffect(() => {
    const fetchPosts = async () => {
      const accessToken = localStorage.getItem('authToken');
      console.log(accessToken);

      setIsLoading(true); // 로딩 시작
      try {
        const response = await axiosInstance.get('http://info-rmation.kro.kr/api/board/graduate', {
          params: {
            page,
            size,
            graduateId: 'Free'
          }, // 페이지와 사이즈를 쿼리 파라미터로 추가
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'ngrok-skip-browser-warning': 'true', // 경고 페이지를 우회하는 헤더 추가
          },
        });

        const data = response.data; // Axios는 자동으로 JSON을 파싱합니다.

        if (!data.content || data.content.length === 0) {
          console.warn('게시물이 없습니다.');
          setPosts([]); // 빈 데이터로 상태 초기화
          return;
        }

        setPosts(data.content); // 게시물 데이터 설정
        setInitialPosts(response.data.content); // 초기 데이터 저장
        setTotalPages(data.totalPages); // 전체 페이지 수 설정
        console.log('게시물 데이터:', data);
      } catch (error) {
        console.error('게시물 목록을 불러오는 중 오류가 발생했습니다:', error);
        alert('게시물 데이터를 불러오는데 문제가 발생했습니다. 다시 시도해주세요.');
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    };
    // 좋아요 10개 이상 게시물 가져오기
    const fetchTopLikedPosts = async () => {
      try {
        const response = await axiosInstance.get('http://info-rmation.kro.kr/api/board/graduate/top-liked', {
          headers: {
            'ngrok-skip-browser-warning': 'true', // 경고 페이지를 우회하는 헤더 추가
          },
        });
        if (response.status === 200) {
          console.log(response)
          setTopLikedPosts(response.data.map((post) => post.id)); // 좋아요 10개 이상 게시물의 ID만 저장
        } else {
          setTopLikedPosts([]); // 데이터가 없는 경우 빈 배열로 초기화
        }
      } catch (error) {
        console.error('좋아요 상위 게시물을 불러오는 중 오류가 발생했습니다:', error);
      }
    };
    fetchPosts();
    fetchTopLikedPosts();
  }, [page, size]); // page와 size 변경 시 재호출

  const toggleMenu = () => {
    setMenuOpen((prevMenuOpen) => !prevMenuOpen); // 드롭다운 메뉴 열기/닫기 토글
  };

  const handleBoardChange = (boardName) => {
    if (boardName === '질문 게시판') {
      navigate('/G_questionboardPage/'); // 질문 게시판으로 이동
    }
    setMenuOpen(false);  // 메뉴 닫기
  };

  const toggleScrap = async (id) => {
    const accessToken = localStorage.getItem('authToken');
    console.log(accessToken);

    try {
      const response = await axiosInstance.post(`https://2ecb-2406-5900-10f0-c886-1c07-11ef-e410-ee21.ngrok-free.app/api/board/graduate/${id}/scrap`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'ngrok-skip-browser-warning': 'true', // 경고 페이지를 우회하는 헤더 추가
        },

      });

      // 성공적으로 응답을 받은 경우 상태를 업데이트
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


  const handlePostClick = (postId) => {
    navigate(`/G_freepostingPage/${postId}`);  // 해당 게시물 상세 페이지로 이동
  };

  // 정렬 버튼 클릭 시 정렬 상태 업데이트
  const handleSort = async (type) => {
    setSortType(type); // 정렬 상태 업데이트

    if (type === 'latest') {
      setPosts(initialPosts); // 초기 데이터로 복원
      return;
    }

    try {
      const params = {
        page: 0,
        size: 10,
        searchKeyword: '', // 필요 시 값 설정
        contentKeyword: '', // 필요 시 값 설정
        hashtagKeyword: '', // 필요 시 값 설정
        typeKeyword: '', // 필요 시 값 설정
        graduateId: 'Free',
      };

      const response = await axiosInstance.get('https://2ecb-2406-5900-10f0-c886-1c07-11ef-e410-ee21.ngrok-free.app/api/board/graduate/sort-by-likes', {
        params,
        headers: {
          'ngrok-skip-browser-warning': 'true', // 필요 시 유지
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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async () => {
    console.log('검색 버튼 클릭됨');
    if (searchTerm.trim() !== '') {
      try {
        console.log(`검색어: ${searchTerm}`);
        const response = await axiosInstance.get('https://2ecb-2406-5900-10f0-c886-1c07-11ef-e410-ee21.ngrok-free.app/api/board/graduate', {
          params: {
            searchKeyword: searchTerm, // 검색어 전달
            page: 0,
            size: 10,
            graduateId: 'Free',
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


  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <div className={`${styles.titleContainer} ${isDesktop ? styles.desktopTitleContainer : ''}`}>
          <img
            src={CommunicationRoom_goBack}
            className={`${styles.goBackButton} ${isDesktop ? styles.desktopGoBackButton : ''}`}
            alt="뒤로가기"
            onClick={() => navigate(-1)}  /* 뒤로 가기 동작 추가 */
          />
          <h1 className={`${styles.pageTitle} ${isDesktop ? styles.desktopPageTitle : ''}`}>자유 게시판</h1>
          <img
            src={DownMenu}
            className={`${styles.downMenuButton} ${isDesktop ? styles.desktopDownMenuButton : ''}`}
            alt="게시판 선택"
            onClick={toggleMenu}
          />
        </div>

        {menuOpen && (
          <div className={`${styles.dropdownMenu} ${isDesktop ? styles.desktopDropdownMenu : ''}`}>
            <div
              className={`${styles.menuItem} ${isDesktop ? styles.desktopMenuItem : ''}`}
              onClick={() => handleBoardChange('질문 게시판')}
            >
              질문 게시판
            </div>
          </div>
        )}

        <div className={`${styles.controlPanel} ${isDesktop ? styles.desktopControlPanel : ''}`}>
          <button
            className={`${styles.writeButton} ${isDesktop ? styles.desktopWriteButton : ''}`}
            onClick={() => navigate('/G_freewritePage')} // 글쓰기 페이지로 이동
          >
            글쓰기
          </button>

          <div className={`${styles.searchBar} ${isDesktop ? styles.desktopSearchBar : ''}`}>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              className={`${styles.searchInput} ${isDesktop ? styles.desktopSearchInput : ''}`}
              placeholder="검색어 입력"
            />
            <img
              src={SearchIcon}
              className={`${styles.searchIcon} ${isDesktop ? styles.desktopSearchIcon : ''}`}
              alt="검색"
              onClick={handleSearch}
            />
          </div>

          <div className={`${styles.sortButtons} ${isDesktop ? styles.desktopSortButtons : ''}`}>
            <button
              className={`${styles.latestSortButton} ${isDesktop ? styles.desktopLatestSortButton : ''}`}
              onClick={() => handleSort('latest')}
            >
              최신순
            </button>
            <button
              className={`${styles.latestSortButton} ${isDesktop ? styles.desktopRecommendSortButton : ''}`}
              onClick={() => handleSort('recommend')}
            >
              추천순
            </button>
          </div>
        </div>

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
                  {post.graduateTitle || '제목 없음'} {/* 백엔드 데이터의 키에 맞춰 수정, 기본값 처리 */}
                </span>
                <span className={styles.postDate}>
                  {post.graduateCreatedTime
                    ? new Date(post.graduateCreatedTime).toLocaleDateString() // 작성 날짜 표시
                    : '날짜 없음'}
                </span>
              </div>

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
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
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

export default G_freeboardPage;
