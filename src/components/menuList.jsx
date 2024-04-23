import React, { useState, useEffect } from "react";
import { Button, Input, List, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import Cookies from 'universal-cookie';

const MenuList = () => {
  const baseUrl = "https://localhost:7169/CategoryControllers";
  const cookies = new Cookies();
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    const savedCategories = JSON.parse(localStorage.getItem("categories")) || [];
    setCategories(savedCategories);
  }, []);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  const handleChange = (e) => {
    setNewCategoryName(e.target.value);
  };

  const handleAddCategory = async ({ userId, idCategory }) => {
    try {
      if (newCategoryName.trim() !== "") {
        const response = await axios.post(`${baseUrl}?Name=${newCategoryName}&IdUser=${userId}&idCategory=${idCategory}`);
        const newCategory = response.data;
        setCategories([...categories, newCategory]); 
        setNewCategoryName("");
        message.success("Categoría añadida correctamente.");
      } else {
        message.error("Por favor ingresa el nombre de la categoría.");
      }
    } catch (error) {
      console.error("Error al agregar la categoría:", error);
      message.error("Error al agregar la categoría. Por favor, intenta de nuevo más tarde.");
    }
  };

  const handleEditCategory = async (category) => {
    try {
        const editedCategory = prompt(`Editando categoría: ${category.Name}`, category.Name);
        if (editedCategory && editedCategory.trim() !== "") {
            await axios.put(`https://localhost:7169/CategoryControllers/${category.id}`, {
                Name: editedCategory.trim()
            });
            const updatedCategories = categories.map(cat =>
                cat.id === category.id ? { ...cat, Name: editedCategory.trim() } : cat
            );
            setCategories(updatedCategories);
            message.success("Categoría editada correctamente.");
        } else {
            message.error("Por favor ingresa un nombre válido para la categoría.");
        }
    } catch (error) {
        console.error("Error al editar la categoría:", error);
        message.error("Error al editar la categoría. Por favor, intenta de nuevo más tarde.");
    }
};

const handleDeleteCategory = async (category) => {
  try {
      if (window.confirm(`¿Estás seguro de eliminar la categoría: ${category.Name}?`)) {
          await axios.delete(`https://localhost:7169/CategoryControllers/${category.id}`);
          const updatedCategories = categories.filter(cat => cat.id !== category.id);
          setCategories(updatedCategories);
          message.success("Categoría eliminada correctamente.");
      }
  } catch (error) {
      console.error("Error al eliminar la categoría:", error);
      message.error("Error al eliminar la categoría. Por favor, intenta de nuevo más tarde.");
  }
};

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
        onClick={() => handleAddCategory({ userId: cookies.get('userId'), idCategory: 1 })}
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
                key={item.id}
                className="category-item-container"
                style={{ color: "white", fontSize: "16px", fontWeight: "bold" }}
              >
                <span className="category-title">{item.Name}</span>
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
