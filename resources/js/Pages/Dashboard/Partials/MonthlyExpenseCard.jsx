import React from 'react';

export default function MonthlyExpenseCard({ amount = 0, lastMonthAmount = 0 }) {
    const diff = amount - lastMonthAmount;
    const percentChange = lastMonthAmount > 0 ? Math.round((diff / lastMonthAmount) * 100) : 0;
    const isIncrease = diff > 0;
    
    // Calculate daily average
    const today = new Date();
    const dayOfMonth = today.getDate();
    const dailyAverage = amount / dayOfMonth;

    return (
        <div className="bg-white rounded-[2rem] p-8 shadow-lg shadow-blue-900/5 border border-blue-100/50 flex flex-col justify-between h-full">
            <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-xl mb-6">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                </div>
                <div className="flex justify-between items-start mb-2">
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">ค่าใช้จ่ายเดือนนี้</p>
                    <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${isIncrease ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
                        {isIncrease ? '▲' : '▼'} {Math.abs(percentChange)}%
                    </div>
                </div>
                <h3 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">
                    ฿{(amount || 0).toLocaleString()}
                </h3>
                <p className="text-slate-400 text-[10px] font-bold mb-6 italic">เฉลี่ยวันละ ฿{Math.round(dailyAverage).toLocaleString()}</p>
            </div>
            
            <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-400">เทียบกับช่วงเวลาเดียวกันเดือนก่อน</span>
                    <span className="text-slate-600">฿{lastMonthAmount.toLocaleString()}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                    <div 
                        className={`h-full rounded-full transition-all duration-1000 ${isIncrease ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min(Math.max((amount / (lastMonthAmount || 1)) * 100, 10), 100)}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
