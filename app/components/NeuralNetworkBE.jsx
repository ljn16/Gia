/* 
	1.	Train the model by sending the data to the backend.
	2.	View the training logs in real-time as the model is trained.
	3.	Make predictions by sending data to the backend and displaying the result.
	4.	Download the model after training.
*/

'use client';

import { useState } from "react";
import axios from "axios";
import EX from './ex'
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const NeuralNetworkBE = ({ DB, setDB, X, setX, y, sety, advancedOptions, trainingLog, setTrainingLog, hasTrained, setHasTrained, downloadedModel, setDownloadedModel}) => {

      //* CHART OPTIONS
      const lossData = {
        labels: trainingLog.map((log) => log.epoch + 1),
        datasets: [
            {
                label: 'Loss per Epoch',
                data: trainingLog.map((log) => log.loss),
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: false,
            },
        ],
    };
    
    const lossOptions = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Epoch',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Loss',
                },
            },
        },
    };

  //*** [POST] ***
  const handleTrainModel = async () => {
    setTrainingLog([]); // Reset the training log
    const inputs = DB.map((row) => X.map((feature) => {    // Map over the DB and extract the input X
        const value = parseFloat(row[feature]);                         // Convert the feature value to a float
        const columnValues = DB.map((row) => parseFloat(row[feature])).filter((val) => !isNaN(val));
        // const meanValue = columnValues.reduce((sum, val) => sum + val, 0) / columnValues.length;
        // console.log(meanValue);
        return isNaN(value) ? 0 : value;                                // Replace NaN with the mean of the column values
    }));                                // Extract the input X from the DB
    const outputs = DB.map((row) => {                             // Map over the DB and extract the output feature
        const value = parseFloat(row[y]);                          // Convert the feature value to a float
        // const columnValues = DB.map((row) => parseFloat(row[feature])).filter((val) => !isNaN(val));
        // const meanValue = columnValues.reduce((sum, val) => sum + val, 0) / columnValues.length;
        return [isNaN(value) ? 0 : value];                              // Replace NaN with the mean of the column values
    });                                 // Extract the output feature from the DB
    try {
      setTrainingLog([]); // Clear previous logs
      const response = await axios.post("/api/train", {
        DB,
        X,
        y,
        advancedOptions,
        inputs,
        outputs
      });

      setTrainingLog(response.data.training_log);
      setHasTrained(true);
      console.log('POSTED TO MODEL');
      // console.log(response.data)
      setDownloadedModel(response.downloadedModel)
    } catch (error) {
      console.error("Error training the model:", error);
    }
  };

  //*** [GET] ***

  
  // const handleDownloadModel = async () => {
  //   try {
  //     const response = await axios.get("/api/download_model");
  //     alert(response.data.message);
  //     console.log('GOT MODEL')
  //   } catch (error) {
  //     console.error("Error downloading the model:", error);
  //   }
  // };

  // const handlePredict = async (inputData /* : number[] */) => {
  //   try {
  //     const response = await axios.post("/api/predict", {
  //       input: inputData,
  //     });
  //     alert(`Predicted value: ${response.data.prediction}`);
  //   } catch (error) {
  //     console.error("Error making prediction:", error);
  //   }
  // };

  //! ***
  return (
    <>
      <button onClick={handleTrainModel} className='train-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded'>
        Train Model
      </button>

      {/* {hasTrained && (
        <button onClick={handleDownloadModel} className='download-btn bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded ml-2'>
          Download Model
        </button>
      )} */}

 

      {/* <div className="prediction-section">
        <h4>Make a Prediction:</h4>
        <button
          onClick={() => handlePredict([1.5, 3.0])} // Example input data
          className="predict-btn"
        >
          Make Prediction
        </button>
      </div> */}
      {/* <EX/> */}
      <div className='flex'>
          <div className='bg-white w-fit mt-5'>
              <h4 className='underline'>Training Log:</h4>
              <ul>
                  {trainingLog.map((log, index) => (                                                 // Map over the training log and display the epoch and loss
                  <li key={index}>Epoch <span className='text-[rgb(109,190,191)] bg-slate-100'>{log.epoch + 1}</span>/{advancedOptions.epochs}: Loss = <span className='bg-slate-100'>{log.loss.toFixed(2)}</span></li>    
                  ))}
              </ul>
          </div>
          <div className='ml-10 h-[30vh] w-[60vw]'><Line className='' data={lossData} options={lossOptions} /></div>
      </div>
    </>
  );
};

export default NeuralNetworkBE;
