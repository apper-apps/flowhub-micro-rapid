import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import workflowService from '@/services/api/workflowService';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import SearchBar from '@/components/molecules/SearchBar';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';

const Automation = () => {
  const [workflows, setWorkflows] = useState([]);
  const [filteredWorkflows, setFilteredWorkflows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadWorkflows();
  }, []);

  useEffect(() => {
    filterWorkflows();
  }, [workflows, searchTerm]);

  const loadWorkflows = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await workflowService.getAll();
      setWorkflows(data);
    } catch (err) {
      setError(err.message || 'Failed to load workflows');
    } finally {
      setLoading(false);
    }
  };

  const filterWorkflows = () => {
    if (!searchTerm) {
      setFilteredWorkflows(workflows);
      return;
    }

    const filtered = workflows.filter(workflow =>
      workflow.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredWorkflows(filtered);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Active': 'success',
      'Draft': 'warning',
      'Paused': 'danger'
    };
    return colors[status] || 'default';
  };

  const getTriggerIcon = (triggerType) => {
    const icons = {
      'contact_created': 'UserPlus',
      'tag_added': 'Tag',
      'lead_score_change': 'TrendingUp',
      'stage_changed': 'ArrowRight',
      'email_not_opened': 'MailX'
    };
    return icons[triggerType] || 'Zap';
  };

  const getTriggerLabel = (triggerType) => {
    const labels = {
      'contact_created': 'Contact Created',
      'tag_added': 'Tag Added',
      'lead_score_change': 'Lead Score Changed',
      'stage_changed': 'Stage Changed',
      'email_not_opened': 'Email Not Opened'
    };
    return labels[triggerType] || triggerType;
  };

  const handleWorkflowAction = async (workflowId, action) => {
    try {
      // Handle workflow actions (activate, pause, duplicate, etc.)
      toast.success(`Workflow ${action.toLowerCase()} successfully`);
      loadWorkflows(); // Reload to get updated data
    } catch (err) {
      toast.error(`Failed to ${action.toLowerCase()} workflow`);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="h-8 bg-surface-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-surface-200 rounded w-96"></div>
        </div>
        <SkeletonLoader count={4} type="card" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={loadWorkflows} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Automation</h1>
          <p className="text-surface-600 mt-1">Create automated workflows to nurture leads and streamline your processes.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" icon="Template">
            Templates
          </Button>
          <Button icon="Plus">
            Create Workflow
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchBar
          placeholder="Search workflows..."
          onSearch={handleSearch}
          className="flex-1 max-w-md"
        />
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon="Filter">
            Filter
          </Button>
          <Button variant="outline" size="sm" icon="SortDesc">
            Sort
          </Button>
        </div>
      </div>

      {/* Workflows List */}
      {workflows.length === 0 ? (
        <EmptyState
          title="No workflows yet"
          description="Automate your marketing and sales processes by creating your first workflow"
          actionLabel="Create Workflow"
          icon="Zap"
          onAction={() => {/* Handle create workflow */}}
        />
      ) : (
        <div className="grid gap-6">
          {filteredWorkflows.map((workflow, index) => (
            <motion.div
              key={workflow.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-surface-900 truncate">
                        {workflow.name}
                      </h3>
                      <Badge variant={getStatusColor(workflow.status)}>
                        {workflow.status}
                      </Badge>
                    </div>

                    {/* Trigger Information */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 text-sm text-surface-600 mb-2">
                        <ApperIcon name={getTriggerIcon(workflow.trigger.type)} size={14} />
                        <span className="font-medium">Trigger:</span>
                        <span>{getTriggerLabel(workflow.trigger.type)}</span>
                      </div>
                      
                      {/* Trigger Conditions */}
                      {workflow.trigger.conditions && Object.keys(workflow.trigger.conditions).length > 0 && (
                        <div className="flex flex-wrap gap-2 ml-4">
                          {Object.entries(workflow.trigger.conditions).map(([key, value]) => (
                            <Badge key={key} variant="secondary" size="sm">
                              {key}: {value}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions Preview */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 text-sm text-surface-600 mb-2">
                        <ApperIcon name="List" size={14} />
                        <span className="font-medium">Actions:</span>
                        <span>{workflow.actions.length} steps</span>
                      </div>
                      <div className="flex flex-wrap gap-2 ml-4">
                        {workflow.actions.slice(0, 3).map((action, idx) => (
                          <Badge key={idx} variant="primary" size="sm">
                            {action.type.replace('_', ' ')}
                          </Badge>
                        ))}
                        {workflow.actions.length > 3 && (
                          <Badge variant="default" size="sm">
                            +{workflow.actions.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Workflow Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-surface-50 rounded-lg">
                        <div className="text-lg font-semibold text-surface-900">
                          {workflow.executions.toLocaleString()}
                        </div>
                        <div className="text-xs text-surface-600">Executions</div>
                      </div>
                      <div className="text-center p-3 bg-surface-50 rounded-lg">
                        <div className="text-lg font-semibold text-surface-900">
                          {workflow.actions.length}
                        </div>
                        <div className="text-xs text-surface-600">Actions</div>
                      </div>
                      <div className="text-center p-3 bg-surface-50 rounded-lg">
                        <div className="text-xs text-surface-600">Created</div>
                        <div className="text-sm font-medium text-surface-900">
                          {new Date(workflow.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-6">
                    {workflow.status === 'Draft' && (
                      <Button
                        size="sm"
                        onClick={() => handleWorkflowAction(workflow.Id, 'Activate')}
                      >
                        Activate
                      </Button>
                    )}
                    {workflow.status === 'Active' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleWorkflowAction(workflow.Id, 'Pause')}
                      >
                        Pause
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      icon="Edit"
                      onClick={() => handleWorkflowAction(workflow.Id, 'Edit')}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      icon="MoreHorizontal"
                    >
                      More
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {filteredWorkflows.length === 0 && searchTerm && (
        <EmptyState
          title="No workflows found"
          description={`No workflows match "${searchTerm}". Try adjusting your search.`}
          icon="Search"
        />
      )}

      {/* Workflow Templates */}
      {workflows.length > 0 && (
        <Card className="border-2 border-dashed border-primary-200 bg-primary-50">
          <div className="text-center py-6">
            <ApperIcon name="Zap" size={32} className="text-primary-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-primary-900 mb-2">Need inspiration?</h3>
            <p className="text-primary-700 mb-4">Browse our workflow templates to get started quickly with proven automation sequences.</p>
            <div className="flex items-center justify-center gap-3">
              <Button>Browse Templates</Button>
              <Button variant="outline">Create from Scratch</Button>
            </div>
          </div>
        </Card>
      )}
    </motion.div>
  );
};

export default Automation;