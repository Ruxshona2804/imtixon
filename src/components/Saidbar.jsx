
import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import { Users, UserCheck, LayoutGrid, Clock } from 'lucide-react'; // иконки из lucide-react

const Saidbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const links = [
    { path: '/xodimlar', label: "Xodimlar ro’yxati", icon: <Users size={18} /> },
    { path: '/mijozlar', label: "Mijozlar", icon: <UserCheck size={18} /> },
    { path: '/bulimlar', label: "Bo'limlar", icon: <LayoutGrid size={18} /> },
    { path: '/smenalar', label: "Smenalar", icon: <Clock size={18} /> },
  ];

  return (
    <div className="bg-white p-5 border border-gray-300 h-full  w-full">
      <nav className="flex flex-col gap-4">
        {links.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition 
              ${
                currentPath === link.path
                  ? 'bg-blue-100 text-blue-700 font-semibold shadow'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
              }`}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Saidbar;
