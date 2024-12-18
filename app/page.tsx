'use client';
// import Image from "next/image";

import React, { useState, useEffect } from 'react';
/* COMPONENTS */
import Nav from './components/Nav';
import FileUploader from './components/FileUploader'; 
import FeatureSelector from './components/FeatureSelector'; 
import NeuralNetworkBuilder from './components/NeuralNetworkBuilder';
import AdvancedOptions from './components/advancedOptions';
import ModelSelector from './components/ModelSelector';
import NeuralNetworkBE from './components/NeuralNetworkBE'
// import EX from './components/ex'

export default function Home() {
  const [DB, setDB] = useState([]);
  const [mlModel, setMlModel] = useState('neural_network');
  const [downloadedModel, setDownloadedModel] = useState(null);
  // const [predictDB, setPredictDB] = useState([]);
  const [vars, setVars] = useState<string[]>([]);

  const [X, setX] = useState([]);
  const [y, sety] = useState([]);

  const [settings, setSettings] = useState({
    imputer: "mean",      // Preprocessing
    layers: [{            // Creation
      units: 16, 
      activation: "relu" 
    }], 
    loss: "meanSquaredError",          // Compilation
    optimizer: "adam",
    batchSize: 32,        // Training
    epochs: 10,
  });
  
  const [hasTrained, setHasTrained] = useState(false);
  const [trainingLog, setTrainingLog] = useState([]);
  

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
        <h1 className='font-bold'>Upload Dataset</h1>
        <FileUploader setDB={setDB} />  {/* Pass the setDB function as a prop to FileUploader */}
        <ModelSelector setMlModel={setMlModel} />
        


        {mlModel === 'neural_network' && vars.length > 0 && (          //* Render FeatureSelector (if vars have been loaded)
          <>
            <br/> <hr/> <br/>
            <FeatureSelector
              DB={DB}
              vars={vars}                       
              X={X}
              setX={setX}
              y={y}
              sety={sety}
            />             

            <AdvancedOptions 
              settings={settings} 
              setSettings={setSettings} 
            />
          </>
        )}





        {X.length > 1 && ( //* Render NeuralNetworkBuilder (if at least two features have been selected)
          <>
            <NeuralNetworkBE
              DB={DB}
              setDB={setDB}
              X={X}
              setX={setX}
              y={y}
              sety={sety}
              advancedOptions={settings}
              trainingLog={trainingLog}
              setTrainingLog={setTrainingLog}
              hasTrained={hasTrained}
              setHasTrained={setHasTrained}
              downloadedModel={downloadedModel}
              setDownloadedModel={setDownloadedModel}

            />

            {/* <NeuralNetworkBuilder
              DB={DB} 
              X={X}                                                      // pass these 3 props to the NeuralNetworkBuilder component
              y={y}     // outputFeature is the last selected feature
              // epochs={settings.epochs}
              advancedOptions={settings}
              hasTrained={hasTrained}
              setHasTrained={setHasTrained}
            /> */}
          </>



        )}

        
        {hasTrained && ( //* Render NeuralNetworkBuilder (if at least two features have been selected)
          <>
            <h1 className='font-bold'>Predict Data</h1>
          </>
        )}


      </div>
      {/* <EX/> */}
    </>
  );
}
