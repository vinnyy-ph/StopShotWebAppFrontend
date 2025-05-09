// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ReservationsPage from './pages/Reservations';
import MenuPage from './pages/Menu';

// Dummy components for other pages
const Menu = () => <div><MenuPage/></div>;
const Reservations = () => <div><ReservationsPage/></div>;
const About = () => <div><h2>About Page</h2></div>;
const Contact = () => <div><h2>Contact Page</h2></div>;
const Feedback = () => <div><h2>Feedback Page</h2></div>;

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
