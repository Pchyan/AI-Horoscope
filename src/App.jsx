import React, { useState } from 'react';
import HoroscopeForm from './components/HoroscopeForm';
import HoroscopeResult from './components/HoroscopeResult';
import Settings from './components/Settings';
import { Toaster, toast } from 'react-hot-toast';

function App() {
  // 狀態：API 金鑰、顯示頁面、運勢結果
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [page, setPage] = useState(apiKey ? 'main' : 'settings');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pushEnabled, setPushEnabled] = useState(false);
  const [lastQuery, setLastQuery] = useState({ zodiac: '', period: 'daily' });

  // 儲存 API 金鑰
  const handleSaveApiKey = (key) => {
    localStorage.setItem('gemini_api_key', key);
    setApiKey(key);
    setPage('main');
    toast.success('API 金鑰已儲存！');
  };

  // 查詢運勢
  const handleFetchHoroscope = async (zodiac, period) => {
    setLoading(true);
    setError('');
    setResult(null);
    setLastQuery({ zodiac, period });
    try {
      const { fetchHoroscope } = await import('./utils/geminiApi');
      const data = await fetchHoroscope(apiKey, zodiac, period);
      setResult(data);
      toast.success('運勢查詢成功！');
    } catch (e) {
      setError(e.message || '取得運勢失敗');
      toast.error(e.message || '取得運勢失敗');
    } finally {
      setLoading(false);
    }
  };

  // 個人化推播提醒（示範：每日提醒）
  const handleEnablePush = () => {
    setPushEnabled(true);
    toast('已啟用每日運勢提醒（僅示範，需進一步串接瀏覽器通知/PWA）');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-main-gradient dark:bg-main-gradient-dark transition-all duration-300">
      <Toaster position="top-center" toastOptions={{ duration: 2500 }} />
      <div className="w-full max-w-md p-6 bg-white/80 dark:bg-gray-800/80 rounded-2xl card-shadow mt-8 mb-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-700 dark:text-white tracking-tight">AI Horoscope 星座運勢占卜</h1>
          <button
            className="text-sm text-indigo-500 hover:underline px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onClick={() => setPage('settings')}
          >
            設定
          </button>
        </header>
        {page === 'settings' ? (
          <Settings
            apiKey={apiKey}
            onSave={handleSaveApiKey}
            onBack={() => setPage(apiKey ? 'main' : 'settings')}
          />
        ) : (
          <>
            <HoroscopeForm onSubmit={handleFetchHoroscope} loading={loading} />
            <div className="flex items-center gap-2 mt-4 mb-2">
              <input
                id="push-reminder"
                type="checkbox"
                checked={pushEnabled}
                onChange={handleEnablePush}
                className="form-checkbox rounded text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="push-reminder" className="text-sm text-gray-700 dark:text-gray-200 cursor-pointer">
                啟用每日運勢提醒（需瀏覽器支援）
              </label>
            </div>
            <HoroscopeResult result={result} loading={loading} error={error} />
          </>
        )}
      </div>
      <footer className="text-xs text-gray-400 mt-auto mb-2 select-none"> 2025 AI Horoscope</footer>
    </div>
  );
}

export default App;
