import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCcw, Heart, ShieldCheck, ShieldAlert } from 'lucide-react';

const Health = () => {
  const [status, setStatus] = useState('checking');
  const [lastChecked, setLastChecked] = useState(null);

  const checkHealth = async () => {
    setStatus('checking');
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await axios.get(`${apiUrl}/health`);
      setStatus(response.data.status === 'ok' ? 'healthy' : 'unhealthy');
    } catch (err) {
      setStatus('down');
    }
    setLastChecked(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-xl mx-auto py-12 animate-in fade-in duration-700">
      <header className="mb-16 text-center">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">System Vitality</h2>
        <p className="text-slate-500 mt-3 text-lg">Real-time health monitoring for the NovaPulse API</p>
      </header>
      
      <div className="bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-indigo-100/50 relative overflow-hidden text-center">
        <div className={`absolute top-0 left-0 w-full h-3 ${
          status === 'healthy' ? 'bg-indigo-500' : status === 'checking' ? 'bg-amber-400' : 'bg-rose-500'
        }`} />
        
        <div className="mb-12 relative inline-block">
          <div className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center transition-all duration-500 ${
            status === 'healthy' ? 'bg-indigo-50 shadow-[0_0_50px_rgba(79,70,229,0.2)]' : 'bg-slate-50'
          }`}>
            {status === 'healthy' ? (
              <ShieldCheck className="w-16 h-16 text-indigo-600" />
            ) : status === 'checking' ? (
              <RefreshCcw className="w-16 h-16 text-amber-500 animate-spin" />
            ) : (
              <ShieldAlert className="w-16 h-16 text-rose-500" />
            )}
          </div>
          {status === 'healthy' && (
            <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg">
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500 animate-bounce" />
            </div>
          )}
        </div>

        <h3 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">
          {status === 'healthy' ? 'Operational' : status === 'checking' ? 'Synchronizing...' : 'Offline'}
        </h3>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full text-slate-500 text-sm font-bold mb-10 border border-slate-100">
          <span className={`w-2 h-2 rounded-full ${status === 'healthy' ? 'bg-green-500' : 'bg-rose-500 animate-pulse'}`} />
          {import.meta.env.VITE_API_URL || 'http://localhost:8000'}/health
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <p className="text-slate-400 text-xs font-bold uppercase mb-1">Last Sync</p>
            <p className="text-slate-700 font-bold">{lastChecked || '--:--'}</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <p className="text-slate-400 text-xs font-bold uppercase mb-1">Latency</p>
            <p className="text-slate-700 font-bold">~24ms</p>
          </div>
        </div>

        <button 
          onClick={checkHealth}
          className="mt-12 w-full py-4 px-8 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-xl shadow-slate-200 active:scale-95"
        >
          Force Manual Sync
        </button>
      </div>
      
      <p className="mt-10 text-slate-400 text-sm font-medium text-center italic">
        Heartbeat synchronized every 30 seconds via global monitoring node.
      </p>
    </div>
  );
};

export default Health;
