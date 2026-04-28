import React from 'react';
import Swal from 'sweetalert2';
import { useForm } from '@inertiajs/react';

export default function SavingsGoalCard({ current = 0, target = 100000 }) {
    const percentage = Math.min(Math.round((current / (target || 1)) * 100), 100);
    const { patch } = useForm();

    const handleEditGoal = () => {
        Swal.fire({
            title: 'ตั้งเป้าหมายเงินออม',
            input: 'number',
            inputLabel: 'จำนวนเงินเป้าหมาย (บาท)',
            inputValue: target,
            showCancelButton: true,
            confirmButtonText: 'บันทึก',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#3b82f6',
            inputAttributes: {
                min: 0,
                step: 1000
            },
            inputValidator: (value) => {
                if (!value || value < 0) {
                    return 'กรุณาระบุจำนวนเงินที่ถูกต้อง';
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                patch(route('profile.goal.update', { savings_goal: result.value }), {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'สำเร็จ!',
                            text: 'อัปเดตเป้าหมายเงินออมเรียบร้อยแล้ว',
                            icon: 'success',
                            confirmButtonColor: '#3b82f6',
                        });
                    }
                });
            }
        });
    };
    
    return (
        <div className="bg-white rounded-[2rem] p-8 shadow-lg shadow-blue-900/5 border border-blue-100/50 flex flex-col justify-between h-full group">
            <div>
                <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-xl">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                    </div>
                    <button 
                        onClick={handleEditGoal}
                        className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                </div>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">เป้าหมายเงินออม</p>
                <h3 className="text-3xl font-black text-slate-800 mb-6 tracking-tight">฿{Number(current).toLocaleString()}</h3>
                
                <div className="relative w-full h-2.5 bg-blue-50 rounded-full overflow-hidden mb-6">
                    <div 
                        className="absolute top-0 left-0 h-full bg-blue-600 rounded-full transition-all duration-1000" 
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            </div>
            
            <div className="flex flex-col gap-2">
                <div className="bg-emerald-50 rounded-2xl py-2 px-4 inline-flex self-start">
                    <span className="text-emerald-600 font-bold text-xs">สำเร็จ {percentage}%</span>
                </div>
                <p className="text-[10px] text-slate-400 font-bold ml-1">จากเป้าหมาย ฿{target.toLocaleString()}</p>
            </div>
        </div>
    );
}
