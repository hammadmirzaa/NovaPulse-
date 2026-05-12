import React, { useState } from 'react';
import axios from 'axios';
import { Send, AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react';

const SendEvent = () => {
  const [formData, setFormData] = useState({
    event_type: 'order_placed',
    user_id: '',
    payload: '{\n  "item": "Laptop",\n  "price": 1200\n}'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      let payloadObj;
      try {
        payloadObj = JSON.parse(formData.payload);
      } catch (jsonErr) {
        throw new Error("Invalid JSON payload format");
      }

      const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');
      
      const response = await axios.post(`${apiUrl}/api/events`, {
        event_type: formData.event_type,
        user_id: formData.user_id,
        payload: payloadObj
      });
      
      setMessage({ type: 'success', text: `Message published successfully. ID: ${response.data.event_id}` });
    } catch (err) {
      const errorDetail = err.response?.data?.detail || err.message;
      setMessage({ type: 'error', text: `Error: ${errorDetail}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <header className="mb-10 text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Send Event</h2>
        <p className="text-slate-500 mt-2">Trigger real-time notifications across the system</p>
      </header>
      
      <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Event Category</label>
              <div className="relative">
                <select
                  value={formData.event_type}
                  onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-700 font-medium focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 focus:outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="order_placed">Order Placed</option>
                  <option value="user_signup">User Signup</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Recipient ID</label>
              <input
                type="text"
                required
                value={formData.user_id}
                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                placeholder="e.g. user_99"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-700 font-medium focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Data Payload (JSON)</label>
            <div className="relative group">
              <textarea
                rows="8"
                required
                value={formData.payload}
                onChange={(e) => setFormData({ ...formData, payload: e.target.value })}
                className="w-full bg-slate-900 text-slate-300 border border-slate-800 rounded-2xl px-6 py-5 font-mono text-sm focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all"
              />
              <div className="absolute top-4 right-4 text-slate-600 text-xs font-mono uppercase">JSON Editor</div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 px-8 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><Send className="w-5 h-5" /> Publish Notification</>
            )}
          </button>
        </form>

        {message && (
          <div className={`mt-10 p-6 rounded-2xl flex items-start gap-4 animate-in fade-in zoom-in-95 duration-300 ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-rose-50 text-rose-800 border border-rose-100'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" /> : <AlertCircle className="w-6 h-6 text-rose-500 shrink-0" />}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide">{message.type === 'success' ? 'Success' : 'Action Required'}</h4>
              <p className="text-sm mt-1 opacity-90">{message.text}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendEvent;
