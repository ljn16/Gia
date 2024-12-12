import React, { useState, useEffect } from 'react';
/* COMPONENTS */
import Nav from './components/Nav';
import FileUploader from './components/FileUploader'; 
import FeatureSelector from './components/FeatureSelector'; 
import NeuralNetworkBuilder from './components/NeuralNetworkBuilder';
import AdvancedOptions from './components/advancedOptions';


const App = () => {
  const [DB, setDB] = useState([]);
  const [predictDB, setPredictDB] = useState([]);
  const [vars, setVars] = useState([]);

  const [X, setX] = useState([]);
  const [y, sety] = useState([]);

  const [settings, setSettings] = useState({
    imputer: "mean",      // Preprocessing
    layers: [{            // Creation
      units: 32, 
      activation: "relu" 
    }], 
    loss: "mse",          // Compilation
    optimizer: "adam",
    batchSize: 32,        // Training
    epochs: 10,
  });
  
  const [hasTrained, setHasTrained] = useState(false);
  

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
  // const [epochs, setEpochs] = useState(10);

  // const handleEpochsChange = (e) => {
  //   setSettings({ ...settings, epochs: e.target.value });
  // };
  /* ...END Advanced Options */

  useEffect(() => {               
    if (DB.length > 0) {                // Check if DB has been loaded
      setVars(Object.keys(DB[0]));     // Extract the column names from the first row of the DB
    }
  }, [DB]);                             // Re-run this effect whenever the DB changes

    // const inputFeatures=selectedFeatures.slice(0, -1); 
    // const outputFeature=selectedFeatures[selectedFeatures.length - 1];
    // const inputs = DB.map((row) => inputFeatures.map((feature) => parseFloat(row[feature])));         // Extract the input features from the DB
    // const outputs = DB.map((row) => [parseFloat(row[outputFeature])]);                                // Extract the output feature from the DB


  //! ***
  return (
    <>
      <Nav />
      <div className='p-[20px]'>
        <h1 className='font-bold'>Train Neural Network</h1>
        <FileUploader setDB={setDB} />  {/* Pass the setDB function as a prop to FileUploader */}

        
        {vars.length > 0 && (          //* Only render the FeatureSelector if vars have been loaded
          <>
            <FeatureSelector
              vars={vars}                       
              X={X}
              setX={setX}
              y={y}
              sety={sety}
            />             

            <ul className='pl-5'>
              <li className='TOOLTIP text-gray-400 relative group w-fit cursor-help'>
                features: {X.join(', ')}
                <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-sm rounded px-2 py-1 text-center">
                  independent variable(s) (input)
                </div>
              </li>
              <li className='TOOLTIP text-red-300 relative group w-fit cursor-help'>
                label: {y.join(', ')}
                <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-sm rounded px-2 py-1 text-center">
                  dependent variable(s) (output)
                </div>
              </li>
            </ul>
            <AdvancedOptions 
              settings={settings} 
              setSettings={setSettings} 
            />
          </>
        )}





        {X.length > 1 && ( //* Only render the NeuralNetworkBuilder if at least two features have been selected
          <NeuralNetworkBuilder
            DB={DB} 
            X={X}                                                      // pass these 3 props to the NeuralNetworkBuilder component
            y={y}     // outputFeature is the last selected feature
            // epochs={settings.epochs}
            advancedOptions={settings}
            hasTrained={hasTrained}
            setHasTrained={setHasTrained}
          />
        )}

        
        {hasTrained && ( //* Only render the NeuralNetworkBuilder if at least two features have been selected
          <>
            <h1 className='font-bold'>Predict Data</h1>
            <FileUploader setPredictDB={setPredictDB}/>
          </>
        )}


      </div>

    </>


  );
};

export default App;