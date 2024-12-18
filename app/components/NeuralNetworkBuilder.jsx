'use client';
import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';

import { Line } from 'react-chartjs-2';
import 'chart.js/auto';




const NeuralNetworkBuilder = ({ DB, X, y, advancedOptions, hasTrained, setHasTrained }) => {  //* NeuralNetworkBuilder component | ACCEPTS: DB, X, and y, props + epochs
    /* STATES */
    const [model, setModel] = useState(null); 
    const [trainingLog, setTrainingLog] = useState([]); 

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

    //* TRAIN THE MODEL
    //TODO: add dynamic imputer for NaN values (instead of 0)
    const trainModel = async () => {                                                                  //* trainModel function
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
        
        // console.log("Inputs: " + inputs);
        // console.log("Outputs: " + outputs);

        const XTensor = tf.tensor2d(inputs);                                                            // Convert the input and output DB to tensors 
        const yTensor = tf.tensor2d(outputs);                                                          // ^

        const nnModel = tf.sequential();                                                                    //* CREATE a sequential neural network model
        nnModel.add(tf.layers.dense({ units: 16, activation: advancedOptions.layers.activation, inputShape: [X.length] }));     // Add a dense layer with 16 units and ReLU activation
        nnModel.add(tf.layers.dense({ units: 1 }));                                                             // Add a dense layer with 1 unit

        nnModel.compile({                                                                                   //* COMPILE the model
            optimizer: tf.train.adam(),                                                                           // Use the Adam optimizer
            loss: advancedOptions.loss,                                                                             // Use mean squared error loss
        });

        setModel(nnModel);                                                                                  //* Set the model state to the newly created model

        await nnModel.fit(XTensor, yTensor, {                                                               //* TRAIN the model and log the loss each epoch
            epochs: advancedOptions.epochs,                                                                                   // Train for the specified number of epochs
            callbacks: {
                onEpochEnd: (epoch, logs) => setTrainingLog((prev) => [...prev, { epoch, loss: logs.loss }]),   // Update the training log with the loss
            },
        });
        
        setHasTrained(true);                                                                                //* Set the hasTrained state to true
    };

    // const predict = (inputData) => {
    //     if (!model) {
    //         alert("Model is not trained yet!");
    //         return;
    //     }

    //     const inputTensor = tf.tensor2d([inputData]);
    //     const prediction = model.predict(inputTensor);
    //     prediction.array().then((array) => {
    //         alert(`Predicted value: ${array[0][0]}`);
    //     });
    // };


  //! ***
    return (
        <>
            <br/><hr/><br/>
            <div className='bg-gray-50 p-5'>


                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded' onClick={trainModel}>
                    Train Model
                </button>

                {hasTrained && (
                    <button
                        className='bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded ml-2'
                        onClick={async () => {
                            const saveResult = await model.save('downloads://trained-model');
                            alert('Model saved: ' + saveResult.modelArtifactsInfo.dateSaved);
                        }}
                    >
                        Download Model
                    </button>
                )}

                <br></br>
                <div className='flex'>
                    <div className='bg-white w-fit mt-5'>
                        <h4 className='underline'>Training Log:</h4>
                        <ul>
                            {trainingLog.map((log, index) => (                                                 // Map over the training log and display the epoch and loss
                            <li key={index}>Epoch <span className='text-[rgb(109,190,191)] bg-slate-100'>{log.epoch + 1}</span>/{advancedOptions.epochs}: Loss = <span className='bg-slate-100'>{log.loss.toFixed(2)}</span></li>    
                            ))}
                        </ul>
                    </div>
                    <div className='ml-10 h-[30vh] w-[60vw]'>
                        <Line className='' data={lossData} options={lossOptions} />

                    </div>
                </div>
            </div>
        </>
    );
};

export default NeuralNetworkBuilder;