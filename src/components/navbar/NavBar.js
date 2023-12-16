import React from 'react'
import './NavBar.css'
import {NavLink} from 'react-router-dom';
import {GiCorn} from 'react-icons/gi'
import {useContext,useState,useEffect} from 'react';
import {loginContext} from '../contexts/LoginContext';
import {FaUserLarge} from 'react-icons/fa6'
import {GiFarmer} from 'react-icons/gi'

function NavBar() {
  let [currentUser,,userLogInStatus,,,setLoginError]=useContext(loginContext)
  const activeLink={
    color : 'blue',
    fontWeight:'bold',
    fontSize:'1.15rem'
  }
  const inActiveLink={
    color : 'white',
    fontWeight:'bold',
    fontSize:'1.15rem'
  }
  return (
    <div>
      <nav className="navbar navbar-expand-sm opacity-10 p-3">
        <h2 className='fw-bold mx-4 heading1'>Fresh 'O Farm<GiCorn className='mx-2'/></h2>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item ">  
              <NavLink className="nav-link me-4" style={({isActive})=>{ 
                return  isActive?activeLink:inActiveLink
              }}
               to="/">Home</NavLink>
            </li>
            <li className="nav-item ">
              <NavLink className="nav-link me-4" style={({isActive})=>{
                return  isActive?activeLink:inActiveLink
              }} to="/sign-up">SignUp</NavLink>
            </li>
            {
              userLogInStatus===false &&
                <li className="nav-item ">
                  <NavLink className="nav-link me-4" style={({isActive})=>{
                    !isActive && setLoginError('')
                    return  isActive?activeLink:inActiveLink
                  }} to="/login">Login</NavLink>
                </li>
            }  
            {
              userLogInStatus && currentUser.Type==='farmer' &&
                <li className="nav-item ">
                  <NavLink className="nav-link me-4" style={({isActive})=>{
                    return  isActive?activeLink:inActiveLink
                  }} to="/farmer-dashboard"><GiFarmer className='fs-3 mb-1 farmer-icon'/>Dashboard</NavLink>
                </li>
            }  
            {
              userLogInStatus && currentUser.Type==='customer' &&
                <li className="nav-item ">
                  <NavLink className="nav-link me-4" style={({isActive})=>{
                    return  isActive?activeLink:inActiveLink
                  }} to="/customer-dashboard"><FaUserLarge className='mb-1 me-2 fs-5 customer-icon'/>Dashboard</NavLink>
                </li>
            }
            <li className="nav-item ">
              <NavLink className="nav-link me-4" style={({isActive})=>{
                return  isActive?activeLink:inActiveLink
              }} to="/about-us">AboutUs</NavLink>
            </li>
          </ul>
        </div>
    </nav>
    </div>
  )
}

export default NavBar