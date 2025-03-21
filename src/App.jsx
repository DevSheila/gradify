import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import MainLayout from "@/components/layouts/MainLayout";
import StudentsPage from "@/pages/students";
import CreateStudentPage from "@/pages/students/create";
import StudentDetailsPage from "@/pages/students/details";
import CreateTranscriptPage from "@/pages/students/transcripts/create";
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const queryClient = new QueryClient();

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <QueryClientProvider client={queryClient}>
          <Router>
            <MainLayout>
              <Routes>
                {/* Redirect root to students page */}
                <Route path="/" element={<Navigate to="/students" replace />} />

                {/* Students routes */}
                <Route path="/students" element={<StudentsPage />} />
                <Route path="/students/create" element={<CreateStudentPage />} />
                
                {/* Student details and transcript routes */}
                <Route path="/students/:id" element={<StudentDetailsPage />} />
                <Route path="/students/:id/create-transcript" element={<CreateTranscriptPage />} />

                {/* 404 route */}
                <Route path="*" element={<Navigate to="/students" replace />} />
              </Routes>
            </MainLayout>
          </Router>
          <Toaster />
        </QueryClientProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}

export default App;
