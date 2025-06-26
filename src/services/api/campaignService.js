const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const campaignService = {
  async getAll() {
    try {
      await delay(300);
      
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
          { field: { Name: "type" } },
          { field: { Name: "status" } },
          { field: { Name: "recipients" } },
          { field: { Name: "open_rate" } },
          { field: { Name: "click_rate" } },
          { field: { Name: "sent" } },
          { field: { Name: "delivered" } },
          { field: { Name: "bounced" } },
          { field: { Name: "created_at" } },
          { field: { Name: "subject" } },
          { field: { Name: "template" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('campaign', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  },

  async getById(id) {
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
          { field: { Name: "type" } },
          { field: { Name: "status" } },
          { field: { Name: "recipients" } },
          { field: { Name: "open_rate" } },
          { field: { Name: "click_rate" } },
          { field: { Name: "sent" } },
          { field: { Name: "delivered" } },
          { field: { Name: "bounced" } },
          { field: { Name: "created_at" } },
          { field: { Name: "subject" } },
          { field: { Name: "template" } }
        ]
      };
      
      const response = await apperClient.getRecordById('campaign', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching campaign with ID ${id}:`, error);
      throw error;
    }
  },

  async create(campaignData) {
    try {
      await delay(400);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields
      const params = {
        records: [
          {
            Name: campaignData.Name || campaignData.name,
            Tags: campaignData.Tags || '',
            Owner: campaignData.Owner || '',
            type: campaignData.type,
            status: campaignData.status || 'Draft',
            recipients: campaignData.recipients || 0,
            open_rate: campaignData.open_rate || campaignData.openRate || 0,
            click_rate: campaignData.click_rate || campaignData.clickRate || 0,
            sent: campaignData.sent || 0,
            delivered: campaignData.delivered || 0,
            bounced: campaignData.bounced || 0,
            created_at: campaignData.created_at || campaignData.createdAt || new Date().toISOString(),
            subject: campaignData.subject,
            template: campaignData.template
          }
        ]
      };
      
      const response = await apperClient.createRecord('campaign', params);
      
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
      console.error('Error creating campaign:', error);
      throw error;
    }
  },

  async update(id, campaignData) {
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
            Name: campaignData.Name || campaignData.name,
            Tags: campaignData.Tags,
            Owner: campaignData.Owner,
            type: campaignData.type,
            status: campaignData.status,
            recipients: campaignData.recipients,
            open_rate: campaignData.open_rate || campaignData.openRate,
            click_rate: campaignData.click_rate || campaignData.clickRate,
            sent: campaignData.sent,
            delivered: campaignData.delivered,
            bounced: campaignData.bounced,
            created_at: campaignData.created_at || campaignData.createdAt,
            subject: campaignData.subject,
            template: campaignData.template
          }
        ]
      };
      
      const response = await apperClient.updateRecord('campaign', params);
      
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
      console.error('Error updating campaign:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      await delay(250);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('campaign', params);
      
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
        
        return true;
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw error;
    }
  }
};

export default campaignService;