"use client";
import { useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
// ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   *** 


const NeuralNetworkBE = ({DB, setDB, X, setX, y, sety, settings, trainingLog, setTrainingLog, hasTrained, setHasTrained, downloadedModel, setDownloadedModel}) => {
  //* CHART OPTIONS
  // const lossData = {
  //   labels: trainingLog.map((log) => log.epoch + 1),
  //   datasets: [
  //     {
  //       label: "Loss per Epoch",
  //       data: trainingLog.map((log) => log.loss),
  //       borderColor: "rgba(75,192,192,1)",
  //       backgroundColor: "rgba(75,192,192,0.2)",
  //       fill: false,
  //     },
  //   ],
  // };

  // const lossOptions = {
  //   scales: {
  //     x: { title: { display: true, text: "Epoch" }},
  //     y: { title: { display: true, text: "Loss" }},
  //   },
  // };

  //*** [POST] ***
  const handleTrainModel = async () => {
    setTrainingLog([]); // Reset the training log
    /* MAP INPUTS from FB */
    const inputs = DB.map((row) =>
      X.map((feature) => { const value = row[feature];
        return value;
      })
    ); 
    
    /* MAP OUTPUT from DB */
    const outputs = DB.map((row) => { const value = row[y];
      return value;
    }); 

    try {
      setTrainingLog([]); // Clear previous logs
      /* [POST] req */
      const response = await axios.post("/api/train-nn", {DB, X, y, settings, inputs, outputs});

      // setTrainingLog(response.data.training_log);
      // setHasTrained(true);
      console.log("POSTED TO MODEL");
      // console.log(response.data)
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
            {/* {trainingLog.map(
              (
                log,
                index // Map over the training log and display the epoch and loss
              ) => (
                <li key={index}>
                  Epoch{" "}
                  <span className="text-[rgb(109,190,191)] bg-slate-100">
                    {log.epoch + 1}
                  </span>
                  /{settings.nn.epochs}: Loss ={" "}
                  <span className="bg-slate-100">{log.loss.toFixed(2)}</span>
                </li>
              )
            )} */}
          </ul>
        </div>
        
        {/* create graph (loss v epoch) */}
        {/* <div className="ml-10 h-[30vh] w-[60vw]">
          <Line className="" data={lossData} options={lossOptions} />
        </div> */}
      </div>
    </>
  );
};

export default NeuralNetworkBE;

/* 
	1.	Train the model by sending the data to the backend.
	2.	View the training logs in real-time as the model is trained.
	3.	Make predictions by sending data to the backend and displaying the result.
	4.	Download the model after training.
*/