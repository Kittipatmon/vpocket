import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            username: user.username,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-bold text-slate-900">
                    ข้อมูลโปรไฟล์
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    อัปเดตข้อมูลโปรไฟล์ ชื่อผู้ใช้งาน และที่อยู่อีเมลของบัญชีคุณ
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="ชื่อ" className="font-bold text-slate-700" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full px-4 py-3"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="username" value="ชื่อผู้ใช้งาน (Username)" className="font-bold text-slate-700" />

                    <TextInput
                        id="username"
                        className="mt-1 block w-full px-4 py-3"
                        value={data.username}
                        onChange={(e) => setData('username', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.username} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="อีเมล" className="font-bold text-slate-700" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full px-4 py-3"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="email"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-slate-800">
                            อีเมลของคุณยังไม่ได้ยืนยัน
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ml-2 rounded-md text-sm text-blue-600 underline hover:text-blue-700 focus:outline-none"
                            >
                                คลิกที่นี่เพื่อส่งอีเมลยืนยันอีกครั้ง
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                ลิงก์ยืนยันใหม่ถูกส่งไปยังอีเมลของคุณแล้ว
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing} className="px-8 py-3 rounded-xl font-bold">บันทึก</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-slate-500">
                            บันทึกเรียบร้อยแล้ว
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
