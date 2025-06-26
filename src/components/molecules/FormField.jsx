import Input from '@/components/atoms/Input';

const FormField = ({ 
  type = 'text', 
  label, 
  error, 
  icon,
  options = [],
  ...props 
}) => {
  if (type === 'select') {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-surface-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            className={`
              w-full px-3 py-2 border rounded-lg bg-white text-surface-900
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              transition-all duration-200
              ${error ? 'border-red-300 focus:ring-red-500' : 'border-surface-300'}
            `}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value || option} value={option.value || option}>
                {option.label || option}
              </option>
            ))}
          </select>
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-surface-700 mb-2">
            {label}
          </label>
        )}
        <textarea
          className={`
            w-full px-3 py-2 border rounded-lg bg-white text-surface-900 placeholder-surface-400
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            transition-all duration-200 resize-vertical
            ${error ? 'border-red-300 focus:ring-red-500' : 'border-surface-300'}
          `}
          rows={4}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }

  return <Input type={type} label={label} error={error} icon={icon} {...props} />;
};

export default FormField;