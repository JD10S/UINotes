import React, {useState,useEffect} from 'react';
import { json, useNavigate  } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';


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
         if (data.length > 0) {
             var respuesta = data[0];
                cookies.post('id',respuesta.id,{path:'/'});
                cookies.post('userName',respuesta.userName,{path:'/'});
                cookies.post('password',respuesta.password,{path:'/'});
            alert("Bienvenido:" + respuesta.userName+"!");
             navigate('/Notes');
                
         } else {
             alert("Usuario o contraseña incorrectos");
         }
     } catch (error) {
         console.log(error);
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