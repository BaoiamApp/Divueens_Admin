import React, { useContext, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { PanelContext } from '../context/PanelContext';
import { ColorRing } from 'react-loader-spinner'; // Import the spinner component
import Navbar from './Navbar';
const apiUrl = import.meta.env.VITE_API_URL;

const Login = () => {
  const { setIsAuthenticated } = useContext(PanelContext);
  const [loading, setLoading] = useState(false); // State to manage loading spinner

  const signInGoogle = async () => {
    console.log('google btn clicked')
    setLoading(true)
    window.location.href = `${apiUrl}/auth/google`; //redirecting user to the server
  }

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show spinner on form submission

    try {
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.authToken);
        // localStorage.setItem('admin-data', JSON.stringify(data.user));
        setIsAuthenticated(true);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Logged in successfully!",
          showConfirmButton: false,
          timer: 1500
        });
        navigate("/admin-profile");
      } else {
        Swal.fire({
          position: "center",
          icon: "warning",
          title: data.message,
          showConfirmButton: false,
          timer: 1500
        });
        navigate("/login");
      }
    } catch (error) {
      console.error('Login error: ', error.message);
    } finally {
      setLoading(false); // Hide spinner after login process is complete
    }
  };

  return (

    <>

<Navbar/>
   
    <div className="relative p-4 h-screen flex rounded items-center justify-center bg-gray-100">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <ColorRing
            visible={true}
            height="80"
            width="80"
            ariaLabel="color-ring-loading"
            wrapperStyle={{}}
            wrapperClass="color-ring-wrapper"
            colors={['#eee', '#f47e60', '#f8b26a', '#eee', '#849b80']}
          />
        </div>
      )}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="Email"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="Password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full mb-2 bg-pink-500 text-white py-2 rounded hover:bg-white hover:border-pink-300 border-2 hover:text-pink-500"
            disabled={loading} // Disable button while loading
          >
            Login
          </button>
          <Link className='text-center block hover:underline' to={"/signup"}>
            Already an existing user
          </Link>
          <span className='text-center block m-3 text-xl'>or</span>
          <button
            type='button'
            onClick={signInGoogle}
            className="w-full py-2 no-underline text-black-400 px-4 hover:text-pink hover:border-pink-300 flex flex-row items-center justify-center gap-2 text-md border-2 rounded-md focus:outline-none"
          >
            <FcGoogle /> <span>Sign in with Google</span>
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default Login;

