# Real-Time AI Chat Streaming Integration

This application now includes **real-time streaming** of OpenAI chat completions, giving you ChatGPT-like real-time response behavior. The implementation combines WebSocket connections with streaming OpenAI responses.

## 🚀 Features

### Real-Time Streaming
- **Live AI Responses**: Stream OpenAI responses in real-time as they're generated
- **WebSocket Communication**: Instant bidirectional communication
- **Room-Based Chat**: Multiple users can join rooms and see streamed responses
- **Connection Management**: Automatic connection handling and cleanup

### Integration Options
1. **WebSocket Gateway**: Direct WebSocket connection for real-time streaming
2. **LiveKit Integration**: Advanced real-time communication with video/audio capabilities
3. **REST API**: Traditional API endpoints for non-streaming requests

## 🎯 Real-Time Streaming Usage

### WebSocket Events

#### Client → Server Events

**Connect to Streaming**
```javascript
const socket = io('http://localhost:4000'); // or your deployed URL

socket.on('connected', (data) => {
    console.log('Connected:', data);
});
```

**Join a Room (Optional)**
```javascript
socket.emit('join-room', {
    roomName: 'my-chat-room',
    participantName: 'John Doe'
});
```

**Start Streaming Chat**
```javascript
socket.emit('stream-chat', {
    messages: [
        { role: 'user', content: 'Explain quantum computing in simple terms' }
    ]
});
```

#### Server → Client Events

**Stream Start**
```javascript
socket.on('stream-start', (data) => {
    console.log('AI started responding...', data);
    // Show "AI is typing..." indicator
});
```

**Stream Chunks (Real-time)**
```javascript
socket.on('stream-chunk', (data) => {
    console.log('New content:', data.content);
    console.log('Full response so far:', data.fullResponse);
    
    // Update UI with new content in real-time
    updateChatUI(data.content, data.isComplete);
});
```

**Stream Complete**
```javascript
socket.on('stream-complete', (data) => {
    console.log('AI finished responding:', data.fullResponse);
    // Hide "AI is typing..." indicator
    // Show final response
});
```

**Stream Error**
```javascript
socket.on('stream-error', (error) => {
    console.error('Streaming error:', error);
    // Handle error (show error message, retry, etc.)
});
```

## 💻 Frontend Implementation Examples

### React Implementation

```jsx
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

function StreamingChat() {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [currentResponse, setCurrentResponse] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);

    useEffect(() => {
        const newSocket = io('http://localhost:4000');
        setSocket(newSocket);

        newSocket.on('stream-start', () => {
            setIsStreaming(true);
            setCurrentResponse('');
        });

        newSocket.on('stream-chunk', (data) => {
            setCurrentResponse(data.fullResponse);
        });

        newSocket.on('stream-complete', (data) => {
            setIsStreaming(false);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.fullResponse,
                timestamp: data.timestamp
            }]);
            setCurrentResponse('');
        });

        return () => newSocket.close();
    }, []);

    const sendMessage = (message) => {
        const newMessages = [...messages, { role: 'user', content: message }];
        setMessages(newMessages);
        
        socket.emit('stream-chat', {
            messages: newMessages
        });
    };

    return (
        <div>
            {messages.map((msg, idx) => (
                <div key={idx} className={msg.role}>
                    {msg.content}
                </div>
            ))}
            
            {isStreaming && (
                <div className="assistant streaming">
                    {currentResponse}
                    <span className="cursor">|</span>
                </div>
            )}
            
            {/* Your input component here */}
        </div>
    );
}
```

### JavaScript (Vanilla) Implementation

