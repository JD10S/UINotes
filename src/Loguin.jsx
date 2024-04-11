import React, {useState,useEffect} from 'react';
import { json, useNavigate  } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Notes from './Notes';


const Login = () => {

    const baseUrl ="https://localhost:7169/UserControllers/loguin";
    const navigate = useNavigate();
    const cookies = new Cookies();
    const [form, setForm]= useState({
        userName:'',
        password:''
    });
    
    const handleChange=e=>{
        const {name, value} = e.target;
        setForm({
            ...form,
            [name]:value
        });
        console.log(form)
    }


    const redirectToLogin = () => {
        navigate('/Register');
    };

     useEffect(()=>{
            if (!cookies.get('id')) {
                navigate('/'); 
            }
     }, []);
     
     const iniciarSesion=async()=>{
     try {
         const response = await axios.post(`${baseUrl}?userName=${form.userName}&password=${form.password}`);
         const data = response.data;
        
         if (data.token) {
             cookies.set('token', data.token, { path: '/' });
             cookies.set('userId', data.user.id, { path: '/' });
             alert("¡Bienvenido: " + data.user.userName + "!");
             navigate('/Notes');
         } else {
             alert("Usuario o contraseña incorrectos");
         }
     } catch (error) {
         console.log(error);
         alert("Usuario o contraseña incorrectos");
     }
 }
 
    return (
        <div className="r-container">
            <span className='title'>Notes App</span>
            <span className='sub-title'>Login</span>
            <form onSubmit={e => e.preventDefault()}>
                <input name='userName' type='text' placeholder='Name' onChange={handleChange}></input>
                <input name='password' type='password' placeholder='password' onChange={handleChange}></input>
                <button  onClick={()=>iniciarSesion()}>Login</button>
            </form>
            <p>No Tienes Cuenta? <span onClick={redirectToLogin}>Register</span></p>
        </div>
    );
}

export default Login;

    // const handleLogin = (e) => {
    //     e.preventDefault(); 
    //     navigate('/Notes');
    // };
//https://localhost:7169/UserControllers/loguin?userName=jeffer&password=123
  

    // const iniciarSesion = async () => {
    //     if (!form.userName || !form.password) {
    //         alert("Por favor, ingresa tanto el nombre de usuario como la contraseña");
    //         return;
    //     }

    //     try {
    //         const response = await axios.post(baseUrl, {
    //             userName: form.userName,
    //             password: form.password
    //         });
    //         const data = response.data;
    //         if (data.token) {
    //             cookies.post('token', data.token, { path: '/' });
    //             navigate('/Notes');
    //         } else {
    //             alert("Usuario o contraseña incorrectos");
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         alert("Se produjo un error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.");
    //     }
    // }