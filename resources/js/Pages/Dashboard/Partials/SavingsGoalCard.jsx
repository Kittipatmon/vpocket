import React from 'react';
import Swal from 'sweetalert2';
import { router } from '@inertiajs/react';

export default function SavingsGoalCard({ goals = [], accounts = [] }) {
    
    const handleAddGoal = () => {
        const accountOptions = accounts.map(acc => `<option value="${acc.id}">${acc.name} (฿${Number(acc.balance).toLocaleString()})</option>`).join('');

        Swal.fire({
            title: 'เพิ่มเป้าหมายใหม่',
            html: `
                <div class="text-left mb-2 text-xs font-bold text-slate-400">ชื่อเป้าหมาย</div>
                <input id="swal-input1" class="swal2-input !mt-0" placeholder="เช่น ซื้อรถ, ไปเที่ยว">
                <div class="text-left mb-2 mt-4 text-xs font-bold text-slate-400">จำนวนเงินเป้าหมาย</div>
                <input id="swal-input2" type="number" class="swal2-input !mt-0" placeholder="฿0">
                <div class="text-left mb-2 mt-4 text-xs font-bold text-slate-400">เลือกกระเป๋าเงินเพื่อติดตาม (ถ้ามี)</div>
                <select id="swal-input3" class="swal2-input !mt-0">
                    <option value="">-- ไม่ระบุ (ติดตามรวมตามประเภท) --</option>
                    ${accountOptions}
                </select>
                <div class="text-left mb-2 mt-4 text-xs font-bold text-slate-400">ประเภทเป้าหมาย</div>
                <select id="swal-input4" class="swal2-input !mt-0">
                    <option value="saving">การออม</option>
                    <option value="investment">การลงทุน</option>
                </select>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'เพิ่มเป้าหมาย',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#3b82f6',
            preConfirm: () => {
                const name = document.getElementById('swal-input1').value;
                const target = document.getElementById('swal-input2').value;
                const account_id = document.getElementById('swal-input3').value;
                const type = document.getElementById('swal-input4').value;
                if (!name || !target) {
                    Swal.showValidationMessage('กรุณากรอกชื่อและจำนวนเงินเป้าหมาย');
                    return false;
                }
                return { 
                    name, 
                    target_amount: target, 
                    account_id: account_id || null,
                    type: type,
                    icon: type === 'saving' ? '🏦' : '📈',
                    color: type === 'saving' ? '#10b981' : '#3b82f6'
                };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('goals.store'), result.value, {
                    onSuccess: () => {
                        Swal.fire('สำเร็จ!', 'เพิ่มเป้าหมายเรียบร้อยแล้ว', 'success');
                    }
                });
            }
        });
    };

    const handleEditGoal = (goal) => {
        const accountOptions = accounts.map(acc => `<option value="${acc.id}" ${goal.account_id == acc.id ? 'selected' : ''}>${acc.name} (฿${Number(acc.balance).toLocaleString()})</option>`).join('');

        Swal.fire({
            title: 'แก้ไขเป้าหมาย',
            html: `
                <div class="text-left mb-2 text-xs font-bold text-slate-400">ชื่อเป้าหมาย</div>
                <input id="swal-input1" class="swal2-input !mt-0" value="${goal.name}">
                <div class="text-left mb-2 mt-4 text-xs font-bold text-slate-400">จำนวนเงินเป้าหมาย</div>
                <input id="swal-input2" type="number" class="swal2-input !mt-0" value="${goal.target_amount}">
                <div class="text-left mb-2 mt-4 text-xs font-bold text-slate-400">ติดตามเงินจากกระเป๋า</div>
                <select id="swal-input3" class="swal2-input !mt-0">
                    <option value="">-- ไม่ระบุ (ติดตามรวมตามประเภท) --</option>
                    ${accountOptions}
                </select>
            `,
            focusConfirm: false,
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: 'บันทึก',
            denyButtonText: 'ลบเป้าหมาย',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#3b82f6',
            denyButtonColor: '#ef4444',
            preConfirm: () => {
                const name = document.getElementById('swal-input1').value;
                const target = document.getElementById('swal-input2').value;
                const account_id = document.getElementById('swal-input3').value;
                if (!name || !target) {
                    Swal.showValidationMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
                    return false;
                }
                return { name, target_amount: target, account_id: account_id || null };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                router.patch(route('goals.update', goal.id), result.value, {
                    onSuccess: () => {
                        Swal.fire('สำเร็จ!', 'อัปเดตเป้าหมายเรียบร้อยแล้ว', 'success');
                    }
                });
            } else if (result.isDenied) {
                Swal.fire({
                    title: 'คุณแน่ใจหรือไม่?',
                    text: "การลบเป้าหมายไม่สามารถย้อนคืนได้",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#ef4444',
                    confirmButtonText: 'ใช่, ลบเลย!',
                    cancelButtonText: 'ยกเลิก'
                }).then((delResult) => {
                    if (delResult.isConfirmed) {
                        router.delete(route('goals.destroy', goal.id), {
                            onSuccess: () => {
                                Swal.fire('ลบแล้ว!', 'ลบเป้าหมายเรียบร้อยแล้ว', 'success');
                            }
                        });
                    }
                });
            }
        });
    };

    return (
        <div className="bg-white rounded-[2rem] p-8 shadow-lg shadow-blue-900/5 border border-blue-100/50 flex flex-col h-full relative overflow-hidden group">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">เป้าหมายเงินออม</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Savings & Investments</p>
                </div>
                <button
                    onClick={handleAddGoal}
                    className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all flex items-center justify-center"
                    title="เพิ่มเป้าหมาย"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                </button>
            </div>

            <div className="space-y-10 flex-1 flex flex-col justify-center">
                {goals.length > 0 ? goals.map((goal) => {
                    const percentage = Math.min(Math.round((Number(goal.current_amount) / (Number(goal.target_amount) || 1)) * 100), 100);
                    return (
                        <div key={goal.id} className="relative group/item">
                            <div className="flex justify-between items-end mb-3">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm"
                                        style={{ backgroundColor: (goal.color || '#3b82f6') + '15', color: goal.color || '#3b82f6' }}
                                    >
                                        {goal.icon || '🎯'}
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{goal.name}</h4>
                                        <p className="text-lg font-black text-slate-800">฿{Number(goal.current_amount).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">เป้าหมาย ฿{Number(goal.target_amount).toLocaleString()}</span>
                                    <p className="text-sm font-black" style={{ color: goal.color || '#3b82f6' }}>{percentage}%</p>
                                </div>
                            </div>
                            <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${percentage}%`, backgroundColor: goal.color || '#3b82f6' }}
                                ></div>
                            </div>

                            {/* Edit Button */}
                            <button
                                onClick={() => handleEditGoal(goal)}
                                className="absolute -top-1 -right-1 opacity-0 group-hover/item:opacity-100 p-1.5 text-slate-300 hover:text-blue-600 transition-all"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                            </button>
                        </div>
                    );
                }) : (
                    <div className="text-center py-4">
                        <p className="text-slate-400 text-sm font-bold">ยังไม่มีเป้าหมาย</p>
                    </div>
                )}
            </div>
        </div>
    );
}
