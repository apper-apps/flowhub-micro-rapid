import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ 
  placeholder = 'Search...', 
  onSearch, 
  className = '',
  showFilters = false,
  filters = [],
  onFilterChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <motion.div
        animate={{ width: isExpanded ? '100%' : 'auto' }}
        className="flex items-center gap-2"
      >
        <div className="relative flex-1">
          <ApperIcon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" 
          />
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onBlur={() => setIsExpanded(false)}
            className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        
        {showFilters && (
          <button
            className="p-2 border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors"
            onClick={() => {/* Filter logic */}}
          >
            <ApperIcon name="Filter" size={16} className="text-surface-600" />
          </button>
        )}
      </motion.div>

      {/* Filter dropdown would go here if showFilters is true */}
    </div>
  );
};

export default SearchBar;