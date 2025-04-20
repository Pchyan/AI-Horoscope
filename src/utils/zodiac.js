// zodiac.js
// 星座相關工具函式

// 星座中英文對照
export const zodiacList = [
  { zh: '牡羊座', en: 'Aries', key: 'aries', emoji: '♈️' },
  { zh: '金牛座', en: 'Taurus', key: 'taurus', emoji: '♉️' },
  { zh: '雙子座', en: 'Gemini', key: 'gemini', emoji: '♊️' },
  { zh: '巨蟹座', en: 'Cancer', key: 'cancer', emoji: '♋️' },
  { zh: '獅子座', en: 'Leo', key: 'leo', emoji: '♌️' },
  { zh: '處女座', en: 'Virgo', key: 'virgo', emoji: '♍️' },
  { zh: '天秤座', en: 'Libra', key: 'libra', emoji: '♎️' },
  { zh: '天蠍座', en: 'Scorpio', key: 'scorpio', emoji: '♏️' },
  { zh: '射手座', en: 'Sagittarius', key: 'sagittarius', emoji: '♐️' },
  { zh: '魔羯座', en: 'Capricorn', key: 'capricorn', emoji: '♑️' },
  { zh: '水瓶座', en: 'Aquarius', key: 'aquarius', emoji: '♒️' },
  { zh: '雙魚座', en: 'Pisces', key: 'pisces', emoji: '♓️' },
];

// 只取中文名陣列（for 舊元件相容）
export const zodiacZhList = zodiacList.map(z => z.zh);

// 輸入 yyyy-mm-dd 生日字串，回傳星座 key
export function getZodiacByDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  // 星座日期範圍
  const zodiacRanges = [
    [3, 21, 4, 19], // 牡羊座
    [4, 20, 5, 20], // 金牛座
    [5, 21, 6, 20], // 雙子座
    [6, 21, 7, 22], // 巨蟹座
    [7, 23, 8, 22], // 獅子座
    [8, 23, 9, 22], // 處女座
    [9, 23, 10, 22], // 天秤座
    [10, 23, 11, 21], // 天蠍座
    [11, 22, 12, 21], // 射手座
    [12, 22, 1, 19], // 魔羯座
    [1, 20, 2, 18], // 水瓶座
    [2, 19, 3, 20], // 雙魚座
  ];
  for (let i = 0; i < zodiacRanges.length; i++) {
    const [startM, startD, endM, endD] = zodiacRanges[i];
    if (
      (month === startM && day >= startD) ||
      (month === endM && day <= endD)
    ) {
      return zodiacList[i].key;
    }
  }
  return '';
}

// 由 key 取得星座完整資訊
export function getZodiacInfo(key) {
  return zodiacList.find(z => z.key === key);
}
