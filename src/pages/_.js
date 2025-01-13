import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './_2.module.css';
import mainMascot from '../images/대학 심볼 횃불이.png';
import mainBell from '../images/bell.png';
import mainMessage from '../images/message.png';
import mainMy from '../images/my.png';

const _2 = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
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

  return (
    <div className={styles.app}>
      {/* 상단바 */}
      <header className={styles["app-header"]}>
        <div className={styles["title-group"]}>
          <img
            src={mainMascot}
            className={styles["app-main_mascot"]}
            alt="main_mascot"
            onClick={() => navigate("/HomePage")}
            style={{ cursor: 'pointer' }}
          />
          <h2 onClick={() => navigate("/HomePage")} style={{ cursor: 'pointer' }}>INFO!</h2>
        </div>

        <div className={styles["right-section"]}>
          <h2 
            className={styles["title-text"]}
            onClick={() => navigate("/Announcement")}
            style={{ cursor: "pointer" }}
          >공지사항</h2>

          <img 
            src={mainBell} 
            className={styles["app-main_bell"]} 
            alt="main_bell"
            onClick={() => navigate("/AlarmPage")}
            style={{ cursor: 'pointer' }}
          />

          <img 
            src={mainMessage} 
            className={styles["app-main_message"]} 
            alt="main_message"
            onClick={() => navigate("/message")}
            style={{ cursor: 'pointer' }}
          />

          <img 
            src={mainMy} 
            className={styles["app-main_my"]} 
            alt="main_my"
            onClick={toggleDropdown} 
            style={{ cursor: 'pointer' }}
          />

          {/* 드롭다운 메뉴 */}
          {dropdownVisible && (
            <div className={styles["dropdown-menu"]}>
                <a href="/scrap" className={styles["menu-item"]}>스크랩</a>
                <a href="/My_board" className={styles["menu-item"]}>작성 게시글</a>
                <a href="/My_message" className={styles["menu-item"]}>작성 댓글</a>
                <a href="/add" className={styles["menu-item"]}>스터디 신청 확인</a>
             
            </div>
          )}

          {/* 로그아웃 모달 */}
          {isLogoutModalOpen && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <h3>정말 로그아웃하시겠습니까?</h3>
                <div className={styles.modalButtons}>
                  <button 
                    onClick={handleLogoutConfirm} 
                    className={styles.confirmButton}
                  >
                    네
                  </button>
                  <button 
                    onClick={handleLogoutCancel} 
                    className={styles.cancelButton}
                  >
                    아니오
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default _2;
