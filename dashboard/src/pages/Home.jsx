import React from 'react'
import axios from 'axios';

export default function Home() {

  const updateUser = async (userId, updatedUserData) => {
    try {
      const response = await axios.put(`http://localhost:3000/users/${userId}`, updatedUserData);
      return response.data; // Optionally return updated user data or a success message
    } catch (error) {
      console.error('Error updating user:', error);
      throw error; // Handle error as per your application's requirements
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(`http://localhost:3000/users/${userId}`);
      return response.data; // Optionally return a success message
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error; // Handle error as per your application's requirements
    }
  };


  return (
    <div>
      
    </div>
  )
}
