// Chatbot API Service
const API_BASE_URL = process.env.REACT_APP_CHATBOT_API || "http://localhost:3001";

export const chatbotAPI = {
  // Gửi tin nhắn đến chatbot
  sendMessage: async (message, type = 'ask') => {
    try {
      const endpoint = type === 'agent' ? '/agent' : '/chat';
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          type,
          timestamp: new Date().toISOString(),
          sessionId:
            localStorage.getItem("chatSessionId") || generateSessionId(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Chatbot API error:", error);
      
      // Fallback to mock responses if API fails
      return getMockResponse(message);
    }
  },

  // Lấy lịch sử chat (nếu cần)
  getChatHistory: async (sessionId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/chat/history/${sessionId}`
      );
      return await response.json();
    } catch (error) {
      console.error("Get chat history error:", error);
      throw error;
    }
  },

  // Tạo session mới
  createSession: async () => {
    try {
      const sessionId = generateSessionId();
      localStorage.setItem("chatSessionId", sessionId);
      return { sessionId };
    } catch (error) {
      console.error("Create session error:", error);
      throw error;
    }
  },
};

// Helper function tạo session ID
const generateSessionId = () => {
  return (
    "chat_" +
    Date.now() +
    "_" +
    Math.random().toString(36).substr(2, 9)
  );
};

// Mock responses for fallback
const getMockResponse = (message) => {
  const responses = {
    'xin chào': 'Chào bạn, cần hỗ trợ gì?',
    'hello': 'Hi, how can I help?',
    'giúp tôi': 'Bạn cần giúp về việc làm hay CV?',
    'cv': 'Bạn muốn tạo mới hay cải thiện CV?',
    'việc làm': 'Bạn tìm việc lĩnh vực nào?',
    'job': 'What field are you targeting?',
    'tạm biệt': 'Tạm biệt 👋',
    'bye': 'Goodbye 👋'
  };

  const lowerMessage = message.toLowerCase();
  let response = responses[lowerMessage];

  // Tìm response gần nhất
  if (!response) {
    for (const [key, value] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        response = value;
        break;
      }
    }
  }

  // Default response
  if (!response) {
    response = `Cho biết bạn muốn tìm việc, tạo CV hay hỏi gì cụ thể. + user message: ${message}`;
  }

  return {
    text: response,
    received: message,
    ts: new Date().toISOString()
  };
};
