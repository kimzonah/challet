import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import ChallengePage from './pages/ChallengePage';
import ChallengeFeed from './components/Challenge/ChallengeFeed';
import ChallengeForm from './components/Challenge/ChallengeForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/challet-service/users/login' element={<LoginPage />} />
        <Route path='/challet-service/challenges' element={<ChallengePage />} />
        <Route
          path='/challet-service/challenges/:id'
          element={<ChallengeFeed />}
        />
        <Route
          path='/challet-service/challege-form'
          element={<ChallengeForm />}
        />
      </Routes>
    </Router>
  );
}

export default App;
