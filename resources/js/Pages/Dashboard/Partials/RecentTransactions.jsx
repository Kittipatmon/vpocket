import React from 'react';
import { Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function RecentTransactions({ transactions, onEdit }) {
    const handleDelete = (id) => {
        Swal.fire({
            title: 'คุณแน่ใจหรือไม่?',
            text: "ต้องการลบรายการนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนคืนได้",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'ใช่, ลบเลย!',
            cancelButtonText: 'ยกเลิก',
            customClass: {
                popup: 'rounded-[2rem] p-8',
                confirmButton: 'rounded-xl px-6 py-3 font-bold',
                cancelButton: 'rounded-xl px-6 py-3 font-bold'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('transactions.destroy', id), {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'ลบสำเร็จ!',
                            text: 'รายการถูกลบเรียบร้อยแล้ว',
                            icon: 'success',
                            confirmButtonColor: '#3b82f6',
                            timer: 2000,
                            showConfirmButton: false,
                        });
                    }
                });
            }
        });
    };

    return (
        <div className="bg-white rounded-[2rem] p-6 shadow-lg shadow-blue-900/5 border border-blue-100/50">
            <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-black text-slate-800">รายการล่าสุด</h4>
                <Link href={route('reports.index')} className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">ดูทั้งหมด</Link>
            </div>

            <div className="space-y-3">
                {transactions && transactions.length > 0 ? transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-blue-50/50 rounded-2xl transition-all group relative">
                        <div className="flex items-center gap-4">
                            <div
                                className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm bg-slate-100"
                            >
                                {tx.type === 'expense' ? '💸' : 
                                 tx.type === 'income' ? '💰' : 
                                 tx.type === 'saving' ? '🏦' : '🔄'}
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">{tx.description || tx.merchant || tx.category_name || 'ไม่มีชื่อรายการ'}</p>
                                <p className="text-xs text-slate-400 font-medium">{tx.account?.name} • {new Date(tx.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="text-right group-hover:opacity-0 transition-opacity">
                                <p className={`font-black ${tx.type === 'expense' ? 'text-rose-500' : 'text-emerald-500'}`}>
                                    {tx.type === 'expense' ? '-' : '+'}฿{Number(tx.amount).toLocaleString()}
                                </p>
                            </div>
                            
                            {/* Action Buttons on Hover */}
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                                <button 
                                    onClick={() => onEdit(tx)}
                                    className="p-2 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                    title="แก้ไข"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                </button>
                                <button 
                                    onClick={() => handleDelete(tx.id)}
                                    className="p-2 rounded-xl bg-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                    title="ลบ"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="py-16 text-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">📝</div>
                        <p className="text-slate-400 font-bold">ยังไม่มีรายการ</p>
                        <p className="text-slate-300 text-sm mt-1">เริ่มบันทึกรายการแรกของคุณได้เลย!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
