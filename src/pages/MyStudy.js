import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive'; // 반응형 페이지 만들기 위함
import axiosInstance from '../utils/api.js';
import Header from './_.js'; // 상단바 컴포넌트
import styles from './MyStudy.module.css';
import CommunicationRoom_goBack from '../images/왼쪽 나가기 버튼.png';
import DownMenu from '../images/아래방향메뉴선택.png';
import SearchIcon from '../images/돋보기아이콘.png'; // 돋보기 아이콘
import IconScrap from '../images/횃불이스크랩.png';
import IconUnscrap from '../images/횃불이스크랩X.png';

const getAuthHeaders = () => {
  const accessToken = localStorage.getItem('authToken');
  const userId = localStorage.getItem('userId'); // 이 부분이 사용자 ID를 가져옵니다.
  console.log(localStorage.getItem('userId'));

  return {
    'Authorization': `Bearer ${accessToken}`,
    'X-USER-ID': userId, // 사용자 ID를 X-USER-ID로 추가
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 1
  };
};

const MyStudy = () => {
  const [menuOpen, setMenuOpen] = useState(false);  // 드롭다운 상태 관리
  const [posts, setPosts] = useState([]); // 게시물 목록 상태 관리
  const { id } = useParams();
  const { studyId, setStudyId } = useState();

  // 페이징 및 추가 필터링 상태
  const [page, setPage] = useState(0); // 현재 페이지 번호
  const [size, setSize] = useState(10); // 페이지당 항목 수
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수

  const navigate = useNavigate(); // useNavigate 훅을 컴포넌트 내부에서 호출
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });

  // 게시물 목록을 가져오는 함수
  useEffect(() => {
    const fetchPosts = async () => {
      const accessToken = localStorage.getItem('authToken');
      console.log(accessToken);

      try {
        const response = await axiosInstance.get('https://2ecb-2406-5900-10f0-c886-1c07-11ef-e410-ee21.ngrok-free.app/api/board/studies/myPost', {
          params: {
            page,
            size,
            studyId: 'study',
          }
          ,
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
        setTotalPages(data.totalPages); // 전체 페이지 수 설정
        console.log('게시물 데이터:', data);
      } catch (error) {
        console.error('게시물 목록을 불러오는 중 오류가 발생했습니다:', error);
        alert('게시물 데이터를 불러오는데 문제가 발생했습니다. 다시 시도해주세요.');
      }
    };
    fetchPosts();
  }, [page, size]); // page와 size 변경 시 재호출


  const toggleMenu = () => {
    setMenuOpen((prevMenuOpen) => !prevMenuOpen); // 드롭다운 메뉴 열기/닫기 토글
  };

  const handleBoardChange = (boardName) => {
    if (boardName === '내가 지원한 스터디') {
      navigate('/MyApplyStudy/'); // 질문 게시판으로 이동
    }
    setMenuOpen(false); // 메뉴 닫기
  };


  const handlePostClick = (studyId) => {
    navigate(`/StudyApplicantList/${studyId}`); // 해당 게시물 상세 페이지로 이동
};

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <div className={`${styles.titleContainer} ${isDesktop ? styles.desktopTitleContainer : ''}`}>
          {/* 왼쪽 나가기 버튼 */}
          <img
            src={CommunicationRoom_goBack}
            className={`${styles.goBackButton} ${isDesktop ? styles["desktopGoBackButton"] : ''}`}
            alt="뒤로가기"
            onClick={() => navigate(-1)} /* 뒤로 가기 동작 추가 */
          />
          {/* 페이지 타이틀 */}
          <h1 className={`${styles.pageTitle} ${isDesktop ? styles["desktopPageTitle"] : ''}`}>
            내가 작성한 스터디
          </h1>
          {/* 드롭다운 버튼 */}
          <img
            src={DownMenu}
            className={`${styles.downMenuButton} ${isDesktop ? styles["desktopDownMenuButton"] : ''}`}
            alt="게시판 선택"
            onClick={toggleMenu}
          />
        </div>

        {/* 드롭다운 메뉴 */}
        {menuOpen && (
          <div className={`${styles.dropdownMenu} ${isDesktop ? styles.desktopDropdownMenu : ''}`}>
            <div
              className={`${styles.menuItem} ${isDesktop ? styles["desktopMenuItem"] : ''}`}
              onClick={() => handleBoardChange('내가 지원한 스터디')}
            >
              내가 지원한 스터디
            </div>
          </div>
        )}


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

                <span>
                  {post.countMember}/{post.recruit}
                </span>

                <span className={styles.postDate}>{post.date}</span>
              </div>

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


export default MyStudy;