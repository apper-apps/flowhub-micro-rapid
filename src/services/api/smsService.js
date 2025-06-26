import smsData from '@/services/mockData/smsData.json';

let conversations = [...smsData];
let nextId = Math.max(...conversations.map(c => c.Id)) + 1;

// Mock messages data
const mockMessages = {
  1: [
    { Id: 1, conversationId: 1, content: "Hi, I'm interested in your CRM solution.", sender: "customer", timestamp: "2024-01-15T10:00:00Z" },
    { Id: 2, conversationId: 1, content: "Hello! I'd be happy to help you with that. What specific features are you looking for?", sender: "agent", timestamp: "2024-01-15T10:05:00Z" },
    { Id: 3, conversationId: 1, content: "I need contact management and email automation.", sender: "customer", timestamp: "2024-01-15T10:10:00Z" },
    { Id: 4, conversationId: 1, content: "Perfect! Our CRM has both features. Would you like to schedule a demo?", sender: "agent", timestamp: "2024-01-15T10:15:00Z" },
    { Id: 5, conversationId: 1, content: "Thanks for the quick response! I'll get back to you soon.", sender: "customer", timestamp: "2024-01-15T14:30:00Z" }
  ],
  2: [
    { Id: 6, conversationId: 2, content: "Hello, I saw your ad online.", sender: "customer", timestamp: "2024-01-15T13:00:00Z" },
    { Id: 7, conversationId: 2, content: "Hi there! Thanks for reaching out. How can I help you today?", sender: "agent", timestamp: "2024-01-15T13:05:00Z" },
    { Id: 8, conversationId: 2, content: "Can we schedule a call for tomorrow?", sender: "customer", timestamp: "2024-01-15T13:45:00Z" }
  ],
  3: [
    { Id: 9, conversationId: 3, content: "The integration is working perfectly now.", sender: "customer", timestamp: "2024-01-15T12:00:00Z" },
    { Id: 10, conversationId: 3, content: "That's great to hear! Is there anything else you need help with?", sender: "agent", timestamp: "2024-01-15T12:10:00Z" },
    { Id: 11, conversationId: 3, content: "Perfect! I'll send the documents over.", sender: "customer", timestamp: "2024-01-15T12:20:00Z" }
  ]
};

let messageNextId = 100;

const smsService = {
  // Get all conversations
  getAll: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...conversations]);
      }, 200);
    });
  },

  // Get conversation by ID
  getById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const conversation = conversations.find(c => c.Id === parseInt(id));
        if (conversation) {
          resolve({ ...conversation });
        } else {
          reject(new Error('Conversation not found'));
        }
      }, 200);
    });
  },

  // Create new conversation
  create: async (conversationData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newConversation = {
          Id: nextId++,
          ...conversationData,
          lastMessageTime: new Date().toISOString(),
          unreadCount: 0,
          status: 'new'
        };
        conversations.push(newConversation);
        resolve({ ...newConversation });
      }, 300);
    });
  },

  // Update conversation
  update: async (id, updates) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = conversations.findIndex(c => c.Id === parseInt(id));
        if (index !== -1) {
          conversations[index] = { ...conversations[index], ...updates };
          resolve({ ...conversations[index] });
        } else {
          reject(new Error('Conversation not found'));
        }
      }, 300);
    });
  },

  // Delete conversation
  delete: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = conversations.findIndex(c => c.Id === parseInt(id));
        if (index !== -1) {
          const deleted = conversations.splice(index, 1)[0];
          // Also delete associated messages
          delete mockMessages[id];
          resolve({ ...deleted });
        } else {
          reject(new Error('Conversation not found'));
        }
      }, 300);
    });
  },

  // Get messages for a conversation
  getMessages: async (conversationId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const messages = mockMessages[conversationId] || [];
        resolve([...messages]);
      }, 200);
    });
  },

  // Send a message
  sendMessage: async (messageData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newMessage = {
          Id: messageNextId++,
          ...messageData,
          timestamp: new Date().toISOString()
        };
        
        const conversationId = messageData.conversationId;
        if (!mockMessages[conversationId]) {
          mockMessages[conversationId] = [];
        }
        mockMessages[conversationId].push(newMessage);
        
        // Update conversation's last message
        const conversationIndex = conversations.findIndex(c => c.Id === conversationId);
        if (conversationIndex !== -1) {
          conversations[conversationIndex].lastMessage = messageData.content;
          conversations[conversationIndex].lastMessageTime = newMessage.timestamp;
        }
        
        resolve({ ...newMessage });
      }, 300);
    });
  }
};

export default smsService;