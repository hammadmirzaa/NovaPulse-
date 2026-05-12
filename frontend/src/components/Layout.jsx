import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Send, Activity } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Send Event', path: '/send', icon: Send },
    { name: 'Health', path: '/health', icon: Activity },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <aside className="w-72 bg-white border-r border-slate-200 shadow-sm sticky top-0 h-screen overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">NovaPulse</h1>
          </div>
        </div>
        <nav className="mt-4 px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 p-10 w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default Layout;
