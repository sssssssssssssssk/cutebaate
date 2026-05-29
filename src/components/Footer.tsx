import React from 'react';

interface FooterProps {
  onTermsClick: () => void;
  onPrivacyClick: () => void;
  onReportClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onTermsClick, onPrivacyClick, onReportClick }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full"></div>
              <h3 className="text-lg font-bold text-white">SecureChat</h3>
            </div>
            <p className="text-sm text-gray-400">
              Anonymous, end-to-end encrypted messaging for secure and private conversations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={onTermsClick}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={onPrivacyClick}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={onReportClick}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Report Abuse
                </button>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-white font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>✓ End-to-End Encryption</li>
              <li>✓ Zero Data Storage</li>
              <li>✓ Fully Anonymous</li>
              <li>✓ File Sharing</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
            <p>&copy; {currentYear} SecureChat. All rights reserved.</p>
            <div className="mt-4 md:mt-0 space-x-4">
              <span>Secured with AES-256 Encryption</span>
              <span>•</span>
              <span>P2P Technology</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-gray-700 rounded-lg text-xs text-gray-400">
          <p>
            <strong>Disclaimer:</strong> SecureChat provides encryption technology for private communication. 
            Users are responsible for their own use. We do not store, monitor, or have access to message content.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
