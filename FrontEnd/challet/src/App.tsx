import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navigation';
import WalletPage from './pages/WalletPage';
import ChallengePage from './pages/ChallengePage';
import AnalysisPage from './pages/AnalysisPage';
import MyPage from './pages/MyPage';
import LoginPage from './pages/LoginPage';
import './App.css';
import PaymentPage from './pages/PaymentPage/PaymentPage';
import PayResult from './pages/PayresultPage/PayresultPage';

function App() {
  return (
    <Router>
      <div className='min-h-screen flex flex-col justify-between'>
        {/* Routes 설정 */}
        <Routes>
          <Route path='/challet-service/users/login' element={<LoginPage />} />
          <Route path='/wallet' element={<WalletPage />} />
          <Route path='/challenge' element={<ChallengePage />} />
          <Route path='/analysis' element={<AnalysisPage />} />
          <Route path='/payment' element={<PaymentPage />} />
          <Route path='/payresult' element={<PayResult />} />
          <Route path='/my' element={<MyPage />} />
        </Routes>
        {/* 네비게이션 바 */}
        <Navbar />
      </div>
    </Router>
  );
}

export default App;
