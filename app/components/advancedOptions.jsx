// import React, { useState } from 'react';

const AdvancedOptions = ({ settings, setSettings }) => {  //* AdvancedOptions component | ACCEPTS: settings and setSettings props
    return (
        <div>
        <div className='mt-4'>
          <details className='border border-gray-300 rounded-md shadow-sm'>
            <summary className='cursor-pointer p-2 bg-gray-200 rounded-md text-black'>
              Advanced Options
            </summary>
            <div className='p-4 bg-gray-50'>
              <h3 className="font-semibold">Preprocessing</h3>
              <div className='flex w-fit items-center'>
                <label htmlFor='imputer' className='block text-sm font-medium text-gray-700 mr-2'>Imputer</label>
                <select
                  id='imputer'
                  name='imputer'
                  value={settings.imputer}
                  onChange={(e) => setSettings({ ...settings, imputer: e.target.value })}
                  className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                >
                  <option value='mean'>Mean</option>
                  <option value='median'>Median</option>
                  <option value='most_frequent'>Most Frequent</option>
                </select>
              </div>
              <h3 className="font-semibold">Creation</h3>
              <div className='mt-1 flex flex-wrap'>
                <div className='flex w-fit'>
                <button
                    onClick={() => {
                      const newLayers = [...settings.layers];
                      newLayers.pop();
                      setSettings({ ...settings, layers: newLayers });
                    }}
                    className='bg-red-500 text-white text-sm px-4 py-2 rounded-l-md '
                  >
                    -
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, layers: [...settings.layers, { units: 32, activation: 'relu' }] })}
                    className='bg-green-500 text-white text-sm px-4 py-2 rounded-r-md mr-4'
                  >
                    +
                  </button>
                </div>

                {settings.layers.map((layer, index) => (
                  <div key={index} className='mt-2'>
                    <h4>Layer {index + 1}</h4>
                    <div className='flex w-fit items-center'>
                      <label htmlFor={`units-${index}`} className='block text-sm font-medium text-gray-700 mr-2'>Units</label>
                      <input
                        type='number'
                        id={`units-${index}`}
                        name={`units-${index}`}
                        value={layer.units}
                        onChange={(e) => {
                          const newLayers = [...settings.layers];
                          newLayers[index].units = e.target.value;
                          setSettings({ ...settings, layers: newLayers });
                        }}
                        className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                      />
                    </div>
                    <div className='flex w-fit items-center'>
                      <label htmlFor={`activation-${index}`} className='block text-sm font-medium text-gray-700 mr-2'>Activation</label>
                      <select
                        id={`activation-${index}`}
                        name={`activation-${index}`}
                        value={layer.activation}
                        onChange={(e) => {
                          const newLayers = [...settings.layers];
                          newLayers[index].activation = e.target.value;
                          setSettings({ ...settings, layers: newLayers });
                        }}
                        className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                      >
                        <option value='relu'>ReLU</option>
                        <option value='sigmoid'>Sigmoid</option>
                        <option value='tanh'>Tanh</option>
                        <option value='softmax'>Softmax</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
              <h3 className="font-semibold">Compilation</h3>
              <div className='flex w-fit items-center'>
                <label htmlFor='loss' className='block text-sm font-medium text-gray-700 mr-2'>Loss</label>
                <select
                  id='loss'
                  name='loss'
                  value={settings.loss}
                  onChange={(e) => setSettings({ ...settings, loss: e.target.value })}
                  className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                >
                  <option value='mean'>MSE</option>
                </select>
              </div>
              <div className='flex w-fit items-center'>
                <label htmlFor='optimizer' className='block text-sm font-medium text-gray-700 mr-2'>Optimizer</label>
                <select
                  id='optimizer'
                  name='optimizer'
                  value={settings.optimizer}
                  onChange={(e) => setSettings({ ...settings, optimizer: e.target.value })}
                  className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                >
                  <option value='adam'>Adam</option>
                </select>
              </div>
              <h3 className="font-semibold">Training</h3>
              <div className='flex w-fit items-center'>
                <label htmlFor='batchSize' className='block text-sm font-medium text-gray-700 mr-2'>Batch Size</label>
                <input className='mt-1 block w-fit px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                  type='number'
                  id='batchSize'
                  name='batchSize'
                  value={settings.batchSize}
                  onChange={(e) => setSettings({ ...settings, batchSize: e.target.value })}
                />
              </div>
              <div className='flex w-fit items-center'>
                <label htmlFor='epochs' className='block text-sm font-medium text-gray-700 mr-2'>Epochs</label>
                <input className='mt-1 block w-fit px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                  type='number'
                  id='epochs'
                  name='epochs'
                  value={settings.epochs}
                  onChange={(e) => setSettings({ ...settings, epochs: e.target.value })}
                />
              </div>
            </div>
          </details>
        </div>
      </div>
    );
};

export default AdvancedOptions;