module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zodiac: {
          love: '#F472B6', // pink-400
          career: '#60A5FA', // blue-400
          health: '#34D399', // green-400
        },
      },
      backgroundImage: {
        'main-gradient': 'linear-gradient(135deg, #c7d2fe 0%, #fbc2eb 100%)',
        'main-gradient-dark': 'linear-gradient(135deg, #334155 0%, #6366f1 100%)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
