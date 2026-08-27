/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "inverse-on-surface": "rgb(var(--inverse-on-surface) / <alpha-value>)",
        "surface-variant": "rgb(var(--surface-variant) / <alpha-value>)",
        "primary-container": "rgb(var(--primary-container) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        tertiary: "rgb(var(--tertiary) / <alpha-value>)",
        "tertiary-fixed": "rgb(var(--tertiary-fixed) / <alpha-value>)",
        "surface-container": "rgb(var(--surface-container) / <alpha-value>)",
        "outline-variant": "rgb(var(--outline-variant) / <alpha-value>)",
        "surface-container-highest":
          "rgb(var(--surface-container-highest) / <alpha-value>)",
        "on-primary-fixed": "rgb(var(--on-primary-fixed) / <alpha-value>)",
        "secondary-fixed-dim":
          "rgb(var(--secondary-fixed-dim) / <alpha-value>)",
        "tertiary-fixed-dim": "rgb(var(--tertiary-fixed-dim) / <alpha-value>)",
        "inverse-primary": "rgb(var(--inverse-primary) / <alpha-value>)",
        "primary-fixed": "rgb(var(--primary-fixed) / <alpha-value>)",
        background: "rgb(var(--background) / <alpha-value>)",
        "surface-container-lowest":
          "rgb(var(--surface-container-lowest) / <alpha-value>)",
        "on-surface-variant": "rgb(var(--on-surface-variant) / <alpha-value>)",
        "on-secondary-fixed-variant":
          "rgb(var(--on-secondary-fixed-variant) / <alpha-value>)",
        "on-primary-fixed-variant":
          "rgb(var(--on-primary-fixed-variant) / <alpha-value>)",
        "surface-bright": "rgb(var(--surface-bright) / <alpha-value>)",
        "surface-container-high":
          "rgb(var(--surface-container-high) / <alpha-value>)",
        "on-error": "rgb(var(--on-error) / <alpha-value>)",
        "inverse-surface": "rgb(var(--inverse-surface) / <alpha-value>)",
        "surface-dim": "rgb(var(--surface-dim) / <alpha-value>)",
        "on-error-container": "rgb(var(--on-error-container) / <alpha-value>)",
        "on-primary": "rgb(var(--on-primary) / <alpha-value>)",
        "secondary-container":
          "rgb(var(--secondary-container) / <alpha-value>)",
        "on-tertiary-container":
          "rgb(var(--on-tertiary-container) / <alpha-value>)",
        "on-tertiary": "rgb(var(--on-tertiary) / <alpha-value>)",
        "surface-container-low":
          "rgb(var(--surface-container-low) / <alpha-value>)",
        "surface-tint": "rgb(var(--surface-tint) / <alpha-value>)",
        "on-background": "rgb(var(--on-background) / <alpha-value>)",
        secondary: "rgb(var(--secondary) / <alpha-value>)",
        "on-tertiary-fixed": "rgb(var(--on-tertiary-fixed) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        "on-primary-container":
          "rgb(var(--on-primary-container) / <alpha-value>)",
        "on-secondary": "rgb(var(--on-secondary) / <alpha-value>)",
        "tertiary-container": "rgb(var(--tertiary-container) / <alpha-value>)",
        "secondary-fixed": "rgb(var(--secondary-fixed) / <alpha-value>)",
        error: "rgb(var(--error) / <alpha-value>)",
        outline: "rgb(var(--outline) / <alpha-value>)",
        "on-tertiary-fixed-variant":
          "rgb(var(--on-tertiary-fixed-variant) / <alpha-value>)",
        "primary-fixed-dim": "rgb(var(--primary-fixed-dim) / <alpha-value>)",
        "on-secondary-fixed": "rgb(var(--on-secondary-fixed) / <alpha-value>)",
        "on-surface": "rgb(var(--on-surface) / <alpha-value>)",
        "on-secondary-container":
          "rgb(var(--on-secondary-container) / <alpha-value>)",
        "error-container": "rgb(var(--error-container) / <alpha-value>)",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      spacing: {
        base: "8px",
        "margin-mobile": "16px",
        "container-max": "1280px",
        "section-gap": "80px",
        gutter: "24px",
      },
      maxWidth: {
        "container-max": "1280px",
      },
      fontFamily: {
        "body-md": ["Inter", "sans-serif"],
        "label-caps": ["JetBrains Mono", "monospace"],
        "headline-lg": ["Sora", "sans-serif"],
        "headline-lg-mobile": ["Sora", "sans-serif"],
        "display-lg": ["Sora", "sans-serif"],
      },
      fontSize: {
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-caps": [
          "12px",
          { lineHeight: "16px", letterSpacing: "0.1em", fontWeight: "500" },
        ],
        "headline-lg": ["32px", { lineHeight: "40px", fontWeight: "600" }],
        "headline-lg-mobile": [
          "24px",
          { lineHeight: "32px", fontWeight: "600" },
        ],
        "display-lg": [
          "48px",
          { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
      },
    },
  },
  plugins: [],
};
