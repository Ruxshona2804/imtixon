import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompany } from '../features/company/companySlice';

const CompanyInfo = ({ onBranchSelect }) => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.company);
  const [selectedBranchId, setSelectedBranchId] = useState('');

  useEffect(() => {
    dispatch(fetchCompany());
  }, [dispatch]);

  const handleBranchChange = (e) => {
    const branchId = e.target.value;
    setSelectedBranchId(branchId);
    onBranchSelect(branchId); // Filial ID'sini yuqori komponentga uzatamiz
  };

  if (loading) return <div>Yuklanmoqda...</div>;
  if (error) return <div>Xatolik: {error}</div>;

  return (
    <div className="relative">
      <select
        className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 appearance-none bg-white"
        value={selectedBranchId}
        onChange={handleBranchChange}
      >
        <option value="">Filial tanlang</option>
        {data?.branches?.map((branch) => (
          <option key={branch.id} value={branch.id}>
            {branch.name}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

const AddEmployeeForm = () => {
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
    branch_id: '',
    department_id: '',
    shift_id: '',
    position: 'employee',
    salary: '',
    official_salary: '',
  });

  const [departments, setDepartments] = useState([]);
  const [shifts, setShifts] = useState([]);
  const token = sessionStorage.getItem('access');

  const [selectedBranchId, setSelectedBranchId] = useState(''); // State for selected branch

  const handleBranchSelect = (branchId) => {
    setSelectedBranchId(branchId);
    setFormData(prev => ({ ...prev, branch_id: branchId }));
  };


  const genders = [
    { label: 'Erkak', value: 'male' },
    { label: 'Ayol', value: 'female' },
  ];

  const salaryTypes = [
    { label: 'Rasmiy', value: 'official' },
    { label: 'Norasmiy', value: 'unofficial' },
  ];

  const positions = [
    { label: 'Direktor', value: 'director' },
    { label: 'Manager', value: 'manager' },
    { label: 'Xodim', value: 'employee' },
  ];


  useEffect(() => {
    if (selectedBranchId) {
      // Bo‘limlar
      axios.get(`https://api.noventer.uz/api/v1/company/departments/${selectedBranchId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => setDepartments(res.data))
        .catch(err => console.error(err));

      // Smenalar
      axios.get(`https://api.noventer.uz/api/v1/company/shifts/${selectedBranchId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => setShifts(res.data))
        .catch(err => console.error(err));
    } else {
      setDepartments([]);
      setShifts([]);
      setFormData(prev => ({ ...prev, department_id: '', shift_id: '' }));
    }
  }, [selectedBranchId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.user) {
      setFormData(prev => ({
        ...prev,
        user: {
          ...prev.user,
          [name]: value,
        },
      }));
    } else {
      setFormData(prev => ({
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
      alert('Xodim muvaffaqiyatli qo‘shildi!');
      // Formani tozalash (agar kerak bo'lsa)
      setFormData({
        user: {
          full_name: '',
          gender: '',
          phone_number: '',
          passport_number: '',
          jshshr: '',
          birth_date: '',
          salary_type: 'official',
        },
        branch_id: '',
        department_id: '',
        shift_id: '',
        position: 'employee',
        salary: '',
        official_salary: '',
      });
      setSelectedBranchId('');
    } catch (error) {
      console.error('Error:', error.response || error.message);
      alert('Xodimni qo‘shishda xatolik yuz berdi.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-[1440px] mx-auto mt-8 bg-white shadow-lg rounded-2xl p-6 md:p-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Yangi xodim qo'shish</h2>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2 space-y-5">
          {/* User fields */}
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">F.I.O:</label>
            <input type="text" id="full_name" name="full_name" value={formData.user.full_name} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none transition" required />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Jinsi:</label>
            <select id="gender" name="gender" value={formData.user.gender} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 bg-white focus:ring-2 focus:ring-blue-400 outline-none transition" required>
              <option value="">Tanlang</option>
              {genders.map(gender => (
                <option key={gender.value} value={gender.value}>{gender.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">Telefon raqami:</label>
            <input type="tel" id="phone_number" name="phone_number" value={formData.user.phone_number} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none transition" required />
          </div>

          <div>
            <label htmlFor="passport_number" className="block text-sm font-medium text-gray-700 mb-1">Passport raqami:</label>
            <input type="text" id="passport_number" name="passport_number" value={formData.user.passport_number} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none transition" />
          </div>

          <div>
            <label htmlFor="jshshr" className="block text-sm font-medium text-gray-700 mb-1">JSHSHR:</label>
            <input type="text" id="jshshr" name="jshshr" value={formData.user.jshshr} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none transition" />
          </div>

          <div>
            <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700 mb-1">Tug'ilgan sanasi:</label>
            <input type="date" id="birth_date" name="birth_date" value={formData.user.birth_date} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none transition" required />
          </div>
        
        </div>
        <div className="w-full lg:w-1/2 space-y-5">
          {/* Other fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filialni tanlang:</label>
            <CompanyInfo onBranchSelect={handleBranchSelect} />
          </div>

          <div>
            <label htmlFor="department_id" className="block text-sm font-medium text-gray-700 mb-1">Bo'lim:</label>
            <select id="department_id" name="department_id" value={formData.department_id} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 bg-white focus:ring-2 focus:ring-blue-400 outline-none transition" required>
              <option value="">Tanlang</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name || dept.id}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="shift_id" className="block text-sm font-medium text-gray-700 mb-1">Smena:</label>
            <select id="shift_id" name="shift_id" value={formData.shift_id} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 bg-white focus:ring-2 focus:ring-blue-400 outline-none transition" required>
              <option value="">Tanlang</option>
              {shifts.map(shift => (
                <option key={shift.id} value={shift.id}>{shift.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">Lavozim:</label>
            <select id="position" name="position" value={formData.position} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 bg-white focus:ring-2 focus:ring-blue-400 outline-none transition" required>
              <option value="">Tanlang</option>
              {positions.map(pos => (
                <option key={pos.value} value={pos.value}>{pos.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">Rasmiy oylik:</label>
            <input type="number" id="salary" name="salary" value={formData.salary} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none transition" required />
          </div>

          <div>
            <label htmlFor="official_salary" className="block text-sm font-medium text-gray-700 mb-1">Norasmiy oylik:</label>
            <input type="number" id="official_salary" name="official_salary" value={formData.official_salary} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none transition" required />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition">
          Qo'shish
        </button>
      </div>
    </form>
  );
};

export default AddEmployeeForm;
// <div className="mb-4">
//     <label htmlFor="salary_type" className="block text-gray-700 text-sm font-bold mb-2">Ish haqi turi:</label>
//     <select id="salary_type" name="salary_type" value={formData.user.salary_type} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
//         <option value="">Tanlang</option>
//         {salaryTypes.map(type => (
//             <option key={type.value} value={type.value}>{type.label}</option>
//         ))}
//     </select>
// </div>