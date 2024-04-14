import React, { useState } from "react";
import { Menu, Input, message, Button, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { SubMenu } = Menu;

const MenuList = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategoryIndex, setEditingCategoryIndex] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState("");

  const handleNewCategoryNameChange = (e) => {
    setNewCategoryName(e.target.value);
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim() !== "") {
      setCategories([...categories, { name: newCategoryName.trim(), tasks: [] }]);
      setNewCategoryName("");
      setIsAddingCategory(false);
    } else {
      message.error("Por favor ingrese un título para la categoría.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddCategory();
    }
  };

  const handleToggleAddingCategory = () => {
    setIsAddingCategory(!isAddingCategory);
    if (!isAddingCategory) {
      setNewCategoryName("");
    }
  };

  const handleCategoryClick = () => {
    setIsAddingCategory(true);
  };

  const handleEditCategoryNameChange = (e) => {
    setEditedCategoryName(e.target.value);
  };

  const handleEditCategory = (index) => {
    setEditingCategoryIndex(index);
    setEditedCategoryName(categories[index].name);
  };

  const handleSaveEditedCategory = (index) => {
    if (editedCategoryName.trim() !== "") {
      setCategories((prevCategories) =>
        prevCategories.map((category, i) =>
          i === index ? { ...category, name: editedCategoryName.trim() } : category
        )
      );
      setEditingCategoryIndex(null);
      setEditedCategoryName("");
    } else {
      message.error("Por favor ingrese un título para la categoría.");
    }
  };

  const handleDeleteCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  return (
    <div className="menu-container">
      <div className="categories-input">
        {isAddingCategory ? (
          <Input
            placeholder="Nuevo título"
            value={newCategoryName}
            onChange={handleNewCategoryNameChange}
            onPressEnter={handleAddCategory}
            autoFocus
          />
        ) : (
          <Button
            type="text"
            icon={<PlusOutlined />}
            onClick={handleCategoryClick}
            style={{ color: "white" }}
          >
            Categorías
          </Button>
        )}
      </div>
      <Menu theme="dark" className="menu-bar">
        {categories.map((category, index) => (
          <SubMenu
            key={index}
            title={
              <span className="category-title">
                {index === editingCategoryIndex ? (
                  <Input
                    value={editedCategoryName}
                    onChange={handleEditCategoryNameChange}
                    onPressEnter={() => handleSaveEditedCategory(index)}
                    onBlur={() => handleSaveEditedCategory(index)}
                  />
                ) : (
                  <>
                    {category.name}
                    {category.name.length > 10 && ( 
                      <div className="category-actions">
                        <EditOutlined onClick={() => handleEditCategory(index)} />
                        <Popconfirm
                          title="¿Estás seguro que quieres eliminar esta categoría?"
                          onConfirm={() => handleDeleteCategory(index)}
                          okText="Sí"
                          cancelText="No"
                        >
                          <DeleteOutlined />
                        </Popconfirm>
                      </div>
                    )}
                  </>
                )}
                {category.name.length <= 10 && ( 
                  <span className="category-actions">
                    <EditOutlined onClick={() => handleEditCategory(index)} />
                    <Popconfirm
                      title="¿Estás seguro que quieres eliminar esta categoría?"
                      onConfirm={() => handleDeleteCategory(index)}
                      okText="Sí"
                      cancelText="No"
                    >
                      <DeleteOutlined />
                    </Popconfirm>
                  </span>
                )}
              </span>
            }
          />
        ))}
      </Menu>
    </div>
  );
};

export default MenuList;
