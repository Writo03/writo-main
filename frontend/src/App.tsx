import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import DemoSession from './pages/DemoSession';
import TestSeries from './pages/TestSeries';
import Leaderboard from './pages/Leaderboard';
import QuizCreator from './pages/admin/QuizCreator';
import Footer from './components/Footer';

export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/demo" element={<DemoSession />} />
              <Route path="/test-series" element={<TestSeries />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/admin/quiz-creator" element={<QuizCreator />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;