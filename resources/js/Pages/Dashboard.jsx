import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import BalanceCard from '@/Pages/Dashboard/Partials/BalanceCard';
import SavingsGoalCard from '@/Pages/Dashboard/Partials/SavingsGoalCard';
import MonthlyExpenseCard from '@/Pages/Dashboard/Partials/MonthlyExpenseCard';
import Insights from '@/Pages/Dashboard/Partials/Insights';
import RecentTransactions from '@/Pages/Dashboard/Partials/RecentTransactions';
import AccountList from '@/Pages/Dashboard/Partials/AccountList';
import TransactionModal from '@/Pages/Dashboard/Partials/TransactionModal';
import AccountModal from '@/Pages/Dashboard/Partials/AccountModal';

export default function Dashboard({ 
    accounts, 
    recentTransactions, 
    totalBalance, 
    monthlyIncome, 
    monthlyExpense, 
    lastMonthExpense,
    totalSavings,
    savingsGoal,
    insights
}) {
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [editingAccount, setEditingAccount] = useState(null);

    const openEditModal = (transaction) => {
        setEditingTransaction(transaction);
        setShowTransactionModal(true);
    };

    const openEditAccountModal = (account) => {
        setEditingAccount(account);
        setShowAccountModal(true);
    };

    const closeTransactionModal = () => {
        setShowTransactionModal(false);
        setEditingTransaction(null);
    };

    const closeAccountModal = () => {
        setShowAccountModal(false);
        setEditingAccount(null);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-1">ยินดีต้อนรับกลับมา!</p>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                            สรุปการเงินของคุณ
                        </h2>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowAccountModal(true)}
                            className="bg-white text-blue-600 border-2 border-blue-100 px-6 py-3 rounded-2xl font-bold shadow-sm hover:bg-blue-50 hover:border-blue-200 transition-all active:scale-95"
                        >
                            + เพิ่มกระเป๋าเงิน
                        </button>
                        <button
                            onClick={() => setShowTransactionModal(true)}
                            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-blue-500/25 hover:-translate-y-0.5 hover:shadow-2xl transition-all active:scale-95"
                        >
                            + เพิ่มรายการ
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="แดชบอร์ด" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Financial Summary Grid (Top row) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <BalanceCard
                            totalBalance={totalBalance}
                            monthlyIncome={monthlyIncome}
                            monthlyExpense={monthlyExpense}
                        />
                        <SavingsGoalCard 
                            current={totalSavings} 
                            target={savingsGoal} 
                        />
                        <MonthlyExpenseCard 
                            amount={monthlyExpense} 
                            lastMonthAmount={lastMonthExpense}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Transactions (Spans 2 columns on desktop) */}
                        <div className="lg:col-span-2">
                            <RecentTransactions 
                                transactions={recentTransactions} 
                                onEdit={openEditModal}
                            />
                        </div>

                        {/* Side Column: Accounts & Insights */}
                        <div className="space-y-8">
                            <AccountList
                                accounts={accounts}
                                onAddAccount={() => setShowAccountModal(true)}
                                onEditAccount={openEditAccountModal}
                            />
                            <Insights data={insights} />
                        </div>
                    </div>
                </div>
            </div>

            <TransactionModal 
                show={showTransactionModal} 
                onClose={closeTransactionModal} 
                accounts={accounts}
                editingTransaction={editingTransaction}
            />

            <AccountModal
                show={showAccountModal}
                onClose={closeAccountModal}
                editingAccount={editingAccount}
            />
        </AuthenticatedLayout>
    );
}
