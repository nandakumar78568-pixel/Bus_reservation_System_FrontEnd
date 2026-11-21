/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        drive: {
          "0%": { transform: "translateX(100vw)" },
          "100%": { transform: "translateX(-160px)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blob: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(30px,-20px) scale(1.15)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        drive: "drive 16s linear infinite",
        "fade-up": "fadeUp 0.7s ease-out both",
        blob: "blob 9s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};