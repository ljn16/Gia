import React from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';



const FileUploader = ({ setDB, /* setPredictDB */ }) => {     //* FileUploader component | ACCEPTS: setDB prop
  const [fileSelected, setFileSelected] = React.useState(false);

  const onDrop = (acceptedFiles) => {           // Callback function that runs when a file is dropped
    const file = acceptedFiles[0];                  // Get the first file from the array of accepted files
    setFileSelected(true);                              // Set the fileSelected state to true

    Papa.parse(file, {                              // Parse the file using PapaParse
      header: true,                                     // Treat the first row as a header row
      dynamicTyping: true,                              // Convert strings to numbers if possible
      complete: (result) => setDB(result.data),       // Pass the data to the setDB function
    });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });  // Get the root and input props from useDropzone

  //! ***



  return (
    <div 
      className={`border-2 border-dashed p-5 cursor-pointer ${fileSelected ? 'border-green-500' : 'border-gray-300'}`}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <p>{fileSelected ? 'File selected, click to select a different file' : 'Drag & drop a CSV file here, or click to select one'}</p>
    </div>
  );
};

export default FileUploader;