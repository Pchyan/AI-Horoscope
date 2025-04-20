# AI Horoscope 星座運勢占卜

## 介紹
這是一個以 React.js + Tailwind CSS 製作的星座運勢占卜網頁，支援 Google Gemini API 查詢每日運勢。

## 主要功能
- 設定頁：輸入與儲存 Gemini API 金鑰，並引導取得金鑰
- 星座選擇或生日輸入（自動推算星座）
- 呼叫 Gemini API 取得今日運勢（愛情、事業、健康）
- 響應式美觀 UI，支援手機與桌面
- 載入狀態與錯誤處理

## 安裝與啟動
1. 安裝依賴：
   ```bash
   npm install
   ```
2. 啟動開發伺服器：
   ```bash
   npm run dev
   ```
3. 開啟瀏覽器訪問 `http://localhost:5173`

## 如何取得 Gemini API 金鑰？
- 前往 [Google AI Studio](https://aistudio.google.com/app/apikey) 申請金鑰
- 將金鑰填入設定頁面即可

## 程式架構
- `src/components/`：React 元件
- `src/utils/`：星座與 API 工具
- `App.jsx`：主頁邏輯

## API 呼叫範例
參見 `src/utils/geminiApi.js`，已提供完整 fetch 呼叫與 prompt 設計。

---

如有問題歡迎提問！
