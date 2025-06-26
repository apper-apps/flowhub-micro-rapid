import contactsData from '../mockData/contacts.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let contacts = [...contactsData];

export const contactService = {
  async getAll() {
    await delay(300);
    return [...contacts];
  },

  async getById(id) {
    await delay(200);
    const contact = contacts.find(c => c.Id === parseInt(id, 10));
    if (!contact) {
      throw new Error('Contact not found');
    }
    return { ...contact };
  },

  async create(contactData) {
    await delay(400);
    const maxId = Math.max(...contacts.map(c => c.Id), 0);
    const newContact = {
      ...contactData,
      Id: maxId + 1,
      lastActivity: new Date().toISOString()
    };
    contacts.push(newContact);
    return { ...newContact };
  },

  async update(id, contactData) {
    await delay(300);
    const index = contacts.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Contact not found');
    }
    
    const updatedContact = {
      ...contacts[index],
      ...contactData,
      Id: contacts[index].Id // Preserve the original ID
    };
    
    contacts[index] = updatedContact;
    return { ...updatedContact };
  },

  async delete(id) {
    await delay(250);
    const index = contacts.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Contact not found');
    }
    
    const deletedContact = contacts[index];
    contacts.splice(index, 1);
    return { ...deletedContact };
  },

  async getByStage(stage) {
    await delay(300);
    return contacts.filter(c => c.stage === stage).map(c => ({ ...c }));
  },

  async updateStage(id, newStage) {
    await delay(200);
    return this.update(id, { stage: newStage });
  }
};

export default contactService;