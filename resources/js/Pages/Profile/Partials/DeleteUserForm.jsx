import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-bold text-slate-900">
                    ลบบัญชี
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    เมื่อลบบัญชีของคุณแล้ว ข้อมูลและทรัพยากรทั้งหมดจะถูกลบอย่างถาวร 
                    ก่อนลบบัญชี โปรดดาวน์โหลดข้อมูลหรือข้อมูลใดๆ ที่คุณต้องการเก็บไว้
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion} className="px-6 py-3 rounded-xl font-bold">
                ลบบัญชี
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-bold text-slate-900">
                        คุณแน่ใจหรือไม่ว่าต้องการลบบัญชี?
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        เมื่อลบบัญชีของคุณแล้ว ข้อมูลทั้งหมดจะถูกลบอย่างถาวร 
                        โปรดป้อนรหัสผ่านเพื่อยืนยันว่าคุณต้องการลบบัญชีอย่างถาวร
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="รหัสผ่าน"
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="mt-1 block w-3/4 px-4 py-3"
                            isFocused
                            placeholder="รหัสผ่าน"
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal} className="px-6 py-2 rounded-xl font-bold">
                            ยกเลิก
                        </SecondaryButton>

                        <DangerButton className="ms-3 px-6 py-2 rounded-xl font-bold" disabled={processing}>
                            ลบบัญชีอย่างถาวร
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
