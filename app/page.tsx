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
//  ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   *** 

export default function Home() {

  const [DB, setDB] = useState([]);
  const [mlModel, setMlModel] = useState("neural_network");
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
      randomForest : {
        maxLeafs: 10
      }
    },
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
    }
  }, [DB]); // Re-run when DB changes


  const handleBEreq = async () => {
    try {
      const response = await axios.post('/api/train-tree', {DB, X, y, settings});   /* POST */
      console.log('loss: ', response.data.loss);
      setLoss(response.data.loss);
    } catch (error) {console.error(error);}
  }
  //! ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   *** 
   
  return (
    <>
      <Nav />

      <div className="px-5">
        <ModelSelector setMlModel={setMlModel}/>
        
        <div className={`p-5 ${DB.length > 0 ? "bg-green-100" : "bg-gray-100"}`}>
          <FileUploader DB={DB} setDB={setDB} />
        </div>

        {/* //? NEURAL NETWORK Model --------------------------------------  */}
        {mlModel === "neural_network" && vars.length > 0 && (   /* RENDER <selector> <options> when CSV uploaded */
          <>
            <div className="flex justify-center w-full h-full">
              <div className="">
                <FeatureSelector DB={DB} vars={vars} X={X} setX={setX} y={y} sety={sety} />
                
                {X.length > 1 && y.length > 0 && (
                  <div className="w-full flex justify-center p-5 bg-white shadow-md">
                    <button onClick={handleBEreq} className="border bg-orange-400 text-white rounded p-5 w-1/4">Train Model</button>
                    {loss !== null && <p>Loss: {loss}</p>}
                  </div>
                )}
              </div>

                <div className="bg-green-950 h-[100%] w-[10px] "></div>

              <AdvancedOptions  settings={settings} setSettings={setSettings} />
            </div>

            <div className="p-5 bg-gray-100 my-5 flex flex-col items-center">
              <PredictField X={X} y={y} hasTrained={hasTrained}/>
              {/* <h3>OR:</h3>
              <Predict /> */}
            </div>
          </>
        )}
      </div>
    </>
  );
  //! ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***    ***   ***   ***   ***
}
{/* //? DECISION TREE Model --------------------------------------   */}
