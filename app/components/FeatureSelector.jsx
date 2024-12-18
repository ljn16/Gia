import React from 'react';
import Select from 'react-select';

const FeatureSelector = ({ DB, vars, X, setX, y, sety }) => {   //* FeatureSelector component | ACCEPTS: vars, selectedFeatures, and setSelectedFeatures props
  const handleChange = (selected) => {                                  // CB: that runs when the user makes a selection
    setX(selected.map((option) => option.value));           // Update the selected features when the user makes a selection

  };
  const handleLabelChange = (selected) => {                                  // CB: that runs when the user makes a selection
    sety(selected.map((option) => option.value));           // Update the selected features when the user makes a selection
  };

  const options = vars.map((col) => ({ value: col, label: col }));   // Convert the vars to an array of objects with value and label properties

  //! ***
  const handleColumnClick = (col) => {
    // handleChange([{ value: col, label: col }]);
    setX((prevFeatures) => {
      if (prevFeatures.includes(col)) {
        return prevFeatures.filter((feature) => feature !== col);
      } else {
        return [...prevFeatures, col];
      }     
    });
  };

  const handleDoubleClick = (col) => {
    sety((prevy) => {
      if (prevy.includes(col)) {
        return prevy.filter((label) => label !== col);
      } else {
        return [...prevy, col];
      }
    });
  }

  return (
    <div className=''>
      <label className='font-semibold'>Columns ({vars.length})</label>
      <button 
        onClick={() => setX([])} 
        className='ml-2 px-1 bg-red-500 text-white text-sm rounded-l'
      >
        Remove All
      </button>
      <button 
        onClick={() => setX(vars)} 
        className=' px-1 bg-green-500 text-white text-sm rounded-r'
      >
        Add All
      </button>

      <div className='flex flex-wrap'>
        {vars.map((col, index) => (
          <div 
            key={index} 
            className={`border p-2 m-1  ${X.includes(col) ? 'bg-gray-300' : ''} ${y.includes(col) ? 'bg-red-300' : ''}`} 
            // onClick={() => handleColumnClick(col)}
            // onDoubleClick={() => handleDoubleClick(col)}
            // style={{ backgroundColor: X.includes(col) ? 'light-gray' : y.includes(col) ? 'red' : 'inherit' }}
          >
            {col/*  + ' (' + typeof col + ')' */} {/* TODO: add column type (must unconvert from all str) */}
          </div>
        ))}
      </div>

      <h3><span className='font-semibold'>Select Features</span> <span className='text-gray-400'>(independent variables)</span></h3>
      <Select   
        className='w-fit'
        options={options}               // Pass the options
        isMulti                         // Allow multiple selections
        onChange={handleChange}         // Pass the handleChange function
        placeholder="Select at least 2 features..."  
        isOptionDisabled={(option) => y.includes(option.value)}

      />
      <h3><span className='font-semibold'>Select Label </span><span className='text-gray-400'>(dependent variable)</span></h3>
      <Select  
        className='w-fit' 
        options={options}               // Pass the options
        isMulti                         // Allow multiple selections
        onChange={handleLabelChange}         // Pass the handleChange function
        placeholder="Select at least 1 label..."  
        value={options.filter(option => y.includes(option.value))}
        isOptionDisabled={(option) => X.includes(option.value)}
      />
    </div>
  );
};

export default FeatureSelector;
