import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider } from '@clerk/clerk-react';
import { ThemeProvider } from './components/theme-provider';
import TranscriptsPage from '@/pages/transcripts';
import NewTranscriptPage from '@/pages/transcripts/new';
import EditTranscriptPage from '@/pages/transcripts/edit';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import RootLayout from './components/layouts/RootLayout';
import { Toaster } from '@/components/ui/toaster';
import AcademicHistoryPage from '@/pages/transcripts/history';
import TranscriptsLayout from './components/layouts/TranscriptsLayout';
import TranscriptGenerator from './pages/TranscriptGenerator';
import StudentsListPage from '@/pages/students/StudentsListPage';
import CreateStudentPage from '@/pages/students/CreateStudentPage';
import EditStudentPage from '@/pages/students/EditStudentPage';
import StudentTranscriptsPage from '@/pages/students/StudentTranscriptsPage';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <QueryClientProvider client={queryClient}>
          <Router>
            <Routes>
              {/* Redirect root to students list */}
              <Route path="/" element={<Navigate to="/students" replace />} />

              {/* Student routes */}
              <Route path="/students" element={<StudentsListPage />} />
              <Route path="/students/create" element={<CreateStudentPage />} />
              <Route path="/students/:studentId/edit" element={<EditStudentPage />} />
              <Route path="/students/:studentId/transcripts" element={<StudentTranscriptsPage />} />

              {/* Transcript routes */}
              <Route path="/transcripts" element={<ProtectedRoute><TranscriptsLayout /></ProtectedRoute>} />
              <Route path="/transcripts/new" element={<ProtectedRoute><NewTranscriptPage /></ProtectedRoute>} />
              <Route path="/transcripts/:id/edit" element={<ProtectedRoute><EditTranscriptPage /></ProtectedRoute>} />
              <Route path="/transcripts/history" element={<ProtectedRoute><AcademicHistoryPage /></ProtectedRoute>} />
              <Route path="/records" element={<ProtectedRoute><TranscriptGenerator /></ProtectedRoute>} />

              {/* Dashboard route */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            </Routes>
          </Router>
          <Toaster />
        </QueryClientProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
};

export default App;
