'use client';
import LoginForm from '../../components/Login/LoginForm';
import './login.css';

const login = () => {
  return (
    <div className='login_container'>
      <div className='register_formm'>
        <h1 className="head">Login!</h1>
        <p className="sign">Get access to the questions, and answer to question</p>
        <img className='logo' src="https://download.logo.wine/logo/Stack_Overflow/Stack_Overflow-Logo.wine.png" alt="" />
      </div>
      <div className='login_form'>
        <h1 className='login_heading'>Login</h1>
        <div>
          <LoginForm/>
        </div>
      
      </div>
    </div>
  )
}

export default login