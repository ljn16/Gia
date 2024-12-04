import React from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';



const FileUploader = ({ setData }) => {     //* FileUploader component | ACCEPTS: setData prop
  const onDrop = (acceptedFiles) => {           // Callback function that runs when a file is dropped
    const file = acceptedFiles[0];                  // Get the first file from the array of accepted files

    Papa.parse(file, {                              // Parse the file using PapaParse
      header: true,                                     // Treat the first row as a header row
      dynamicTyping: true,                              // Convert strings to numbers if possible
      complete: (result) => setData(result.data),       // Pass the data to the setData function
    });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });  // Get the root and input props from useDropzone

  //! ***
  return (
    <div 
        className='border-2 border-dashed border-gray-300 p-5 cursor-pointer'
        {...getRootProps()}>            {/* Pass the root props */}
      <input {...getInputProps()} />        {/* Pass the input props */}  
      <p>Drag & drop a CSV file here, or click to select one</p>
    </div>
  );
};

export default FileUploader;