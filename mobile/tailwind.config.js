/** @type {import('tailwindcss').Config} */
// Mirrors src/design/tokens.ts so NativeWind classes and StyleSheet values can't
// drift. Quick-commerce light theme with the VolteX teal brand — see
// DESIGN_SYSTEM.md. Platform-dependent values (shadow, hit slop) live only in
// tokens.ts because Platform.select() can't run here.
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#49A5A2",
          dark: "#3D8E8B",
          deep: "#2E7F7D",
          wash: "#E9F4F4",
          on: "#FFFFFF",
        },
        canvas: "#F6F7F8",
        card: "#FFFFFF",
        well: "#F2F3F5",
        separator: "#ECEDEF",
        border: "#E2E4E7",
        label: {
          DEFAULT: "#1C1C1E",
          secondary: "#6B6F76",
          tertiary: "#9CA1A8",
        },
        positive: {
          DEFAULT: "#1B8D3A",
          wash: "#E7F5EB",
        },
        destructive: "#D93025",
        ribbon: "#2A6DF4",
      },
    },
  },
  plugins: [],
};
