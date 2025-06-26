import formsData from '../mockData/forms.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let forms = [...formsData];

export const formService = {
  async getAll() {
    await delay(300);
    return [...forms];
  },

  async getById(id) {
    await delay(200);
    const form = forms.find(f => f.Id === parseInt(id, 10));
    if (!form) {
      throw new Error('Form not found');
    }
    return { ...form };
  },

  async create(formData) {
    await delay(400);
    const maxId = Math.max(...forms.map(f => f.Id), 0);
    const newForm = {
      ...formData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      submissions: 0,
      conversionRate: 0
    };
    forms.push(newForm);
    return { ...newForm };
  },

  async update(id, formData) {
    await delay(300);
    const index = forms.findIndex(f => f.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Form not found');
    }
    
    const updatedForm = {
      ...forms[index],
      ...formData,
      Id: forms[index].Id
    };
    
    forms[index] = updatedForm;
    return { ...updatedForm };
  },

  async delete(id) {
    await delay(250);
    const index = forms.findIndex(f => f.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Form not found');
    }
    
    const deletedForm = forms[index];
    forms.splice(index, 1);
    return { ...deletedForm };
  }
};

export default formService;