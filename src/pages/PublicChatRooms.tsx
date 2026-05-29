import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface PublicChatRoomsProps {
  onTermsClick: () => void;
  onPrivacyClick: () => void;
  onReportClick: () => void;
}

interface ChatRoom {
  id: string;
  name: string;
  description: string;
  category: string;
  activeUsers: number;
  icon: string;
  language?: string;
}

const PublicChatRooms: React.FC<PublicChatRoomsProps> = ({ onTermsClick, onPrivacyClick, onReportClick }) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const chatRooms: ChatRoom[] = [
    { id: '1', name: 'General Chat', description: 'Talk about anything!', category: 'general', activeUsers: 234, icon: '💬', language: 'en' },
    { id: '2', name: 'Tech Talk', description: 'Discuss technology and programming', category: 'technology', activeUsers: 156, icon: '💻', language: 'en' },
    { id: '3', name: 'Gaming', description: 'Share your gaming experiences', category: 'gaming', activeUsers: 198, icon: '🎮', language: 'en' },
    { id: '4', name: 'Music & Arts', description: 'Creative minds unite', category: 'arts', activeUsers: 87, icon: '🎨', language: 'en' },
    { id: '5', name: 'Help & Support', description: 'Get help with SecureChat', category: 'support', activeUsers: 45, icon: '❓', language: 'en' },
    { id: '6', name: 'Crypto Talk', description: 'Discuss cryptocurrency and blockchain', category: 'technology', activeUsers: 123, icon: '₿', language: 'en' },
    { id: '7', name: 'Movies & TV', description: 'Talk about latest shows and movies', category: 'entertainment', activeUsers: 167, icon: '🎬', language: 'en' },
    { id: '8', name: 'Sports', description: 'Discuss your favorite sports', category: 'sports', activeUsers: 91, icon: '⚽', language: 'en' },
    { id: '9', name: 'Español General', description: 'Chat en español', category: 'general', activeUsers: 78, icon: '🇪🇸', language: 'es' },
    { id: '10', name: 'Français', description: 'Discutez en français', category: 'general', activeUsers: 54, icon: '🇫🇷', language: 'fr' },
  ];

  const categories = [
    { id: 'all', name: 'All Rooms', icon: '🌐' },
    { id: 'general', name: 'General', icon: '💬' },
    { id: 'technology', name: 'Technology', icon: '💻' },
    { id: 'gaming', name: 'Gaming', icon: '🎮' },
    { id: 'arts', name: 'Arts', icon: '🎨' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'support', name: 'Support', icon: '❓' },
  ];

  const filteredRooms = chatRooms.filter(room => {
    const matchesCategory = selectedCategory === 'all' || room.category === selectedCategory;
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleJoinRoom = (roomId: string) => {
    // In production, this would connect to the public room
    console.log('Joining room:', roomId);
    navigate('/chat-selection');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      <Navbar />
      
      <div className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">Public Chat Rooms</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Join thousands of users in encrypted group conversations
            </p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search chat rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-2xl mx-auto block px-6 py-4 rounded-2xl border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-purple-500 focus:outline-none text-lg"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  selectedCategory === category.id
                    ? 'bg-purple-500 text-white shadow-lg scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="text-center">
                <p className="text-4xl font-bold text-purple-600 mb-2">
                  {chatRooms.reduce((sum, room) => sum + room.activeUsers, 0)}
                </p>
                <p className="text-gray-600 dark:text-gray-400">Active Users</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600 mb-2">{chatRooms.length}</p>
                <p className="text-gray-600 dark:text-gray-400">Chat Rooms</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="text-center">
                <p className="text-4xl font-bold text-green-600 mb-2">8</p>
                <p className="text-gray-600 dark:text-gray-400">Languages</p>
              </div>
            </div>
          </div>

          {/* Chat Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all transform hover:scale-105"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl">{room.icon}</div>
                    <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                        {room.activeUsers} online
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    {room.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 h-12">
                    {room.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-500 capitalize">
                      {room.category}
                    </span>
                    <button
                      onClick={() => handleJoinRoom(room.id)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                    >
                      Join
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredRooms.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                No rooms found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try a different search term or category
              </p>
            </div>
          )}

          {/* Rules */}
          <div className="mt-12 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-yellow-800 dark:text-yellow-400 mb-4">
              📜 Public Room Rules
            </h3>
            <ul className="space-y-2 text-yellow-700 dark:text-yellow-300">
              <li>✓ Be respectful to all participants</li>
              <li>✓ No hate speech or harassment</li>
              <li>✓ No spam or advertising</li>
              <li>✓ Keep conversations appropriate</li>
              <li>✓ Report violations using the Report button</li>
              <li>✓ All messages are still encrypted</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer 
        onTermsClick={onTermsClick}
        onPrivacyClick={onPrivacyClick}
        onReportClick={onReportClick}
      />
    </div>
  );
};

export default PublicChatRooms;
