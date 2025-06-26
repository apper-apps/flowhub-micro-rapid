import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import contactService from '@/services/api/contactService';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';

const ContactPipeline = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const stages = [
    { id: 'Lead', title: 'Lead', color: 'bg-blue-100 text-blue-700' },
    { id: 'Qualified', title: 'Qualified', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'Proposal', title: 'Proposal', color: 'bg-purple-100 text-purple-700' },
    { id: 'Customer', title: 'Customer', color: 'bg-green-100 text-green-700' }
  ];

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contactService.getAll();
      setContacts(data);
    } catch (err) {
      setError(err.message || 'Failed to load contacts');
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const contactId = parseInt(draggableId, 10);
    const newStage = destination.droppableId;

    try {
      await contactService.updateStage(contactId, newStage);
      
      // Update local state
      setContacts(prev => prev.map(contact => 
        contact.Id === contactId 
          ? { ...contact, stage: newStage }
          : contact
      ));

      toast.success('Contact moved successfully');
    } catch (err) {
      toast.error('Failed to update contact stage');
    }
  };

  const getContactsByStage = (stage) => {
    return contacts.filter(contact => contact.stage === stage);
  };

  if (loading) {
    return (
      <div className="flex gap-6 overflow-x-auto pb-4">
        {stages.map(stage => (
          <div key={stage.id} className="flex-shrink-0 w-80">
            <div className="bg-surface-50 rounded-lg p-4">
              <div className="animate-pulse space-y-3">
                <div className="h-6 bg-surface-200 rounded w-1/2"></div>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 bg-white rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={loadContacts}
          className="text-primary-600 hover:text-primary-700"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {stages.map((stage, stageIndex) => {
          const stageContacts = getContactsByStage(stage.id);
          
          return (
            <div key={stage.id} className="flex-shrink-0 w-80">
              <div className="bg-surface-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-surface-900">{stage.title}</h3>
                  <Badge variant="default" size="sm">
                    {stageContacts.length}
                  </Badge>
                </div>

                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-3 min-h-[200px] p-2 rounded-lg transition-colors ${
                        snapshot.isDraggingOver ? 'bg-primary-50' : ''
                      }`}
                    >
                      {stageContacts.map((contact, index) => (
                        <Draggable
                          key={contact.Id}
                          draggableId={contact.Id.toString()}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <motion.div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`${snapshot.isDragging ? 'rotate-2 scale-105' : ''}`}
                            >
                              <Card 
                                padding="sm" 
                                className={`cursor-grab active:cursor-grabbing transition-transform ${
                                  snapshot.isDragging ? 'shadow-lg' : ''
                                }`}
                              >
                                <div className="space-y-2">
                                  <div className="flex items-start justify-between">
                                    <h4 className="font-medium text-surface-900 text-sm">
                                      {contact.name}
                                    </h4>
                                    <div className="flex items-center gap-1">
                                      <ApperIcon name="Star" size={12} className="text-yellow-500 fill-current" />
                                      <span className="text-xs text-surface-600">{contact.score}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-1">
                                    <p className="text-xs text-surface-600 truncate">{contact.email}</p>
                                    {contact.company && (
                                      <p className="text-xs text-surface-500 truncate">{contact.company}</p>
                                    )}
                                  </div>

                                  <div className="flex flex-wrap gap-1">
                                    {contact.tags?.slice(0, 2).map(tag => (
                                      <Badge key={tag} variant="primary" size="sm">
                                        {tag}
                                      </Badge>
                                    ))}
                                    {contact.tags?.length > 2 && (
                                      <Badge variant="default" size="sm">
                                        +{contact.tags.length - 2}
                                      </Badge>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2 pt-2 border-t border-surface-100">
                                    <ApperIcon name="Clock" size={12} className="text-surface-400" />
                                    <span className="text-xs text-surface-500">
                                      {new Date(contact.lastActivity).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </Card>
                            </motion.div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      
                      {stageContacts.length === 0 && (
                        <div className="text-center py-8 text-surface-400">
                          <ApperIcon name="Users" size={24} className="mx-auto mb-2" />
                          <p className="text-sm">No contacts in this stage</p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default ContactPipeline;