import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="ยืนยันอีเมล" />

            <div className="mb-4 text-sm text-slate-500 font-medium">
                ขอบคุณที่สมัครสมาชิก! ก่อนเริ่มต้นใช้งาน โปรดตรวจสอบที่อยู่อีเมลของคุณ 
                โดยคลิกที่ลิงก์ที่เราเพิ่งส่งให้คุณทางอีเมล หากคุณไม่ได้รับอีเมล 
                เรายินดีจะส่งให้คุณอีกครั้ง
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-sm font-bold text-green-600 bg-green-50 p-4 rounded-xl border border-green-100">
                    ลิงก์ยืนยันใหม่ถูกส่งไปยังอีเมลที่คุณให้ไว้ระหว่างการลงทะเบียนแล้ว
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-6 flex items-center justify-between">
                    <PrimaryButton disabled={processing} className="px-6 py-3 rounded-xl font-bold">
                        ส่งอีเมลยืนยันอีกครั้ง
                    </PrimaryButton>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-sm text-slate-500 underline hover:text-slate-700 font-bold"
                    >
                        ออกจากระบบ
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
