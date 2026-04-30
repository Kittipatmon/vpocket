import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ categories, walletTypes }) {
    const [showModal, setShowModal] = useState(false);
    const [showWalletModal, setShowWalletModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        name: '',
        type: 'expense',
        icon: '📁',
        color: '#3b82f6',
    });

    const { data: walletData, setData: setWalletData, post: postWallet, patch: patchWallet, processing: walletProcessing, errors: walletErrors, reset: resetWallet } = useForm({
        name: '',
        classification: 'spending',
        icon: '💵',
        color: '#10b981',
    });

    const openCreateModal = () => {
        setEditingItem(null);
        reset();
        setShowModal(true);
    };

    const openEditModal = (category) => {
        setEditingItem(category);
        setData({
            name: category.name,
            type: category.type,
            icon: category.icon || '📁',
            color: category.color || '#3b82f6',
        });
        setShowModal(true);
    };

    const openCreateWalletModal = () => {
        setEditingItem(null);
        resetWallet();
        setShowWalletModal(true);
    };

    const openEditWalletModal = (type) => {
        setEditingItem(type);
        setWalletData({
            name: type.name,
            classification: type.classification || 'spending',
            icon: type.icon || '💵',
            color: type.color || '#10b981',
        });
        setShowWalletModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingItem(null);
        reset();
    };

    const closeWalletModal = () => {
        setShowWalletModal(false);
        setEditingItem(null);
        resetWallet();
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingItem) {
            patch(route('categories.update', editingItem.id), {
                onSuccess: () => {
                    closeModal();
                    Swal.fire('สำเร็จ!', 'อัปเดตหมวดหมู่เรียบร้อยแล้ว', 'success');
                },
            });
        } else {
            post(route('categories.store'), {
                onSuccess: () => {
                    closeModal();
                    Swal.fire('สำเร็จ!', 'เพิ่มหมวดหมู่ใหม่เรียบร้อยแล้ว', 'success');
                },
            });
        }
    };

    const submitWallet = (e) => {
        e.preventDefault();
        if (editingItem) {
            patchWallet(route('wallet-types.update', editingItem.id), {
                onSuccess: () => {
                    closeWalletModal();
                    Swal.fire('สำเร็จ!', 'อัปเดตประเภทกระเป๋าเงินเรียบร้อยแล้ว', 'success');
                },
            });
        } else {
            postWallet(route('wallet-types.store'), {
                onSuccess: () => {
                    closeWalletModal();
                    Swal.fire('สำเร็จ!', 'เพิ่มประเภทกระเป๋าเงินใหม่เรียบร้อยแล้ว', 'success');
                },
            });
        }
    };

    const handleDelete = (item, type = 'category') => {
        // Removed restriction to allow editing/customizing system types

        Swal.fire({
            title: 'คุณแน่ใจหรือไม่?',
            text: `ต้องการลบ "${item.name}" ใช่หรือไม่?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'ใช่, ลบเลย!',
            cancelButtonText: 'ยกเลิก',
        }).then((result) => {
            if (result.isConfirmed) {
                const url = type === 'category' ? route('categories.destroy', item.id) : route('wallet-types.destroy', item.id);
                router.delete(url, {
                    onSuccess: () => {
                        if (type === 'category') closeModal();
                        else closeWalletModal();
                        Swal.fire('ลบแล้ว!', 'ข้อมูลถูกลบเรียบร้อยแล้ว', 'success');
                    }
                });
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">ตั้งค่าพื้นฐาน</h2>
                    <div className="flex gap-3">
                        <button 
                            onClick={openCreateWalletModal}
                            className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-500/25 hover:bg-emerald-700 transition-all active:scale-95"
                        >
                            + เพิ่มประเภทกระเป๋า
                        </button>
                        <button 
                            onClick={openCreateModal}
                            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all active:scale-95"
                        >
                            + เพิ่มหมวดหมู่
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="ตั้งค่าหมวดหมู่และประเภท" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
                    
                    {/* Wallet Types Section */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-emerald-100/50">
                        <h3 className="text-xl font-black text-emerald-600 mb-6 flex items-center gap-2">
                            📂 ประเภทกระเป๋าเงิน
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                            {walletTypes.map((type) => (
                                <div 
                                    key={type.id} 
                                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all group relative cursor-pointer"
                                    onClick={() => openEditWalletModal(type)}
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <div 
                                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                                            style={{ backgroundColor: (type.color || '#10b981') + '10', color: type.color || '#10b981' }}
                                        >
                                            {type.icon || '💵'}
                                        </div>
                                        <span className="text-sm font-bold text-slate-700 text-center">{type.name}</span>
                                        {!type.user_id && <span className="text-[8px] font-black uppercase text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-100">System</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Expense Categories */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-rose-100/50">
                            <h3 className="text-xl font-black text-rose-600 mb-6 flex items-center gap-2">
                                💸 หมวดหมู่รายจ่าย
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {categories.filter(c => c.type === 'expense').map((cat) => (
                                    <div 
                                        key={cat.id} 
                                        className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-rose-200 transition-all group relative cursor-pointer"
                                        onClick={() => openEditModal(cat)}
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <div 
                                                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                                                style={{ backgroundColor: (cat.color || '#ef4444') + '10', color: cat.color || '#ef4444' }}
                                            >
                                                {cat.icon || '📁'}
                                            </div>
                                            <span className="text-sm font-bold text-slate-700 text-center">{cat.name}</span>
                                            {!cat.user_id && <span className="text-[8px] font-black uppercase text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-100">System</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Income Categories */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-emerald-100/50">
                            <h3 className="text-xl font-black text-emerald-600 mb-6 flex items-center gap-2">
                                💰 หมวดหมู่รายได้
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {categories.filter(c => c.type === 'income').map((cat) => (
                                    <div 
                                        key={cat.id} 
                                        className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all group relative cursor-pointer"
                                        onClick={() => openEditModal(cat)}
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <div 
                                                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                                                style={{ backgroundColor: (cat.color || '#10b981') + '10', color: cat.color || '#10b981' }}
                                            >
                                                {cat.icon || '📁'}
                                            </div>
                                            <span className="text-sm font-bold text-slate-700 text-center">{cat.name}</span>
                                            {!cat.user_id && <span className="text-[8px] font-black uppercase text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-100">System</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Modal */}
            <Modal show={showModal} onClose={closeModal} maxWidth="md">
                <form onSubmit={submit} className="p-8">
                    <h2 className="text-2xl font-black text-slate-800 mb-6">
                        {editingItem ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่'}
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <InputLabel htmlFor="name" value="ชื่อหมวดหมู่" className="font-bold text-slate-700 mb-1" />
                            <TextInput id="name" className="block w-full" value={data.name} onChange={(e) => setData('name', e.target.value)} required placeholder="เช่น ค่าอาหาร, เงินเดือน" />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="type" value="ประเภท" className="font-bold text-slate-700 mb-1" />
                                <select className="block w-full border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl py-3.5 px-5 font-medium text-slate-700" value={data.type} onChange={(e) => setData('type', e.target.value)} required>
                                    <option value="expense">รายจ่าย</option>
                                    <option value="income">รายได้</option>
                                </select>
                            </div>
                            <div>
                                <InputLabel htmlFor="icon" value="ไอคอน (Emoji)" className="font-bold text-slate-700 mb-1" />
                                <TextInput id="icon" className="block w-full text-center text-xl" value={data.icon} onChange={(e) => setData('icon', e.target.value)} placeholder="เช่น 🍔, 💰" />
                            </div>
                        </div>
                        <div>
                            <InputLabel htmlFor="color" value="สีหมวดหมู่" className="font-bold text-slate-700 mb-1" />
                            <input id="color" type="color" className="w-full h-[58px] p-2 bg-white border border-slate-200 rounded-2xl cursor-pointer" value={data.color} onChange={(e) => setData('color', e.target.value)} />
                        </div>
                    </div>
                    <div className="mt-10 flex justify-between gap-3">
                        {editingItem && (
                            <button type="button" onClick={() => handleDelete(editingItem)} className="px-6 py-3.5 rounded-2xl font-bold bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all">ลบ</button>
                        )}
                        <div className="flex gap-3 ml-auto">
                            <SecondaryButton onClick={closeModal} className="px-8 py-3.5 rounded-2xl font-bold">ยกเลิก</SecondaryButton>
                            <PrimaryButton disabled={processing} className="px-8 py-3.5 rounded-2xl font-bold bg-blue-600 hover:bg-blue-700">บันทึก</PrimaryButton>
                        </div>
                    </div>
                </form>
            </Modal>

            {/* Wallet Type Modal */}
            <Modal show={showWalletModal} onClose={closeWalletModal} maxWidth="md">
                <form onSubmit={submitWallet} className="p-8">
                    <h2 className="text-2xl font-black text-slate-800 mb-6">
                        {editingItem ? 'แก้ไขประเภทกระเป๋า' : 'เพิ่มประเภทกระเป๋าใหม่'}
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <InputLabel htmlFor="w_name" value="ชื่อประเภทกระเป๋า" className="font-bold text-slate-700 mb-1" />
                            <TextInput id="w_name" className="block w-full" value={walletData.name} onChange={(e) => setWalletData('name', e.target.value)} required placeholder="เช่น บัญชีธุรกิจ, เงินเก็บส่วนตัว" />
                            <InputError message={walletErrors.name} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="w_classification" value="หมวดหมู่หลัก (เพื่อสรุปยอดเงิน)" className="font-bold text-slate-700 mb-1" />
                            <select 
                                id="w_classification" 
                                className="block w-full border-slate-200 bg-slate-50/50 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl py-3.5 px-5 font-medium text-slate-700 shadow-sm" 
                                value={walletData.classification} 
                                onChange={(e) => setWalletData('classification', e.target.value)} 
                                required
                            >
                                <option value="spending">ใช้จ่ายทั่วไป</option>
                                <option value="saving">การออม (เช่น บัญชีออมทรัพย์)</option>
                                <option value="investment">การลงทุน (เช่น หุ้น, กองทุน)</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="w_icon" value="ไอคอน (Emoji)" className="font-bold text-slate-700 mb-1" />
                                <TextInput id="w_icon" className="block w-full text-center text-xl" value={walletData.icon} onChange={(e) => setWalletData('icon', e.target.value)} placeholder="เช่น 💵, 🏦" />
                            </div>
                            <div>
                                <InputLabel htmlFor="w_color" value="สีธีม" className="font-bold text-slate-700 mb-1" />
                                <input id="w_color" type="color" className="w-full h-[58px] p-2 bg-white border border-slate-200 rounded-2xl cursor-pointer" value={walletData.color} onChange={(e) => setWalletData('color', e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 flex justify-between gap-3">
                        {editingItem && (
                            <button type="button" onClick={() => handleDelete(editingItem, 'wallet')} className="px-6 py-3.5 rounded-2xl font-bold bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all">ลบ</button>
                        )}
                        <div className="flex gap-3 ml-auto">
                            <SecondaryButton onClick={closeWalletModal} className="px-8 py-3.5 rounded-2xl font-bold">ยกเลิก</SecondaryButton>
                            <PrimaryButton disabled={walletProcessing} className="px-8 py-3.5 rounded-2xl font-bold bg-emerald-600 hover:bg-emerald-700">บันทึก</PrimaryButton>
                        </div>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
