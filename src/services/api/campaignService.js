import campaignsData from '../mockData/campaigns.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let campaigns = [...campaignsData];

export const campaignService = {
  async getAll() {
    await delay(300);
    return [...campaigns];
  },

  async getById(id) {
    await delay(200);
    const campaign = campaigns.find(c => c.Id === parseInt(id, 10));
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    return { ...campaign };
  },

  async create(campaignData) {
    await delay(400);
    const maxId = Math.max(...campaigns.map(c => c.Id), 0);
    const newCampaign = {
      ...campaignData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      status: 'Draft'
    };
    campaigns.push(newCampaign);
    return { ...newCampaign };
  },

  async update(id, campaignData) {
    await delay(300);
    const index = campaigns.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Campaign not found');
    }
    
    const updatedCampaign = {
      ...campaigns[index],
      ...campaignData,
      Id: campaigns[index].Id
    };
    
    campaigns[index] = updatedCampaign;
    return { ...updatedCampaign };
  },

  async delete(id) {
    await delay(250);
    const index = campaigns.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Campaign not found');
    }
    
    const deletedCampaign = campaigns[index];
    campaigns.splice(index, 1);
    return { ...deletedCampaign };
  }
};

export default campaignService;