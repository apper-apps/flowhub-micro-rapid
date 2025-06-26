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
  }
};

export default landingPageService;