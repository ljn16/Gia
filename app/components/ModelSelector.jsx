import React from 'react';
import Select from 'react-select';

const ModelSelector = ({setMlModel}) => {   
    const options = [
        { value: 'linear_regression', label: 'Linear Regression', isDisabled: true },
        { value: 'decision_tree', label: 'Decision Tree', isDisabled: true },
        { value: 'random_forest', label: 'Random Forest', isDisabled: true },
        { value: 'neural_network', label: 'Neural Network', isDisabled: false },
    ];

    const handleChange = (selectedOption) => {
        setMlModel(selectedOption.value);
    };

  return (
    <>
        <br/>
            <Select 
                options={options} 
                placeholder='Select a Model Type' 
                onChange={handleChange} 
            />
    </>
  );
};
 export default ModelSelector;