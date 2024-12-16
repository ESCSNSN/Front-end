import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./Header.module.css";
import main_mascot from '../images/대학 심볼 횃불이.png';
import main_bell from '../images/bell.png';
import main_message from '../images/message.png';
import main_my from '../images/my.png';
import arrow from '../images/arrow.png';
import bar from '../images/bar.png';

const Header = ({ formattedDate, onBackClick, onReportClick }) => {
  const navigate = useNavigate();

  return (
    <header className={styles["app-header"]}>
      <div className={styles["title-group"]}>
        <img src={main_mascot} className={styles["app-main_mascot"]} alt="main_mascot" />
        <h2>INFO!</h2>
        <div className={styles["right-section"]}>
          <h2 className={styles["title-text"]}>공지사항</h2>
          <img src={main_bell} className={styles["app-main_bell"]} alt="main_bell" />
          <img src={main_message} className={styles["app-main_message"]} alt="main_message" />
          <img src={main_my} className={styles["app-main_my"]} alt="main_my" />
        </div>
      </div>

      <img src={arrow} className={styles["app-arrow"]} alt="back_arrow" onClick={onBackClick} />
      <h2 className={styles["title-text2"]}>게시판</h2>

      <img src={bar} className={styles["app-bar"]} alt="bar" />

      <h2 className={styles["title-text3"]}>게시판 제목</h2>
      <img src={main_message} className={styles["app-main_message2"]} alt="main_message" />
      <h2 className={styles["title-text4"]}>작성일: {formattedDate}</h2>

      <button onClick={onReportClick} className={styles["report-button"]}>
        신고하기
      </button>
    </header>
  );
};

export default Header;
