// src/App.tsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ReservationsPage from './pages/Reservations';
import MenuPage from './pages/Menu';
import AboutPage from './pages/About';
import ContactPage from './pages/Contact';
import FeedbackPage from './pages/Feedback';
import Chatbot from './components/Chatbot';
import './index.css';
import AdminLogin from './admin/components/login';
import AdminDashboard from './admin/components/dashboard';
import { AuthProvider } from './context/AuthContext';

// Component wrappers
const Menu = () => <div><MenuPage /></div>;
const Reservations = () => <div><ReservationsPage /></div>;
const About = () => <div><AboutPage /></div>;
const Contact = () => <div><ContactPage /></div>;
const Feedback = () => <div><FeedbackPage /></div>;

const App: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <Chatbot />}
    </AuthProvider>
  );
};

export default App;