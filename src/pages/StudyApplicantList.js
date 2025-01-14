import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive'; // 반응형 페이지 만들기 위함
import axiosInstance from '../utils/api.js';
import Header from './_.js'; // 상단바 컴포넌트
import styles from './StudyApplicantList.module.css';
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

const StudyApplicantList = () => {
    const [menuOpen, setMenuOpen] = useState(false);  // 드롭다운 상태 관리
    const [posts, setPosts] = useState([]); // 게시물 목록 상태 관리
    const { studyId } = useParams();
    const [applicants, setApplicants] = useState([]); // 지원자 목록 상태 관리

    const navigate = useNavigate(); // useNavigate 훅을 컴포넌트 내부에서 호출
    const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });

    // 게시물 목록을 가져오는 함수
    useEffect(() => {
        const fetchApplicants = async () => {
            const accessToken = localStorage.getItem('authToken');
            if (!accessToken) {
                console.error('Access Token이 없습니다. 로그인을 확인하세요.');
                alert('로그인이 필요합니다.');
                return;
            }

            try {
                const response = await axiosInstance.get(`https://2ecb-2406-5900-10f0-c886-1c07-11ef-e410-ee21.ngrok-free.app/api/board/studies/${studyId}/applicants`,

                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'ngrok-skip-browser-warning': 'true',
                        },
                    }
                );
                // 응답 데이터
                const data = response.data;

                // 응답 데이터 유효성 검증 및 상태 업데이트
                if (data && data.applicants && Array.isArray(data.applicants)) {
                    if (data.applicants.length > 0) {
                        setApplicants(data.applicants); // 지원자 목록 상태 저장
                        console.log('지원자 데이터:', data.applicants);
                    } else {
                        console.warn('지원자 목록이 비어있습니다.');
                        setApplicants([]); // 빈 배열로 초기화
                    }
                } else {
                    console.error('API 응답이 올바르지 않습니다.');
                    alert('데이터를 불러오는데 문제가 발생했습니다.');
                }

            } catch (error) {
                // 오류 처리
                console.log('studyId:', studyId);
                console.error('지원자 목록을 불러오는 중 오류 발생:', error);
                alert('지원자 데이터를 가져오는 중 문제가 발생했습니다. 다시 시도해주세요.');
            }
        };

        // 함수 실행
        fetchApplicants();
    }, [studyId]); // page, size, studyId 변경 시 재호출



    const toggleMenu = () => {
        setMenuOpen((prevMenuOpen) => !prevMenuOpen); // 드롭다운 메뉴 열기/닫기 토글
    };

    const handleBoardChange = (boardName) => {
        if (boardName === '내가 작성한 스터디') {
            navigate('/MyStudy/'); // 질문 게시판으로 이동
        }
        setMenuOpen(false); // 메뉴 닫기
    };



    const handlePostClick = (postId) => {
        navigate(`/StudyApplicantList/${postId}`); // 해당 게시물 상세 페이지로 이동
    };

    const handleAccept = async (applyId) => {
        const accessToken = localStorage.getItem('authToken');
        console.log(accessToken);

        try {
            await axiosInstance.post(`https://2ecb-2406-5900-10f0-c886-1c07-11ef-e410-ee21.ngrok-free.app/api/board/studies/apply/${applyId}/accept`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });
            alert('지원 신청이 성공적으로 수락되었습니다.');
            setApplicants((prev) =>
                prev.map((applicant) =>
                    applicant.applyId === applyId ? { ...applicant, accept: true } : applicant
                )
            );
        } catch (error) {
            console.error('지원 수락 중 오류 발생:', error);
            alert('지원 수락에 실패했습니다.');
        }
    };

    const handleReject = async (applyId) => {
        const accessToken = localStorage.getItem('authToken');
        console.log(accessToken);

        try {
            await axiosInstance.delete(`https://2ecb-2406-5900-10f0-c886-1c07-11ef-e410-ee21.ngrok-free.app/api/board/studies/apply/${applyId}/reject`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });
            alert('지원 신청이 성공적으로 거절되었습니다.');
            setApplicants((prev) =>
                prev.map((applicant) =>
                    applicant.applyId === applyId ? { ...applicant, accept: false } : applicant
                )
            );
        } catch (error) {
            console.error('지원 거절 중 오류 발생:', error);
            alert('지원 거절에 실패했습니다.');
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
                        className={`${styles.goBackButton} ${isDesktop ? styles["desktopGoBackButton"] : ''}`}
                        alt="뒤로가기"
                        onClick={() => navigate(-1)} /* 뒤로 가기 동작 추가 */
                    />
                    {/* 페이지 타이틀 */}
                    <h1 className={`${styles.pageTitle} ${isDesktop ? styles["desktopPageTitle"] : ''}`}>
                        지원자 목록
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
                            onClick={() => handleBoardChange('내가 작성한 스터디')}
                        >
                            내가 작성한 스터디
                        </div>
                    </div>
                )}

                {/* 지원자 목록 */}
                <div className={styles.postList}>
                    {applicants.map((applicant) => (
                        <div key={applicant.applyId} className={styles.postItem}
                            style={{
                                backgroundColor: applicant.accept ? 'yellow' : 'white', // 수락 상태에 따라 배경색 설정
                            }}
                        >
                            {/* 지원자 정보 */}
                            <div className={styles.postInfo}>
                                <span className={styles.postTitle}>{applicant.applyId}.<br></br>{applicant.applyUserId}</span>
                            </div>

                            {/* 신청 수락 거절 버튼 */}
                            <div className={`${styles.sortButtons} ${isDesktop ? styles.desktopSortButtons : ''}`}>
                                <button
                                    className={`${styles.latestSortButton} ${isDesktop ? styles.desktopLatestSortButton : ''}`}
                                    onClick={() => handleAccept(applicant.applyId)}
                                >
                                    수락
                                </button>
                                <button
                                    className={`${styles.latestSortButton} ${isDesktop ? styles.desktopRecommendSortButton : ''}`}
                                    onClick={() => handleReject(applicant.applyId)}
                                >
                                    거절
                                </button>
                            </div>
                        </div>
                    ))}
                </div>


            </div>
        </div>
    );
};


export default StudyApplicantList;