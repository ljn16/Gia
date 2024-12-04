import React, { useState } from 'react';
/* COMPONENTS */
import FileUploader from './components/FileUploader'; 
import FeatureSelector from './components/FeatureSelector'; 
import NeuralNetworkBuilder from './components/NeuralNetworkBuilder';
// import AdvancedOptions from './components/advancedOptions';



const App = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  /* //TODO: Advanced Options... */     
      //TODO: move to seperate component
  /* PREPROCESS */
  //const [imputer, setImputer] = useState('mean');
  /* CREATE */
  // const [layers, setLayers] = useState(1);
    // const [units, setUnits] = useState(16);
    // const [activation, setActivation] = useState('relu');
  /* COMPILE */
  // const [loss, setLoss] = useState('meanSquaredError');
  // const [optimizer, setOptimizer] = useState('adam');
  /* TRAIN */
  const [epochs, setEpochs] = useState(10);

  const handleEpochsChange = (e) => {
    setEpochs(e.target.value);
  };
  /* ...END Advanced Options */

  React.useEffect(() => {               
    if (data.length > 0) {                // Check if data has been loaded
      setColumns(Object.keys(data[0]));     // Extract the column names from the first row of the data
    }
  }, [data]);                             // Re-run this effect whenever the data changes

    // const inputFeatures=selectedFeatures.slice(0, -1); 
    // const outputFeature=selectedFeatures[selectedFeatures.length - 1];
    // const inputs = data.map((row) => inputFeatures.map((feature) => parseFloat(row[feature])));         // Extract the input features from the data
    // const outputs = data.map((row) => [parseFloat(row[outputFeature])]);                                // Extract the output feature from the data


  //! ***
  return (
    <div className='p-[20px]'>
      <h1>CSV Neural Network Trainer</h1>
      <FileUploader setData={setData} />  {/* Pass the setData function as a prop to FileUploader */}

      
      {columns.length > 0 && (          //* Only render the FeatureSelector if columns have been loaded
        <>
          <FeatureSelector
            columns={columns}                       // Pass these 3 props to the FeatureSelector component
            selectedFeatures={selectedFeatures}       
            setSelectedFeatures={setSelectedFeatures} 
          />
          {/*********** TODO: integrate advanced options below into seperate component ***********/}
          
          <div className='my-4'>
            <label htmlFor='epochs' className='block text-sm font-medium text-gray-700'>
              Number of Epochs
            </label>
            <input
              type='number'
              id='epochs'
              name='epochs'
              value={epochs}
              onChange={handleEpochsChange}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            />
          </div>
          
        </>
      )}



      <ul className='list-disc pl-10'>
        <li className='text-gray-400'>input features: {selectedFeatures.slice(0, -1).join(', ')}</li>
        <li className='text-red-300'>output feature: {selectedFeatures[selectedFeatures.length - 1]}</li>
        <br/>
        <li></li>
      </ul>

      {selectedFeatures.length > 1 && ( //* Only render the NeuralNetworkBuilder if at least two features have been selected
        <NeuralNetworkBuilder
          data={data}                                                       // pass these 3 props to the NeuralNetworkBuilder component
          inputFeatures={selectedFeatures.slice(0, -1)}                     // inputFeatures is an array of all but the last selected feature
          outputFeature={selectedFeatures[selectedFeatures.length - 1]}     // outputFeature is the last selected feature
          epochs={epochs}
        />
      )}
    </div>
  );
};

export default App;