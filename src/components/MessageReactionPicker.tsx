import React from 'react';

interface MessageReactionPickerProps {
  onReact: (emoji: string) => void;
  onClose: () => void;
  position: { x: number; y: number };
}

const MessageReactionPicker: React.FC<MessageReactionPickerProps> = ({ onReact, onClose, position }) => {
  const reactions = ['❤️', '😂', '😮', '😢', '😡', '👍', '👎', '🎉', '🔥', '💯'];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Picker */}
      <div 
        className="fixed z-50 bg-white dark:bg-gray-800 rounded-full shadow-2xl px-3 py-2 flex space-x-1 animate-scale-in"
        style={{
          left: `${position.x}px`,
          top: `${position.y - 60}px`,
          transform: 'translateX(-50%)'
        }}
      >
        {reactions.map((emoji) => (
          <button
            key={emoji}
            onClick={() => {
              onReact(emoji);
              onClose();
            }}
            className="text-2xl hover:scale-150 transition-transform duration-200 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {emoji}
          </button>
        ))}
      </div>
    </>
  );
};

export default MessageReactionPicker;
