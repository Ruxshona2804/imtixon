import React, { useEffect, useState } from 'react';
import logo from '../images/Logonavbar.svg';
import axios from 'axios';

const Navbar = () => {
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState(null);

  const token = sessionStorage.getItem('access');

  useEffect(() => {
    if (!token) {
      setError('Token not found');
      setLoadingUser(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get('https://api.noventer.uz/api/v1/accounts/me/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (err) {
        setError(err.response ? err.response.data : err.message);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserData();
  }, [token]);

  if (loadingUser) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-4">Error: {typeof error === 'string' ? error : JSON.stringify(error)}</div>;
  }

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <img src={logo} alt="logo" className="h-10" />
      </div>

      <div className="flex-grow max-w-md mx-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Qidirish..."
            className="w-full pl-10 pr-4 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>


      <div className="flex items-center gap-4">

        <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full font-semibold shadow-md">
          {userData.full_name?.slice(0, 2).toUpperCase()}
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-800">{userData.full_name}</p>
          <p className="text-sm text-gray-500">{userData.role}</p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
