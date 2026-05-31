import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InteractiveBackground from '../components/InteractiveBackground';

interface BlogPostProps {
  onTermsClick: () => void;
  onPrivacyClick: () => void;
  onReportClick: () => void;
}

const blogContent: { [key: string]: any } = {
  'getting-started': {
    title: 'Getting Started with SecureChat',
    category: 'Getting Started',
    readTime: '3 min read',
    content: `
      <h2>Welcome to SecureChat!</h2>
      <p>SecureChat is the easiest way to have private, encrypted conversations without any registration or data collection. This guide will walk you through your first chat session.</p>
      
      <h3>Step 1: Choose Your Chat Type</h3>
      <p>SecureChat offers two types of chat:</p>
      <ul>
        <li><strong>One-on-One Chat:</strong> Private conversation between two people</li>
        <li><strong>Group Chat:</strong> Chat with multiple people (with host approval)</li>
      </ul>
      
      <h3>Step 2: Create a Session</h3>
      <p>Click "Create New Session" and SecureChat will generate:</p>
      <ul>
        <li>A unique Session ID (format: XXXX-XXXX-XXXX)</li>
        <li>A secure password</li>
      </ul>
      <p>Copy both and share them with the person(s) you want to chat with through a secure channel (not public social media!).</p>
      
      <h3>Step 3: Start Chatting</h3>
      <p>Once your chat partner joins using the credentials, you're connected! You can now:</p>
      <ul>
        <li>Send encrypted text messages</li>
        <li>Share images, videos, and documents</li>
        <li>Chat in real-time with end-to-end encryption</li>
      </ul>
      
      <h3>Step 4: End Your Session</h3>
      <p>When you're done, click the "Exit" button. This will:</p>
      <ul>
        <li>Permanently delete all messages</li>
        <li>Remove all session data</li>
        <li>Ensure complete privacy</li>
      </ul>
      
      <div class="cta-box">
        <h3>Ready to try it?</h3>
        <p>Click the button below to start your first secure chat!</p>
      </div>
    `
  },
  'group-chat-guide': {
    title: 'Group Chat: Connect with Multiple People',
    category: 'Features',
    readTime: '4 min read',
    content: `
      <h2>Group Chat Feature</h2>
      <p>SecureChat's group chat feature allows you to communicate with multiple people securely. The host has full control over who can join the conversation.</p>
      
      <h3>Creating a Group Chat</h3>
      <ol>
        <li>Click "Start Chat" and select "Create Group Chat"</li>
        <li>Generate your group session credentials</li>
        <li>Share the Session ID and Password with your group members</li>
        <li>Wait for join requests to appear</li>
      </ol>
      
      <h3>Join Request System</h3>
      <p>When someone tries to join your group chat:</p>
      <ul>
        <li>You'll receive a popup notification</li>
        <li>You can see the user's ID (anonymous)</li>
        <li>You can approve or reject the request</li>
        <li>Only approved users can participate</li>
      </ul>
      
      <h3>Managing Group Members</h3>
      <p>As the host, you have special powers:</p>
      <ul>
        <li>Approve or reject join requests</li>
        <li>See all active participants</li>
        <li>End the entire group session</li>
        <li>Remove participants (coming soon)</li>
      </ul>
      
      <h3>Joining a Group Chat</h3>
      <p>To join an existing group chat:</p>
      <ol>
        <li>Get the Session ID and Password from the host</li>
        <li>Click "Join Group Chat"</li>
        <li>Enter the credentials</li>
        <li>Wait for the host to approve your request</li>
        <li>Start chatting once approved!</li>
      </ol>
      
      <h3>Group Chat Security</h3>
      <p>Group chats maintain the same security standards:</p>
      <ul>
        <li>All messages are end-to-end encrypted</li>
        <li>No data is stored on servers</li>
        <li>All participants remain anonymous</li>
        <li>Everything is deleted when the session ends</li>
      </ul>
      
      <div class="cta-box">
        <h3>Ready to start a group chat?</h3>
        <p>Try the group chat feature now and connect with multiple people securely!</p>
      </div>
    `
  },
  'end-to-end-encryption': {
    title: 'Understanding End-to-End Encryption',
    category: 'Security',
    readTime: '5 min read',
    content: `
      <h2>What is End-to-End Encryption?</h2>
      <p>End-to-end encryption (E2EE) means that only you and your chat partner can read the messages. Not even SecureChat can decrypt them!</p>
      
      <h3>How It Works</h3>
      <p>When you send a message on SecureChat:</p>
      <ol>
        <li><strong>Encryption:</strong> Your message is encrypted on your device using AES-256</li>
        <li><strong>Transmission:</strong> The encrypted message travels directly to your chat partner</li>
        <li><strong>Decryption:</strong> Only your chat partner's device can decrypt and read it</li>
      </ol>
      
      <h3>Why AES-256?</h3>
      <p>AES-256 is military-grade encryption used by:</p>
      <ul>
        <li>Banks and financial institutions</li>
        <li>Government agencies</li>
        <li>Major tech companies</li>
        <li>Security professionals worldwide</li>
      </ul>
      <p>It would take billions of years for even the most powerful computers to crack AES-256 encryption!</p>
      
      <h3>Your Privacy Matters</h3>
      <p>With SecureChat's E2EE:</p>
      <ul>
        <li>❌ We can't read your messages</li>
        <li>❌ Hackers can't intercept them</li>
        <li>❌ Governments can't decrypt them</li>
        <li>✅ Only you and your chat partner have access</li>
      </ul>
      
      <h3>What About Metadata?</h3>
      <p>SecureChat goes further than just encrypting messages:</p>
      <ul>
        <li>We don't collect IP addresses</li>
        <li>We don't store session information</li>
        <li>We don't track who you talk to</li>
        <li>We don't know when you chat</li>
      </ul>
      
      <div class="cta-box">
        <h3>Experience True Privacy</h3>
        <p>Start chatting with military-grade encryption now!</p>
      </div>
    `
  }
};

