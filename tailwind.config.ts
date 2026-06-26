import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        paper: "#f6f8fb"
      },
      boxShadow: {
        soft: "0 18px 55px rgba(23, 32, 51, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
