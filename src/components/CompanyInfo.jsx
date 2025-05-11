import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompany } from '../features/company/companySlice';

const CompanyInfo = () => {
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) => state.company);

    useEffect(() => {
        dispatch(fetchCompany());
    }, [dispatch]);

    if (loading) return <div>Yuklanmoqda...</div>;
    if (error) return <div>Xatolik: {error}</div>;

    return (
        <div className="relative">
            <select
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 appearance-none bg-white"
            >
                <option disabled selected value="">
                    Filial tanlang
                </option>
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

export default CompanyInfo;
