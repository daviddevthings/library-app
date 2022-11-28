import React, { useState, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, Redirect, } from 'react-router-dom';
import Dashboard from './Components/Dashboard/Dashboard';
import AdminDashboard from './Components/Dashboard/AdminDashboard';
import Login from "./Components/Login/Login"
import useToken from './Components/useToken';

function App() {
  const { token, setToken } = useToken();

  if (!token) {
    return <Login setToken={setToken}></Login>
  }

  function logOut() {
    setToken({ token: null, role: null })
  }

  return (
    <div className='no-scrollbar'>
      {/* topbar */}
      <div className='flex w-screen h-10 space-x-5 items-center p-2 mt-5 justify-end'>
        <button onClick={logOut} className="bg-[#1D1D31] text-center border-2 border-[#a0a0f3]  py-2 px-5 rounded-lg active:scale-95 transform transition duration-200 ease-out text-white ">Wyloguj</button>
      </div>

      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/panel" replace />}
          />
          {
            JSON.parse(localStorage.getItem('token')).role == "admin" &&
            <Route path="/panel" element={<AdminDashboard />} />
          }
          {
            JSON.parse(localStorage.getItem('token')).role == "user" &&
            <Route path="/panel" element={<Dashboard />} />
          }
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;