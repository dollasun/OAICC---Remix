import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import LandingPage from './components/LandingPage';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import ForgotPassword from './components/Auth/ForgotPassword';
import ParentOnboarding from './components/Onboarding/ParentOnboarding';
import ParentDashboard from './components/Dashboard/ParentDashboard';
import TeacherOnboarding from './components/Onboarding/TeacherOnboarding';
import TeacherDashboard from './components/Dashboard/TeacherDashboard';
import SchoolSignUp from './components/Auth/SchoolSignUp';
import SchoolDashboard from './components/Dashboard/SchoolDashboard';
import StudentOnboarding from './components/Onboarding/StudentOnboarding';
import StudentDashboard from './components/Dashboard/StudentDashboard';
import AdminSignIn from './components/Auth/AdminSignIn';
import AdminSignUp from './components/Auth/AdminSignUp';
import AdminForgotPassword from './components/Auth/AdminForgotPassword';
import AdminCheckEmail from './components/Auth/AdminCheckEmail';
import AdminSetPassword from './components/Auth/AdminSetPassword';
import AdminDashboard from './components/Dashboard/Admin/AdminDashboard';

export default function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth Routes */}
          <Route path="/auth/signin" element={<SignIn />} />
          <Route path="/auth/signup" element={<SignUp />} />
          <Route path="/auth/signup/school" element={<SchoolSignUp />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          
          {/* Onboarding Routes */}
          <Route path="/onboarding/parent" element={<ParentOnboarding />} />
          <Route path="/onboarding/teacher" element={<TeacherOnboarding />} />
          <Route path="/onboarding/student" element={<StudentOnboarding />} />
          
          {/* Dashboard Routes */}
          <Route path="/parent/dashboard/*" element={<ParentDashboard />} />
          <Route path="/parent/settings" element={<ParentDashboard />} />
          <Route path="/teacher/dashboard/*" element={<TeacherDashboard />} />
          <Route path="/teacher/class/:id" element={<TeacherDashboard />} />
          <Route path="/teacher/student/:id" element={<TeacherDashboard />} />
          <Route path="/teacher/settings" element={<TeacherDashboard />} />
          
          {/* School Routes */}
          <Route path="/school/*" element={<SchoolDashboard />} />

          {/* Student Routes */}
          <Route path="/student/*" element={<StudentDashboard />} />

          {/* Admin Routes */}
          <Route path="/admin/signin" element={<AdminSignIn />} />
          <Route path="/admin/signup" element={<AdminSignUp />} />
          <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
          <Route path="/admin/check-email" element={<AdminCheckEmail />} />
          <Route path="/admin/set-password" element={<AdminSetPassword />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}
