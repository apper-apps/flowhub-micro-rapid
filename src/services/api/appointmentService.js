// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const appointmentService = {
  // Get all appointments
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
          { field: { Name: "title" } },
          { field: { Name: "start" } },
          { field: { Name: "end" } },
          { field: { Name: "type" } },
          { field: { Name: "status" } },
          { field: { Name: "contact_id" } },
          { field: { Name: "contact_name" } },
          { field: { Name: "description" } },
          { field: { Name: "location" } },
          { field: { Name: "attendees" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('appointment', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },

  // Get appointment by Id
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
          { field: { Name: "title" } },
          { field: { Name: "start" } },
          { field: { Name: "end" } },
          { field: { Name: "type" } },
          { field: { Name: "status" } },
          { field: { Name: "contact_id" } },
          { field: { Name: "contact_name" } },
          { field: { Name: "description" } },
          { field: { Name: "location" } },
          { field: { Name: "attendees" } }
        ]
      };
      
      const response = await apperClient.getRecordById('appointment', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching appointment with ID ${id}:`, error);
      throw error;
    }
  },

  // Create new appointment
  async create(appointmentData) {
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
            Name: appointmentData.Name || appointmentData.title,
            Tags: appointmentData.Tags || '',
            Owner: appointmentData.Owner || '',
            title: appointmentData.title,
            start: appointmentData.start,
            end: appointmentData.end,
            type: appointmentData.type,
            status: appointmentData.status || 'pending',
            contact_id: appointmentData.contact_id || appointmentData.contactId || null,
            contact_name: appointmentData.contact_name || appointmentData.contactName,
            description: appointmentData.description,
            location: appointmentData.location,
            attendees: Array.isArray(appointmentData.attendees) ? appointmentData.attendees.join(',') : appointmentData.attendees
          }
        ]
      };
      
      const response = await apperClient.createRecord('appointment', params);
      
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
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  // Update appointment
  async update(id, appointmentData) {
    try {
      await delay(350);
      
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
            Name: appointmentData.Name || appointmentData.title,
            Tags: appointmentData.Tags,
            Owner: appointmentData.Owner,
            title: appointmentData.title,
            start: appointmentData.start,
            end: appointmentData.end,
            type: appointmentData.type,
            status: appointmentData.status,
            contact_id: appointmentData.contact_id || appointmentData.contactId,
            contact_name: appointmentData.contact_name || appointmentData.contactName,
            description: appointmentData.description,
            location: appointmentData.location,
            attendees: Array.isArray(appointmentData.attendees) ? appointmentData.attendees.join(',') : appointmentData.attendees
          }
        ]
      };
      
      const response = await apperClient.updateRecord('appointment', params);
      
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
      console.error('Error updating appointment:', error);
      throw error;
    }
  },

  // Delete appointment
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
      
      const response = await apperClient.deleteRecord('appointment', params);
      
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
      console.error('Error deleting appointment:', error);
      throw error;
    }
  },

  // Get appointments for date range
  async getByDateRange(startDate, endDate) {
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
          { field: { Name: "title" } },
          { field: { Name: "start" } },
          { field: { Name: "end" } },
          { field: { Name: "type" } },
          { field: { Name: "status" } },
          { field: { Name: "contact_id" } },
          { field: { Name: "contact_name" } },
          { field: { Name: "description" } },
          { field: { Name: "location" } },
          { field: { Name: "attendees" } }
        ],
        where: [
          {
            FieldName: "start",
            Operator: "GreaterThanOrEqualTo",
            Values: [startDate.toISOString()]
          },
          {
            FieldName: "end",
            Operator: "LessThanOrEqualTo",
            Values: [endDate.toISOString()]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('appointment', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching appointments by date range:', error);
      throw error;
    }
  }
};

export default appointmentService;