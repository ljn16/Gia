import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const NeuralNetworkBuilder = ({ data, inputFeatures, outputFeature, epochs }) => {  //* NeuralNetworkBuilder component | ACCEPTS: data, inputFeatures, and outputFeature, props + epochs
    /* STATES */
    const [model, setModel] = useState(null); 
    const [trainingLog, setTrainingLog] = useState([]); 

    const trainModel = async () => {                                                                  //* trainModel function
        const inputs = data.map((row) => inputFeatures.map((feature) => {
            const value = parseFloat(row[feature]);
            return isNaN(value) ? 0 : value; // Replace NaN with 0 or any other default value
        }));         // Extract the input features from the data
        const outputs = data.map((row) => {
            const value = parseFloat(row[outputFeature]);
            return [isNaN(value) ? 0 : value]; // Replace NaN with 0 or any other default value
        });                                // Extract the output feature from the data



        const inputTensor = tf.tensor2d(inputs);                                                            // Convert the input and output data to tensors 
        const outputTensor = tf.tensor2d(outputs);                                                          // ^


        const nnModel = tf.sequential();                                                                    //* CREATE a sequential neural network model
        nnModel.add(tf.layers.dense({ units: 16, activation: 'relu', inputShape: [inputFeatures.length] }));    // Add a dense layer with 16 units and ReLU activation
        nnModel.add(tf.layers.dense({ units: 1 }));                                                             // Add a dense layer with 1 unit

        nnModel.compile({                                                                                   //* COMPILE the model
            optimizer: tf.train.adam(),                                                                           // Use the Adam optimizer
            loss: 'meanSquaredError',                                                                             // Use mean squared error loss
        });

        setModel(nnModel);                                                                                  //* Set the model state to the newly created model

        await nnModel.fit(inputTensor, outputTensor, {                                                      //* TRAIN the model and log the loss each epoch
            epochs: epochs,
            callbacks: {
                onEpochEnd: (epoch, logs) => setTrainingLog((prev) => [...prev, { epoch, loss: logs.loss }]),   // Update the training log with the loss
            },
        });
    };


  //! ***
    return (
        <div>
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded' onClick={trainModel}>
                Train Model
            </button>

            <br></br>
            <h4 className='underline'>Training Log:</h4>
            <ul>
                {trainingLog.map((log, index) => (                                                 // Map over the training log and display the epoch and loss
                <li key={index}>Epoch {log.epoch + 1}/{epochs}: Loss = {log.loss.toFixed(4)}</li>    
                ))}
            </ul>


            {/* <Line
                data={{
                    labels: trainingLog.map((log) => `Epoch ${log.epoch + 1}`),
                    datasets: [
                        {
                            label: 'Loss',
                            data: trainingLog.map((log) => log.loss),
                            borderColor: 'rgba(75,192,192,1)',
                            backgroundColor: 'rgba(75,192,192,0.2)',
                            fill: true,
                        },
                    ],
                }}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
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
                }}
            /> */}

        </div>
    );
};

export default NeuralNetworkBuilder;