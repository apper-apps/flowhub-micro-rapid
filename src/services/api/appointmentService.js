import mockAppointments from '@/services/mockData/appointments.json';

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage (simulating database)
let appointments = [...mockAppointments];
let nextId = Math.max(...appointments.map(a => a.Id)) + 1;

export const appointmentService = {
  // Get all appointments
  async getAll() {
    await delay(300);
    return [...appointments];
  },

  // Get appointment by Id
  async getById(id) {
    await delay(200);
    const appointment = appointments.find(a => a.Id === parseInt(id));
    return appointment ? { ...appointment } : null;
  },

  // Create new appointment
  async create(appointmentData) {
    await delay(400);
    const newAppointment = {
      ...appointmentData,
      Id: nextId++,
      status: appointmentData.status || 'pending'
    };
    appointments.push(newAppointment);
    return { ...newAppointment };
  },

  // Update appointment
  async update(id, appointmentData) {
    await delay(350);
    const index = appointments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Appointment not found');
    }
    
    const updatedAppointment = {
      ...appointments[index],
      ...appointmentData,
      Id: parseInt(id) // Ensure Id doesn't change
    };
    
    appointments[index] = updatedAppointment;
    return { ...updatedAppointment };
  },

  // Delete appointment
  async delete(id) {
    await delay(250);
    const index = appointments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Appointment not found');
    }
    
    const deletedAppointment = appointments[index];
    appointments.splice(index, 1);
    return { ...deletedAppointment };
  },

  // Get appointments for date range
  async getByDateRange(startDate, endDate) {
    await delay(300);
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.start);
      return appointmentDate >= startDate && appointmentDate <= endDate;
    }).map(appointment => ({ ...appointment }));
  }
};

export default appointmentService;