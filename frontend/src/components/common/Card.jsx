import React from 'react';

export const Card = ({
  children,
  className = '',
  highlight = false,
  onClick,
  hoverable = false,
  padding = 'p-5',
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl bg-white border transition-all duration-200 ${padding} ${
        highlight
          ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-500/5 bg-gradient-to-b from-emerald-50/30 to-white'
          : 'border-slate-200 shadow-sm'
      } ${hoverable ? 'hover:border-slate-300 hover:shadow-md cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;