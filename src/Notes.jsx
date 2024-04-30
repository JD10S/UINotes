import React, { useState, useEffect } from 'react';
import { Layout, AutoComplete, Card, Input } from 'antd'; 
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
    const baseUrl = "https://localhost:7169/NoteControllers";
    const [content, setContent] = useState('');
    const navigate = useNavigate(); 
    const cookies = new Cookies();
    const [selectedCategory, setSelectedCategory] = useState(null); 
    const [selectedCategoryName, setSelectedCategoryName] = useState('Notas');
    const [notes, setNotes] = useState([]);

    const loadNotes = async () => {
        try {
          const response = await axios.get(`${baseUrl}?IdCategory=${selectedCategory.idCategory}`);
          setNotes(response.data);
        } catch (error) {
          console.error("Error al cargar las notas:", error);
        }
    };
    
    useEffect(() => {
        if (selectedCategory) {
            loadNotes();
        }
    }, [selectedCategory]);

    const handleLogout = () => {
        cookies.remove('token');
        cookies.remove('userId');
        setSelectedCategory(null);
        setSelectedCategoryName('Notas');
        navigate('/');
    };

    const handleAddNote = () => {
        if (!selectedCategory) {
            console.error('No se ha seleccionado ninguna categoría.');
            return;
        }
        if (!content.trim()) {
            console.error('El contenido de la nota está vacío.');
            return;
        }
        axios.post(`${baseUrl}?IdCategory=${selectedCategory.idCategory}&Title=${encodeURIComponent(content)}`)
            .then(response => {
                setNotes(prevNotes => [...prevNotes, response.data]);
                setContent('');
            })
            .catch(error => {
                console.error('Error adding note:', error);
            });
    };

    const handleChangeNoteContent = (newContent) => {
        setContent(newContent);
    };
  
    return (
        <Layout className="notes-container">
            <Sider className='sidebar'>
                <Logo />
                <ExitButton onClick={handleLogout} className="exit-button" />
                <MenuList setSelectedCategoryName={setSelectedCategoryName} setSelectedCategory={setSelectedCategory} />
            </Sider>
            <Layout className="Nnotes-container" style={{ maxWidth: '400px' }}>
                <div className="title-and-button-container">
                    <h1 className='Title-Ntes' style={{ marginBottom: '20px', marginLeft: '40px', marginTop: '10px', whiteSpace:'nowrap',overflow: 'hidden' ,textOverflow:'ellipsis' }}>{selectedCategoryName}</h1>
                </div>
                <div className="button-plus" onClick={handleAddNote}>
                    <PlusOutlined />
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
                        {note.title}
                    </Card>
                ))}
            </Layout>
            <Layout style={{ overflow: 'hidden' }}>
                <ReactQuill
                    style={{ height: '93%' }}
                    theme="snow"
                    value={content}
                    onChange={handleChangeNoteContent}
                />
            </Layout>
        </Layout>
    );
}

export default Notes;
