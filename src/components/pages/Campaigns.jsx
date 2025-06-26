import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import campaignService from '@/services/api/campaignService';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import SearchBar from '@/components/molecules/SearchBar';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCampaigns();
  }, []);

  useEffect(() => {
    filterCampaigns();
  }, [campaigns, searchTerm]);

  const loadCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await campaignService.getAll();
      setCampaigns(data);
    } catch (err) {
      setError(err.message || 'Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const filterCampaigns = () => {
    if (!searchTerm) {
      setFilteredCampaigns(campaigns);
      return;
    }

    const filtered = campaigns.filter(campaign =>
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.subject?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCampaigns(filtered);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Active': 'success',
      'Completed': 'info',
      'Scheduled': 'warning',
      'Draft': 'default',
      'Paused': 'danger'
    };
    return colors[status] || 'default';
  };

  const handleCampaignAction = async (campaignId, action) => {
    try {
      // Handle campaign actions (start, pause, stop, etc.)
      toast.success(`Campaign ${action.toLowerCase()} successfully`);
      loadCampaigns(); // Reload to get updated data
    } catch (err) {
      toast.error(`Failed to ${action.toLowerCase()} campaign`);
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
        <ErrorState message={error} onRetry={loadCampaigns} />
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
          <h1 className="text-2xl font-bold text-surface-900">Email Campaigns</h1>
          <p className="text-surface-600 mt-1">Create, manage, and track your email marketing campaigns.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" icon="BarChart3">
            Analytics
          </Button>
          <Button icon="Plus">
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchBar
          placeholder="Search campaigns..."
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

      {/* Campaigns List */}
      {campaigns.length === 0 ? (
        <EmptyState
          title="No campaigns yet"
          description="Start engaging with your audience by creating your first email campaign"
          actionLabel="Create Campaign"
          icon="Mail"
          onAction={() => {/* Handle create campaign */}}
        />
      ) : (
        <div className="grid gap-6">
          {filteredCampaigns.map((campaign, index) => (
            <motion.div
              key={campaign.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-surface-900 truncate">
                        {campaign.name}
                      </h3>
                      <Badge variant={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-surface-600">
                        <ApperIcon name="Tag" size={14} />
                        <span>{campaign.type}</span>
                      </div>
                      {campaign.subject && (
                        <div className="flex items-center gap-2 text-sm text-surface-600">
                          <ApperIcon name="Mail" size={14} />
                          <span className="truncate">{campaign.subject}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-surface-600">
                        <ApperIcon name="Calendar" size={14} />
                        <span>{new Date(campaign.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Campaign Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-surface-50 rounded-lg">
                        <div className="text-lg font-semibold text-surface-900">
                          {campaign.recipients.toLocaleString()}
                        </div>
                        <div className="text-xs text-surface-600">Recipients</div>
                      </div>
                      <div className="text-center p-3 bg-surface-50 rounded-lg">
                        <div className="text-lg font-semibold text-surface-900">
                          {campaign.openRate.toFixed(1)}%
                        </div>
                        <div className="text-xs text-surface-600">Open Rate</div>
                      </div>
                      <div className="text-center p-3 bg-surface-50 rounded-lg">
                        <div className="text-lg font-semibold text-surface-900">
                          {campaign.clickRate.toFixed(1)}%
                        </div>
                        <div className="text-xs text-surface-600">Click Rate</div>
                      </div>
                      <div className="text-center p-3 bg-surface-50 rounded-lg">
                        <div className="text-lg font-semibold text-surface-900">
                          {campaign.delivered.toLocaleString()}
                        </div>
                        <div className="text-xs text-surface-600">Delivered</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-6">
                    {campaign.status === 'Draft' && (
                      <Button
                        size="sm"
                        onClick={() => handleCampaignAction(campaign.Id, 'Start')}
                      >
                        Launch
                      </Button>
                    )}
                    {campaign.status === 'Active' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCampaignAction(campaign.Id, 'Pause')}
                      >
                        Pause
                      </Button>
                    )}
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

      {filteredCampaigns.length === 0 && searchTerm && (
        <EmptyState
          title="No campaigns found"
          description={`No campaigns match "${searchTerm}". Try adjusting your search.`}
          icon="Search"
        />
      )}
    </motion.div>
  );
};

export default Campaigns;