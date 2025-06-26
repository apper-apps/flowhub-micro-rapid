import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen flex items-center justify-center p-6"
    >
      <div className="text-center max-w-md">
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            y: [0, -20, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <ApperIcon name="AlertTriangle" size={40} className="text-primary-600" />
        </motion.div>
        
        <h1 className="text-6xl font-bold text-surface-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-surface-700 mb-4">Page Not Found</h2>
        <p className="text-surface-600 mb-8">
          Sorry, the page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate(-1)} variant="outline" icon="ArrowLeft">
            Go Back
          </Button>
          <Button onClick={() => navigate('/')} icon="Home">
            Go Home
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default NotFound;