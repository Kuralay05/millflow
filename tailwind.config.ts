import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7f1",
          100: "#d9ecde",
          200: "#b5d7bf",
          300: "#88bb97",
          400: "#5c9f70",
          500: "#3b8654",
          600: "#2f6b43",
          700: "#245334",
          800: "#1b3b25",
          900: "#102616"
        },
        wheat: {
          50: "#fffaf0",
          100: "#fef1d7",
          200: "#fde3ac",
          300: "#f9d078",
          400: "#f4ba45",
          500: "#eaa11d",
          600: "#c67d12",
          700: "#9d5d11",
          800: "#7d4915",
          900: "#663d16"
        }
      },
      boxShadow: {
        card: "0 12px 28px rgba(15, 23, 42, 0.08)"
      },
      fontFamily: {
        sans: ["Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif"]
      },
      backgroundImage: {
        "page-grid":
          "linear-gradient(to right, rgba(226, 232, 240, 0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(226, 232, 240, 0.6) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
