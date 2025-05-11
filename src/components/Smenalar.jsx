import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Saidbar from './Saidbar';
import { smenalar_url } from '../Utilits/url';
import { apiClient } from '../Utilits/apiservice';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', branch: '', start_time: '', end_time: '' });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');

  const fetchBranches = async () => {
    try {
      const res = await apiClient({
        url: 'company/branches/', // Assuming this endpoint exists to fetch branches
        method: 'get',
      });

      if (res?.is_succes && Array.isArray(res.data.results)) {
        setBranches(res.data.results);
      } else {
        console.error('Failed to fetch branches:', res);
        setError('Filiallarni olishda xatolik yuz berdi.');
      }
    } catch (err) {
      console.error('Error fetching branches:', err);
      setError(err.message || 'Filiallarni olishda xatolik yuz berdi.');
    }
  };

  const fetchEmployees = async (branchId = '') => {
    setLoading(true);
    setError(null);
    try {
      const url = branchId ? `${smenalar_url}?branch=${branchId}` : smenalar_url;
      const res = await apiClient({
        url: url,
        method: 'get',
      });

      console.log('Shifts data:', res?.data);
      if (res?.is_succes && Array.isArray(res.data)) {
        setEmployees(res.data);
      } else {
        setError('Smenalarni olishda xatolik yuz berdi.');
        setEmployees([]);
      }
    } catch (err) {
      setError(err.message || 'Smenalarni olishda xatolik yuz berdi.');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    fetchEmployees(selectedBranch);
  }, [selectedBranch]);

  const handleBranchChange = (event) => {
    setSelectedBranch(event.target.value);
  };

  const deleteEmployee = async (id) => {
    if (window.confirm("Bu hodim o'chirilsinmi?")) {
      try {
        const res = await apiClient({
          url: `company/shift-detail/${id}/`,
          method: 'DELETE',
        });

        if (res?.is_succes) {
          setEmployees(employees.filter(emp => emp.id !== id));
        } else {
          setError('Xodimni o\'chirishda xatolik yuz berdi.');
        }
      } catch (err) {
        setError(err.message || 'Xodimni o\'chirishda xatolik yuz berdi.');
      }
    }
  };

  const openEditModal = (employee) => {
    setEditingEmployee({ ...employee });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingEmployee(null);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingEmployee(prevEmployee => ({
      ...prevEmployee,
      [name]: value,
    }));
  };

  const saveEditedEmployee = async () => {
    if (!editingEmployee) return;
    try {
      const res = await apiClient({
        url: `company/shift-detail/${editingEmployee.id}/`,
        method: 'PUT',
        data: { ...editingEmployee, branch: parseInt(editingEmployee.branch, 10) }, // Ensure branch is an integer
      });

      if (res?.is_succes) {
        setEmployees(employees.map(emp => emp.id === editingEmployee.id ? res.data : emp));
        closeEditModal();
      } else {
        setError('Xodim ma\'lumotlarini yangilashda xatolik yuz berdi.');
      }
    } catch (err) {
      setError(err.message || 'Xodim ma\'lumotlarini yangilashda xatolik yuz berdi.');
    }
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setNewEmployee({ name: '', branch: '', start_time: '', end_time: '' });
  };

  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee(prevEmployee => ({
      ...prevEmployee,
      [name]: value,
    }));
  };

  const createEmployee = async () => {
    try {
      const res = await apiClient({
        url: 'company/shift-create/',
        method: 'POST',
        data: { ...newEmployee, branch: parseInt(newEmployee.branch, 10) }, // Ensure branch is an integer
      });

      if (res?.is_succes) {
        setEmployees([...employees, res.data]);
        closeCreateModal();
      } else {
        setError('Yangi xodimni qo\'shishda xatolik yuz berdi.');
      }
    } catch (err) {
      setError(err.message || 'Yangi xodimni qo\'shishda xatolik yuz berdi.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='flex '>
      <div className=' w-[20%] border border-gray-300 '>
        <Saidbar />
      </div>

      <div className='w-[80%] p-4'>
        <div className='flex items-center mb-4'>
          <label htmlFor="branchSelect" className="mr-2 font-bold">Filialni tanlang:</label>
          <select
            id="branchSelect"
            className="border border-gray-300 rounded-md p-2"
            value={selectedBranch}
            onChange={handleBranchChange}
          >
            <option value="">Barcha filiallar</option>
            {branches.map(branch => (
              <option key={branch.id} value={branch.id}>
                {branch.name || branch.id}
              </option>
            ))}
          </select>
          <button onClick={openCreateModal} className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-4'>
            Yangi smena qo'shish
          </button>
        </div>

        <table className='w-full border-collapse border border-gray-300 '>
          <thead>
            <tr className='bg-gray-100'>
              <th className="p-2 border border-gray-300">№</th>
              <th className="p-2 border border-gray-300">Smena</th>
              <th className="p-2 border border-gray-300">Filial ID</th>
              <th className="p-2 border border-gray-300">Filial Nomi</th>
              <th className="p-2 border border-gray-300">Boshlanish vaqti</th>
              <th className="p-2 border border-gray-300">Tugash vaqti</th>
              <th className="p-2 border border-gray-300">Funksiyalar</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, index) => (
              <tr key={emp.id}>
                <td className="p-2 border border-gray-300">{index + 1}</td>
                <td className="p-2 border border-gray-300">{emp.name}</td>
                <td className="p-2 border border-gray-300">{emp.branch}</td>
                <td className="p-2 border border-gray-300">{emp.branch_name}</td>
                <td className="p-2 border border-gray-300">{emp.start_time}</td>
                <td className="p-2 border border-gray-300">{emp.end_time}</td>
                <td className="p-2 border border-gray-300">
                  <button onClick={() => openEditModal(emp)} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2'>
                    Tahrirlash
                  </button>
                  <button onClick={() => deleteEmployee(emp.id)} className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded'>
                    O'chirish
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Create Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="relative p-8 bg-white w-full max-w-md rounded-md">
              <h2 className="text-lg font-bold mb-4">Yangi smena qo'shish</h2>
              <label className="block mb-2">
                Smena nomi:
                <input type="text" name="name" value={newEmployee.name} onChange={handleCreateInputChange} className="w-full border border-gray-300 p-2 rounded-md" />
              </label>
              <label className="block mb-2">
                Filial:
                <select name="branch" value={newEmployee.branch} onChange={handleCreateInputChange} className="w-full border border-gray-300 p-2 rounded-md">
                  <option value="">Filialni tanlang</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name || branch.id}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block mb-2">
                Boshlanish vaqti:
                <input type="datetime-local" name="start_time" value={newEmployee.start_time} onChange={handleCreateInputChange} className="w-full border border-gray-300 p-2 rounded-md" />
              </label>
              <label className="block mb-2">
                Tugash vaqti:
                <input type="datetime-local" name="end_time" value={newEmployee.end_time} onChange={handleCreateInputChange} className="w-full border border-gray-300 p-2 rounded-md" />
              </label>
              <div className="flex justify-end">
                <button onClick={closeCreateModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2">
                  Bekor qilish
                </button>
                <button onClick={createEmployee} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                  Saqlash
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && editingEmployee && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="relative p-8 bg-white w-full max-w-md rounded-md">
              <h2 className="text-lg font-bold mb-4">Smena ma'lumotlarini tahrirlash</h2>
              <label className="block mb-2">
                Smena nomi:
                <input type="text" name="name" value={editingEmployee.name} onChange={handleEditInputChange} className="w-full border border-gray-300 p-2 rounded-md" />
              </label>
              <label className="block mb-2">
                Filial:
                <select name="branch" value={editingEmployee.branch} onChange={handleEditInputChange} className="w-full border border-gray-300 p-2 rounded-md">
                  <option value="">Filialni tanlang</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name || branch.id}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block mb-2">
                Boshlanish vaqti:
                <input type="datetime-local" name="start_time" value={editingEmployee.start_time} onChange={handleEditInputChange} className="w-full border border-gray-300 p-2 rounded-md" />
              </label>
              <label className="block mb-2">
                Tugash vaqti:
                <input type="datetime-local" name="end_time" value={editingEmployee.end_time} onChange={handleEditInputChange} className="w-full border border-gray-300 p-2 rounded-md" />
              </label>
              <div className="flex justify-end">
                <button onClick={closeEditModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2">
                  Bekor qilish
                </button>
                <button onClick={saveEditedEmployee} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Saqlash
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
