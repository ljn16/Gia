import { useState, useEffect } from "react";

export default function Settings ({ settings, setSettings, mlModel, setMlModel }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => setIsOpen(!isOpen);





  return (
    <div className="border border-gray-300 rounded-md mb-4 w-1/4">
        <div className={`flex justify-between items-center p-4 bg-gray-100 rounded-md cursor-pointer ${isOpen ? 'h-fit' : 'h-full'}`} onClick={toggleAccordion}>
            <h3 className="font-semibold text-center w-full"><span>{isOpen ? "▼" : "▶"}</span> <span>Advanced Settings</span></h3>
      </div>

        {isOpen && mlModel === "decision_tree" && (  /* 'decision_tree' */
            <>
            
            
            <div className='px-4 bg-gray-50 rounded-b-md'>

                {/*//? PREPROCESSING */}
                <h3 className="font-semibold">Preprocessing</h3>
                <div className='flex w-fit items-center'>
                    <label htmlFor='imputer' className='block text-sm font-medium text-gray-700 mr-2'>Imputer</label>
                    <select className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                        id='imputer'
                        name='imputer'
                        value={settings.imputer}
                        onChange={(e) => setSettings({ ...settings, imputer: e.target.value })}
                    >
                        <option value='mean'>Mean</option>
                        <option value='median'>Median</option>
                        <option value='most_frequent'>Most Frequent</option>
                    </select>
                </div>

                {/*//? COMPILATION */}
                <h3 className="font-semibold">Compilation</h3>
                <div className='flex w-fit items-center'>
                    <label htmlFor='loss' className='block text-sm font-medium text-gray-700 mr-2'>Loss</label>
                    <select className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                        id='loss'
                        name='loss'
                        value={settings.loss}
                        onChange={(e) => setSettings({ ...settings, loss: e.target.value })}
                    >
                        <option value='mean'>MSE</option>
                    </select>
                </div>

                {/*//? TRAINING */}
                <h3 className="font-semibold">Training</h3>
                <div className='flex w-fit items-center'>
                    <label htmlFor='maxLeafNodes' className='block text-sm font-medium text-gray-700 mr-2'>Max Leaf Nodes</label>
                    <input className='mt-1 block w-fit px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                        type='number'
                        id='maxLeafNodes'
                        name='maxLeafNodes'
                        value={settings.tree.maxLeafNodes}
                        onChange={(e) => setSettings({ 
                            ...settings, tree: { 
                                ...settings.tree, maxLeafNodes: e.target.value 
                            } 
                        })}
                    />
                </div>


                <div className='flex w-fit items-center mt-4'>
                    <label htmlFor='Random Forest' className='block text-sm font-medium text-gray-700 mr-2'>Random Forest</label>
                    <button
                        id='Random Forest'
                        name='Random Forest'
                        onClick={() => setSettings({ 
                            ...settings, tree: { 
                                ...settings.tree, useRandomForest: !settings.tree.useRandomForest 
                            } 
                        })}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 ${settings.tree.useRandomForest ? 'bg-green-950 opacity-70' : 'bg-gray-200'}`}
                    >
                        <span className="sr-only">Toggle Random Forest</span>
                        <span
                            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings.tree.useRandomForest ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                    </button>
                </div>


                {settings.tree.useRandomForest && (
                    <div className='flex w-fit items-center'>
                        <label htmlFor='n_estimators' className='block text-sm font-medium text-gray-700 mr-2 ml-5'>nEstimators</label>
                        <input className='mt-1 block w-fit px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                            type='number'
                            id='n_estimators'
                            name='n_estimators'
                            value={settings.tree.randomForest.nEstimators}
                            onChange={(e) => setSettings({ 
                                ...settings, tree: { 
                                    ...settings.tree, randomForest: { 
                                        ...settings.tree.randomForest, nEstimators: e.target.value 
                                    } 
                                } 
                            })}
                        />
                    </div>
                )}




            </div>
            </>
        )}
    </div>
  );
};
