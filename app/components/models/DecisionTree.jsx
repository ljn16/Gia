"use client";
import { useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
//  ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   *** 

const DecisionTree = ({DB, setDB, X, setX, y, sety, advancedOptions, trainingLog, setTrainingLog, hasTrained, setHasTrained, downloadedModel, setDownloadedModel, loss, setLoss}) => {
  //*** [POST] ***
  const handleTrainModel = async () => {
    /* MAP INPUTS from FB */
    const inputs = DB.map((row) =>  
      X.map((feature) => {
        const value = row[feature];
        return value;
      })
    ); 
    /* MAP OUTPUT from DB */
    const outputs = DB.map((row) => {
      const value = row[y];
      return value;
    });

    try {
      setTrainingLog([]); // Clear previous logs
      /* [POST] req */
      const response = await axios.post("/api/train-nn", {DB, X, y, advancedOptions, inputs, outputs,});

      setTrainingLog(response.data.training_log);
      setHasTrained(true);
      console.log("POSTED TO MODEL");
      setDownloadedModel(response.downloadedModel);
    } catch (error) {
      console.error("Error training the model:", error);
    }
  };

  //! ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   *** 
  return (
    <>
      <button onClick={handleTrainModel} className="train-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
        Train Model
      </button>

      <div className="flex">
        <div className="bg-white w-fit mt-5">
          <h4 className="underline">Training Log:</h4>
          <ul>
            {/* Map over the training log and display the epoch and loss */}
            {trainingLog.map(
              (
                log,
                index 
              ) => (
                <li key={index}>
                  Epoch{" "}
                  <span className="text-[rgb(109,190,191)] bg-slate-100">
                    {log.epoch + 1}
                  </span>
                  /{advancedOptions.epochs}: Loss ={" "}
                  <span className="bg-slate-100">{log.loss.toFixed(2)}</span>
                </li>
              )
            )}
          </ul>
        </div>

      </div>
    </>
  );
};

export default DecisionTree;
