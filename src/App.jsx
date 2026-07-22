// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';

// Simple, minimal 404 component directly in the file
function NotFound() {
  return (
    <div className="layout-container">
      <h2>404 - Page Not Found</h2>
      <p>The page or article you are looking for doesn't exist.</p>
      <a href="#/">&larr; Return to Home</a>
    </div>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/writing" element={<PostDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}