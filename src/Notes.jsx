import React, { useState, useEffect } from 'react';
import { Layout, AutoComplete, Card, Input, message, Button, Popconfirm } from 'antd'; 
import Logo from './components/logo';
import MenuList from './components/menuList';
import ExitButton from './components/buttonExit';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
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
    const [isCategoryDeleted, setIsCategoryDeleted] = useState(false); 
    const loadNotes = async () => {
        try {
            if (selectedCategory) {
                const response = await axios.get(`${baseUrl}/${selectedCategory.idCategory}`);
                setNotes(response.data);
            } else {
                setNotes([]);
            }
        } catch (error) {
            console.error("Error al cargar las notas:", error);
        }
    };
    
    useEffect(() => {
        loadNotes();
    }, [selectedCategory]); 

    useEffect(() => {
        setIsCategoryDeleted(false);
    }, [notes]); 

    const handleLogout = () => {
        cookies.remove('token');
        cookies.remove('userId');
        setSelectedCategory(null);
        setSelectedCategoryName('Notas');
        navigate('/');
    };

    const handleAddNote = () => {
        if (!selectedCategory || !selectedCategory.idCategory) {
            message.error('Por favor crea una categoria.');
            return;
        }
        const isEmptyContent = content === '<p><br></p>';

        if (isEmptyContent) {
            message.error('Por favor ingresa texto en la nota.');
            return;
        }
        console.log("Contenido antes de enviar la solicitud:", content);
        axios.post(`${baseUrl}?IdCategory=${selectedCategory.idCategory}&Title=${encodeURIComponent(content)}`)
        .then(response => {
            const newNote = response.data;
            setNotes(prevNotes => [...prevNotes, newNote]);
            loadNotes(); 
            message.success('Nota agregada correctamente.');
        })
        .catch(error => {
            console.error('Error adding note:', error);
        })  
        .finally(() => {
            
            setContent('');
        });
    };

    const handleChangeNoteContent = (newContent) => {
        setContent(newContent);
    };

    const updateNotes = (deletedCategoryId) => {
        setNotes(prevNotes => prevNotes.filter(note => note.idCategory !== deletedCategoryId));
        setSelectedCategory(null); 
        setSelectedCategoryName('Notas');
        setIsCategoryDeleted(true); 
    };
    // const handleSearch = async (value) => {
    //     setSearchText(value);
    //     try {
    //         const response = await axios.get(`${baseUrl}/search?query=${encodeURIComponent(value)}`);
    //         setSearchResults(response.data);
    //     } catch (error) {
    //         console.error("Error al buscar notas:", error);
    //     }
    // };

    const handleEditNote = (noteId) => {
        
        console.log("Editar nota con ID:", noteId);
    };

    const handleDeleteNote = async (noteId) => {
      
        try {
            const response = await axios.delete(`${baseUrl}?id=${noteId}`);
            loadNotes();
            
          } catch (error) {
            console.error("Error al eliminar la nota:", error);
            message.error("Error al eliminar la nota. Por favor, intenta de nuevo más tarde.");
          }
    };

    return (
        <Layout className="notes-container">
            <Sider className='sidebar'>
                <Logo />
                <ExitButton onClick={handleLogout} className="exit-button" />
                <MenuList setSelectedCategoryName={setSelectedCategoryName} setSelectedCategory={setSelectedCategory} updateNotes={updateNotes} />
            </Sider>
            <Layout className="Nnotes-container" style={{ maxWidth: '400px' }}>
                <div className="title-and-button-container">
                    <h1 className='Title-Ntes' style={{ marginBottom: '20px', marginLeft: '40px', marginTop: '10px', whiteSpace:'nowrap',overflow: 'hidden' ,textOverflow:'ellipsis' }}>{selectedCategoryName}</h1>
                </div>
                <div className="button-plus" onClick={handleAddNote} disabled={!selectedCategory}>
                    <PlusOutlined />
                    <span className="button-text">Añadir Nota</span>
                </div>
                <AutoComplete style={{ width: 230, marginTop: '20px', marginLeft: '90px' }}>
                    <Input suffix={<SearchOutlined />} placeholder="Buscar" />
                </AutoComplete>
                <div style={{ maxHeight: 'calc(100vh - 129px)', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', '&::-webkit-scrollbar': { display: 'none' } }} >
                {notes && notes.map(note => (
                    <Card 
                        key={note.id} 
                        style={{ width: 300, marginTop: '20px', marginLeft: '60px', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', wordWrap: 'break-word' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ maxWidth: '80%', overflow: 'hidden', textOverflow: 'ellipsis' }}>{note.title && note.title.replace(/<\/?[^>]+(>|$)/g, "")}</span>
                            <div>
                                <Button type="link" icon={<EditOutlined />} onClick={() => handleEditNote(note.id)}></Button>
                                <Popconfirm
                                    title="¿Estás seguro que quieres eliminar esta nota?"
                                    onConfirm={() => handleDeleteNote(note.id)}
                                    okText="Sí"
                                    cancelText="No"
                                >
                                    <Button type="link" icon={<DeleteOutlined />} danger></Button>
                                </Popconfirm>
                            </div>
                        </div>
                    </Card>
                ))}
                </div>
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
