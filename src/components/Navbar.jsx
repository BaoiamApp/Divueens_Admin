import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PanelContext } from '../context/PanelContext';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import {  RiLogoutCircleRLine } from 'react-icons/ri';
import { LuUser } from 'react-icons/lu';
const apiUrl = import.meta.env.VITE_API_URL;

const Navbar = () => {
    const { isAuthenticated } = useContext(PanelContext);
    const location = useLocation();
    const { logout } = useContext(PanelContext);


    return (



        <nav className="sticky top-0 z-50 flex justify-between min-h-[12vh] items-center gap-2 py-2 px-[.5rem] text-black bg-white border-b-pink-200 border-2 md:flex-row flex-col">
            <div className="flex items-center">
                <h2 className='text-lg font-bold mx-5'>Divueens <span className='text-pink-500'> Administration </span> </h2>
            </div>

            <ul className="flex items-center md:flex-row flex-col space-x-6 px-4">
                <li className="flex flew-row gap-4">
                    <Link to={"/shopping"} className="text-pink-500 text-2xl hover:text-pink-700 md:relative md:flex md:items-center">
                        <HiOutlineShoppingBag />
                    </Link>
                    <input
                        type='search'
                        placeholder="Search"
                        className='rounded-full focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-600 p-2 border-pink-400 border-2'
                    />

                </li>

                {isAuthenticated ? (
                    <>
                        <Link to={"/admin-profile"} className="text-2xl text-pink-500 hover:text-pink-700 md:relative md:flex md:items-center">
                            <LuUser />
                        </Link>
                        <li className="flex mr-6 md:mr-0">
                            <Link onClick={logout} className="text-pink-500 text-2xl font-semibold hover:bg-pink-500 hover:text-white rounded px-2 py-1">
                                 <RiLogoutCircleRLine/>
                            </Link>
                        </li>

                    </>
                ) : (
                    <>
                        {location.pathname === "/login" ? (
                            <Link to={"/signup"} className="text-pink-500 font-semibold  rounded px-2 py-1 mr-[5rem]">
                                Signup
                            </Link>
                        ) : (
                            <Link to={"/login"} className="text-pink-500 font-semibold   rounded px-2 py-1 mr-[5rem]">
                                Login
                            </Link>
                        )}
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;


