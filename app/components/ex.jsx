"use client"
import Link from 'next/link'
import axios from 'axios'

export default function EX() {
  const handleGetClick = async () => {
    try {
      const response = await fetch('/api/myGetReq');
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  //axios example
  const handlePostClick = async () => {
    try {
      const response = await axios.post('/api/myPostReq', { message: 'Post!' }, {
      headers: {
        'Content-Type': 'application/json',
      },
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  const handlePutClick = async () => {
    try {
      const response = await fetch('/api/myPutReq', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'Put!' }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  const handlePatchClick = async () => {
    try {
      const response = await fetch('/api/myPatchReq', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'patch works' }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  const handleDeleteClick = async () => {
    try {
      const response = await fetch('/api/myDeleteReq', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  //! ***
  return (
    <>
      <button onClick={handleGetClick} className="ml-2 p-2 bg-blue-500 text-white rounded">Fetch Data</button>
      <button onClick={handlePostClick}className="ml-2 p-2 bg-green-500 text-white rounded">Post Data</button>
      <button onClick={handlePutClick}className="ml-2 p-2 bg-yellow-500 text-white rounded">Put Data</button>
      <button onClick={handlePatchClick}className="ml-2 p-2 bg-yellow-500 text-white rounded">Patch Data</button>
      <button onClick={handleDeleteClick}className="ml-2 p-2 bg-red-500 text-white rounded">Delete Data</button>
    </>
  )
}
