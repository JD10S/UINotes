import React, {useState} from 'react';
import { json, useNavigate  } from 'react-router-dom';
import md5 from 'md5';
import { Axios } from 'axios';

const Login = () => {

    const baseUrl ="https://localhost:7169/UserControllers/loguin";


    const [form, setForm]= useState({
        username:'',
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

    const navigate = useNavigate();

    const redirectToLogin = () => {
        navigate('/Register');
    };


 
    const handleLogin = (e) => {
        e.preventDefault(); 
        navigate('/Notes');
    };

    const iniciarSesion=async()=>{
        await Axios.get(baseUrl+`/${form.username}/${md5(form.password)}`)
        .then(Response=>{
            return Response.data;
        }).then(Response=>{
            if(Response.length>0){
                var respuesta=Response[0];
                console.log(respuesta);
            }else {
                alert('El usuario o la contraseña son incorrectos')
            }

        })
        
        .Catch(Error=>{
            console.log(Error)
        })
    }
    return (
        <div className="r-container">
            <span className='title'>Notes App</span>
            <span className='sub-title'>Login</span>
            <form onSubmit={handleLogin}>
                <input name='username' type='text' placeholder='Name' onChange={handleChange}></input>
                <input name='password' type='password' placeholder='password' onChange={handleChange}></input>
                <button type="submit" onClick={()=>iniciarSesion()}>Login</button>
            </form>
            <p>No Tienes Cuenta? <span onClick={redirectToLogin}>Register</span></p>
        </div>
    );
}

export default Login;
