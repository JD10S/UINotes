import React, { useState, useEffect } from "react";
import { Button, Input, message, Popconfirm, Modal, Form } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import Cookies from 'universal-cookie';

const MenuList = ({ setSelectedCategoryName, setSelectedCategory }) => {
  const baseUrl = "https://localhost:7169/CategoryControllers";
  const cookies = new Cookies();
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategoryState] = useState(null);
  // const [editingCategory, setEditingCategory] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");

  const loadCategory = async () => {
    try {
      const response = await axios.get(`${baseUrl}/${cookies.get('userId')}`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error al cargar las categorías:", error);
    }
  };

  useEffect(() => {
    loadCategory();
  }, []);

  const handleChange = (e) => {
    setNewCategoryName(e.target.value);
  };

  const handleCategoryDoubleClick = (category) => {
    console.log(`Categoría "${category.name}" seleccionada.`);
    console.log(`"${category.idCategory}"`);
    setSelectedCategoryName(category ? category.name : 'Notas');
    setSelectedCategory(category);
    // setEditingCategory(category);
  };

  const handleAddCategory = async () => {
    try {
      if (newCategoryName.trim() !== "") {
        const response = await axios.post(`${baseUrl}?Name=${newCategoryName}&IdUser=${cookies.get('userId')}`);
        setNewCategoryName("");
        loadCategory();
        message.success("Categoría añadida correctamente.");
      } else {
        message.error("Por favor ingresa el nombre de la categoría.");
      }
    } catch (error) {
      console.error("Error al agregar la categoría:", error);
      message.error("Error al agregar la categoría. Por favor, intenta de nuevo más tarde.");
    }
  };

  const handleEdit = async () => {
    try {
      if (editingCategory && editingCategoryName.trim() !== "") {
        const response = await axios.put(`${baseUrl}?Name=${editingCategoryName}&idCategory=${editingCategory.idCategory}&IdUser=${cookies.get('userId')}`);
        setEditModalVisible(false);
        setEditingCategory(null);
        loadCategory();
        message.success("Categoría editada correctamente.");
        setSelectedCategoryName(editingCategoryName);
      } else {
        message.error("Por favor ingresa el nombre de la categoría.");
      }
    } catch (error) {
      console.error("Error al editar la categoría:", error);
      message.error("Error al editar la categoría. Por favor, intenta de nuevo más tarde.");
    }
  };

  const handleDelete = async (idCategory) => {
    try {
      const response = await axios.delete(`${baseUrl}?id=${idCategory}`);
      loadCategory();
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
        onClick={handleAddCategory}
        style={{ color: "white", marginBottom: "10px" }}
      >
        Añadir Categoría
      </Button>
      {categories.length > 0 && (
        <div className="category-list-container">
          {categories.map(category => (
            <div
              key={category.idCategory}
              className={`category-item ${selectedCategory === category ? 'selected' : ''}`}
              style={{ color: "white" }}
              onDoubleClick={() => handleCategoryDoubleClick(category)}
            >
              <div className="category-name">{category.name}</div>
              <div className="category-actions">
                <div className="icon-container">
                  <EditOutlined onClick={() => { setEditingCategory(category); setEditingCategoryName(category.name); setEditModalVisible(true); }} />
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
            </div>
          ))}
        </div>
      )}
      <Modal
        title="Editar Categoría"
        open={editModalVisible}
        onCancel={() => { setEditModalVisible(false); setEditingCategory(null); setNewCategoryName(""); }}
        footer={[
          <Button key="cancel" onClick={() => { setEditModalVisible(false); setEditingCategory(null); setNewCategoryName(""); }}>Cancelar</Button>,
          <Button key="edit" type="primary" onClick={handleEdit}>Editar</Button>,
        ]}
      >
        <Form>
          <Form.Item label="Nombre de la Categoría">
            <Input value={editingCategoryName} onChange={(e) => setEditingCategoryName(e.target.value)} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MenuList;

// const [categories, setCategories] = useState([]);