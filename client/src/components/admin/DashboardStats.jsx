import React from 'react';
import {
    Users,
    Building2,
    Briefcase,
    TrendingUp,
    MoreHorizontal
} from 'lucide-react';

const DashboardStats = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <StatCard
                title="Total Users"
                value={stats.totalUsers || 0}
                icon={Users}
                color="blue"
                trend="+12% this week"
            />
            <StatCard
                title="Active Companies"
                value={stats.totalCompanies || 0}
                icon={Building2}
                color="indigo"
                trend="+5 new today"
            />
            <StatCard
                title="Jobs Posted"
                value={stats.totalJobs || 0}
                icon={Briefcase}
                color="purple"
                trend="8 active listings"
            />
            <StatCard
                title="Pending Actions"
                value={stats.pendingTotal || 0}
                icon={TrendingUp}
                color="orange"
                trend="Requires attention"
                isAlert={stats.pendingTotal > 0}
            />
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, color, trend, isAlert }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        indigo: 'bg-indigo-50 text-indigo-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600',
    };

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                    <Icon size={16} />
                </div>
                {/* Optional: Add menu if needed, removed for compactness */}
            </div>
            <div>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">{value}</h3>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wide opacity-70 mb-2">{title}</p>
            </div>
            <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${isAlert ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                    {trend}
                </span>
            </div>
        </div>
    );
};

export default DashboardStats;
