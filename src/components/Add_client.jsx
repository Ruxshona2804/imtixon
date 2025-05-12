import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ClientAdd = () => {
  const [formData, setFormData] = useState({
    branch: '',
    name: '',
    phone: '',
    avatar: null,
    license_file: null,
  });

  const navigate = useNavigate();
  const token = sessionStorage.getItem('access');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim() || !formData.avatar) {
      alert("Iltimos, ism, telefon raqami va avatarni to‘ldiring.");
      return;
    }

    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('phone', formData.phone);
    payload.append('avatar', formData.avatar);

    if (formData.branch) payload.append('branch', formData.branch);
    if (formData.license_file) payload.append('license_file', formData.license_file);

    try {
      await axios.post(
        'https://api.noventer.uz/api/v1/company/clients/',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          
          },
        }
      );

      alert('Mijoz muvaffaqiyatli qo‘shildi!');
      navigate('/mijozlar');
    } catch (error) {
      console.error('Xatolik:', error.response?.data || error.message);
      alert('Xatolik yuz berdi. Iltimos, maʼlumotlarni tekshirib qayta urinib ko‘ring.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto mt-10 bg-white p-8 shadow-lg rounded-2xl space-y-6 border border-gray-200">
    <h2 className="text-2xl font-semibold text-gray-800 text-center">Yangi mijoz qo‘shish</h2>
  
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">Ism *</label>
      <input
        type="text"
        name="name"
        placeholder="Ism kiriting"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">Telefon raqami *</label>
      <input
        type="text"
        name="phone"
        placeholder="+9989xx..."
        value={formData.phone}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">Filial ID (ixtiyoriy)</label>
      <input
        type="number"
        name="branch"
        placeholder="Masalan: 1"
        value={formData.branch}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">Avatar *</label>
      <input
        type="file"
        name="avatar"
        accept="image/*"
        onChange={handleChange}
        required
        className="w-full px-4 py-1.5 border border-gray-300 rounded-lg bg-white file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
    </div>
  
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">Litsenziya fayli (ixtiyoriy)</label>
      <input
        type="file"
        name="license_file"
        accept="application/pdf,image/*"
        onChange={handleChange}
        className="w-full px-4 py-1.5 border border-gray-300 rounded-lg bg-white file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
      />
    </div>
  
    <button
      type="submit"
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition duration-200"
    >
      + Mijozni qo‘shish
    </button>
  </form>
  
  );
};

export default ClientAdd;
