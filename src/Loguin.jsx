import React from 'react';

const Login = () => {
    return (
        <div className="r-container">
            <span className='title'>Notes App</span>
            <span className='sub-title'>Login</span>
            <form >
                <input type='text' placeholder='Name'></input>
                <input type='password' placeholder='password'></input>
                <button>Login</button>
            </form>
            <p>No Tienes Cuenta? Loguin</p>
        </div>
    );
}

export default Login;
