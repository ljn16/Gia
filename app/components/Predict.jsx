import { useState } from "react";
import axios from "axios";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [downloadLink, setDownloadLink] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload a file first.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/predict-tree", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // setDownloadLink(response.data.download_url);
      console.log('Predict file successfully uploaded:'/* , response.data */);

    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleUpload}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button type="submit" className="border text-white bg-blue-500 rounded p-1">Upload and Predict</button>
      </form>
      {downloadLink && (
        <a href={downloadLink} download>
          Download Predicted File
        </a>
      )}
    </div>
  );
}