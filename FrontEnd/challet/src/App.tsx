import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import ChallengePage from './pages/ChallengePage';
import ChallengeFeed from './components/Challenge/ChallengeFeed';
import ChallengeForm from './components/Challenge/ChallengeForm';
import Navbar from './components/navigation';
import WalletPage from './pages/WalletPage';
import ChallengePage from './pages/ChallengePage';
import AnalysisPage from './pages/AnalysisPage';
import MyPage from './pages/MyPage';
import LoginPage from './pages/LoginPage';
import './App.css';

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
          <Route path='/my' element={<MyPage />} />
          <Route path='/challet-service/users/login' element={<LoginPage />} />
          <Route
            path='/challet-service/challenges'
            element={<ChallengePage />}
          />
          <Route
            path='/challet-service/challenges/:id'
            element={<ChallengeFeed />}
          />
          <Route
            path='/challet-service/challege-form'
            element={<ChallengeForm />}
          />
        </Routes>
        {/* 네비게이션 바 */}
        <Navbar />
      </div>
    </Router>
  );
}

export default App;
