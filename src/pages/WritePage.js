import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./WritePage.module.css";
import main_mascot from '../images/대학 심볼 횃불이.png';
import main_bell from '../images/bell.png';
import main_message from '../images/message.png';
import main_my from '../images/my.png';
import arrow from '../images/arrow.png';
import bar from '../images/bar.png';
import Header from './_.js';  // 상단바 컴포넌트


const WritePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [hashtag, setHashtag] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    const postData = { title, startDate, endDate, hashtag, content };

    try {
      const response = await fetch('https://your-backend-api.com/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        console.log("Data successfully sent:", postData);
        navigate('/notices'); // 게시글 목록 페이지로 이동
      } else {
        console.error("Failed to send data:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  return (
    <div className={styles.app}>
      <Header />

      <img src={arrow} className={styles["app-arrow"]} alt="back_arrow" onClick={() => navigate(-1)} />
      <h2 className={styles["title-text2"]}>게시글 작성</h2>

      <img src={bar} className={styles["app-bar"]} alt="bar" />

      <div className={styles["input-group"]}>
        <h2 className={styles["title-text3"]}>제목</h2>
        <input
          className={styles["input"]}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요."
        />
      </div>

      <div className={styles["input-group"]}>
        <h2 className={styles["title-text4"]}>모집기간</h2>
        <div className={styles["date-range"]}>
          <input
            className={styles["input-date"]}
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span className={styles["date-separator"]}>~</span>
          <input
            className={styles["input-date"]}
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className={styles["input-group"]}>
        <h2 className={styles["title-text5"]}>해시태그</h2>
        <input
          className={styles["input"]}
          type="text"
          value={hashtag}
          onChange={(e) => setHashtag(e.target.value)}
          placeholder="#해시태그 입력"
        />
      </div>

      <div className={styles["input-group"]}>
        <h2 className={styles["title-text6"]}>내용</h2>
        <textarea
          className={styles["textarea"]}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요."
        />
      </div>

      <div className={styles["submit-group"]}>
        <button className={styles["submit-button"]} onClick={handleSubmit}>
          작성
        </button>
      </div>
    </div>
  );
};

export default WritePage;