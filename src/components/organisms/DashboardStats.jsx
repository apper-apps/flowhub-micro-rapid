import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import contactService from '@/services/api/contactService';
import campaignService from '@/services/api/campaignService';
import formService from '@/services/api/formService';
import workflowService from '@/services/api/workflowService';
import MetricCard from '@/components/molecules/MetricCard';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalContacts: 0,
    activeCampaigns: 0,
    totalForms: 0,
    activeWorkflows: 0,
    conversionRate: 0,
    emailOpenRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [contacts, campaigns, forms, workflows] = await Promise.all([
        contactService.getAll(),
        campaignService.getAll(),
        formService.getAll(),
        workflowService.getAll()
      ]);

      // Calculate stats
      const activeCampaigns = campaigns.filter(c => c.status === 'Active').length;
      const activeWorkflows = workflows.filter(w => w.status === 'Active').length;
      
      // Calculate average conversion rate from forms
      const avgConversionRate = forms.length > 0 
        ? forms.reduce((sum, form) => sum + form.conversionRate, 0) / forms.length
        : 0;

      // Calculate average email open rate from campaigns
      const avgOpenRate = campaigns.length > 0
        ? campaigns.reduce((sum, campaign) => sum + campaign.openRate, 0) / campaigns.length
        : 0;

      setStats({
        totalContacts: contacts.length,
        activeCampaigns,
        totalForms: forms.length,
        activeWorkflows,
        conversionRate: avgConversionRate,
        emailOpenRate: avgOpenRate
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const metrics = [
    {
      title: 'Total Contacts',
      value: stats.totalContacts.toLocaleString(),
      change: '+12.5% from last month',
      changeType: 'positive',
      icon: 'Users',
      gradient: true
    },
    {
      title: 'Active Campaigns',
      value: stats.activeCampaigns.toString(),
      change: '+2 this week',
      changeType: 'positive',
      icon: 'Mail'
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate.toFixed(1)}%`,
      change: '+1.2% from last week',
      changeType: 'positive',
      icon: 'Target'
    },
    {
      title: 'Email Open Rate',
      value: `${stats.emailOpenRate.toFixed(1)}%`,
      change: '+3.4% from last month',
      changeType: 'positive',
      icon: 'MailOpen'
    },
    {
      title: 'Active Forms',
      value: stats.totalForms.toString(),
      change: 'No change',
      changeType: 'neutral',
      icon: 'FileText'
    },
    {
      title: 'Workflows Running',
      value: stats.activeWorkflows.toString(),
      change: '+1 this month',
      changeType: 'positive',
      icon: 'Zap'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-card border border-surface-200 p-6">
            <div className="animate-pulse space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                  <div className="h-6 bg-surface-200 rounded w-1/2 mt-2"></div>
                </div>
                <div className="w-10 h-10 bg-surface-200 rounded-lg"></div>
              </div>
              <div className="h-3 bg-surface-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <MetricCard
            title={metric.title}
            value={metric.value}
            change={metric.change}
            changeType={metric.changeType}
            icon={metric.icon}
            gradient={metric.gradient}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;