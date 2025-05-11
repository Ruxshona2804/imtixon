import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompany } from '../features/company/companySlice';
import Saidbar from './Saidbar';

const CompanyInfo = ({ branches, onBranchChange }) => {
  return (
    <div className="relative">
      <select
        className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 appearance-none bg-white"
        onChange={onBranchChange}
      >
        <option disabled selected value="">
          Filial tanlang
        </option>
        {branches?.map((branch) => (
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

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [errorEmployees, setErrorEmployees] = useState(null);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const token = sessionStorage.getItem('access');
  const dispatch = useDispatch();
  const { data: companyData, loading: loadingCompany, error: errorCompany } = useSelector((state) => state.company);
  const branches = companyData?.branches || [];

  useEffect(() => {
    dispatch(fetchCompany());
  }, [dispatch]);

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!token) {
        setErrorEmployees('Token not found');
        setLoadingEmployees(false);
        return;
      }
      if (!selectedBranchId) {
        setEmployees([]);
        setLoadingEmployees(false);
        return;
      }

      try {
        setLoadingEmployees(true);
        const response = await axios.get(
          `https://api.noventer.uz/api/v1/employee/employees/branch/${selectedBranchId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEmployees(response.data.results);
      } catch (err) {
        setErrorEmployees(err.response ? err.response.data : err.message);
      } finally {
        setLoadingEmployees(false);
      }
    };

    fetchEmployees();
  }, [token, selectedBranchId]);

  const handleBranchChange = (event) => {
    setSelectedBranchId(event.target.value);
  };

  if (loadingCompany) return <div>Yuklanmoqda ma'lumotlar...</div>;
  if (errorCompany) return <div>Xatolik kompaniya ma'lumotlarini yuklashda: {errorCompany}</div>;
  if (loadingEmployees) return <div>Yuklanmoqda xodimlar...</div>;
  if (errorEmployees) return <div>Xatolik xodimlarni yuklashda: {typeof errorEmployees === 'string' ? errorEmployees : JSON.stringify(errorEmployees)}</div>;

  return (
    <div className="flex">
      <div className='w-[30%] border border-gray-200'>
        <Saidbar />
      </div>
      <div className="w-[70%] p-6">
        <div className="flex justify-between items-center gap-3 mb-4">
          <h2 className="text-2xl font-semibold">Xodimlar ro'yxati</h2>
         <div className='flex items-center gap-4'>
         <CompanyInfo branches={branches} onBranchChange={handleBranchChange} />
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
            + Xodim qo‘shish
          </button>
         </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full border table-auto text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-4"><input type="checkbox" /></th>
                <th className="p-4">F.I.Sh</th>
                <th className="p-4">ROLE</th>
                <th className="p-4">PHONE</th>
                <th className="p-4">ISHGA QABUL QILUVCHI FILIAL</th>
                <th className="p-4">SMENASI</th>
                <th className="p-4">TUG‘ILGAN SANA</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="border-b hover:bg-gray-50">
                  <td className="p-4"><input type="checkbox" /></td>
                  <td className="p-4 flex items-center gap-2">
                    <img
                      src="https://placehold.co/32x32"
                      alt="avatar"
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-blue-600 hover:underline cursor-pointer">
                      {emp.user_full_name}
                    </span>
                  </td>
                  <td className="p-4">{emp.user_role}</td>
                  <td className="p-4">{emp.user?.phone_number}</td>
                  <td className="p-4">{emp.branch_name}</td>
                  <td className="p-4">{emp.start_time} - {emp.end_time}</td>
                  <td className="p-4">{emp.user?.birth_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;

