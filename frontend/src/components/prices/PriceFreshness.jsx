import React from 'react';
import { getFreshnessLabel } from '../../utils/priceUtils.js';
import Badge from '../common/Badge.jsx';
import { Clock } from 'lucide-react';

import { useLanguage } from '../../context/LanguageContext.jsx';

export default function PriceFreshness({ result, dateStr, lang }) {
  const { language } = useLanguage();
  const currentLang = lang || language;

  const targetDate = dateStr || result?.arrival_date || result?.lastUpdated;
  const { label, labelHi, color } = getFreshnessLabel(targetDate);

  const displayLabel = currentLang === 'hi' && labelHi ? labelHi : label;

  return (
    <Badge variant={color === 'warning' ? 'warning' : color === 'info' ? 'info' : 'success'} size="sm" className="gap-1 shadow-2xs">
      <Clock className="w-3 h-3" />
      <span>{displayLabel}</span>
    </Badge>
  );
}