import React, { useState } from 'react';
import axios from 'axios';

const Predict = () => {
  const [file, setFile] = useState(null);
  const [predictions, setPredictions] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPredictions(response.data.predictions);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Make Predictions</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
        <button type="submit">Predict</button>
      </form>
      {predictions && <p>Predictions: {predictions.join(', ')}</p>}
    </div>
  );
};

export default Predict;