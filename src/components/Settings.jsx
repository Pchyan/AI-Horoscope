import React, { useState } from 'react';

/**
 * Settings
 * - 讓使用者輸入 Gemini API 金鑰並儲存
 * - 提供引導取得金鑰的連結
 */
function Settings({ apiKey, onSave, onBack }) {
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputKey) {
      onSave(inputKey);
      setSaved(true);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-indigo-700 dark:text-indigo-300 mb-2">API 金鑰設定</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="請輸入 Gemini API 金鑰"
          value={inputKey}
          onChange={e => setInputKey(e.target.value)}
          className="w-full rounded border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          type="submit"
          className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
          disabled={!inputKey}
        >
          儲存
        </button>
      </form>
      {saved && (
        <div className="mt-2 text-green-600">已儲存！</div>
      )}
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
        <div>尚未有金鑰？<br />
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-500 underline"
          >
            點此申請 Google Gemini API 金鑰
          </a>
        </div>
      </div>
      {onBack && (
        <button
          className="mt-4 text-indigo-500 hover:underline text-sm"
          onClick={onBack}
        >
          返回
        </button>
      )}
    </div>
  );
}

export default Settings;
