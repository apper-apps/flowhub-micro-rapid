const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock messages data for demonstration
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
  ]
};

let messageNextId = 100;

const smsService = {
  // Get all conversations
  getAll: async () => {
    try {
      await delay(200);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "customer_name" } },
          { field: { Name: "phone_number" } },
          { field: { Name: "last_message" } },
          { field: { Name: "last_message_time" } },
          { field: { Name: "unread_count" } },
          { field: { Name: "status" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('sms_conversation', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching SMS conversations:', error);
      throw error;
    }
  },

  // Get conversation by ID
  getById: async (id) => {
    try {
      await delay(200);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "customer_name" } },
          { field: { Name: "phone_number" } },
          { field: { Name: "last_message" } },
          { field: { Name: "last_message_time" } },
          { field: { Name: "unread_count" } },
          { field: { Name: "status" } }
        ]
      };
      
      const response = await apperClient.getRecordById('sms_conversation', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching SMS conversation with ID ${id}:`, error);
      throw error;
    }
  },

  // Create new conversation
  create: async (conversationData) => {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields
      const params = {
        records: [
          {
            Name: conversationData.Name || `Conversation with ${conversationData.customer_name || conversationData.customerName}`,
            Tags: conversationData.Tags || '',
            Owner: conversationData.Owner || '',
            customer_name: conversationData.customer_name || conversationData.customerName,
            phone_number: conversationData.phone_number || conversationData.phoneNumber,
            last_message: conversationData.last_message || conversationData.lastMessage || '',
            last_message_time: conversationData.last_message_time || conversationData.lastMessageTime || new Date().toISOString(),
            unread_count: conversationData.unread_count || conversationData.unreadCount || 0,
            status: conversationData.status || 'new'
          }
        ]
      };
      
      const response = await apperClient.createRecord('sms_conversation', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error('Error creating SMS conversation:', error);
      throw error;
    }
  },

  // Update conversation
  update: async (id, updates) => {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: updates.Name,
            Tags: updates.Tags,
            Owner: updates.Owner,
            customer_name: updates.customer_name || updates.customerName,
            phone_number: updates.phone_number || updates.phoneNumber,
            last_message: updates.last_message || updates.lastMessage,
            last_message_time: updates.last_message_time || updates.lastMessageTime,
            unread_count: updates.unread_count || updates.unreadCount,
            status: updates.status
          }
        ]
      };
      
      const response = await apperClient.updateRecord('sms_conversation', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error('Error updating SMS conversation:', error);
      throw error;
    }
  },

  // Delete conversation
  delete: async (id) => {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('sms_conversation', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        // Also delete associated messages
        delete mockMessages[id];
        return true;
      }
    } catch (error) {
      console.error('Error deleting SMS conversation:', error);
      throw error;
    }
  },

  // Get messages for a conversation (mock for now since message management is separate)
  getMessages: async (conversationId) => {
    await delay(200);
    const messages = mockMessages[conversationId] || [];
    return [...messages];
  },

  // Send a message (mock for now since message management is separate)
  sendMessage: async (messageData) => {
    await delay(300);
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
    
    // Update conversation's last message via update service
    try {
      await smsService.update(conversationId, {
        last_message: messageData.content,
        last_message_time: newMessage.timestamp
      });
    } catch (error) {
      console.error('Error updating conversation after sending message:', error);
    }
    
    return { ...newMessage };
  }
};

export default smsService;