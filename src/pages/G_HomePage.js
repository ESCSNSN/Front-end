import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './G_HomePage.module.css';

import main_mascot from '../images/졸업생횃불이.png';
import main_bell from '../images/bell.png';
import main_message from '../images/message.png';
import main_my from '../images/my.png';
import PlusButton from '../assets/MoreButton';
import S_cute from '../assets/S_cuteButton';
import { useMediaQuery } from 'react-responsive';
import {
  fetchTopQuestBoardData,
  fetchTopFreeBoardData,
  fetchTopFreeGraduatesData,
  fetchTopQuestGraduatesData,
} from '../api/GraduateBoardApi'; // API 함수들 import

const G_HomePage = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('자유 게시판');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [hotPosts, setHotPosts] = useState([]);
  const [questionPosts, setQuestionPosts] = useState([]);
  const navigate = useNavigate();

  const isDesktop = useMediaQuery({ query: '(min-width: 769px)' });

  useEffect(() => {
    // Fetch top quest board data
    const loadTopQuestBoardData = async () => {
      try {
        const data = await fetchTopQuestBoardData();
        setQuestionPosts(data); // API로 받은 데이터를 상태에 저장
      } catch (error) {
        console.error('Error loading top quest board data:', error);
      }
    };

    // Fetch top free board data
    const loadTopFreeBoardData = async () => {
      try {
        const data = await fetchTopFreeBoardData();
        setHotPosts(data); // API로 받은 데이터를 상태에 저장
      } catch (error) {
        console.error('Error loading top free board data:', error);
      }
    };

    loadTopQuestBoardData();
    loadTopFreeBoardData();
  }, []);

  const handleQuestionClick = (questionId) => {
    navigate(`/page/${questionId}`);
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);
    navigate('/Start');
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '자유 게시판':
        return (
          <div className={styles.container}>
            <div className={styles.postList}>
              {hotPosts.map((post) => (
                <div key={post.id} className={styles.postItem} onClick={() => handleQuestionClick(post.id)}>
                  <span className={styles.index2}>{post.id}</span>
                  <span className={styles.question}>{post.title}</span>
                  <span className={styles.date}>{post.date}</span>
                  <S_cute className={styles.S_cute} />
                </div>
              ))}
            </div>
          </div>
        );
      case '소통 채팅방':
        return (
          <div className={styles.container}>
            <div className={styles.postList}>
              {questionPosts.map((post) => (
                <div key={post.id} className={styles.postItem} onClick={() => handleQuestionClick(post.id)}>
                  <span className={styles.index2}>{post.id}</span>
                  <span className={styles.question}>{post.title}</span>
                  <span className={styles.date}>{post.date}</span>
                  <S_cute className={styles.S_cute} />
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.app}>
      {/* 상단바 */}
      <header className={`${styles["app-header"]} ${isDesktop ? styles.desktopHeader : ''}`}>
        <div className={`${styles["title-group"]} ${isDesktop ? styles.desktopTitleGroup : ''}`}>
          <img
            src={main_mascot}
            className={styles["app-main_mascot"]}
            alt="main_mascot"
            onClick={() => navigate("/HomePage")}
          />
          <h2 onClick={() => navigate("/HomePage")} style={{ cursor: "pointer" }}>
            INFO!
          </h2>

          {/* 오른쪽 섹션 */}
          <div className={`${styles["right-section"]} ${isDesktop ? styles.desktopRightSection : ''}`}>
            <h2
              className={styles["title-text"]}
              onClick={() => navigate("/notice")}
              style={{ cursor: "pointer" }}
            >
              공지사항
            </h2>
            <img
              src={main_bell}
              className={styles["app-main_bell"]}
              alt="main_bell"
              onClick={() => navigate("/notification")}
            />
            <img
              src={main_message}
              className={styles["app-main_message"]}
              alt="main_message"
              onClick={() => navigate("/message")}
            />
            <img
              src={main_my}
              className={styles["app-main_my"]}
              alt="main_my"
              onClick={toggleDropdown}
            />
          </div>
        </div>
      </header>

      {/* 탭 네비게이션 */}
      <div className={`${styles.tabContainer} ${isDesktop ? styles.desktopTabContainer : ''}`}>
        <button
          className={activeTab === '자유 게시판' ? styles.activeTab : styles.inactiveTab}
          onClick={() => setActiveTab('자유 게시판')}
        >
          자유 게시판
        </button>
        <button
          className={activeTab === '소통 채팅방' ? styles.activeTab : styles.inactiveTab}
          onClick={() => setActiveTab('소통 채팅방')}
        >
          소통 채팅방
        </button>
        <a href="/self-development" className={styles.plusButtonLink}>
          <PlusButton className={styles.plusButton} />
        </a>
      </div>

      {/* 탭 내용 */}
      <div className={`${styles.tabContent} ${isDesktop ? styles.desktopTabContent : ''}`}>
        {renderTabContent()}
      </div>

      {/* 게시판 컨테이너 */}
      <div className={`${styles.container} ${isDesktop ? styles.desktopContainer : ''}`}>
        <h1 className={styles.title}>재학생들의 자유게시판</h1>

        <section>
          <h4 className={styles.subtitle}>〈핫한 게시판〉</h4>
          <div className={styles.postList2}>
            {hotPosts.map((post) => (
              <div key={post.id} className={styles.post}>
                <h3 className={styles.postTitle}>{post.title}</h3>
                <p className={styles.postDescription}>{post.description}</p>
                <button
                  className={styles.commentButton}
                  onClick={() => handleQuestionClick(post.id)}
                >
                  댓글 달기
                </button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h4 className={styles.subtitle}>〈질문 게시판〉</h4>
          <div className={styles.postList2}>
            {questionPosts.map((post) => (
              <div key={post.id} className={styles.post}>
                <h3 className={styles.postTitle}>{post.title}</h3>
                <p className={styles.postDescription}>{post.description}</p>
                <button
                  className={styles.commentButton}
                  onClick={() => handleQuestionClick(post.id)}
                >
                  댓글 달기
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 하단바 */}
      <div className={`${styles.footer} ${isDesktop ? styles.desktopFooter : ''}`}>
        <div className={styles.footerItem}>
          <span>문의하기 </span>
          <a href="mailto:abcd@gmail.com">abcd@gmail.com</a>
        </div>
        <div className={styles.footerItem}>
          <span>개인정보처리방침</span>
        </div>
      </div>
    </div>
  );
};

export default G_HomePage;
