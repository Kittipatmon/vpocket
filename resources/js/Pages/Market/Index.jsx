import React, { useEffect, useRef, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const TradingViewWidget = ({ type, symbol, height = 500 }) => {
    const container = useRef();

    useEffect(() => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;

        let config = {};

        if (type === 'chart') {
            script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
            config = {
                "autosize": true,
                "symbol": symbol,
                "interval": "D",
                "timezone": "Etc/UTC",
                "theme": "light",
                "style": "1",
                "locale": "th",
                "enable_publishing": false,
                "hide_top_toolbar": false,
                "allow_symbol_change": true,
                "container_id": "tradingview_chart_container"
            };
        } else if (type === 'news') {
            script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
            config = {
                "feedMode": symbol ? "symbol" : "all_symbols",
                "symbol": symbol || "",
                "colorTheme": "light",
                "isTransparent": false,
                "displayMode": "regular",
                "width": "100%",
                "height": height,
                "locale": "th"
            };
        } else if (type === 'analysis') {
            script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
            config = {
                "interval": "1D",
                "width": "100%",
                "isTransparent": false,
                "height": height,
                "symbol": symbol,
                "showIntervalTabs": true,
                "locale": "th",
                "colorTheme": "light"
            };
        } else if (type === 'fundamental') {
            script.src = "https://s3.tradingview.com/external-embedding/embed-widget-financials.js";
            config = {
                "symbol": symbol,
                "colorTheme": "light",
                "isTransparent": false,
                "largeChartUrl": "",
                "displayMode": "regular",
                "width": "100%",
                "height": height,
                "locale": "th"
            };
        } else if (type === 'profile') {
            script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js";
            config = {
                "symbol": symbol,
                "width": "100%",
                "height": height,
                "colorTheme": "light",
                "isTransparent": false,
                "locale": "th"
            };
        }

        script.innerHTML = JSON.stringify(config);

        if (container.current) {
            container.current.innerHTML = "";
            container.current.appendChild(script);
        }
    }, [type, symbol, height]);

    return (
        <div className="tradingview-widget-container" ref={container} style={{ height: '100%', width: '100%' }}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
    );
};

