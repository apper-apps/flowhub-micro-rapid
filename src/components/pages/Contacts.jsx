import { useState } from 'react';
import { motion } from 'framer-motion';
import ContactList from '@/components/organisms/ContactList';
import ContactPipeline from '@/components/organisms/ContactPipeline';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Contacts = () => {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'pipeline'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Contacts</h1>
          <p className="text-surface-600 mt-1">Manage your customer relationships and track leads through your sales pipeline.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-surface-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              <div className="flex items-center gap-1">
                <ApperIcon name="List" size={14} />
                List
              </div>
            </button>
            <button
              onClick={() => setViewMode('pipeline')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                viewMode === 'pipeline'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              <div className="flex items-center gap-1">
                <ApperIcon name="Kanban" size={14} />
                Pipeline
              </div>
            </button>
          </div>

          <Button variant="outline" icon="Upload">
            Import
          </Button>
          <Button icon="UserPlus">
            Add Contact
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1">
        {viewMode === 'list' ? (
          <ContactList />
        ) : (
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-surface-900 mb-2">Sales Pipeline</h2>
              <p className="text-sm text-surface-600">Drag and drop contacts between stages to update their status.</p>
            </div>
            <ContactPipeline />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Contacts;