import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
import TransactionModal from '@/Pages/Dashboard/Partials/TransactionModal';
import Swal from 'sweetalert2';
import axios from 'axios';

// ── Bill-to-Wallet Loading Overlay ──────────────────────────────────────────
function ScanLoadingOverlay({ progress, current, total }) {
    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(6px)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '0',
        }}>
            {/* Animation scene */}
            <div style={{ position: 'relative', width: 420, height: 200 }}>
                <svg
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'visible' }}
                    viewBox="0 0 420 200"
                    fill="none"
                >
                    {/* Curve path: bill starts RIGHT (320,140) → arcs up → wallet LEFT (100,100) */}
                    <path
                        id="slipCurvePath"
                        d="M320 140 Q240 30 100 100"
                        stroke="#d1d5db"
                        strokeWidth="1.5"
                        strokeDasharray="6 4"
                        fill="none"
                        opacity="0.6"
                    />
                    {/* Arrowhead near wallet */}
                    <polygon points="97,94 108,97 108,107" fill="#d1d5db" opacity="0.5" />

                    {/* ── Wallet (left, centered ~100,100) ── */}
                    <g transform="translate(18, 62)">
                        {/* body */}
                        <rect x="2" y="20" width="84" height="46" rx="7" fill="#1D9E75" />
                        <line x1="2" y1="42" x2="86" y2="42" stroke="#0F6E56" strokeWidth="1.5" />
                        <rect x="12" y="46" width="30" height="13" rx="3" fill="#0F6E56" opacity="0.6" />
                        <circle cx="66" cy="52" r="8" fill="#085041" opacity="0.7" />
                        <circle cx="66" cy="52" r="4" fill="#0F6E56" opacity="0.5" />
                        <rect x="10" y="24" width="68" height="12" rx="3" fill="none" stroke="#0F6E56" strokeWidth="1" strokeDasharray="4 3" />
                        {/* flap — animated via CSS */}
                        <g className="wallet-flap" style={{ transformOrigin: '44px 20px' }}>
                            <rect x="2" y="6" width="84" height="20" rx="7" fill="#5DCAA5" />
                            <rect x="2" y="19" width="84" height="7" fill="#5DCAA5" />
                            <circle cx="44" cy="12" r="4" fill="#1D9E75" />
                            <circle cx="44" cy="12" r="2" fill="#0F6E56" />
                        </g>
                    </g>

                    {/* ── Bill animated along curve (RIGHT → LEFT) ── */}
                    <g>
                        <animateMotion
                            dur="1.6s"
                            repeatCount="indefinite"
                            rotate="auto"
                            keyPoints="0;0.55;0.85;1"
                            keyTimes="0;0.5;0.78;1"
                            calcMode="spline"
                            keySplines="0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1"
                        >
                            <mpath href="#slipCurvePath" />
                        </animateMotion>
                        <animate attributeName="opacity" dur="1.6s" repeatCount="indefinite"
                            values="1;1;0.6;0" keyTimes="0;0.6;0.85;1" />

                        {/* Bill paper centered at 0,0 */}
                        <g transform="translate(-28,-40)">
                            <rect x="2" y="2" width="56" height="76" rx="4" fill="white" stroke="#e2e8f0" strokeWidth="1" />
                            {/* torn top */}
                            <path d="M2 10 Q8 6 14 10 Q20 14 26 10 Q32 6 38 10 Q44 14 50 10 Q56 6 58 10 L58 2 L2 2 Z" fill="#f8fafc" />
                            {/* header bar */}
                            <rect x="6" y="13" width="44" height="9" rx="2" fill="#9FE1CB" />
                            <rect x="10" y="16" width="20" height="3" rx="1" fill="#0F6E56" />
                            {/* lines */}
                            <rect x="6" y="28" width="44" height="3" rx="1" fill="#e2e8f0" />
                            <rect x="6" y="35" width="28" height="3" rx="1" fill="#e2e8f0" />
                            <rect x="6" y="42" width="36" height="3" rx="1" fill="#e2e8f0" />
                            <rect x="6" y="49" width="20" height="3" rx="1" fill="#e2e8f0" />
                            <line x1="6" y1="58" x2="52" y2="58" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 2" />
                            <rect x="28" y="62" width="22" height="5" rx="1" fill="#5DCAA5" />
                            <text x="8" y="67" fontSize="8" fill="#1D9E75" fontFamily="sans-serif" fontWeight="500">฿ Total</text>
                        </g>
                    </g>
                </svg>

                <style>{`
                    @keyframes walletFlapOpen {
                        0%, 40%  { transform: scaleY(1) translateY(0); }
                        65%, 85% { transform: scaleY(0.65) translateY(5px); }
                        100%     { transform: scaleY(1) translateY(0); }
                    }
                    .wallet-flap {
                        animation: walletFlapOpen 1.6s cubic-bezier(0.4,0,0.2,1) infinite;
                        transform-origin: 44px 20px;
                    }
                    @keyframes dotPulse {
                        0%, 100% { opacity: 0.3; transform: scale(1); }
                        50%      { opacity: 1; transform: scale(1.35); background: #1D9E75; }
                    }
                `}</style>
            </div>

            {/* Progress bar */}
            <div style={{ width: 240, height: 4, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden', marginTop: 4 }}>
                <div style={{
                    height: '100%', borderRadius: 99,
                    background: 'linear-gradient(90deg, #5DCAA5, #1D9E75)',
                    width: `${progress}%`,
                    transition: 'width 0.3s ease',
                }} />
            </div>

            {/* Dots + label */}
            <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
                {[0, 1, 2].map(i => (
                    <div key={i} style={{
                        width: 7, height: 7, borderRadius: '50%',
                        background: '#cbd5e1',
                        animation: `dotPulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                ))}
            </div>
            <p style={{ marginTop: 8, fontSize: 13, color: '#64748b', letterSpacing: '0.02em', fontWeight: 500 }}>
                {total > 1 ? `กำลังประมวลผล... (${current} / ${total})` : 'กำลังประมวลผลสลิป...'} {progress > 0 ? `${progress}%` : ''}
            </p>
        </div>
    );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function Index({ transactions, accounts, summary, categoryBreakdown, filters, categories }) {
    const [showModal, setShowModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [scanStats, setScanStats] = useState({ current: 0, total: 0 });

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
                popup: 'rounded-[2rem] p-8 max-w-[400px] animate-in zoom-in-95 duration-300',
                title: 'text-xl font-black text-slate-800 mb-2',
                input: 'rounded-2xl border-slate-200 text-sm font-bold text-slate-700 focus:ring-blue-500 focus:border-blue-500 !w-[80%] mx-auto !mt-6 !mb-2',
                actions: 'mt-8 gap-3',
                confirmButton: 'bg-blue-600 text-white px-8 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95',
                cancelButton: 'bg-slate-100 text-slate-500 px-8 py-3 rounded-2xl text-sm font-bold hover:bg-slate-200 transition-all active:scale-95'
            },
            buttonsStyling: false
        });

        if (!accountId) return;

        setIsScanning(true);
        setScanStats({ current: 0, total: files.length });
        setScanProgress(0);

        const allResults = [];
        
        for (let i = 0; i < files.length; i++) {
            setScanStats(prev => ({ ...prev, current: i + 1 }));
            setScanProgress(0);
            
            const formData = new FormData();
            formData.append('slips[0]', files[i]);
            formData.append('account_id', accountId);

            try {
                const response = await axios.post(route('ocr.scan'), formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setScanProgress(percentCompleted);
                    }
                });
                
                if (response.data.results && response.data.results[0]) {
                    allResults.push(response.data.results[0]);
                }
            } catch (error) {
                console.error(`Error scanning file ${i + 1}:`, error);
                allResults.push({
                    success: false,
                    error: 'การเชื่อมต่อผิดพลาด',
                    filename: files[i].name
                });
            }
        }

        setIsScanning(false);
        setScanProgress(0);

        const successCount = allResults.filter(r => r.success).length;
        const failCount = allResults.length - successCount;

        let htmlContent = `<div class="text-center mt-4 max-h-60 overflow-y-auto">`;
        if (successCount > 0) {
            htmlContent += `<p class="text-emerald-600 font-bold mb-2 flex items-center justify-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg> สำเร็จ ${successCount} รายการ</p>`;
        }
        if (failCount > 0) {
            htmlContent += `<p class="text-rose-600 font-bold mb-2 flex items-center justify-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> ล้มเหลว ${failCount} รายการ:</p>`;
            htmlContent += `<ul class="text-xs text-slate-500 list-none space-y-1">`;
            allResults.filter(r => !r.success).forEach(r => {
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
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">รายงานการเงิน</h2>
                    <div className="flex items-center gap-3">
                        <div className="flex gap-2">
                            <label className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ${isScanning ? 'bg-slate-100 text-slate-400' : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-100'}`}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>
                                {isScanning ? 'กำลังสแกน...' : 'สแกนสลิปหลายรูป'}
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

            {/* ── Scan Loading Overlay ── */}
            {isScanning && (
                <ScanLoadingOverlay 
                    progress={scanProgress} 
                    current={scanStats.current} 
                    total={scanStats.total} 
                />
            )}

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Monthly Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">รายรับรวม</p>
                            <p className="text-2xl font-extrabold text-emerald-500 tracking-tight">฿{summary.total_income.toLocaleString()}</p>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">รายจ่ายรวม</p>
                            <p className="text-2xl font-extrabold text-rose-500 tracking-tight">฿{summary.total_expense.toLocaleString()}</p>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">เงินออม/ลงทุน</p>
                            <p className="text-2xl font-extrabold text-blue-500 tracking-tight">฿{(summary.total_saving + summary.total_investment).toLocaleString()}</p>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">คงเหลือสุทธิ</p>
                            <p className={`text-2xl font-extrabold tracking-tight ${summary.net_balance >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
                                ฿{summary.net_balance.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Transaction List */}
                        <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-lg border border-blue-100/50">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">รายการประจำเดือน</h3>
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
                                        link.url ? (
                                            <Link
                                                key={i}
                                                href={link.url}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${link.active
                                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-100'
                                                    }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span
                                                key={i}
                                                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-300 border border-slate-100 opacity-50 cursor-not-allowed"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )
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
