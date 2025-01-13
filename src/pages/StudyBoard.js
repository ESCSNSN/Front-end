import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from "./StudyBoard.module.css";
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
const BASE_URL = 'https://1c9e-2406-5900-10f0-c886-dc6f-be50-3736-d1bc.ngrok-free.app/api/board';
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



const StudyBoard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [content, setContent] = useState('');
  const [comments, setComments] = useState([]); // 기본값을 빈 배열로
  const [commentContent, setCommentContent] = useState('');
  const [replyContents, setReplyContents] = useState([]);
  const [nickname, setNickname] = useState('');
  const [nicknameCount, setNicknameCount] = useState({ int: 0, short: 0, double: 0, char: 0 });
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
  const [anonymousId, setAnonymousId] = useState('');


  // 게시판 데이터 불러오기 useEffect
  useEffect(() => {
    const getBoard = async () => {
      const accessToken = localStorage.getItem('authToken');
      console.log(id);

      try {
        const response = await fetch(`${BASE_URL}/studies/${id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'ngrok-skip-browser-warning': 1,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('게시글 데이터:', data);

          // studiesCreatedTime 변환
          const formattedDate = new Date(data.studyCreatedTime).toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          // 상태 업데이트
          setContent(data.studiesContents);
          setTitle(data.studiesTitle);
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
        const response = await fetch(`${BASE_URL}/studies/${id}/like-status`, {
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

  // 댓글 및 대댓글을 계층 구조로 정리하는 함수
const organizeComments = (comments) => {
  const commentMap = {};  // 댓글을 id별로 매핑하기 위한 객체
  const nicknameMap = {};  // anonymousId에 따른 닉네임 매핑 객체
  const structuredComments = [];  // 최종적으로 계층 구조로 정리된 댓글 배열

  // 댓글을 매핑 객체에 추가
  comments.forEach((comment) => {
    // anonymousId에 따른 닉네임 매핑
    const { anonymousId } = comment;
    if (!nicknameMap[anonymousId]) {
      nicknameMap[anonymousId] = generateNickname(Object.keys(nicknameMap).length);
    }
    comment.nickname = nicknameMap[anonymousId];

    // 댓글에 빈 replies 배열 추가
    commentMap[comment.id] = { ...comment, replies: [] };
  });

  // 댓글 계층 구조 구성
  comments.forEach((comment) => {
    if (comment.parentCommentId) {
      // 부모 댓글이 있는 경우, 해당 댓글의 replies에 대댓글 추가
      if (commentMap[comment.parentCommentId]) {
        commentMap[comment.parentCommentId].replies.push(commentMap[comment.id]);
      }
    } else {
      // 부모 댓글이 없는 경우(즉, 댓글인 경우) 최상위 댓글 배열에 추가
      structuredComments.push(commentMap[comment.id]);
    }
  });

  return structuredComments;
};

 // 댓글 불러오기 useEffect
useEffect(() => {
  const fetchComments = async () => {
    try {
      const response = await fetch(`${BASE_URL}/studies/${id}/comments`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("댓글 API 응답:", data);

        // 댓글과 대댓글을 계층 구조로 정리
        const structuredComments = organizeComments(data.content);
        setComments(structuredComments); // 댓글 및 대댓글 갱신
      } else {
        console.error("댓글 데이터를 가져오는데 실패했습니다.");
      }
    } catch (error) {
      console.error("댓글 데이터 요청 중 오류:", error);
    }
  };

  fetchComments();
}, [id]);
  

  // 댓글 추가 핸들러
const handleAddComment = async () => {
  if (commentContent.trim() !== '') {
    const newNicknameCount = { ...nicknameCount };
    newNicknameCount[nickname] = (newNicknameCount[nickname] || 0) + 1;
    setNicknameCount(newNicknameCount);

    const localStorageKey = `anonymousId_${id}`;
    let anonymousId = localStorage.getItem(localStorageKey);

    if (!anonymousId) {
      // 'char', 'int', 'short', 'double' 중 하나를 랜덤으로 선택
      const idOptions = ['char', 'int', 'short', 'double'];
      anonymousId = idOptions[Math.floor(Math.random() * idOptions.length)];

      // 생성된 anonymousId를 localStorage에 저장
      localStorage.setItem(localStorageKey, anonymousId);
    }

    const newComment = {
      nickname: `${nickname}${newNicknameCount[nickname]}`,
      content: commentContent,
      replies: [],
      anonymousId: anonymousId, // anonymousId를 추가하여 서버로 전송
    };

    try {
      const response = await fetch(`${BASE_URL}/studies/${id}/comments/add?content=${encodeURIComponent(commentContent)}&anonymousId=${encodeURIComponent(anonymousId)}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newComment),
      });

      if (response.ok) {
        const savedComment = await response.json(); // 서버에서 저장된 댓글 데이터 반환

        // savedComment에 nickname 정보가 없으면 newComment에서 가져와 병합
        const mergedComment = { ...savedComment, nickname: newComment.nickname };

        setComments((prevComments) => [...prevComments, mergedComment]);
        setNicknameCount((prev) => ({ ...prev, [nickname]: prev[nickname] }));
        window.location.reload(); // 페이지 새로 고침
        setCommentContent(''); // 입력 필드 초기화
      } else {
        console.error('댓글 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('댓글 추가 중 오류 발생:', error);
    }
  }
};

// 대댓글 추가 핸들러
const handleAddReply = async (index) => {
  if (replyContents[index]?.trim() !== '') {
    const updatedComments = [...comments];

    const newNicknameCount = { ...nicknameCount };
    newNicknameCount[nickname] = (newNicknameCount[nickname] || 0) + 1;
    setNicknameCount(newNicknameCount);

    const localStorageKey = `anonymousId_${id}`;
    let anonymousId = localStorage.getItem(localStorageKey);

    if (!anonymousId) {
      const idOptions = ['char', 'int', 'short', 'double'];
      anonymousId = idOptions[Math.floor(Math.random() * idOptions.length)];

      localStorage.setItem(localStorageKey, anonymousId);
    }

    const parentCommentId = comments[index]?.id;
    if (!parentCommentId) {
      console.error('부모 댓글 ID가 없습니다.');
      return;
    }

    const content = replyContents[index];
    const replyNickname = `${nickname}${newNicknameCount[nickname]}`;

    const newReply = {
      nickname: replyNickname,
      content,
      anonymousId, // anonymousId 추가
    };

    try {
      const response = await fetch(
        `${BASE_URL}/studies/${id}/comments/add?parentCommentId=${parentCommentId}&content=${encodeURIComponent(content)}&anonymousId=${encodeURIComponent(anonymousId)}`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(newReply),
        }
      );

      if (response.ok) {
        const savedReply = await response.json();

        if (!updatedComments[index].replies) {
          updatedComments[index].replies = [];
        }
        updatedComments[index].replies.push(savedReply);
        setComments(updatedComments);

        const newReplyContents = [...replyContents];
        newReplyContents[index] = '';
        setReplyContents(newReplyContents);
        setReplyVisible((prev) => ({ ...prev, [index]: false }));
        window.location.reload(); // 페이지 새로 고침

      } else {
        console.error('대댓글 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('대댓글 추가 중 오류 발생:', error);
    }
  }
};

  

  const handleToggleReply = (index) => {
    setReplyVisible((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleHeartClick = async () => {
    const newHeartStatus = !isHeartFilled;
    setIsHeartFilled(newHeartStatus);

    try {
      const response = await fetch(`${BASE_URL}/studies/${id}/like`, {
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
      console.log(`${BASE_URL}/studies/${id}/like`);
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
      const url = `${BASE_URL}/studies/${id}/report?reason=${encodeURIComponent(reason)}&reporterId=${encodeURIComponent(reporterId)}`;

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
      const accessToken = localStorage.getItem('authToken');
      const response = await fetch(`${BASE_URL}/studies/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'ngrok-skip-browser-warning': 1
        },
      });

      if (response.ok) {
        alert("게시글이 삭제되었습니다.");
        // 삭제 후 원하는 동작 수행 (예: 목록 페이지로 이동)
        window.location.href = "/studiesboardPage"; // 목록 페이지 경로로 이동
      } else {
        const errorData = await response.json();
        console.error("삭제 실패:", errorData);
        alert("게시글 삭제에 실패했습니다.");
        console.log(`${BASE_URL}/studies/delete/${id}`);
      }
    } catch (error) {
      console.error("삭제 요청 중 오류 발생:", error);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

    // handleScrap 함수 수정
const handleScrap = async () => {
  try {
    const response = await fetch(`${BASE_URL}/studies/${id}/scrap`, {
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
    const response = await fetch(`${BASE_URL}/studies/update/${id}`, {
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

// 신청버튼 위한 로직 추가함
const handleApply = async () => {
  const accessToken = localStorage.getItem('authToken');
  console.log(id);

  try {
    const response = await fetch(`${BASE_URL}/studies/${id}/apply`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`, // 인증 헤더
        'Content-Type': 'application/json', // 요청 본문 형식 명시
        'ngrok-skip-browser-warning': 'true', // 추가 헤더
      },
    });

    if (response.ok) {
      console.log('지원 요청 성공');
      alert('지원 요청이 완료되었습니다.'); // 성공 팝업
      navigate("/scrap"); // 요청 성공 후 신청 관리 페이지로 이동하게 해야함.
    } else {
      const errorData = await response.json();
      console.error('지원 요청 실패:', errorData);
      alert(`지원 요청 실패: ${errorData.message || '알 수 없는 오류'}`);
    }
  } catch (error) {
    console.error('지원 요청 중 오류 발생:', error);
    alert('지원 요청 중 오류가 발생했습니다. 다시 시도해주세요.');
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
        <h1 className={styles["title-text2"]}>스터디 게시판</h1>
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
          <button onClick={handleApply} className={styles["edit-button"]}>
          신청하기
          </button>

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

      {/* 스터디게시판 내용(수정 가능 시) */}
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

      {/* 댓글 입력 */}
      <div className={styles["content-input2"]}>
        <textarea
          className={styles["textarea2"]}
          value={commentContent}
          onChange={handleCommentChange}
          placeholder="댓글을 입력하세요."
        />
      </div>
      <div className={styles["reply-button"]}>
        <button onClick={handleAddComment}>댓글 달기</button>
      </div>

      {/* 댓글 목록 */}
      <div className={styles["comments-section"]}>
        {(comments || []).map((comment, index) => (
          <div key={index} className={styles["comment-item"]}>
            <strong>{comment.nickname}:</strong> {comment.content}
            <div className={styles["reply-container"]}>
              <button
                className={styles["toggle-reply-button"]}
                onClick={() => handleToggleReply(index)}
              >
                {replyVisible[index] ? "대댓글 숨기기" : "대댓글 달기"}
              </button>
            </div>

            {replyVisible[index] && (
              <div className={styles["reply-input"]}>
                <textarea
                  className={styles["textarea_reply"]}
                  value={replyContents[index] || ""}
                  onChange={(e) => handleReplyChange(index, e)}
                  placeholder="대댓글을 입력하세요."
                />
                <div className={styles["button-container"]}>
                  <button onClick={() => handleAddReply(index)}>대댓글 달기</button>
                </div>
              </div>
            )}

            {comment.replies?.length > 0 && (
              <div className={styles["replies-section"]}>
                {comment.replies.map((reply, replyIndex) => (
                  <div key={replyIndex} className={styles["reply-item"]}>
                    <strong>{reply.nickname}:</strong> {reply.content}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

};

export default StudyBoard;
