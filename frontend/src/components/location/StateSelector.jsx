import React from 'react';
import Select from '../common/Select';
import { STATES_AND_DISTRICTS } from '../../constants/location';
import { useLanguage } from '../../context/LanguageContext';

export const StateSelector = ({ selectedState, onChange, disabled = false }) => {
  const { language } = useLanguage();

  const options = STATES_AND_DISTRICTS.map((s) => ({
    value: s.state,
    label: language === 'hi' ? `${s.hindi} (${s.state})` : language === 'mr' ? `${s.marathi} (${s.state})` : s.state
  }));

  return (
    <Select
      label="State / राज्य"
      value={selectedState}
      onChange={onChange}
      options={options}
      placeholder="Choose State"
      disabled={disabled}
    />
  );
};

export default StateSelector;
