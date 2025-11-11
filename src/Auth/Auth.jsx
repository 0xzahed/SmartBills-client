import React from 'react';
import Navbar from '../Components/Navbar/Navbar';
import { Outlet } from 'react-router';

const Auth = () => {
    return (
        <div>
           <div className='p-5'>
             <Navbar></Navbar>
           </div>
            <Outlet></Outlet>
        </div>
    );
};

export default Auth;