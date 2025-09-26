import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import './Chatbot.css';
import { toggleChatbot, sendMessage, receiveMessage, setChatbotMode } from '../../actions/chatbotActions';
import { chatbotAPI } from '../../services/chatbotAPI';

const Chatbot = () => {
  const dispatch = useDispatch();
  const { isOpen, messages, isTyping, mode } = useSelector(state => state.chatbot);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // Thêm tin nhắn chào mừng khi mở chatbot lần đầu
    if (isOpen && messages.length === 0) {
      const welcomeMessage = mode === 'agent' 
        ? 'Xin chào! Tôi là AI Agent, có thể giúp bạn thực hiện các tác vụ phức tạp.'
        : 'Xin chào! Tôi có thể trả lời câu hỏi của bạn.';
      
      dispatch(receiveMessage({
        id: Date.now(),
        text: welcomeMessage,
        sender: 'bot',
        timestamp: new Date().toISOString()
      }));
    }
  }, [isOpen, messages.length, mode, dispatch]);

  const handleToggle = () => {
    dispatch(toggleChatbot());
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleModeChange = (newMode) => {
    dispatch(setChatbotMode(newMode));
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // Gửi tin nhắn của user
    const userMessage = {
      id: Date.now(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    dispatch(sendMessage(userMessage));

    try {
      // Gọi API chatbot với chế độ hiện tại
      const response = await chatbotAPI.sendMessage(text, mode);
      
      // Simulate typing delay
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          text: response.text || 'Xin lỗi, tôi không hiểu câu hỏi của bạn.',
          sender: 'bot',
          timestamp: new Date().toISOString()
        };
        dispatch(receiveMessage(botMessage));
      }, 1000);
    } catch (error) {
      console.error('Chatbot API error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau. ' + error.message,
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      dispatch(receiveMessage(errorMessage));
    }
  };

  if (!isOpen) {
    return (
      <div className="chatbot-trigger" onClick={handleToggle}>
        <div className="chatbot-icon">
          💬
        </div>
        <div className="chatbot-tooltip">Chat với chúng tôi</div>
      </div>
    );
  }

  return (
    <div className={`chatbot-container ${isMinimized ? 'minimized' : ''}`}>
      <div className="chatbot-header">
        <div className="chatbot-title">
          <span className="chatbot-avatar">🤖</span>
          <div>
            <h4>TopCV Assistant</h4>
            <span className="online-status">Online - {mode === 'ask' ? 'Q&A Mode' : 'Agent Mode'}</span>
          </div>
        </div>
        <div className="chatbot-controls">
          <button 
            className="minimize-btn" 
            onClick={handleMinimize}
            title={isMinimized ? 'Mở rộng' : 'Thu gọn'}
          >
            {isMinimized ? '🔼' : '🔽'}
          </button>
          <button 
            className="close-btn" 
            onClick={handleToggle}
            title="Đóng chat"
          >
            ✕
          </button>
        </div>
      </div>
      
      {!isMinimized && (
        <>
          <div className="chatbot-mode-selector">
            <button 
              className={`mode-btn ${mode === 'ask' ? 'active' : ''}`}
              onClick={() => handleModeChange('ask')}
            >
              Ask Mode
            </button>
            <button 
              className={`mode-btn ${mode === 'agent' ? 'active' : ''}`}
              onClick={() => handleModeChange('agent')}
            >
              Agent Mode
            </button>
          </div>
          <ChatWindow messages={messages} isTyping={isTyping} />
          <ChatInput onSendMessage={handleSendMessage} />
        </>
      )}
    </div>
  );
};

export default Chatbot;
