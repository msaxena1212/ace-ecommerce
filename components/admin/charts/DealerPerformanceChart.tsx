
'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
    { name: 'ACE Delhi', score: 95, orders: 150 },
    { name: 'ACE Mumbai', score: 92, orders: 180 },
    { name: 'ACE Hyd', score: 88, orders: 95 },
    { name: 'ACE Kol', score: 85, orders: 70 },
    { name: 'ACE Chen', score: 91, orders: 120 },
]

export default function DealerPerformanceChart() {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Top Dealer Performance</h3>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" fontSize={12} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="score" fill="#4ade80" name="Performance Score" />
                        <Bar dataKey="orders" fill="#facc15" name="Total Orders" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
