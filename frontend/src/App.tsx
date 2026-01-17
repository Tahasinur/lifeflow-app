import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Toaster } from 'sonner@2.0.3';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { EditorPage } from './pages/EditorPage';
import { TrashPageWrapper } from './pages/TrashPageWrapper';
import { FeedPage } from './pages/FeedPage';
import { RequireAuth } from './components/RequireAuth';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="bottom-right" />
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route index element={<EditorPage />} />
          <Route path="feed" element={<FeedPage />} />
          <Route path="trash" element={<TrashPageWrapper />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}