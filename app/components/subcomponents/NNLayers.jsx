import { useState } from "react";
import axios from "axios";



export default function NNLayers ({ settings, setSettings }) {
    const [layers, setLayers] = useState([]);

    // const fetchLayers = async () => {
    //   const response = await axios.get("http://127.0.0.1:5000/get-layers");
    //   setLayers(response.data.layers); // Assumes backend returns `layers` array.
    // };
  
    const addLayer = async (event) => {
      event.preventDefault();
      const units = parseInt(event.target.units.value, 10);   
      const activation = event.target.activation.value;
  
    //   await axios.post("http://127.0.0.1:5000/add-layer", { units, activation });
    //   fetchLayers();
    ////         setSettings({ ...settings, layers: [...settings.nn.layers, { units: 32, activation: 'relu' }] })

        setSettings({ 
            ...settings, 
            nn: {
                ...settings.nn,
            layers: [...(settings.nn?.layers || []), { units, activation }] // Add new layer to existing layers or initialize if empty 
            }
        });
    };
  
    // const removeLayer = async () => {
    //   await axios.post("http://127.0.0.1:5000/remove-layer");
    //   fetchLayers();
    // };





const removeLayer = (index) => {
    const updatedLayers = settings.nn.layers.filter((_, i) => i !== index);
    setSettings({
        ...settings,
        nn: {
            ...settings.nn,
            layers: updatedLayers,
        },
    });
};

  return (
    <div className=''>

        <form onSubmit={addLayer} className="flex items-center space-x-4  justify-between ml-4 h-full">
        <span className="border-r p-2">Add layer</span>
            <div className="flex items-center space-x-2">
                <label className="flex items-center">
                    neurons
                    <input type="number" name="units" className="border rounded ml-2 w-16" required />
                </label>

                <label className="">
                    <select name="activation" className="border rounded ml-2" required>
                        <option value="relu">ReLU</option>
                        <option disable value="sigmoid">Sigmoid</option>
                        <option disable value="tanh">Tanh</option>
                        <option disable value="softmax">Softmax</option>
                    </select>
                </label>
            </div>
            <div className="ml-auto h-full">
                <button className='bg-green-500 text-white text-sm px-4 py-2 rounded-r-md h-full' type='submit'>
                    +
                </button>
            </div>
        </form>

            <div className='mt-4 border-2 p-2 ml-4'>
            <h2 className="text-center">Hidden layers: </h2>
                {settings.nn?.layers?.length === 0 ? (
                <p>No layers added yet.</p>
            ) : (
                <ul>
                    {settings.nn.layers.map((layer, index) => (
                        <li key={index}>
                            <span className="text-gray-300">({index })</span> {layer.units} units, {layer.activation}
                            <button 
                                className='bg-red-500 text-white text-sm px-2 py-1 rounded-r ml-4'
                                onClick={() => removeLayer(index)}
                            >
                                -
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    </div>
  );
};
