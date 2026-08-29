import React from 'react';

export const Loading = ({ text = 'Calculating net mandi returns...', fullPage = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 gap-4 text-center">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-emerald-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin"></div>
      </div>
      <p className="text-sm font-medium text-slate-600 animate-pulse">{text}</p>
    </div>
  );

  if (fullPage) {
    return <div className="min-h-[50vh] flex items-center justify-center">{content}</div>;
  }

  return content;
};

export default Loading;