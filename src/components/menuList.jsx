import React, { useState, useEffect } from "react";
import { Button, Input, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import Cookies from 'universal-cookie';

const MenuList = ({ setSelectedCategory }) => {
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

  const handleAddCategory = async () => {
    try {
      if (newCategoryName.trim() !== "") {
        const response = await axios.post(`${baseUrl}?Name=${newCategoryName}&IdUser=${cookies.get('userId')}`);
        const newCategory = response.data;
        setCategories([...categories, { Name: newCategoryName }]);
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
          {categories.map((category, index) => (
            <div key={index}  className="category-item"  style={{ color: "white" }}>
              {category.Name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuList;


 