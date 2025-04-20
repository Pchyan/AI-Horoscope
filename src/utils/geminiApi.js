// geminiApi.js
// Google Gemini API 呼叫工具

/**
 * 呼叫 Gemini API，取得星座運勢
 * @param {string} apiKey - 使用者 API 金鑰
 * @param {string} zodiac - 星座名稱
 * @param {string} period - 運勢區間 daily/weekly/monthly/yearly
 * @returns {Promise<{love:string,career:string,health:string,wealth:string, luckyNumber?:string, luckyColor?:string, other?:string}>}
 */
export async function fetchHoroscope(apiKey, zodiac, period = 'daily') {
  if (!apiKey) throw new Error('缺少 API 金鑰');
  if (!zodiac) throw new Error('未指定星座');

  // Gemini API endpoint
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey;

  // period 中文
  const periodMap = {
    daily: '今日',
    weekly: '本週',
    monthly: '本月',
    yearly: '今年',
  };
  const periodText = periodMap[period] || '今日';

  // prompt 設計：要求以 JSON 格式回傳多面向運勢
  const prompt = `請以 JSON 格式回覆${zodiac}(${zodiac})${periodText}的星座運勢，內容包含：
- 愛情（love）
- 事業（career）
- 健康（health）
- 財運（wealth）
- 幸運數字（luckyNumber）
- 幸運色彩（luckyColor）：請同時提供色名與 CSS 顏色碼，例如「草綠色 (#32CD32)」或「粉紅（#FFC0CB）」
其餘欄位可自動擴充。
請直接回傳乾淨的 JSON，不要有多餘說明。`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error('API 請求失敗: ' + res.status);
  }
  const data = await res.json();
  // 解析 Gemini 回傳內容
  let text = '';
  try {
    text = data.candidates[0].content.parts[0].text;
    // 嘗試解析 JSON
    const json = JSON.parse(text.replace(/^```json|```$/g, '').trim());
    return json;
  } catch (e) {
    // 若格式不正確，直接回傳原始文字
    return { love: '', career: '', health: '', wealth: '', luckyNumber: '', luckyColor: '', other: text };
  }
}
