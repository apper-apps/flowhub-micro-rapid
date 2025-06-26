const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const workflowService = {
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
          { field: { Name: "trigger_type" } },
          { field: { Name: "trigger_conditions" } },
          { field: { Name: "actions" } },
          { field: { Name: "status" } },
          { field: { Name: "executions" } },
          { field: { Name: "created_at" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('workflow', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching workflows:', error);
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
          { field: { Name: "trigger_type" } },
          { field: { Name: "trigger_conditions" } },
          { field: { Name: "actions" } },
          { field: { Name: "status" } },
          { field: { Name: "executions" } },
          { field: { Name: "created_at" } }
        ]
      };
      
      const response = await apperClient.getRecordById('workflow', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching workflow with ID ${id}:`, error);
      throw error;
    }
  },

  async create(workflowData) {
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
            Name: workflowData.Name || workflowData.name,
            Tags: workflowData.Tags || '',
            Owner: workflowData.Owner || '',
            trigger_type: workflowData.trigger_type || workflowData.trigger?.type,
            trigger_conditions: typeof workflowData.trigger_conditions === 'object' 
              ? JSON.stringify(workflowData.trigger_conditions) 
              : workflowData.trigger_conditions || JSON.stringify(workflowData.trigger?.conditions || {}),
            actions: typeof workflowData.actions === 'object' 
              ? JSON.stringify(workflowData.actions) 
              : workflowData.actions || '[]',
            status: workflowData.status || 'Draft',
            executions: workflowData.executions || 0,
            created_at: workflowData.created_at || new Date().toISOString()
          }
        ]
      };
      
      const response = await apperClient.createRecord('workflow', params);
      
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
      console.error('Error creating workflow:', error);
      throw error;
    }
  },

  async update(id, workflowData) {
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
            Name: workflowData.Name || workflowData.name,
            Tags: workflowData.Tags,
            Owner: workflowData.Owner,
            trigger_type: workflowData.trigger_type || workflowData.trigger?.type,
            trigger_conditions: typeof workflowData.trigger_conditions === 'object' 
              ? JSON.stringify(workflowData.trigger_conditions) 
              : workflowData.trigger_conditions,
            actions: typeof workflowData.actions === 'object' 
              ? JSON.stringify(workflowData.actions) 
              : workflowData.actions,
            status: workflowData.status,
            executions: workflowData.executions,
            created_at: workflowData.created_at
          }
        ]
      };
      
      const response = await apperClient.updateRecord('workflow', params);
      
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
      console.error('Error updating workflow:', error);
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
      
      const response = await apperClient.deleteRecord('workflow', params);
      
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
      console.error('Error deleting workflow:', error);
      throw error;
    }
  }
};

export default workflowService;