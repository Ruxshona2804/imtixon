import React, { useState } from 'react';
import image from "../images/image.svg";
import logo from "../images/logo.svg";
import axios from 'axios';

const LoginForm = () => {
    const [formData, setFormData] = useState({ phone_number: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setError(''); 

        if (!formData.phone_number || !formData.password) {
            setError('Iltimos, barcha maydonlarni toʻldiring!');
            return;
        }

        try {
            
            const response = await axios.post('https://api.noventer.uz/api/v1/accounts/login/', {
                phone_number: formData.phone_number,
                password: formData.password,
            });

            
            const accessToken = response.data.data.tokens.access;
            sessionStorage.setItem('access', accessToken);

    
            window.location.href = '/akkaunt_me';
        } catch (error) {
            console.error('Login Failed:', error.response?.data || error.message);

            setError('Login failed: ' + (error.response?.data?.detail || 'Iltimos, maʼlumotlarni tekshiring'));
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">

            <div className="hidden md:flex md:w-1/2 relative">
                <img className="w-full h-full object-cover" src={image} alt="background" />
                <div className="absolute inset-0 bg-black opacity-40"></div>
            </div>


            <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-6 py-10 bg-white shadow-lg">
                <img src={logo} alt="logo" className="w-24 h-24 mb-4" />
                <h2 className="text-3xl font-bold mb-2 text-gray-800">NovEnter</h2>
                <p className="text-gray-500 mb-6 text-center">CRM tizim bilan biznesingizni rivojlantiring</p>

                <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
                    <div>
                        <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                            Telefon raqamingiz
                        </label>
                        <input
                            type="text"
                            name="phone_number"
                            id="phone_number"
                            value={FormData.phone_number}
                            onChange={handleChange}
                            placeholder="+998..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-400"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Parol
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={FormData.password}
                            onChange={handleChange}
                            placeholder="••••••"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-400"
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                        Kirish
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;

        
        
