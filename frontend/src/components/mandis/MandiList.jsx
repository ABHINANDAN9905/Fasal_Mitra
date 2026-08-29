import React from 'react';
import MandiCard from './MandiCard.jsx';

export default function MandiList({
  results = [],
  onExplain,
  onViewDetails,
  onShareWhatsApp
}) {
  if (!results || results.length === 0) return null;


  return (
    <div className="space-y-6">
      {/* Dynamic Grid of Mandi Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {results.map((result, index) => (
          <MandiCard
            key={result.id || result.mandi?.id || index}
            result={result}
            rank={index + 1}
            isTopChoice={index === 0}
            onExplain={onExplain}
            onViewDetails={onViewDetails}
            onShareWhatsApp={onShareWhatsApp}
          />
        ))}
      </div>
    </div>
  );
}