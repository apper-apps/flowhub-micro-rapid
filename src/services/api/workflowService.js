import workflowsData from '../mockData/workflows.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let workflows = [...workflowsData];

export const workflowService = {
  async getAll() {
    await delay(300);
    return [...workflows];
  },

  async getById(id) {
    await delay(200);
    const workflow = workflows.find(w => w.Id === parseInt(id, 10));
    if (!workflow) {
      throw new Error('Workflow not found');
    }
    return { ...workflow };
  },

  async create(workflowData) {
    await delay(400);
    const maxId = Math.max(...workflows.map(w => w.Id), 0);
    const newWorkflow = {
      ...workflowData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      status: 'Draft'
    };
    workflows.push(newWorkflow);
    return { ...newWorkflow };
  },

  async update(id, workflowData) {
    await delay(300);
    const index = workflows.findIndex(w => w.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Workflow not found');
    }
    
    const updatedWorkflow = {
      ...workflows[index],
      ...workflowData,
      Id: workflows[index].Id
    };
    
    workflows[index] = updatedWorkflow;
    return { ...updatedWorkflow };
  },

  async delete(id) {
    await delay(250);
    const index = workflows.findIndex(w => w.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Workflow not found');
    }
    
    const deletedWorkflow = workflows[index];
    workflows.splice(index, 1);
    return { ...deletedWorkflow };
  }
};

export default workflowService;