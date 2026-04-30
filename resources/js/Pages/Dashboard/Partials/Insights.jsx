import React from 'react';
import { Link } from '@inertiajs/react';

export default function Insights({ data }) {
    return (
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-blue-900/5 border border-blue-100/50 flex flex-col group">
            <div>
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                    <h4 className="text-xl font-black text-slate-800 tracking-tight">ข้อมูลเชิงลึก</h4>
                </div>
                
                <div className="space-y-8">
                    {/* Top Expense */}
                    <div className="flex items-start gap-4 group/item">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl shadow-sm group-hover/item:scale-110 transition-transform">
                            {data?.topCategory?.icon || '☕'}
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">จ่ายหนักที่สุด</p>
                            <p className="text-sm font-black text-slate-700 leading-none mb-1">
                                {data?.topCategory?.name || 'ยังไม่มีข้อมูล'}
                            </p>
                            <p className="text-xs font-bold text-amber-600">
                                {data?.topCategory ? `฿${data.topCategory.amount.toLocaleString()}` : '-'}
                            </p>
                        </div>
                    </div>

                    {/* Budget Status */}
                    <div className="flex items-start gap-4 group/item">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-2xl shadow-sm group-hover/item:scale-110 transition-transform">
                            🥦
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">งบประมาณอาหาร</p>
                            <p className="text-sm font-black text-slate-700 leading-none mb-1">
                                {data?.budget ? 'กำลังดำเนินการ' : 'ยังไม่ได้ตั้งค่า'}
                            </p>
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">
                                    {data?.budget ? `เหลืออีก ฿${data.budget.remaining.toLocaleString()}` : '0% used'}
                                </p>
                                {data?.budget && (
                                    <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '45%' }}></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Savings Progress */}
                    <div className="flex items-start gap-4 group/item">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl shadow-sm group-hover/item:scale-110 transition-transform">
                            🎯
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ความคืบหน้าโดยรวม</p>
                            <p className="text-sm font-black text-slate-700 leading-none mb-1">เป้าหมายเงินออม</p>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${data?.savingsPercent || 0}%` }}></div>
                                </div>
                                <span className="text-[10px] font-black text-blue-600">{data?.savingsPercent || 0}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Link href={route('reports.index')} className="mt-10 group/link flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-50 text-slate-600 font-bold text-sm hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                ดูรายงานฉบับเต็ม
                <svg className="group-hover/link:translate-x-1 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
            </Link>
        </div>
    );
}
