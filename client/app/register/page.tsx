'use client'
import RegisterForm from '@/components/register/RegisterForm'
import './registerpage.css'

const register =() => {
  return (
    <div className='register_container'>
      <div className='register_formm'>
        <h1 className="head">Look like you're new here!</h1>
        <p className="sign">Sign up with Google or register to get started</p>
        <img className='logo' src="https://download.logo.wine/logo/Stack_Overflow/Stack_Overflow-Logo.wine.png" alt="" />
      </div>
      <div className='register_form'>
        <h1 className='register_heading'>Register</h1>
        <div>
          <RegisterForm/>
        </div>
      </div>
    </div>
  )
}

export default register

