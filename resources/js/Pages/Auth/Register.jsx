import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="สมัครสมาชิก" />

            <div className="mb-8 text-center">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">สร้างบัญชีใหม่</h2>
                <p className="text-slate-500 mt-2 font-medium">เข้าร่วม Vpocket และเริ่มต้นจัดการเงินได้ตั้งแต่วันนี้</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="name" value="ชื่อ-นามสกุล" className="text-slate-700 font-bold mb-2 ml-1" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="block w-full px-4 py-3"
                        autoComplete="name"
                        isFocused={true}
                        placeholder="ชื่อของคุณ"
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2 ml-1" />
                </div>

                <div>
                    <InputLabel htmlFor="username" value="ชื่อผู้ใช้งาน (Username)" className="text-slate-700 font-bold mb-2 ml-1" />

                    <TextInput
                        id="username"
                        name="username"
                        value={data.username}
                        className="block w-full px-4 py-3"
                        autoComplete="username"
                        placeholder="ตั้งชื่อผู้ใช้งานของคุณ"
                        onChange={(e) => setData('username', e.target.value)}
                        required
                    />

                    <InputError message={errors.username} className="mt-2 ml-1" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="อีเมล" className="text-slate-700 font-bold mb-2 ml-1" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="block w-full px-4 py-3"
                        autoComplete="email"
                        placeholder="example@email.com"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2 ml-1" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="รหัสผ่าน" className="text-slate-700 font-bold mb-2 ml-1" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="block w-full px-4 py-3"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2 ml-1" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="ยืนยันรหัสผ่าน"
                        className="text-slate-700 font-bold mb-2 ml-1"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="block w-full px-4 py-3"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2 ml-1"
                    />
                </div>

                <div className="pt-4">
                    <PrimaryButton 
                        className="w-full justify-center py-4 rounded-2xl text-lg font-black shadow-xl shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]" 
                        disabled={processing}
                    >
                        สร้างบัญชี
                    </PrimaryButton>
                </div>

                <div className="text-center pt-4">
                    <p className="text-sm font-bold text-slate-500">
                        มีบัญชีอยู่แล้วใช่หรือไม่? {' '}
                        <Link
                            href={route('login')}
                            className="text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            เข้าสู่ระบบ
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
