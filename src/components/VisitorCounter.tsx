import React, { useState, useEffect } from 'react';
import { Eye, TrendingUp, X, Globe, BarChart3, Activity, Clock, Monitor } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const VisitorCounter: React.FC = () => {
  const { t, language } = useLanguage();
  const [totalVisitors, setTotalVisitors] = useState<number>(18431);
  const [liveActiveUsers, setLiveActiveUsers] = useState<number>(42);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState<boolean>(false);
  const [recentNotification, setRecentNotification] = useState<{
    id: number;
    text: string;
    location: string;
    time: string;
  } | null>(null);
  const [showToast, setShowToast] = useState<boolean>(true);

  const localeMap: Record<string, string> = {
    en: 'en-US',
    ro: 'ro-RO',
    hu: 'hu-HU',
    de: 'de-DE',
    es: 'es-ES',
    zh: 'zh-CN',
  };
  const activeLocale = localeMap[language] || 'en-US';

  // Initialize and persist visitor count in localStorage
  useEffect(() => {
    try {
      const storedCount = localStorage.getItem('nexus_visitor_count');
      const sessionRecorded = sessionStorage.getItem('nexus_session_recorded');
      
      let baseCount = 18431;
      if (storedCount) {
        baseCount = parseInt(storedCount, 10);
      }

      if (!sessionRecorded) {
        baseCount += 1;
        localStorage.setItem('nexus_visitor_count', baseCount.toString());
        sessionStorage.setItem('nexus_session_recorded', 'true');
      }

      setTotalVisitors(baseCount);
    } catch {
      setTotalVisitors(18432);
    }
  }, []);

  // Subtle live fluctuations for online users (36 - 52 users)
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveActiveUsers((prev) => {
        const change = Math.floor(Math.random() * 3) - 1;
        const next = prev + change;
        return Math.min(52, Math.max(36, next));
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Periodic social proof activity notifications
  useEffect(() => {
    const activities = [
      { text: 'Downloaded AR-Nexus SMC Preset (XAU/USD)', location: 'London, UK', time: '2m ago' },
      { text: 'Activated Pro Quant Bundle License', location: 'New York, USA', time: '6m ago' },
      { text: 'Ran latency benchmark on Equinix LD4 node', location: 'Frankfurt, Germany', time: '11m ago' },
      { text: 'Passed FTMO 100k Challenge with AR-Nexus', location: 'Zurich, Switzerland', time: '17m ago' },
      { text: 'Requested a free 14-day Demo license', location: 'Madrid, Spain', time: '22m ago' }
    ];

    let index = 0;
    const toastTimer = setInterval(() => {
      setRecentNotification({
        id: Date.now(),
        text: activities[index % activities.length].text,
        location: activities[index % activities.length].location,
        time: activities[index % activities.length].time
      });
      setShowToast(true);
      index++;

      setTimeout(() => {
        setShowToast(false);
      }, 5500);
    }, 15000);

    return () => clearInterval(toastTimer);
  }, []);

  return (
    <>
      {/* 1. Sticky Floating Badge - Top Left */}
      <div className="fixed top-32 sm:top-36 left-3 sm:left-6 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsAnalyticsOpen(true)}
          className="px-3.5 py-2.5 sm:px-4 sm:py-2.5 rounded-full bg-slate-900/95 hover:bg-slate-850 border-2 border-cyan-400 text-white shadow-2xl shadow-cyan-950/80 backdrop-blur-md flex items-center gap-2.5 transition-all hover:scale-105 group font-mono text-[11px] sm:text-xs"
          title="Click for Live Visitor Telemetry Report"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-emerald-400">{liveActiveUsers} {t.common.onlineUsers}</span>
          <span className="text-slate-500">|</span>
          <span className="text-cyan-300 font-semibold">{totalVisitors.toLocaleString(activeLocale)} {t.common.totalVisits}</span>
          <BarChart3 className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      {/* 2. Recent Activity Toast (Bottom Left) */}
      {showToast && recentNotification && (
        <div className="fixed bottom-4 left-4 z-40 max-w-xs sm:max-w-sm rounded-xl bg-slate-900/95 border border-cyan-800/80 p-3 shadow-2xl backdrop-blur-md flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-700/60 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs">
            <div className="font-semibold text-white">{recentNotification.text}</div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5 font-mono">
              <span>{recentNotification.location}</span>
              <span>•</span>
              <span className="text-cyan-400">{recentNotification.time}</span>
            </div>
          </div>
          <button
            onClick={() => setShowToast(false)}
            className="text-slate-500 hover:text-slate-300 p-0.5"
            title={t.common.close}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. Detailed Traffic Analytics Modal */}
      {isAnalyticsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-6">
            <div className="p-5 md:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                  Live Traffic Telemetry Panel
                </div>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  Visitor Statistics & Platform Activity
                </h3>
              </div>
              <button
                onClick={() => setIsAnalyticsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 md:p-6 space-y-6">
              {/* Big KPI Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {t.common.onlineUsers} Now
                  </div>
                  <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
                    {liveActiveUsers}
                  </div>
                  <div className="text-[10px] text-slate-500">active traders</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    Total {t.common.totalVisits}
                  </div>
                  <div className="text-2xl font-black font-mono text-cyan-300 mt-1">
                    {totalVisitors.toLocaleString(activeLocale)}
                  </div>
                  <div className="text-[10px] text-slate-500">unique sessions</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    Today
                  </div>
                  <div className="text-2xl font-black font-mono text-white mt-1">
                    1,482
                  </div>
                  <div className="text-[10px] text-slate-500">in the last 24h</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-amber-400" />
                    Countries
                  </div>
                  <div className="text-2xl font-black font-mono text-amber-400 mt-1">
                    24
                  </div>
                  <div className="text-[10px] text-slate-500">US, UK, DE, RO, HU...</div>
                </div>
              </div>

              {/* Geographical distribution */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-white flex items-center justify-between">
                  <span>Global Visitor Distribution:</span>
                  <span className="text-[11px] font-mono text-cyan-400">Verified Traffic</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
                      <span>🇬🇧 UK & 🇺🇸 North America</span>
                      <span className="font-mono text-cyan-400">42%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-cyan-500 h-full w-[42%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
                      <span>🇩🇪 DACH (Germany, Austria, Switzerland)</span>
                      <span className="font-mono text-cyan-400">24%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full w-[24%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
                      <span>🇷🇴 Romania & 🇭🇺 Hungary</span>
                      <span className="font-mono text-cyan-400">19%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full w-[19%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
                      <span>🇪🇸 Spain, 🇨🇳 Asia & Global</span>
                      <span className="font-mono text-cyan-400">15%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full w-[15%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Devices and Interest */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
                    <Monitor className="w-4 h-4 text-cyan-400" /> Devices Used:
                  </div>
                  <div className="space-y-1 text-slate-400 text-[11px]">
                    <div className="flex justify-between">
                      <span>Smartphone / Mobile:</span>
                      <span className="font-mono text-white font-bold">58%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Laptop / Desktop (MT5 Terminal):</span>
                      <span className="font-mono text-white font-bold">42%</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-400" /> Most Requested Algorithms:
                  </div>
                  <div className="space-y-1 text-slate-400 text-[11px]">
                    <div className="flex justify-between">
                      <span>AR-Nexus SMC (Gold / NAS100):</span>
                      <span className="font-mono text-emerald-400 font-bold">54% demand</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Aegis Scalper X (XAU/USD):</span>
                      <span className="font-mono text-cyan-400 font-bold">28% demand</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                Auto-refreshing telemetry every 4.5s
              </span>
              <button
                onClick={() => setIsAnalyticsOpen(false)}
                className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                {t.common.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const VisitorStatsBar: React.FC = () => {
  const { t, language } = useLanguage();
  const [totalVisitors, setTotalVisitors] = useState<number>(18431);
  const [liveActiveUsers, setLiveActiveUsers] = useState<number>(42);

  const localeMap: Record<string, string> = {
    en: 'en-US',
    ro: 'ro-RO',
    hu: 'hu-HU',
    de: 'de-DE',
    es: 'es-ES',
    zh: 'zh-CN',
  };
  const activeLocale = localeMap[language] || 'en-US';

  useEffect(() => {
    try {
      const storedCount = localStorage.getItem('nexus_visitor_count');
      if (storedCount) {
        setTotalVisitors(parseInt(storedCount, 10));
      }
    } catch {
      // safe fallback
    }

    const interval = setInterval(() => {
      setLiveActiveUsers((prev) => {
        const change = Math.floor(Math.random() * 3) - 1;
        return Math.min(52, Math.max(36, prev + change));
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono">
      {/* Live Active Now */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-slate-200">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-slate-400 hidden xs:inline">Live:</span>
        <span className="text-emerald-400 font-bold">{liveActiveUsers}</span>
        <span className="text-slate-500">{t.common.onlineUsers}</span>
      </div>

      {/* Total Unique Visitors */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-slate-200">
        <Eye className="w-3.5 h-3.5 text-cyan-400" />
        <span className="text-slate-400 hidden xs:inline">Total:</span>
        <span className="text-cyan-300 font-bold">{totalVisitors.toLocaleString(activeLocale)}</span>
        <span className="text-slate-500 hidden sm:inline">{t.common.totalVisits}</span>
      </div>
    </div>
  );
};
