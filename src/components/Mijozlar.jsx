import React, { useState, useEffect } from 'react';
import Saidbar from './Saidbar';
import CompanyInfo from './CompanyInfo';
import { mijozlar_url } from '../Utilits/url';
import { apiClient } from '../Utilits/apiservice';

const Mijozlar = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State for the search term

  const fetchEmployees = async () => {
    try {
      const res = await apiClient({
        url: mijozlar_url,
        method: 'get',
      });

      console.log(res?.data);
      if (res?.data?.results) {
        setEmployees(res.data.results);
      } else {
        setError("Ma'lumotlar olinmadi");
      }
    } catch (err) {
      setError(err.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <div className='w-[30%]'>
        <Saidbar />
      </div>

      {/* Main Content */}
      <div className="w-[70%] p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <h2 className="text-3xl font-bold text-gray-800">Mijozlar ro'yxati</h2>
          <div className='flex items-center gap-5'>
             <input
              type="text"
              placeholder="Search by Name"
              value={searchTerm}
              onChange={handleSearchChange}
              className="px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            />
            
            <button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-5 py-2 rounded-lg shadow-md transition duration-300">
              + Mijoz qo‘shish
            </button>
          </div>
        </div>

        {/* Card List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition duration-300"
            >
              <div className="flex items-center gap-4 mb-3">
                <img
                  src={emp.avatar || 'https://placehold.co/48x48'}
                  alt="avatar"
                  className="w-12 h-12 rounded-full border"
                />
                <div>
                  <h3 className="text-lg font-semibold text-blue-700">{emp.name}</h3>
                  <p className="text-sm text-gray-500">{emp.phone}</p>
                </div>
              </div>
              <div className="space-y-1 text-sm text-gray-700">
                <p><span className="font-medium">Shahar:</span> Toshkent</p>
                <p><span className="font-medium">Filial:</span> {emp.branch_name}</p>
                <p>
                  <span className="font-medium">Litsenziya:</span>{' '}
                  {emp.license_file ? (
                    <a
                      href={emp.license_file}
                      className="text-green-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ko‘rish
                    </a>
                  ) : (
                    <span className="italic text-gray-400">Yo‘q</span>
                  )}
                </p>
                <p className="text-gray-500 text-xs">
                  <span className="font-medium">Yaratilgan:</span>{' '}
                  {new Date(emp.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mijozlar;
