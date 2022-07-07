/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.tsx", "./components/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        white: "#fffffe",
        dark: "#094067",
        "sky-blue": "#3da9fc",
        "strong-pink": "#ef4565",
        gray: "#90b4ce",
      },
    },
  },
  plugins: [],
};
