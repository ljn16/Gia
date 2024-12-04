import React from 'react';
import Select from 'react-select';

const FeatureSelector = ({ columns, selectedFeatures, setSelectedFeatures }) => {   //* FeatureSelector component | ACCEPTS: columns, selectedFeatures, and setSelectedFeatures props
  const handleChange = (selected) => {                                  // CB that runs when the user makes a selection
    setSelectedFeatures(selected.map((option) => option.value));           // Update the selected features when the user makes a selection
  };

  const options = columns.map((col) => ({ value: col, label: col }));   // Convert the columns to an array of objects with value and label properties

  //! ***
  return (
    <div>
      <h3>Select Features</h3>
      <Select   
        options={options}               // Pass the options
        isMulti                         // Allow multiple selections
        onChange={handleChange}         // Pass the handleChange function
        placeholder="Select features for the model..."  
      />
    </div>
  );
};

export default FeatureSelector;
