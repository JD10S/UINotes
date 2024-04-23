import React, { useEffect, useState } from 'react';
import { Layout, AutoComplete, Card, Button, Input, message } from 'antd'; 
import Logo from './components/logo';
import MenuList from './components/menuList';
import ExitButton from './components/buttonExit';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { Sider } = Layout;

const Notes = () => {
    const [content, setContent] = useState('');
    const [cards, setCards] = useState([]);
    const [selectedCardId, setSelectedCardId] = useState(null);
    const navigate = useNavigate(); 
    const cookies = new Cookies();
    const [userName, setUserName] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null); 

    useEffect(() => {
        const token = cookies.get('token');
        const userId = cookies.get('userId');
        
        if (token && userId) {
            const storedCategories = localStorage.getItem(`${userId}_categories`);
            if (storedCategories) {
                setCategories(JSON.parse(storedCategories));
            } else {
                axios.get(`https://localhost:7169/CategoryControllers/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(response => {
                    setCategories(response.data);
                    localStorage.setItem(`${userId}_categories`, JSON.stringify(response.data));
                })
                .catch(error => {
                    console.error('Error fetching categories:', error);
                });
            }
        } else {
            navigate('/');
        }
    }, []);

    const handleLogout = () => {
        cookies.remove('token');
        cookies.remove('userId');
        setUserName('');
        setCategories([]);
        setSelectedCategory(null);
        navigate('/');
    };

    const handleAddCard = () => {
        const newCard = {
            id: cards.length,
            content: ''
        };
        setCards(prevCards => [...prevCards, newCard]);
    };

    const handleCardClick = (cardId, cardContent) => {
        setSelectedCardId(cardId);
        setContent(cardContent);
    };

    const handleContainerClick = () => {
        setSelectedCardId(null);
    };

    return (
        <Layout className="notes-container" onClick={handleContainerClick}>
            <Sider className='sidebar'>
                <Logo />
                <ExitButton onClick={handleLogout} className="exit-button" />
                <MenuList setSelectedCategory={setSelectedCategory} />
            </Sider>
            <Layout className="Nnotes-container" style={{ maxWidth: '400px' }}>
                <div className="title-and-button-container">
                    <h1 className='Title-Ntes' style={{ marginBottom: '20px', marginLeft: '40px', marginTop: '10px' }}>{selectedCategory || 'Notas'}</h1>
                    <Button type="primary" icon={<PlusOutlined />} style={{ marginLeft: '10px' }} onClick={handleAddCard} />
                </div>
                <AutoComplete style={{ width: 230, marginTop: '20px', marginLeft: '90px' }}>
                    <Input suffix={<SearchOutlined />} placeholder="Buscar" />
                </AutoComplete>
                {cards.map(card => (
                    <Card 
                        key={card.id} 
                        style={{ width: 300, marginTop: '20px', marginLeft: '60px', cursor: 'pointer', backgroundColor: selectedCardId === card.id ? '#f0f0f0' : 'white' }}
                        onClick={() => handleCardClick(card.id, card.content)}
                    >
                        <p className="limited-height-content">{card.content}</p>
                    </Card>
                ))}
            </Layout>
            <Layout style={{ overflow: 'hidden' }}>
                <ReactQuill
                    style={{ height: '93%' }}
                    theme="snow"
                    value={content}
                    onChange={setContent}
                />
            </Layout>
        </Layout>
    );
}

export default Notes;
