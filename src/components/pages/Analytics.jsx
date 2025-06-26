import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import contactService from '@/services/api/contactService';
import campaignService from '@/services/api/campaignService';
import formService from '@/services/api/formService';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import MetricCard from '@/components/molecules/MetricCard';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalContacts: 0,
      totalCampaigns: 0,
      avgOpenRate: 0,
      avgConversionRate: 0
    },
    contactsChart: {
      series: [],
      options: {}
    },
    campaignChart: {
      series: [],
      options: {}
    },
    conversionChart: {
      series: [],
      options: {}
    }
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30days');

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [contacts, campaigns, forms] = await Promise.all([
        contactService.getAll(),
        campaignService.getAll(),
        formService.getAll()
      ]);

      // Calculate overview metrics
      const totalContacts = contacts.length;
      const totalCampaigns = campaigns.length;
      const avgOpenRate = campaigns.length > 0 
        ? campaigns.reduce((sum, c) => sum + c.openRate, 0) / campaigns.length
        : 0;
      const avgConversionRate = forms.length > 0
        ? forms.reduce((sum, f) => sum + f.conversionRate, 0) / forms.length
        : 0;

      // Prepare contacts by stage chart
      const contactsByStage = contacts.reduce((acc, contact) => {
        acc[contact.stage] = (acc[contact.stage] || 0) + 1;
        return acc;
      }, {});

      const contactsChartData = {
        series: Object.values(contactsByStage),
        options: {
          chart: {
            type: 'donut',
            height: 300
          },
          labels: Object.keys(contactsByStage),
          colors: ['#6366F1', '#8B5CF6', '#EC4899', '#10B981'],
          legend: {
            position: 'bottom'
          },
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }]
        }
      };

      // Prepare campaign performance chart
      const campaignPerformanceData = {
        series: [{
          name: 'Open Rate',
          data: campaigns.map(c => c.openRate)
        }, {
          name: 'Click Rate',
          data: campaigns.map(c => c.clickRate)
        }],
        options: {
          chart: {
            type: 'bar',
            height: 350
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '55%',
            },
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
          },
          xaxis: {
            categories: campaigns.map(c => c.name.substring(0, 15) + '...'),
          },
          yaxis: {
            title: {
              text: 'Percentage (%)'
            }
          },
          fill: {
            opacity: 1
          },
          colors: ['#6366F1', '#8B5CF6'],
          tooltip: {
            y: {
              formatter: function (val) {
                return val + "%"
              }
            }
          }
        }
      };

      // Prepare conversion funnel chart
      const conversionData = {
        series: [{
          name: 'Conversion Rate',
          data: forms.map(f => f.conversionRate)
        }],
        options: {
          chart: {
            type: 'line',
            height: 350
          },
          stroke: {
            curve: 'smooth',
            width: 3
          },
          xaxis: {
            categories: forms.map(f => f.name.substring(0, 15) + '...'),
          },
          yaxis: {
            title: {
              text: 'Conversion Rate (%)'
            }
          },
          colors: ['#EC4899'],
          markers: {
            size: 6,
            colors: ['#EC4899'],
            strokeColors: '#fff',
            strokeWidth: 2,
            hover: {
              size: 8,
            }
          },
          grid: {
            borderColor: '#f1f5f9',
          }
        }
      };

      setAnalyticsData({
        overview: {
          totalContacts,
          totalCampaigns,
          avgOpenRate,
          avgConversionRate
        },
        contactsChart: contactsChartData,
        campaignChart: campaignPerformanceData,
        conversionChart: conversionData
      });
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const dateRangeOptions = [
    { value: '7days', label: 'Last 7 days' },
    { value: '30days', label: 'Last 30 days' },
    { value: '90days', label: 'Last 90 days' },
    { value: '12months', label: 'Last 12 months' }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="h-8 bg-surface-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-surface-200 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-card border border-surface-200 p-6">
              <div className="animate-pulse space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                    <div className="h-6 bg-surface-200 rounded w-1/2 mt-2"></div>
                  </div>
                  <div className="w-10 h-10 bg-surface-200 rounded-lg"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Analytics</h1>
          <p className="text-surface-600 mt-1">Track your performance and gain insights into your marketing efforts.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {dateRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Button variant="outline" icon="Download">
            Export
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Contacts"
          value={analyticsData.overview.totalContacts.toLocaleString()}
          change="+12.5% from last period"
          changeType="positive"
          icon="Users"
          gradient
        />
        <MetricCard
          title="Active Campaigns"
          value={analyticsData.overview.totalCampaigns.toString()}
          change="+2 this week"
          changeType="positive"
          icon="Mail"
        />
        <MetricCard
          title="Avg. Open Rate"
          value={`${analyticsData.overview.avgOpenRate.toFixed(1)}%`}
          change="+3.2% from last period"
          changeType="positive"
          icon="MailOpen"
        />
        <MetricCard
          title="Avg. Conversion"
          value={`${analyticsData.overview.avgConversionRate.toFixed(1)}%`}
          change="+1.8% from last period"
          changeType="positive"
          icon="Target"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contacts by Stage */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <ApperIcon name="Users" size={20} className="text-primary-600" />
            <h2 className="text-lg font-semibold text-surface-900">Contacts by Stage</h2>
          </div>
          <div className="h-80">
            <Chart
              options={analyticsData.contactsChart.options}
              series={analyticsData.contactsChart.series}
              type="donut"
              height="100%"
            />
          </div>
        </Card>

        {/* Campaign Performance */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <ApperIcon name="BarChart3" size={20} className="text-primary-600" />
            <h2 className="text-lg font-semibold text-surface-900">Campaign Performance</h2>
          </div>
          <div className="h-80">
            <Chart
              options={analyticsData.campaignChart.options}
              series={analyticsData.campaignChart.series}
              type="bar"
              height="100%"
            />
          </div>
        </Card>
      </div>

      {/* Form Conversion Rates */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <ApperIcon name="TrendingUp" size={20} className="text-primary-600" />
          <h2 className="text-lg font-semibold text-surface-900">Form Conversion Rates</h2>
        </div>
        <div className="h-80">
          <Chart
            options={analyticsData.conversionChart.options}
            series={analyticsData.conversionChart.series}
            type="line"
            height="100%"
          />
        </div>
      </Card>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <ApperIcon name="Clock" size={20} className="text-primary-600" />
            <h2 className="text-lg font-semibold text-surface-900">Best Times to Send</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-surface-50 rounded-lg">
              <span className="text-sm font-medium">Tuesday, 10:00 AM</span>
              <span className="text-sm text-primary-600">42.3% open rate</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-surface-50 rounded-lg">
              <span className="text-sm font-medium">Thursday, 2:00 PM</span>
              <span className="text-sm text-primary-600">38.7% open rate</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-surface-50 rounded-lg">
              <span className="text-sm font-medium">Friday, 11:00 AM</span>
              <span className="text-sm text-primary-600">35.2% open rate</span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-6">
            <ApperIcon name="Trophy" size={20} className="text-primary-600" />
            <h2 className="text-lg font-semibold text-surface-900">Top Performing Content</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-surface-50 rounded-lg">
              <span className="text-sm font-medium">Welcome Series Email #1</span>
              <span className="text-sm text-green-600">89.2% open rate</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-surface-50 rounded-lg">
              <span className="text-sm font-medium">Product Demo Follow-up</span>
              <span className="text-sm text-green-600">67.8% open rate</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-surface-50 rounded-lg">
              <span className="text-sm font-medium">Case Study Newsletter</span>
              <span className="text-sm text-green-600">54.3% open rate</span>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default Analytics;