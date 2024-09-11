import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import './App.css';
import ChallengePage from './pages/ChallengePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/challet-service/users/login' element={<LoginPage />} />
        <Route path='/challenge' element={<ChallengePage />} />
      </Routes>
    </Router>
  );
}

export default App;
