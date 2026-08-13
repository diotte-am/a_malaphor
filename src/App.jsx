// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Code from './pages/Code';
import Make from './pages/Make';
import Teach from './pages/Teach';
import Collaborate from './pages/Collaborate';
import PostDetail from './pages/PostDetail'; // <--- Make sure this is imported

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/code" element={<Code />} />
          <Route path="/make" element={<Make />} />
          <Route path="/teach" element={<Teach />} />
          <Route path="/collaborate" element={<Collaborate />} />
          
          {/* This dynamic route handles all /category/phase/slug details */}
          <Route path="/:category/:slug/:phaseSlug?" element={<PostDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}