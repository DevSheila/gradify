import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'transcripts',
        element: (
          <ProtectedRoute>
            <TranscriptsLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <TranscriptsPage />,
          },
          {
            path: 'new',
            element: <NewTranscriptPage />,
          },
          {
            path: ':id/edit',
            element: <EditTranscriptPage />,
          },
          {
            path: 'history',
            element: <AcademicHistoryPage />,
          },
        ],
      },
    ],
  },
]);

export default function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <Toaster />
        </QueryClientProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
