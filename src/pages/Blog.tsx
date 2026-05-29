import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface BlogProps {
  onTermsClick: () => void;
  onPrivacyClick: () => void;
  onReportClick: () => void;
}

const blogPosts = [
  {
    id: 1,
    title: 'Getting Started with SecureChat',
    excerpt: 'Create your first encrypted session, share the invite link, and start chatting in under 60 seconds. Here\'s how.',
    category: 'Getting Started',
    readTime: '3 min',
    image: '🚀',
    slug: 'getting-started',
    date: 'Dec 15, 2025'
  },
  {
    id: 2,
    title: 'How End-to-End Encryption Actually Works',
    excerpt: 'A plain-English explanation of AES-256 encryption, key derivation, and why even we can\'t read your messages.',
    category: 'Security',
    readTime: '5 min',
    image: '🔒',
    slug: 'end-to-end-encryption',
    date: 'Jan 8, 2026'
  },
  {
    id: 3,
    title: 'Group Chat: Host Controls & Admin Roles',
    excerpt: 'Learn how to create group chats with join approval, assign admin and moderator roles, and manage permissions.',
    category: 'Features',
    readTime: '4 min',
    image: '👥',
    slug: 'group-chat-guide',
    date: 'Feb 3, 2026'
  },
  {
    id: 4,
    title: 'Self-Destructing Messages: The Complete Guide',
    excerpt: 'Set messages to auto-delete after 5 seconds to 5 minutes. Here\'s when and how to use this powerful feature.',
    category: 'Privacy',
    readTime: '3 min',
    image: '🔥',
    slug: 'self-destruct-guide',
    date: 'Mar 12, 2026'
  },
  {
    id: 5,
    title: 'Voice Messages, Reactions & Stickers',
    excerpt: 'Record voice notes, react with emojis, and send stickers — all encrypted end-to-end.',
    category: 'Features',
    readTime: '4 min',
    image: '🎤',
    slug: 'rich-messaging',
    date: 'Apr 1, 2026'
  },
  {
    id: 6,
    title: 'Troubleshooting: Connection Issues & Fixes',
    excerpt: 'Can\'t connect? Peer not found? Firewall blocking WebRTC? Here are the fixes for every common issue.',
    category: 'Support',
    readTime: '6 min',
    image: '🔧',
    slug: 'troubleshooting',
    date: 'Apr 20, 2026'
  },
  {
    id: 7,
    title: 'Privacy Tips for Maximum Anonymity',
    excerpt: 'Beyond encryption: how to use VPNs, screenshot detection, self-destruct, and session hygiene for total privacy.',
    category: 'Privacy',
    readTime: '5 min',
    image: '🕵️',
    slug: 'privacy-tips',
    date: 'May 5, 2026'
  },
  {
    id: 8,
    title: 'What\'s New: Dark Mode, Themes & Wallpapers',
    excerpt: 'Customize your chat experience with dark mode, 5 color schemes, chat wallpapers, and custom avatars.',
    category: 'Updates',
    readTime: '3 min',
    image: '🎨',
    slug: 'customization-guide',
    date: 'May 18, 2026'
  },
];

const Blog: React.FC<BlogProps> = ({ onTermsClick, onPrivacyClick, onReportClick }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      <Navbar />
      
      <div className="flex-1 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">Blog & Help Center</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Guides, security deep-dives, and tips to get the most out of SecureChat
            </p>
            
            {/* CTA */}
            <button
              onClick={() => navigate('/chat-selection')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
            >
              🚀 Start Secure Chat Now
            </button>
          </div>

          {/* Featured Post */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-10 hover:shadow-2xl transition-shadow">
            <Link to={`/blog/${blogPosts[0].slug}`} className="block md:flex">
              <div className="bg-gradient-to-br from-purple-400 to-pink-500 md:w-80 h-48 md:h-auto flex items-center justify-center text-8xl flex-shrink-0">
                {blogPosts[0].image}
              </div>
              <div className="p-8 flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-bold px-3 py-1 rounded-full">
                    FEATURED
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{blogPosts[0].date}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">• {blogPosts[0].readTime}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                  {blogPosts[0].title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {blogPosts[0].excerpt}
                </p>
                <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm">
                  Read More →
                </span>
              </div>
            </Link>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {blogPosts.slice(1).map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 group"
              >
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 h-40 flex items-center justify-center text-6xl">
                  {post.image}
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded-full">
                      {post.category}
                    </span>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400">
                      {post.date} • {post.readTime}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 group-hover:text-purple-600 transition-colors leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-3">Have Questions?</h2>
            <p className="text-lg opacity-90 mb-6">
              Can't find what you're looking for? Reach out directly.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                📧 Contact Us
              </Link>
              <Link
                to="/chat-selection"
                className="bg-white bg-opacity-20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-opacity-30 transition-colors border border-white border-opacity-30"
              >
                💬 Start Chatting
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer onTermsClick={onTermsClick} onPrivacyClick={onPrivacyClick} onReportClick={onReportClick} />
    </div>
  );
};

export default Blog;
