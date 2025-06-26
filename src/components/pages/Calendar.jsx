import { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import appointmentService from '@/services/api/appointmentService'
import 'react-big-calendar/lib/css/react-big-calendar.css'
const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formMode, setFormMode] = useState('create'); // 'create', 'edit', 'view'
  const [formData, setFormData] = useState({
    title: '',
    start: '',
    end: '',
    type: 'meeting',
    contactName: '',
    description: '',
    location: ''
  });

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAll();
      const formattedAppointments = data.map(appointment => ({
        ...appointment,
        start: new Date(appointment.start),
        end: new Date(appointment.end)
      }));
      setAppointments(formattedAppointments);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSlot = ({ start, end }) => {
    setFormMode('create');
    setFormData({
      title: '',
      start: moment(start).format('YYYY-MM-DDTHH:mm'),
      end: moment(end).format('YYYY-MM-DDTHH:mm'),
      type: 'meeting',
      contactName: '',
      description: '',
      location: ''
    });
    setSelectedEvent(null);
    setShowModal(true);
  };

  const handleSelectEvent = (event) => {
    setFormMode('view');
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      start: moment(event.start).format('YYYY-MM-DDTHH:mm'),
      end: moment(event.end).format('YYYY-MM-DDTHH:mm'),
      type: event.type || 'meeting',
      contactName: event.contactName || '',
      description: event.description || '',
      location: event.location || ''
    });
    setShowModal(true);
  };

  const handleEdit = () => {
    setFormMode('edit');
  };

  const handleSave = async () => {
    try {
      const appointmentData = {
        ...formData,
        start: new Date(formData.start).toISOString(),
        end: new Date(formData.end).toISOString()
      };

      if (formMode === 'create') {
        await appointmentService.create(appointmentData);
        toast.success('Appointment created successfully');
      } else if (formMode === 'edit') {
        await appointmentService.update(selectedEvent.Id, appointmentData);
        toast.success('Appointment updated successfully');
      }

      await loadAppointments();
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error(`Failed to ${formMode === 'create' ? 'create' : 'update'} appointment`);
    }
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;
    
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await appointmentService.delete(selectedEvent.Id);
        toast.success('Appointment deleted successfully');
        await loadAppointments();
        setShowModal(false);
        resetForm();
      } catch (error) {
        toast.error('Failed to delete appointment');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      start: '',
      end: '',
      type: 'meeting',
      contactName: '',
      description: '',
      location: ''
    });
    setSelectedEvent(null);
    setFormMode('create');
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3B82F6'; // Default blue
    
    switch (event.type) {
      case 'consultation':
        backgroundColor = '#10B981'; // Green
        break;
      case 'demo':
        backgroundColor = '#F59E0B'; // Yellow
        break;
      case 'call':
        backgroundColor = '#8B5CF6'; // Purple
        break;
      case 'training':
        backgroundColor = '#EF4444'; // Red
        break;
      case 'review':
        backgroundColor = '#06B6D4'; // Cyan
        break;
      default:
        backgroundColor = '#3B82F6'; // Blue
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-48 mb-6"></div>
          <div className="bg-surface-200 rounded-lg h-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Calendar</h1>
          <p className="text-surface-600 mt-1">Manage your appointments and schedule</p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => handleSelectSlot({ 
            start: new Date(), 
            end: moment().add(1, 'hour').toDate() 
          })}
        >
          New Appointment
        </Button>
      </div>

      {/* Calendar */}
      <Card className="overflow-hidden">
        <div style={{ height: '600px' }} className="p-4">
          <BigCalendar
            localizer={localizer}
            events={appointments}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            views={['month', 'week', 'day']}
            step={30}
            showMultiDayTimes
            popup
            className="rbc-calendar-custom"
          />
        </div>
      </Card>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-surface-900">
                    {formMode === 'create' ? 'New Appointment' : 
                     formMode === 'edit' ? 'Edit Appointment' : 'Appointment Details'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-1 hover:bg-surface-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Title *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter appointment title"
                      disabled={formMode === 'view'}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Start Time *
                      </label>
                      <Input
                        type="datetime-local"
                        value={formData.start}
                        onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                        disabled={formMode === 'view'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        End Time *
                      </label>
                      <Input
                        type="datetime-local"
                        value={formData.end}
                        onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                        disabled={formMode === 'view'}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      disabled={formMode === 'view'}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="meeting">Meeting</option>
                      <option value="consultation">Consultation</option>
                      <option value="demo">Demo</option>
                      <option value="call">Call</option>
                      <option value="training">Training</option>
                      <option value="review">Review</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Contact Name
                    </label>
                    <Input
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      placeholder="Enter contact name"
                      disabled={formMode === 'view'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Location
                    </label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Enter location"
                      disabled={formMode === 'view'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter description"
                      disabled={formMode === 'view'}
                      rows={3}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-surface-200">
                  {formMode === 'view' && (
                    <>
                      <Button variant="outline" onClick={handleEdit}>
                        Edit
                      </Button>
                      <Button variant="danger" onClick={handleDelete}>
                        Delete
                      </Button>
                    </>
                  )}
                  {(formMode === 'create' || formMode === 'edit') && (
                    <>
                      <Button variant="ghost" onClick={() => setShowModal(false)}>
                        Cancel
                      </Button>
                      <Button variant="primary" onClick={handleSave}>
                        {formMode === 'create' ? 'Create' : 'Save'}
                      </Button>
                    </>
                  )}
                  {formMode === 'view' && (
                    <Button variant="ghost" onClick={() => setShowModal(false)}>
                      Close
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Calendar;