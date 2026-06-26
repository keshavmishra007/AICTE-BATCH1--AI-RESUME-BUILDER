import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import AtsAnalyzer from './pages/AtsAnalyzer';
import CoverLetter from './pages/CoverLetter';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import Profile from './pages/Profile';
import ResumeBuilder from './pages/ResumeBuilder';
import { useAuth } from './context/AuthContext';

export default function App({ guard: Guard }) {
  const [dark, setDark] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const modeButton = (
    <button className="btn-secondary px-3" onClick={() => setDark((value) => !value)} aria-label="Toggle theme">
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Auth modeButton={modeButton} />} />
      <Route
        path="/*"
        element={
          <Guard>
            <Layout modeButton={modeButton}>
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="resume" element={<ResumeBuilder />} />
                <Route path="cover-letter" element={<CoverLetter />} />
                <Route path="ats" element={<AtsAnalyzer />} />
                <Route path="portfolio" element={<Portfolio />} />
              </Routes>
            </Layout>
          </Guard>
        }
      />
    </Routes>
  );
}
