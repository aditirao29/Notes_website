import React from 'react'
import { useState } from 'react'
import {Link,useNavigate} from 'react-router-dom'
import axios from 'axios'
import image from '../assets/notemaking.png'
import "./SignUp.css"

function SignUp() { 
    const [data, setData] = useState({ firstName: "", lastName: "", email: "", password: "" });
    const [error,setError] = useState('')
    const navigate = useNavigate();
    const handleChange = ({ currentTarget: input }) => { setData({...data, [input.name]: input.value}); }
    const handleSubmit = async (e) => { 
        e.preventDefault(); 
        try { 
            const url = 'http://localhost:8080/api/users';
            const {data:res} = await axios.post(url,data);
            navigate('/login') 
            console.log(res.message); 
        }
        catch (error) {
            if(error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message)
            } 
        } 
    }
    return (
        <div className='black-card'>
            <div className='notefy'>Notefy</div>
            <div className="signup-container">
                <div className='signup-left'>
                    <h2 className='text'>Get Started Now</h2>
                    <form className='signup-form' onSubmit={handleSubmit}>
                        <div className='names'>
                            <input className='fname' onChange={handleChange} name='firstName' value={data.firstName} type='text' placeholder='First Name' required/>
                            <input className='lname' onChange={handleChange} name='lastName' value={data.lastName} type='text' placeholder='Last Name' required/>
                        </div>
                        <input type='email' onChange={handleChange} name='email' value={data.email} placeholder='Email ID' required/>
                        <input type='password' onChange={handleChange} name='password' value={data.password} placeholder='Password' required/>
                        {error && <div className='error_msg'>{error}</div>}
                        <button type='submit'>Sign Up</button>
                        <p>Already have an account?<Link to='/login'><u>Login</u></Link>.</p>
                    </form>
                </div>
                <div className='signup-right'>
                    <img src={image} alt='Notemaking illustration'/>
                </div>
            </div>
        </div>
    )
}

export default SignUp;