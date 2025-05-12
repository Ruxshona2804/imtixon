import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompany } from '../features/company/companySlice';
import { Link } from 'react-router-dom';
import Saidbar from './Saidbar';
import ShiftEditModal from './ShiftEditModal';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const ShiftList = () => {
  const dispatch = useDispatch();
  const token = sessionStorage.getItem('access');

  const { data: companyData, loading: loadingCompany, error: errorCompany } = useSelector((state) => state.company);
  const branches = companyData?.branches || [];

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [shifts, setShifts] = useState([]);
  const [loadingShifts, setLoadingShifts] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  const [formData, setFormData] = useState({ name: '', branch: '', start_time: '', end_time: '' });

  useEffect(() => {
    dispatch(fetchCompany());
  }, [dispatch]);

  const fetchShifts = async (branchId) => {
    if (!branchId || !token) return;
    setLoadingShifts(true);
    try {
      const res = await axios.get(`https://api.noventer.uz/api/v1/company/shifts/${branchId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShifts(res.data || []);
    } catch (err) {
      console.error('Shift error:', err);
      setShifts([]);
    } finally {
      setLoadingShifts(false);
    }
  };

  useEffect(() => {
    fetchShifts(selectedBranch);
  }, [selectedBranch]);

  const handleDelete = async (id) => {
    if (!window.confirm('Rostdan ham o‘chirmoqchimisiz?')) return;
    try {
      await axios.delete(`https://api.noventer.uz/api/v1/company/shift-detail/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShifts(shifts.filter((shift) => shift.id !== id));
    } catch (err) {
      alert("O'chirishda xatolik yuz berdi");
    }
  };

  const startEdit = (shift) => {
    setEditingShift(shift);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (updatedValues) => {
    try {
      await axios.put(
        `https://api.noventer.uz/api/v1/company/shift-detail/${editingShift.id}/`,
        updatedValues,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEditModalOpen(false);
      setEditingShift(null);
      setSelectedBranch(selectedBranch);
    } catch (err) {
      alert("Tahrirlashda xatolik yuz berdi");
    }
  };


  return (
    <div className="flex">
      <div className="w-[30%] border">
        <Saidbar />
      </div>
      <div className="w-[70%] p-6">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-semibold">Smenalar ro‘yxati</h2>
          <div className="flex gap-4">
            <select
              className="border px-3 py-2 rounded"
              onChange={(e) => setSelectedBranch(e.target.value)}
              value={selectedBranch}
            >
              <option disabled value="">Filial tanlang</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </select>
            <Link to="/smena_qushish">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Smena qo‘shish</button>
            </Link>
          </div>
        </div>

        {loadingShifts ? (
          <div>Yuklanmoqda...</div>
        ) : (
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full text-sm text-left border">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-4">Smena nomi</th>
                  <th className="p-4">Filial</th>
                  <th className="p-4">Boshlanish</th>
                  <th className="p-4">Tugash</th>
                  <th className="p-4">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {shifts.length === 0 ? (
                  <tr><td colSpan="5" className="p-4 text-center text-gray-500">Smenalar topilmadi</td></tr>
                ) : (
                  shifts.map((shift) => (
                    <tr key={shift.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">{shift.name}</td>
                      <td className="p-4">{shift.branch_name}</td>
                      <td className="p-4">{shift.start_time}</td>
                      <td className="p-4">{shift.end_time}</td>
                      <td className="p-4 flex gap-2">
                        <button
                          onClick={() => startEdit(shift)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <EditOutlined /> Tahrirlash
                        </button>
                        <button
                          onClick={() => handleDelete(shift.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <DeleteOutlined /> O‘chirish
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <ShiftEditModal
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingShift(null);
          }}
          onSave={handleUpdate}
          shiftData={editingShift}
          branches={branches}
        />

      </div>
    </div>
  );
};

export default ShiftList;




