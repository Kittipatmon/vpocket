import React, { useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const TradingViewWidget = ({ type, symbol = "NASDAQ:NVDA", height = 500 }) => {
    const container = useRef();

    useEffect(() => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;

        if (type === 'chart') {
            script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
            script.innerHTML = JSON.stringify({
                "autosize": true,
                "symbol": symbol,
                "interval": "D",
                "timezone": "Etc/UTC",
                "theme": "light",
                "style": "1",
                "locale": "en",
                "enable_publishing": false,
                "hide_top_toolbar": false,
                "allow_symbol_change": true,
                "container_id": "tradingview_chart_container"
            });
        } else if (type === 'news') {
            script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
            script.innerHTML = JSON.stringify({
                "feedMode": "all_symbols",
                "colorTheme": "light",
                "isTransparent": false,
                "displayMode": "regular",
                "width": "100%",
                "height": height,
                "locale": "en"
            });
        } else if (type === 'analysis') {
            script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
            script.innerHTML = JSON.stringify({
                "interval": "1D",
                "width": "100%",
                "isTransparent": false,
                "height": height,
                "symbol": symbol,
                "showIntervalTabs": true,
                "locale": "en",
                "colorTheme": "light"
            });
        }

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
    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-1">ตลาดการเงินทั่วโลก</p>
                        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                            ข้อมูลหุ้นและข่าวสารเรียลไทม์
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="ตลาดหุ้น" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Main Chart Section */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white rounded-[2.5rem] p-4 shadow-xl shadow-blue-900/5 border border-blue-100/50 overflow-hidden" style={{ height: '650px' }}>
                                <TradingViewWidget type="chart" symbol="NASDAQ:NVDA" />
                            </div>

                            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-blue-900/5 border border-blue-100/50">
                                <h3 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm">📊</span>
                                    การวิเคราะห์ทางเทคนิค
                                </h3>
                                <div style={{ height: '450px' }}>
                                    <TradingViewWidget type="analysis" symbol="NASDAQ:NVDA" height={400} />
                                </div>
                            </div>
                        </div>

                        {/* Side Column: News */}
                        <div className="space-y-8">
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-blue-900/5 border border-blue-100/50 flex flex-col" style={{ height: '1130px' }}>
                                <h3 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-sm">📰</span>
                                    ข่าวสารล่าสุด
                                </h3>
                                <div className="flex-1 overflow-hidden">
                                    <TradingViewWidget type="news" height={1000} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
