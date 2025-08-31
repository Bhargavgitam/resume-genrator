import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './components/HomePage';
import { ResumeGenerator } from './components/ResumeGenerator';
import { ResumeResult } from './components/ResumeResult';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/generate" element={
            <ProtectedRoute>
              <ResumeGenerator />
            </ProtectedRoute>
          } />
          <Route path="/result" element={
            <ProtectedRoute>
              <ResumeResult />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}