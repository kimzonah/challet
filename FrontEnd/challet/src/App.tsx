import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import MyPage2 from './pages/MyPage/MyPage2';
import SetPasswordPage from './pages/SetPasswordPage/SetPasswordPage';
import PaymentPage from './pages/PaymentPage/PaymentPage';
import PayResult from './pages/PayresultPage/PayresultPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className='min-h-screen flex flex-col justify-between'>
        {/* Routes 설정 */}
        <Routes>
          <Route path='/' element={<OnboardingPage />} />
          <Route path='/phone-auth' element={<PhoneAuthPage />} />
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/set-password' element={<SetPasswordPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/wallet' element={<WalletPage />} />
          <Route path='/challenge' element={<ChallengePage />} />
          <Route path='/analysis' element={<AnalysisPage />} />
          <Route path='/payment' element={<PaymentPage />} />
          <Route path='/payresult' element={<PayResult />} />
          <Route
            path='/my'
            element={
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/mypage'
            element={
              <ProtectedRoute>
                <MyPage2 />
              </ProtectedRoute>
            }
          />
          <Route path='/challet-service/users/login' element={<LoginPage />} />
          <Route
            path='/challet-service/challenges'
            element={<ChallengePage />}
          />
          <Route
            path='/challet-service/challenges/:id'
            element={<ChallengeFeed />}
          />
        </Routes>
        {/* 네비게이션 바 */}
        <Navbar />
      </div>
    </Router>
  );
}

export default App;
