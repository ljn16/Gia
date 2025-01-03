import React from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import axios from 'axios';



const FileUploader = ({ setDB, DB, setSettings, settings/* setPredictDB */ }) => {     //* FileUploader component | ACCEPTS: setDB prop
  const [fileSelected, setFileSelected] = React.useState(false);
  const [fileName, setFileName] = React.useState('')
  // const [maxLeafNodes, setMaxLeafNodes] = React.useState(2);
  
  const onDrop = async (acceptedFiles) => {           // Callback function that runs when a file is dropped
    const file = acceptedFiles[0];                  // Get the first file from the array of accepted files
    setFileSelected(true);                              // Set the fileSelected state to true
    setFileName(acceptedFiles[0].name)

    Papa.parse(file, {                              // Parse the file using PapaParse
      header: true,                                     // Treat the first row as a header row
      dynamicTyping: true,                              // Convert strings to numbers if possible
      complete: (result) => setDB(result.data),       // Pass the data to the setDB function
    });

    
    const formData = new FormData();               // Create a new FormData object
    formData.append('file', file);               
  

    try {
      const response = await axios.post('/api/upload', formData);
      // setSettings.tree.maxLeafNodes(Math.floor(DB.length/2));
      console.log('File successfully uploaded:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });  // Get the root and input props from useDropzone 


  
  //! ***
  return (
    <>
      <h1 className="font-bold">Upload Dataset</h1>
      
      <div 
        className={`border-2 border-dashed p-5 cursor-pointer ${fileSelected ? 'border-green-500' : 'border-gray-300'}`}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <p className="text-center">{fileSelected ? <><span className='text-green-500 underline'>{fileName} </span><span>uploaded</span><span className='text-gray-400 '> {'('}click to select a different file{')'}</span></> : 'Drag & drop a CSV file here, or click to select one'}</p>
        {/* {fileSelected && (
          <p className="text-center mt-2">
            Number of rows in the data: {maxLeafNodes}
          </p>
        )} */}
      </div>
    </>
  );
};

export default FileUploader;