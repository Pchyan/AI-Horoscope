import React from 'react';
import { getZodiacInfo } from '../utils/zodiac';
import { HeartIcon, BriefcaseIcon, LifebuoyIcon, ExclamationTriangleIcon, BanknotesIcon, SparklesIcon, PaintBrushIcon } from '@heroicons/react/24/solid';

/**
 * 嘗試自動解析 Gemini 回傳的 JSON 字串
 * 若失敗則回傳 null
 */
function tryParseJson(text) {
  if (!text) return null;
  try {
    const cleaned = text.replace(/^```json|```$/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    try {
      // 若 Gemini 回傳 {"aries":{...}} 這種格式
      return JSON.parse(text);
    } catch {
      // 若是 "other": "..." 但內容還是 JSON 字串，遞迴解析
      if (typeof text === 'string' && text.includes('{') && text.includes('}')) {
        const inner = text.match(/\{[\s\S]*\}/);
        if (inner) {
          try {
            return JSON.parse(inner[0]);
          } catch {}
        }
      }
      return null;
    }
  }
}

/**
 * HoroscopeResult
 * - 顯示運勢查詢結果
 * - 分類顯示愛情、事業、健康
 * - 顯示錯誤或載入狀態
 */
const fieldMap = {
  love: { label: '愛情💖', emoji: '💖' },
  career: { label: '事業💼', emoji: '💼' },
  health: { label: '健康🩺', emoji: '🩺' },
  wealth: { label: '財運💰', emoji: '💰' },
  luckyNumber: { label: '幸運數字🎲', emoji: '🎲' },
  luckyColor: { label: '幸運色彩🎨', emoji: '🎨' },
  overall: { label: '總評🌟', emoji: '🌟' },
  advice: { label: '建議📌', emoji: '📌' },
};

// 取得今日日期（yyyy-mm-dd）
function getTodayStr() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// 將常見中文顏色及英文顏色名轉為對應 CSS 顏色碼
function parseColor(color) {
  const colorMap = {
    '草綠色': '#32CD32',
    '粉紅': '#FFC0CB',
    '天藍': '#87CEEB',
    '金色': '#FFD700',
    '紅色': '#FF0000',
    '黑色': '#000000',
    '白色': '#FFFFFF',
    '灰色': '#808080',
    '銀色': '#C0C0C0',
    '綠色': '#008000',
    '藍色': '#0000FF',
    '黃色': '#FFFF00',
    '紫色': '#800080',
    '橙色': '#FFA500',
    '棕色': '#964B00',
    '青色': '#008080',
    '粉色': '#FFB6C1',
    '褐色': '#A52A2A',
    '淺綠': '#C6F4D6',
    '淺藍': '#ADD8E6',
    '淺黃': '#FFFFE0',
    '淺紅': '#FFC5C5',
    '淺紫': '#C7B8EA',
    '淺橙': '#FFD7BE',
    '淺棕': '#F5DEB3',
    '淺青': '#B2E6CE',
    '淺粉': '#FFC0CB',
    '淺褐': '#F0E4CC',    
  };
  return colorMap[color] || color;
}

// 解析 luckyColor 欄位，取得顏色名與 CSS 色碼
function extractColorInfo(luckyColor) {
  if (!luckyColor || typeof luckyColor !== 'string') return { name: '', code: '' };
  // 支援「草綠色 (#32CD32)」或「粉紅（#FFC0CB）」等格式
  const match = luckyColor.match(/([\u4e00-\u9fa5A-Za-z]+)[\s\(（]*#?([0-9A-Fa-f]{6,8})?[\)）]?/);
  if (match) {
    return {
      name: match[1],
      code: match[2] ? `#${match[2]}` : '',
    };
  }
  return { name: luckyColor, code: '' };
}

function HoroscopeResult({ result, loading, error }) {
  if (loading) {
    return <div className="mt-6 text-center text-indigo-500 animate-pulse">載入中...</div>;
  }
  if (error) {
    return (
      <div className="mt-6 flex items-center justify-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/30 rounded p-3">
        <span className="text-lg">⚠️</span>
        <span>{error}</span>
      </div>
    );
  }
  if (!result) {
    return null;
  }

  // 若 result.other 有內容且為 JSON 字串，則解析並合併顯示
  let parsed = null;
  if (result.other) {
    parsed = tryParseJson(result.other);
  }
  let display = parsed || result;

  // 嘗試取得星座資訊
  let zodiacKey = display.zodiac || display.sign || display.zodiacSign || '';
  let zodiacInfo = zodiacKey ? getZodiacInfo(zodiacKey) : null;
  // 若 Gemini 回傳為 { aries: {...} } 這種格式
  if (!zodiacInfo && Object.keys(display).length === 1) {
    const key = Object.keys(display)[0];
    if (getZodiacInfo(key)) {
      zodiacKey = key;
      zodiacInfo = getZodiacInfo(key);
      display = display[key];
    }
  }

  // 主欄位順序
  const mainFields = [
    'love', 'career', 'health', 'wealth', 'luckyNumber', 'luckyColor', 'overall', 'advice'
  ];

  return (
    <div className="mt-6 w-full max-w-md mx-auto">
      <h2 className="text-lg md:text-xl font-bold text-indigo-700 dark:text-indigo-300 mb-2 flex items-center gap-2">
        {zodiacInfo && <span className="text-2xl md:text-3xl">{zodiacInfo.emoji}</span>}
        <span>
          {zodiacInfo ? `${zodiacInfo.zh} (${zodiacInfo.en})` : '運勢結果'}
        </span>
      </h2>
      <div className="result-block bg-white/95 dark:bg-gray-800 card-shadow rounded-xl p-5 grid gap-4 text-base md:text-lg">
        {mainFields.map((key) =>
          display[key] ? (
            <div key={key} className="flex items-center gap-3 border-b last:border-b-0 pb-2 last:pb-0">
              <span className="result-block-main-label">
                <span className="result-block-main-icon">{fieldMap[key]?.emoji}</span>
                {fieldMap[key]?.label}
              </span>
              <span className="result-block-main-value flex-1">
                {key === 'luckyColor' ? (
                  (() => {
                    const { name, code } = extractColorInfo(display[key]);
                    return (
                      <span className="inline-flex items-center gap-2">
                        <span>{name}</span>
                        <span className="inline-block w-6 h-6 rounded-full border-2 align-middle"
                          style={{ background: code || parseColor(name), borderColor: code || parseColor(name) }}
                          title={display[key]}></span>
                      </span>
                    );
                  })()
                ) : (
                  display[key]
                )}
              </span>
            </div>
          ) : null
        )}
        {/* 額外欄位自動展開 */}
        {Object.entries(display).map(([key, value]) => {
          if (mainFields.includes(key) || !value || key === 'date') return null;
          // emoji 標題對應表
          const extraFieldMap = {
            general: { label: '綜合運勢', emoji: '📋' },
            summary: { label: '總評', emoji: '🌟' },
            tip: { label: '小建議', emoji: '💡' },
            advice: { label: '建議', emoji: '📌' },
            note: { label: '備註', emoji: '📝' },
            sign: { label: '星座', emoji: '🔮' },
          };
          const map = extraFieldMap[key] || {};

          // 若 value 為物件，遞迴展開每個子欄位
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            return Object.entries(value).map(([subKey, subVal]) => (
              <div key={key + '-' + subKey} className="flex items-center gap-3 border-b last:border-b-0 pb-2 last:pb-0">
                <span className="result-block-main-label">
                  <span className="result-block-main-icon">{map.emoji || '📋'}</span>
                  {map.label ? `${map.label}（${subKey}）` : `${key}（${subKey}）`}
                </span>
                <span className="result-block-main-value flex-1">
                  {typeof subVal === 'object' ? JSON.stringify(subVal, null, 2) : subVal}
                </span>
              </div>
            ));
          }

          // 一般字串/數字欄位
          return (
            <div key={key} className="flex items-center gap-3 border-b last:border-b-0 pb-2 last:pb-0">
              <span className="result-block-main-label">
                <span className="result-block-main-icon">{map.emoji || '📋'}</span>
                {map.label || key}
              </span>
              <span className="result-block-main-value flex-1">
                {typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
              </span>
            </div>
          );
        })}
        {/* 顯示今日日期 */}
        <div className="pt-2 border-t text-xs text-gray-400 dark:text-gray-400 text-right"><b>date：</b>{getTodayStr()}</div>
      </div>
    </div>
  );
}

export default HoroscopeResult;
