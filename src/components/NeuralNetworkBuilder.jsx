import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';
// import { Line } from 'react-chartjs-2';

const NeuralNetworkBuilder = ({ data, inputFeatures, outputFeature }) => {  //* NeuralNetworkBuilder component | ACCEPTS: data, inputFeatures, and outputFeature props
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

        // console.log('Inputs:', inputs);                                                                     // Log the inputs to the console
        // console.log('Outputs:', outputs);                                                                   // Log the outputs to the console

        const inputTensor = tf.tensor2d(inputs);                                                            // Convert the input and output data to tensors 
        const outputTensor = tf.tensor2d(outputs);                                                          // ^

        console.log('Input Tensor:', inputTensor);                                                          // Log the input tensor to the console
        console.log('Output Tensor:', outputTensor);                                                        // Log the output tensor to the console

        const nnModel = tf.sequential();                                                                    //* CREATE a sequential neural network model
        nnModel.add(tf.layers.dense({ units: 16, activation: 'relu', inputShape: [inputFeatures.length] }));    // Add a dense layer with 16 units and ReLU activation
        nnModel.add(tf.layers.dense({ units: 1 }));                                                             // Add a dense layer with 1 unit

        nnModel.compile({                                                                                   //* COMPILE the model
            optimizer: tf.train.adam(),                                                                           // Use the Adam optimizer
            loss: 'meanSquaredError',                                                                             // Use mean squared error loss
        });

        setModel(nnModel);                                                                                  //* Set the model state to the newly created model

        await nnModel.fit(inputTensor, outputTensor, {                                                      //* TRAIN the model and log the loss each epoch
            epochs: 10,
            callbacks: {
                onEpochEnd: (epoch, logs) => setTrainingLog((prev) => [...prev, { epoch, loss: logs.loss }]),   // Update the training log with the loss
            },
        });
    };

    // const lossData = {
    //     labels: trainingLog.map((log) => `Epoch ${log.epoch + 1}`),
    //     datasets: [
    //         {
    //             label: 'Loss',
    //             data: trainingLog.map((log) => log.loss),
    //             fill: false,
    //             backgroundColor: 'rgba(75,192,192,0.4)',
    //             borderColor: 'rgba(75,192,192,1)',
    //         },
    //     ],
    // };
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
                <li key={index}>Epoch {log.epoch + 1}: Loss = {log.loss.toFixed(4)}</li>    
                ))}
            </ul>




                <div>
 
                    {/* <Line data={lossData} /> */}
                </div>

        </div>
    );
};

export default NeuralNetworkBuilder;