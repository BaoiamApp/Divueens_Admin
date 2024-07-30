import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from './Layout';

const apiUrl = import.meta.env.VITE_API_URL;

const ChangeProduct = () => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        category: "", // Store category ID
        image: null,
    });

    const { _id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/categories`);
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchProduct = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/product/${_id}`);
                if (response.ok) {
                    const data = await response.json();
                    setFormData({
                        name: data.name,
                        price: data.price,
                        description: data.description,
                        category: data.category, // Use category
                        image: data.imageUrl,
                    });
                } else {
                    throw new Error('Product not found');
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchCategories().then(fetchProduct);
    }, [_id]); // Fetch data whenever _id changes

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleCategoryChange = (e) => {
        const selectedcategory = e.target.value;
        setFormData({
            ...formData,
            category: selectedcategory,
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
        form.append('category', formData.category); // Use category
        form.append('image', formData.image);

        fetch(`${apiUrl}/api/products/${_id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: form,
        })
        .then((res) => res.json())
        .then((data) => {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Item updated successfully!",
                showConfirmButton: false,
                timer: 1500,
            });
            navigate("/");
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    return (
        <Layout>
            <div>
                <h2 className="text-3xl text-center font-semibold mb-4">Update Product</h2>
                <form onSubmit={handleSubmit} className="w-[50%] bg-white rounded p-4 mx-auto space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    />

                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    />

                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        rows="3"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    ></textarea>

                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleCategoryChange}
                        className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    >
                        <option value="" disabled>Select a category</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.categoryName}
                            </option>
                        ))}
                    </select>

                    <label className="block text-sm font-medium text-gray-700">Image</label>
                    <input
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                        className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    />

                    <button
                        type="submit"
                        className="w-full py-2 px-4 border border-transparent rounded-md text-white bg-pink-500 hover:bg-[#ffffff] text-color[#ff59cd] focus:outline-none focus:ring-2 focus:ring-offset-2"
                    >
                        Update
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default ChangeProduct;
