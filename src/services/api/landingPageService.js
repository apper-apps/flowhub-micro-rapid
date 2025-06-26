const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const landingPageService = {
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
          { field: { Name: "description" } },
          { field: { Name: "slug" } },
          { field: { Name: "is_published" } },
          { field: { Name: "views" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { field: { Name: "settings_meta_title" } },
          { field: { Name: "settings_meta_description" } },
          { field: { Name: "settings_favicon" } },
          { field: { Name: "settings_custom_css" } },
          { field: { Name: "type" } },
          { field: { Name: "funnel_settings" } },
          { field: { Name: "sections" } },
          { field: { Name: "analytics" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('landing_page', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching landing pages:', error);
      throw error;
    }
  },

  async getById(id) {
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
          { field: { Name: "description" } },
          { field: { Name: "slug" } },
          { field: { Name: "is_published" } },
          { field: { Name: "views" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { field: { Name: "settings_meta_title" } },
          { field: { Name: "settings_meta_description" } },
          { field: { Name: "settings_favicon" } },
          { field: { Name: "settings_custom_css" } },
          { field: { Name: "type" } },
          { field: { Name: "funnel_settings" } },
          { field: { Name: "sections" } },
          { field: { Name: "analytics" } }
        ]
      };
      
      const response = await apperClient.getRecordById('landing_page', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching landing page with ID ${id}:`, error);
      throw error;
    }
  },

  async getBySlug(slug) {
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
          { field: { Name: "description" } },
          { field: { Name: "slug" } },
          { field: { Name: "is_published" } },
          { field: { Name: "views" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { field: { Name: "settings_meta_title" } },
          { field: { Name: "settings_meta_description" } },
          { field: { Name: "settings_favicon" } },
          { field: { Name: "settings_custom_css" } },
          { field: { Name: "type" } },
          { field: { Name: "funnel_settings" } },
          { field: { Name: "sections" } },
          { field: { Name: "analytics" } }
        ],
        where: [
          {
            FieldName: "slug",
            Operator: "EqualTo",
            Values: [slug]
          },
          {
            FieldName: "is_published",
            Operator: "EqualTo",
            Values: [true]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('landing_page', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (!response.data || response.data.length === 0) {
        throw new Error('Published landing page not found');
      }
      
      return response.data[0];
    } catch (error) {
      console.error(`Error fetching landing page with slug ${slug}:`, error);
      throw error;
    }
  },

  async create(pageData) {
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
            Name: pageData.Name || pageData.name,
            Tags: pageData.Tags || '',
            Owner: pageData.Owner || '',
            description: pageData.description,
            slug: pageData.slug,
            is_published: pageData.is_published || pageData.isPublished || false,
            views: pageData.views || 0,
            created_at: pageData.created_at || pageData.createdAt || new Date().toISOString(),
            updated_at: pageData.updated_at || pageData.updatedAt || new Date().toISOString(),
            settings_meta_title: pageData.settings?.metaTitle || pageData.settings_meta_title || '',
            settings_meta_description: pageData.settings?.metaDescription || pageData.settings_meta_description || '',
            settings_favicon: pageData.settings?.favicon || pageData.settings_favicon || '',
            settings_custom_css: pageData.settings?.customCSS || pageData.settings_custom_css || '',
            type: pageData.type || 'page',
            funnel_settings: typeof pageData.funnelSettings === 'object' ? JSON.stringify(pageData.funnelSettings) : pageData.funnel_settings || '{}',
            sections: typeof pageData.sections === 'object' ? JSON.stringify(pageData.sections) : pageData.sections || '[]',
            analytics: typeof pageData.analytics === 'object' ? JSON.stringify(pageData.analytics) : pageData.analytics || '{}'
          }
        ]
      };
      
      const response = await apperClient.createRecord('landing_page', params);
      
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
      console.error('Error creating landing page:', error);
      throw error;
    }
  },

  async update(id, pageData) {
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
            Name: pageData.Name || pageData.name,
            Tags: pageData.Tags,
            Owner: pageData.Owner,
            description: pageData.description,
            slug: pageData.slug,
            is_published: pageData.is_published !== undefined ? pageData.is_published : pageData.isPublished,
            views: pageData.views,
            created_at: pageData.created_at || pageData.createdAt,
            updated_at: new Date().toISOString(),
            settings_meta_title: pageData.settings?.metaTitle || pageData.settings_meta_title,
            settings_meta_description: pageData.settings?.metaDescription || pageData.settings_meta_description,
            settings_favicon: pageData.settings?.favicon || pageData.settings_favicon,
            settings_custom_css: pageData.settings?.customCSS || pageData.settings_custom_css,
            type: pageData.type,
            funnel_settings: typeof pageData.funnelSettings === 'object' ? JSON.stringify(pageData.funnelSettings) : pageData.funnel_settings,
            sections: typeof pageData.sections === 'object' ? JSON.stringify(pageData.sections) : pageData.sections,
            analytics: typeof pageData.analytics === 'object' ? JSON.stringify(pageData.analytics) : pageData.analytics
          }
        ]
      };
      
      const response = await apperClient.updateRecord('landing_page', params);
      
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
      console.error('Error updating landing page:', error);
      throw error;
    }
  },

  async delete(id) {
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
      
      const response = await apperClient.deleteRecord('landing_page', params);
      
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
      console.error('Error deleting landing page:', error);
      throw error;
    }
  },

  // Funnel-specific methods
  async getFunnelAnalytics(id) {
    try {
      await delay(300);
      
      const funnel = await this.getById(id);
      if (!funnel || funnel.type !== 'funnel') {
        throw new Error('Funnel not found');
      }

      const analytics = typeof funnel.analytics === 'string' ? JSON.parse(funnel.analytics) : funnel.analytics;
      
      return {
        ...analytics,
        conversionRates: this.calculateConversionRates(analytics),
        dropOffPoints: this.identifyDropOffPoints(analytics)
      };
    } catch (error) {
      console.error('Error getting funnel analytics:', error);
      throw error;
    }
  },

  async updateFunnelStep(id, stepId, stepData) {
    try {
      await delay(300);
      
      const page = await this.getById(id);
      if (!page) {
        throw new Error('Funnel not found');
      }

      const sections = typeof page.sections === 'string' ? JSON.parse(page.sections) : page.sections;
      const sectionIndex = sections.findIndex(section => section.id === stepId);
      if (sectionIndex === -1) {
        throw new Error('Funnel step not found');
      }

      sections[sectionIndex] = {
        ...sections[sectionIndex],
        ...stepData,
        id: stepId // Preserve original ID
      };

      return await this.update(id, { sections });
    } catch (error) {
      console.error('Error updating funnel step:', error);
      throw error;
    }
  },

  async reorderFunnelSteps(id, stepOrders) {
    try {
      await delay(300);
      
      const page = await this.getById(id);
      if (!page) {
        throw new Error('Funnel not found');
      }

      const sections = typeof page.sections === 'string' ? JSON.parse(page.sections) : page.sections;
      
      // Reorder sections based on provided order
      const reorderedSections = stepOrders.map((stepId, index) => {
        const section = sections.find(s => s.id === stepId);
        if (!section) {
          throw new Error(`Step ${stepId} not found`);
        }
        return {
          ...section,
          order: index,
          stepNumber: index + 1
        };
      });

      return await this.update(id, { sections: reorderedSections });
    } catch (error) {
      console.error('Error reordering funnel steps:', error);
      throw error;
    }
  },

  // Helper methods for analytics
  calculateConversionRates(analytics) {
    const steps = ['step1Completions', 'step2Completions', 'step3Completions', 'step4Completions'];
    const rates = [];
    
    for (let i = 0; i < steps.length - 1; i++) {
      const current = analytics[steps[i]] || 0;
      const next = analytics[steps[i + 1]] || 0;
      rates.push({
        fromStep: i + 1,
        toStep: i + 2,
        rate: current > 0 ? ((next / current) * 100).toFixed(1) : 0
      });
    }
    
    return rates;
  },

  identifyDropOffPoints(analytics) {
    const steps = ['totalViews', 'step1Completions', 'step2Completions', 'step3Completions', 'step4Completions'];
    const dropOffs = [];
    
    for (let i = 0; i < steps.length - 1; i++) {
      const current = analytics[steps[i]] || 0;
      const next = analytics[steps[i + 1]] || 0;
      const dropOffRate = current > 0 ? (((current - next) / current) * 100).toFixed(1) : 0;
      
      if (dropOffRate > 50) { // High drop-off threshold
        dropOffs.push({
          step: i + 1,
          dropOffRate: dropOffRate,
          severity: dropOffRate > 70 ? 'high' : 'medium'
        });
      }
    }
    
    return dropOffs;
  }
};

export default landingPageService;