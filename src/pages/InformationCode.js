import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive'; // 반응형 페이지 만들기 위함
import Header from './_.js';  // 상단바 컴포넌트
import styles from './InformationCode.module.css';  // InformationCode용 CSS 파일
import CommunicationRoom_goBack from '../images/arrow.png';
import DownMenu from '../images/아래방향메뉴선택.png';
import SearchIcon from '../images/돋보기아이콘.png';  // 돋보기 아이콘
import IconScrap from '../images/횃불이스크랩.png';
import IconUnscrap from '../images/횃불이스크랩X.png';

// 게시물 목록에 대한 초기 데이터 (가상 데이터)
const initialPosts = [
  { id: 1, title: '[C/C++] 게시판 제목 1', date: '2024-01-01', likes: 10, isScraped: true },
  { id: 2, title: '[JAVA] 게시판 제목 2', date: '2024-01-02', likes: 20, isScraped: false },
  { id: 3, title: '[Python] 게시판 제목 3', date: '2024-01-03', likes: 5, isScraped: false },
  { id: 4, title: '[C#] 게시판 제목 4', date: '2024-01-04', likes: 30, isScraped: true },
  { id: 5, title: '[C/C++] 게시판 제목 5', date: '2024-01-05', likes: 15, isScraped: false },
  { id: 6, title: '[JAVA] 게시판 제목 6', date: '2024-01-06', likes: 25, isScraped: false },
];

