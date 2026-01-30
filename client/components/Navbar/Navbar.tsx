'use client'
import React from 'react'
import './navbar.css';

const Navbar = () => {
    return (
        <div>
            <img className='logo' src="https://download.logo.wine/logo/Stack_Overflow/Stack_Overflow-Logo.wine.png" alt="" />
            <button>Logout</button>
        </div>
    )
}

export default Navbar
