import React from 'react';

export default function BalanceCard({ totalBalance, monthlyIncome, monthlyExpense }) {
    return (
        <div className="rounded-[2rem] p-6 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 shadow-2xl shadow-blue-500/20">
            <div className="relative z-10">
                <p className="text-blue-100 font-bold text-sm uppercase tracking-widest mb-2">ยอดเงินคงเหลือทั้งหมด</p>
                <h3 className="text-4xl font-black text-white mb-8 tracking-tight">
                    ฿{(totalBalance || 0).toLocaleString()}
                </h3>

                <div className="flex gap-3">
                    <div className="bg-white/10 rounded-2xl p-4 flex-1 backdrop-blur-md border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-lg bg-green-400/30 flex items-center justify-center">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round">
                                    <path d="M12 19V5M5 12l7-7 7 7" />
                                </svg>
                            </div>
                            <p className="text-blue-100 text-sm font-bold">รายรับ</p>
                        </div>
                        <p className="text-white font-black text-2xl tracking-tight">฿{(monthlyIncome || 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-white/10 rounded-2xl p-4 flex-1 backdrop-blur-md border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-lg bg-rose-400/30 flex items-center justify-center">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fb7185" strokeWidth="3" strokeLinecap="round">
                                    <path d="M12 5v14M5 12l7 7 7-7" />
                                </svg>
                            </div>
                            <p className="text-blue-100 text-sm font-bold">รายจ่าย</p>
                        </div>
                        <p className="text-white font-black text-2xl tracking-tight">฿{(monthlyExpense || 0).toLocaleString()}</p>
                    </div>
                </div>
            </div>
            {/* Decorative circles */}
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl"></div>
        </div>
    );
}
