import React from 'react';
import Select from 'react-select';

const ModelSelector = ({setMlModel}) => {   
    const options = [
        // { value: 'linear_regression', label: 'Linear Regression', isDisabled: true },
        { value: 'decision_tree', label: 'Decision Tree', isDisabled: false },
        // { value: 'random_forest', label: 'Random Forest', isDisabled: true },
        { value: 'neural_network', label: 'Neural Network', isDisabled: false },
    ];

    const handleChange = (selectedOption) => {
        setMlModel(selectedOption.value);
    };

  return (
    <>
        <br/>
        <div className='flex items-center mb-5'>
            <h1 className="font-bold">Model</h1>
            <Select className='flex-grow pl-1'
                options={options} 
                placeholder='Select a Model Type' 
                onChange={handleChange} 
                defaultValue={options.find(option => option.value === 'decision_tree')}
                styles={{
                    option: (provided) => ({
                        ...provided,
                        cursor: 'pointer',
                    }),
                    control: (provided) => ({
                        ...provided,
                        cursor: 'pointer',
                    }),
                }}
            />
        </div>
    </>
  );
};
 export default ModelSelector;