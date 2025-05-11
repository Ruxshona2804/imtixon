import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Saudbar from './Saidbar';
import main from "../images/TEXTURE.svg"
import { Image } from 'antd';


const UserData = () => {

  const [userData, setUserData] = useState(null);
  const [userCompany, setUserCompany] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingCompany, setLoadingCompany] = useState(true);
  const [error, setError] = useState(null);

  const token = sessionStorage.getItem('access');

  useEffect(() => {
    if (!token) {
      setError('Token not found');
      setLoadingUser(false);
      setLoadingCompany(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get('https://api.noventer.uz/api/v1/accounts/me/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);

        setUserData(response.data);
      } catch (err) {
        setError(err.response ? err.response.data : err.message);
      } finally {
        setLoadingUser(false);
      }
    };

    const fetchUserCompany = async () => {
      try {
        const response = await axios.get('https://api.noventer.uz/api/v1/company/get/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserCompany(response.data);
        console.log(response.data);

      } catch (err) {
        setError(err.response ? err.response.data : err.message);
      } finally {
        setLoadingCompany(false);
      }
    };

    fetchUserData();
    fetchUserCompany();
  }, [token]);

  if (loadingUser || loadingCompany) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {typeof error === 'string' ? error : JSON.stringify(error)}</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 p-4">
      {/* Sidebar */}
      <div className="w-[25%] bg-white shadow-md rounded-xl p-4">
        <Saudbar />
      </div>

      {/* Main content */}
      <div className="w-[75%] flex flex-col items-center gap-6 p-6">

        {/* Welcome block */}
        <div className="relative w-full rounded-xl overflow-hidden">
          <Image src={main} alt="main" className=" object-cover rounded-xl" />
          <div className="absolute top-6 left-6 flex items-center gap-4  bg-opacity-90 p-4 rounded-xl">
            <div className="text-blue-500 bg-white text-xl font-bold w-20 h-20 flex items-center justify-center text-[36px] rounded-full shadow">
              {userData?.full_name?.slice(0, 2).toUpperCase()}
            </div>
            <div className="text-white ">
              <p className="text-[12px] ">Xush kelibsiz!</p>
              <p className=" text-[36px] font-bold">{userData?.full_name}</p>
              <p className="py-2  pl-3 rounded-md bg-white text-black font-medium">{userData?.role}</p>
            </div>
          </div>
        </div>

        {/* Info cards */}
        <div className="flex gap-20 w-full">

          {/* User info card */}
          <div className="bg-white w-[300px] p-6 rounded-xl shadow-md border-l-4 border-blue-500">
            <h3 className="text-xl font-semibold text-blue-600 mb-4">Ma'lumotlar</h3>
            <p className="mb-2"><span className="font-medium text-gray-700">Telefon:</span> {userData?.phone_number}</p>
            <p className="mb-2"><span className="font-medium text-gray-700">Email:</span> {userData?.email}</p>
            <p className="mb-2"><span className="font-medium text-gray-700">Tug'ilgan sana:</span> {userData?.birth_date}</p>
            <p><span className="font-medium text-gray-700">Jinsi:</span> {userData?.gender}</p>
          </div>

          {/* Company info card */}
          <div className="bg-white w-[300px] p-6 rounded-xl shadow-md border-l-4 border-green-500">
            <h3 className="text-xl font-semibold text-green-600 mb-4">Kompaniya</h3>
            <p className="mb-2"><span className="font-medium text-gray-700">Nomi:</span> {userCompany?.name}</p>
            <p className="mb-2"><span className="font-medium text-gray-700">INN:</span> {userCompany?.stir}</p>
            <p className="mb-2"><span className="font-medium text-gray-700">Ro’yxatdan o’tgan:</span> {userCompany?.created_at}</p>
            <p>
              <span className="font-medium text-gray-700">Litsenziya:</span>{' '}
              <a href={userCompany?.license_file} download className="text-blue-500 underline hover:text-blue-700">
                Yuklab olish
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserData;

