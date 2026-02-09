import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import FindJobs from './pages/FindJobs';
import AboutUs from './pages/AboutUs';

import ContactUs from './pages/ContactUs';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import EmployerDashboard from './pages/EmployerDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import CandidateProfile from './pages/CandidateProfile';
import CompanyProfile from './pages/CompanyProfile';
import ForgotPassword from './pages/ForgotPassword';
import Categories from './pages/Categories';
import CategoryDetails from './pages/CategoryDetails';
import { AuthProvider } from './context/AuthContext';
import { UIProvider, useUI } from './context/UIContext';
import AuthModal from './components/AuthModal';

import ScrollToTop from './components/ScrollToTop';

const AppContent = () => {
  const { isAuthModalOpen, closeAuthModal, authModalView } = useUI();

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/category/:categoryId" element={<CategoryDetails />} />
          <Route path="/find-jobs" element={<FindJobs />} />
          <Route path="/about-us" element={<AboutUs />} />

          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/employer-dashboard" element={<EmployerDashboard />} />
          <Route path="/employer-profile" element={<CompanyProfile />} />
          <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
          <Route path="/candidate-profile" element={<CandidateProfile />} />
        </Routes>
      </main>
      <Footer />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialView={authModalView}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <Router>
          <ScrollToTop />
          <AppContent />
        </Router>
      </UIProvider>
    </AuthProvider>
  );
}

export default App;
