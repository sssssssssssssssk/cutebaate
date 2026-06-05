import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import ChatSelection from './pages/ChatSelection';
import JoinViaLink from './pages/JoinViaLink';
import Premium from './pages/Premium';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';

import ReferralProgram from './pages/ReferralProgram';
import ChatRoom from './components/ChatRoom';
import TermsModal from './components/TermsModal';
import PrivacyModal from './components/PrivacyModal';
import ReportModal from './components/ReportModal';
import { Session } from './types';

function App() {
  const [currentSession, setCurrentSession] = useState<Session | null>(() => {
    const saved = localStorage.getItem('active_chat_session');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const autoLoadKey = async () => {
      if (localStorage.getItem('razorpay_key_id')) return;
      try {
        const res = await fetch('/rzp-key.csv');
        if (res.ok) {
          const text = await res.text();
          const match = text.match(/rzp_(test|live)_[a-zA-Z0-9]+/);
          if (match) {
            const keyId = match[0];
            localStorage.setItem('razorpay_key_id', keyId);
            console.log('Automatically loaded Razorpay Key ID from rzp-key.csv:', keyId);
          }
        }
      } catch (err) {
        // Ignore if file doesn't exist
      }
    };
    autoLoadKey();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) {
      localStorage.setItem('referred_by', ref.trim());
      console.log('Referral code captured from URL:', ref);
    }
  }, []);
  const [isHost, setIsHost] = useState(() => {
    return localStorage.getItem('active_chat_is_host') === 'true';
  });
  const [isGroup, setIsGroup] = useState(() => {
    return localStorage.getItem('active_chat_is_group') === 'true';
  });
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const handleSessionCreated = (session: Session, groupChat: boolean) => {
    setCurrentSession(session);
    setIsHost(true);
    setIsGroup(groupChat);
    localStorage.setItem('active_chat_session', JSON.stringify(session));
    localStorage.setItem('active_chat_is_host', 'true');
    localStorage.setItem('active_chat_is_group', String(groupChat));
  };

  const handleSessionJoined = (session: Session, groupChat: boolean) => {
    setCurrentSession(session);
    setIsHost(false);
    setIsGroup(groupChat);
    localStorage.setItem('active_chat_session', JSON.stringify(session));
    localStorage.setItem('active_chat_is_host', 'false');
    localStorage.setItem('active_chat_is_group', String(groupChat));
  };

  const handleExitChat = () => {
    setCurrentSession(null);
    setIsHost(false);
    setIsGroup(false);
    localStorage.removeItem('active_chat_session');
    localStorage.removeItem('active_chat_is_host');
    localStorage.removeItem('active_chat_is_group');
  };

  // If in chat, show chat room
  if (currentSession) {
    return (
      <>
        <ChatRoom
          session={currentSession}
          isHost={isHost}
          isGroup={isGroup}
          onExit={handleExitChat}
        />
        <ReportModal 
          isOpen={showReport}
          onClose={() => setShowReport(false)}
          sessionId={currentSession.sessionId}
          userId={currentSession.userId}
        />
      </>
    );
  }

  return (
    <>
      <Routes>
        <Route 
          path="/" 
          element={
            <Home
              onTermsClick={() => setShowTerms(true)}
              onPrivacyClick={() => setShowPrivacy(true)}
              onReportClick={() => setShowReport(true)}
            />
          } 
        />
        <Route 
          path="/about" 
          element={
            <About
              onTermsClick={() => setShowTerms(true)}
              onPrivacyClick={() => setShowPrivacy(true)}
              onReportClick={() => setShowReport(true)}
            />
          } 
        />
        <Route 
          path="/blog" 
          element={
            <Blog
              onTermsClick={() => setShowTerms(true)}
              onPrivacyClick={() => setShowPrivacy(true)}
              onReportClick={() => setShowReport(true)}
            />
          } 
        />
        <Route 
          path="/blog/:slug" 
          element={
            <BlogPost
              onTermsClick={() => setShowTerms(true)}
              onPrivacyClick={() => setShowPrivacy(true)}
              onReportClick={() => setShowReport(true)}
            />
          } 
        />
        <Route 
          path="/contact" 
          element={
            <Contact
              onTermsClick={() => setShowTerms(true)}
              onPrivacyClick={() => setShowPrivacy(true)}
              onReportClick={() => setShowReport(true)}
            />
          } 
        />
        <Route 
          path="/settings" 
          element={
            <Settings
              onTermsClick={() => setShowTerms(true)}
              onPrivacyClick={() => setShowPrivacy(true)}
              onReportClick={() => setShowReport(true)}
            />
          } 
        />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route 
          path="/premium" 
          element={
            <Premium
              onTermsClick={() => setShowTerms(true)}
              onPrivacyClick={() => setShowPrivacy(true)}
              onReportClick={() => setShowReport(true)}
            />
          } 
        />

        <Route 
          path="/referral" 
          element={
            <ReferralProgram
              onTermsClick={() => setShowTerms(true)}
              onPrivacyClick={() => setShowPrivacy(true)}
              onReportClick={() => setShowReport(true)}
            />
          } 
        />
        <Route 
          path="/chat-selection" 
          element={
            <ChatSelection
              onSessionCreated={handleSessionCreated}
              onSessionJoined={handleSessionJoined}
            />
          } 
        />
        <Route 
          path="/join/:code" 
          element={
            <JoinViaLink
              onSessionJoined={handleSessionJoined}
            />
          } 
        />
      </Routes>

      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <ReportModal 
        isOpen={showReport} 
        onClose={() => setShowReport(false)}
        sessionId={undefined}
        userId={undefined}
      />
    </>
  );
}

export default App;