const InformationCode = () => {
  const [menuOpen, setMenuOpen] = useState(false);  // 드롭다운 상태 관리
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 관리
  const [scrapStatus, setScrapStatus] = useState({
    1: true,
    2: false,
    3: false,
    4: true,
    5: false,
    6: false,
  }); // 각 게시물의 스크랩 상태 관리
  const [posts, setPosts] = useState(initialPosts); // 게시물 목록 상태 관리
  const [sortType, setSortType] = useState('latest'); // 초기 정렬 상태는 'latest'
  const [selectedLanguage, setSelectedLanguage] = useState('전체'); // 선택된 언어 필터

  const navigate = useNavigate();  // useNavigate 훅을 컴포넌트 내부에서 호출

  // 반응형 처리를 위한 useMediaQuery 사용
  const isDesktop = useMediaQuery({ query: '(min-width: 769px)' });

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);  // 드롭다운 토글
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    setMenuOpen(false);  // 메뉴 닫기
    if (language === '전체') {
      setPosts(initialPosts);
    } else {
      setPosts(initialPosts.filter(post => post.title.includes(`[${language}]`)));
    }
  };

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
        [id]: !prevState[id]
      }));

      // 성공적으로 백엔드와 통신 완료
      console.log('스크랩 상태가 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error('스크랩 상태 업데이트 중 오류가 발생했습니다:', error);
      alert('스크랩 상태 업데이트에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 검색 입력값을 변경하는 함수
  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // 검색 버튼을 클릭했을 때 호출되는 함수
  const handleSearch = async () => {
    console.log('검색 버튼 클릭됨');
    if (searchTerm.trim() !== '') {
      try {
        console.log(`검색어: ${searchTerm}`);
        const response = await fetch(`https://your-backend-api.com/api/posts/search?query=${encodeURIComponent(searchTerm)}`);

        if (!response.ok) {
          throw new Error('검색 결과를 불러오는데 실패했습니다.');
        }

        const data = await response.json();
        console.log('검색 결과:', data);
        setPosts(data); // 검색 결과를 게시물 목록으로 업데이트
        alert('검색이 완료되었습니다. 결과가 화면에 표시됩니다.');
      } catch (error) {
        console.error('검색 결과를 불러오는 중 오류가 발생했습니다:', error);
        alert('검색 결과를 불러오는 중 오류가 발생했습니다.');
      }
    } else {
      alert('검색어를 입력해주세요.');
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);  // 해당 게시물 상세 페이지로 이동
  };

  // 정렬 버튼 클릭 시 정렬 상태 업데이트
  const handleSort = (type) => {
    setSortType(type);
    if (type === 'latest') {
      // 최신순으로 정렬
      setPosts((prevPosts) =>
        [...prevPosts].sort((a, b) => new Date(b.date) - new Date(a.date))
      );
    } else if (type === 'recommend') {
      // 추천순으로 정렬 (좋아요 개수 기준)
      setPosts((prevPosts) =>
        [...prevPosts].sort((a, b) => b.likes - a.likes)
      );
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
            정보 게시판 - 코드 질문 게시판
          </h1>
          {/* 드롭다운 버튼 (이미지로 표시) */}
          <img
            src={DownMenu}
            className={`${styles.downMenuButton} ${isDesktop ? styles.desktopDownMenuButton : ''}`}
            alt="언어 선택"
            onClick={toggleMenu}
          />
        </div>

        {/* 드롭다운 메뉴 */}
        {menuOpen && (
          <div className={`${styles.dropdownMenu} ${isDesktop ? styles.desktopDropdownMenu : ''}`}>
            {['전체', 'C/C++', 'Python', 'JAVA', 'C#', '기타'].map((language) => (
              <div
                key={language}
                className={`${styles.menuItem} ${isDesktop ? styles.desktopMenuItem : ''}`}
                onClick={() => handleLanguageChange(language)}
              >
                {language}
              </div>
            ))}
          </div>
        )}

        {/* 컨트롤 패널 (글쓰기 버튼, 검색창, 정렬 버튼) */}
        <div className={`${styles.controlPanel} ${isDesktop ? styles.desktopControlPanel : ''}`}>
          {/* 글쓰기 버튼 */}
          <button
            className={`${styles.writeButton} ${isDesktop ? styles.desktopWriteButton : ''}`}
            onClick={() => navigate('/write')} // 글쓰기 페이지로 이동
          >
            글쓰기
          </button>

          {/* 검색창 */}
          <div className={`${styles.searchBar} ${isDesktop ? styles.desktopSearchBar : ''}`}>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchInputChange}
              className={`${styles.searchInput} ${isDesktop ? styles.desktopSearchInput : ''}`}
              placeholder="검색어 입력"
            />
            <img
              src={SearchIcon}
              className={`${styles.searchIcon} ${isDesktop ? styles.desktopSearchIcon : ''}`}
              alt="검색"
              onClick={handleSearch} // 돋보기 아이콘 클릭 시 검색
            />
          </div>

          {/* 정렬 버튼들 */}
          <div className={`${styles.sortButtons} ${isDesktop ? styles.desktopSortButtons : ''}`}>
            <button
              className={`${styles.sortButton} ${styles.latestSortButton} ${isDesktop ? styles.desktopLatestSortButton : ''}`}
              onClick={() => handleSort('latest')}
            >
              최신순
            </button>
            <button
              className={`${styles.sortButton} ${styles.recommendSortButton} ${isDesktop ? styles.desktopRecommendSortButton : ''}`}
              onClick={() => handleSort('recommend')}
            >
              추천순
            </button>
          </div>
        </div>

        {/* 게시물 목록 */}
        <div className={styles.postList}>
          {posts.map((post) => (
            <div key={post.id} className={styles.postItem}>
              {/* HOT 표시 (상단 3개의 게시물) */}
              {post.id <= 3 && <span className={styles.hotTag}>HOT</span>}
              {/* 게시물 제목 및 정보 */}
              <div className={styles.postInfo}>
                <span
                  className={styles.postTitle}
                  onClick={() => handlePostClick(post.id)} // 게시물 제목 클릭 시 상세 페이지로 이동
                >
                  {post.title}
                </span>
                <span className={styles.postDate}>{post.date}</span>
              </div>
              {/* 스크랩 버튼 */}
              <img
                src={scrapStatus[post.id] ? IconScrap : IconUnscrap}
                alt={scrapStatus[post.id] ? '스크랩됨' : '스크랩안됨'}
                className={styles.scrapIcon}
                onClick={() => toggleScrap(post.id)}  // 스크랩 상태 변경 및 백엔드 전송
              />
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className={styles.pagination}>
          {[1, 2, 3, 4, 5].map((pageNumber) => (
            <button
              key={pageNumber}
              className={styles.pageButton}
              onClick={() => navigate(`/informationcode/page/${pageNumber}`)}
            >
              {pageNumber}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InformationCode;