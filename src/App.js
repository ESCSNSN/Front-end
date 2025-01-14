import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // 라우팅 관련 컴포넌트
import StartPage from './pages/StartPage';
import _ from './pages/_';
import LoginPage from './pages/LoginPage'; // .의 의미: 현재 디렉토리(src)에서 pages 폴더로 들어가서 LoginPage.js 파일을 가져온다는 것.

//소윤 
import FindIDPage from './pages/FindIDPage'; // FindID 페이지
import FindPWPage from './pages/FindPWPage'; // FindPW 페이지
import JoinPage from './pages/JoinPage'; // 회원가입 페이지
import FreepostingPage from './pages/FreepostingPage'; // 자유게시글 작성 페이지
import QuestionpostingPage from './pages/QuestionpostingPage'; // 질문게시글 작성 페이지
import FreewritePage from './pages/FreewritePage'; // 자유게시글 작성 페이지
import QuestionwritePage from './pages/QuestionwritePage'; // 질문게시글 작성 페이지
import FreeboardPage from './pages/FreeboardPage'; // 자유게시판 페이지
import QuestionboardPage from './pages/QuestionboardPage'; // 질문게시판 페이지
// 졸업생 자유/질문 게시판 
import G_freepostingPage from './pages/G_freepostingPage'; // G_ 자유게시글 작성 페이지
import G_questionpostingPage from './pages/G_questionpostingPage'; // G_ 질문게시글 작성 페이지
import G_freewritePage from './pages/G_freewritePage'; // G_ 자유게시글 작성 페이지
import G_questionwritePage from './pages/G_questionwritePage'; // G_ 질문게시글 작성 페이지
import G_freeboardPage from './pages/G_freeboardPage'; // G_ 자유게시판 페이지
import G_questionboardPage from './pages/G_questionboardPage'; // G_ 질문게시판 페이지

import Makechat from './pages/Makechat';
import Announcementwrite from './pages/Announcementwrite'; // 공지사항
import Announcementposting from './pages/Announcementposting'; // 공지사항


//상윤님
// import BoardPage from './pages/BoardPage';// 게시판 메인 페이지
import QuestionCode from './pages/QuestionCode';// 코드 질문방 본문
import RoomPage from './pages/RoomPage'; // 내가속한방 추가
import Message from './pages/Message'; // 쪽지방
import InformationCode from './pages/InformationCode'; // 정보 게시판 - 코드 질문방
import InformationContest from './pages/InformationContest'; // 대회 정보게시판
import ContestWrite from './pages/ContestWrite'; // 대회 글쓰기
import AlarmPage from './pages/AlarmPage'; // 알림페이지
import Announcement from './pages/Announcement'; // 공지사항
import BootBoardPage from './pages/BootBoardPage'; // 부트갬프 게시판 목록

import BoardCode from './pages/BoardCode';
import InformationCodeBoard from './pages/InformationCodeBoard'
import InformationContestBoard from './pages/InformationContestBoard';
import MyStudy from './pages/MyStudy';
import MyApplyStudy from './pages/MyApplyStudy';
import StudyApplicantList from './pages/StudyApplicantList';


// 석진이형 페이지
import NoticeBoard from './pages/NoticeBoard';
import WritePage from './pages/WritePage';
import Classroom from './pages/Classroom';
import BootCamp from './pages/BootCamp';
import Industry from './pages/Industry';
import Study from './pages/Study';
import NoticeBoot from './pages/NoticeBoot';
import Scrap from './pages/Scrap';
import My_board from './pages/My_board';
import My_message from './pages/My_message';
import ChatRoom from './pages/ChatRoom'; // 정확한 경로로 ChatRoom 컴포넌트 import
import StudyBoard from './pages/StudyBoard'; // 정확한 경로로 ChatRoom 컴포넌트 import
import BootBoard from './pages/BootBoard'; // 정확한 경로로 ChatRoom 컴포넌트 import
import IndustryBoard from './pages/IndustryBoard'; // 정확한 경로로 ChatRoom 컴포넌트 import

