import React, { useState } from 'react';
import { Trash2, Sun, Moon, Clock, Leaf, Lock, Edit2, Save } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [logs, setLogs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [input, setInput] = useState({
    morning: { fed: false, ateAll: false, drank: false, pooped: false },
    evening: { ateLeaf: false, leafType: '', leafCount: '', drank: false, pooped: false },
    note: ''
  });

  const CORRECT_PASSWORD = "VITE_APP_PASSWORD";

  const handleLogin = () => {
    if (password === CORRECT_PASSWORD) setIsAuthenticated(true);
    else alert("密碼錯誤！");
  };

  const saveLog = () => {
    if (editingId) {
      setLogs(logs.map(log => log.id === editingId ? { ...log, ...input } : log));
      setEditingId(null);
    } else {
      setLogs([{ id: Date.now(), time: new Date().toLocaleString('zh-TW', { hour12: false }), ...input }, ...logs]);
    }
    resetForm();
  };

  const resetForm = () => {
    setInput({
      morning: { fed: false, ateAll: false, drank: false, pooped: false },
      evening: { ateLeaf: false, leafType: '', leafCount: '', drank: false, pooped: false },
      note: ''
    });
  };

  const startEdit = (log) => {
    setEditingId(log.id);
    setInput({ morning: log.morning, evening: log.evening, note: log.note });
  };

  const deleteLog = (id) => setLogs(logs.filter(log => log.id !== id));

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border text-center w-full max-w-sm">
          <Lock className="mx-auto text-emerald-600 mb-4" size={48} />
          <input type="password" className="w-full p-3 border rounded-lg mb-4 text-center" placeholder="請輸入密碼" onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleLogin} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition">登入日記</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-8 font-sans text-slate-800">
      <header className="max-w-3xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-bold text-emerald-700">🐢 蛋塔的日常日記</h1>
      </header>

      <main className="max-w-3xl mx-auto space-y-8">
        <section className="bg-white p-6 rounded-2xl shadow-lg border">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-amber-700 mb-3 flex items-center"><Sun size={20} className="mr-2" /> 上午行程</h3>
              <div className="space-y-2">
                <label className="flex items-center"><input type="checkbox" className="mr-2" checked={input.morning.fed} onChange={e => setInput({...input, morning: {...input.morning, fed: e.target.checked}})} /> 泡水餵食</label>
                <label className="flex items-center"><input type="checkbox" className="mr-2" checked={input.morning.ateAll} onChange={e => setInput({...input, morning: {...input.morning, ateAll: e.target.checked}})} /> 飼料全吃完</label>
                <label className="flex items-center"><input type="checkbox" className="mr-2" checked={input.morning.drank} onChange={e => setInput({...input, morning: {...input.morning, drank: e.target.checked}})} /> 有喝水</label>
                <label className="flex items-center"><input type="checkbox" className="mr-2" checked={input.morning.pooped} onChange={e => setInput({...input, morning: {...input.morning, pooped: e.target.checked}})} /> 有便便</label>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-indigo-700 mb-3 flex items-center"><Moon size={20} className="mr-2" /> 晚上行程</h3>
              <div className="space-y-2">
                <label className="flex items-center"><input type="checkbox" className="mr-2" checked={input.evening.ateLeaf} onChange={e => setInput({...input, evening: {...input.evening, ateLeaf: e.target.checked}})} /> 已餵新鮮葉子</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="種類" className="w-1/2 p-1 border rounded text-sm" value={input.evening.leafType} onChange={e => setInput({...input, evening: {...input.evening, leafType: e.target.value}})} />
                  <input type="text" placeholder="數量" className="w-1/2 p-1 border rounded text-sm" value={input.evening.leafCount} onChange={e => setInput({...input, evening: {...input.evening, leafCount: e.target.value}})} />
                </div>
                <label className="flex items-center"><input type="checkbox" className="mr-2" checked={input.evening.drank} onChange={e => setInput({...input, evening: {...input.evening, drank: e.target.checked}})} /> 有喝水</label>
                <label className="flex items-center"><input type="checkbox" className="mr-2" checked={input.evening.pooped} onChange={e => setInput({...input, evening: {...input.evening, pooped: e.target.checked}})} /> 有便便</label>
              </div>
            </div>
          </div>
          <textarea className="w-full mt-4 p-2 border rounded-lg" value={input.note} onChange={e => setInput({...input, note: e.target.value})} placeholder="備註..." rows="2" />
          <button onClick={saveLog} className="w-full mt-4 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition">
            {editingId ? '更新紀錄' : '儲存紀錄'}
          </button>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">歷程紀錄</h2>
          <div className="space-y-4">
            {logs.map(log => (
              <div key={log.id} className="bg-white p-5 rounded-xl border flex justify-between items-center">
                <div className="text-sm">
                  <div className="text-stone-400 flex items-center"><Clock size={14} className="mr-1" /> {log.time}</div>
                  <p>☀️ 上午: {log.morning.ateAll ? '✅全吃' : '❌未全吃'} | {log.morning.pooped ? '💩有便' : '🚫無便'} | {log.morning.drank ? '💧有喝水' : '🚫無水'}</p>
                  <p>🌙 晚上: <Leaf size={12} className="inline"/> {log.evening.ateLeaf ? `${log.evening.leafType} x${log.evening.leafCount}` : '無'} | {log.evening.drank ? '💧有喝水' : '🚫無水'}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(log)} className="text-blue-400 hover:text-blue-600"><Edit2 size={18} /></button>
                  <button onClick={() => deleteLog(log.id)} className="text-stone-300 hover:text-red-500"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
