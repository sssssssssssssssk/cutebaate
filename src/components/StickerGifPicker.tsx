import React, { useState } from 'react';

interface StickerGifPickerProps {
  onSelect: (type: 'sticker' | 'gif', data: string) => void;
  onClose: () => void;
}

type EmojiCategory = 'smileys' | 'gestures' | 'celebrations' | 'stickers';

const StickerGifPicker: React.FC<StickerGifPickerProps> = ({ onSelect, onClose }) => {
  const [activeTab, setActiveTab] = useState<EmojiCategory>('smileys');
  const [searchQuery, setSearchQuery] = useState('');

  const emojiCategories: Record<Exclude<EmojiCategory, 'stickers'>, { name: string; icon: string; emojis: string[] }> = {
    smileys: {
      name: 'Smileys & Emotion',
      icon: '😀',
      emojis: [
        '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', 
        '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', 
        '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', 
        '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', 
        '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', 
        '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', 
        '💀', '☠️', '👽', '👾', '🤖', '🎃'
      ]
    },
    gestures: {
      name: 'Hearts & Gestures',
      icon: '👋',
      emojis: [
        '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', 
        '💘', '💝', '💟', '👍', '👎', '✊', '👊', '🤛', '🤜', '🤞', '✌️', '🤟', '🤘', '👌', '🤏', '👈', 
        '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐️', '🖖', '👋', '🤙', '💪', '🖕', '✍️', '🙏', '🤝', '👏', 
        '🙌', '👐', '🤲', '👂', '👃', '🧠', '🦷', '👁️', '👀'
      ]
    },
    celebrations: {
      name: 'Activities & Celebrations',
      icon: '🎉',
      emojis: [
        '🎉', '🎊', '🎈', '🎂', '🎁', '🎇', '🎆', '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', 
        '🎱', '🪀', '🏓', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', 
        '🥋', '🥇', '🥈', '🥉', '🏅', '🏆', '🏵️', '🎫', '🎟️', '🎭', '🎨', '🎬', '🎤', '🎧', '🎷', '🎺', 
        '🎸', '🪕', '🎻', '🎲', '🧩', '♟️', '🎳'
      ]
    }
  };

  const stickers = [
    { id: 'st1', emoji: '🦊', name: 'Cool Fox' },
    { id: 'st2', emoji: '🦁', name: 'Happy Lion' },
    { id: 'st3', emoji: '🦄', name: 'Magic Unicorn' },
    { id: 'st4', emoji: '🐼', name: 'Cute Panda' },
    { id: 'st5', emoji: '🐨', name: 'Sleepy Koala' },
    { id: 'st6', emoji: '👾', name: 'Pixel Alien' },
    { id: 'st7', emoji: '👻', name: 'Spooky Ghost' },
    { id: 'st8', emoji: '🤖', name: 'Retro Robot' },
    { id: 'st9', emoji: '🔥', name: 'Fire Sticker' },
    { id: 'st10', emoji: '💯', name: 'Golden Score' },
    { id: 'st11', emoji: '🌟', name: 'Bright Star' },
    { id: 'st12', emoji: '🦖', name: 'Baby Dino' },
  ];

  const getFilteredItems = () => {
    if (activeTab === 'stickers') {
      return stickers.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    const cat = emojiCategories[activeTab];
    if (!cat) return [];
    return cat.emojis.filter(emoji => 
      searchQuery ? emoji.includes(searchQuery) : true
    );
  };

  const items = getFilteredItems();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in select-none">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[80vh] transition-colors">
        {/* Header */}
        <div className="border-b border-zinc-200 dark:border-zinc-800 p-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-zinc-100 flex items-center space-x-2">
              <span>😀</span>
              <span>Emojis & Stickers</span>
            </h3>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-250 cursor-pointer text-sm font-bold"
            >
              ✕
            </button>
          </div>

          {/* Categories Tab Selector */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-zinc-950 p-1 rounded-xl mb-4 transition-colors">
            {Object.entries(emojiCategories).map(([key, value]) => (
              <button
                key={key}
                onClick={() => { setActiveTab(key as EmojiCategory); setSearchQuery(''); }}
                className={`flex-1 py-2 px-1 text-center rounded-lg font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                  activeTab === key
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'text-gray-600 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-zinc-200'
                }`}
                title={value.name}
              >
                <span className="mr-1">{value.icon}</span>
                <span className="hidden sm:inline">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              </button>
            ))}
            <button
              onClick={() => { setActiveTab('stickers'); setSearchQuery(''); }}
              className={`flex-1 py-2 px-1 text-center rounded-lg font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'stickers'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-zinc-200'
              }`}
              title="Cute Stickers"
            >
              <span className="mr-1">🦊</span>
              <span className="hidden sm:inline">Stickers</span>
            </button>
          </div>

          {/* Search Box */}
          <input
            type="text"
            placeholder={activeTab === 'stickers' ? 'Search stickers...' : 'Filter emojis...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-purple-500 focus:outline-hidden transition-colors"
          />
        </div>

        {/* Content Box */}
        <div className="p-4 overflow-y-auto flex-1 bg-zinc-50 dark:bg-zinc-950/40">
          {activeTab === 'stickers' ? (
            <div className="grid grid-cols-4 gap-3">
              {(items as typeof stickers).map((sticker) => (
                <button
                  key={sticker.id}
                  onClick={() => {
                    onSelect('sticker', sticker.emoji);
                    onClose();
                  }}
                  className="aspect-square flex flex-col items-center justify-center text-4xl hover:bg-purple-50 dark:hover:bg-zinc-800/80 rounded-xl transition-all cursor-pointer active:scale-90"
                  title={sticker.name}
                >
                  <span>{sticker.emoji}</span>
                  <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-medium mt-1 truncate max-w-full px-1">{sticker.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-3.5">
              {(items as string[]).map((emoji, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    // Send emoji as sticker/emoji packet
                    onSelect('sticker', emoji);
                    onClose();
                  }}
                  className="aspect-square flex items-center justify-center text-3xl sm:text-3.5xl hover:bg-purple-50 dark:hover:bg-zinc-850 rounded-xl transition-all cursor-pointer active:scale-90"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {items.length === 0 && (
            <div className="text-center py-12 text-sm text-zinc-400 dark:text-zinc-500 font-semibold">
              No matching emojis found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StickerGifPicker;
