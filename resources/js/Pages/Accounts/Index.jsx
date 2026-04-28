import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import AccountList from '../Dashboard/Partials/AccountList';
import { useState } from 'react';
import AccountModal from '../Dashboard/Partials/AccountModal';

export default function Index({ accounts }) {
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);

    const openEditModal = (account) => {
        setEditingAccount(account);
        setShowAccountModal(true);
    };

    const closeModal = () => {
        setShowAccountModal(false);
        setEditingAccount(null);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">จัดการบัญชี</h2>
                    <button 
                        onClick={() => setShowAccountModal(true)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all active:scale-95"
                    >
                        + เพิ่มกระเป๋าเงิน
                    </button>
                </div>
            }
        >
            <Head title="บัญชี" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <AccountList 
                        accounts={accounts} 
                        onAddAccount={() => setShowAccountModal(true)} 
                        onEditAccount={openEditModal}
                    />
                </div>
            </div>

            <AccountModal 
                show={showAccountModal} 
                onClose={closeModal} 
                editingAccount={editingAccount}
            />
        </AuthenticatedLayout>
    );
}
