/** @type {import('tailwindcss').Config} */
module.exports = {
  // Añadimos "./app/**/*.{js,jsx,ts,tsx}" para que detecte tus pantallas
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", 
    "./components/**/*.{js,jsx,ts,tsx}",
    "./App.{js,jsx,ts,tsx}" 
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        red: {
          100: "#D33B0D"
        },
        green: {
          100: "#084137"
        },
      }

    },
  },
  plugins: [],
}