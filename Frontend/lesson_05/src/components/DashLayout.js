import React from 'react'
import { Outlet } from 'react-router-dom'
import DashHeader from './DashHeader';
import DashFooter from './DashFooter';

const DashLayout = () => {
  return (
    <>
        <DashHeader /> {/* Will be on every protected page */}
        <div className='dash-container'> 
            <Outlet />
        </div>
        <DashFooter />
    </> 
  )
}

export default DashLayout