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

  // 週期為 weekly 時，自動補上正確 week 區間（週一～週日）
  let weekRange = '';
  if (period === 'weekly') {
    const now = new Date();
    const day = now.getDay(); // 0: Sunday, 1: Monday, ...
    // 計算本週一
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((day + 6) % 7));
    // 計算本週日
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const toISO = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    weekRange = `${toISO(monday)} - ${toISO(sunday)}`;
  }

  // 週期為 monthly/yearly 時，自動補上正確區間
  let monthRange = '';
  if (period === 'monthly') {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const first = `${y}-${String(m).padStart(2,'0')}-01`;
    // 下個月1號-1天 = 本月最後一天
    const lastDate = new Date(y, m, 0).getDate();
    const last = `${y}-${String(m).padStart(2,'0')}-${String(lastDate).padStart(2,'0')}`;
    monthRange = `${first} - ${last}`;
  }
  let yearRange = '';
  if (period === 'yearly') {
    const y = (new Date()).getFullYear();
    yearRange = `${y}-01-01 - ${y}-12-31`;
  }

  // prompt 設計：要求以 JSON 格式回傳多面向運勢，且必須用台灣繁體中文
  const prompt = `請以 JSON 格式回覆${zodiac}(${zodiac})${periodText}的星座運勢，內容全部必須使用台灣繁體中文，且包含：
- 愛情（love）
- 事業（career）
- 健康（health）
- 財運（wealth）
- 幸運數字（luckyNumber）
- 幸運色彩（luckyColor）：請同時提供色名與 CSS 顏色碼，例如「草綠色 (#32CD32)」或「粉紅（#FFC0CB）」
${period === 'weekly' ? `- week: 期間請回覆為 ${weekRange}` : ''}
${period === 'monthly' ? `- month: 期間請回覆為 ${monthRange}` : ''}
${period === 'yearly' ? `- year: 期間請回覆為 ${yearRange}` : ''}
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
