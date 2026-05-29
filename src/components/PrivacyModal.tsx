import React from 'react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Privacy Policy</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 text-gray-700 space-y-6">
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">1. Introduction</h3>
            <p>
              SecureChat ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains
              our privacy practices and how we collect, use, disclose, and safeguard your information when you use our
              website and services.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">2. Information We Collect</h3>
            <div className="space-y-3 ml-2">
              <div>
                <h4 className="font-semibold text-gray-700">Personal Information:</h4>
                <p className="mt-1">
                  We do NOT collect personal information like names, email addresses, or phone numbers. You remain
                  completely anonymous on SecureChat.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Session Information:</h4>
                <p className="mt-1">
                  Session IDs and passwords are generated locally on your device and never stored on our servers.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Device Information:</h4>
                <p className="mt-1">
                  We may collect basic device information through Google Analytics (page views, duration, browser type)
                  for service improvement purposes only.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Log Data:</h4>
                <p className="mt-1">
                  Chat messages are NOT logged. They exist only during your active session and are deleted when you
                  exit.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">3. How We Use Information</h3>
            <p>We use collected information to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
              <li>Provide and maintain our Service</li>
              <li>Notify you about changes to our Service</li>
              <li>Display advertisements from Google AdSense</li>
              <li>Analyze usage patterns to improve our Service</li>
              <li>Detect and prevent fraudulent transactions and abuse</li>
              <li>Provide customer support and respond to reports</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">4. End-to-End Encryption</h3>
            <p>
              All messages on SecureChat are encrypted using AES-256 encryption. Neither SecureChat nor any third party
              can decrypt your messages. The encryption key is derived from the session password, which is never
              transmitted or stored.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">5. No Message Storage</h3>
            <p>
              SecureChat does NOT store chat messages. All messages exist only in memory during your active session.
              When you exit the chat or close your browser, all messages are permanently deleted from your device and
              never touch our servers.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">6. Advertisements</h3>
            <p>
              SecureChat uses Google AdSense to display advertisements. Google may use cookies and similar technologies
              to serve ads based on your prior visits. You can learn more about Google's advertising practices by
              visiting Google's Privacy Policy.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">7. Cookies & Tracking</h3>
            <p>
              We use essential cookies for service functionality and Google Analytics cookies for usage statistics.
              These do not track your chat content. You can disable cookies in your browser settings.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">8. Third-Party Services</h3>
            <p>
              SecureChat uses third-party services including:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
              <li>Google AdSense (advertising)</li>
              <li>Google Analytics (usage analytics)</li>
              <li>PeerJS (peer-to-peer connections)</li>
              <li>Hosting providers (website hosting)</li>
            </ul>
            <p className="mt-3">
              These services may have their own privacy policies. We encourage you to review them.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">9. Security</h3>
            <p>
              We take security seriously. However, no method of transmission over the internet is 100% secure. While
              we use industry-standard encryption, we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">10. User Rights</h3>
            <p>
              Since we don't collect personal information, there is no personal data to access, modify, or delete.
              However, you can always clear your browser data and cache to remove any local information.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">11. Changes to Privacy Policy</h3>
            <p>
              SecureChat may update this Privacy Policy from time to time. We will notify you of any changes by
              updating the "Last Updated" date of this Privacy Policy.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">12. Contact Us</h3>
            <p>
              If you have questions about this Privacy Policy or our privacy practices, please use the Report button
              in the chat interface to contact us.
            </p>
          </section>

          <section className="text-sm text-gray-500 border-t border-gray-200 pt-4">
            <p>Last Updated: {new Date().toLocaleDateString()}</p>
          </section>
        </div>

        <div className="border-t border-gray-200 p-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
