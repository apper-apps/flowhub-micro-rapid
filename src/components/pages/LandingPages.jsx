import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import EmptyState from '@/components/molecules/EmptyState';
import SearchBar from '@/components/molecules/SearchBar';
import landingPageService from '@/services/api/landingPageService';

const LandingPages = () => {
  const [landingPages, setLandingPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadLandingPages();
  }, []);

  const loadLandingPages = async () => {
    try {
      setLoading(true);
      const data = await landingPageService.getAll();
      setLandingPages(data);
      setError(null);
    } catch (err) {
      setError('Failed to load landing pages');
      toast.error('Failed to load landing pages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this landing page?')) return;

    try {
      await landingPageService.delete(id);
      setLandingPages(prev => prev.filter(page => page.Id !== id));
      toast.success('Landing page deleted successfully');
    } catch (err) {
      toast.error('Failed to delete landing page');
    }
  };

  const handleDuplicate = async (page) => {
    try {
      const duplicatedPage = {
        ...page,
        name: `${page.name} (Copy)`,
        slug: `${page.slug}-copy-${Date.now()}`,
        isPublished: false
      };
      delete duplicatedPage.Id;
      
      const newPage = await landingPageService.create(duplicatedPage);
      setLandingPages(prev => [newPage, ...prev]);
      toast.success('Landing page duplicated successfully');
    } catch (err) {
      toast.error('Failed to duplicate landing page');
    }
  };

  const handlePublishToggle = async (page) => {
    try {
      const updatedPage = await landingPageService.update(page.Id, {
        ...page,
        isPublished: !page.isPublished
      });
      setLandingPages(prev => prev.map(p => p.Id === page.Id ? updatedPage : p));
      toast.success(updatedPage.isPublished ? 'Landing page published' : 'Landing page unpublished');
    } catch (err) {
      toast.error('Failed to update landing page status');
    }
  };

  const filteredPages = landingPages.filter(page =>
    page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <SkeletonLoader count={6} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="text-center py-12">
            <ApperIcon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-surface-900 mb-2">Error Loading Landing Pages</h3>
            <p className="text-surface-600 mb-6">{error}</p>
            <Button onClick={loadLandingPages} variant="primary">
              Try Again
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-surface-900">Landing Pages</h1>
            <p className="text-surface-600 mt-1">Create and manage your landing pages</p>
          </div>
          <Button
            onClick={() => navigate('/landing-pages/builder/new')}
            variant="primary"
            icon="Plus"
          >
            Create Landing Page
          </Button>
        </div>

        {/* Search and filters */}
        <div className="mb-6">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search landing pages..."
            className="max-w-md"
          />
        </div>

        {/* Content */}
        {filteredPages.length === 0 ? (
          <EmptyState
            icon="Globe"
            title="No landing pages found"
            description={searchTerm ? "No landing pages match your search criteria." : "Create your first landing page to get started."}
            action={
              !searchTerm && (
                <Button
                  onClick={() => navigate('/landing-pages/builder/new')}
                  variant="primary"
                  icon="Plus"
                >
                  Create Landing Page
                </Button>
              )
            }
          />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPages.map((page) => (
              <motion.div key={page.Id} variants={itemVariants}>
                <Card hover className="h-full">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-surface-900 mb-1">
                          {page.name}
                        </h3>
                        <p className="text-sm text-surface-600 line-clamp-2">
                          {page.description || 'No description'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {page.isPublished ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            <ApperIcon name="Globe" size={12} />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                            <ApperIcon name="Edit" size={12} />
                            Draft
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-surface-600 mb-6">
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Eye" size={14} />
                        {page.views || 0} views
                      </div>
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Calendar" size={14} />
                        {new Date(page.updatedAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        as={Link}
                        to={`/landing-pages/builder/${page.Id}`}
                        variant="outline"
                        size="sm"
                        icon="Edit"
                        className="flex-1"
                      >
                        Edit
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {page.isPublished && (
                          <Button
                            as="a"
                            href={`/page/${page.slug}`}
                            target="_blank"
                            variant="ghost"
                            size="sm"
                            icon="ExternalLink"
                          />
                        )}
                        
                        <Button
                          onClick={() => handlePublishToggle(page)}
                          variant="ghost"
                          size="sm"
                          icon={page.isPublished ? "EyeOff" : "Eye"}
                          title={page.isPublished ? "Unpublish" : "Publish"}
                        />
                        
                        <Button
                          onClick={() => handleDuplicate(page)}
                          variant="ghost"
                          size="sm"
                          icon="Copy"
                          title="Duplicate"
                        />
                        
                        <Button
                          onClick={() => handleDelete(page.Id)}
                          variant="ghost"
                          size="sm"
                          icon="Trash2"
                          title="Delete"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LandingPages;