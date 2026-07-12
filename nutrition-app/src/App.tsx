import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { ProfileProvider, useProfiles } from './state/ProfileContext';
import { Layout } from './components/Layout';
import { Profiles } from './pages/Profiles';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Plan } from './pages/Plan';
import { Diary } from './pages/Diary';
import { ProfilePage } from './pages/Profile';

// Aktif profil yoksa karşılama ekranına yönlendirir
function RequireProfile() {
  const { activeProfile, loading } = useProfiles();
  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center text-muted">Yükleniyor…</div>
    );
  }
  if (!activeProfile) return <Navigate to="/welcome" replace />;
  return <Outlet />;
}

export default function App() {
  return (
    <ProfileProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/welcome" element={<Profiles />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/onboarding/:id" element={<Onboarding />} />

          <Route element={<RequireProfile />}>
            <Route element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="plan" element={<Plan />} />
              <Route path="diary" element={<Diary />} />
              <Route path="me" element={<ProfilePage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ProfileProvider>
  );
}
