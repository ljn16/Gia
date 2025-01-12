"use client";
import Image from "next/image";
import Link from "next/link";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Nav from "./components/Nav";
//
//

import FileUploader from "./components/FileUploader";
import FeatureSelector from "./components/FeatureSelector";
import ModelSelector from "./components/ModelSelector";
import NeuralNetworkBE from "./components/models/NeuralNetworkBE";
import DecisionTree from './components/models/DecisionTree';

import Train from "./components/Train";
import Predict from "./components/Predict";
import PredictField from "./components/PredictField";
import Settings from "./components/subcomponents/Settings";

import { Line } from "react-chartjs-2";
import "chart.js/auto";



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
    imputer: "mean",              
    loss: "mean_squared_error",   
    tree : {
      maxLeafNodes: 2,
      useRandomForest: false,
      randomForest : {
        nEstimators: 100
        // maxSamples: 0.5,
        // maxFeatures: 0.5,
      },
    },
    //
    nn : {
      epochs: 10,
      layers: [                   
        {
          units: 16,
          activation: "relu",
        },
      ],
      optimizer: "adam",
      batchSize: 32,    
      useScaler: false,   
      scaleMethod : 'standardize' //  standardize | minmax | robust | none     
    }
  });

  useEffect(() => {
    if (DB.length > 0) {            
      setVars(Object.keys(DB[0]));   
      setSettings((prevSettings) => ({
        ...prevSettings,
        tree: {
          ...prevSettings.tree,
          maxLeafNodes: (Math.floor(DB.length / 2)),
        },
      }));
    }
  }, [DB]); 

  useEffect(() => {
    setHasTrained(false);
  }, [X, y]);

  useEffect(() => {
    setHasTrained(false);
    setLoss(null);
  }, [settings])

  const handleTrainTreeReq = async () => {
    try {
      const response = await axios.post('/api/py/train-tree', {DB, X, y, settings});  
      setLoss(response.data.loss);
      setHasTrained(true);
    } catch (error) {console.error(error);}
  }

  const handleTrainNNReq = async () => {
    try {
      const response = await axios.post('/api/py/train-nn', {DB, X, y, settings});
      setHasTrained(true);
      console.log(response.data);
      // setLoss(response.data["loss: "]);
    } catch (error) {console.error(error);}
  }
  //! ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   *** 


  return (
    <>
    <Nav />
    {/* flex min-h-screen flex-col items-center justify-between p-24 */}
    <main className="">


      <div className="px-5">
        <ModelSelector setMlModel={setMlModel}/>
        
        <div className={`p-5 ${DB.length > 0 ? "bg-green-100" : "bg-gray-100"}`}>
          <FileUploader DB={DB} setDB={setDB} setSettings={setSettings} settings={settings}/>
        </div>

        {vars.length > 0 && (  
          <>
            <div className="flex justify-center w-full h-full my-5 p-5 shadow-lg">
              <div className=''>
                <FeatureSelector DB={DB} vars={vars} X={X} setX={setX} y={y} sety={sety}/>
                
                {X.length > 1 && y.length > 0 && (
                  (mlModel === "decision_tree" && (
                    <div className="w-full flex flex-col justify-center items-center ">
                      <div className="w-full flex justify-center items-center ">
                        <button onClick={handleTrainTreeReq} className={`border ${hasTrained ? "opacity-50" : ""} bg-orange-400 text-white rounded p-5 w-1/4 mx-2`}>{!hasTrained ? "Train Model" : "Model Trained"}</button>
                          <button disabled={!hasTrained} className={`border border-orange-400 ${hasTrained ? "" : "opacity-50"} rounded p-5`}>{!hasTrained ? "Download Model" : "Download Model"}</button>
                      </div>
                      {loss !== null && <p className="text-gray-400 ml-5">loss = {parseFloat(loss).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>}
                    </div>
                  ))
                )}

                {X.length > 1 && y.length > 0 && (
                  mlModel === "neural_network" && (
                    <div className="w-full flex flex-col justify-center items-center ">
                      <div className="w-full flex justify-center items-center ">
                        <button onClick={handleTrainNNReq} className={`border ${hasTrained ? "opacity-50" : ""} bg-orange-400 text-white rounded p-5 w-1/4 mx-2`}>{!hasTrained ? "Train Model" : "Model Trained"}</button>
                          <button disabled={!hasTrained} className={`border border-orange-400 ${hasTrained ? "" : "opacity-50"} rounded p-5`}>{!hasTrained ? "Download Model" : "Download Model"}</button>
                      </div>
                      {loss !== null && <p className="text-gray-400 ml-5">loss = {parseFloat(loss).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>}
                    </div>
                  )
                )}
              </div>
              

              <Settings settings={settings} setSettings={setSettings} mlModel={mlModel} setMlModel={setMlModel}/>
            </div>

            {hasTrained && (
            <div className="p-5 bg-gray-100 my-5 flex flex-col items-center">
              <PredictField X={X} y={y} hasTrained={hasTrained} settings={settings} mlModel={mlModel}/>
            </div>
            )}
          </>
        )}
        
      </div>


    </main>
    </>
  );
}



{/* <Link href="/api/py/helloFastApi"><code className="font-mono font-bold">api/index.py</code></Link>
<Link href="/api/helloNextJs"><code className="font-mono font-bold">app/api/helloNextJs</code></Link> */}