import React, { useEffect, useRef, useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useForm, usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function AccountModal({ show, onClose, editingAccount = null }) {
    const { walletTypes } = usePage().props;
    const fileInput = useRef();
    const [previewUrl, setPreviewUrl] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        type: walletTypes?.[0]?.name || 'ออมทรัพย์',
        balance: 0,
        currency: 'THB',
        color: walletTypes?.[0]?.color || '#3b82f6',
        icon: walletTypes?.[0]?.icon || '🏦',
        image: null,
        _method: editingAccount ? 'patch' : 'post',
    });

    useEffect(() => {
        if (show) {
            if (editingAccount) {
                setData({
                    name: editingAccount.name || '',
                    type: editingAccount.type || 'ออมทรัพย์',
                    balance: editingAccount.balance || 0,
                    currency: editingAccount.currency || 'THB',
                    color: editingAccount.color || '#3b82f6',
                    icon: editingAccount.icon || '🏦',
                    image: null,
                    _method: 'patch',
                });
                setPreviewUrl(editingAccount.image_path ? `/storage/${editingAccount.image_path}` : null);
            } else {
                reset();
                setPreviewUrl(null);
            }
        }
    }, [show, editingAccount]);

    const submit = (e) => {
        e.preventDefault();
        const url = editingAccount 
            ? route('accounts.update', editingAccount.id) 
            : route('accounts.store');
        
        post(url, {
            onSuccess: () => {
                reset();
                onClose();
                Swal.fire({
                    title: 'สำเร็จ!',
                    text: editingAccount ? 'อัปเดตข้อมูลเรียบร้อยแล้ว' : 'สร้างกระเป๋าเงินใหม่เรียบร้อยแล้ว',
                    icon: 'success',
                    confirmButtonColor: '#3b82f6',
                });
            },
        });
    };

    const handleTypeChange = (e) => {
        const selectedType = walletTypes.find(t => t.name === e.target.value);
        setData({
            ...data,
            type: e.target.value,
            icon: selectedType ? selectedType.icon : data.icon,
            color: selectedType ? selectedType.color : data.color
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <form onSubmit={submit} className="p-8">
                <h2 className="text-2xl font-black text-slate-800 mb-6">
                    {editingAccount ? 'แก้ไขกระเป๋าเงิน' : 'เพิ่มกระเป๋าเงินใหม่'}
                </h2>

                <div className="space-y-6">
                    <div className="flex flex-col items-center justify-center">
                        <div 
                            onClick={() => fileInput.current.click()}
                            className="w-32 h-32 rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-100 hover:border-blue-400 transition-all overflow-hidden group relative"
                        >
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center">
                                    <span className="text-3xl mb-1 block">{data.icon}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">อัปโหลดรูป</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-blue-600">
                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                                </svg>
                            </div>
                        </div>
                        <input type="file" ref={fileInput} className="hidden" accept="image/*" onChange={handleImageChange} />
                        <InputError message={errors.image} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="name" value="ชื่อกระเป๋าเงิน" className="font-bold text-slate-700 mb-1" />
                        <TextInput id="name" className="block w-full" value={data.name} onChange={(e) => setData('name', e.target.value)} required placeholder="เช่น SCB ออมทรัพย์, เงินสดในมือ" />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="type" value="ประเภทกระเป๋า" className="font-bold text-slate-700 mb-1" />
                            <select
                                id="type"
                                className="block w-full border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl shadow-sm py-3.5 px-5 transition-all font-medium text-slate-700"
                                value={data.type}
                                onChange={handleTypeChange}
                                required
                            >
                                {walletTypes.map((type) => (
                                    <option key={type.id} value={type.name}>{type.name}</option>
                                ))}
                            </select>
                            <InputError message={errors.type} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="balance" value={editingAccount ? "ยอดเงินปัจจุบัน" : "ยอดเงินเริ่มต้น"} className="font-bold text-slate-700 mb-1" />
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">฿</span>
                                <TextInput id="balance" type="number" step="1" className="block w-full pl-8" value={data.balance} onChange={(e) => setData('balance', e.target.value)} required />
                            </div>
                            <InputError message={errors.balance} className="mt-2" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="color" value="สีธีม" className="font-bold text-slate-700 mb-1" />
                            <div className="flex gap-2">
                                <input id="color" type="color" className="w-12 h-[58px] p-1 bg-white border border-slate-200 rounded-2xl cursor-pointer shadow-sm" value={data.color} onChange={(e) => setData('color', e.target.value)} />
                                <div className="flex-1 flex items-center px-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-500">
                                    {data.color.toUpperCase()}
                                </div>
                            </div>
                        </div>
                        <div>
                            <InputLabel htmlFor="icon" value="ไอคอน (Emoji)" className="font-bold text-slate-700 mb-1" />
                            <TextInput id="icon" className="block w-full text-center text-xl" value={data.icon} onChange={(e) => setData('icon', e.target.value)} placeholder="เช่น 💳, 💰" />
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex justify-end gap-3">
                    <SecondaryButton onClick={onClose} className="px-8 py-3.5 rounded-2xl font-bold">ยกเลิก</SecondaryButton>
                    <PrimaryButton disabled={processing} className="px-8 py-3.5 rounded-2xl font-bold bg-blue-600 hover:bg-blue-700 transition-all">
                        {editingAccount ? 'บันทึกการแก้ไข' : 'สร้างกระเป๋าเงิน'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
