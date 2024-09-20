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
import HistoryPage from './pages/HistoryPage/HistoryPage';
import HistoryDetailPage from './pages/HistoryDetailPage/HistoryDetailPage';
import TransferPage from './pages/TransferPage/TransferPage';
import ChallengePage from './pages/ChallengePage/ChallengePage';
import AnalysisPage from './pages/AnalysisPage/AnalysisPage';
import MyPage2 from './pages/MyPage/MyPage2';
import SetPasswordPage from './pages/SetPasswordPage/SetPasswordPage';
import PaymentPage from './pages/PaymentPage/PaymentPage';
import PayResult from './pages/PayresultPage/PayresultPage';
import MyDataSelectPage from './pages/MyDataSelectPage/MyDataSelectPage';
import ChallengeCreateButton from './components/Challenge/ChallengeCreateButton'; // 챌린지 생성 컴포넌트
import ChallengeCreatePage from './components/Challenge/ChallengeCreatePage'; // 새로운 챌린지 생성 페이지 컴포넌트
import SharedTransactionCreate from './components/Challenge/SharedTransactionCreate';
import SharedTransactionDetail from './components/Challenge/SharedTransactionDetail';
import './assets/App.css';

function App() {
  const location = useLocation();

  // 훅을 배열 순회 외부에서 호출하여 순서가 유지되도록 수정
  const matchChallengeCreate = useMatch('/challenge/create');
  const matchChallengeRoom = useMatch('/challengeRoom/:id');
  const sharedTransactionCreate = useMatch('/sharedTransactionCreate');
  const sharedTransactionDetail = useMatch('/sharedTransactionDetail/:id');
  const matchpayment = useMatch('/payment');
  const matchpayresult = useMatch('/payresult');
  const matchHistory = useMatch('/history');
  const matchHistorydetail = useMatch('/history-detail');
  const matchTransfer = useMatch('/transfer');

  // 두 경로 중 하나와 매칭되는지 확인
  const shouldHideNavbar =
    matchChallengeCreate ||
    matchChallengeRoom ||
    sharedTransactionCreate ||
    sharedTransactionDetail ||
    matchHistory ||
    matchHistorydetail ||
    matchpayment ||
    matchpayresult ||
    matchTransfer;

  return (
    <div className='min-h-screen flex flex-col justify-between'>
      {/* Routes 설정 */}
      <Routes>
        <Route path='/' element={<OnboardingPage />} />
        <Route path='/phone-auth' element={<PhoneAuthPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/set-password' element={<SetPasswordPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/wallet' element={<WalletPage />} />
        <Route path='/history' element={<HistoryPage />} />
        <Route path='/history-detail' element={<HistoryDetailPage />} />
        <Route path='/transfer' element={<TransferPage />} />
        <Route path='/challenge' element={<ChallengePage />} />
        <Route path='/challenge/create' element={<ChallengeCreatePage />} />
        <Route path='/analysis' element={<AnalysisPage />} />
        <Route path='/payment' element={<PaymentPage />} />
        <Route path='/payresult' element={<PayResult />} />
        <Route path='/mydataselect' element={<MyDataSelectPage />} />
        <Route path='/mypage' element={<MyPage2 />} />
        <Route path='/challet-service/users/login' element={<LoginPage />} />
        <Route path='/challengeRoom/:id' element={<ChallengeRoom />} />
        <Route
          path='/sharedTransactionCreate'
          element={<SharedTransactionCreate />}
        />
        <Route
          path='/sharedTransactionDetail/:id'
          element={<SharedTransactionDetail />}
        />
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
