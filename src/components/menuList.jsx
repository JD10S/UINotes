import React, { useState, useEffect } from "react";
import { Button, Input, message,Popconfirm } from "antd";
import { PlusOutlined,EditOutlined,DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import Cookies from 'universal-cookie';
import { indexedDBLocalPersistence } from "firebase/auth";

const MenuList = ({ onsetSelectedCategory }) => {
  const baseUrl = "https://localhost:7169/CategoryControllers";
  const cookies = new Cookies();
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);


  const loadCategory = async () =>{
    try {
      const response = await axios.get(`${baseUrl}/${cookies.get('userId')}`);
      console.log(response)
      setCategories(response.data)
    } catch (error) {
      
    }
  }
  useEffect(()=>{
    loadCategory().then()
  },[])

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };
  
  const handleChange = (e) => {
    setNewCategoryName(e.target.value);
  };

  const handleAddCategory = async () => {
    try {
      if (newCategoryName.trim() !== "") {
        const response = await axios.post(`${baseUrl}?Name=${newCategoryName}&IdUser=${cookies.get('userId')}`);
        setNewCategoryName("");
        loadCategory().then();
        message.success("Categoría añadida correctamente.");
      } else {
        message.error("Por favor ingresa el nombre de la categoría.");
      }
    } catch (error) {
      console.error("Error al agregar la categoría:", error);
      message.error("Error al agregar la categoría. Por favor, intenta de nuevo más tarde.");
    }
  };

  const handleEdit = async (idCategory) =>{
    try {
      if (newCategoryName.trim() !== "") {
        const response = await axios.put(`${baseUrl}?Name=${newCategoryName}&idCategory=${idCategory}&IdUser=${cookies.get('userId')}`);
        setNewCategoryName("");
        loadCategory().then();
        message.success("Categoría editada correctamente.");
      } else {
        message.error("Por favor ingresa el nombre de la categoría.");
      }
    } catch (error) {
      console.error("Error al editar la categoría:", error);
      message.error("Error al editar la categoría. Por favor, intenta de nuevo más tarde.");
    }
  };
  

  const handleDelete = async (idCategory) =>{
    try {
      const response = await axios.delete(`${baseUrl}?id=${idCategory}`)
      loadCategory().then();
    } catch (error) {
      
    }
    
  }

  return (
    <div className="menu-container">
      <Input
        value={newCategoryName}
        onChange={handleChange}
        placeholder="Nueva categoría"
        style={{ marginBottom: "10px" }}
      />
      <Button
        type="text"
        icon={<PlusOutlined />}
        onClick={handleAddCategory}
        style={{ color: "white", marginBottom: "10px" }}
      >
        Añadir Categoría
      </Button>
      {categories.length > 0 && (
        <div className="category-list-container">
          {categories.map(category => (
            <div
              key={indexedDBLocalPersistence} 
              className={`category-item ${selectedCategory === category ? 'selected' : ''}`}
              style={{ color: "white" }}
              onClick={() => handleCategoryClick(category)}
            >
              {category.name}
              <div className="category-actions">
                        <EditOutlined onClick={() => handleEdit(category.idCategory)} />
                        <Popconfirm
                          title="¿Estás seguro que quieres eliminar esta categoría?"
                          onConfirm={() => handleDelete(category.idCategory)}
                          okText="Sí"
                          cancelText="No"
                        >
                          <DeleteOutlined />
                        </Popconfirm>
                      </div>
            </div>
            
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuList;
