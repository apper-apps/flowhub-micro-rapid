const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const socialMediaService = {
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
          { field: { Name: "content" } },
          { field: { Name: "platforms" } },
          { field: { Name: "media" } },
          { field: { Name: "status" } },
          { field: { Name: "published_at" } },
          { field: { Name: "scheduled_for" } },
          { field: { Name: "engagement_likes" } },
          { field: { Name: "engagement_comments" } },
          { field: { Name: "engagement_shares" } },
          { field: { Name: "engagement_impressions" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('social_media_post', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching social media posts:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      await delay(200);
      const numericId = parseInt(id);
      if (isNaN(numericId)) {
        throw new Error('Invalid ID: must be a number');
      }
      
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
          { field: { Name: "content" } },
          { field: { Name: "platforms" } },
          { field: { Name: "media" } },
          { field: { Name: "status" } },
          { field: { Name: "published_at" } },
          { field: { Name: "scheduled_for" } },
          { field: { Name: "engagement_likes" } },
          { field: { Name: "engagement_comments" } },
          { field: { Name: "engagement_shares" } },
          { field: { Name: "engagement_impressions" } }
        ]
      };
      
      const response = await apperClient.getRecordById('social_media_post', numericId, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching social media post with ID ${id}:`, error);
      throw error;
    }
  },

  async create(postData) {
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
            Name: postData.Name || `Post ${Date.now()}`,
            Tags: postData.Tags || '',
            Owner: postData.Owner || '',
            content: postData.content,
            platforms: Array.isArray(postData.platforms) ? postData.platforms.join(',') : postData.platforms,
            media: Array.isArray(postData.media) ? postData.media.map(m => m.name || m.type).join(',') : '',
            status: postData.status || 'published',
            published_at: postData.publishedAt || (postData.status === 'published' ? new Date().toISOString() : null),
            scheduled_for: postData.scheduledFor || null,
            engagement_likes: 0,
            engagement_comments: 0,
            engagement_shares: 0,
            engagement_impressions: 0
          }
        ]
      };
      
      const response = await apperClient.createRecord('social_media_post', params);
      
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
      console.error('Error creating social media post:', error);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      await delay(300);
      const numericId = parseInt(id);
      if (isNaN(numericId)) {
        throw new Error('Invalid ID: must be a number');
      }
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields
      const params = {
        records: [
          {
            Id: numericId,
            Name: updateData.Name,
            Tags: updateData.Tags,
            Owner: updateData.Owner,
            content: updateData.content,
            platforms: Array.isArray(updateData.platforms) ? updateData.platforms.join(',') : updateData.platforms,
            media: Array.isArray(updateData.media) ? updateData.media.map(m => m.name || m.type).join(',') : updateData.media,
            status: updateData.status,
            published_at: updateData.publishedAt || updateData.published_at,
            scheduled_for: updateData.scheduledFor || updateData.scheduled_for,
            engagement_likes: updateData.engagement_likes,
            engagement_comments: updateData.engagement_comments,
            engagement_shares: updateData.engagement_shares,
            engagement_impressions: updateData.engagement_impressions
          }
        ]
      };
      
      const response = await apperClient.updateRecord('social_media_post', params);
      
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
      console.error('Error updating social media post:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      await delay(250);
      const numericId = parseInt(id);
      if (isNaN(numericId)) {
        throw new Error('Invalid ID: must be a number');
      }
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [numericId]
      };
      
      const response = await apperClient.deleteRecord('social_media_post', params);
      
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
      console.error('Error deleting social media post:', error);
      throw error;
    }
  },

  async getAnalytics(id) {
    try {
      await delay(200);
      const post = await this.getById(id);
      if (!post) {
        throw new Error('Post not found');
      }
      
      return {
        postId: post.Id,
        engagement: {
          likes: post.engagement_likes || 0,
          comments: post.engagement_comments || 0,
          shares: post.engagement_shares || 0,
          impressions: post.engagement_impressions || 0
        },
        reach: Math.floor(Math.random() * 10000) + 1000,
        clicks: Math.floor(Math.random() * 500) + 50,
        saves: Math.floor(Math.random() * 200) + 10
      };
    } catch (error) {
      console.error('Error getting social media analytics:', error);
      throw error;
    }
  }
};

export default socialMediaService;