import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import TransactionModal from '@/Pages/Dashboard/Partials/TransactionModal';
import Swal from 'sweetalert2';

export default function Index({ transactions, accounts, summary, categoryBreakdown, filters }) {
    const [showModal, setShowModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    const openEditModal = (tx) => {
        setEditingTransaction(tx);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingTransaction(null);
    };

    const handleFilterChange = (name, value) => {
        router.get(route('reports.index'), {
            ...filters,
            [name]: value
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'คุณแน่ใจหรือไม่?',
            text: "ต้องการลบรายการนี้ใช่หรือไม่?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'ใช่, ลบเลย!',
            cancelButtonText: 'ยกเลิก',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('transactions.destroy', id), {
                    onSuccess: () => {
                        Swal.fire('ลบสำเร็จ!', 'รายการถูกลบเรียบร้อยแล้ว', 'success');
                    }
                });
            }
        });
    };

    const months = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">รายงานการเงิน</h2>
                    <div className="flex gap-2">
                        <select 
                            value={filters.month}
                            onChange={(e) => handleFilterChange('month', e.target.value)}
                            className="rounded-xl border-slate-200 text-sm font-bold text-slate-700 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {months.map((m, i) => (
                                <option key={i+1} value={i+1}>{m}</option>
                            ))}
                        </select>
                        <select 
                            value={filters.year}
                            onChange={(e) => handleFilterChange('year', e.target.value)}
                            className="rounded-xl border-slate-200 text-sm font-bold text-slate-700 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {years.map(y => (
                                <option key={y} value={y}>{y + 543}</option>
                            ))}
                        </select>
                    </div>
                </div>
            }
        >
            <Head title="รายงาน" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Monthly Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">รายรับรวม</p>
                            <p className="text-2xl font-black text-emerald-500">฿{summary.total_income.toLocaleString()}</p>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">รายจ่ายรวม</p>
                            <p className="text-2xl font-black text-rose-500">฿{summary.total_expense.toLocaleString()}</p>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">เงินออม/ลงทุน</p>
                            <p className="text-2xl font-black text-blue-500">฿{(summary.total_saving + summary.total_investment).toLocaleString()}</p>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">คงเหลือสุทธิ</p>
                            <p className={`text-2xl font-black ${summary.net_balance >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
                                ฿{summary.net_balance.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Transaction List */}
                        <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-lg border border-blue-100/50">
                            <h3 className="text-xl font-black text-slate-800 mb-6">รายการประจำเดือน</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            <th className="pb-4 font-bold text-slate-400 text-xs uppercase">วันที่</th>
                                            <th className="pb-4 font-bold text-slate-400 text-xs uppercase">รายการ</th>
                                            <th className="pb-4 font-bold text-slate-400 text-xs uppercase text-right">จำนวนเงิน</th>
                                            <th className="pb-4 font-bold text-slate-400 text-xs uppercase text-center">จัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {transactions.length > 0 ? transactions.map((tx) => (
                                            <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="py-4 text-slate-500 text-sm font-medium">{new Date(tx.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}</td>
                                                <td className="py-4">
                                                    <div className="font-bold text-slate-800">{tx.description || tx.merchant || tx.category?.name}</div>
                                                    <div className="text-[10px] text-slate-400 font-bold uppercase">{tx.account?.name} • {tx.category?.name}</div>
                                                </td>
                                                <td className={`py-4 text-right font-black ${tx.type === 'expense' ? 'text-rose-500' : 'text-emerald-500'}`}>
                                                    {tx.type === 'expense' ? '-' : '+'}฿{Number(tx.amount).toLocaleString()}
                                                </td>
                                                <td className="py-4">
                                                    <div className="flex justify-center gap-1">
                                                        <button onClick={() => openEditModal(tx)} className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-50 transition-all">
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                                        </button>
                                                        <button onClick={() => handleDelete(tx.id)} className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-50 transition-all">
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="py-12 text-center text-slate-400 font-medium">ไม่มีข้อมูลในเดือนนี้</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Category Breakdown */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-blue-100/50">
                            <h3 className="text-xl font-black text-slate-800 mb-6">สัดส่วนรายจ่าย</h3>
                            <div className="space-y-4">
                                {categoryBreakdown.length > 0 ? categoryBreakdown.map((item, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-bold text-slate-700">{item.name}</span>
                                            <span className="text-sm font-black text-slate-800">฿{item.amount.toLocaleString()}</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full rounded-full" 
                                                style={{ 
                                                    width: `${(item.amount / summary.total_expense) * 100}%`,
                                                    backgroundColor: item.color || '#3b82f6'
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-8 text-center text-slate-300 italic">ไม่มีข้อมูลรายจ่าย</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <TransactionModal 
                show={showModal} 
                onClose={closeModal} 
                accounts={accounts}
                editingTransaction={editingTransaction}
            />
        </AuthenticatedLayout>
    );
}
