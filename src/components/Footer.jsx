import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Amare. Built with React & Open Props.</p>
    </footer>
  );
}