const BlogPost: React.FC<BlogPostProps> = ({ onTermsClick, onPrivacyClick, onReportClick }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = slug ? blogContent[slug] : null;

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        <InteractiveBackground />
        <Navbar />
        <div className="flex-1 flex items-center justify-center z-10">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Post Not Found</h1>
            <button
              onClick={() => navigate('/blog')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2.5 rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              ← Back to Blog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <InteractiveBackground />
      <Navbar />
      
      <div className="flex-1 py-12 px-4 z-10">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 mb-6 font-bold transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </button>

          {/* Article */}
          <article className="bg-white/75 dark:bg-gray-800/75 backdrop-blur-md border border-gray-100 dark:border-gray-700/50 rounded-2xl shadow-xl p-8 md:p-12 hover:shadow-2xl transition-all duration-300">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-4 py-1 rounded-full border border-purple-100/30">
                  {post.category}
                </span>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{post.readTime}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4 leading-tight">
                {post.title}
              </h1>
            </div>

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none blog-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* CTA to Chat */}
            <div className="mt-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-center text-white shadow-xl shadow-purple-500/20 transform hover:scale-[1.01] transition-transform">
              <h3 className="text-2xl font-extrabold mb-4">Ready to Start Chatting?</h3>
              <p className="text-lg mb-6 opacity-90 font-medium animate-pulse">
                Put what you've learned into practice. Start your first secure chat now!
              </p>
              <button
                onClick={() => navigate('/chat-selection')}
                className="inline-block bg-white text-purple-600 px-8 py-3.5 rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/10"
              >
                Go to SecureChat →
              </button>
            </div>

            {/* Share */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-gray-600 text-sm text-center">
                Found this helpful? Share it with friends who value privacy!
              </p>
            </div>
          </article>
        </div>
      </div>

      <Footer 
        onTermsClick={onTermsClick}
        onPrivacyClick={onPrivacyClick}
        onReportClick={onReportClick}
      />

      <style>{`
        .blog-content h2 {
          font-size: 1.875rem;
          font-weight: 800;
          color: inherit;
          margin-top: 2rem;
          margin-bottom: 1rem;
          letter-spacing: -0.025em;
        }
        .blog-content h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: inherit;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          letter-spacing: -0.025em;
        }
        .blog-content p {
          color: inherit;
          opacity: 0.85;
          line-height: 1.8;
          margin-bottom: 1.25rem;
        }
        .blog-content ul, .blog-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1.25rem;
          color: inherit;
          opacity: 0.85;
        }
        .blog-content li {
          margin-bottom: 0.5rem;
          line-height: 1.8;
        }
        .blog-content .cta-box {
          background: rgba(168, 85, 247, 0.08);
          border: 1px solid rgba(168, 85, 247, 0.15);
          border-radius: 1rem;
          padding: 2rem;
          margin-top: 2rem;
          text-align: center;
        }
        .dark .blog-content .cta-box {
          background: rgba(168, 85, 247, 0.15);
          border: 1px solid rgba(168, 85, 247, 0.25);
        }
        .blog-content .cta-box h3 {
          color: #a855f7;
          margin-top: 0;
        }
        .blog-content .cta-box p {
          color: inherit;
          opacity: 0.9;
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
};

export default BlogPost;
