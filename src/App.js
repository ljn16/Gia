import React, { useState } from 'react';
/* COMPONENTS */
import FileUploader from './components/FileUploader'; 
import FeatureSelector from './components/FeatureSelector'; 
import NeuralNetworkBuilder from './components/NeuralNetworkBuilder';



const App = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);


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
        <FeatureSelector
          columns={columns}                       // Pass these 3 props to the FeatureSelector component
          selectedFeatures={selectedFeatures}       
          setSelectedFeatures={setSelectedFeatures} 
        />
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
        />
      )}
    </div>
  );
};

export default App;