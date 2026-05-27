# SecureChat - Anonymous End-to-End Encrypted Messaging

A fully anonymous, peer-to-peer chat application with end-to-end encryption. No data is stored on any server, and all messages are permanently deleted when the session ends.

## 🔐 Features

### Security & Privacy
- **End-to-End Encryption**: All messages are encrypted using AES-256 encryption before being sent
- **Zero Data Storage**: No messages, logs, or metadata are stored on any server
- **Peer-to-Peer**: Direct WebRTC connections between users - no middle server can intercept messages
- **Complete Anonymity**: No registration, email, or phone number required
- **Session-Based**: All data is permanently erased when the session ends

### Functionality
- **Text Messaging**: Send encrypted text messages in real-time
- **File Sharing**: Share images, videos, documents, and other files (up to 5MB)
- **Cross-Device**: Access sessions from any device using the session ID and password
- **Unique Session IDs**: Each session gets a random, unique identifier
- **Secure Passwords**: Automatically generated strong passwords for each session

## 🚀 How It Works

### Creating a New Session
1. Click "Create New Session" on the homepage
2. Click "Generate Session" to create a new anonymous chat
3. You'll receive:
   - **Session ID**: A unique identifier (format: XXXX-XXXX-XXXX)
   - **Password**: A strong, randomly generated password
4. Copy and share both credentials with the person you want to chat with
5. Click "Start Secure Chat" to enter the chat room
6. Wait for the other person to join using the credentials

### Joining an Existing Session
1. Click "Join Existing Session" on the homepage
2. Enter the Session ID and Password provided by the session creator
3. Click "Join Secure Chat"
4. You'll be connected to the chat room instantly

### During the Chat
- **Send Messages**: Type in the text box and press Enter or click the send button
- **Share Files**: Click the attachment icon to upload images, videos, or documents
- **View Status**: See connection status at the top (green = connected, red = disconnected)
- **End Session**: Click "Exit" button and confirm to permanently delete all messages

## 🛠️ Technical Architecture

### Technologies Used
- **React + TypeScript**: Frontend framework with type safety
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **PeerJS**: WebRTC wrapper for easy peer-to-peer connections
- **CryptoJS**: JavaScript library for encryption/decryption

### Security Implementation

#### Encryption
- Uses AES-256 encryption for all messages
- Password-based key derivation using PBKDF2
- Unique initialization vector (IV) for each message
- Keys are never transmitted - only derived from the shared password

#### Peer-to-Peer Connection
- WebRTC DataChannel for direct peer-to-peer communication
- STUN servers for NAT traversal
- No server-side message storage or processing
- Only signaling data passes through PeerJS cloud (for connection setup)

#### Data Cleanup
- All session data stored only in memory or sessionStorage
- Automatic cleanup when session ends
- No persistent storage (no localStorage for sensitive data)
- Connection destruction on exit

### File Structure
```
src/
├── components/
│   ├── ChatRoom.tsx          # Main chat interface
│   ├── SessionCreate.tsx     # Session creation UI
│   └── SessionJoin.tsx        # Session joining UI
├── services/
│   ├── EncryptionService.ts  # AES encryption/decryption
│   └── PeerService.ts         # WebRTC peer connection management
├── types/
│   └── index.ts               # TypeScript type definitions
├── utils/
│   └── sessionUtils.ts        # Session ID/password generation
└── App.tsx                    # Main application component
```

## 📱 Usage Examples

### Example 1: Private Conversation
1. Alice creates a new session
2. Alice receives: ID `AB12-CD34-EF56` and password `xK9#mP2$qL5@wN8&`
3. Alice shares these credentials with Bob via a secure channel
4. Bob joins using the credentials
5. They can now chat privately with end-to-end encryption
6. When done, either party clicks "Exit" to delete all messages

### Example 2: File Sharing
1. User A creates a session and shares credentials with User B
2. Once connected, User A clicks the attachment icon
3. User A selects an image file (under 5MB)
4. The image is encrypted and sent to User B
5. User B sees the image and can download it
6. When session ends, the image is deleted from both devices

## ⚠️ Important Notes

### Limitations
- **File Size**: Maximum 5MB per file (to ensure smooth peer-to-peer transfer)
- **Browser Support**: Requires a modern browser with WebRTC support (Chrome, Firefox, Safari, Edge)
- **Connection**: Both users need to be online simultaneously
- **NAT/Firewall**: Some corporate networks may block WebRTC connections

### Security Considerations
- **Password Security**: The session password is the encryption key - keep it secret
- **Session Hijacking**: Anyone with the session ID and password can join
- **Connection**: Uses public STUN servers for NAT traversal (connection metadata visible)
- **Browser Security**: Messages are secure but browser extensions could potentially access data

### Best Practices
1. Share session credentials through a secure, separate channel
2. Verify the other person's identity before sharing sensitive information
3. Always click "Exit" when done to ensure complete data deletion
4. Don't reuse the same session - create a new one for each conversation
5. Use this for temporary, ephemeral communications

## 🔧 Development

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🌐 Deployment

The application is a static site that can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront

The built files are in the `dist/` folder after running `npm run build`.

## 📄 License

This project is open source and available for educational and personal use.

## ⚡ Performance

- **Lightweight**: Minimal bundle size (~400KB gzipped)
- **Fast**: Instant message delivery via WebRTC
- **Efficient**: No server-side processing overhead
- **Scalable**: Peer-to-peer architecture means no server load

## 🎯 Use Cases

- Quick private conversations
- Sharing sensitive information temporarily
- Anonymous feedback or whistleblowing
- Testing and demonstrating E2E encryption
- Privacy-focused communication
- Temporary file sharing without cloud storage

---

**Remember**: While this application provides strong encryption and privacy, it's designed for temporary, ephemeral communication. For long-term secure messaging, consider established platforms like Signal or WhatsApp.
