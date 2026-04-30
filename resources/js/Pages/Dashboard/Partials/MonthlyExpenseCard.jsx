export default function MonthlyExpenseCard({ amount = 0, lastMonthAmount = 0 }) {
    const diff = amount - lastMonthAmount;
    const percentChange = lastMonthAmount > 0 ? Math.round((diff / lastMonthAmount) * 100) : 0;
    const isIncrease = diff > 0;
    
    // Calculate daily average
    const today = new Date();
    const dayOfMonth = today.getDate();
    const dailyAverage = amount / dayOfMonth;

    return (
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-blue-900/5 border border-blue-100/50 flex flex-col justify-between h-full group relative overflow-hidden">
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 blur-3xl transition-all duration-700 ${isIncrease ? 'bg-rose-500/5 group-hover:bg-rose-500/10' : 'bg-emerald-500/5 group-hover:bg-emerald-500/10'}`}></div>

            <div>
                <div className="flex justify-between items-center mb-8">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${isIncrease ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M12 2v20M5 9l7-7 7 7" className={isIncrease ? 'rotate-180 origin-center transition-transform' : ''}/>
                        </svg>
                    </div>
                    <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${isIncrease ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
                        <span className="text-xs">{isIncrease ? '↑' : '↓'}</span>
                        {Math.abs(percentChange)}% จากเดือนก่อน
                    </div>
                </div>

                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1.5">ค่าใช้จ่ายรวมเดือนนี้</p>
                <h3 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">
                    ฿{(amount || 0).toLocaleString()}
                </h3>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full mb-8">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">เฉลี่ยวันละ</span>
                    <span className="text-xs font-black text-slate-700 leading-none">฿{Math.round(dailyAverage).toLocaleString()}</span>
                </div>
            </div>
            
            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">ช่วงเดียวกันเดือนที่แล้ว</span>
                        <span className="text-sm font-black text-slate-700">฿{lastMonthAmount.toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">สถานะ</span>
                        <p className={`text-xs font-black uppercase ${isIncrease ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {isIncrease ? 'ใช้จ่ายสูงขึ้น' : 'ประหยัดขึ้น'}
                        </p>
                    </div>
                </div>
                <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden p-0.5 border border-slate-100">
                    <div 
                        className={`h-full rounded-full transition-all duration-1000 shadow-sm ${isIncrease ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min(Math.max((amount / (lastMonthAmount || 1)) * 100, 5), 100)}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
