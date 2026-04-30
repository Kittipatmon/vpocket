import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Welcome({ auth }) {
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['home', 'features'];
            const scrollPosition = window.scrollY + 100;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <Head title="ยินดีต้อนรับสู่ Vpocket" />
            <div className="font-sans antialiased text-blue-900 bg-white overflow-x-hidden selection:bg-blue-500 selection:text-white">
                {/* NAV */}
                <nav className="fixed top-8 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl bg-white/75 backdrop-blur-2xl border border-white/50 px-8 py-4 rounded-[2rem] flex justify-between items-center z-[1000] shadow-sm animate-in fade-in slide-in-from-top-10 duration-700">
                    <div className="flex items-center gap-3 text-2xl font-extrabold text-blue-600 tracking-tight">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                            </svg>
                        </div>
                        <span>VPOCKET</span>
                    </div>

                    <div className="hidden md:flex gap-4 items-center list-none">
                        <a
                            href="#home"
                            className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 ${activeSection === 'home' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-slate-700 hover:text-blue-600'}`}
                        >
                            หน้าแรก
                        </a>
                        <a
                            href="#features"
                            className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 ${activeSection === 'features' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-slate-700 hover:text-blue-600'}`}
                        >
                            ฟีเจอร์
                        </a>
                    </div>

                    <div className="flex items-center">
                        {auth.user ? (
                            <Link href={route('dashboard')} className="bg-blue-600 text-white px-6 py-3 rounded-[1.25rem] font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
                                แดชบอร์ด
                            </Link>
                        ) : (
                            <Link href={route('login')} className="bg-blue-600 text-white px-6 py-3 rounded-[1.25rem] font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
                                เข้าสู่ระบบ
                            </Link>
                        )}
                    </div>
                </nav>

                {/* HERO */}
                <section id="home" className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 px-8 lg:px-16 pt-32 pb-16 overflow-hidden">
                    {/* Background Circles */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute -top-48 -right-24 w-[700px] h-[700px] bg-blue-200/35 rounded-full blur-[100px] animate-pulse"></div>
                        <div className="absolute -bottom-24 -left-12 w-[400px] h-[400px] bg-blue-300/35 rounded-full blur-[80px] animate-pulse"></div>
                    </div>

                    <div className="relative flex flex-col lg:flex-row items-center lg:justify-between gap-16 max-w-[1400px] mx-auto z-10 px-4 w-full">
                        <div className="flex-1 max-w-2xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
                            <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-600 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-600/20 mb-6">
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
                                เครื่องมือจัดการการเงินอัจฉริยะ
                            </div>
                            <h1 className="text-4xl lg:text-7xl font-extrabold text-blue-900 leading-[1.1] tracking-tight mb-8 mt-5">
                                จัดการการเงิน <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">ให้เป็นเรื่องง่าย</span>
                            </h1>
                            <p className="text-xl text-slate-500 leading-relaxed mb-12 max-w-md font-medium">
                                ติดตามทุกการใช้จ่ายของคุณด้วยดีไซน์ที่ทันสมัย
                                Vpocket ช่วยให้การจัดการเงินเป็นเรื่องสนุกและง่ายขึ้น
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href={auth.user ? route('dashboard') : route('register')}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/35 hover:-translate-y-1 transition-all"
                                >
                                    เริ่มใช้งานฟรี
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </Link>
                                <a href="#features" className="inline-flex items-center gap-2 bg-white text-blue-600 border-2 border-blue-100 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all">
                                    ดูฟีเจอร์
                                </a>
                            </div>

                            <div className="flex gap-12 mt-12">
                                <div>
                                    <div className="text-3xl font-bold text-blue-600">5k+</div>
                                    <div className="text-sm text-slate-400 font-medium">ผู้ใช้งาน</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-blue-600">99%</div>
                                    <div className="text-sm text-slate-400 font-medium">ความแม่นยำ</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-blue-600">&lt; 10วิ</div>
                                    <div className="text-sm text-slate-400 font-medium">บันทึกไว</div>
                                </div>
                            </div>
                        </div>

                        {/* Phone Mockup Container */}
                        <div className="flex-1 flex justify-center lg:justify-end animate-in zoom-in fade-in duration-1000 delay-300 mt-10">
                            <div className="relative">
                                {/* Floating Badges */}
                                <div className="absolute top-20 -right-12 bg-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 z-30 animate-float">
                                    <div className="w-8 h-8 bg-green-100 text-green-600 flex items-center justify-center rounded-lg font-bold">✓</div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-800 whitespace-nowrap">บันทึกรายการแล้ว</div>
                                        <div className="text-[10px] text-slate-400 font-medium">กาแฟ • 60 บาท</div>
                                    </div>
                                </div>

                                <div className="absolute bottom-32 -left-12 bg-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 z-30 animate-float-reverse">
                                    <div className="w-8 h-8 bg-blue-100 text-blue-600 flex items-center justify-center rounded-lg font-bold">⚡</div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-800 whitespace-nowrap">สแกนอัตโนมัติ</div>
                                        <div className="text-[10px] text-slate-400 font-medium">สำเร็จ 95%</div>
                                    </div>
                                </div>

                                <div className="w-[300px] h-[600px] bg-slate-900 rounded-[3rem] p-4 shadow-2xl border border-white/20 relative animate-float z-10">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-slate-900 rounded-b-2xl z-20"></div>
                                    <div className="w-full h-full bg-blue-50 rounded-[2.5rem] overflow-hidden flex flex-col">
                                    <div className="pt-10 px-6 flex justify-between items-center">
                                        <div className="text-lg font-extrabold text-blue-700 tracking-tight">VPOCKET</div>
                                        <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center font-bold text-blue-700 text-xs">JD</div>
                                    </div>

                                    <div className="mt-6 mx-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-6 text-white shadow-xl">
                                        <div className="text-[10px] opacity-75 font-bold mb-1 uppercase tracking-widest">ยอดเงินคงเหลือ</div>
                                        <div className="text-3xl font-extrabold mb-2 tracking-tighter">฿ 12,450.00</div>
                                        <div className="h-[1px] bg-white/20 my-4"></div>
                                        <div className="flex justify-between items-center text-[10px] font-bold">
                                            <span>ค่าใช้จ่ายเดือนนี้</span>
                                            <span className="bg-white/20 px-2 py-0.5 rounded-full">↑ 5.2%</span>
                                        </div>
                                    </div>

                                    <div className="px-6 pt-8 pb-4 text-[10px] font-black text-blue-800 uppercase tracking-widest">รายการล่าสุด</div>
                                    <div className="flex-1 overflow-y-auto px-4 space-y-3">
                                        {[
                                            { icon: '🍜', title: 'ราเมงมื้อเที่ยง', date: 'อาหารและเครื่องดื่ม', amount: '- 120' },
                                            { icon: '🚗', title: 'ปั๊มน้ำมัน', date: 'การเดินทาง', amount: '- 800' },
                                            { icon: '🏠', title: 'เงินเดือน', date: 'รายได้', amount: '+ 35,000', color: 'text-green-600' }
                                        ].map((item, i) => (
                                            <div key={i} className="bg-white p-3 rounded-2xl flex items-center gap-3 shadow-sm border border-blue-100">
                                                <div className="w-10 h-10 bg-blue-50 flex items-center justify-center text-xl rounded-xl">{item.icon}</div>
                                                <div className="flex-1">
                                                    <div className="text-xs font-bold text-slate-800">{item.title}</div>
                                                    <div className="text-[10px] text-slate-400 font-medium">{item.date}</div>
                                                </div>
                                                <div className={`text-xs font-black ${item.color || 'text-slate-800'}`}>{item.amount}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="p-4">
                                        <div className="bg-blue-600 text-white p-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold shadow-lg">
                                            <span>+</span> เพิ่มรายการใหม่
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

                {/* FEATURES */}
                <section id="features" className="py-24 px-8 lg:px-16 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">ทำไมต้อง Vpocket?</div>
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">ทุกสิ่งที่คุณต้องการ <br /> รวมอยู่ในที่เดียว</h2>
                        <p className="text-slate-500 max-w-xl mb-16 leading-relaxed font-medium">ออกแบบมาเพื่อชีวิตยุคใหม่ ติดตาม แบ่งจ่าย และวิเคราะห์การเงินของคุณได้โดยไม่ต้องใช้ตารางคำนวณที่ยุ่งยาก</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { icon: '📱', title: 'Mobile First', desc: 'จัดการกระเป๋าเงินของคุณได้ทุกที่ ไม่ต้องติดตั้งแอป แค่เปิดเบราว์เซอร์' },
                                { icon: '📸', title: 'สแกนอัตโนมัติ', desc: 'สแกนสลิปของคุณ แล้วให้ AI จัดการบันทึกข้อมูลให้คุณเอง' },
                                { icon: '📊', title: 'วิเคราะห์ฉลาด', desc: 'รับรายงานที่ชัดเจนและข้อมูลเชิงลึกว่าเงินของคุณไปไหนในทุกเดือน' },
                                { icon: '🔒', title: 'ปลอดภัยบนคลาวด์', desc: 'ข้อมูลของคุณถูกเข้ารหัสและสำรองข้อมูลอัตโนมัติบนคลาวด์' }
                            ].map((feature, i) => (
                                <div key={i} className="p-8 bg-blue-50/50 rounded-3xl border border-blue-100 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-300">
                                    <div className="text-3xl mb-6">{feature.icon}</div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-24 px-8 lg:px-16 bg-blue-600 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
                    </div>
                    <div className="relative z-10 max-w-4xl mx-auto text-center">
                        <div className="inline-block bg-white/20 text-white px-4 py-1.5 rounded-full text-xs font-bold border border-white/30 mb-8 uppercase tracking-widest">พร้อมเริ่มต้นหรือยัง?</div>
                        <h2 className="text-4xl lg:text-6xl font-extrabold text-white mb-8 leading-tight tracking-tight">ร่วมเป็นส่วนหนึ่งกับผู้ใช้งาน <br /> ที่จัดการเงินอย่างชาญฉลาด</h2>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href={route('register')} className="bg-white text-blue-600 px-10 py-5 rounded-2xl font-black text-lg shadow-xl hover:-translate-y-1 transition-all">
                                เริ่มต้นใช้งานฟรี
                            </Link>
                            <Link href={route('login')} className="bg-blue-700 text-white border-2 border-white/20 px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-800 transition-all">
                                เข้าสู่ระบบ
                            </Link>
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="py-12 px-8 lg:px-16 bg-slate-900 text-white">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="text-2xl font-black tracking-tight">VPOCKET</div>
                        <div className="text-slate-500 text-sm font-medium">© {new Date().getFullYear()} Vpocket Finance Tracker. สงวนลิขสิทธิ์.</div>
                    </div>
                </footer>
            </div>
        </>
    );
}
