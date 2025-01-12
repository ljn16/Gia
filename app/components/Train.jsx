import React, { useState } from 'react';
import axios from 'axios';

const Train = () => {
  const [file, setFile] = useState(null);
  const [targetColumn, setTargetColumn] = useState('');
  const [loss, setLoss] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const formData = new FormData();
    // formData.append('file', file);
    // formData.append('target_column', targetColumn);



    // 
    // 
    // 

    try {
      const response = await axios.post('/api/py/train', {DB, X, y, advancedOptions, inputs, outputs, mlModel});
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
      {loss && <p className='text-sm'>Training Loss: {loss}</p>}
      
    </div>
  );
};

export default Train;