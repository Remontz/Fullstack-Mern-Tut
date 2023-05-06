import React from 'react'
import { Outlet } from 'react-router-dom'
import DashHeader from './DashHeader';

const DashLayout = () => {
  return (
    <>
        <DashHeader /> {/* Will be on every protected page */}
        <div className='dash-container'> 
            <Outlet />
        </div>
    </> 
  )
}

export default DashLayout