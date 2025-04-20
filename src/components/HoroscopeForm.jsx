import React, { useState } from 'react';
import { zodiacList, getZodiacByDate, getZodiacInfo } from '../utils/zodiac';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

// 運勢區間選項
const periodOptions = [
  { label: '今日', value: 'daily' },
  { label: '本週', value: 'weekly' },
  { label: '本月', value: 'monthly' },
  { label: '今年', value: 'yearly' },
];

/**
 * HoroscopeForm
 * - 讓使用者輸入生日或選擇星座
 * - 選擇運勢區間
 * - 提交後呼叫 onSubmit(zodiacKey, period)
 */
function HoroscopeForm({ onSubmit, loading }) {
  const [birthday, setBirthday] = useState('');
  const [zodiacKey, setZodiacKey] = useState('');
  const [period, setPeriod] = useState('daily');

  // 當生日改變時，自動推算星座
  const handleBirthdayChange = (e) => {
    const date = e.target.value;
    setBirthday(date);
    if (date) {
      setZodiacKey(getZodiacByDate(date));
    } else {
      setZodiacKey('');
    }
  };

  // 提交表單
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!zodiacKey) return;
    onSubmit(zodiacKey, period);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1">
        請輸入生日或直接選擇星座：
      </label>
      <div className="flex items-center gap-2">
        <div className="relative w-full">
          <input
            type="date"
            value={birthday}
            onChange={handleBirthdayChange}
            className="form-input w-full pl-10 rounded border-gray-400 bg-gray-50 dark:bg-gray-900 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
            max={new Date().toISOString().split('T')[0]}
            disabled={loading}
            placeholder="年/月/日"
          />
          <CalendarDaysIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
      <div className="zodiac-scroll overflow-x-auto whitespace-nowrap flex flex-wrap justify-center">
        {zodiacList.map((z) => (
          <button
            type="button"
            key={z.key}
            className={`px-4 py-1.5 rounded-full border transition-all duration-150 shadow-sm whitespace-nowrap flex items-center gap-1 ${zodiacKey === z.key ? 'bg-indigo-600 text-white scale-105' : 'bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-100'} hover:bg-indigo-100 dark:hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-400 focus:outline-none inline-block mr-2`}
            onClick={() => setZodiacKey(z.key)}
            disabled={loading}
            tabIndex={0}
            aria-pressed={zodiacKey === z.key}
          >
            <span>{z.emoji}</span>
            <span>{z.zh}({z.en})</span>
          </button>
        ))}
      </div>
      <div className="flex gap-2 items-center">
        <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">運勢區間：</label>
        <select
          className="form-select rounded border-gray-400 bg-gray-50 dark:bg-gray-900 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
          value={period}
          onChange={e => setPeriod(e.target.value)}
          disabled={loading}
        >
          {periodOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="w-full mt-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 transition-all font-semibold text-lg"
        disabled={!zodiacKey || loading}
      >
        {loading ? '查詢中...' : '查詢運勢'}
      </button>
    </form>
  );
}

export default HoroscopeForm;
