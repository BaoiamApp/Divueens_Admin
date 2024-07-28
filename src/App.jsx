import { useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import AddProduct from './components/AddProduct'
import Product from './components/Product'
import Login from './components/Login'
import SignUp from './components/SIgnUp'
import Banner from './components/Banner/Banner'
import ChangeProduct from './components/ChangeProduct'
import AdminProfile from './components/admin/AdminProfile'
import ProtectedRoute from './components/ProtectedRoute'
import NotAuthorizedPage from './components/NotAuthorizedPage'
import NotFound from './components/NotFound'
import Category from './components/Category/Category'
import Orders from './components/Order/Orders'
import OrderDetails from './components/Order/OrderDetails'
import ShopItems from './components/Shopping/ShopItems'



function App() {

  const navigator = useNavigate()



  
  useEffect(() => {
    // to get token from the url
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token')
    console.log(token, 'token from google')
    if (token) {

      localStorage.setItem('token', token);
      // localStorage.getItem('token')
      console.log(token, 'use this token')

      // window.location.href = '/admin-profile'; 
      navigator("/admin-profile")
    }
  }, [])



  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<SignUp />} />
        <Route exact path="/access-denied" element={<NotAuthorizedPage />} />
      {/* </Routes>

   
        {/* private routes */}
        <Route exact path="/" element={<ProtectedRoute> <Product /> </ProtectedRoute>} />
        <Route exact path="/banner" element={<ProtectedRoute> <Banner /> </ProtectedRoute>} />
        <Route exact path="/add" element={<ProtectedRoute> <AddProduct /> </ProtectedRoute>} />
        <Route exact path="/update/:_id" element={<ProtectedRoute> <ChangeProduct /> </ProtectedRoute>} />
        <Route exact path="/admin-profile" element={<ProtectedRoute> <AdminProfile /> </ProtectedRoute>} />

//         <Route exact path="/add" element={<ProtectedRoute> <Footer /> </ProtectedRoute>} />


         {/* pending work */}
      
         <Route exact path="/banner" element={<ProtectedRoute> <Banner /> </ProtectedRoute>} />
        <Route exact path="/categories" element={<ProtectedRoute> <Categories/> </ProtectedRoute> }/>
        <Route exact path="/orders" element={<ProtectedRoute> <Orders/> </ProtectedRoute> }/>
        <Route exact path="/orders/:id" element={<ProtectedRoute> <OrderDetails/> </ProtectedRoute> }/>
        <Route exact path="/shopping" element={<ProtectedRoute> <ShopItems/> </ProtectedRoute> }/>  

        {/* <Route exact path="/" element={<Product />} />
<Route exact path="/banner" element={<Banner />} />
<Route exact path="/add" element={<AddProduct />} />
<Route exact path="/update/:_id" element={<ChangeProduct />} />
<Route exact path="/admin-profile" element={<AdminProfile />} />
<Route exact path="/categories" element={<Categories />} /> */}




        {/* chatching routes which are not defined */}
        <Route path="*" element={<NotFound />} />
        
      </Routes>

    </>
  )
}

export default App

