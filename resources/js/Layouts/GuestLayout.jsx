import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 px-6 py-12 selection:bg-blue-500 selection:text-white">
            {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-24 -right-12 w-96 h-96 bg-blue-200/40 rounded-full blur-[80px] animate-float"></div>
                <div className="absolute -bottom-24 -left-12 w-[500px] h-[500px] bg-blue-300/30 rounded-full blur-[100px] animate-float-reverse"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center w-full">
                <div className="mb-8 transform hover:scale-110 transition-transform duration-300">
                    <Link href="/" className="flex flex-col items-center gap-3 no-underline">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-black text-blue-900 tracking-tighter">VPOCKET</span>
                    </Link>
                </div>

                <div className="w-full sm:max-w-md bg-white/70 backdrop-blur-2xl border border-white/50 px-8 py-10 shadow-2xl shadow-blue-900/5 rounded-[2.5rem] animate-in fade-in zoom-in duration-500">
                    {children}
                </div>
            </div>
        </div>
    );
}
