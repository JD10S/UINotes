import React, { useState, useEffect } from 'react';
import { Layout, AutoComplete, Card, Input, message, Button, Popconfirm,Modal } from 'antd'; 
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
    const [originalContent, setOriginalContent] = useState('');
    const navigate = useNavigate(); 
    const cookies = new Cookies();
    const [selectedCategory, setSelectedCategory] = useState(null); 
    const [selectedCategoryName, setSelectedCategoryName] = useState('Notas');
    const [notes, setNotes] = useState([]);
    const [isCategoryDeleted, setIsCategoryDeleted] = useState(false); 
    const [filteredNotes, setFilteredNotes] = useState([]);



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
    const handleCardClick = (noteContent) => {
        setContent(noteContent);
        setOriginalContent(noteContent);
    };

    const updateNotes = (deletedCategoryId) => {
        setNotes(prevNotes => prevNotes.filter(note => note.idCategory !== deletedCategoryId));
        setSelectedCategory(null); 
        setSelectedCategoryName('Notas');
        setIsCategoryDeleted(true); 
    };
    

    const handleEditNote = async (noteId) => {
        try {
            const newNoteContent = content;
            if (newNoteContent !== originalContent) {
                Modal.confirm({
                    title: 'Guardar cambios',
                    content: '¿Desea guardar los cambios realizados en la nota?',
                    onOk: async () => {
                        
                        const response = await axios.put(`${baseUrl}?id=${noteId}&Title=${newNoteContent}`);
                        console.log('Nota actualizada correctamente:', response.data);
                        
                        setNotes(prevNotes =>
                            prevNotes.map(note =>
                                note.id === noteId ? { ...note, title: newNoteContent } : note
                            )
                        );
                        
                        setOriginalContent(newNoteContent);
                       
                        setContent(newNoteContent);
                    },
                    onCancel: () => {
                        console.log('No se realizaron cambios en la nota.');
                    },
                });
            } else {
                console.log('No se realizaron cambios en la nota.');
            }
        } catch (error) {
            console.error('Error al editar la nota:', error);
            message.error('Error al editar la nota. Por favor, inténtalo de nuevo más tarde.');
        }
    };
    

    const handleDeleteNote = async (noteId) => {
      
        try {
            const response = await axios.delete(`${baseUrl}?id=${noteId}`);
            loadNotes();
            setContent('');
          } catch (error) {
            console.error("Error al eliminar la nota:", error);
            message.error("Error al eliminar la nota. Por favor, intenta de nuevo más tarde.");
          }
    };
    const handleSearch = (value) => {
        if (value === '') {
            loadNotes();
        } else {
            const filtered = notes.filter(note =>
                note.title.toLowerCase().includes(value.toLowerCase())
            );
            const sortedNotes = filtered.sort((a, b) => {
                if (a.title.toLowerCase().startsWith(value.toLowerCase())) {
                    return -1; 
                } else if (b.title.toLowerCase().startsWith(value.toLowerCase())) {
                    return 1; 
                } else {
                    return 0; 
                }
            });
            setNotes(sortedNotes);
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
                <AutoComplete
                    style={{ width: 230, marginTop: '20px', marginLeft: '90px' }}
                    onSearch={handleSearch}
                    placeholder="Buscar"
                >
                    <Input suffix={<SearchOutlined />} />
                </AutoComplete>
                <div style={{ maxHeight: 'calc(100vh - 129px)', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', '&::WebkitScrollbar': { display: 'none' } }} >
                {notes && notes.map(note => (
                    <Card 
                        key={note.id} 
                        style={{ width: 300, marginTop: '20px', marginLeft: '60px', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', wordWrap: 'break-word' }}
                        onClick={() => handleCardClick(note.title)}
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
