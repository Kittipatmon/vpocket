import React, { useEffect } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';

const CATEGORIES = {
    income: ['เงินเดือน', 'โบนัส', 'ฟรีแลนซ์', 'ขายของ', 'ดอกเบี้ย/ปันผล', 'อื่นๆ'],
    expense: ['อาหาร', 'เดินทาง', 'ค่าน้ำไฟ', 'บ้าน/เช่า', 'ผ่อน', 'สุขภาพ', 'ช้อปปิ้ง', 'บันเทิง', 'ลงทุน', 'อื่นๆ'],
    saving: ['เงินออมฉุกเฉิน', 'ฝากประจำ', 'กองทุน', 'หุ้น', 'ทอง', 'Crypto', 'อื่นๆ'],
    investment: ['หุ้น', 'กองทุน', 'อสังหาฯ', 'Crypto', 'อื่นๆ']
};

const PAYMENT_METHODS = ['เงินสด', 'โอน', 'บัตรเครดิต', 'QR'];

export default function TransactionModal({ show, onClose, accounts, editingTransaction = null }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        account_id: '',
        category_name: '',
        amount: '',
        type: 'expense',
        description: '',
        merchant: '',
        payment_method: 'เงินสด',
        tags: [],
        status: 'completed',
        is_recurring: false,
        is_essential: true,
        date: new Date().toISOString().split('T')[0],
        to_account_id: '',
    });

    useEffect(() => {
        if (show) {
            if (editingTransaction) {
                setData({
                    account_id: editingTransaction.account_id || '',
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
        if (editingTransaction) {
            put(route('transactions.update', editingTransaction.id), {
                onSuccess: () => {
                    reset();
                    onClose();
                    Swal.fire({
                        title: 'สำเร็จ!',
                        text: 'อัปเดตรายการเรียบร้อยแล้ว',
                        icon: 'success',
                        confirmButtonColor: '#3b82f6',
                        timer: 2000,
                        showConfirmButton: false,
                    });
                },
            });
        } else {
            post(route('transactions.store'), {
                onSuccess: () => {
                    reset();
                    onClose();
                    Swal.fire({
                        title: 'สำเร็จ!',
                        text: 'บันทึกรายการเรียบร้อยแล้ว',
                        icon: 'success',
                        confirmButtonColor: '#3b82f6',
                        timer: 2000,
                        showConfirmButton: false,
                    });
                },
            });
        }
    };

    const toggleType = (type) => {
        setData({
            ...data,
            type: type,
            category_name: CATEGORIES[type] ? CATEGORIES[type][0] : '',
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <form onSubmit={submit} className="p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-slate-800">
                        {editingTransaction ? 'แก้ไขรายการ' : 'บันทึกรายการใหม่'}
                    </h2>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                </div>

                {/* Type Switcher */}
                <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 overflow-x-auto no-scrollbar">
                    {['expense', 'income', 'saving', 'investment', 'transfer'].map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => toggleType(type)}
                            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                                data.type === type 
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
                                autoFocus
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
                                    value={data.category_name}
                                    onChange={(e) => setData('category_name', e.target.value)}
                                >
                                    <option value="">เลือกหมวดหมู่</option>
                                    {CATEGORIES[data.type] && CATEGORIES[data.type].map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Date */}
                        <div>
                            <InputLabel htmlFor="date" value="วันที่" className="font-bold text-slate-700 mb-1" />
                            <TextInput
                                id="date"
                                type="date"
                                className="block w-full"
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                                required
                            />
                        </div>

                        {/* Merchant / Source */}
                        <div>
                            <InputLabel htmlFor="merchant" value={data.type === 'income' ? 'แหล่งที่มา/ผู้โอน' : 'ร้านค้า/ผู้รับเงิน'} className="font-bold text-slate-700 mb-1" />
                            <TextInput
                                id="merchant"
                                className="block w-full"
                                value={data.merchant}
                                onChange={(e) => setData('merchant', e.target.value)}
                                placeholder="เช่น นาย A, ร้านกาแฟ, เงินเดือน"
                            />
                        </div>

                        {/* Payment Method (for expense) */}
                        {data.type === 'expense' && (
                            <div>
                                <InputLabel htmlFor="payment_method" value="วิธีชำระเงิน" className="font-bold text-slate-700 mb-1" />
                                <select
                                    id="payment_method"
                                    className="block w-full border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl shadow-sm py-3.5 px-5 transition-all font-medium text-slate-700"
                                    value={data.payment_method}
                                    onChange={(e) => setData('payment_method', e.target.value)}
                                >
                                    {PAYMENT_METHODS.map((method) => (
                                        <option key={method} value={method}>{method}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Extra Options Grid */}
                        <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500"
                                    checked={data.is_recurring}
                                    onChange={(e) => setData('is_recurring', e.target.checked)}
                                />
                                <span className="text-sm font-bold text-slate-600 group-hover:text-slate-800 transition-colors">รายการประจำ (Recurring)</span>
                            </label>

                            {data.type === 'expense' && (
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500"
                                        checked={data.is_essential}
                                        onChange={(e) => setData('is_essential', e.target.checked)}
                                    />
                                    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-800 transition-colors">รายการจำเป็น (Essential)</span>
                                </label>
                            )}
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="description" value="หมายเหตุ / รายละเอียดเพิ่มเติม" className="font-bold text-slate-700 mb-1" />
                        <textarea
                            id="description"
                            className="block w-full border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl shadow-sm py-3.5 px-5 transition-all font-medium text-slate-700 min-h-[100px]"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="ระบุรายละเอียดรายการของคุณ"
                        />
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
