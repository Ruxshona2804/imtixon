import axios from 'axios';
import { useState } from 'react';

const AddEmployeeForm = () => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    user: {
      full_name: '',
      gender: '',
      phone_number: '',
      passport_number: '',
      jshshr: '',
      birth_date: '',
      salary_type: 'official',
    },
    branch_id: 1,
    department_id: 1,
    shift_id: 3,
    position: 'employee',
    salary: '',
    official_salary: '',
  });

  const token = sessionStorage.getItem('access');



  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name in formData.user) {
      setFormData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'https://api.noventer.uz/api/v1/employee/employees/',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Success:', response.data);
      alert('Xodim muvaffaqiyatli qo‘shildi!');
    } catch (error) {
      console.error('Error:', error.response || error.message);
      alert('Xodimni qo‘shishda xatolik yuz berdi.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4  border ">
      <input name="full_name" value={formData.user.full_name} onChange={handleChange} placeholder="F.I.SH" className="input  border " />
      <select name="gender" value={formData.user.gender} onChange={handleChange} className="input">
        <option value="">Jinsi</option>
        <option value="male">Erkak</option>
        <option value="famale">Ayol</option>
      </select>
      <input name="phone_number" value={formData.user.phone_number} onChange={handleChange} placeholder="Telefon raqami" className="input  border " />
      <input name="birth_date" type="date" value={formData.user.birth_date} onChange={handleChange} className="input  border " />
      <input name="passport_number" value={formData.user.passport_number} onChange={handleChange} placeholder="Passport" className="input  border " />
      <input name="jshshr" value={formData.user.jshshr} onChange={handleChange} placeholder="JSHSHIR" className="input  border " />

      <input name="salary" value={formData.salary} onChange={handleChange} placeholder="Rasmiy oylik" className="input  border " />
      <input name="official_salary" value={formData.official_salary} onChange={handleChange} placeholder="Norasmiy oylik" className="input  border " />

      {/* Можно также сделать селекты для branch_id, department_id, shift_id и position */}

      <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">
        Qo‘shish
      </button>
    </form>
  );
};

export default AddEmployeeForm;

