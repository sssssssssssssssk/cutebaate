import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Post Not Found</h1>
            <button
              onClick={() => navigate('/blog')}
              className="text-purple-600 hover:underline"
            >
              ← Back to Blog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center text-gray-700 hover:text-purple-600 mb-6 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </button>

          {/* Article */}
          <article className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-semibold text-purple-600 bg-purple-100 px-4 py-1 rounded-full">
                  {post.category}
                </span>
                <span className="text-sm text-gray-500">{post.readTime}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                {post.title}
              </h1>
            </div>

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none blog-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* CTA to Chat */}
            <div className="mt-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-center text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Start Chatting?</h3>
              <p className="text-lg mb-6 opacity-90">
                Put what you've learned into practice. Start your first secure chat now!
              </p>
              <button
                onClick={() => navigate('/chat-selection')}
                className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105"
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
          font-weight: 700;
          color: #1f2937;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .blog-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #374151;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .blog-content p {
          color: #4b5563;
          line-height: 1.75;
          margin-bottom: 1rem;
        }
        .blog-content ul, .blog-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
          color: #4b5563;
        }
        .blog-content li {
          margin-bottom: 0.5rem;
          line-height: 1.75;
        }
        .blog-content .cta-box {
          background: linear-gradient(to right, #f3e8ff, #fce7f3);
          border-radius: 1rem;
          padding: 2rem;
          margin-top: 2rem;
          text-align: center;
        }
        .blog-content .cta-box h3 {
          color: #7c3aed;
          margin-top: 0;
        }
        .blog-content .cta-box p {
          color: #6b21a8;
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
};

export default BlogPost;
