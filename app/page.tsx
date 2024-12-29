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
  //  ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   *** 
//
//
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
    // TODO: make model specific
    tree : {
      randomForest : {
        maxLeafs: 10
      }
    },
    nn : {
      epochs: 10,
      layers: [
        {
          // Creation
          units: 16,
          activation: "relu",
        },
      ],
    },

    imputer: "mean", // Preprocessing

    loss: "meanSquaredError", // Compilation
    optimizer: "adam",
    batchSize: 32, // Training
  });



  useEffect(() => {
    if (DB.length > 0) {            // Check if DB has been loaded
      setVars(Object.keys(DB[0]));    // Extract the column names from the first row of the DB
    }
  }, [DB]); // Re-run whenever the DB changes

  //
  //
  //
  const handleBEreq = async () => {
    try {
      const response = await axios.post('/api/train-tree', {DB, X, y});
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  //! ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   *** 
  return (
    <>
      <Nav />
      <button onClick={handleBEreq} className="border bg-red-600 text-white rounded p-5">BE test</button>

      <div className="p-[20px]">
        <div className={`p-5 ${DB.length > 0 ? "bg-green-100" : "bg-gray-100"}`}>
          <FileUploader DB={DB} setDB={setDB} />
          <ModelSelector setMlModel={setMlModel} />
        </div>


        {/* //? -------------------------------------- DECISION TREE Model --------------------------------------   */}
        {/* RENDER <selector> <options> when CSV uploaded */}
        {mlModel === "decision_tree" && vars.length > 0 && (
          <>
            <FeatureSelector DB={DB} vars={vars} X={X} setX={setX} y={y} sety={sety}/>
            <AdvancedOptions settings={settings} setSettings={setSettings} />
            {/* <AdvancedOptionsML settings={settingsML} setSettings={setSettingsML} /> */}
          </>
        )}
        {/* RENDER <model> when label (X) is selected */}
        {X.length > 1 && ( 
          <DecisionTree DB={DB} setDB={setDB} X={X} setX={setX} y={y} sety={sety} advancedOptions={settings} trainingLog={trainingLog} setTrainingLog={setTrainingLog} hasTrained={hasTrained} setHasTrained={setHasTrained} downloadedModel={downloadedModel} setDownloadedModel={setDownloadedModel} loss={loss} setLoss={setLoss}/>
        )}

        {/* //? -------------------------------------- NEURAL NETWORK Model --------------------------------------  */}
        {/* RENDER <selector> <options> when CSV uploaded */}
        {mlModel === "neural_network" && vars.length > 0 && ( 
          <>
            <FeatureSelector DB={DB} vars={vars} X={X} setX={setX} y={y} sety={sety} />
            <AdvancedOptions settings={settings} setSettings={setSettings} />
          </>
        )}
        {/* RENDER <model> when label (X) is selected */}
        {X.length > 1 && ( 
          <NeuralNetworkBE DB={DB} setDB={setDB} X={X} setX={setX} y={y} sety={sety} advancedOptions={settings} trainingLog={trainingLog} setTrainingLog={setTrainingLog} hasTrained={hasTrained} setHasTrained={setHasTrained} downloadedModel={downloadedModel} setDownloadedModel={setDownloadedModel}/>
        )}
      </div>

      {/* 
       */}
       {/* 
        */}

      <Train />
      <Predict />

    </>
  );

  // return (
  //   <>
  //     <Nav />
  //     <div className="p-[20px]">
  //       <Train />
  //       <Predict />
  //     </div>
  //   </>
  // );
}
