'use client';
import LoginForm from '../../components/Login/LoginForm';
import './login.css';

const login = () => {
  return (
    <div className='login_container'>
      <div className='login_form'>
        <img className='logo' src="https://download.logo.wine/logo/Stack_Overflow/Stack_Overflow-Logo.wine.png" alt="" />
        <div>
          <LoginForm/>
        </div>
      
      </div>
    </div>
  )
}

export default login