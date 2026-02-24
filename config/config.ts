// https://umijs.org/config/

import { defineConfig } from "@umijs/max";
import { join } from "node:path";
import defaultSettings from "./defaultSettings";
import proxy from "./proxy";
import routes from "./routes";

const { REACT_APP_ENV = "dev" } = process.env;

export default defineConfig({
  hash: true,

  base: "/",
  publicPath: "/",

  routes,

  ignoreMomentLocale: true,

  proxy: proxy[REACT_APP_ENV as keyof typeof proxy],

  fastRefresh: true,

  model: {},
  initialState: {},

  title: "Ant Design Pro",
  layout: {
    locale: true,
    ...defaultSettings,
  },

  moment2dayjs: {
    preset: "antd",
    plugins: ["duration"],
  },

  locale: {
    default: "vi-VN",
    antd: true,
    baseNavigator: true,
  },

  antd: {
    appConfig: {},
    configProvider: {
      theme: {
        cssVar: true,
        token: {
          fontFamily: "BeVietnamPro, sans-serif",
        },
      },
    },
  },

  request: {},
  access: {},

  /** script trong <head> */
  headScripts: [{ src: join("/", "scripts/loading.js"), async: true }],

  presets: ["umi-presets-pro"],

  openAPI: [
    {
      requestLibPath: "import { request } from '@umijs/max'",
      schemaPath: join(__dirname, "oneapi.json"),
      mock: false,
    },
    {
      requestLibPath: "import { request } from '@umijs/max'",
      schemaPath:
        "https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json",
      projectName: "swagger",
    },
  ],

  mock: {
    include: ["mock/**/*", "src/pages/**/_mock.ts"],
  },

  mako: {},
  esbuildMinifyIIFE: true,
  requestRecord: {},
  exportStatic: {},

  define: {
    "process.env.CI": process.env.CI,
  },

  tailwindcss: {},
});
