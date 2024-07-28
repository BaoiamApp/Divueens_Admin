import React, { useEffect, useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import Layout from '../Layout';
const apiUrl = import.meta.env.VITE_API_URL;
const razorpayID = import.meta.env.VITE_RAZORPAY_ID;

const ShopItems = () => {
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setProductList(data);
        console.log(data, "products list");
      })
      .catch((e) => {
        console.log('Error:', e);
      });
  }, []);

  const handlePayment = async (product) => {
    const response = await fetch(`${apiUrl}/api/payment/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: product.price * 100, // Razorpay accepts amount in paise
        currency: 'INR',
        user_id: 'user1234', // Replace with actual user ID
        product_id: product._id,
        quantity: 1,
        paymentMethod: 'Razorpay',
        shippingAddress: 'Test Address', // Replace with actual shipping address
      }),
    });

    const data = await response.json();

    if (data.order_id) {
      const options = {
        key: razorpayID,
        amount: data.amount,
        currency: data.currency,
        name: "Divueens",
        description: "Test Transaction",
        order_id: data.order_id,
        handler: async function (response) {
          const result = await fetch(`${apiUrl}/api/payment/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const resultData = await result.json();
          console.log(resultData,'resultData')
          alert(resultData.message);
        },
        prefill: {
          name: "Test User",
          email: "test.user@example.com",
          contact: "8447890137",
        },
        notes: {
          address: "Test Address",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    }
  };

  return (
    <Layout>
      <div className="w-full h-full">
        <h2 className='text-2xl p-4 text-center font-semibold'>Proceed to Payment (testing-section for users)</h2>

        <div className='w-full flex flex-wrap justify-center items-center gap-4 py-4'>
          {productList?.map((product, index) => (
            <div key={index} className="max-w-[200px] bg-white border rounded-lg shadow-md p-4 transition duration-300 hover:shadow-lg">
              <h2 className='font-semibold text-lg mb-2'>{product.name}</h2>
              <img src={product.imageUrl} alt={product.name} className="w-32 h-32 object-cover mb-2 rounded-md" />
              <span className='block text-lg font-semibold text-gray-800 mb-2'>Rs.{product.price}</span>

              <button onClick={() => handlePayment(product)} className='w-full bg-pink-400 text-white py-2 rounded-md flex justify-center items-center gap-2 hover:bg-white hover:text-pink-400 transition duration-300'>
                <FaShoppingCart />
                Buy
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ShopItems;













// import React, { useEffect, useState } from 'react'
// import { FaEdit, FaShoppingCart, FaTrashAlt } from 'react-icons/fa';
// import { Link, useNavigate } from 'react-router-dom'
// import Layout from '../Layout';
// const apiUrl = import.meta.env.VITE_API_URL;

// const ShopItems = () => {

//     const [productList, setProductList] = useState([])

//     useEffect(() => {
//         fetch(`${apiUrl}/api/products`).then((res) => {
//             res.json().then(data => {
//                 setProductList(data)
//                 console.log(data, "products list")
//             })
//         }).catch(e => { console.log('Error:', e) })
//     }, [])
//     return (
//         <Layout>
//             <div className="w-full h-full">

//                 <h2 className='text-2xl p-4 text-center font-semibold'>Proceed to Payment (testing-section for users)</h2>

//                 <div className='w-full flex flex-wrap justify-center items-center gap-4 py-4'>
//                     {productList?.map((product, index) => (
//                         <div key={index} className="max-w-[200px] bg-white border rounded-lg shadow-md p-4 transition duration-300 hover:shadow-lg">
//                             <h2 className='font-semibold text-lg mb-2'>{product.name}</h2>
//                             <img src={product.imageUrl} alt={product.name} className="w-32 h-32 object-cover mb-2 rounded-md" />
//                             <span className='block text-lg font-semibold text-gray-800 mb-2'>Rs.{product.price}</span>

//                             <button onClick={() => { /* Add your buy functionality here */ }} className='w-full bg-pink-400 text-white py-2 rounded-md flex justify-center items-center gap-2 hover:bg-white hover:text-pink-400 transition duration-300'>
//                                 <FaShoppingCart />
//                                 Buy
//                             </button>
//                         </div>
//                     ))}

//                 </div>
//             </div>
//         </Layout>
//     )
// }

// export default ShopItems
