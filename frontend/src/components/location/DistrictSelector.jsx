import React from 'react';
import Select from '../common/Select';
import { getDistrictsByState } from '../../services/locationService';

export const DistrictSelector = ({ selectedState, selectedDistrict, onChange, disabled = false }) => {
  const districts = getDistrictsByState(selectedState);

  const options = districts.map((d) => ({
    value: d.name,
    label: `${d.name} (${d.hub})`
  }));

  return (
    <Select
      label="District / जिला / जिल्हा"
      value={selectedDistrict}
      onChange={onChange}
      options={options}
      placeholder="Choose District"
      disabled={disabled || !selectedState}
    />
  );
};

export default DistrictSelector;