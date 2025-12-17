
import { Clock, CheckCircle, XCircle, AlertCircle, ShoppingBag, UserPlus } from 'lucide-react'

// Mock Data for Recent Activity
const activities = [
    { id: 1, type: 'ORDER', message: 'New order #ORD-2024-045 received from ACE Delhi.', time: '2 mins ago', icon: ShoppingBag, color: 'text-blue-500 bg-blue-100' },
    { id: 2, type: 'DEALER', message: 'New dealer application: ACE Bangalore South.', time: '1 hour ago', icon: UserPlus, color: 'text-purple-500 bg-purple-100' },
    { id: 3, type: 'ALERT', message: 'Low stock alert: Hydraulic Cylinder FX14.', time: '3 hours ago', icon: AlertCircle, color: 'text-yellow-500 bg-yellow-100' },
    { id: 4, type: 'SUCCESS', message: 'Order #ORD-2024-040 delivered successfully.', time: '5 hours ago', icon: CheckCircle, color: 'text-green-500 bg-green-100' },
    { id: 5, type: 'ERROR', message: 'Payment failed for Order #ORD-2024-044.', time: '1 day ago', icon: XCircle, color: 'text-red-500 bg-red-100' },
]

export default function RecentActivity() {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md h-full">
            <h3 className="text-lg font-bold mb-6 text-gray-800">Recent Activity</h3>
            <div className="space-y-6">
                {activities.map((activity) => (
                    <div key={activity.id} className="flex gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                            <activity.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button className="w-full mt-6 py-2 text-sm text-primary-600 font-medium hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors">
                View All Activity
            </button>
        </div>
    )
}
