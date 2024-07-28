import React, { useState, useEffect } from 'react';
import { FaEdit, FaList, FaPlus, FaTrashAlt } from 'react-icons/fa'; // Import FaList and FaPlus icons
import Layout from '../Layout';
const apiUrl = import.meta.env.VITE_API_URL;
import { addCategory, deleteCategory, updateCategory } from './categoryApi';


const Category = () => {

  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');


  useEffect(() => {
    fetch(`${apiUrl}/api/categories`).then((res) => {
      res.json().then(data => {
        setCategories(data)
        console.log(data, "categories list")
      })
    }).catch(e => { console.log('Error:', e) })
  }, [])

  const handleAddCategory = () => {
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (newCategoryName.trim() === '') return;
    try {
      const response = await addCategory({ categoryName: newCategoryName });
      console.log(`Category added: ${response.categoryName}`);
      setCategories([...categories, response]);
    } catch (error) {
      console.log(error.response ? error.response.data.message : error.message);
    }
    setNewCategoryName('');
    setShowForm(false);
  };

  const handleDeleteCategory = async (id) => {
    try {
      const response = await deleteCategory(id);
      setCategories(categories.filter(category => category._id !== id));
    } catch (error) {
      console.log('Error while deleting categories:', error)
    }
  };

  const handleEditCategory = (id, categoryName) => {
    console.log("it cliked", id, "   ", categoryName);
    setEditCategoryId(id);
    setEditCategoryName(categoryName);
  };

  const handleEditFormSubmit = async (e) => {
    console.log('updating ress...', e)
    e.preventDefault();
    if (editCategoryName.trim() === '') return;
    const response = await updateCategory(editCategoryId, { editCategoryName });
    console.log(response, 'updating ress...')
    setCategories(categories.map(category =>
      category._id === editCategoryId ? { ...category, categoryName: editCategoryName } : category
    ));
    setEditCategoryId(null);
    setEditCategoryName('');
  };

  return (
    <>
      <Layout>

        <div className="container mx-auto px-4 py-4 mt-[.5rem] mb-[3rem]">
          <div className="flex items-center mb-4">
            <FaList className="text-2xl text-pink-500 mr-2" />
            <h2 className="text-2xl">CATEGORIES</h2>
            <button
              onClick={handleAddCategory}
              className="ml-auto flex items-center bg-pink-400 text-white px-4 py-2 rounded-md hover:bg-pink-500 focus:outline-none"
            >
              <FaPlus className="mr-2" />
              Add Category
            </button>
          </div>
          {showForm && (
            <form onSubmit={handleFormSubmit} className="mb-4">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name"
                className="px-4 py-2 border rounded-md mr-2"
              />
              <button
                type="submit"
                className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-400"
              >
                Add
              </button>
            </form>
          )}
          <div className="bg-white shadow-md rounded-lg my-6">
            {/* Header Row */}
            <div className="flex items-center bg-pink-300 px-4 py-2">
              <div className="w-1/12 text-center text-white">S.No</div> {/* Serial number column */}
              <div className="w-5/12 px-4 text-white">NAME</div>
              <div className="w-5/12 flex justify-end text-white">FEATURES</div>
            </div>

            {/* Category Rows */}
            {categories.map((category, index) => (
              <div key={category._id} className="flex items-center border-b border-gray-200 hover:shadow-lg hover:shadow-pink-100">
                <div className="w-1/12 text-center px-4 py-2 text-gray-500">{index + 1}</div> {/* Display index + 1 for S.No */}
                <div className="w-5/12 px-4 py-2 text-gray-500">
                  {editCategoryId === category._id ? (
                    <form onSubmit={handleEditFormSubmit} className="flex items-center">
                      <input
                        type="text"
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                        className="px-2 py-1 border rounded-md"
                      />
                      <button type="submit" className="ml-2 bg-pink-500 text-white px-2 py-1 rounded-md hover:bg-pink-400">
                        Save
                      </button>
                    </form>
                  ) : (
                    category.categoryName
                  )}
                </div>
                <div className="w-5/12 flex justify-end px-4 py-2 space-x-4">
                  <button
                    className="text-yellow-400 mr-4"
                    onClick={() => handleEditCategory(category._id, category.categoryName)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => handleDeleteCategory(category._id)}
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Category


