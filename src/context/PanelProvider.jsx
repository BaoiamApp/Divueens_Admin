import React, { useEffect, useState } from 'react'
import { PanelContext } from './PanelContext'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const apiUrl = import.meta.env.VITE_API_URL;

const PanelProvider = ({children}) => {
const [isAuthenticated, setIsAuthenticated] = useState(false);


  const logout = () => {
    localStorage.removeItem('token');
    // setIsAuthenticated(false);

    Swal.fire({
      position: "center",
      icon: "success",
      title: "logged out successfully!",
      showConfirmButton: false,
      timer: 1500
  });
  };


  return (
    <PanelContext.Provider value={{isAuthenticated, setIsAuthenticated, logout}}>
      { children }
    </PanelContext.Provider>
  )
}

export default PanelProvider;
