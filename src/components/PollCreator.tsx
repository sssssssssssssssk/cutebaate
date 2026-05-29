import React, { useState } from 'react';

interface Poll {
  id: string;
  question: string;
  options: { id: string; text: string; votes: string[] }[];
  createdBy: string;
  createdAt: number;
  expiresAt?: number;
  allowMultiple: boolean;
  anonymous: boolean;
}

interface PollCreatorProps {
  userId: string;
  onCreatePoll: (poll: Poll) => void;
  onClose: () => void;
}

const PollCreator: React.FC<PollCreatorProps> = ({ userId, onCreatePoll, onClose }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [anonymous, setAnonymous] = useState(true);
  const [expiryHours, setExpiryHours] = useState(24);

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreate = () => {
    if (!question.trim() || options.filter(o => o.trim()).length < 2) {
      alert('Please enter a question and at least 2 options');
      return;
    }

    const poll: Poll = {
      id: `poll_${Date.now()}`,
      question: question.trim(),
      options: options
        .filter(o => o.trim())
        .map((text, i) => ({
          id: `opt_${i}`,
          text: text.trim(),
          votes: []
        })),
      createdBy: userId,
      createdAt: Date.now(),
      expiresAt: Date.now() + (expiryHours * 60 * 60 * 1000),
      allowMultiple,
      anonymous
    };

    onCreatePoll(poll);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">📊 Create Poll</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Question
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What would you like to ask?"
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Options
            </label>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-purple-500 focus:outline-none"
                  />
                  {options.length > 2 && (
                    <button
                      onClick={() => removeOption(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            {options.length < 10 && (
              <button
                onClick={addOption}
                className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-semibold"
              >
                + Add Option
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Expires in (hours)
            </label>
            <input
              type="number"
              value={expiryHours}
              onChange={(e) => setExpiryHours(parseInt(e.target.value) || 24)}
              min={1}
              max={168}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={allowMultiple}
                onChange={(e) => setAllowMultiple(e.target.checked)}
                className="w-5 h-5"
              />
              <span className="text-gray-700 dark:text-gray-300">Allow multiple choices</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="w-5 h-5"
              />
              <span className="text-gray-700 dark:text-gray-300">Anonymous voting</span>
            </label>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 p-6 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="flex-1 bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600"
          >
            Create Poll
          </button>
        </div>
      </div>
    </div>
  );
};

export default PollCreator;
