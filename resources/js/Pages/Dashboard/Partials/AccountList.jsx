import React from 'react';
import { Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function AccountList({ accounts, onAddAccount, onEditAccount }) {
    const handleDelete = (e, account) => {
        e.stopPropagation();
        
        Swal.fire({
            title: 'คุณแน่ใจหรือไม่?',
            text: `ต้องการลบกระเป๋าเงิน "${account.name}" ใช่หรือไม่? รายการธุรกรรมทั้งหมดจะถูกลบไปด้วย`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'ใช่, ลบเลย!',
            cancelButtonText: 'ยกเลิก',
            borderRadius: '1.5rem',
            customClass: {
                popup: 'rounded-[2rem] p-8',
                confirmButton: 'rounded-xl px-6 py-3 font-bold',
                cancelButton: 'rounded-xl px-6 py-3 font-bold'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('accounts.destroy', account.id), {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'ลบสำเร็จ!',
                            text: 'กระเป๋าเงินถูกลบเรียบร้อยแล้ว',
                            icon: 'success',
                            confirmButtonColor: '#3b82f6',
                            borderRadius: '1.5rem',
                        });
                    }
                });
            }
        });
    };

    const handleEdit = (e, account) => {
        e.stopPropagation();
        onEditAccount(account);
    };

    return (
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-blue-900/5 border border-blue-100/50">
            <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-extrabold text-slate-800 tracking-tight">กระเป๋าเงินของฉัน</h4>
                <Link href={route('accounts.index')} className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">จัดการ</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {accounts && accounts.map((account) => (
                    <div 
                        key={account.id} 
                        onClick={() => onEditAccount(account)}
                        className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 hover:bg-blue-50 hover:shadow-lg hover:shadow-blue-500/5 transition-all group relative cursor-pointer flex flex-col min-h-[160px]"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div
                                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm text-xl overflow-hidden bg-white border border-slate-100 shrink-0"
                                style={{ backgroundColor: !account.image_path ? (account.color || '#DBEAFE') : 'white' }}
                            >
                                {account.image_path ? (
                                    <img src={`/storage/${account.image_path}`} alt={account.name} className="w-full h-full object-cover" />
                                ) : (
                                    account.icon || '💳'
                                )}
                            </div>
                            
                            <div className="flex flex-col items-end gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-white px-2.5 py-1 rounded-lg text-blue-600 border border-blue-100 whitespace-nowrap">
                                    {account.type === 'Cash' ? 'เงินสด' : 
                                     account.type === 'Savings' ? 'ออมทรัพย์' : 
                                     account.type === 'PromptPay' ? 'พร้อมเพย์' : 
                                     account.type === 'Credit Card' ? 'บัตรเครดิต' : 
                                     account.type === 'Investment' ? 'การลงทุน' : 
                                     account.type === 'Other' ? 'อื่นๆ' : 
                                     account.type}
                                </span>
                                
                                {/* Action Buttons on Hover */}
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                    <button 
                                        onClick={(e) => handleEdit(e, account)}
                                        className="p-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                        title="แก้ไขกระเป๋าเงิน"
                                    >
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                        </svg>
                                    </button>
                                    <button 
                                        onClick={(e) => handleDelete(e, account)}
                                        className="p-1.5 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                        title="ลบกระเป๋าเงิน"
                                    >
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-auto">
                            <p className="text-sm font-bold text-slate-500 mb-1">{account.name}</p>
                            <p className="text-xl font-extrabold text-slate-800 tracking-tight">฿{Number(account.balance).toLocaleString()}</p>
                        </div>
                    </div>
                ))}
                <button 
                    onClick={onAddAccount}
                    className="p-5 rounded-2xl border-2 border-dashed border-blue-200 flex flex-col items-center justify-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-all group"
                >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                    </div>
                    <p className="text-sm font-bold text-slate-400 group-hover:text-blue-600 transition-colors">เพิ่มกระเป๋าเงิน</p>
                </button>
            </div>
        </div>
    );
}
