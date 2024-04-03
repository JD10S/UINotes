import React from 'react';

const Register = () => {
    return (
        <div className="r-container">
            <span className='title'>Notes App</span>
            <span className='sub-title'>Register</span>
            <form >
                <input type='text' placeholder='Name'></input>
                <input type='password' placeholder='password'></input>
                <button>Register</button>
            </form>
            <p>Tienes cuenta? Loguin</p>
        </div>
    );
}

export default Register;
