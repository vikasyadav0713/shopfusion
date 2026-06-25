import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: "class",
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			keyframes: {
				"slide-right": {
					"0%": { transform: "translateX(-100%)" },
					"100%": { transform: "translateX(0)" },
				}
			},
			animation: {
				"slide-right": "slide-right 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
			}
		},
	},
	plugins: [],
};

export default config;
