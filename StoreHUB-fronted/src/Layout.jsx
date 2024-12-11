// src/components/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';


const Layout = () => {
  return (
    <div>
      <Navbar/>
  
        <Outlet /> {/* This is where the nested routes will render */}
   
    </div>
  );
};

export default Layout;
