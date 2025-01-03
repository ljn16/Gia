"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Nav from "./components/Nav";
import FileUploader from "./components/FileUploader";
import FeatureSelector from "./components/FeatureSelector";
import AdvancedOptions from "./components/subcomponents/advancedOptions";
import AdvancedOptionsML from "./components/subcomponents/advancedOptionsML";
import ModelSelector from "./components/ModelSelector";
import NeuralNetworkBE from "./components/models/NeuralNetworkBE";
import DecisionTree from './components/models/DecisionTree';

import Train from "./components/Train";
import Predict from "./components/Predict";
import PredictField from "./components/PredictField";
import Settings from "./components/subcomponents/Settings";
//  ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   *** 

export default function Home() {

  const [DB, setDB] = useState([]);
  const [mlModel, setMlModel] = useState("decision_tree");
  const [downloadedModel, setDownloadedModel] = useState(null);
  const [loss, setLoss] = useState(null);
  const [vars, setVars] = useState<string[]>([]);
  const [hasTrained, setHasTrained] = useState(false);
  const [trainingLog, setTrainingLog] = useState([]);
  const [X, setX] = useState([]);
  const [y, sety] = useState([]);
  const [settings, setSettings] = useState({
    imputer: "mean",              // Preprocessing
    loss: "mean_squared_error",   // Compilation
    tree : {
      maxLeafNodes: 2,
      useRandomForest: false,
      randomForest : {
        nEstimators: 100
        // maxSamples: 0.5,
        // maxFeatures: 0.5,
      }
    },
    //
    nn : {
      epochs: 10,
      layers: [                   // Creation
        {
          units: 16,
          activation: "relu",
        },
      ],
      optimizer: "adam",
      batchSize: 32,              // Training
    },
  });

  useEffect(() => {
    if (DB.length > 0) {            // IF DB has been loaded...
      setVars(Object.keys(DB[0]));    // ...extract the column names from the first row of the DB
      setSettings((prevSettings) => ({
        ...prevSettings,
        tree: {
          ...prevSettings.tree,
          maxLeafNodes: (Math.floor(DB.length / 2)),
        },
      }));
    }
  }, [DB]); // Re-run when DB changes

  useEffect(() => {
    setHasTrained(false);
  }, [X, y]); // Re-run when X or y changes

  const handleBEreq = async () => {
    try {
      const response = await axios.post('/api/train-tree', {DB, X, y, settings});   /* POST */
      console.log('loss: ', response.data.loss);
      setLoss(response.data.loss);
      setHasTrained(true);
    } catch (error) {console.error(error);}
  }
  //! ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   *** 
   
  return (
    <>
      <Nav />

      <div className="px-5">
        <ModelSelector setMlModel={setMlModel}/>
        
        <div className={`p-5 ${DB.length > 0 ? "bg-green-100" : "bg-gray-100"}`}>
          <FileUploader DB={DB} setDB={setDB} setSettings={setSettings} settings={settings}/>
        </div>

        {mlModel === "decision_tree" && vars.length > 0 && (   /* RENDER <selector> <options> when CSV uploaded */
          <>
            <div className="flex justify-center w-full h-full my-5 p-5 shadow-lg">
              <div className=''>
                <FeatureSelector DB={DB} vars={vars} X={X} setX={setX} y={y} sety={sety}/>
                
                {X.length > 1 && y.length > 0 && (
                  <div className="w-full flex justify-center p-5">
                    <button onClick={handleBEreq} className={`border ${hasTrained ? "opacity-50" : ""} bg-orange-400 text-white rounded p-5 w-1/4`}>{!hasTrained ? "Train Model" : "Model Trained"}</button>
                    {loss !== null && <p className="text-gray-400 ml-5">loss = {loss}</p>}
                  </div>
                )}
              </div>

              <Settings settings={settings} setSettings={setSettings} mlModel={mlModel} setMlModel={setMlModel}/>
              {/* <AdvancedOptions  settings={settings} setSettings={setSettings} /> */}
            </div>

            {hasTrained && (
            <div className="p-5 bg-gray-100 my-5 flex flex-col items-center">
              <PredictField X={X} y={y} hasTrained={hasTrained}/>
            </div>
            )}
          </>
        )}



      </div>
    </>
  );
  //! ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***    ***   ***   ***   ***
}

{/* //? NEURAL NETWORK Model --------------------------------------  */}
{/* //? DECISION TREE Model --------------------------------------   */}