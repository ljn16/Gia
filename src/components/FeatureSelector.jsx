import React from 'react';
import Select from 'react-select';

const FeatureSelector = ({ columns, selectedFeatures, setSelectedFeatures, features, setFeatures, labels, setLabels }) => {   //* FeatureSelector component | ACCEPTS: columns, selectedFeatures, and setSelectedFeatures props
  const handleChange = (selected) => {                                  // CB: that runs when the user makes a selection
    setSelectedFeatures(selected.map((option) => option.value));           // Update the selected features when the user makes a selection
    setFeatures(selected.map((option) => option.value));           // Update the selected features when the user makes a selection
  };
  const handleLabelChange = (selected) => {                                  // CB: that runs when the user makes a selection
    setLabels(selected.map((option) => option.value));           // Update the selected features when the user makes a selection
  };

  const options = columns.map((col) => ({ value: col, label: col }));   // Convert the columns to an array of objects with value and label properties

  //! ***
  const handleColumnClick = (col) => {
    setFeatures((prevFeatures) => {
      if (prevFeatures.includes(col)) {
        return prevFeatures.filter((feature) => feature !== col);
      } else {
        return [...prevFeatures, col];
      }     
    });
  };

  const handleDoubleClick = (col) => {
    setLabels((prevLabels) => {
      if (prevLabels.includes(col)) {
        return prevLabels.filter((label) => label !== col);
      } else {
        return [...prevLabels, col];
      }
    });
  }

  return (
    <div className='mt-10'>
      <label>Columns ({columns.length})</label>
      {/* <button 
        onClick={() => setFeatures(columns)} 
        className='ml-2 px-1 bg-green-500 text-white rounded-l'
      >
        Add All
      </button>
      <button 
        onClick={() => setFeatures([])} 
        className='px-1 bg-red-500 text-white rounded-r'
      >
        Remove All
      </button> */}
      <div className='flex flex-wrap bg-black'>
        {columns.map((col, index) => (
          <div 
            key={index} 
            className={`border p-2 m-1 cursor-pointer ${features.includes(col) ? 'bg-gray-300' : ''} ${labels.includes(col) ? 'bg-red-300' : ''}`} 
            onClick={() => handleColumnClick(col)}
            onDoubleClick={() => handleDoubleClick(col)}
            // style={{ backgroundColor: labels.includes(col) ? 'red' : 'inherit' }}
          >
            {col/*  + ' (' + typeof col + ')' */} {/* TODO: add column type (must unconvert from all str) */}
          </div>
        ))}
      </div>

      <h3>Select Features <span className='text-gray-400'>(independent variables)</span></h3>
      <Select   
        className='w-fit'
        options={options}               // Pass the options
        isMulti                         // Allow multiple selections
        onChange={handleChange}         // Pass the handleChange function
        placeholder="Select features for the model..."  
      />
      <h3>Select Label <span className='text-gray-400'>(dependent variable)</span></h3>
      <Select  
        className='w-fit' 
        options={options}               // Pass the options
        isMulti                         // Allow multiple selections
        onChange={handleLabelChange}         // Pass the handleChange function
        placeholder="Select features for the model..."  
      />
    </div>
  );
};

export default FeatureSelector;
