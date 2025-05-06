// @ts-check
import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";

import mdx from "@astrojs/mdx";

import netlify from "@astrojs/netlify";

import react from "@astrojs/react";

import sitemap from "@astrojs/sitemap";

import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  site: "https://sapphireskin.in",
  integrations: [
    icon(),
    mdx(),
    react(),
    sitemap({
      changefreq: "weekly",
      priority: 0.8,
      lastmod: new Date("2025-05-05"),
    }),
    partytown(),
  ],

  env: {
    schema: {
      RESEND_API_KEY: envField.string({
        context: "server",
        access: "secret",
        startsWith: "re_",
        optional: false,
      }),
      NETLIFY_URL: envField.string({
        context: "server",
        access: "public",
        optional: false,
      }),
      GTM: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
    },
  },
  output: "server",
  adapter: netlify(),
});
