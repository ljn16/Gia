import React from 'react';
import Select from 'react-select';

const FeatureSelector = ({ DB, vars, X, setX, y, sety }) => {   //* FeatureSelector component | ACCEPTS: vars, selectedFeatures, and setSelectedFeatures props
  

  const handleChange = (selected) => {                                  // CB: that runs when the user makes a selection
    setX(selected.map((option) => option.value));           // Update the selected features when the user makes a selection
  };
  const handleLabelChange = (selected) => {                                  // CB: that runs when the user makes a selection
    sety(selected ? [selected.value] : []);           // Update the selected label when the user makes a selection
  };

  const options = vars.map((col) => ({ value: col, label: col }));   // Convert the vars to an array of objects with value and label properties

  //! ***

  return (
    <div className='my-5'>

      <div className='flex flex-wrap justify-center items-center '>
        <div className="flex flex-wrap justify-center">
          {vars.map((col, index) => (
      <div key={index} className={`border p-2 m-2 rounded-sm shadow-sm ${X.includes(col) ? 'border-gray-200 bg-gray-100' : ''} ${y.includes(col) ? 'border-orange-200 text-orange-700 bg-orange-100' : ''}`}>
        {col}
            </div>
          ))}
        </div>
      </div>
      <hr className='mx-5 border-dotted'/>
      <div className='flex justify-center items-center'>
        <div className='flex justify-center items-center mt-4 p-2 border'>
          <div className='flex flex-col mr-5 items-center'>
            <h3><span className='font-semibold'>Features</span> <span className='text-gray-400'>(independent)</span></h3>
            <Select   
              className='w-fit'
              options={options}               
              isMulti                         
              onChange={handleChange}         
              placeholder="Select at least 2 features..."  
              isOptionDisabled={(option) => y.includes(option.value)}
              styles={{
                option: (provided, state) => ({
                    ...provided,
                    cursor: 'pointer',
                  ...(state.isSelected && { border: '1px solid #FDBA74', color: '#C2410C', backgroundColor: '#FFEDD5' }),
                }),
                control: (provided) => ({
                    ...provided,
                    cursor: 'pointer',
                }),
            }}
            />
          </div>
          <div className='flex flex-col mr-5 items-center '>
            <h3><span className='font-semibold '>Label </span><span className='text-gray-400'>(dependent)</span></h3>
            <Select  
              className='w-fit ' 
              options={options}                       
              isMulti={false}                                 
              onChange={handleLabelChange}            
              placeholder="Select a label..."  
              value={options.filter(option => y.includes(option.value))}
              isOptionDisabled={(option) => X.includes(option.value)}
              styles={{
                option: (provided, state) => ({
                    ...provided,
                    cursor: 'pointer',
                  ...(state.isSelected && { border: '1px solid #FDBA74', color: '#C2410C', backgroundColor: '#FFEDD5' }),
                }),
                control: (provided) => ({
                    ...provided,
                    cursor: 'pointer',
                }),
            }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default FeatureSelector;
