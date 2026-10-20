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
        background: "var(--bg-primary)",
        "background-secondary": "var(--bg-secondary)",
        "background-tertiary": "var(--bg-tertiary)",
        foreground: "var(--fg-primary)",
        "foreground-secondary": "var(--fg-secondary)",
        "foreground-muted": "var(--fg-muted)",
        border: "var(--border-hairline)",
        "border-strong": "var(--border-strong)",
        accent: {
          DEFAULT: "var(--accent-primary)",
          contrast: "var(--accent-contrast)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      aspectRatio: {
        "16/9": "16 / 9",
        "4/3": "4 / 3",
        "1/1": "1 / 1",
      },
    },
  },
  plugins: [],
};

export default config;
