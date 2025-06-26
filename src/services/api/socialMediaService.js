import socialMediaData from '@/services/mockData/socialMediaData.json';

let data = [...socialMediaData];
let nextId = Math.max(...data.map(item => item.Id)) + 1;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const socialMediaService = {
  async getAll() {
    await delay(300);
    return [...data];
  },

  async getById(id) {
    await delay(200);
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      throw new Error('Invalid ID: must be a number');
    }
    const post = data.find(item => item.Id === numericId);
    return post ? { ...post } : null;
  },

  async create(postData) {
    await delay(400);
    const newPost = {
      Id: nextId++,
      content: postData.content,
      platforms: postData.platforms,
      media: postData.media || [],
      status: postData.status || 'published',
      publishedAt: postData.publishedAt || new Date().toISOString(),
      scheduledFor: postData.scheduledFor || null,
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0,
        impressions: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    data.unshift(newPost);
    return { ...newPost };
  },

  async update(id, updateData) {
    await delay(300);
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      throw new Error('Invalid ID: must be a number');
    }
    
    const index = data.findIndex(item => item.Id === numericId);
    if (index === -1) {
      throw new Error('Post not found');
    }
    
    const updatedPost = {
      ...data[index],
      ...updateData,
      Id: numericId, // Ensure ID cannot be changed
      updatedAt: new Date().toISOString()
    };
    
    data[index] = updatedPost;
    return { ...updatedPost };
  },

  async delete(id) {
    await delay(250);
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      throw new Error('Invalid ID: must be a number');
    }
    
    const index = data.findIndex(item => item.Id === numericId);
    if (index === -1) {
      throw new Error('Post not found');
    }
    
    data.splice(index, 1);
    return true;
  },

  async getAnalytics(id) {
    await delay(200);
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      throw new Error('Invalid ID: must be a number');
    }
    
    const post = data.find(item => item.Id === numericId);
    if (!post) {
      throw new Error('Post not found');
    }
    
    return {
      postId: post.Id,
      engagement: post.engagement,
      reach: Math.floor(Math.random() * 10000) + 1000,
      clicks: Math.floor(Math.random() * 500) + 50,
      saves: Math.floor(Math.random() * 200) + 10
    };
  }
};

export default socialMediaService;