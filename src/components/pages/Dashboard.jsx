import { motion } from 'framer-motion';
import DashboardStats from '@/components/organisms/DashboardStats';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';

const Dashboard = () => {
  const quickActions = [
    { title: 'Add Contact', icon: 'UserPlus', description: 'Add a new contact to your CRM', action: () => {} },
    { title: 'Create Campaign', icon: 'Mail', description: 'Launch a new email campaign', action: () => {} },
    { title: 'Build Form', icon: 'FileText', description: 'Create a new lead capture form', action: () => {} },
    { title: 'Setup Workflow', icon: 'Zap', description: 'Automate your processes', action: () => {} }
  ];

  const recentActivity = [
    { id: 1, type: 'contact', message: 'Sarah Johnson moved to Qualified stage', time: '2 hours ago', icon: 'User' },
    { id: 2, type: 'campaign', message: 'Welcome Series campaign sent to 45 contacts', time: '4 hours ago', icon: 'Mail' },
    { id: 3, type: 'form', message: 'Demo Request Form received 3 new submissions', time: '6 hours ago', icon: 'FileText' },
    { id: 4, type: 'workflow', message: 'Lead Nurturing workflow triggered for 12 contacts', time: '8 hours ago', icon: 'Zap' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Dashboard</h1>
          <p className="text-surface-600 mt-1">Welcome back! Here's what's happening with your business.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon="Download">
            Export Report
          </Button>
          <Button icon="Plus">
            Quick Add
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <DashboardStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <ApperIcon name="Zap" size={20} className="text-primary-600" />
            <h2 className="text-lg font-semibold text-surface-900">Quick Actions</h2>
          </div>
          <div className="space-y-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={action.action}
                className="w-full p-4 text-left rounded-lg border border-surface-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                    <ApperIcon name={action.icon} size={18} className="text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-surface-900 group-hover:text-primary-700">
                      {action.title}
                    </h3>
                    <p className="text-sm text-surface-600 mt-1">
                      {action.description}
                    </p>
                  </div>
                  <ApperIcon name="ArrowRight" size={16} className="text-surface-400 group-hover:text-primary-600 transition-colors" />
                </div>
              </motion.button>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <ApperIcon name="Activity" size={20} className="text-primary-600" />
              <h2 className="text-lg font-semibold text-surface-900">Recent Activity</h2>
            </div>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-surface-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <ApperIcon name={activity.icon} size={14} className="text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-surface-900">{activity.message}</p>
                  <p className="text-xs text-surface-500 mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ApperIcon name="TrendingUp" size={20} className="text-primary-600" />
            <h2 className="text-lg font-semibold text-surface-900">Performance Overview</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              Last 7 days
            </Button>
            <Button variant="ghost" size="sm">
              Last 30 days
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-surface-900">89.5%</div>
            <div className="text-sm text-surface-600">Email Deliverability</div>
            <div className="text-xs text-green-600 mt-1">+2.3% from last week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-surface-900">24.7%</div>
            <div className="text-sm text-surface-600">Form Conversion</div>
            <div className="text-xs text-green-600 mt-1">+1.8% from last week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-surface-900">67</div>
            <div className="text-sm text-surface-600">New Leads</div>
            <div className="text-xs text-green-600 mt-1">+12 from last week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-surface-900">$42,350</div>
            <div className="text-sm text-surface-600">Revenue Generated</div>
            <div className="text-xs text-green-600 mt-1">+15.2% from last week</div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default Dashboard;