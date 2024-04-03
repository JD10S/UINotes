import React from 'react';
import { useNavigate  } from 'react-router-dom';

const Login = () => {

    const navigate = useNavigate();

    const redirectToLogin = () => {
        navigate('/Register');
    };

    return (
        <div className="r-container">
            <span className='title'>Notes App</span>
            <span className='sub-title'>Login</span>
            <form >
                <input type='text' placeholder='Name'></input>
                <input type='password' placeholder='password'></input>
                <button>Login</button>
            </form>
            <p>No Tienes Cuenta? <span onClick={redirectToLogin}>Register</span></p>
        </div>
    );
}

export default Login;
