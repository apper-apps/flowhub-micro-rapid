const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const formService = {
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
          { field: { Name: "fields" } },
          { field: { Name: "submissions" } },
          { field: { Name: "conversion_rate" } },
          { field: { Name: "views" } },
          { field: { Name: "created_at" } },
          { field: { Name: "status" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('form', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching forms:', error);
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
          { field: { Name: "fields" } },
          { field: { Name: "submissions" } },
          { field: { Name: "conversion_rate" } },
          { field: { Name: "views" } },
          { field: { Name: "created_at" } },
          { field: { Name: "status" } }
        ]
      };
      
      const response = await apperClient.getRecordById('form', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching form with ID ${id}:`, error);
      throw error;
    }
  },

  async create(formData) {
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
            Name: formData.Name || formData.name,
            Tags: formData.Tags || '',
            Owner: formData.Owner || '',
            fields: typeof formData.fields === 'object' ? JSON.stringify(formData.fields) : formData.fields || '[]',
            submissions: formData.submissions || 0,
            conversion_rate: formData.conversion_rate || formData.conversionRate || 0,
            views: formData.views || 0,
            created_at: formData.created_at || formData.createdAt || new Date().toISOString(),
            status: formData.status || 'Draft'
          }
        ]
      };
      
      const response = await apperClient.createRecord('form', params);
      
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
      console.error('Error creating form:', error);
      throw error;
    }
  },

  async update(id, formData) {
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
            Name: formData.Name || formData.name,
            Tags: formData.Tags,
            Owner: formData.Owner,
            fields: typeof formData.fields === 'object' ? JSON.stringify(formData.fields) : formData.fields,
            submissions: formData.submissions,
            conversion_rate: formData.conversion_rate || formData.conversionRate,
            views: formData.views,
            created_at: formData.created_at || formData.createdAt,
            status: formData.status
          }
        ]
      };
      
      const response = await apperClient.updateRecord('form', params);
      
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
      console.error('Error updating form:', error);
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
      
      const response = await apperClient.deleteRecord('form', params);
      
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
      console.error('Error deleting form:', error);
      throw error;
    }
  }
};

export default formService;