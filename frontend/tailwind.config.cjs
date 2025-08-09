/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Covers all source files
    "./pages/**/*.{js,jsx,ts,tsx}", // Explicitly include pages
    "./components/**/*.{js,jsx,ts,tsx}", // Explicitly include components
    "./node_modules/daisyui/dist/**/*.js", // Ensure DaisyUI components are scanned
  ],
  theme: {
    extend: {
      colors: {
        customGreen: {
          100: "rgb(34 197 94 / 0.1)",
          200: "rgb(34 197 94 / 0.2)",
          300: "rgb(34 197 94 / 0.3)",
          400: "rgb(34 197 94 / 0.4)",
          500: "rgb(34 197 94 / 0.5)",
          600: "rgb(34 197 94 / 0.6)",
          700: "rgb(34 197 94 / 0.7)",
          800: "rgb(34 197 94 / 0.8)",
          DEFAULT: "rgb(34 197 94)",
        },
        customGray: {
          800: "rgb(17 24 39)",
          900: "rgb(31 41 55)",
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 0.5s ease-out",
        "shimmer": "shimmer 2s infinite",
        "loading-1": "loading1 0.6s infinite",
        "loading-2": "loading2 0.6s infinite",
        "loading-3": "loading3 0.6s infinite",
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: 0, transform: "translateY(20px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200px 0" },
          "100%": { backgroundPosition: "calc(200px + 100%) 0" },
        },
        loading1: {
          "0%": { transform: "scale(0)" },
          "100%": { transform: "scale(1)" },
        },
        loading3: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(0)" },
        },
        loading2: {
          "0%": { transform: "translate(0, 0)" },
          "100%": { transform: "translate(24px, 0)" },
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    // Reduce themes to only those actually used to cut unused CSS
    themes: ["black"],
  },
};