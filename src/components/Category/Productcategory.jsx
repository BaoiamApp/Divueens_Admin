import React, { useEffect, useState } from 'react'
import { BsPlusCircle } from 'react-icons/bs'
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom'
import Layout from '../Layout';
const apiUrl = import.meta.env.VITE_API_URL;


const Product = () => {
    const [productList, setProductList] = useState([])
    const params = useParams()
    console.log(params.name,': params')

    useEffect(() => {
        fetch(`${apiUrl}/api/categories/${params.name}/products`).then((res) => {
            res.json().then(data => {
                setProductList(data)
                console.log(data, "products list")
            })
        }).catch(e => { console.log('Error:', e) })
    }, [])

    // deleteProduct
    const deleteProduct = (_id) => {
        console.log('id: vite', _id)
        const token = localStorage.getItem('token')
        fetch(`${apiUrl}/api/delete/${_id}`, {
            method: "delete",
            headers: {
                'Authorization': `Bearer ${token}`,
            },

        }).then((res) => {
            res.json().then(data => {
                if (productList.length > 0) {
                    setProductList(prevProducts => prevProducts.filter(product => product._id !== _id));
                    console.log(data._id, "product deleted")
                }
            })
        }).catch(e => { console.log('Error:', e) })
    }




    return (

        <Layout>
            <div className="w-full h-full">
                <h2 className="text-2xl p-4 text-center font-semibold">LIST OF PRODUCTS</h2>
                <div className="w-full flex flex-wrap justify-center items-center gap-4 py-4">
                    {productList?.map((product, index) => (
                        <div key={index} className="w-[200px] bg-white border rounded-lg shadow-md p-4 transition duration-300 hover:shadow-lg flex flex-col items-center">
                            <h2 className="font-semibold text-lg mb-2 text-center">{product.name}</h2>
                            <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover mb-2 rounded-md" />
                            <span className="block text-lg font-semibold text-gray-800 mb-2">Rs.{product.price}</span>
                            <div className="mt-2 flex flex-row justify-around gap-2 border-t-2 pt-2 w-full">
                                <Link to={`/update/${product._id}`} className='hover:text-yellow-600 text-yellow-400'>
                                    <FaEdit />
                                </Link>
                                <button onClick={() => { deleteProduct(product._id) }} className='hover:text-red-600 text-red-500'>
                                    <FaTrashAlt />
                                </button>
                            </div>
                        </div>
                    ))}
                    <Link to={"/add"} className="text-3xl text-pink-400 hover:text-pink-600">
                        <BsPlusCircle />
                    </Link>
                </div>
            </div>
        </Layout>
    )
}

export default Product
