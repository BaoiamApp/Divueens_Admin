import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../Layout';
const apiUrl = import.meta.env.VITE_API_URL;

//  (fetching orders at this API endpoint)
const fetchOrders = async () => {
  const response = await fetch(`${apiUrl}/api/orders`);
  const data = await response.json();
  return data;
};

// (updating orders at the given API endpoint)
const updateOrderStatus = async (orderId, status) => {
  const res = await fetch(`${apiUrl}/api/orders/${orderId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  const data = await res.json()
  return data
  
};

// since we cannot use the default date used by mongo
const formatDate = (isoString) => {
  const date = new Date(isoString);
  // Format each parts
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // formatted date string
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // fetch orders on component mount
    const fetchData = async () => {
      const fetchedOrders = await fetchOrders();
      setOrders(fetchedOrders);
    };
    fetchData();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    const res = await updateOrderStatus(orderId, newStatus);
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus, updatedAt: res.updatedAt } : order
      )
    );
  };

  const statusColors = {
    pending: 'bg-gray-400',
    failed: 'bg-red-400',
    intransit: 'bg-yellow-300',
    delivered: 'bg-green-400',
  };

  return (
    <Layout>
      <div className="min-h-screen text-black">
        <div className="container mx-auto px-4 py-4 sm:px-6 md:px-8 lg:px-12">
          <h2 className='text-3xl mb-2 place-content-center'>ORDERS</h2>
          <table className="w-full border-separate border border-white text-center">
            <thead className="bg-pink-300 border border-white">
              <tr className="border border-white">
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Order Status</th>
                <th className="px-4 py-2">Created At</th>
                <th className="px-4 py-2">Modified At</th>
                <th className="px-4 py-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index} >
                  <td className="px-4 py-2 border border-white">{`${order._id.substring(0, 10)}...`}</td>
                  <td className={`px-4 py-2 border border-white  ${statusColors[order.status]} `}>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`px-4 py-2 bg-inherit hover:border-pink-300 hover:border rounded-md`}
                    >
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                      <option value="intransit">In Transit</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 border border-white">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-2 border border-white">{formatDate(order.updatedAt)}</td>
                  <td className="px-4 py-2 border border-white bg-white text-slate-200">
                    <Link
                      to={`/orders/${order._id}`}
                      className="hover:border-pink-500 border-2 border-pink-300 text-pink-500 font-md py-2 px-4 rounded"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
