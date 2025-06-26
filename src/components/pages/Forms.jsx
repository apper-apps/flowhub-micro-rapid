import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import formService from '@/services/api/formService';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import SearchBar from '@/components/molecules/SearchBar';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';

const Forms = () => {
  const [forms, setForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadForms();
  }, []);

  useEffect(() => {
    filterForms();
  }, [forms, searchTerm]);

  const loadForms = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await formService.getAll();
      setForms(data);
    } catch (err) {
      setError(err.message || 'Failed to load forms');
    } finally {
      setLoading(false);
    }
  };

  const filterForms = () => {
    if (!searchTerm) {
      setFilteredForms(forms);
      return;
    }

    const filtered = forms.filter(form =>
      form.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredForms(filtered);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Published': 'success',
      'Draft': 'warning',
      'Paused': 'danger'
    };
    return colors[status] || 'default';
  };

  const handleFormAction = async (formId, action) => {
    try {
      // Handle form actions (publish, duplicate, delete, etc.)
      toast.success(`Form ${action.toLowerCase()} successfully`);
      loadForms(); // Reload to get updated data
    } catch (err) {
      toast.error(`Failed to ${action.toLowerCase()} form`);
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
        <ErrorState message={error} onRetry={loadForms} />
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
          <h1 className="text-2xl font-bold text-surface-900">Forms</h1>
          <p className="text-surface-600 mt-1">Create and manage lead capture forms to grow your contact database.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" icon="Template">
            Templates
          </Button>
          <Button icon="Plus">
            Create Form
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchBar
          placeholder="Search forms..."
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

      {/* Forms List */}
      {forms.length === 0 ? (
        <EmptyState
          title="No forms yet"
          description="Create your first form to start capturing leads and growing your contact list"
          actionLabel="Create Form"
          icon="FileText"
          onAction={() => {/* Handle create form */}}
        />
      ) : (
        <div className="grid gap-6">
          {filteredForms.map((form, index) => (
            <motion.div
              key={form.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-surface-900 truncate">
                        {form.name}
                      </h3>
                      <Badge variant={getStatusColor(form.status)}>
                        {form.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-surface-600">
                        <ApperIcon name="FileText" size={14} />
                        <span>{form.fields.length} fields</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-surface-600">
                        <ApperIcon name="Calendar" size={14} />
                        <span>Created {new Date(form.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Form Fields Preview */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-surface-700 mb-2">Form Fields:</h4>
                      <div className="flex flex-wrap gap-2">
                        {form.fields.slice(0, 4).map((field, idx) => (
                          <Badge key={idx} variant="secondary" size="sm">
                            {field.label}
                          </Badge>
                        ))}
                        {form.fields.length > 4 && (
                          <Badge variant="default" size="sm">
                            +{form.fields.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Form Metrics */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-surface-50 rounded-lg">
                        <div className="text-lg font-semibold text-surface-900">
                          {form.views?.toLocaleString() || 0}
                        </div>
                        <div className="text-xs text-surface-600">Views</div>
                      </div>
                      <div className="text-center p-3 bg-surface-50 rounded-lg">
                        <div className="text-lg font-semibold text-surface-900">
                          {form.submissions.toLocaleString()}
                        </div>
                        <div className="text-xs text-surface-600">Submissions</div>
                      </div>
                      <div className="text-center p-3 bg-surface-50 rounded-lg">
                        <div className="text-lg font-semibold text-primary-600">
                          {form.conversionRate.toFixed(1)}%
                        </div>
                        <div className="text-xs text-surface-600">Conversion</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-6">
                    <Button
                      size="sm"
                      icon="Edit"
                      onClick={() => handleFormAction(form.Id, 'Edit')}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      icon="Eye"
                      onClick={() => handleFormAction(form.Id, 'Preview')}
                    >
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      icon="Code"
                      onClick={() => handleFormAction(form.Id, 'Embed')}
                    >
                      Embed
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

      {filteredForms.length === 0 && searchTerm && (
        <EmptyState
          title="No forms found"
          description={`No forms match "${searchTerm}". Try adjusting your search.`}
          icon="Search"
        />
      )}

      {/* Form Builder Quick Start */}
      {forms.length > 0 && (
        <Card className="border-2 border-dashed border-primary-200 bg-primary-50">
          <div className="text-center py-6">
            <ApperIcon name="Plus" size={32} className="text-primary-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-primary-900 mb-2">Ready to create another form?</h3>
            <p className="text-primary-700 mb-4">Use our drag-and-drop form builder to create professional forms in minutes.</p>
            <Button>Start Building</Button>
          </div>
        </Card>
      )}
    </motion.div>
  );
};

export default Forms;