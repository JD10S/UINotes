import React, { useState, useEffect } from 'react';
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
    const navigate = useNavigate(); 
    const cookies = new Cookies();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null); 
    const [userName, setUserName] = useState('');
    const [selectedCategoryName, setSelectedCategoryName] = useState('Notas');
    const [notes, setNotes] = useState([]);
    
   
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
        const handleClickOutside = (event) => {
           
            const notesContainer = document.querySelector('.notes-container');
            if (notesContainer && !notesContainer.contains(event.target)) {
                setSelectedCategory(null);
                setSelectedCategoryName('Notas');
            }
        };
        document.addEventListener('click', handleClickOutside);

       
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);
   
    
    useEffect(() => {
        if (selectedCategory) {
            axios.get(`https://localhost:7169/NotesControllers/${selectedCategory.id}`, {
                headers: {
                    Authorization: `Bearer ${cookies.get('token')}`
                }
            })
            .then(response => {
                setNotes(response.data);
            })
            .catch(error => {
                console.error('Error fetching notes:', error);
            });
        }
    }, [selectedCategory]);

    const handleLogout = () => {
        cookies.remove('token');
        cookies.remove('userId');
        setUserName('');
        setCategories([]);
        setSelectedCategory(null);
        setSelectedCategoryName('Notas');
        navigate('/');
    };

   

  

    return (
        <Layout className="notes-container" >
            <Sider className='sidebar'>
                <Logo />
                <ExitButton onClick={handleLogout} className="exit-button" />
                <MenuList onsetSelectedCategory={setSelectedCategory} setSelectedCategoryName={setSelectedCategoryName} />
                


            </Sider>
            <Layout className="Nnotes-container" style={{ maxWidth: '400px' }}>
                <div className="title-and-button-container">
                    <h1 className='Title-Ntes' style={{ marginBottom: '20px', marginLeft: '40px', marginTop: '10px', whiteSpace:'nowrap',overflow: 'hidden' ,textOverflow:'ellipsis' }}>{selectedCategoryName}</h1>
                    
                </div>
                <div className="button-plus" >
                <PlusOutlined/>
                <span className="button-text">Añadir Nota</span>
                </div>
                <AutoComplete style={{ width: 230, marginTop: '20px', marginLeft: '90px' }}>
                    <Input suffix={<SearchOutlined />} placeholder="Buscar" />
                </AutoComplete>
                {notes.map(note => (
                    <Card 
                        key={note.id} 
                        style={{ width: 300, marginTop: '20px', marginLeft: '60px', cursor: 'pointer' }}
                    >
                        
                    </Card>
                ))}
            </Layout>
            <Layout style={{ overflow: 'hidden' }}>
                <ReactQuill
                    style={{ height: '93%' }}
                    theme="snow"
                    value={content}
                    onChange={(newContent) => handleChangeNoteContent(note.id, newContent)}
                />
            </Layout>
        </Layout>
    );
}

export default Notes;
