import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalEvents: 128 });
  const [events, setEvents] = useState([
    { id: 1, event_type: 'order_placed', user_id: 'user_001', timestamp: '2026-05-12 10:00', status: 'delivered' },
    { id: 2, event_type: 'user_signup', user_id: 'user_002', timestamp: '2026-05-12 10:05', status: 'delivered' },
    { id: 3, event_type: 'order_placed', user_id: 'user_003', timestamp: '2026-05-12 10:10', status: 'failed' },
  ]);

  const chartData = [
    { time: '10:00', count: 12 },
    { time: '10:15', count: 18 },
    { time: '10:30', count: 15 },
    { time: '10:45', count: 25 },
    { time: '11:00', count: 30 },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Overview</h2>
        <p className="text-slate-500 mt-1">Real-time performance and event tracking</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm transition-transform hover:scale-[1.02]">
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">Total Events</p>
          <div className="flex items-baseline gap-2">
            <p className="text-5xl font-black text-indigo-600">{stats.totalEvents}</p>
            <span className="text-green-500 text-sm font-bold">↑ 12%</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mb-10">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-slate-800">Event Frequency</h3>
          <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 focus:outline-none">
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
          </select>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800">Recent Activity</h3>
          <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-8 py-4">Event Type</th>
                <th className="px-8 py-4">User ID</th>
                <th className="px-8 py-4">Timestamp</th>
                <th className="px-8 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mr-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="font-semibold text-slate-700">{event.event_type.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-slate-500 font-medium">{event.user_id}</td>
                  <td className="px-8 py-5 text-slate-400 text-sm">{event.timestamp}</td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      event.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${event.status === 'delivered' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      {event.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
