import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { fetchCompany } from "../features/company/companySlice";
import { useNavigate } from "react-router-dom";

const AddShift = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("access");

  const { data: companyData, loading, error } = useSelector((state) => state.company);
  const branches = companyData?.branches || [];

  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    start_time: "",
    end_time: "",
  });

  useEffect(() => {
    dispatch(fetchCompany());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "branch" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://api.noventer.uz/api/v1/company/shift-create/",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Smena muvaffaqiyatli qo‘shildi!");
      navigate("/smenalar"); 
    } catch (err) {
      alert("Xatolik yuz berdi: " + (err.response?.data?.detail || "Serverda muammo"));
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Yangi Smena Qo‘shish</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Smena nomi</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1">Filial</label>
          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
          >
            <option disabled value="">Filialni tanlang</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Boshlanish vaqti (masalan: 08:00)</label>
          <input
            type="time"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Tugash vaqti (masalan: 17:00)</label>
          <input
            type="time"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Qo‘shish
        </button>
      </form>
    </div>
  );
};

export default AddShift;
