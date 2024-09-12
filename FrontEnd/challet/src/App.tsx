import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OnboardingPage from './pages/OnboardingPage/OnboardingPage';
import PhoneAuthPage from './pages/PhoneAuthPage/PhoneAuthPage';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SetPasswordPage from './pages/SetPasswordPage/SetPasswordPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<OnboardingPage />} />
        <Route path='/phone-auth' element={<PhoneAuthPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/set-password' element={<SetPasswordPage />} />
      </Routes>
    </Router>
  );
}

export default App;
