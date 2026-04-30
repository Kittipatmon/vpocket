import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
import TransactionModal from '@/Pages/Dashboard/Partials/TransactionModal';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function Index({ transactions, accounts, summary, categoryBreakdown, filters, categories }) {
    const [showModal, setShowModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);

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

    const toggleSelectAll = () => {
        if (selectedIds.length === transactions.data.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(transactions.data.map(tx => tx.id));
        }
    };

    const toggleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleBulkDelete = () => {
        Swal.fire({
            title: 'คุณแน่ใจหรือไม่?',
            text: `ต้องการลบรายการที่เลือกจำนวน ${selectedIds.length} รายการใช่หรือไม่?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'ใช่, ลบเลย!',
            cancelButtonText: 'ยกเลิก',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('transactions.bulk-destroy'), {
                    data: { ids: selectedIds },
                    onSuccess: () => {
                        setSelectedIds([]);
                        Swal.fire('สำเร็จ!', 'ลบรายการที่เลือกเรียบร้อยแล้ว', 'success');
                    }
                });
            }
        });
    };

    const handleScanSlips = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        if (accounts.length === 0) {
            Swal.fire('ผิดพลาด', 'กรุณาสร้างบัญชีธนาคารก่อนใช้งานการสแกนสลิป', 'error');
            return;
        }

        const { value: accountId } = await Swal.fire({
            title: 'เลือกบัญชีที่ใช้จ่าย',
            input: 'select',
            inputOptions: accounts.reduce((acc, curr) => {
                acc[curr.id] = curr.name;
                return acc;
            }, {}),
            inputPlaceholder: 'เลือกบัญชี...',
            showCancelButton: true,
            confirmButtonText: 'เริ่มสแกน',
            cancelButtonText: 'ยกเลิก',
            inputValidator: (value) => {
                if (!value) return 'กรุณาเลือกบัญชี';
            },
            customClass: {
                popup: 'rounded-[2rem] p-6',
                input: 'rounded-xl border-slate-200 text-sm font-bold text-slate-700 focus:ring-blue-500 focus:border-blue-500 !w-full !m-0 !mt-4',
                confirmButton: 'bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all ml-2',
                cancelButton: 'bg-slate-100 text-slate-600 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all'
            },
            buttonsStyling: false
        });

        if (!accountId) return;

        setIsScanning(true);
        setScanProgress(0);

        const formData = new FormData();
        files.forEach((file, index) => {
            formData.append(`slips[${index}]`, file);
        });
        formData.append('account_id', accountId);

        try {
            const response = await axios.post(route('ocr.scan'), formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setScanProgress(percentCompleted);
                }
            });

            const results = response.data.results;
            const successCount = results.filter(r => r.success).length;
            const failCount = results.length - successCount;

            let htmlContent = `<div class="text-left mt-4 max-h-60 overflow-y-auto">`;
            if (successCount > 0) {
                htmlContent += `<p class="text-emerald-600 font-bold mb-2 flex items-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg> สำเร็จ ${successCount} รายการ</p>`;
            }
            if (failCount > 0) {
                htmlContent += `<p class="text-rose-600 font-bold mb-2 flex items-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> ล้มเหลว ${failCount} รายการ:</p>`;
                htmlContent += `<ul class="text-xs text-slate-500 list-disc pl-5 space-y-1">`;
                results.filter(r => !r.success).forEach(r => {
                    htmlContent += `<li><span class="font-bold text-slate-700">${r.filename}</span>: <span class="text-rose-400">${r.error}</span></li>`;
                });
                htmlContent += `</ul>`;
            }
            htmlContent += `</div>`;

            Swal.fire({
                title: 'สแกนเสร็จสิ้น',
                html: htmlContent,
                icon: successCount > 0 ? 'success' : 'error',
                confirmButtonText: 'ตกลง',
                customClass: {
                    popup: 'rounded-[2rem] p-6',
                    confirmButton: 'bg-blue-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all'
                },
                buttonsStyling: false
            }).then(() => {
                router.reload();
            });
        } catch (error) {
            console.error('Scan error:', error);
            Swal.fire('ผิดพลาด', 'เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบสแกน', 'error');
        } finally {
            setIsScanning(false);
            setScanProgress(0);
        }
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
                    <div className="flex items-center gap-3">
                        <div className="flex gap-2">
                            <label className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ${isScanning ? 'bg-slate-100 text-slate-400' : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-100'}`}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>
                                {isScanning ? `กำลังประมวลผล ${scanProgress}%` : 'สแกนสลิปหลายรูป'}
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleScanSlips}
                                    className="hidden"
                                    disabled={isScanning}
                                />
                            </label>
                            <select
                                value={filters.month}
                                onChange={(e) => handleFilterChange('month', e.target.value)}
                                className="rounded-xl border-slate-200 text-sm font-bold text-slate-700 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {months.map((m, i) => (
                                    <option key={i + 1} value={i + 1}>{m}</option>
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
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-black text-slate-800">รายการประจำเดือน</h3>
                                {selectedIds.length > 0 && (
                                    <button
                                        onClick={handleBulkDelete}
                                        className="bg-rose-50 text-rose-600 px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-rose-100 transition-all flex items-center gap-2 border border-rose-100 animate-in fade-in slide-in-from-right-4 duration-300"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" /></svg>
                                        ลบที่เลือก ({selectedIds.length})
                                    </button>
                                )}
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            <th className="pb-4 w-10">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                    checked={selectedIds.length === transactions.data.length && transactions.data.length > 0}
                                                    onChange={toggleSelectAll}
                                                />
                                            </th>
                                            <th className="pb-4 font-bold text-slate-400 text-xs uppercase">วันที่</th>
                                            <th className="pb-4 font-bold text-slate-400 text-xs uppercase">รายการ</th>
                                            <th className="pb-4 font-bold text-slate-400 text-xs uppercase text-right">จำนวนเงิน</th>
                                            <th className="pb-4 font-bold text-slate-400 text-xs uppercase text-center">จัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {transactions.data.length > 0 ? transactions.data.map((tx) => (
                                            <tr
                                                key={tx.id}
                                                onClick={() => toggleSelect(tx.id)}
                                                className={`cursor-pointer hover:bg-slate-50/50 transition-colors ${selectedIds.includes(tx.id) ? 'bg-blue-50/30' : ''}`}
                                            >
                                                <td className="py-4">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 pointer-events-none"
                                                        checked={selectedIds.includes(tx.id)}
                                                        readOnly
                                                    />
                                                </td>
                                                <td className="py-4 text-slate-500 text-sm font-medium">{new Date(tx.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}</td>
                                                <td className="py-4">
                                                    <div className="font-bold text-slate-800">{tx.description || tx.merchant || tx.category?.name}</div>
                                                    <div className="text-[10px] text-slate-400 font-bold uppercase">{tx.account?.name} • {tx.category?.name}</div>
                                                </td>
                                                <td className={`py-4 text-right font-black ${tx.type === 'expense' ? 'text-rose-500' : 'text-emerald-500'}`}>
                                                    {tx.type === 'expense' ? '-' : '+'}฿{Number(tx.amount).toLocaleString()}
                                                </td>
                                                <td className="py-4" onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex justify-center gap-1">
                                                        <button onClick={() => openEditModal(tx)} className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-50 transition-all">
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                        </button>
                                                        <button onClick={() => handleDelete(tx.id)} className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-50 transition-all">
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" /></svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="5" className="py-12 text-center text-slate-400 font-medium">ไม่มีข้อมูลในเดือนนี้</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Links */}
                            {transactions.links && transactions.links.length > 3 && (
                                <div className="flex flex-wrap justify-center gap-1 mt-8">
                                    {transactions.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${link.active
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-100'
                                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
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
                categories={categories}
                editingTransaction={editingTransaction}
            />
        </AuthenticatedLayout>
    );
}
