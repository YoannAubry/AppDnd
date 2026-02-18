import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // MAPPING DES VARIABLES CSS
        background: "var(--bg-main)",
        surface: "var(--bg-card)",
        input: "var(--bg-input)",
        border: "var(--border-main)",
        primary: "var(--text-main)",
        muted: "var(--text-muted)",
        
        // ACCENT DYNAMIQUE
        accent: {
          DEFAULT: "var(--accent-primary)",
          hover: "var(--accent-hover)",
          foreground: "var(--accent-text)",
        }
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;