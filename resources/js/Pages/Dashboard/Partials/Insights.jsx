import React from 'react';
import { Link } from '@inertiajs/react';

export default function Insights({ data }) {
    return (
        <div className="bg-white rounded-[2rem] p-6 shadow-lg shadow-blue-900/5 border border-blue-100/50 flex flex-col justify-between">
            <div>
                <h4 className="text-lg font-black text-slate-800 mb-6">ข้อมูลเชิงลึก</h4>
                <div className="space-y-5">
                    {/* Top Expense */}
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center text-lg">
                            {data?.topCategory?.icon || '☕'}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-700">หมวดหมู่จ่ายหนัก</p>
                            <p className="text-xs text-slate-400 font-medium">
                                {data?.topCategory 
                                    ? `${data.topCategory.name}: ฿${data.topCategory.amount.toLocaleString()}` 
                                    : 'ยังไม่มีข้อมูลการใช้จ่าย'}
                            </p>
                        </div>
                    </div>

                    {/* Budget Status */}
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-green-50 flex items-center justify-center text-lg">
                            🥦
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-700">งบประมาณ</p>
                            <p className="text-xs text-slate-400 font-medium">
                                {data?.budget 
                                    ? `เหลืออีก ฿${data.budget.remaining.toLocaleString()}` 
                                    : 'ยังไม่ได้ตั้งงบประมาณ'}
                            </p>
                        </div>
                    </div>

                    {/* Savings Goal */}
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center text-lg">
                            🎯
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-700">เป้าหมายเงินออม</p>
                            <p className="text-xs text-slate-400 font-medium">สำเร็จแล้ว {data?.savingsPercent || 0}%</p>
                        </div>
                    </div>
                </div>
            </div>
            <Link href={route('reports.index')} className="mt-6 text-blue-600 font-bold text-sm hover:text-blue-700 transition-colors flex items-center gap-1">
                ดูรายงานฉบับเต็ม
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
            </Link>
        </div>
    );
}
