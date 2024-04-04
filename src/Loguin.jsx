import React from 'react';
import { useNavigate  } from 'react-router-dom';

const Login = () => {

    const navigate = useNavigate();

    const redirectToLogin = () => {
        navigate('/Register');
    };
 
    const handleLogin = (e) => {
        e.preventDefault(); 
        navigate('/Notes');
    };
    return (
        <div className="r-container">
            <span className='title'>Notes App</span>
            <span className='sub-title'>Login</span>
            <form onSubmit={handleLogin}>
                <input type='text' placeholder='Name'></input>
                <input type='password' placeholder='password'></input>
                <button type="submit">Login</button>
            </form>
            <p>No Tienes Cuenta? <span onClick={redirectToLogin}>Register</span></p>
        </div>
    );
}

export default Login;
