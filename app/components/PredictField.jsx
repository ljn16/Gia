'use client';
import { useEffect, useState } from "react";
import axios from "axios";

export default function PredictField({ X, y, hasTrained }) {
  const [inputs, setInputs] = useState({});
  const [prediction, setPrediction] = useState(null);

 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/predict", inputs);
      setPrediction(response.data.prediction);
      // setPrediction(JSON.stringify(response.data));
      // console.log(response.data);
      // console.log(JSON.stringify(response.data));
      console.log('prediction: ', response.data.prediction[0])
    } catch (error) {
      console.error("Error making prediction:", error);
    }
  };

  useEffect(() => {
    setInputs({});
    setPrediction(null);
  }, [X, y]);

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex">
        {X.map((variable, index) => (
          <div key={index} className="m-2">
            <label>{variable}: </label>
            <input
              className="border border-gray-400 p-1 rounded"
              type="text"
              name={variable}
              value={inputs[variable] || ""}
              onChange={handleChange}
            />
          </div>
        ))}
        <button
          type="submit"
          className={`border text-white rounded p-1 ${X.length === 0 ? 'bg-gray-400' : 'bg-orange-400'}`}
          disabled={X.length === 0}
        >
          Predict {y}
        </button>
      </form>

      {prediction !== null && (
        <div className="flex w-full justify-center">
          <h3 className="mt-3">Predicted {y}: <span className='text-orange-400 font-bold'>{parseFloat(prediction).toFixed(2)}</span></h3>
        </div>
      )}
    </div>
  );
}