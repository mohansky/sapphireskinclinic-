// @ts-check
import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";

import mdx from "@astrojs/mdx";

import netlify from "@astrojs/netlify";

import react from "@astrojs/react";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://sapphireskinclinic.netlify.app',
  integrations: [icon(), mdx(), react(), sitemap()],

  env: {
    schema: {
      RESEND_API_KEY: envField.string({
        context: "server",
        access: "secret",
        startsWith: "re_",
        optional: false,
      }),
    },
  },
  output: 'server',
  adapter: netlify(),
});