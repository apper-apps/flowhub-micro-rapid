import sectionBlocksData from '@/services/mockData/sectionBlocks.json';

// Store data and track last ID
let data = [...sectionBlocksData];
let lastId = Math.max(...data.map(item => item.Id));

const sectionBlockService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...data];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const item = data.find(block => block.Id === id);
    if (!item) {
      throw new Error('Section block not found');
    }
    return { ...item };
  },

  async getByType(type) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return data.filter(block => block.type === type).map(block => ({ ...block }));
  },

  async create(blockData) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newBlock = {
      ...blockData,
      Id: ++lastId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    data.unshift(newBlock);
    return { ...newBlock };
  },

  async update(id, blockData) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = data.findIndex(block => block.Id === id);
    if (index === -1) {
      throw new Error('Section block not found');
    }

    const updatedBlock = {
      ...data[index],
      ...blockData,
      Id: id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    data[index] = updatedBlock;
    return { ...updatedBlock };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = data.findIndex(block => block.Id === id);
    if (index === -1) {
      throw new Error('Section block not found');
    }

    data.splice(index, 1);
    return true;
  }
};

export default sectionBlockService;