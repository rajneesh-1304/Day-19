'use client'
import RegisterForm from '@/components/register/RegisterForm'
import './registerpage.css'

const register =() => {
  return (
    <div className='register_container'>
      <div className='register_form'>
        <img className='logo' src="https://download.logo.wine/logo/Stack_Overflow/Stack_Overflow-Logo.wine.png" alt="" />
        <div>
          <RegisterForm/>
        </div>
      </div>
    </div>
  )
}

export default register

