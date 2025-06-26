const SkeletonLoader = ({ count = 1, type = 'card', className = '' }) => {
  const skeletonTypes = {
    card: (
      <div className="bg-white rounded-lg shadow-card border border-surface-200 p-6">
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
    ),
    list: (
      <div className="bg-white rounded-lg shadow-card border border-surface-200 p-4">
        <div className="animate-pulse flex items-center space-x-4">
          <div className="w-10 h-10 bg-surface-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-surface-200 rounded w-1/2"></div>
            <div className="h-3 bg-surface-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    ),
    table: (
      <div className="bg-white rounded-lg shadow-card border border-surface-200">
        <div className="animate-pulse">
          <div className="px-6 py-4 border-b border-surface-200">
            <div className="h-4 bg-surface-200 rounded w-1/4"></div>
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="px-6 py-4 border-b border-surface-200 last:border-b-0">
              <div className="flex items-center space-x-4">
                <div className="h-3 bg-surface-200 rounded w-1/4"></div>
                <div className="h-3 bg-surface-200 rounded w-1/6"></div>
                <div className="h-3 bg-surface-200 rounded w-1/5"></div>
                <div className="h-3 bg-surface-200 rounded w-1/8"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, index) => (
        <div key={index}>
          {skeletonTypes[type]}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;