import js from "@eslint/js";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["**/*.{ts,tsx,js,jsx}"],
        plugins: {
            "@next/next": nextPlugin,
            react: reactPlugin,
            "react-hooks": hooksPlugin
        },
        rules: {
            ...nextPlugin.configs.recommended.rules,
            ...nextPlugin.configs["core-web-vitals"].rules,
            ...reactPlugin.configs.recommended.rules,
            ...hooksPlugin.configs.recommended.rules,
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
            "@next/next/no-img-element": "off"
        },
        settings: {
            react: {
                version: "19.0"
            }
        }
    },
    {
        files: ["next.config.js", "postcss.config.js", "tailwind.config.js"],
        languageOptions: {
            globals: {
                ...globals.node
            }
        }
    },
    {
        ignores: [".next/**", "node_modules/**", "out/**"]
    }
);
