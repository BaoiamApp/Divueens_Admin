import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
const apiUrl = import.meta.env.VITE_API_URL;

const AddProduct = () => {
    let navigator = useNavigate();
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: null,
        image: null,
    });

    useEffect(() => {
        fetch(`${apiUrl}/api/categories`)
            .then((res) => res.json())
            .then((data) => {
                setCategories(data);
                console.log(data, 'categories list');
            })
            .catch((e) => {
                console.log('Error:', e);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleCategoryChange = (e) => {
        const selectedCategory = categories.find(
            (category) => category.categoryName === e.target.value
        );
        setFormData({
            ...formData,
            category: selectedCategory,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            image: file,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const form = new FormData();
        form.append('name', formData.name);
        form.append('price', formData.price);
        form.append('description', formData.description);
        form.append('category', JSON.stringify(formData.category));
        form.append('image', formData.image);
        console.log("submit=>", JSON.stringify(formData.category));
        fetch(`${apiUrl}/api/products/`, {

            method: "post",
            // body: JSON.stringify(form),
            headers: {
                // 'auth-token': localStorage.getItem('token')
                'Authorization': `Bearer ${token}`,
            },
            body: form,
        })
            .then((res) => res.json())
            .then((data) => {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Item added successfully!',
                    showConfirmButton: false,
                    timer: 1500,
                });
                console.log(data, 'product added');
                navigator('/');
            })
            .catch((e) => {
                console.log('Error:', e);
            });

        setFormData({
            name: '',
            price: '',
            description: '',
            category: null,
            image: null,
        });
    };

    return (
        <Layout>
        <div className="max-w-sm mx-auto my-8 p-4 bg-white rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Add Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />

                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />

                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    rows="1"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                ></textarea>

                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                    name="category"
                    value={formData.category ? formData.category.categoryName : ''}
                    onChange={handleCategoryChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                >
                    <option value="" disabled>Select a category</option>
                    {categories.map((category) => (
                        <option key={category._id} value={category.categoryName}>
                            {category.categoryName}
                        </option>
                    ))}
                </select>

                <label className="block text-sm font-medium text-gray-700">Image</label>
                <input
                    type="file"
                    name="image"
                    onChange={handleImageChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />

                <button
                    type="submit"
                    className="bg-pink-500 text-white w-full py-2 px-4 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Add
                </button>
            </form>
        </div>
        </Layout>
    );
};

export default AddProduct
