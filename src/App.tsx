import { useState } from 'react';
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
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [isGroup, setIsGroup] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const handleSessionCreated = (session: Session, groupChat: boolean) => {
    setCurrentSession(session);
    setIsHost(true);
    setIsGroup(groupChat);
  };

  const handleSessionJoined = (session: Session, groupChat: boolean) => {
    setCurrentSession(session);
    setIsHost(false);
    setIsGroup(groupChat);
  };

  const handleExitChat = () => {
    setCurrentSession(null);
    setIsHost(false);
    setIsGroup(false);
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
