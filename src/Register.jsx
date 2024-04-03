import React from 'react';
import { useNavigate } from 'react-router-dom';


const Register = () => {

    const navigate = useNavigate(); 

    const redirectToLogin = () => {
        navigate('/Loguin');
    };

    return (
        <div className="r-container">
            <span className='title'>Notes App</span>
            <span className='sub-title'>Register</span>
            <form >
                <input type='text' placeholder='Name'></input>
                <input type='password' placeholder='password'></input>
                <button>Register</button>
            </form>
            <p>Tienes cuenta? <span onClick={redirectToLogin}>Loguin</span></p>
        </div>
    );
}

export default Register;