// 영현이 페이지
import Class_Room from './pages/Class_Room'
import FreeRoom from './pages/FreeRoom'
import Profileedit from './pages/Profileedit'
import Myprofile from './pages/Myprofile'
import ChatPreview from './pages/ChatPreview'
import Otherprofile from './pages/Otherprofile'
import { UserProvider } from './pages/UserContext'; //유저 프로필
import User_auth from './pages/User_auth'
import FreeChat from './pages/FreeChat'
import RoomChat from './pages/RoomChat'
import G_HomePage from './pages/G_HomePage'
import HomePage from './pages/HomePage'; // 정확한 경로로 import 추가
import G_Chat from './pages/G_Chat'
import Home from './pages/Home'
import _2 from './pages/_2';


// 지민이가 만든 채팅방 페이지
import ClassChatRoom from './pages/ClassChatRoom'
import ClassChat from './pages/ClassChat'


Object.defineProperty(console, '_commandLineAPI', { get : function() { throw '콘솔을 사용할 수 없습니다.' } });


function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>

          {/* 쏘유니 */}
          <Route path="/" element={<StartPage />} />
          <Route path="/StartPage" element={<StartPage />} />
          <Route path="/_" element={<_ />} /> {/* 두 번째 페이지 라우팅 */}
          <Route path="/LoginPage" element={<LoginPage />} />
          <Route path="/FindIDPage" element={<FindIDPage />} />
          <Route path="/FindPWPage" element={<FindPWPage />} />
          <Route path="/JoinPage" element={<JoinPage />} />

          <Route path="FreepostingPage/:id" element={<FreepostingPage />} />
          <Route path="QuestionpostingPage" element={<QuestionpostingPage />} />
          <Route path="FreewritePage" element={<FreewritePage />} />
          <Route path="FreewritePage/:id" element={<FreewritePage />} />
          <Route path="QuestionwritePage" element={<QuestionwritePage />} />
          <Route path="QuestionwritePage/:id" element={<QuestionwritePage />} />
          <Route path="FreeboardPage" element={<FreeboardPage />} />
          <Route path="QuestionboardPage" element={<QuestionboardPage />} />

          <Route path="G_freepostingPage" element={<G_freepostingPage />} />
          <Route path="G_questionpostingPage" element={<G_questionpostingPage />} />
          <Route path="G_freewritePage" element={<G_freewritePage />} />
          <Route path="G_freewritePage/:id" element={<G_freewritePage />} />
          <Route path="G_questionwritePage" element={<G_questionwritePage />} />
          <Route path="G_questionwritePage/:id" element={<G_questionwritePage />} />
          <Route path="G_freeboardPage" element={<G_freeboardPage />} />
          <Route path="G_questionboardPage" element={<G_questionboardPage />} />

          <Route path="/Makechat" element={<Makechat />} />
          <Route path="/Announcementwrite" element={<Announcementwrite />} />
          <Route path="/Announcementwrite/:id" element={<Announcementwrite />} />
          <Route path="/Announcementposting/:id" element={<Announcementposting />} />



          {/* 상윤님 */}
          {/* <Route path="/BoardPage" element={<BoardPage />} /> 게시판 메인 페이지 */}
          <Route path="/QuestionCode" element={<QuestionCode />} /> {/* 코드 질문방 본문 */}
          <Route path="/QuestionCode/:id" element={<QuestionCode />} /> {/* 코드 질문방 본문 */}
          <Route path="/RoomPage" element={<RoomPage />} />
          <Route path="/Message" element={<Message />} />
          <Route path="/InformationCode" element={<InformationCode />} /> {/* InformationCode 라우트 추가 */}
          <Route path="/InformationContest" element={<InformationContest />} />
          <Route path="/ContestWrite" element={<ContestWrite />} />
          <Route path="/ContestWrite/:id" element={<ContestWrite />} />
          <Route path="/AlarmPage" element={<AlarmPage />} />
          <Route path="/Announcement" element={<Announcement />} />
          <Route path="/ClassChatRoom" element={<ClassChatRoom />} />
          <Route path="/ClassChat" element={<ClassChat />} />
          <Route path="/BootBoardPage" element={<BootBoardPage />} />
          <Route path="/BoardCode/:id" element={<BoardCode />} />
          <Route path="/InformationCodeBoard/:id" element={<InformationCodeBoard />} />
          <Route path="/InformationContestBoard/:id" element={<InformationContestBoard />} />
          <Route path="/MyStudy" element={<MyStudy />} />
          <Route path="/MyApplyStudy" element={<MyApplyStudy />} />
          <Route path="/StudyApplicantList/:studyId" element={<StudyApplicantList />} />








          <Route path="/ChatRoom/:id" element={<ChatRoom />} /> {/* 동적 라우팅을 통한 채팅방 페이지 */}

          {/* 석진님 페이지*/}
          <Route path="/Noticeboard" element={<NoticeBoard />} />
          <Route path="/Write" element={<WritePage />} />
          <Route path="/Classroom" element={<Classroom />} />
          <Route path="/Bootcamp" element={<BootCamp />} />
          <Route path="/Bootcamp/:id" element={<BootCamp />} />
          <Route path="/Industry" element={<Industry />} />
          <Route path="/Industry/:id" element={<Industry />} />
          <Route path="/Study" element={<Study />} />
          <Route path="/Study/:id" element={<Study />} />
          <Route path="/NoticeBoot" element={<NoticeBoot />} />
          <Route path="/Scrap" element={<Scrap />} />
          <Route path="/My_board" element={<My_board />} />
          <Route path="/My_message" element={<My_message />} />
          <Route path="/StudyBoard/:id" element={<StudyBoard />} />
          <Route path="/BootBoard/:id" element={<BootBoard />} />
          <Route path="/IndustryBoard/:id" element={<IndustryBoard />} />

          {/* 영현 페이지*/}
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/Class_Room" element={<Class_Room />} />
          <Route path="/FreeRoom" element={<FreeRoom />} />
          <Route path="/Profileedit" element={<Profileedit />} />
          <Route path="/Myprofile" element={<Myprofile />} />
          <Route path="/ChatPreview" element={<ChatPreview />} />
          <Route path="/ChatPreview/:id" element={<ChatPreview />} />
          <Route path="/ChatPreview/:roomId/:roomType" element={<ChatPreview />} />
          
         <Route path="/Otherprofile" element={<Otherprofile />} />

          <Route path="/Otherprofile/:roomId/:userId" element={<Otherprofile />} />
          
          <Route path="/User_auth" element={<User_auth />} />
          <Route path="/G_HomePage" element={<G_HomePage />} />

          <Route path="/Home" element={<Home />} />

          <Route path="/_2" element={<_2 />} />

          <Route path="/" element={<G_HomePage />} />
          <Route path="/G_questionpostingPage/:id" element={<G_questionpostingPage />} />
          <Route path="/G_freepostingPage/:id" element={<G_freepostingPage />} />
          <Route path="/QuestionpostingPage/:id" element={<QuestionpostingPage />} />
          <Route path="/FreepostingPage/:id" element={<FreepostingPage />} />
          <Route path="/FreeChat/" element={<FreeChat />} />
          <Route path="/FreeChat/:roomId" element={<FreeChat />} />
          <Route path="/RoomChat/" element={<RoomChat />} />
          <Route path="/RoomChat/:roomId" element={<RoomChat />} />
          
          <Route path="/ClassChatRoom/:roomId" element={<ClassChatRoom />} />
          <Route path="/G_Chat/" element={<G_Chat />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>

  );
}

export default App;