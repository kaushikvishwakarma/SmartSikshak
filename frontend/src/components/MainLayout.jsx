import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './kundan/Header.jsx'

const MainLayout = () => {
  return (
    <>
      
        <Header />
      
      <div>
        <Outlet />
      </div>
    </>


  )
}

export default MainLayout