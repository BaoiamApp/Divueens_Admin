import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { useNavigate, useParams } from 'react-router-dom'
import Category from './Category/categories';
const apiUrl = import.meta.env.VITE_API_URL;

const ChangeProduct = () => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        Category: null,
        categoryid: '',
        image: null,
    });

    const { _id } = useParams();
    console.log(_id, "id in upda prod")
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/product/${_id}`);
                if (response) {
                    const data = await response.json();
                    console.log(" data response useEffect of product => ", data)
                    const categoryResponse = await fetch(`${apiUrl}/api/category/${data.category}`);
                    if (!categoryResponse.ok) throw new Error('Category not found');
                    const categoryData = await categoryResponse.json();
                    setFormData({
                        name: data.name,
                        price: data.price,
                        description: data.description,
                        category: categoryData,
                        categoryid: data.category,
                        image: data.imageUrl,
                    });
                    console.log(formData);
                    //   setItem(data);
                } else {
                    throw new Error('Product not found');
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        // const fetchcategory = async () => {
        //     try {
        //         console.log(formData);
        //         const response = await fetch(`${apiUrl}/api/category/${formData.categoryid}`);
        //         if (response) {
        //             const data = await response.json();
        //             console.log("data response useEffect", data)
        //             setFormData({...formData, category: data});
        //             console.log("formdata=>", formData);
        //             //   setItem(data);
        //         } else {
        //             throw new Error('Product not found');
        //         }
        //     } catch (error) {
        //         console.error('Error fetching product:', error);
        //     }
        // };

        const fetchCategories = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/categories`);
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchProduct();
        // fetchcategory();
        fetchCategories();
    }, []); // Fetch data whenever _id changes


    const navigator = useNavigate()



  

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleCategoryChange =  async (e) => {
        const selectedCategory = await categories.find(
            (category) => category.categoryName === e.target.value
        );
        setFormData({
            ...formData,
            category: selectedCategory,
        });

        console.log(formData.category);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        // console.log(formData.image,'image')
        setFormData({
            ...formData,
            image: file,
        });
    };

    const handleSubmit = (e) => {
        const token = localStorage.getItem('token')
        e.preventDefault();
        const form = new FormData();
        form.append('name', formData.name);
        form.append('price', formData.price);
        form.append('description', formData.description);
        form.append('category', JSON.stringify(formData.category));
        form.append('image', formData.image);
        console.log(formData, "formdata in updateproduct")
        fetch(`${apiUrl}/api/products/${_id}`, {
            method: "put",
            // body: JSON.stringify(form),
            headers: {
                // 'auth-token': localStorage.getItem('token'),
                'Authorization': `Bearer ${token}`,


            },
            body: form


        }).then((res) => {
            res.json().then(data => {
                // setProductList(data)
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Item added successfully!",
                    showConfirmButton: false,
                    timer: 1500
                });
                console.log(data, "product added")
                navigator("/")
            })
        }).catch(e => { console.log('Error:', e) })


        // Reset form fields if needed

        // Reset form fields if needed
        setFormData({
            name: '',
            price: '',
            description: '',
            image: null,
        });

    };

    // const handleCategoryChange = (e) => {
    //     setFormData({
    //         ...formData,
    //         category: e.target.value,
    //     });
    // };

    return (
        <>

            <div className="">
                <h2 className="text-3xl text-center font-semibold mb-4">Update Product</h2>
                <form onSubmit={handleSubmit} className="w-[50%] bg-white rounded p-4 mx-auto space-y-4">



                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"

                        value={formData.name}
                        onChange={handleChange}
                        className="block w-full px-3 py-2  border-grat-300 border-b-2  focus:outline-none focus:ring-pink-500 focus:border-pink-500"

                    />

                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                        type="number"
                        name="price"

                        value={formData.price}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border-b-2 border-gray-300   focus:outline-none focus:ring-pink-500 focus:border-pink-500"

                    />

                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        rows="1"
                        name="description"

                        value={formData.description}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border-b-2 border-gray-300   focus:outline-none focus:ring-pink-500 focus:border-pink-500"

                    ></textarea>

                    {/* categorydata */}
                    <select
                        name="category"
                        value={formData.category ? formData.category.categoryName : ''}
                        onChange={handleCategoryChange}
                        className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
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
                        // accept="image/*"
                        name="image"
                        onChange={handleImageChange}
                        className="block w-full px-3 py-2 border-b-2 border-gray-300   focus:outline-none focus:ring-pink-500 focus:border-pink-500"

                    />

                    <button
                        type="submit"
                        className="w-full py-2 px-4 border border-transparent rounded-md  text-white bg-pink-500 hover:bg-[#ffffff] text-color[#ff59cd] focus:outline-none focus:ring-2 focus:ring-offset-2 "
                    >
                        Update
                    </button>
                </form>
            </div>


        </>
    )
}

export default ChangeProduct


