import React, { useState } from 'react';

interface StickerGifPickerProps {
  onSelect: (type: 'sticker' | 'gif', data: string) => void;
  onClose: () => void;
}

const StickerGifPicker: React.FC<StickerGifPickerProps> = ({ onSelect, onClose }) => {
  const [activeTab, setActiveTab] = useState<'stickers' | 'gifs'>('stickers');
  const [searchQuery, setSearchQuery] = useState('');

  const stickers = [
    { id: '1', emoji: '😀', name: 'Happy' },
    { id: '2', emoji: '😂', name: 'Laughing' },
    { id: '3', emoji: '❤️', name: 'Heart' },
    { id: '4', emoji: '🎉', name: 'Party' },
    { id: '5', emoji: '🔥', name: 'Fire' },
    { id: '6', emoji: '💯', name: 'Hundred' },
    { id: '7', emoji: '👍', name: 'Thumbs Up' },
    { id: '8', emoji: '🙏', name: 'Prayer' },
    { id: '9', emoji: '😍', name: 'Heart Eyes' },
    { id: '10', emoji: '🤔', name: 'Thinking' },
    { id: '11', emoji: '😎', name: 'Cool' },
    { id: '12', emoji: '🤗', name: 'Hug' },
  ];

  // In production, integrate with GIPHY API
  const gifs = [
    { id: '1', url: 'https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif', name: 'Dance' },
    { id: '2', url: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif', name: 'Celebrate' },
    { id: '3', url: 'https://media.giphy.com/media/kyLYXonQYYfwYDIeZl/giphy.gif', name: 'High Five' },
  ];

  const filteredStickers = stickers.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGifs = gifs.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              {activeTab === 'stickers' ? 'Stickers' : 'GIFs'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setActiveTab('stickers')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                activeTab === 'stickers'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              😀 Stickers
            </button>
            <button
              onClick={() => setActiveTab('gifs')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                activeTab === 'gifs'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              🎬 GIFs
            </button>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-purple-500 focus:outline-none"
          />
        </div>

        {/* Content */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {activeTab === 'stickers' ? (
            <div className="grid grid-cols-4 gap-4">
              {filteredStickers.map((sticker) => (
                <button
                  key={sticker.id}
                  onClick={() => {
                    onSelect('sticker', sticker.emoji);
                    onClose();
                  }}
                  className="aspect-square flex items-center justify-center text-5xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                  title={sticker.name}
                >
                  {sticker.emoji}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredGifs.map((gif) => (
                <button
                  key={gif.id}
                  onClick={() => {
                    onSelect('gif', gif.url);
                    onClose();
                  }}
                  className="aspect-square rounded-xl overflow-hidden hover:ring-4 ring-purple-500 transition-all"
                  title={gif.name}
                >
                  <img src={gif.url} alt={gif.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {(activeTab === 'stickers' ? filteredStickers : filteredGifs).length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No {activeTab} found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StickerGifPicker;
