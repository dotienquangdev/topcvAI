import {
  TOGGLE_CHATBOT,
  SEND_MESSAGE,
  RECEIVE_MESSAGE,
  SET_TYPING,
  CLEAR_MESSAGES,
  SET_CHATBOT_MODE
} from '../actions/chatbotActions';

const initialState = {
  isOpen: false,
  messages: [],
  isTyping: false,
  mode: 'ask' // 'ask' or 'agent'
};

const chatbotReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_CHATBOT:
      return {
        ...state,
        isOpen: !state.isOpen
      };

    case SEND_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
        isTyping: true
      };

    case RECEIVE_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
        isTyping: false
      };

    case SET_TYPING:
      return {
        ...state,
        isTyping: action.payload
      };

    case CLEAR_MESSAGES:
      return {
        ...state,
        messages: []
      };

    case SET_CHATBOT_MODE:
      return {
        ...state,
        mode: action.payload,
        messages: [] // Clear messages when switching mode
      };

    default:
      return state;
  }
};

export default chatbotReducer;
