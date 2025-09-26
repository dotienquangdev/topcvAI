// Chatbot Actions
export const TOGGLE_CHATBOT = 'TOGGLE_CHATBOT';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';
export const SET_TYPING = 'SET_TYPING';
export const CLEAR_MESSAGES = 'CLEAR_MESSAGES';
export const SET_CHATBOT_MODE = 'SET_CHATBOT_MODE';

export const toggleChatbot = () => ({
  type: TOGGLE_CHATBOT
});

export const sendMessage = (message) => ({
  type: SEND_MESSAGE,
  payload: message
});

export const receiveMessage = (message) => ({
  type: RECEIVE_MESSAGE,
  payload: message
});

export const setTyping = (isTyping) => ({
  type: SET_TYPING,
  payload: isTyping
});

export const clearMessages = () => ({
  type: CLEAR_MESSAGES
});

export const setChatbotMode = (mode) => ({
  type: SET_CHATBOT_MODE,
  payload: mode
});
