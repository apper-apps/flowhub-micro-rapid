import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import FunnelChart from 'react-funnel-chart';
import { motion, AnimatePresence } from 'framer-motion';

import landingPageService from '@/services/api/landingPageService';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import FormField from '@/components/molecules/FormField';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';

const LandingPageBuilder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  // State management
  const [landingPage, setLandingPage] = useState(null);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('design');
  const [builderMode, setBuilderMode] = useState('page'); // 'page' or 'funnel'
  const [selectedSection, setSelectedSection] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    type: 'page',
    isPublished: false,
    settings: {
      metaTitle: '',
      metaDescription: '',
      favicon: '',
      customCSS: ''
    },
    funnelSettings: {
      conversionGoal: 'lead_qualified',
      trackingPixels: [],
      analyticsEnabled: true,
      exitIntentEnabled: true,
      progressBarEnabled: true,
      abandonmentRecovery: false
    },
    sections: []
  });

  // Load landing page data
  useEffect(() => {
    if (isEditing) {
      loadLandingPage();
    } else {
      setFormData(prev => ({
        ...prev,
        type: builderMode === 'funnel' ? 'funnel' : 'page'
      }));
    }
  }, [id, builderMode]);

  const loadLandingPage = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await landingPageService.getById(parseInt(id));
      setLandingPage(data);
      setFormData(data);
      setBuilderMode(data.type === 'funnel' ? 'funnel' : 'page');
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load landing page');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Validate required fields
      if (!formData.name || !formData.slug) {
        toast.error('Name and slug are required');
        return;
      }

      // Validate funnel steps if in funnel mode
      if (builderMode === 'funnel' && formData.sections.length === 0) {
        toast.error('Funnel must have at least one step');
        return;
      }

      let result;
      if (isEditing) {
        result = await landingPageService.update(parseInt(id), formData);
        toast.success('Landing page updated successfully');
      } else {
        result = await landingPageService.create(formData);
        toast.success(`${builderMode === 'funnel' ? 'Funnel' : 'Landing page'} created successfully`);
        navigate(`/landing-pages/builder/${result.Id}`);
      }

      setLandingPage(result);
    } catch (err) {
      toast.error(err.message || 'Failed to save landing page');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const addSection = (type) => {
    const newSection = {
      id: `section-${Date.now()}`,
      type,
      name: getSectionName(type),
      order: formData.sections.length,
      stepNumber: builderMode === 'funnel' ? formData.sections.length + 1 : undefined,
      content: getSectionTemplate(type)
    };

    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));

    setSelectedSection(newSection.id);
  };

  const updateSection = (sectionId, updates) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    }));
  };

  const deleteSection = (sectionId) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
    setSelectedSection(null);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(formData.sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order and step numbers
    const updatedSections = items.map((section, index) => ({
      ...section,
      order: index,
      stepNumber: builderMode === 'funnel' ? index + 1 : undefined
    }));

    setFormData(prev => ({
      ...prev,
      sections: updatedSections
    }));
  };

  const getSectionName = (type) => {
    const names = {
      'hero': 'Hero Section',
      'features': 'Features Section',
      'testimonial': 'Testimonial Section',
      'cta': 'Call to Action',
      'lead-capture': 'Lead Capture Form',
      'qualification': 'Qualification Questions',
      'upsell': 'Upsell Offer',
      'confirmation': 'Thank You Page'
    };
    return names[type] || 'New Section';
  };

  const getSectionTemplate = (type) => {
    const templates = {
      'hero': {
        title: 'Your Compelling Headline',
        subtitle: 'Supporting text that explains your value proposition',
        buttonText: 'Get Started',
        buttonLink: '#cta',
        backgroundImage: '',
        textAlign: 'center'
      },
      'lead-capture': {
        title: 'Get Your Free Resource',
        subtitle: 'Enter your details below',
        formFields: [
          {
            name: 'email',
            type: 'email',
            label: 'Email Address',
            required: true,
            placeholder: 'Enter your email'
          }
        ],
        buttonText: 'Download Now',
        buttonStyle: 'primary',
        progressText: builderMode === 'funnel' ? 'Step 1 of 4' : undefined
      },
      'qualification': {
        title: 'Tell Us About Yourself',
        subtitle: 'Help us customize your experience',
        formFields: [
          {
            name: 'company_size',
            type: 'select',
            label: 'Company Size',
            required: true,
            options: ['1-10 employees', '11-50 employees', '51-200 employees', '200+ employees']
          }
        ],
        buttonText: 'Continue',
        buttonStyle: 'primary',
        progressText: 'Step 2 of 4'
      },
      'upsell': {
        title: 'Special Offer Just for You',
        subtitle: 'Limited time opportunity',
        offer: {
          title: 'Premium Package',
          originalPrice: 497,
          discountedPrice: 97,
          features: ['Feature 1', 'Feature 2', 'Feature 3'],
          urgency: 'Limited time offer'
        },
        buttonText: 'Claim Offer',
        buttonStyle: 'success',
        skipText: 'Continue without offer',
        progressText: 'Step 3 of 4'
      },
      'confirmation': {
        title: 'Thank You!',
        subtitle: 'Your submission has been received',
        confirmationMessage: 'We\'ll be in touch soon with your results.',
        nextSteps: [
          {
            title: 'Check Your Email',
            description: 'We\'ve sent you a confirmation',
            icon: 'Mail'
          }
        ],
        progressText: 'Complete!'
      }
    };

    return templates[type] || {};
  };

  const renderFunnelAnalytics = () => {
    if (!landingPage?.analytics) return null;

    const funnelData = [
      { name: 'Visitors', value: landingPage.analytics.totalViews, fill: '#3B82F6' },
      { name: 'Step 1', value: landingPage.analytics.step1Completions, fill: '#10B981' },
      { name: 'Step 2', value: landingPage.analytics.step2Completions, fill: '#F59E0B' },
      { name: 'Step 3', value: landingPage.analytics.step3Completions, fill: '#EF4444' },
      { name: 'Converted', value: landingPage.analytics.step4Completions, fill: '#8B5CF6' }
    ];

    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Funnel Performance</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <FunnelChart
              data={funnelData}
              height={300}
              width={400}
            />
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {landingPage.analytics.conversionRate}%
                </div>
                <div className="text-sm text-gray-600">Overall Conversion</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {landingPage.analytics.upsellConversionRate}%
                </div>
                <div className="text-sm text-gray-600">Upsell Conversion</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Step-by-Step Breakdown</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Visitors → Step 1:</span>
                  <span>{((landingPage.analytics.step1Completions / landingPage.analytics.totalViews) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Step 1 → Step 2:</span>
                  <span>{((landingPage.analytics.step2Completions / landingPage.analytics.step1Completions) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Step 2 → Step 3:</span>
                  <span>{((landingPage.analytics.step3Completions / landingPage.analytics.step2Completions) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Step 3 → Complete:</span>
                  <span>{((landingPage.analytics.step4Completions / landingPage.analytics.step3Completions) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const renderSectionEditor = () => {
    const section = formData.sections.find(s => s.id === selectedSection);
    if (!section) return null;

    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Section: {section.name}</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => deleteSection(section.id)}
            className="text-red-600 hover:text-red-700"
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>

        <div className="space-y-4">
          <FormField
            type="text"
            label="Section Name"
            value={section.name}
            onChange={(e) => updateSection(section.id, { name: e.target.value })}
          />

          {section.type === 'hero' && (
            <>
              <FormField
                type="text"
                label="Title"
                value={section.content.title}
                onChange={(e) => updateSection(section.id, {
                  content: { ...section.content, title: e.target.value }
                })}
              />
              <FormField
                type="textarea"
                label="Subtitle"
                value={section.content.subtitle}
                onChange={(e) => updateSection(section.id, {
                  content: { ...section.content, subtitle: e.target.value }
                })}
              />
              <FormField
                type="text"
                label="Button Text"
                value={section.content.buttonText}
                onChange={(e) => updateSection(section.id, {
                  content: { ...section.content, buttonText: e.target.value }
                })}
              />
            </>
          )}

          {section.type === 'lead-capture' && (
            <>
              <FormField
                type="text"
                label="Form Title"
                value={section.content.title}
                onChange={(e) => updateSection(section.id, {
                  content: { ...section.content, title: e.target.value }
                })}
              />
              <FormField
                type="text"
                label="Button Text"
                value={section.content.buttonText}
                onChange={(e) => updateSection(section.id, {
                  content: { ...section.content, buttonText: e.target.value }
                })}
              />
              {builderMode === 'funnel' && (
                <FormField
                  type="text"
                  label="Progress Text"
                  value={section.content.progressText || ''}
                  onChange={(e) => updateSection(section.id, {
                    content: { ...section.content, progressText: e.target.value }
                  })}
                />
              )}
            </>
          )}

          {section.type === 'upsell' && (
            <>
              <FormField
                type="text"
                label="Offer Title"
                value={section.content.title}
                onChange={(e) => updateSection(section.id, {
                  content: { ...section.content, title: e.target.value }
                })}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  type="number"
                  label="Original Price"
                  value={section.content.offer?.originalPrice || ''}
                  onChange={(e) => updateSection(section.id, {
                    content: {
                      ...section.content,
                      offer: { ...section.content.offer, originalPrice: parseInt(e.target.value) }
                    }
                  })}
                />
                <FormField
                  type="number"
                  label="Discounted Price"
                  value={section.content.offer?.discountedPrice || ''}
                  onChange={(e) => updateSection(section.id, {
                    content: {
                      ...section.content,
                      offer: { ...section.content.offer, discountedPrice: parseInt(e.target.value) }
                    }
                  })}
                />
              </div>
            </>
          )}
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={loadLandingPage}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit' : 'Create'} {builderMode === 'funnel' ? 'Funnel' : 'Landing Page'}
          </h1>
          <p className="text-gray-600 mt-1">
            {builderMode === 'funnel' 
              ? 'Build multi-step conversion funnels with analytics'
              : 'Create beautiful landing pages with drag-and-drop builder'
            }
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/landing-pages')}
          >
            <ApperIcon name="ArrowLeft" size={16} />
            Back to List
          </Button>
          <Button
            onClick={handleSave}
            loading={isSaving}
            disabled={isSaving}
          >
            <ApperIcon name="Save" size={16} />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Builder Mode Toggle */}
      {!isEditing && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Builder Mode</h3>
              <p className="text-sm text-gray-600">Choose between single page or multi-step funnel</p>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setBuilderMode('page')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  builderMode === 'page'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ApperIcon name="FileText" size={16} className="mr-2" />
                Landing Page
              </button>
              <button
                onClick={() => setBuilderMode('funnel')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  builderMode === 'funnel'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ApperIcon name="GitBranch" size={16} className="mr-2" />
                Funnel
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('design')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'design'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <ApperIcon name="Layout" size={16} className="mr-2" />
            Design
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'settings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <ApperIcon name="Settings" size={16} className="mr-2" />
            Settings
          </button>
          {builderMode === 'funnel' && landingPage?.analytics && (
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ApperIcon name="BarChart3" size={16} className="mr-2" />
              Analytics
            </button>
          )}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {activeTab === 'design' && (
          <>
            {/* Section Builder */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">
                    {builderMode === 'funnel' ? 'Funnel Steps' : 'Page Sections'}
                  </h3>
                  <div className="flex gap-2">
                    <select
                      onChange={(e) => addSection(e.target.value)}
                      value=""
                      className="text-sm border border-gray-300 rounded-md px-3 py-1"
                    >
                      <option value="">Add Section</option>
                      {builderMode === 'funnel' ? (
                        <>
                          <option value="lead-capture">Lead Capture</option>
                          <option value="qualification">Qualification</option>
                          <option value="upsell">Upsell Offer</option>
                          <option value="confirmation">Thank You</option>
                        </>
                      ) : (
                        <>
                          <option value="hero">Hero Section</option>
                          <option value="features">Features</option>
                          <option value="testimonial">Testimonial</option>
                          <option value="cta">Call to Action</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="sections">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {formData.sections.map((section, index) => (
                          <Draggable key={section.id} draggableId={section.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`p-4 border rounded-lg mb-2 cursor-pointer transition-colors ${
                                  selectedSection === section.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => setSelectedSection(section.id)}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="font-medium">
                                      {builderMode === 'funnel' && `Step ${section.stepNumber}: `}
                                      {section.name}
                                    </div>
                                    <div className="text-sm text-gray-600 capitalize">
                                      {section.type.replace('-', ' ')}
                                    </div>
                                  </div>
                                  <ApperIcon name="GripVertical" size={16} className="text-gray-400" />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                {formData.sections.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <ApperIcon name="Plus" size={24} className="mx-auto mb-2" />
                    <p>Add your first {builderMode === 'funnel' ? 'funnel step' : 'section'} to get started</p>
                  </div>
                )}
              </Card>
            </div>

            {/* Section Editor */}
            <div className="space-y-4">
              {selectedSection ? (
                renderSectionEditor()
              ) : (
                <Card className="p-6 text-center text-gray-500">
                  <ApperIcon name="MousePointer" size={24} className="mx-auto mb-2" />
                  <p>Select a section to edit its content</p>
                </Card>
              )}
            </div>
          </>
        )}

        {activeTab === 'settings' && (
          <div className="lg:col-span-3 space-y-6">
            {/* Basic Settings */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  type="text"
                  label="Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
                <FormField
                  type="text"
                  label="URL Slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  required
                />
                <div className="md:col-span-2">
                  <FormField
                    type="textarea"
                    label="Description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) => handleInputChange('isPublished', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="isPublished" className="ml-2 text-sm text-gray-700">
                    Published
                  </label>
                </div>
              </div>
            </Card>

            {/* SEO Settings */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
              <div className="space-y-4">
                <FormField
                  type="text"
                  label="Meta Title"
                  value={formData.settings.metaTitle}
                  onChange={(e) => handleInputChange('settings.metaTitle', e.target.value)}
                />
                <FormField
                  type="textarea"
                  label="Meta Description"
                  value={formData.settings.metaDescription}
                  onChange={(e) => handleInputChange('settings.metaDescription', e.target.value)}
                />
              </div>
            </Card>

            {/* Funnel Settings */}
            {builderMode === 'funnel' && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Funnel Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Conversion Goal
                    </label>
                    <select
                      value={formData.funnelSettings.conversionGoal}
                      onChange={(e) => handleInputChange('funnelSettings.conversionGoal', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="lead_qualified">Lead Qualified</option>
                      <option value="purchase_complete">Purchase Complete</option>
                      <option value="signup_complete">Signup Complete</option>
                      <option value="booking_complete">Booking Complete</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="progressBar"
                        checked={formData.funnelSettings.progressBarEnabled}
                        onChange={(e) => handleInputChange('funnelSettings.progressBarEnabled', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="progressBar" className="ml-2 text-sm text-gray-700">
                        Show Progress Bar
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="exitIntent"
                        checked={formData.funnelSettings.exitIntentEnabled}
                        onChange={(e) => handleInputChange('funnelSettings.exitIntentEnabled', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="exitIntent" className="ml-2 text-sm text-gray-700">
                        Exit Intent Popup
                      </label>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'analytics' && builderMode === 'funnel' && (
          <div className="lg:col-span-3">
            {renderFunnelAnalytics()}
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPageBuilder;