import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="เข้าสู่ระบบ" />

            <div className="mb-8 text-center">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">ยินดีต้อนรับกลับมา</h2>
                <p className="text-slate-500 mt-2 font-medium">กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ</p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-bold text-green-600 bg-green-50 p-4 rounded-2xl border border-green-100">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="username" value="ชื่อผู้ใช้งาน (Username)" className="text-slate-700 font-bold mb-2 ml-1" />

                    <TextInput
                        id="username"
                        type="text"
                        name="username"
                        value={data.username}
                        className="block w-full px-4 py-3"
                        autoComplete="username"
                        isFocused={true}
                        placeholder="ชื่อผู้ใช้งานของคุณ"
                        onChange={(e) => setData('username', e.target.value)}
                    />

                    <InputError message={errors.username} className="mt-2 ml-1" />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2 ml-1">
                        <InputLabel htmlFor="password" value="รหัสผ่าน" className="text-slate-700 font-bold" />
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                ลืมรหัสผ่าน?
                            </Link>
                        )}
                    </div>

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="block w-full px-4 py-3"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2 ml-1" />
                </div>

                <div className="flex items-center ml-1">
                    <label className="flex items-center cursor-pointer group">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            className="rounded-md border-slate-300 text-blue-600 focus:ring-blue-500"
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-3 text-sm font-bold text-slate-500 group-hover:text-slate-700 transition-colors">
                            จดจำฉันไว้
                        </span>
                    </label>
                </div>

                <div className="pt-2">
                    <PrimaryButton 
                        className="w-full justify-center py-4 rounded-2xl text-lg font-black shadow-xl shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]" 
                        disabled={processing}
                    >
                        เข้าสู่ระบบ
                    </PrimaryButton>
                </div>

                <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm font-bold">
                        <span className="bg-white/0 px-4 text-slate-400">หรือ</span>
                    </div>
                </div>

                <button 
                    type="button"
                    className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-100 py-3.5 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-[0.98]"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c3.11 0 5.72-1.03 7.63-2.8l-3.57-2.77c-.99.66-2.23 1.06-4.06 1.06-3.11 0-5.74-2.1-6.68-4.92H1.61v2.84C3.51 21.38 7.51 23 12 23z" fill="#34A853"/>
                        <path d="M5.32 13.57c-.24-.72-.38-1.49-.38-2.32s.14-1.6.38-2.32V6.09H1.61C.58 8.16 0 10.51 0 13s.58 4.84 1.61 6.91l3.71-2.84c-.24-.72-.38-1.49-.38-2.32z" fill="#FBBC05"/>
                        <path d="M12 4.8c1.69 0 3.21.58 4.41 1.72l3.31-3.31C17.71 1.29 15.11 0 12 0 7.51 0 3.51 1.62 1.61 4.54L5.32 7.38c.94-2.82 3.57-4.92 6.68-4.92z" fill="#EA4335"/>
                    </svg>
                    ใช้งานด้วย Google
                </button>

                <div className="text-center pt-4">
                    <p className="text-sm font-bold text-slate-500">
                        ยังไม่มีบัญชีใช่หรือไม่? {' '}
                        <Link
                            href={route('register')}
                            className="text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            สมัครสมาชิกตอนนี้
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
