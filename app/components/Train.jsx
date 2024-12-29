import React, { useState } from 'react';
import axios from 'axios';

const Train = () => {
  const [file, setFile] = useState(null);
  const [targetColumn, setTargetColumn] = useState('');
  const [loss, setLoss] = useState(null);

  const handleSubmit = async (e) => {
    // e.preventDefault();
    // const formData = new FormData();
    // formData.append('file', file);
    // formData.append('target_column', targetColumn);

        /* MAP INPUTS from FB */
        const inputs = DB.map((row) =>  
          X.map((feature) => {
            const value = row[feature];
            return value;
          })
        ); 
        /* MAP OUTPUT from DB */
        const outputs = DB.map((row) => {
          const value = row[y];
          return value;
        });
    
        try {
          setTrainingLog([]); // Clear previous logs
          /* [POST] req */
          const response = await axios.post('/api/train', {DB, X, y, advancedOptions, inputs, outputs,});
    
          setTrainingLog(response.data.training_log);
          setHasTrained(true);
          console.log("POSTED TO MODEL");
          setDownloadedModel(response.downloadedModel);
        } catch (error) {
          console.error("Error training the model:", error);
        }

    // 
    // 
    // 

    try {
      const response = await axios.post('/api/train', {DB, X, y, advancedOptions, inputs, outputs,});
      //replaced formData with {DB, X, y, advancedOptions, inputs, outputs,}
      setLoss(response.data.loss); 
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Train Model</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
        <input
          type="text"
          placeholder="Target Column"
          value={targetColumn}
          onChange={(e) => setTargetColumn(e.target.value)}
          required
        />
        <button type="submit" className='bg-blue-100 rounded'>Train</button>
      </form>
      {loss && <p>Training Loss: {loss}</p>}
    </div>
  );
};

export default Train;