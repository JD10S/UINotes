import React, { useState } from "react";
import { Button, Input, List, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from 'axios';
import Cookies from 'universal-cookie';

const MenuList = ({ handleCategoryClick }) => {
  const baseUrl ="https://localhost:7169/CategoryControllers";
  const cookies = new Cookies();
  const userId = cookies.get('userId');
  const [categories, setCategories] = useState({
    titulo:''
  });

  const handleChange=e=>{
    const {name, value} = e.target;
    setCategories({
        ...categories,
        [name]:value
    });
    console.log(categories)
}

  const handleAddCategory = async (userId) => {
    try {
        const response = await axios.post(`${baseUrl}?Name=${categories.titulo}&IdUser=${userId}`);
       
        console.log(response.data);
    } catch (error) {
      
        console.error("Error al agregar la categoría:", error);
    }
};

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddCategory();
    }
  };

  const handleEditCategory = (category) => {
    const editedCategory = prompt(`Editando categoría: ${category}`, category);
    if (editedCategory && editedCategory.trim() !== "") {
      const updatedCategories = categories.map((cat) =>
        cat === category ? editedCategory.trim() : cat
      );
      setCategories(updatedCategories);
      message.success("Categoría editada correctamente.");
    } else {
      message.error("Por favor ingresa un nombre válido para la categoría.");
    }
  };

  const handleDeleteCategory = (category) => {
    if (window.confirm(`¿Estás seguro de eliminar la categoría: ${category}?`)) {
      const updatedCategories = categories.filter((cat) => cat !== category);
      setCategories(updatedCategories);
      message.success("Categoría eliminada correctamente.");
    }
  };

  return (
    <div className="menu-container">
      <Input
        name="titulo"
        onChange={handleChange}
        onKeyPress={handleKeyPress}
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
          <List
            bordered={false}
            dataSource={categories}
            renderItem={(item) => (
              <List.Item
                className="category-item-container"
                style={{ color: "white", fontSize: "16px", fontWeight: "bold" }}
              >
                <span className="category-title">{item}</span>
                <div className="category-actions">
                  <Button
                    type="link"
                    onClick={() => handleEditCategory(item)}
                    className="edit-button"
                    style={{ color: "white", marginLeft: "8px" }}
                    icon={<EditOutlined />}
                  />
                  <Button
                    type="link"
                    onClick={() => handleDeleteCategory(item)}
                    className="delete-button" 
                    style={{ color: "white", marginLeft: "8px" }}
                    icon={<DeleteOutlined />}
                  />
                </div>
              </List.Item>
            )}
            style={{ marginTop: "10px" }} 
          />
        </div>
      )}
    </div>
  );
};

export default MenuList;
