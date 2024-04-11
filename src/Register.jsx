import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';

const Register = () => {
    const baseUrl ="https://localhost:7169/UserControllers";
    const navigate = useNavigate();
    const cookies = new Cookies();
    const [form, setForm]= useState({
        userName:'',
        password:''
    });

    const [error, setError] = useState('');
    const handleChange=e=>{
        const {name, value} = e.target;
        setForm({
            ...form,
            [name]:value
        });
        console.log(form)
    }

    const redirectToLogin = () => {
        navigate('/Loguin');
    };
  

    const Registrarse=async()=>{
        try {
            const response = await axios.post(`${baseUrl}?userName=${form.userName}&password=${form.password}`);
            const data = response.data;
            if (response.status === 200) { 
                alert("Usuario registrado correctamente: " + form.userName);
                navigate('/Loguin');
            } else {
                setError(data.message || 'Error al registrar usuario');
            }
        } catch (error) {
            console.log(error);
            setError('Error al registrar usuario, Ingrese usuario y contraseña' );
        }
    }

    return (
        <div className="r-container">
            <span className='title'>Notes App</span>
            <span className='sub-title'>Register</span>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={e => e.preventDefault()}>
                <input name='userName' type='text' placeholder='Name' value={form.userName} onChange={handleChange}></input>
                <input name='password' type='password' placeholder='Password' value={form.password} onChange={handleChange}></input>
                <button onClick={Registrarse}>Register</button>
            </form>
            <p>¿Ya tienes cuenta? <span onClick={redirectToLogin}>Login</span></p>
        </div>
    );
}

export default Register;