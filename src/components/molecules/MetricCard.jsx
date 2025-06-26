import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'positive',
  icon, 
  gradient = false,
  className = '' 
}) => {
  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-surface-500'
  };

  const changeIcons = {
    positive: 'TrendingUp',
    negative: 'TrendingDown',
    neutral: 'Minus'
  };

  return (
    <Card 
      hover 
      gradient={gradient} 
      className={`${gradient ? 'text-white' : ''} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${gradient ? 'text-white/80' : 'text-surface-600'}`}>
            {title}
          </p>
          <p className={`text-2xl font-bold mt-1 ${gradient ? 'text-white' : 'text-surface-900'}`}>
            {value}
          </p>
          {change && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${gradient ? 'text-white/90' : changeColors[changeType]}`}>
              <ApperIcon name={changeIcons[changeType]} size={14} />
              {change}
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-2 rounded-lg ${gradient ? 'bg-white/20' : 'bg-primary-100'}`}>
            <ApperIcon 
              name={icon} 
              size={20} 
              className={gradient ? 'text-white' : 'text-primary-600'} 
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default MetricCard;