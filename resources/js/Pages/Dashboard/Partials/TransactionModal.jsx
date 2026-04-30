import React, { useEffect, useRef, useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useForm, usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';
import axios from 'axios';

const PAYMENT_METHODS = ['เงินสด', 'โอน', 'บัตรเครดิต', 'QR'];

export default function TransactionModal({ show, onClose, accounts, categories: categoriesProp, editingTransaction = null }) {
    const { categories: sharedCategories } = usePage().props;
    const allCategories = categoriesProp || sharedCategories || [];
    const [isScanning, setIsScanning] = useState(false);
    const slipInput = useRef();

    const { data, setData, post, put, processing, errors, reset } = useForm({
        account_id: '',
        category_id: '',
        category_name: '',
        amount: '',
        type: 'expense',
        description: '',
        merchant: '',
        payment_method: 'โอน',
        tags: [],
        status: 'completed',
        is_recurring: false,
        is_essential: true,
        date: new Date().toISOString().split('T')[0],
        to_account_id: '',
        google_drive_file_id: '',
    });

    useEffect(() => {
        if (show) {
            if (editingTransaction) {
                setData({
                    account_id: editingTransaction.account_id || '',
                    category_id: editingTransaction.category_id || '',
                    category_name: editingTransaction.category_name || '',
                    amount: editingTransaction.amount || '',
                    type: editingTransaction.type || 'expense',
                    description: editingTransaction.description || '',
                    merchant: editingTransaction.merchant || '',
                    payment_method: editingTransaction.payment_method || 'เงินสด',
                    tags: editingTransaction.tags || [],
                    status: editingTransaction.status || 'completed',
                    is_recurring: !!editingTransaction.is_recurring,
                    is_essential: editingTransaction.is_essential !== false,
                    date: editingTransaction.date ? new Date(editingTransaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                    to_account_id: editingTransaction.to_account_id || '',
                    google_drive_file_id: editingTransaction.google_drive_file_id || '',
                });
            } else {
                reset();
                if (accounts && accounts.length > 0) {
                    setData('account_id', accounts[0].id);
                }
            }
        }
    }, [show, editingTransaction]);

    const submit = (e) => {
        e.preventDefault();

        // Balance Check for outgoing transactions
        if (['expense', 'saving', 'investment', 'transfer'].includes(data.type)) {
            const selectedAccount = accounts.find(acc => acc.id == data.account_id);
            if (selectedAccount && Number(data.amount) > Number(selectedAccount.balance)) {
                
                // Calculate totals for Savings and Investment to show in the alert
                const savingsAccounts = accounts.filter(acc => 
                    ['Savings', 'ออมทรัพย์', 'ฝากประจำ', 'bank'].includes(acc.type)
                );
                const investmentAccounts = accounts.filter(acc => 
                    ['Investment', 'ลงทุน', 'การลงทุน', 'investment'].includes(acc.type)
                );
                
                const totalSavings = savingsAccounts.reduce((sum, acc) => sum + Number(acc.balance), 0);
                const totalInvestment = investmentAccounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

                Swal.fire({
                    title: 'ยอดเงินไม่เพียงพอ!',
                    html: `
                        <div class="text-left space-y-4">
                            <p class="text-slate-600">ยอดเงินใน <b>${selectedAccount.name}</b> ไม่พอสำหรับรายการนี้ (ขาดอีก ฿${(Number(data.amount) - Number(selectedAccount.balance)).toLocaleString()})</p>
                            <div class="bg-blue-50/50 rounded-2xl p-5 border border-blue-100">
                                <p class="text-xs font-black text-blue-400 uppercase tracking-widest mb-3">ยอดเงินคงเหลืออื่นๆ ของคุณ</p>
                                <div class="space-y-3">
                                    <div class="flex justify-between items-center">
                                        <div class="flex items-center gap-2">
                                            <span class="text-xl">💰</span>
                                            <span class="text-sm font-bold text-slate-600">การออมทั้งหมด</span>
                                        </div>
                                        <span class="font-black text-emerald-600">฿${totalSavings.toLocaleString()}</span>
                                    </div>
                                    <div class="flex justify-between items-center">
                                        <div class="flex items-center gap-2">
                                            <span class="text-xl">📈</span>
                                            <span class="text-sm font-bold text-slate-600">การลงทุนทั้งหมด</span>
                                        </div>
                                        <span class="font-black text-blue-600">฿${totalInvestment.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            <p class="text-[10px] text-slate-400 text-center font-bold">* กรุณาเติมเงินหรือเลือกกระเป๋าเงินใบอื่น</p>
                        </div>
                    `,
                    icon: 'error',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#3b82f6',
                    customClass: {
                        popup: 'rounded-[2.5rem] p-8',
                        confirmButton: 'rounded-2xl px-10 py-4 font-bold text-lg'
                    }
                });
                return;
            }
        }

        const url = editingTransaction ? route('transactions.update', editingTransaction.id) : route('transactions.store');
        const method = editingTransaction ? 'patch' : 'post';

        if (method === 'patch') {
            put(url, {
                onSuccess: () => {
                    reset();
                    onClose();
                    Swal.fire('สำเร็จ!', 'อัปเดตรายการเรียบร้อยแล้ว', 'success');
                },
            });
        } else {
            post(url, {
                onSuccess: () => {
                    reset();
                    onClose();
                    Swal.fire('สำเร็จ!', 'บันทึกรายการเรียบร้อยแล้ว', 'success');
                },
            });
        }
    };

    const handleSlipUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsScanning(true);
        const formData = new FormData();
        formData.append('slip', file);

        try {
            const response = await axios.post(route('transactions.scan'), formData);
            if (response.data.success) {
                const { data: ocrData, google_drive_file_id } = response.data;

                setData(prev => ({
                    ...prev,
                    amount: ocrData.amount || prev.amount,
                    date: ocrData.date || prev.date,
                    merchant: ocrData.bank || prev.merchant,
                    google_drive_file_id: google_drive_file_id || prev.google_drive_file_id,
                    payment_method: 'โอน', // Usually slips are transfers
                    type: 'expense' // Default to expense for slips
                }));

                Swal.fire({
                    title: 'อ่านสลิปสำเร็จ!',
                    text: `พบยอดเงิน ฿${Number(ocrData.amount).toLocaleString()}`,
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                });
            }
        } catch (error) {
            console.error('Scan Error:', error);
            const message = error.response?.data?.message || 'ไม่สามารถอ่านสลิปได้ โปรดลองอีกครั้ง';
            Swal.fire('ผิดพลาด', message, 'error');
        } finally {
            setIsScanning(false);
            slipInput.current.value = '';
        }
    };

    const toggleType = (type) => {
        setData(prev => ({
            ...prev,
            type: type,
            category_id: '',
            category_name: ''
        }));
    };

    const filteredCategories = Array.isArray(allCategories)
        ? allCategories.filter(c => c.type === data.type)
        : [];

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <form onSubmit={submit} className="p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-slate-800">
                        {editingTransaction ? 'แก้ไขรายการ' : 'บันทึกรายการใหม่'}
                    </h2>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => slipInput.current.click()}
                            disabled={isScanning}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${isScanning ? 'bg-slate-100 text-slate-400' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 active:scale-95'}`}
                        >
                            {isScanning ? (
                                <><div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div> กำลังอ่าน...</>
                            ) : (
                                <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg> สแกนสลิป</>
                            )}
                        </button>
                        <input type="file" ref={slipInput} className="hidden" accept="image/*" onChange={handleSlipUpload} />
                        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>

                {/* Type Switcher */}
                <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 overflow-x-auto no-scrollbar">
                    {['expense', 'income', 'saving', 'investment', 'transfer'].map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => toggleType(type)}
                            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${data.type === type
                                    ? 'bg-white text-blue-600 shadow-md scale-[1.02]'
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {type === 'expense' ? 'รายจ่าย' :
                                type === 'income' ? 'รายรับ' :
                                    type === 'saving' ? 'การออม' :
                                        type === 'investment' ? 'ลงทุน' : 'โอนเงิน'}
                        </button>
                    ))}
                </div>

                <div className="space-y-6">
                    {/* Main Amount Input */}
                    <div className="bg-blue-50/50 rounded-[2rem] p-8 border border-blue-100/50">
                        <InputLabel htmlFor="amount" value="จำนวนเงิน" className="font-bold text-blue-600 mb-2 text-center" />
                        <div className="relative max-w-xs mx-auto">
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-4xl font-black text-blue-400">฿</span>
                            <input
                                id="amount"
                                type="number"
                                step="1"
                                className="block w-full border-none bg-transparent text-center text-5xl font-black focus:ring-0 text-slate-800 placeholder-slate-300"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                required
                                placeholder="0"
                            />
                        </div>
                        <InputError message={errors.amount} className="mt-2 text-center" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Account selection */}
                        <div>
                            <InputLabel htmlFor="account_id" value={data.type === 'transfer' ? 'จากกระเป๋า' : 'กระเป๋าเงิน'} className="font-bold text-slate-700 mb-1" />
                            <select
                                id="account_id"
                                className="block w-full border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl shadow-sm py-3.5 px-5 transition-all font-medium text-slate-700"
                                value={data.account_id}
                                onChange={(e) => setData('account_id', e.target.value)}
                                required
                            >
                                <option value="">เลือกกระเป๋าเงิน</option>
                                {accounts && accounts.map((acc) => (
                                    <option key={acc.id} value={acc.id}>{acc.name} (฿{Number(acc.balance).toLocaleString()})</option>
                                ))}
                            </select>
                            <InputError message={errors.account_id} className="mt-2" />
                        </div>

                        {/* Destination Account (for transfer/saving/investment) */}
                        {(data.type === 'transfer' || data.type === 'saving' || data.type === 'investment') ? (
                            <div>
                                <InputLabel htmlFor="to_account_id" value="ไปยังกระเป๋า/เป้าหมาย" className="font-bold text-slate-700 mb-1" />
                                <select
                                    id="to_account_id"
                                    className="block w-full border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl shadow-sm py-3.5 px-5 transition-all font-medium text-slate-700"
                                    value={data.to_account_id}
                                    onChange={(e) => setData('to_account_id', e.target.value)}
                                    required={data.type === 'transfer'}
                                >
                                    <option value="">เลือกเป้าหมายปลายทาง</option>
                                    {accounts && accounts.filter(acc => acc.id != data.account_id).map((acc) => (
                                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                                    ))}
                                </select>
                                <InputError message={errors.to_account_id} className="mt-2" />
                            </div>
                        ) : (
                            <div>
                                <InputLabel htmlFor="category_name" value="หมวดหมู่" className="font-bold text-slate-700 mb-1" />
                                <select
                                    id="category_name"
                                    className="block w-full border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl shadow-sm py-3.5 px-5 transition-all font-medium text-slate-700"
                                    value={data.category_id || data.category_name}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        const cat = filteredCategories.find(c => c.id == val || c.name === val);
                                        if (cat) {
                                            setData(prev => ({
                                                ...prev,
                                                category_id: cat.id,
                                                category_name: cat.name
                                            }));
                                        } else {
                                            setData(prev => ({
                                                ...prev,
                                                category_id: '',
                                                category_name: val
                                            }));
                                        }
                                    }}
                                >
                                    <option value="">เลือกหมวดหมู่</option>
                                    {filteredCategories.length > 0 ? (
                                        filteredCategories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                                        ))
                                    ) : null}
                                    <option value="อื่นๆ"></option>
                                </select>
                            </div>
                        )}

                        {/* Date */}
                        <div>
                            <InputLabel htmlFor="date" value="วันที่" className="font-bold text-slate-700 mb-1" />
                            <TextInput id="date" type="date" className="block w-full" value={data.date} onChange={(e) => setData('date', e.target.value)} required />
                        </div>

                        {/* Merchant / Source */}
                        <div>
                            <InputLabel htmlFor="merchant" value={data.type === 'income' ? 'แหล่งที่มา/ผู้โอน' : 'ร้านค้า/ผู้รับเงิน'} className="font-bold text-slate-700 mb-1" />
                            <TextInput id="merchant" className="block w-full" value={data.merchant} onChange={(e) => setData('merchant', e.target.value)} placeholder="เช่น นาย A, ร้านกาแฟ, เงินเดือน" />
                        </div>

                        {/* Payment Method */}
                        <div>
                            <InputLabel htmlFor="payment_method" value="วิธีชำระเงิน" className="font-bold text-slate-700 mb-1" />
                            <select id="payment_method" className="block w-full border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl shadow-sm py-3.5 px-5 font-medium text-slate-700" value={data.payment_method} onChange={(e) => setData('payment_method', e.target.value)}>
                                {PAYMENT_METHODS.map((method) => (
                                    <option key={method} value={method}>{method}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="description" value="หมายเหตุ / รายละเอียดเพิ่มเติม" className="font-bold text-slate-700 mb-1" />
                        <textarea id="description" className="block w-full border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl shadow-sm py-3.5 px-5 font-medium text-slate-700 min-h-[80px]" value={data.description} onChange={(e) => setData('description', e.target.value)} placeholder="ระบุรายละเอียดรายการของคุณ" />
                    </div>
                </div>

                <div className="mt-10 flex flex-col md:flex-row justify-end gap-3">
                    <SecondaryButton onClick={onClose} className="px-8 py-4 rounded-2xl font-bold order-2 md:order-1">ยกเลิก</SecondaryButton>
                    <PrimaryButton disabled={processing} className="px-10 py-4 rounded-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all order-1 md:order-2">
                        {editingTransaction ? 'บันทึกการแก้ไข' : 'บันทึกรายการ'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
