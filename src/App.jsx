import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { NominalVisibilityProvider } from './context/NominalVisibilityContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { JournalPage } from './pages/JournalPage';
import { DashboardPage } from './pages/DashboardPage';
import { StockAnalysisPage } from './pages/StockAnalysisPage';
import { AnalysisDetailPage } from './pages/AnalysisDetailPage';
import { JournalNewPage } from './pages/JournalNewPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: 1
    }
  }
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NominalVisibilityProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/journal" element={<JournalPage />} />
                <Route path="/journal/new" element={<JournalNewPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/analysis" element={<StockAnalysisPage />} />
                <Route path="/analysis/:analysisId" element={<AnalysisDetailPage />} />
              </Route>

              <Route path="/" element={<Navigate to="/journal" replace />} />
              <Route path="*" element={<Navigate to="/journal" replace />} />
            </Routes>
          </BrowserRouter>
        </NominalVisibilityProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
