import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface MenuItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

interface SidebarProps {
  menuItems: MenuItem[];
}

export default function Sidebar({ menuItems }: SidebarProps) {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon
                  className={`mr-3 h-5 w-5 ${
                    isActive ? 'text-indigo-700' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}