import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from "./Announcementposting.module.css";
import main_mascot from '../images/대학 심볼 횃불이.png';
import main_bell from '../images/bell.png';
import main_message from '../images/message.png';
import main_my from '../images/my.png';
import arrow from '../images/arrow.png';
import scrab from '../images/스크랩횃불이.png';
import heart from '../images/heart.png';
import filledHeart from '../images/filledheart.png';
import bar from '../images/bar.png';
import Header from './_.js';  // 상단바 컴포넌트

// API에서 사용할 기본 URL과 헤더 설정
const BASE_URL = 'http://info-rmation.kro.kr/api/board';
const getAuthHeaders = () => {
  const authToken = localStorage.getItem('authToken');
  const userId = localStorage.getItem('userId'); // 이 부분이 사용자 ID를 가져옵니다.
  console.log(localStorage.getItem('userId'));

  return {
    'Authorization': `Bearer ${authToken}`,
    'X-USER-ID': userId, // 사용자 ID를 X-USER-ID로 추가
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 1
  };
};



const Announcementposting = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [content, setContent] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [replyContents, setReplyContents] = useState([]);
  const [nickname, setNickname] = useState('');
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [replyVisible, setReplyVisible] = useState(''); // 신고 내용 저장
  const [title, setTitle] = useState('');
  const [createdTime, setCreatedTime] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const handleBackClick = () => navigate(-1);
  const { id } = useParams();
  const [imageUrls, setImageUrls] = useState([]); // 이미지 URL 상태 추가

  // 게시판 데이터 불러오기 useEffect
  useEffect(() => {
    const getBoard = async () => {
      const authToken = localStorage.getItem('authToken');
      console.log(id);

      try {
        const response = await fetch(`${BASE_URL}/notice/${id}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'ngrok-skip-browser-warning': 1,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('게시글 데이터:', data);

          // noticeCreatedTime 변환
          const formattedDate = new Date(data.noticeCreatedTime).toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          // 상태 업데이트
          setContent(data.noticeContents);
          setTitle(data.noticeTitle);
          setImageUrls(data.imageUrls || []); // imageUrls 상태 업데이트
          setCreatedTime(formattedDate); // 작성 시간 상태 업데이트
        } else {
          console.error('게시판 데이터 불러오기에 실패했습니다.');
        }
      } catch (error) {
        console.error('게시판 데이터 불러오는 중 오류 발생:', error);
      }
    };

    getBoard();
  }, [id]);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleCommentChange = (e) => {
    setCommentContent(e.target.value);
  };  
  
  

  const handleReplyChange = (index, e) => {
    const newReplyContents = [...replyContents];
    newReplyContents[index] = e.target.value; // 현재 입력값 저장
    setReplyContents(newReplyContents); // 상태 업데이트
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("선택된 파일:", file);
      // 파일 업로드 혹은 미리보기 로직 처리
    }
  };

  useEffect(() => {
    const fetchHeartStatus = async () => {
      try {
        const response = await fetch(`${BASE_URL}/notice/${id}/like-status`, {
          method: 'GET',
          headers: getAuthHeaders(),
        });

        if (response.ok) {
          const data = await response.json();
          setIsHeartFilled(data.liked); // 서버로부터 불러온 좋아요 상태 반영
        } else {
          console.error('좋아요 상태 불러오기에 실패했습니다.');
        }
      } catch (error) {
        console.error('좋아요 상태 불러오는 중 오류 발생:', error);
      }
    };

    fetchHeartStatus();
  }, [id]);

  // 닉네임 생성 함수
const generateNickname = (id) => {
  const types = ["int", "short", "double", "char"];
  const randomType = types[Math.floor(Math.random() * types.length)];
  return `${randomType}${id}`;
};

useEffect(() => {
  if (!nickname) {
    const types = ['int', 'short', 'double', 'char'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    setNickname(randomType);
  }
}, [nickname]);

  

  const handleToggleReply = (index) => {
    setReplyVisible((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleHeartClick = async () => {
    const newHeartStatus = !isHeartFilled;
    setIsHeartFilled(newHeartStatus);

    try {
      const response = await fetch(`${BASE_URL}/notice/${id}/like`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isHeartFilled: newHeartStatus }),
      });

      if (!response.ok) {
        console.error('좋아요 요청에 실패했습니다.');
        setIsHeartFilled(!newHeartStatus); // 요청 실패 시 상태 되돌림
      }
    } catch (error) {
      console.error('좋아요 요청 중 오류 발생:', error);
      console.log(`${BASE_URL}/notice/${id}/like`);
      setIsHeartFilled(!newHeartStatus); // 오류 발생 시 상태 되돌림
    }
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const getCurrentUserId = () => {
    return localStorage.getItem('userId') || 'unknownUser'; // 예: 기본값으로 'unknownUser' 반환
  };


  const submitReport = async () => {
    try {
      const reason = reportContent; // 신고 내용
      const reporterId = getCurrentUserId(); // 신고자 ID

      // URL에 파라미터로 reason과 reporterId 추가
      const url = `${BASE_URL}/notice/${id}/report?reason=${encodeURIComponent(reason)}&reporterId=${encodeURIComponent(reporterId)}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders(), // 필요한 헤더 추가
      });

      if (response.ok) {
        setReportContent(''); // 신고 내용 초기화
        togglePopup(); // 팝업 닫기
        setIsAlertOpen(true); // 성공 알림 표시

        setTimeout(() => {
          setIsAlertOpen(false);
        }, 3000);
      } else {
        console.error('신고 제출에 실패했습니다.');
      }
    } catch (error) {
      console.error('신고 제출 중 오류 발생:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      return;
    }

    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`${BASE_URL}/notice/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'ngrok-skip-browser-warning': 1
        },
      });

      if (response.ok) {
        alert("게시글이 삭제되었습니다.");
        // 삭제 후 원하는 동작 수행 (예: 목록 페이지로 이동)
        window.location.href = "/noticeboardPage"; // 목록 페이지 경로로 이동
      } else {
        const errorData = await response.json();
        console.error("삭제 실패:", errorData);
        alert("게시글 삭제에 실패했습니다.");
        console.log(`${BASE_URL}/notice/delete/${id}`);
      }
    } catch (error) {
      console.error("삭제 요청 중 오류 발생:", error);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

    // handleScrap 함수 수정
const handleScrap = async () => {
  try {
    const response = await fetch(`${BASE_URL}/notice/${id}/scrap`, {
      method: 'POST',
      headers: getAuthHeaders(), // getAuthHeaders()로 인증 헤더 포함
    });

    if (response.ok) {
      console.log('스크랩 요청 성공');
      alert('스크랩이 완료되었습니다.'); // 스크랩 완료 팝업
      navigate("/scrap"); // 요청 성공 후 스크랩 페이지로 이동
    } else {
      console.error('스크랩 요청 실패');
    }
  } catch (error) {
    console.error('스크랩 요청 중 오류 발생:', error);
  }
};

const handleEdit = async () => {
  try {
    // API 요청 보내기
    const response = await fetch(`${BASE_URL}/notice/update/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    // 응답 처리
    if (response.ok) {
      const data = await response.json();
      console.log("수정 가능한 데이터를 가져왔습니다:", data);

      // 데이터를 활용해 수정 화면으로 이동하거나 상태 업데이트
      // 예: navigate(`/edit/${id}`) 또는 수정 데이터 상태 업데이트
    } else {
      console.error("수정 데이터를 가져오지 못했습니다:", response.status);
    }
  } catch (error) {
    console.error("수정 요청 중 오류가 발생했습니다:", error);
  }
};

  return (
    <div>
      <Header />
      <div className={styles["content"]}>
        <img
          src={arrow}
          className={styles["app-arrow"]}
          alt="back_arrow"
          onClick={handleBackClick}
        />
        <h1 className={styles["title-text2"]}>공지사항</h1>
        <img src={bar} className={styles["app-bar"]} alt="bar" />

        <h1 className={styles["title-text3"]}>{title || "게시판 제목"}</h1>

        <div className={styles["right-section"]}>
          {/* 첫 번째 이미지 */}
          <div
            className={styles["hover-image"]}
            onClick={() => navigate("/ChatRoom")}
          >
            <img
              src={main_message}
              className={styles["app-main_message2"]}
              alt="main_message"
            />
          </div>

          {/* 두 번째 이미지 */}
          <div
            className={styles["hover-image"]}
            onClick={handleScrap}
          >
            <img
              src={scrab}
              className={styles["app-main_message3"]}
              alt="scrab"
            />
          </div>
        </div>

        <h2 className={styles["title-text4"]}>작성일 : {createdTime}</h2>
        <div className={styles["report"]}>
          <button onClick={handleEdit} className={styles["edit-button"]}>
          수정하기
          </button>
          <button onClick={handleDelete} className={styles["delete-button"]}>
            삭제하기
          </button>
          <button onClick={togglePopup} className={styles["report-button"]}>
            신고하기
          </button>
        </div>
      </div>

      {isPopupOpen && (
        <div className={styles["popup"]}>
          <div className={styles["popup-inner"]}>
            <h3>신고하기</h3>
            <p>신고 내용을 입력하세요:</p>
            <textarea
              className={styles["popup-textarea"]}
              value={reportContent}
              onChange={(e) => {
                setReportContent(e.target.value);
              }}
            />
            <div className={styles["popup-button-container"]}>
              <button onClick={togglePopup} className={styles["popup-close"]}>
                닫기
              </button>
              <button onClick={submitReport} className={styles["popup-receive"]}>
                제출
              </button>
            </div>
          </div>
        </div>
      )}

      {isAlertOpen && (
        <div className={styles["alert-popup"]}>제출이 완료되었습니다.</div>
      )}

      {/* 서버에서 받은 이미지 렌더링 */}
      <div className={styles["image-section"]}>
        {imageUrls.length > 0 ? (
          <div className={styles["image-grid"]}>
            {imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`게시물 이미지 ${index + 1}`}
                className={styles["uploaded-image"]}
              />
            ))}
          </div>
        ) : (
          <p className={styles["no-image"]}></p>
        )}
      </div>

      {/* 산업연계게시판 내용(수정 가능 시) */}
      <div className={styles["content-input"]}>
        <textarea
          className={styles["textarea"]}
          value={content}
          onChange={handleContentChange}
          placeholder="내용을 입력하세요."
          disabled
        />
      </div>



      {/* 파일 업로드 */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* 좋아요 하트 */}
      <div className={styles["heart"]}>
        <img
          src={isHeartFilled ? filledHeart : heart}
          className={styles["app-heart"]}
          alt="heart"
          onClick={handleHeartClick}
        />
      </div>      
    </div>
  );

};

export default Announcementposting;
