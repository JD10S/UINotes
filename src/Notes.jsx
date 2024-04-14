import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import Logo from './components/logo';
import MenuList from './components/menuList';
import ExitButton from './components/buttonExit';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

const { Sider } = Layout;

const Notes = () => {
    const navigate = useNavigate(); 
    const cookies = new Cookies();
    const [username, setUsername] = useState('');

    
    const decodeToken = (token) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    };

    useEffect(() => {
        const token = cookies.get('token');
        if (token) {
            const decodedToken = decodeToken(token);
            setUsername(decodedToken.username);
        } else {
            navigate('/');
        }
    }, []);

    const handleLogout = () => {
        cookies.remove('token');
        setUsername('');
        navigate('/');
    };

    return (
        <Layout className="notes-container">
            <Sider className='sidebar'>
                <Logo />
                <span className="username">{username}</span>
                <ExitButton onClick={handleLogout} className="exit-button" />
                <MenuList />
            </Sider>
        </Layout>
    );
}

export default Notes;
