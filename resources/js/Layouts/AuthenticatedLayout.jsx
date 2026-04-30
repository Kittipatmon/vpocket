import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100">
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-blue-100/50 shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/" className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                        </svg>
                                    </div>
                                    <span className="text-xl font-black text-blue-900 tracking-tight">
                                        VPOCKET
                                    </span>
                                </Link>
                            </div>

                            <div className="hidden space-x-1 sm:-my-px sm:ms-8 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    แดชบอร์ด
                                </NavLink>
                                <NavLink
                                    href={route('market.index')}
                                    active={route().current('market.index')}
                                >
                                    ตลาดหุ้น
                                </NavLink>
                                <NavLink
                                    href={route('accounts.index')}
                                    active={route().current('accounts.index')}
                                >
                                    บัญชี
                                </NavLink>
                                <NavLink
                                    href={route('categories.index')}
                                    active={route().current('categories.index')}
                                >
                                    หมวดหมู่
                                </NavLink>
                                <NavLink
                                    href={route('reports.index')}
                                    active={route().current('reports.index')}
                                >
                                    รายงาน
                                </NavLink>
                                <NavLink
                                    href={route('analytics.index')}
                                    active={route().current('analytics.index')}
                                >
                                    วิเคราะห์
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-bold text-blue-900 transition hover:bg-blue-100 focus:outline-none"
                                            >
                                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-black">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                {user.name}

                                                <svg
                                                    className="h-4 w-4 text-blue-400"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content contentClasses="py-2 bg-white rounded-2xl shadow-2xl border border-blue-100">
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            โปรไฟล์
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            ออกจากระบบ
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-xl p-2 text-slate-500 transition hover:bg-blue-50 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            แดชบอร์ด
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('market.index')}
                            active={route().current('market.index')}
                        >
                            ตลาดหุ้น
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('accounts.index')}
                            active={route().current('accounts.index')}
                        >
                            บัญชี
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('categories.index')}
                            active={route().current('categories.index')}
                        >
                            หมวดหมู่
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('reports.index')}
                            active={route().current('reports.index')}
                        >
                            รายงาน
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('analytics.index')}
                            active={route().current('analytics.index')}
                        >
                            วิเคราะห์
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-blue-100 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-bold text-slate-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-slate-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                โปรไฟล์
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                ออกจากระบบ
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="pt-8 px-4">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="pb-12">{children}</main>
        </div>
    );
}
