import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            colors: {
                'footer-dark': '#2B2B2B',
                'footer-light': '#565656',
                'forza': {
		    10: '#F1F2EF',
                    100: '#EFF6E0',
                    200: '#AEC3B0',
                    300: '#598392',
                    400: '#124559',
                    500: '#01161E',
                },
            },
        },
    },
    plugins: [],
};

export default config;
