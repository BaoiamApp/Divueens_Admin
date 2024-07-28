
import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { PanelContext } from '../context/PanelContext';
import { ThreeDots } from 'react-loader-spinner';

const apiUrl = import.meta.env.VITE_API_URL;

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, setIsAuthenticated } = useContext(PanelContext);
  
  const [loading, setLoading] = useState(true); // Add a loading state
  
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false)
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`${apiUrl}/auth/verify-token`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log(data, 'protected route data');
        if (data.user) {
          console.log(data.user, 'user nav');
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false); // Set loading to false once the check is complete
      }
    };
    
    checkToken();
  },);
  
  if (loading) {
    return (
      <div className="relative p-4 h-screen flex rounded items-center justify-center bg-gray-100">
      <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
        <ThreeDots
          visible={true}
          height="80"
          width="80"
          color="#FF69B4"
          radius="9"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
          />
      </div>
      </div>
    ); // Display a loading message or spinner while checking authentication
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;


// import React, { useContext, useEffect } from 'react'
// import { Navigate } from 'react-router-dom'

// const ProtectedRoute = ({ children }) => {

//   return  localStorage.getItem('token')  ? children : <Navigate to="/login" /> ;

// }

// export default ProtectedRoute