export default function Index() {
    const [symbol, setSymbol] = useState("NASDAQ:NVDA");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // Google Translate Initialization
        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'th',
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
            }, 'google_translate_element');
        };

        const script = document.createElement('script');
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // Clean up if necessary
        };
    }, []);

    const popularStocks = [
        { name: "NVDA", symbol: "NASDAQ:NVDA" },
        { name: "AAPL", symbol: "NASDAQ:AAPL" },
        { name: "TSLA", symbol: "NASDAQ:TSLA" },
        { name: "MSFT", symbol: "NASDAQ:MSFT" },

    ];

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm) {
            const formatted = searchTerm.includes(":") ? searchTerm.toUpperCase() : `NASDAQ:${searchTerm.toUpperCase()}`;
            setSymbol(formatted);
        }
    };

    const [isTranslating, setIsTranslating] = useState(false);

    const handleTranslate = () => {
        setIsTranslating(true);
        const googleDiv = document.querySelector('.goog-te-combo');
        if (googleDiv) {
            googleDiv.value = 'th';
            googleDiv.dispatchEvent(new Event('change'));
            setTimeout(() => setIsTranslating(false), 2000);
        } else {
            // Try to force init if not found
            if (window.google && window.google.translate) {
                new window.google.translate.TranslateElement({
                    pageLanguage: 'en',
                    includedLanguages: 'th',
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false
                }, 'google_translate_element');
            }

            // Re-check after a short delay
            setTimeout(() => {
                const secondCheck = document.querySelector('.goog-te-combo');
                if (secondCheck) {
                    secondCheck.value = 'th';
                    secondCheck.dispatchEvent(new Event('change'));
                } else {
                    alert('ระบบแปลภาษากำลังเริ่มทำงาน... กรุณากดอีกครั้งใน 1-2 วินาทีครับ');
                }
                setIsTranslating(false);
            }, 1000);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                    <div>
                        <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-1 text-center lg:text-left">ตลาดการเงินทั่วโลก</p>
                        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight text-center lg:text-left">
                            วิเคราะห์ข้อมูลหุ้นและข่าวสาร
                        </h2>
                        {/* Hidden Google Translate Target */}
                        <div id="google_translate_element" className="hidden"></div>
                    </div>

                    <div className="w-full lg:w-auto space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <form onSubmit={handleSearch} className="relative flex-1 items-center">
                                <input
                                    type="text"
                                    placeholder="ค้นหาหุ้น (เช่น AAPL, SET:PTT)"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full sm:w-[320px] rounded-2xl border-blue-100 bg-white py-3 px-5 pr-12 font-bold text-slate-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all"
                                />
                                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 hover:scale-110 transition-transform">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                                    </svg>
                                </button>
                            </form>

                            {/* Translation Button */}
                            <button
                                onClick={handleTranslate}
                                disabled={isTranslating}
                                className={`flex items-center justify-center gap-2 bg-white border-2 border-blue-100 px-6 py-3 rounded-2xl font-bold text-blue-600 shadow-sm hover:bg-blue-50 transition-all active:scale-95 whitespace-nowrap ${isTranslating ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isTranslating ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        กำลังแปล...
                                    </>
                                ) : (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 8l6 6M4 14l6-6M2 5h12M7 2h1M22 22l-5-10-5 10M12.8 18h8.4" /></svg>
                                        แปลเป็นภาษาไทย
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                            {popularStocks.map((stock) => (
                                <button
                                    key={stock.symbol}
                                    onClick={() => setSymbol(stock.symbol)}
                                    className={`text-[11px] font-black px-3 py-1 rounded-full transition-all ${symbol === stock.symbol ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                                >
                                    {stock.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={`ตลาดหุ้น - ${symbol}`} />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <style>{`
                        /* Hide Google Translate Bar */
                        .goog-te-banner-frame.skiptranslate, .goog-te-gadget-icon { display: none !important; }
                        body { top: 0px !important; }
                        .goog-te-menu-value { display: none !important; }
                    `}</style>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* LEFT COLUMN */}
                        <div className="lg:col-span-8 space-y-8">
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-blue-900/5 border border-blue-100/50">
                                <h3 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                                    </span>
                                    ข้อมูลบริษัทและพื้นฐานธุรกิจ
                                </h3>
                                <div style={{ height: '160px' }}>
                                    <TradingViewWidget type="profile" symbol={symbol} height={160} />
                                </div>
                            </div>

                            <div className="bg-white rounded-[2.5rem] p-4 shadow-xl shadow-blue-900/5 border border-blue-100/50 overflow-hidden" style={{ height: '600px' }}>
                                <TradingViewWidget type="chart" symbol={symbol} />
                            </div>

                            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-blue-900/5 border border-blue-100/50">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                                        </span>
                                        ผลประกอบการไตรมาส (Financial Results)
                                    </h3>
                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full border border-emerald-100">
                                        LIVE DATA
                                    </span>
                                </div>
                                <div style={{ height: '500px' }}>
                                    <TradingViewWidget type="fundamental" symbol={symbol} height={450} />
                                </div>
                                <p className="mt-4 text-[11px] text-slate-400 font-medium italic">
                                    * ข้อมูลรายได้ กำไร และเงินปันผล อ้างอิงจากงบการเงินล่าสุดที่ประกาศต่อตลาดหลักทรัพย์
                                </p>
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-blue-900/5 border border-blue-100/50">
                                <h3 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
                                    </span>
                                    บทวิเคราะห์ทางเทคนิค
                                </h3>
                                <div style={{ height: '420px' }}>
                                    <TradingViewWidget type="analysis" symbol={symbol} height={380} />
                                </div>
                            </div>

                            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-blue-900/5 border border-blue-100/50 flex flex-col" style={{ height: '600px' }}>
                                <h3 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
                                    </span>
                                    ข่าวสาร {symbol.split(':')[1] || symbol}
                                </h3>
                                <div className="flex-1 overflow-hidden">
                                    <TradingViewWidget type="news" symbol={symbol} height={500} />
                                </div>
                            </div>

                            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-blue-900/5 border border-blue-100/50 flex flex-col" style={{ height: '700px' }}>
                                <h3 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                                    </span>
                                    ข่าวการเงินโลก
                                </h3>
                                <div className="flex-1 overflow-hidden">
                                    <TradingViewWidget type="news" symbol="" height={600} />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
