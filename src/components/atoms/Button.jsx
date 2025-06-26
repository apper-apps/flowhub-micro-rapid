import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'gradient-primary text-white hover:shadow-md focus:ring-primary-500 disabled:opacity-50',
    secondary: 'bg-surface-100 text-surface-700 hover:bg-surface-200 focus:ring-surface-500 disabled:opacity-50',
    outline: 'border border-surface-300 text-surface-700 hover:bg-surface-50 focus:ring-surface-500 disabled:opacity-50',
    ghost: 'text-surface-600 hover:text-surface-900 hover:bg-surface-100 focus:ring-surface-500 disabled:opacity-50',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:opacity-50'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20
  };

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <ApperIcon name="Loader2" size={iconSizes[size]} className="animate-spin mr-2" />
          Loading...
        </>
      );
    }

    const iconElement = icon && (
      <ApperIcon 
        name={icon} 
        size={iconSizes[size]} 
        className={iconPosition === 'left' ? 'mr-2' : 'ml-2'} 
      />
    );

    return (
      <>
        {icon && iconPosition === 'left' && iconElement}
        {children}
        {icon && iconPosition === 'right' && iconElement}
      </>
    );
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {renderContent()}
    </motion.button>
  );
};

export default Button;