import landingPagesData from '@/services/mockData/landingPages.json';

// Store data and track last ID
let data = [...landingPagesData];
let lastId = Math.max(...data.map(item => item.Id));

const landingPageService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...data];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const item = data.find(page => page.Id === id);
    if (!item) {
      throw new Error('Landing page not found');
    }
    return { ...item };
  },

  async getBySlug(slug) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const item = data.find(page => page.slug === slug && page.isPublished);
    if (!item) {
      throw new Error('Published landing page not found');
    }
    return { ...item };
  },

  async create(pageData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newPage = {
      ...pageData,
      Id: ++lastId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      sections: pageData.sections || []
    };
    
    data.unshift(newPage);
    return { ...newPage };
  },

  async update(id, pageData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = data.findIndex(page => page.Id === id);
    if (index === -1) {
      throw new Error('Landing page not found');
    }

    const updatedPage = {
      ...data[index],
      ...pageData,
      Id: id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    data[index] = updatedPage;
    return { ...updatedPage };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = data.findIndex(page => page.Id === id);
    if (index === -1) {
      throw new Error('Landing page not found');
    }

data.splice(index, 1);
    return true;
  },

  // Funnel-specific methods
  async getFunnelAnalytics(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const funnel = data.find(page => page.Id === id && page.type === 'funnel');
    if (!funnel) {
      throw new Error('Funnel not found');
    }

    return {
      ...funnel.analytics,
      conversionRates: this.calculateConversionRates(funnel.analytics),
      dropOffPoints: this.identifyDropOffPoints(funnel.analytics)
    };
  },

  async updateFunnelStep(id, stepId, stepData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const pageIndex = data.findIndex(page => page.Id === id);
    if (pageIndex === -1) {
      throw new Error('Funnel not found');
    }

    const sectionIndex = data[pageIndex].sections.findIndex(section => section.id === stepId);
    if (sectionIndex === -1) {
      throw new Error('Funnel step not found');
    }

    data[pageIndex].sections[sectionIndex] = {
      ...data[pageIndex].sections[sectionIndex],
      ...stepData,
      id: stepId // Preserve original ID
    };

    data[pageIndex].updatedAt = new Date().toISOString();
    return { ...data[pageIndex] };
  },

  async reorderFunnelSteps(id, stepOrders) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const pageIndex = data.findIndex(page => page.Id === id);
    if (pageIndex === -1) {
      throw new Error('Funnel not found');
    }

    // Reorder sections based on provided order
    const reorderedSections = stepOrders.map((stepId, index) => {
      const section = data[pageIndex].sections.find(s => s.id === stepId);
      if (!section) {
        throw new Error(`Step ${stepId} not found`);
      }
      return {
        ...section,
        order: index,
        stepNumber: index + 1
      };
    });

    data[pageIndex].sections = reorderedSections;
    data[pageIndex].updatedAt = new Date().toISOString();
    return { ...data[pageIndex] };
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