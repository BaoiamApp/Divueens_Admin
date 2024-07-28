import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import Orders from './Orders';
import Layout from '../Layout';
const apiUrl = import.meta.env.VITE_API_URL;

const fetchOrder = async (id) => {
    const response = await fetch(`${apiUrl}/api/orders/${id}`);
    const data = await response.json();
    console.log(data,'data')
    return data;
  };
  

const OrderDetails = () => {
    
    const [order, setOrder] = useState("");
    const {id} = useParams()
    console.log(id,': params')


  useEffect(() => {
    // Fetch orders on component mount
    const fetchData = async () => {
      const fetchedOrder = await fetchOrder(id);
      console.log(fetchedOrder,'order fetched')
      setOrder(fetchedOrder);
    };
    fetchData();
  }, []);
    return (
        <Layout>

           
                <div className='item-center p-4'>
                    <h1 className='text-2xl text-center p-2  font-semibold'>Order Details</h1>
                    <h2 className="text-xl font-semibold mb-4">Order ID: {order._id}</h2>
                    <p className="text-gray-600 mb-2">Order Status: {order.status}</p>
                    <p className="text-gray-600 mb-2">Payment Method: {order.paymentMethod}</p>
                    <p className="text-gray-600 mb-2">Quantity: {order.quantity}</p>
                    <p className="text-gray-600 mb-2">Order Amount: {order.totalAmount/100} INR</p>
                    <p className="text-gray-600 mb-2">Payment completed: {order.paymentDone ? "Yes" : "No"}</p>
                    <p className="text-gray-600 mb-2">Shipping Address: {order.shippingAddress}</p>
                    <p className="text-gray-600 mb-2">Customer ID: {order.user_id}</p>

                </div>
           
        </Layout>


    )

}




export default OrderDetails
