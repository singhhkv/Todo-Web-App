export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variantClasses = {
    default: 'bg-dark-700 text-gray-300 border border-white/5',
    low: 'bg-accent-green/10 text-accent-green border border-accent-green/20',
    medium: 'bg-accent-orange/10 text-accent-orange border border-accent-orange/20',
    high: 'bg-red-500/10 text-red-400 border border-red-500/20',
    success: 'bg-accent-green/10 text-accent-green border border-accent-green/20',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
