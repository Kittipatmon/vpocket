export default function BalanceCard({ totalBalance, spendableBalance, monthlyIncome, monthlyExpense }) {
    return (
        <div className="rounded-[2.5rem] p-8 relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white shadow-2xl shadow-blue-900/30 border border-white/10 h-full flex flex-col justify-between group">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/20 transition-all duration-1000"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/20 rounded-full -ml-16 -mb-16 blur-2xl"></div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <p className="text-blue-100/60 font-bold text-[10px] uppercase tracking-[0.2em]">ยอดเงินคงเหลือทั้งหมด</p>
                        </div>
                        <h3 className="text-4xl font-black text-white tracking-tighter">
                            ฿{(totalBalance || 0).toLocaleString()}
                        </h3>
                    </div>
                    <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10 backdrop-blur-md shadow-inner">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                            <rect x="2" y="5" width="20" height="14" rx="2" />
                            <line x1="2" y1="10" x2="22" y2="10" />
                        </svg>
                    </div>
                </div>

                <div className="bg-white/10 rounded-3xl p-5 border border-white/10 backdrop-blur-md mb-8 shadow-lg">
                    <p className="text-blue-200/60 font-bold text-[9px] uppercase tracking-widest mb-1.5">ยอดที่ใช้จ่ายได้ (หลังหักเงินออม/ลงทุน)</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-emerald-400">฿{(spendableBalance || 0).toLocaleString()}</span>
                        <span className="text-[10px] font-bold text-emerald-400/60 uppercase">Available</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 relative z-10 pt-4 border-t border-white/5">
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-blue-200/50 uppercase tracking-widest">รายรับเดือนนี้</span>
                    <div className="flex items-center gap-1.5 text-white font-black">
                        <span className="text-emerald-400 text-xs">↑</span>
                        <span className="text-lg">฿{(monthlyIncome || 0).toLocaleString()}</span>
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-blue-200/50 uppercase tracking-widest">รายจ่ายเดือนนี้</span>
                    <div className="flex items-center gap-1.5 text-white font-black">
                        <span className="text-rose-400 text-xs">↓</span>
                        <span className="text-lg">฿{(monthlyExpense || 0).toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
