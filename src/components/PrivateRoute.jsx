import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const { currentUser } = useSelector((store) => store.user);
  return currentUser ? <Outlet /> : <Navigate to='/signin'/> // outlet is component we have wrapped in App.jsx component. ie Profile component
}

export default PrivateRoute