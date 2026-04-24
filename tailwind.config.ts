import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#101415",
          navy: "#0A192F",
          gold: "#E9C349",
          amber: "#F2D168",
          emerald: "#4AE183",
          silver: "#C5C6CD",
          smoke: "#172235"
        }
      },
      boxShadow: {
        panel: "0 20px 40px rgba(0, 0, 0, 0.25)"
      }
    }
  },
  plugins: []
};

export default config;
