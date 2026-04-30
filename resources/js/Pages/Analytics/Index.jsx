import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, 
    AreaChart, Area
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function Index({ monthlyData, categoryData, savingsTrend, filters }) {
    
    const handleYearChange = (year) => {
        router.get(route('analytics.index'), { year }, { preserveState: true });
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">วิเคราะห์การเงิน</h2>
                    <select 
                        value={filters.year}
                        onChange={(e) => handleYearChange(e.target.value)}
                        className="rounded-xl border-slate-200 text-sm font-bold text-slate-700 focus:ring-blue-500 focus:border-blue-500"
                    >
                        {years.map(y => (
                            <option key={y} value={y}>ปี พ.ศ. {y + 543}</option>
                        ))}
                    </select>
                </div>
            }
        >
            <Head title="วิเคราะห์" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* 1. Monthly Comparison Chart */}
                        <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-blue-100/50">
                            <h3 className="text-xl font-black text-slate-800 mb-8 text-center">
                                เปรียบเทียบรายรับ-รายจ่าย (ปี {filters.year + 543})
                            </h3>
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `฿${value.toLocaleString()}`} />
                                        <Tooltip 
                                            contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                                            formatter={(value) => `฿${value.toLocaleString()}`}
                                        />
                                        <Legend wrapperStyle={{paddingTop: '20px'}} iconType="circle" />
                                        <Bar dataKey="income" name="รายรับ" fill="#10b981" radius={[6, 6, 0, 0]} barSize={20} />
                                        <Bar dataKey="expense" name="รายจ่าย" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* 2. Category Breakdown Pie Chart */}
                        <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-blue-100/50">
                            <h3 className="text-xl font-black text-slate-800 mb-8 text-center">
                                สัดส่วนรายจ่ายรวม (ปี {filters.year + 543})
                            </h3>
                            <div className="h-[350px] w-full flex flex-col md:flex-row items-center">
                                <div className="w-full md:w-1/2 h-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={categoryData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {categoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => `฿${value.toLocaleString()}`} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="w-full md:w-1/2 space-y-3 mt-8 md:mt-0 max-h-full overflow-y-auto px-4">
                                    {categoryData.map((entry, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{backgroundColor: entry.color || COLORS[index % COLORS.length]}}></div>
                                                <span className="text-sm font-bold text-slate-600 truncate max-w-[100px]">{entry.name}</span>
                                            </div>
                                            <span className="text-sm font-black text-slate-800">฿{entry.value.toLocaleString()}</span>
                                        </div>
                                    ))}
                                    {categoryData.length === 0 && <p className="text-center text-slate-400 italic">ไม่มีข้อมูลในปีนี้</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Monthly Savings Trend */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-blue-100/50">
                        <h3 className="text-xl font-black text-slate-800 mb-8 text-center">
                            แนวโน้มเงินออมรายเดือน (ปี {filters.year + 543})
                        </h3>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={savingsTrend}>
                                    <defs>
                                        <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 'bold'}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `฿${value.toLocaleString()}`} />
                                    <Tooltip 
                                        contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                                        formatter={(value) => `฿${value.toLocaleString()}`}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="savings" 
                                        name="เงินออมเดือนนี้"
                                        stroke="#10b981" 
                                        strokeWidth={4}
                                        fillOpacity={1} 
                                        fill="url(#colorSavings)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
