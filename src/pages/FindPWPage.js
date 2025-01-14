//pw js
import React, { useState } from 'react';
import styles from './FindPWPage.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import back_logo from '../images/뒷모습 횃불이.png';

const BASE_URL = "https://fd5ca3755e85.ngrok.app";

const FindPWPage = () => {
    const [name, setName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [email, setEmail] = useState('');
    const [enteredCode, setEnteredCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isCodeVerified, setIsCodeVerified] = useState(false);

    const [passwordPopup, setPasswordPopup] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(null);
    const [tempToken, setTempToken] = useState('');
    const [error, setError] = useState(''); // 에러 메시지 상태
    const [isStudent, setIsStudent] = useState(true); // 재학생 상태 추가

    const navigate = useNavigate();

    const handleSendVerificationCode = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/send-email`, null, {
                params: { email }
            });
            alert(response.data);
            setIsCodeSent(true);
        } catch (error) {
            console.error('Failed to send verification code:', error);
            alert('인증번호 전송에 실패했습니다.');
        }
    };

    const handleVerifyCode = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/verify-code`, null, {
                params: { email, code: enteredCode }
            });

            // 응답 데이터와 헤더를 콘솔에 출력하여 토큰의 위치를 확인
            console.log('Response Data:', response.data);
            console.log('Response Headers:', response.headers);

            alert(response.data.message || '인증에 성공했습니다.');
            setIsCodeVerified(true);
            setPasswordPopup(true); // 비밀번호 변경 팝업 열기

            // 토큰을 응답 헤더에서 추출 (예: 'Authorization' 헤더)
            const tokenFromHeader = response.headers['authorization'] || response.headers['Authorization'];
            if (tokenFromHeader && tokenFromHeader.startsWith('Bearer ')) {
                setTempToken(tokenFromHeader.substring(7)); // 'Bearer ' 접두사 제거
                console.log('Extracted Token:', tokenFromHeader.substring(7));
            } else {
                console.error('Token not found in response headers');
                alert('토큰을 응답에서 찾을 수 없습니다. 백엔드 팀에 문의하세요.');
            }
        } catch (error) {
            console.error('Verification failed:', error);
            alert('인증번호가 올바르지 않습니다.');
        }
    };

    const handlePasswordChange = (e) => {
        setNewPassword(e.target.value);
        checkPasswordMatch(e.target.value, confirmPassword);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        checkPasswordMatch(newPassword, e.target.value);
    };

    const checkPasswordMatch = (password1, password2) => {
        setPasswordMatch(password1 === password2);
    };

    const changePassword = async () => {
        if (!newPassword || !confirmPassword) {
            setError("모든 필드를 입력해 주세요.");
            return;
        }
    
        if (newPassword !== confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }
    
        // 비밀번호 규칙 검증
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            alert("비밀번호는 최소 8자 이상, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.");
            return;
        }
    

        try {
            // URLSearchParams를 사용하여 데이터를 URL 인코딩 형식으로 변환
            const params = new URLSearchParams();
            params.append('newPassword', newPassword); // 'newPassword' 필드 추가
    
            // 비밀번호 변경 요청
            const response = await axios.post(`${BASE_URL}/api/auth/change-password`, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': tempToken ? `Bearer ${tempToken}` : '' // tempToken이 있을 때만 설정
                }
            });
    
            alert(response.data);
            setPasswordPopup(false);
            setNewPassword('');
            setConfirmPassword('');
            setIsCodeSent(false);
            setIsCodeVerified(false);
            setEnteredCode('');
            setTempToken('');
            navigate('/LoginPage'); // 비밀번호 변경 후 로그인 페이지로 이동
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    alert("비밀번호 유효성 검사 실패 또는 인증 코드가 유효하지 않습니다.");
                } else if (error.response.status === 401) {
                    alert("인증되지 않은 요청입니다.");
                } else {
                    alert("비밀번호 변경 실패: 다시 시도해 주세요.");
                }
            } else {
                alert("비밀번호 변경 실패: 네트워크 오류.");
            }
            console.error('비밀번호 변경 실패:', error);
        }
    };
    

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.logoSection}>
                    <div className={styles["group-info"]}>
                        <img src={back_logo} className={styles["app-back_logo"]} alt="back_logo" />
                        <h2>INFO!</h2>
                    </div>
                </div>
            </header>
            <h1>비밀번호 찾기</h1>

            <div className={styles.loginBox}>
                <div className={styles.formContainer}>
                    

                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.jointext}>이메일</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="email"
                                id="email"
                                className={styles.input}
                                placeholder="이메일 입력 (@inu.ac.kr)"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button
                                className={styles.inputBtn}
                                onClick={handleSendVerificationCode}
                                disabled={isCodeSent}
                            >
                                인증번호 받기
                            </button>
                        </div>
                    </div>

                    {isCodeSent && (
                        <div className={styles.formGroup}>
                            <label htmlFor="verificationCode">인증번호 확인</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="text"
                                    id="verificationCode"
                                    placeholder="인증번호 입력"
                                    value={enteredCode}
                                    onChange={(e) => setEnteredCode(e.target.value)}
                                />
                                <button
                                    className={styles.inputBtn}
                                    onClick={handleVerifyCode}
                                    disabled={isCodeVerified}
                                >
                                    인증번호 확인
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <button
                    type="button"
                    className={styles.loginButton}
                    onClick={() => navigate('/LoginPage')}
                >
                    닫기
                </button>
            </div>
            {/* 비밀번호 변경 팝업 */}
            {passwordPopup && (
                <div className={styles.popup}>
                    <h4>비밀번호 설정</h4>
                    <input
                        type="password"
                        placeholder="새 비밀번호"
                        value={newPassword}
                        onChange={handlePasswordChange}
                        className={styles.inputField}
                    />
                    <input
                        type="password"
                        placeholder="비밀번호 확인"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        className={styles.inputField}
                    />
                    <button
                        type="button"
                        className={styles.changeBtn}
                        onClick={changePassword}
                    >
                        비밀번호 설정
                    </button>

                    {(!newPassword || !confirmPassword) && (
                        <p style={{ color: 'red' }}>비밀번호를 입력해 주세요.</p>
                    )}
                    {newPassword && confirmPassword && passwordMatch === false && (
                        <p style={{ color: 'red' }}>비밀번호가 일치하지 않습니다.</p>
                    )}
                    {newPassword && confirmPassword && passwordMatch && (
                        <p style={{ color: 'green' }}>비밀번호가 일치합니다.</p>
                    )}
                    <div className={styles.popupRow}>
                        <button
                            type="button"
                            className={styles.closeButton}
                            onClick={() => setPasswordPopup(false)}
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FindPWPage;
