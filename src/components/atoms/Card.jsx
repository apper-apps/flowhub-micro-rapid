import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  gradient = false,
  padding = 'default',
  ...props 
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8'
  };

  const baseClasses = `
    bg-white rounded-lg shadow-card border border-surface-200
    ${gradient ? 'gradient-primary text-white' : ''}
    ${paddingClasses[padding]}
    ${className}
  `;

  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -2, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)' }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={baseClasses}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;