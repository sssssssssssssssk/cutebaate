import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/blog', label: 'Blog' },

    { path: '/referral', label: 'Referral' },
    { path: '/premium', label: '💎 Premium' },
    { path: '/settings', label: 'Settings' },
  ];  return (
    <nav className="bg-white/75 dark:bg-gray-950/75 backdrop-blur-md border-b border-gray-100/50 dark:border-gray-800/40 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group" onClick={() => setMobileOpen(false)}>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-lg shadow-purple-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">SecureChat</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-3">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-bold transition-all duration-200 px-3.5 py-1.5 rounded-full border ${
                  isActive(link.path)
                    ? 'bg-purple-500/10 dark:bg-purple-400/10 text-purple-600 dark:text-purple-400 border-purple-100/30 dark:border-purple-900/30 shadow-sm'
                    : 'text-gray-650 dark:text-gray-350 border-transparent hover:bg-gray-100/60 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/chat-selection"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2 rounded-full text-sm font-bold hover:scale-105 active:scale-95 transition-all shadow-md shadow-purple-500/20"
            >
              Start Chat
            </Link>
          </div>

          {/* Hamburger Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-855 transition-colors border border-transparent dark:hover:border-gray-800/30"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40 md:hidden animate-fade-in" onClick={() => setMobileOpen(false)} />

          {/* Slide-down panel */}
          <div className="absolute top-16 left-0 right-0 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-2xl border-t border-gray-100 dark:border-gray-800/40 z-50 md:hidden animate-slide-up">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all border ${
                    isActive(link.path)
                      ? 'bg-purple-500/10 dark:bg-purple-400/10 text-purple-600 dark:text-purple-400 border-purple-100/20 dark:border-purple-900/20 shadow-sm'
                      : 'text-gray-750 dark:text-gray-350 border-transparent hover:bg-gray-100/60 dark:hover:bg-gray-800/60'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-2 border-t border-gray-100 dark:border-gray-800/40">
                <Link
                  to="/chat-selection"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-xl text-sm font-bold hover:scale-102 transition-all shadow-md shadow-purple-500/20"
                >
                  🚀 Start Secure Chat
                </Link>
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-gray-800/40">
                <Link
                  to="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100/60 dark:hover:bg-gray-800/60"
                >
                  📧 Contact Us
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
