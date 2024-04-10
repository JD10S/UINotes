import React, { useEffect } from 'react';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';


const Notes = (props) => {

    const navigate  = useNavigate();
    const cookies = new Cookies();

    const cerrarSesion=()=>{
        cookies.remove('id',{path:'/'});
        cookies.remove('username',{path:'/'});
        cookies.remove('password',{path:'/'});
        navigate('/');
        
    }

    useEffect(()=>{
        if (!cookies.get('id')) {
            navigate('/Notes'); 
        }
    }, []);
    

    return (
        <div className='n-container'>
            <br />
            <button className='btn btn-danger' onClick={()=>cerrarSesion()}>Cerrar Sesion</button>
            <br />
            <h1>Notes</h1>
            <br />
            <h5>Iduser: {cookies.get('id')}</h5>
            <br />
            <h5>Usuario: {cookies.get('username')}</h5>
            <br />
            <h5>Contraseña: {cookies.get('password')}</h5>
        </div>
    );
}

export default Notes;
