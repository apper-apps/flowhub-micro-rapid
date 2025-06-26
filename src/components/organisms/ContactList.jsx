import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import contactService from "@/services/api/contactService";
import ApperIcon from "@/components/ApperIcon";
import SkeletonLoader from "@/components/molecules/SkeletonLoader";
import EmptyState from "@/components/molecules/EmptyState";
import SearchBar from "@/components/molecules/SearchBar";
import ErrorState from "@/components/molecules/ErrorState";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const ContactList = ({ onContactSelect }) => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchTerm]);

  const loadContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contactService.getAll();
      setContacts(data);
    } catch (err) {
      setError(err.message || 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const filterContacts = () => {
    if (!searchTerm) {
      setFilteredContacts(contacts);
      return;
}

const filtered = contacts.filter(contact =>
      (contact.Name || contact.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.company || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContacts(filtered);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleContactSelect = (contact) => {
    if (onContactSelect) {
      onContactSelect(contact);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedContacts.length === 0) {
      toast.warning('Please select contacts first');
      return;
    }

    try {
      // Handle bulk actions here
      toast.success(`${action} applied to ${selectedContacts.length} contacts`);
      setSelectedContacts([]);
    } catch (err) {
      toast.error(`Failed to ${action.toLowerCase()} contacts`);
    }
  };

  const toggleContactSelection = (contactId) => {
    setSelectedContacts(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const getStageColor = (stage) => {
    const colors = {
      'Lead': 'info',
      'Qualified': 'warning',
      'Proposal': 'secondary',
      'Customer': 'success'
    };
    return colors[stage] || 'default';
  };

  if (loading) {
    return <SkeletonLoader count={5} type="list" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadContacts} />;
  }

  if (contacts.length === 0) {
    return (
      <EmptyState
        title="No contacts yet"
        description="Start building your customer base by adding your first contact"
        actionLabel="Add Contact"
        icon="UserPlus"
        onAction={() => {/* Handle add contact */}}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with search and actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchBar
          placeholder="Search contacts..."
          onSearch={handleSearch}
          className="flex-1 max-w-md"
        />
        
        <div className="flex items-center gap-2">
          {selectedContacts.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-surface-600">
                {selectedContacts.length} selected
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('Export')}
              >
                Export
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('Delete')}
              >
                Delete
              </Button>
            </div>
          )}
          <Button icon="UserPlus">Add Contact</Button>
        </div>
      </div>

      {/* Contact list */}
      <div className="space-y-4">
        {filteredContacts.map((contact, index) => (
          <motion.div
            key={contact.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card hover padding="default" className="cursor-pointer">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={selectedContacts.includes(contact.Id)}
                  onChange={() => toggleContactSelection(contact.Id)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  onClick={(e) => e.stopPropagation()}
                />

<div className="flex-1 min-w-0" onClick={() => handleContactSelect(contact)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-surface-900 truncate">
                          {contact.Name || contact.name}
                        </h3>
                        <Badge variant={getStageColor(contact.stage)} size="sm">
                          {contact.stage}
                        </Badge>
                      </div>
<div className="space-y-1">
                        {contact.email && (
                          <div className="flex items-center gap-2 text-sm text-surface-600">
                            <ApperIcon name="Mail" size={14} />
                            <span className="truncate">{contact.email}</span>
                          </div>
                        )}
                        {contact.phone && (
                          <div className="flex items-center gap-2 text-sm text-surface-600">
                            <ApperIcon name="Phone" size={14} />
                            <span>{contact.phone}</span>
                          </div>
                        )}
                        {contact.company && (
                          <div className="flex items-center gap-2 text-sm text-surface-600">
                            <ApperIcon name="Building" size={14} />
                            <span className="truncate">{contact.company}</span>
                          </div>
                        )}
                      </div>

                      {contact.tags && contact.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {contact.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="primary" size="sm">
                              {tag}
                            </Badge>
                          ))}
                          {contact.tags.length > 3 && (
                            <Badge variant="default" size="sm">
                              +{contact.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
<div className="flex items-center gap-1">
                        <ApperIcon name="Star" size={14} className="text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{contact.score || '0'}</span>
                      </div>
                      <div className="text-xs text-surface-500">
                        {contact.last_activity || contact.lastActivity 
                          ? new Date(contact.last_activity || contact.lastActivity).toLocaleDateString()
                          : 'No activity'
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredContacts.length === 0 && searchTerm && (
        <EmptyState
          title="No contacts found"
          description={`No contacts match "${searchTerm}". Try adjusting your search.`}
          icon="Search"
        />
      )}
    </div>
  );
};

export default ContactList;