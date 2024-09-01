import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import '../components/ChatRoom.css';
// Create socket connection outside of component to prevent multiple connections
const socket = io();

function ChatRoom() {
  const { room } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState(() => localStorage.getItem('username') || '');
  const [userId] = useState(() => localStorage.getItem('userId') || uuidv4());

  useEffect(() => {
    const handleMessage = (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    };

    if (!username) {
      const user = prompt('Enter your username:');
      if (user) {
        setUsername(user);
        localStorage.setItem('username', user);
        localStorage.setItem('userId', userId); // Store user ID
        socket.emit('joinRoom', { room, username: user });
      } else {
        alert('Username is required to join the room.');
        return;
      }
    } else {
      socket.emit('joinRoom', { room, username });
    }

    socket.on('message', handleMessage);

    return () => {
      socket.off('message', handleMessage);
    };
  }, [room, username, userId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && message.trim()) {
      socket.emit('chatMessage', { room, userId, username, message });
      setMessage('');
    } else {
      alert('Please enter a message.');
    }
  };

  const handleChangeUsername = () => {
    const newUsername = prompt('Enter a new username:');
    if (newUsername) {
      setUsername(newUsername);
      localStorage.setItem('username', newUsername);
      socket.emit('changeUsername', { room, oldUsername: username, newUsername });
    }
  };

  return (
    <div className="chat-room">
      <h2>Room: {room}</h2>
      <button onClick={handleChangeUsername}>Change Username</button>
      <div id="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.userId === userId ? 'my-message' : ''}`}>
            <strong>{msg.userId === userId ? 'You' : msg.username}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatRoom;
