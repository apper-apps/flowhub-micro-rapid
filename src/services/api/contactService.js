const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const contactService = {
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
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "stage" } },
          { field: { Name: "score" } },
          { field: { Name: "last_activity" } },
          { field: { Name: "company" } },
          { field: { Name: "position" } },
          { field: { Name: "source" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('app_contact', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching contacts:', error);
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
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "stage" } },
          { field: { Name: "score" } },
          { field: { Name: "last_activity" } },
          { field: { Name: "company" } },
          { field: { Name: "position" } },
          { field: { Name: "source" } }
        ]
      };
      
      const response = await apperClient.getRecordById('app_contact', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching contact with ID ${id}:`, error);
      throw error;
    }
  },

  async create(contactData) {
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
            Name: contactData.Name || contactData.name,
            Tags: contactData.Tags || contactData.tags?.join(',') || '',
            Owner: contactData.Owner || contactData.owner,
            email: contactData.email,
            phone: contactData.phone,
            stage: contactData.stage,
            score: contactData.score || 0,
            last_activity: contactData.last_activity || new Date().toISOString(),
            company: contactData.company,
            position: contactData.position,
            source: contactData.source
          }
        ]
      };
      
      const response = await apperClient.createRecord('app_contact', params);
      
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
      console.error('Error creating contact:', error);
      throw error;
    }
  },

  async update(id, contactData) {
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
            Name: contactData.Name || contactData.name,
            Tags: contactData.Tags || (contactData.tags ? contactData.tags.join(',') : undefined),
            Owner: contactData.Owner || contactData.owner,
            email: contactData.email,
            phone: contactData.phone,
            stage: contactData.stage,
            score: contactData.score,
            last_activity: contactData.last_activity,
            company: contactData.company,
            position: contactData.position,
            source: contactData.source
          }
        ]
      };
      
      const response = await apperClient.updateRecord('app_contact', params);
      
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
      console.error('Error updating contact:', error);
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
      
      const response = await apperClient.deleteRecord('app_contact', params);
      
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
      console.error('Error deleting contact:', error);
      throw error;
    }
  },

  async getByStage(stage) {
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
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "stage" } },
          { field: { Name: "score" } },
          { field: { Name: "last_activity" } },
          { field: { Name: "company" } },
          { field: { Name: "position" } },
          { field: { Name: "source" } }
        ],
        where: [
          {
            FieldName: "stage",
            Operator: "EqualTo",
            Values: [stage]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('app_contact', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching contacts by stage ${stage}:`, error);
      throw error;
    }
  },

  async updateStage(id, newStage) {
    return this.update(id, { stage: newStage });
  }
};

export default contactService;