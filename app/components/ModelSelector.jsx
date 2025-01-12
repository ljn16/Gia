import React from 'react';

const ModelSelector = ({ setMlModel }) => {   
    const options = [
        { value: 'decision_tree', label: 'Decision Tree' },
        { value: 'neural_network', label: 'Neural Network' },
    ];

    return (
    <>
        <br/>
        <div className='flex items-center mb-5'>
            <h1 className="font-bold">Model</h1>
                <select
                    className='flex-grow pl-1'
                    onChange={(e) => setMlModel(e.target.value)}
                    defaultValue='decision_tree'
                    style={{ cursor: 'pointer' }}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
        </div>
    </>
    );
};

 export default ModelSelector;
