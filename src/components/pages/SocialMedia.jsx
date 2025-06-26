import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import TextareaAutosize from 'react-textarea-autosize';
import socialMediaService from '@/services/api/socialMediaService';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Input from '@/components/atoms/Input';
import SearchBar from '@/components/molecules/SearchBar';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';

const SocialMedia = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('create');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['facebook']);
  const [postContent, setPostContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  const platforms = {
    facebook: { name: 'Facebook', color: 'bg-blue-600', icon: 'Facebook', limit: 63206 },
    twitter: { name: 'Twitter', color: 'bg-blue-400', icon: 'Twitter', limit: 280 },
    linkedin: { name: 'LinkedIn', color: 'bg-blue-700', icon: 'Linkedin', limit: 3000 }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await socialMediaService.getAll();
      setPosts(data);
    } catch (err) {
      setError('Failed to load social media posts');
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

const filteredPosts = posts.filter(post => {
    const platforms = post.platforms || [];
    const platformArray = typeof platforms === 'string' ? platforms.split(',') : platforms;
    return post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
           platformArray.some(platform => platform.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const togglePlatform = (platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleMediaUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'video'
    }));
    setMediaFiles(prev => [...prev, ...newFiles]);
  };

  const removeMedia = (id) => {
    setMediaFiles(prev => {
      const updated = prev.filter(file => file.id !== id);
      // Clean up object URLs
      const removed = prev.find(file => file.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      return updated;
    });
  };

  const getCharacterCount = (platform) => {
    return postContent.length;
  };

  const isOverLimit = (platform) => {
    return getCharacterCount(platform) > platforms[platform].limit;
  };

  const handlePublish = async (type = 'now') => {
    if (!postContent.trim()) {
      toast.error('Please enter some content for your post');
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    if (selectedPlatforms.some(platform => isOverLimit(platform))) {
      toast.error('Post content exceeds character limit for selected platforms');
      return;
    }

    if (type === 'schedule' && (!scheduledDate || !scheduledTime)) {
      toast.error('Please select date and time for scheduling');
      return;
    }

    try {
const postData = {
        content: postContent,
        platforms: selectedPlatforms,
        media: mediaFiles.map(file => ({ type: file.type, name: file.file.name })),
        status: type === 'schedule' ? 'scheduled' : 'published',
        scheduledFor: type === 'schedule' ? `${scheduledDate}T${scheduledTime}` : null,
        publishedAt: type === 'now' ? new Date().toISOString() : null
      };

      await socialMediaService.create(postData);
      
      // Reset form
      setPostContent('');
      setMediaFiles([]);
      setScheduledDate('');
      setScheduledTime('');
      setSelectedPlatforms(['facebook']);
      
      // Reload posts and switch to manage tab
      await loadPosts();
      setActiveTab('manage');
      
      toast.success(type === 'schedule' ? 'Post scheduled successfully!' : 'Post published successfully!');
    } catch (err) {
      toast.error('Failed to create post');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await socialMediaService.delete(postId);
      await loadPosts();
      toast.success('Post deleted successfully');
    } catch (err) {
      toast.error('Failed to delete post');
    }
  };

  const renderPlatformPreview = (platform) => {
    if (!selectedPlatforms.includes(platform)) return null;

    const platformConfig = platforms[platform];
    const charCount = getCharacterCount(platform);
    const overLimit = isOverLimit(platform);

    return (
      <div key={platform} className="border border-surface-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-6 h-6 ${platformConfig.color} rounded flex items-center justify-center`}>
            <ApperIcon name={platformConfig.icon} size={14} className="text-white" />
          </div>
          <span className="font-medium text-surface-700">{platformConfig.name}</span>
          <span className={`text-sm ml-auto ${overLimit ? 'text-red-600' : 'text-surface-500'}`}>
            {charCount}/{platformConfig.limit}
          </span>
        </div>

        {/* Platform-specific preview */}
        {platform === 'facebook' && (
          <div className="bg-white border border-surface-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <ApperIcon name="User" size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-surface-900">Your Business Page</span>
                  <span className="text-sm text-surface-500">· now</span>
                </div>
                <p className="text-surface-900 mb-3">{postContent || 'Your post content will appear here...'}</p>
                {mediaFiles.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {mediaFiles.slice(0, 4).map(file => (
                      <div key={file.id} className="aspect-square bg-surface-100 rounded-lg overflow-hidden">
                        {file.type === 'image' ? (
                          <img src={file.url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ApperIcon name="Play" size={24} className="text-surface-400" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-6 text-sm text-surface-500">
                  <button className="flex items-center gap-1 hover:text-blue-600">
                    <ApperIcon name="ThumbsUp" size={16} />
                    Like
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-600">
                    <ApperIcon name="MessageCircle" size={16} />
                    Comment
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-600">
                    <ApperIcon name="Share" size={16} />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {platform === 'twitter' && (
          <div className="bg-white border border-surface-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
                <ApperIcon name="User" size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-surface-900">Your Business</span>
                  <span className="text-surface-500">@yourbusiness</span>
                  <span className="text-sm text-surface-500">· now</span>
                </div>
                <p className="text-surface-900 mb-3">{postContent || 'Your tweet content will appear here...'}</p>
                {mediaFiles.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mb-3 rounded-lg overflow-hidden">
                    {mediaFiles.slice(0, 4).map(file => (
                      <div key={file.id} className="aspect-video bg-surface-100">
                        {file.type === 'image' ? (
                          <img src={file.url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ApperIcon name="Play" size={24} className="text-surface-400" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between text-sm text-surface-500">
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-1 hover:text-blue-400">
                      <ApperIcon name="MessageCircle" size={16} />
                      <span>0</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-green-500">
                      <ApperIcon name="Repeat" size={16} />
                      <span>0</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-red-500">
                      <ApperIcon name="Heart" size={16} />
                      <span>0</span>
                    </button>
                  </div>
                  <button className="hover:text-blue-400">
                    <ApperIcon name="Share" size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {platform === 'linkedin' && (
          <div className="bg-white border border-surface-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center">
                <ApperIcon name="User" size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="mb-2">
                  <span className="font-medium text-surface-900">Your Business Page</span>
                  <p className="text-sm text-surface-500">Company · now</p>
                </div>
                <p className="text-surface-900 mb-3">{postContent || 'Your LinkedIn post content will appear here...'}</p>
                {mediaFiles.length > 0 && (
                  <div className="mb-3">
                    {mediaFiles.slice(0, 1).map(file => (
                      <div key={file.id} className="aspect-video bg-surface-100 rounded-lg overflow-hidden">
                        {file.type === 'image' ? (
                          <img src={file.url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ApperIcon name="Play" size={24} className="text-surface-400" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-4 text-sm text-surface-500 pt-3 border-t border-surface-100">
                  <button className="flex items-center gap-1 hover:text-blue-700">
                    <ApperIcon name="ThumbsUp" size={16} />
                    Like
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-700">
                    <ApperIcon name="MessageCircle" size={16} />
                    Comment
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-700">
                    <ApperIcon name="Share" size={16} />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      published: 'success',
      scheduled: 'warning',
      draft: 'info',
      failed: 'danger'
    };
    return colors[status] || 'default';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <SkeletonLoader count={3} type="card" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={loadPosts} />
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
          <h1 className="text-2xl font-bold text-surface-900">Social Media</h1>
          <p className="text-surface-600 mt-1">Create, schedule, and manage your social media posts across platforms.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon="Calendar">
            Content Calendar
          </Button>
          <Button variant="outline" icon="BarChart3">
            Analytics
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-surface-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'create'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-surface-600 hover:text-surface-900'
          }`}
        >
          Create Post
        </button>
        <button
          onClick={() => setActiveTab('manage')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'manage'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-surface-600 hover:text-surface-900'
          }`}
        >
          Manage Posts
        </button>
      </div>

      {/* Create Post Tab */}
      {activeTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compose Section */}
          <Card className="space-y-6">
            <div className="flex items-center gap-2">
              <ApperIcon name="Edit3" size={20} className="text-primary-600" />
              <h2 className="text-lg font-semibold text-surface-900">Compose Post</h2>
            </div>

            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-3">
                Select Platforms
              </label>
              <div className="flex flex-wrap gap-3">
                {Object.entries(platforms).map(([key, platform]) => (
                  <button
                    key={key}
                    onClick={() => togglePlatform(key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                      selectedPlatforms.includes(key)
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-surface-200 hover:border-surface-300 text-surface-700'
                    }`}
                  >
                    <div className={`w-4 h-4 ${platform.color} rounded flex items-center justify-center`}>
                      <ApperIcon name={platform.icon} size={10} className="text-white" />
                    </div>
                    {platform.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Input */}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Post Content
              </label>
              <TextareaAutosize
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What's happening? Share your thoughts, updates, or announcements..."
                className="w-full px-3 py-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                minRows={4}
                maxRows={8}
              />
              <div className="flex justify-between items-center mt-2">
                <div className="flex gap-4">
                  {selectedPlatforms.map(platform => {
                    const count = getCharacterCount(platform);
                    const limit = platforms[platform].limit;
                    const overLimit = count > limit;
                    return (
                      <span key={platform} className={`text-sm ${overLimit ? 'text-red-600' : 'text-surface-500'}`}>
                        {platforms[platform].name}: {count}/{limit}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Media Upload */}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Media Files
              </label>
              <div className="border-2 border-dashed border-surface-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleMediaUpload}
                  className="hidden"
                  id="media-upload"
                />
                <label
                  htmlFor="media-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <ApperIcon name="Upload" size={24} className="text-surface-400" />
                  <span className="text-sm text-surface-600">
                    Click to upload images or videos
                  </span>
                </label>
              </div>
              
              {mediaFiles.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {mediaFiles.map(file => (
                    <div key={file.id} className="relative group">
                      <div className="aspect-square bg-surface-100 rounded-lg overflow-hidden">
                        {file.type === 'image' ? (
                          <img src={file.url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ApperIcon name="Play" size={24} className="text-surface-400" />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeMedia(file.id)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ApperIcon name="X" size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Scheduling */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                label="Schedule Date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
              <Input
                type="time"
                label="Schedule Time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-surface-200">
              <Button
                onClick={() => handlePublish('now')}
                variant="primary"
                icon="Send"
                disabled={!postContent.trim() || selectedPlatforms.some(p => isOverLimit(p))}
              >
                Publish Now
              </Button>
              <Button
                onClick={() => handlePublish('schedule')}
                variant="outline"
                icon="Calendar"
                disabled={!postContent.trim() || selectedPlatforms.some(p => isOverLimit(p))}
              >
                Schedule Post
              </Button>
            </div>
          </Card>

          {/* Preview Section */}
          <Card className="space-y-4">
            <div className="flex items-center gap-2">
              <ApperIcon name="Eye" size={20} className="text-primary-600" />
              <h2 className="text-lg font-semibold text-surface-900">Preview</h2>
            </div>
            
            {selectedPlatforms.length === 0 ? (
              <div className="text-center py-8 text-surface-500">
                Select platforms to see preview
              </div>
            ) : (
              <div className="space-y-4">
                {selectedPlatforms.map(platform => renderPlatformPreview(platform))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Manage Posts Tab */}
      {activeTab === 'manage' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <SearchBar
              placeholder="Search posts..."
              onSearch={handleSearch}
              className="w-full sm:w-96"
            />
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" icon="Filter">
                Filter
              </Button>
              <Button variant="outline" size="sm" icon="Download">
                Export
              </Button>
            </div>
          </div>

          {/* Posts List */}
          {filteredPosts.length === 0 ? (
            <EmptyState
              title="No posts found"
              description="Get started by creating your first social media post"
              actionLabel="Create Post"
              onAction={() => setActiveTab('create')}
              icon="Share"
            />
          ) : (
            <div className="grid gap-4">
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.Id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={getStatusColor(post.status)}>
                            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                          </Badge>
<div className="flex items-center gap-1">
                            {(typeof post.platforms === 'string' ? post.platforms.split(',') : post.platforms || []).map(platform => (
                              <div
                                key={platform}
                                className={`w-5 h-5 ${platforms[platform.trim()]?.color || 'bg-surface-400'} rounded flex items-center justify-center`}
                              >
                                <ApperIcon 
                                  name={platforms[platform.trim()]?.icon || 'Share'} 
                                  size={10} 
                                  className="text-white" 
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                        <p className="text-surface-900 mb-2 line-clamp-2">{post.content}</p>
                        <div className="flex items-center gap-4 text-sm text-surface-500">
{(post.published_at || post.publishedAt) && (
                            <span>Published {formatDate(post.published_at || post.publishedAt)}</span>
                          )}
                          {(post.scheduled_for || post.scheduledFor) && (
                            <span>Scheduled for {formatDate(post.scheduled_for || post.scheduledFor)}</span>
                          )}
{(post.engagement_likes !== undefined || post.engagement) && (
                            <div className="flex items-center gap-3">
                              <span>{post.engagement_likes || post.engagement?.likes || 0} likes</span>
                              <span>{post.engagement_comments || post.engagement?.comments || 0} comments</span>
                              <span>{post.engagement_shares || post.engagement?.shares || 0} shares</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" icon="Eye">
                          View
                        </Button>
                        <Button variant="ghost" size="sm" icon="Edit">
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          icon="Trash2"
                          onClick={() => handleDeletePost(post.Id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default SocialMedia;