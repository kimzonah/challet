import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/challet-service/users/login' element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
