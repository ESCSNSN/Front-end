import React, { useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Profileedit.module.css'; // 필요한 스타일 가져오기
import profileIcon from '../images/프로필.png'; // 프로필 아이콘
import main_mascot from '../images/대학 심볼 횃불이.png'; // 로고 이미지 불러오기
import main_bell from '../images/bell.png'; // 공지 아이콘
import main_message from '../images/message.png'; // 메시지 아이콘
import main_my from '../images/my.png'; // 프로필 아이콘
import CommunicationRoom_goBack from '../images/왼쪽 나가기 버튼.png';
import axios from 'axios';
import UserContext from './UserContext';
import { useMediaQuery } from 'react-responsive'; // 반응형 페이지 처리

import Header from './_2.js'; // 상단바 컴포넌트

const Profileedit = () => {
  const fileInputRef = useRef(null);
  const { user, updateUser } = useContext(UserContext); // 유저 정보 가져오기
  const [profilePicture, setProfilePicture] = useState(user.profilePicture || profileIcon);
  const [name, setName] = useState(user.name || '');
  const navigate = useNavigate();
  const [isDuplicate, setIsDuplicate] = useState(false);

  const isDesktop = useMediaQuery({ query: '(min-width: 769px)' }); // 반응형 처리

  // 닉네임 중복 확인
  const handleDuplicateCheck = async () => {
    try {
   //   const response = await axios.post('http://your-backend-api.com/check-username', { username: name });
     // setIsDuplicate(response.data.isDuplicate);
     // if (response.data.isDuplicate) {
     //   alert('이미 사용 중인 닉네임입니다.');
    //  } else {
    setIsDuplicate(true);
        alert('사용 가능한 닉네임입니다.');
    //  }
    } catch (error) {
      console.error('중복 확인 중 오류가 발생했습니다:', error);
    }
  };

  // 프로필 사진 변경
  const handleProfileClick = () => {
    fileInputRef.current.click();
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result); // 프로필 사진 업데이트
      };
      reader.readAsDataURL(file);
    }
  };

  // 프로필 저장
  const handleSaveProfile = async () => {
    if (isDuplicate) {
      alert('이미 사용 중인 닉네임입니다.');
      return;
    }

    const updatedUser = {
      roomId: user.roomId, // 기존 유저가 속한 방 ID
      userName: user.userName,
      userId: user.userId,
      profileUrl: profilePicture, // 업데이트된 프로필 사진
    };

    try {
      const response = await axios.post('http://info-rmation.kro.kr/updateProfile', updatedUser,{
            headers: {
                contentType: 'application/json',
                'ngrok-skip-browser-warning': 'abc',
                
            },
      });
      
      if (response.data.code === 200) {
        alert('프로필이 성공적으로 저장되었습니다.');
        updateUser(updatedUser); // 로컬 사용자 정보 업데이트
        navigate(-1); // 이전 페이지로 이동
      } else {
        alert('프로필 저장에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('프로필 저장 중 오류가 발생했습니다:', error);
      alert('프로필 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.app}>
      <Header />
{/*      <header className={styles['app-header']}>
        <div className={styles['title-group']}>
          <img src={main_mascot} className={styles['app-main_mascot']} alt="main_mascot" />
          <h2>INFO!</h2>
          <div className={styles['right-section']}>
            <img src={main_bell} className={styles['app-main_bell']} alt="main_bell" />
            <img src={main_message} className={styles['app-main_message']} alt="main_message" />
            <img src={main_my} className={styles['app-main_my']} alt="main_my" />
          </div>
        </div>
      </header> */}

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={`${styles.titleContainer} ${isDesktop ? styles.desktopTitleContainer : ''}`}>
            <img
              src={CommunicationRoom_goBack}
              className={styles.goBackButton}
              alt="뒤로가기"
              onClick={() => navigate(-1)}
            />
            <h1 className={styles.pageTitle}>내 프로필</h1>
          </div>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.profilePictureContainer} onClick={handleProfileClick}>
            <img src={profilePicture} alt="Profile" className={styles.profilePicture} />
            <input
              type="file"
              id="profilePicture"
              ref={fileInputRef}
              className={styles.fileInput}
              onChange={handleProfilePictureChange}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="name">닉네임</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
          />
          <button className={styles.duplicateButton} onClick={handleDuplicateCheck}>
            중복 확인
          </button>
          {isDuplicate && <span className={styles.duplicateWarning}>이미 사용 중인 닉네임입니다.</span>}
        </div>

        <button className={styles.saveButton} onClick={handleSaveProfile}>
          저장하기
        </button>
      </div>
    </div>
  );
};

export default Profileedit;
