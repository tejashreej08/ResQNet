import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import HomeMapPage from './pages/HomeMapPage';
import EmergencySOSPage from './pages/EmergencySOSPage';
import SafeRoutePage from './pages/SafeRoutePage';
import ReportIncidentPage from './pages/ReportIncidentPage';
import AlertFeedPage from './pages/AlertFeedPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/map" element={<HomeMapPage />} />
        <Route path="/sos" element={<EmergencySOSPage />} />
        <Route path="/route" element={<SafeRoutePage />} />
        <Route path="/report" element={<ReportIncidentPage />} />
        <Route path="/alerts" element={<AlertFeedPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
