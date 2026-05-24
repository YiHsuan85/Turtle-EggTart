import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Sun, Moon, Leaf, Trophy } from 'lucide-react';

export default function StatsView({ logs }: { logs: any[] }) {
  const totalLogs = logs.length;
  
  if (totalLogs === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-2xl shadow border text-stone-500">
        目前還沒有紀錄，開始填寫日記來解鎖統計數據吧！🐢
      </div>
    );
  }

  const stats = logs.reduce((acc, log) => {
    if (log.morning.pooped) acc.morningPoops++;
    if (log.evening.pooped) acc.eveningPoops++;
    if (log.morning.ateAll) acc.ateAllStats++;
    if (log.evening.ateLeaf) acc.ateLeafStats++;
    
    // Leaf types
    if (log.evening.ateLeaf && log.evening.leafType) {
      const type = log.evening.leafType.trim();
      acc.leafTypes[type] = (acc.leafTypes[type] || 0) + 1;
    }
    
    return acc;
  }, { morningPoops: 0, eveningPoops: 0, ateAllStats: 0, ateLeafStats: 0, leafTypes: {} as Record<string, number> });

  const leafData = Object.entries(stats.leafTypes).map(([name, value]) => ({ name, value: Number(value) })).sort((a, b) => b.value - a.value);
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow border text-center">
          <div className="text-stone-500 text-sm mb-1">紀錄天數</div>
          <div className="text-3xl font-bold text-emerald-700">{totalLogs}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow border text-center">
          <div className="text-stone-500 flex items-center justify-center text-sm mb-1"><Trophy size={16} className="mr-1"/>晨間完食</div>
          <div className="text-3xl font-bold text-amber-600">{stats.ateAllStats}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow border text-center">
          <div className="text-stone-500 flex items-center justify-center text-sm mb-1"><Leaf size={16} className="mr-1"/>吃菜天數</div>
          <div className="text-3xl font-bold text-indigo-600">{stats.ateLeafStats}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow border text-center">
          <div className="text-stone-500 text-sm mb-1">大便總計</div>
          <div className="text-3xl font-bold text-stone-700">{stats.morningPoops + stats.eveningPoops} <span className="text-sm">次</span></div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h3 className="font-bold text-lg mb-4 text-stone-700 flex items-center">💩 便便分佈</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: '🌞 上午', count: stats.morningPoops },
                { name: '🌙 晚上', count: stats.eveningPoops }
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <RechartsTooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {leafData.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow border">
            <h3 className="font-bold text-lg mb-4 text-stone-700 flex items-center"><Leaf size={20} className="mr-2 text-emerald-600" /> 菜菜喜好分佈</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leafData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {leafData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