```javascript
// Connect to streaming server
const socket = io('http://localhost:4000');

// DOM elements
const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

let currentMessageDiv = null;

// Handle streaming events
socket.on('stream-start', () => {
    // Create new message div for AI response
    currentMessageDiv = document.createElement('div');
    currentMessageDiv.className = 'message ai-message';
    currentMessageDiv.innerHTML = '<span class="typing-indicator">AI is typing...</span>';
    messagesContainer.appendChild(currentMessageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

socket.on('stream-chunk', (data) => {
    if (currentMessageDiv) {
        currentMessageDiv.textContent = data.fullResponse;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
});

socket.on('stream-complete', (data) => {
    if (currentMessageDiv) {
        currentMessageDiv.classList.add('complete');
        currentMessageDiv = null;
    }
});

// Send message function
function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    // Add user message to UI
    const userDiv = document.createElement('div');
    userDiv.className = 'message user-message';
    userDiv.textContent = message;
    messagesContainer.appendChild(userDiv);

    // Send to server for streaming response
    socket.emit('stream-chat', {
        messages: [{ role: 'user', content: message }]
    });

    messageInput.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
```

## 🏗️ API Endpoints

### Traditional (Non-Streaming) Endpoints

**Standard Chat Completion**
```
POST /openai/chatCompletion
Content-Type: application/json

{
    "messages": [
        {"role": "user", "content": "Hello!"}
    ]
}
```

**Create Streaming Session**
```
POST /openai/chatCompletion/stream/start
Content-Type: application/json

{
    "sessionId": "unique-session-id",
    "messages": [
        {"role": "user", "content": "Hello!"}
    ]
}
```

### WebSocket Connection
```
ws://localhost:4000/socket.io/
```

## 🔧 Setup Instructions

### 1. Environment Variables
Your `.env` file should include:
```
OPENAI_API_KEY=your-openai-api-key
PORT=4000
LIVEKIT_URL=wss://your-livekit-server.com (optional)
LIVEKIT_API_KEY=your-livekit-api-key (optional)
LIVEKIT_API_SECRET=your-livekit-api-secret (optional)
```

### 2. Frontend Dependencies

**For React:**
```bash
npm install socket.io-client
```

**For Vanilla JavaScript:**
```html
<script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
```

### 3. CORS Configuration
The WebSocket gateway is configured to allow all origins during development. Update for production:

```typescript
@WebSocketGateway({
  cors: {
    origin: ["https://yourdomain.com"],
    methods: ["GET", "POST"],
    credentials: true,
  },
})
```

## 🚀 Deployment

### Vercel Deployment
The WebSocket functionality works with Vercel's serverless functions. The current configuration supports:
- HTTP endpoints (REST API)
- WebSocket connections
- Real-time streaming

### Environment Variables for Production
Add these to your Vercel dashboard:
- `OPENAI_API_KEY`
- `LIVEKIT_URL` (optional)
- `LIVEKIT_API_KEY` (optional)  
- `LIVEKIT_API_SECRET` (optional)

## 🎨 UI/UX Considerations

### Streaming Visual Effects
- **Typing Indicator**: Show when AI starts responding
- **Real-time Text**: Update text as chunks arrive
- **Cursor Animation**: Add blinking cursor during streaming
- **Smooth Scrolling**: Auto-scroll to show new content
- **Loading States**: Show connection status

### CSS Example
```css
.streaming .cursor {
    animation: blink 1s infinite;
}

@keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
}

.ai-message.streaming {
    border-left: 3px solid #00ff00;
    background: #f0f8ff;
}
```

## 🔍 Testing

### Test Streaming Locally
1. Start the server: `npm run start:dev`
2. Open browser to `http://localhost:4000`
3. Open browser console
4. Connect WebSocket:
```javascript
const socket = io('http://localhost:4000');
socket.emit('stream-chat', {
    messages: [{ role: 'user', content: 'Write a short poem' }]
});
```

### Expected Behavior
- Immediate `stream-start` event
- Multiple `stream-chunk` events with incremental content
- Final `stream-complete` event with full response
- Real-time typing effect in UI

## 🐛 Troubleshooting

### Common Issues
1. **WebSocket Connection Failed**: Check CORS settings and server URL
2. **Streaming Not Working**: Verify OpenAI API key has sufficient quota
3. **Slow Streaming**: Check internet connection and OpenAI API limits
4. **Memory Issues**: Monitor for connection leaks, ensure proper cleanup

### Debug Mode
Enable debug logging:
```javascript
const socket = io('http://localhost:4000', {
    debug: true
});
```

This implementation gives you **real-time ChatGPT-like streaming behavior** where users see the AI response being "typed" in real-time, just like in ChatGPT's interface!