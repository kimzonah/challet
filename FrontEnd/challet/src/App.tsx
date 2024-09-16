import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useMatch,
} from 'react-router-dom';
import 'react-dates/lib/css/_datepicker.css';

import ChallengeRoom from './components/Challenge/ChallengeRoom';
import OnboardingPage from './pages/OnboardingPage/OnboardingPage';
import PhoneAuthPage from './pages/PhoneAuthPage/PhoneAuthPage';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import LoginPage from './pages/LoginPage/LoginPage';
import Navbar from './components/navigation/Navbar';
import WalletPage from './pages/WalletPage/WalletPage';
import ChallengePage from './pages/ChallengePage/ChallengePage';
import AnalysisPage from './pages/AnalysisPage/AnalysisPage';
import MyPage from './pages/MyPage/MyPage';
import PaymentPage from './pages/PaymentPage/PaymentPage';
import PayResult from './pages/PayresultPage/PayresultPage';
import ChallengeCreateButton from './components/Challenge/ChallengeCreateButton'; // 챌린지 생성 컴포넌트
import ChallengeCreatePage from './components/Challenge/ChallengeCreatePage'; // 새로운 챌린지 생성 페이지 컴포넌트
import './App.css';

function App() {
  const location = useLocation();

  // 훅을 배열 순회 외부에서 호출하여 순서가 유지되도록 수정
  const matchChallengeCreate = useMatch('/challenge/create');
  const matchChallengeRoom = useMatch('/challengeRoom/:id');

  // 두 경로 중 하나와 매칭되는지 확인
  const shouldHideNavbar = matchChallengeCreate || matchChallengeRoom;

  return (
    <div className='min-h-screen flex flex-col justify-between'>
      {/* Routes 설정 */}
      <Routes>
        <Route path='/' element={<OnboardingPage />} />
        <Route path='/phone-auth' element={<PhoneAuthPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/wallet' element={<WalletPage />} />
        <Route path='/challenge' element={<ChallengePage />} />
        <Route path='/challenge/create' element={<ChallengeCreatePage />} />
        <Route path='/analysis' element={<AnalysisPage />} />
        <Route path='/payment' element={<PaymentPage />} />
        <Route path='/payresult' element={<PayResult />} />
        <Route path='/my' element={<MyPage />} />
        <Route path='/challet-service/users/login' element={<LoginPage />} />
        <Route path='/challengeRoom/:id' element={<ChallengeRoom />} />
      </Routes>

      {/* /challenge 경로에서만 챌린지 생성 버튼 보여줌 */}
      {location.pathname === '/challenge' && <ChallengeCreateButton />}

      {/* 특정 경로에서는 Navbar 숨김 */}
      {!shouldHideNavbar && <Navbar />}
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
