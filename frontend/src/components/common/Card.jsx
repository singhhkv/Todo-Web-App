export const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={`glass-panel ${hover ? 'glass-panel-hover cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
