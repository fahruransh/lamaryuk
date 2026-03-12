import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { STATUS_OPTIONS } from '../../utils/constants';
import { groupByStatus } from '../../utils/helpers';

const STATUS_COLORS = {
  'Draft':         '#94a3b8',
  'Sudah Dilamar': '#38bdf8',
  'Diproses':      '#fbbf24',
  'Interview':     '#a78bfa',
  'Tes':           '#fb923c',
  'Offer':         '#34d399',
  'Ditolak':       '#fb7185',
  'Diterima':      '#4ade80',
};

export default function DashboardCharts({ applications }) {
  const byStatus = groupByStatus(applications);

  const pieData = STATUS_OPTIONS
    .filter(s => byStatus[s.value] > 0)
    .map(s => ({ name: s.label, value: byStatus[s.value], color: STATUS_COLORS[s.value] }));

  const barData = STATUS_OPTIONS.map(s => ({
    name: s.emoji + ' ' + s.label,
    jumlah: byStatus[s.value] || 0,
    color: STATUS_COLORS[s.value],
  })).filter(d => d.jumlah > 0);

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
        fontSize={11} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (applications.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Pie chart */}
      <div className="card">
        <h3 className="section-title mb-4">📊 Sebaran Status</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" outerRadius={90}
              dataKey="value" labelLine={false} label={<CustomLabel />}>
              {pieData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ borderRadius: 12, fontSize: 12, border: '1px solid #fce7f3' }} />
          </PieChart>
        </ResponsiveContainer>
        {/* Legend */}
        <div className="flex flex-wrap gap-2 mt-2 justify-center">
          {pieData.map(d => (
            <span key={d.name} className="flex items-center gap-1 text-xs text-gray-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
              {d.name} ({d.value})
            </span>
          ))}
        </div>
      </div>

      {/* Bar chart */}
      <div className="card">
        <h3 className="section-title mb-4">📈 Jumlah per Status</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" />
            <XAxis dataKey="name" tick={{ fontSize: 9 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
            <Bar dataKey="jumlah" radius={[6, 6, 0, 0]}>
              {barData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
