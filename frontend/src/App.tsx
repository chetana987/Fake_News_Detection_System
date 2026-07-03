import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { MainLayout } from '@/components/layout/MainLayout';
import DashboardPage from '@/pages/DashboardPage';
import LiveFeedPage from '@/pages/LiveFeedPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import HistoryPage from '@/pages/HistoryPage';
import ClaimDetailsPage from '@/pages/ClaimDetailsPage';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-gray-500">
      <p className="text-4xl font-bold text-gray-400">404</p>
      <p className="mt-2">Page not found</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/live-feed" element={<LiveFeedPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/claim/:id" element={<ClaimDetailsPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <Toaster
          position="top-right"
          richColors
          closeButton
          theme="dark"
          toastOptions={{ style: { background: '#1E293B', border: '1px solid #334155' } }}
        />
      </ErrorBoundary>
    </BrowserRouter>
  );
}
