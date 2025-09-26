import React, { useState, useRef } from 'react';

const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <div className="input-container">
        <textarea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nhập tin nhắn..."
          className="chat-input"
          rows="1"
          maxLength="1000"
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={!message.trim()}
        >
          <span className="send-icon">➤</span>
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
