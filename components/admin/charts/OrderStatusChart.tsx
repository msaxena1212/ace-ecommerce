
'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const data = [
    { name: 'Delivered', value: 120, color: '#22c55e' },
    { name: 'In Transit', value: 45, color: '#3b82f6' },
    { name: 'Processing', value: 25, color: '#eab308' },
    { name: 'Cancelled', value: 10, color: '#ef4444' },
]

export default function OrderStatusChart() {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Order Status Distribution</h3>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
