import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive'; // 반응형 페이지 만들기 위함
import Header from './_.js';  // 상단바 컴포넌트
import styles from './BoardPage.module.css';  // BoardPage용 CSS 파일
import CommunicationRoom_goBack from '../images/arrow.png';
import DownMenu from '../images/아래방향메뉴선택.png';
import SearchIcon from '../images/돋보기아이콘.png';  // 돋보기 아이콘
import IconScrap from '../images/횃불이스크랩.png';
import IconUnscrap from '../images/횃불이스크랩X.png';

// 게시물 목록에 대한 초기 데이터 (가상 데이터)
const initialPosts = [
  { id: 1, title: '게시판 제목 1', date: '2024-01-01', likes: 10, isScraped: true },
  { id: 2, title: '게시판 제목 2', date: '2024-01-02', likes: 20, isScraped: false },
  { id: 3, title: '게시판 제목 3', date: '2024-01-03', likes: 5, isScraped: false },
  { id: 4, title: '게시판 제목 4', date: '2024-01-04', likes: 30, isScraped: true },
  { id: 5, title: '게시판 제목 5', date: '2024-01-05', likes: 15, isScraped: false },
  { id: 6, title: '게시판 제목 6', date: '2024-01-06', likes: 25, isScraped: false },
];


const BoardPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);  // 드롭다운 상태 관리
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 관리
  const [scrapStatus, setScrapStatus] = useState({
    1: true,
    2: false,
    3: false,
    4: true,
    5: false,
    6: false,
    7: false,
    8: false
  }); // 각 게시물의 스크랩 상태 관리
  const [posts, setPosts] = useState([]); // 게시물 목록 상태 관리
  const [sortType, setSortType] = useState('latest'); // 초기 정렬 상태는 'latest'
  const [selectedCategory, setSelectedCategory] = useState(''); // 선택된 항목 상태

  // 현재 선택된 게시판 상태

  // 카테고리 선택 핸들러
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  // 백엔드 연동용. 코드 수정 필요
  // const [posts, setPosts] = useState(initialPosts); // 게시물 목록 상태 관리
  // const [sortType, setSortType] = useState('latest'); // 정렬 타입 상태 관리 ('latest' 또는 'recommend')

  const navigate = useNavigate();  // useNavigate 훅을 컴포넌트 내부에서 호출

  // 반응형 처리를 위한 useMediaQuery 사용
  const isDesktop = useMediaQuery({ query: '(min-width: 769px)' });

  {/*
  // 백엔드에서 게시물 목록 불러오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://your-backend-api.com/api/posts');
        if (!response.ok) {
          throw new Error('게시물 목록을 불러오는데 실패했습니다.');
        }
        const data = await response.json();
        setPosts(data); // 게시물 목록 상태 업데이트
      } catch (error) {
        console.error('게시물 목록 불러오는 중 오류가 발생했습니다:', error);
      }
    };
    fetchPosts();
  }, []);
*/}

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);  // 드롭다운 토글
  };

  const handleBoardChange = (boardName) => {
    if (boardName === '질문 게시판') {
      navigate('/QuestionBoardPage/'); // 질문 게시판으로 이동
    }
    setMenuOpen(false);  // 메뉴 닫기
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

  // 글쓰기 버튼 클릭 핸들러
  const handleWriteButtonClick = () => {
    if (!selectedCategory) {
      alert('먼저 카테고리를 선택해주세요.');
      return;
    }

    // 선택된 카테고리에 따라 다른 동작 수행
    switch (selectedCategory) {
      case '부트캠프':
        navigate('/bootcamp'); // 부트캠프 글쓰기 페이지로 이동
        break;
      case '산업 연계':
        navigate('/industry'); // 산업 연계 글쓰기 페이지로 이동
        break;
      case '스터디':
        navigate('/study'); // 스터디 글쓰기 페이지로 이동
        break;
      default:
        alert('알 수 없는 카테고리입니다.');
    }
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
            정보 게시판
          </h1>
          {/* 드롭다운 버튼 (이미지로 표시) */}
          <img
            src={DownMenu}
            className={`${styles.downMenuButton} ${isDesktop ? styles.desktopDownMenuButton : ''}`}
            alt="게시판 선택"
            onClick={toggleMenu}
          />
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

        {/* 드롭다운 메뉴 */}
        {menuOpen && (
          <div
            className={`${styles.dropdownMenu} ${isDesktop ? styles.desktopDropdownMenu : ''}`}
          >
            <div
              className={`${styles.menuItem} ${isDesktop ? styles.desktopMenuItem : ''}`}
              onClick={() => handleBoardChange('정보 게시판')}
            >
              정보 게시판
            </div>
          </div>
        )}

        {/* 컨트롤 패널 (글쓰기 버튼, 검색창, 정렬 버튼) */}
        <div className={`${styles.controlPanel} ${isDesktop ? styles.desktopControlPanel : ''}`}>
          {/* 글쓰기 버튼 */}
          <button
            className={`${styles.writeButton} ${isDesktop ? styles.desktopWriteButton : ''}`}
            onClick={handleWriteButtonClick} // 동적 동작을 위한 핸들러 연결
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

        {/* 백엔드 할 때
          <div className={styles.sortButtons}>
            <button
              className={`${styles.sortButton} ${sortType === 'latest' ? styles.activeSortButton : ''
                }`}
              onClick={() => handleSort('latest')}
            >
              최신순
            </button>
            <button
              className={`${styles.sortButton} ${sortType === 'recommend' ? styles.activeSortButton : ''
                }`}
              onClick={() => handleSort('recommend')}
            >
              추천순
            </button>
          </div>
        </div>
        */}

        {/* 게시물 목록 */}
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
                onClick={() => toggleScrap(id)}  // 스크랩 상태 변경 및 백엔드 전송
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
              onClick={() => navigate(`/board/page/${pageNumber}`)}
            >
              {pageNumber}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};


export default BoardPage;