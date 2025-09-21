import React from 'react'
import { useState } from 'react'
import {Link,useNavigate} from 'react-router-dom'
import axios from 'axios'
import image from '../assets/notemaking.png'
import "./Login.css"

function Login() {
    const [data, setData] = useState({ email: "", password: "" }); 
    const [error,setError] = useState('');
    const navigate = useNavigate();

    const handleChange = ({ currentTarget: input }) => { 
        setData({...data, [input.name]: input.value}); }
    const handleSubmit = async (e) => { 
        e.preventDefault(); 
        if (!data.email.trim() || !data.password.trim()) {
            alert("Please enter both email and password");
            return; 
        } 
        try {
            const url = 'http://localhost:8080/api/auth';
            const {data:res} = await axios.post(url,data);
            console.log("Login response:", res);
            localStorage.setItem("token",res.data);
            console.log(res.message);
            navigate("/dashboard");
        }
        catch (error) {
            if(error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message);
            }
        }
    };
        
    return (
        <div className='black-card'>
            <div className='notefy'>Notefy</div>
            <div className="login-container">
                <div className='login-left'>
                    <h2 className='welcome-text'>Welcome Back!</h2>
                    <form className='login-form' onSubmit={handleSubmit}>
                        <input type='email' onChange={handleChange} name='email' value={data.email} placeholder='Email ID' required/>
                        <input type='password' onChange={handleChange} name='password' value={data.password} placeholder='Password' required/>
                        {error && <div className='error_msg'>{error}</div>}
                        <button type='submit'>Login</button>
                        <p>Don't have an account? <Link to='/signup'><u>Sign Up</u></Link>.</p>
                    </form>
                </div>
                <div className='login-right'>
                    <img src={image} alt='Notemaking illustration'/>
                </div>
            </div>
        </div>
    )
}
    
export default Login;