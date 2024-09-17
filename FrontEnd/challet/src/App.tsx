import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import 'react-dates/lib/css/_datepicker.css';

import ChallengeFeed from './components/Challenge/ChallengeFeed';
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
import MyDataSelectPage from './pages/MyDataSelectPage/MyDataSelectPage';
import ChallengeCreateButton from './components/Challenge/ChallengeCreateButton'; // 챌린지 생성 컴포넌트
import ChallengeCreatePage from './components/Challenge/ChallengeCreatePage'; // 새로운 챌린지 생성 페이지 컴포넌트
import './App.css';

function App() {
  const location = useLocation();

  // Navbar를 숨길 경로들 정의
  const hideNavbarRoutes = ['/challenge/create', '/payment', '/payresult'];

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
        <Route
          path='/challenge/create'
          element={<ChallengeCreatePage />}
        />{' '}
        {/* 새로운 라우트 추가 */}
        <Route path='/analysis' element={<AnalysisPage />} />
        <Route path='/payment' element={<PaymentPage />} />
        <Route path='/payresult' element={<PayResult />} />
        <Route path='/mydataselect' element={<MyDataSelectPage />} />
        <Route path='/my' element={<MyPage />} />
        <Route path='/challet-service/users/login' element={<LoginPage />} />
        <Route path='/challet-service/challenges' element={<ChallengePage />} />
        <Route
          path='/challet-service/challenges/:id'
          element={<ChallengeFeed />}
        />
      </Routes>

      {/* /challenge 경로에서만 챌린지 생성 버튼 보여줌 */}
      {location.pathname === '/challenge' && <ChallengeCreateButton />}

      {/* 특정 경로에서는 Navbar 숨김 */}
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
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
