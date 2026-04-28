import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="ลืมรหัสผ่าน" />

            <div className="mb-4 text-sm text-slate-500 font-medium">
                ลืมรหัสผ่านใช่หรือไม่? ไม่มีปัญหา เพียงแจ้งที่อยู่อีเมลของคุณให้เราทราบ 
                แล้วเราจะส่งลิงก์รีเซ็ตรหัสผ่านให้คุณทางอีเมล ซึ่งจะช่วยให้คุณสามารถตั้งรหัสผ่านใหม่ได้
            </div>

            {status && (
                <div className="mb-4 text-sm font-bold text-green-600 bg-green-50 p-4 rounded-xl border border-green-100">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full px-4 py-3"
                    isFocused={true}
                    placeholder="อีเมลของคุณ"
                    onChange={(e) => setData('email', e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />

                <div className="mt-6 flex items-center justify-end">
                    <PrimaryButton className="w-full justify-center py-4 rounded-2xl font-bold shadow-lg" disabled={processing}>
                        ส่งลิงก์รีเซ็ตรหัสผ่าน
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
