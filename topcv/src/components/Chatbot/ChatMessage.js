import React from 'react';

const ChatMessage = ({ message }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isBot = message.sender === 'bot';

  return (
    <div className={`message ${isBot ? 'bot-message' : 'user-message'}`}>
      <div className="message-content">
        {isBot && <div className="bot-avatar">🤖</div>}
        <div className="message-bubble">
          <p className="message-text">{message.text}</p>
          <span className="message-time">{formatTime(message.timestamp)}</span>
        </div>
        {!isBot && <div className="user-avatar">👤</div>}
      </div>
    </div>
  );
};

export default ChatMessage;
