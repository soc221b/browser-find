import { createRequire } from "node:module";
import { ManifestTypeV3 } from "./v3-type.mjs";

const require = createRequire(import.meta.url);
const pkg = require("../../package.json");

const manifest: ManifestTypeV3 = {
  manifest_version: 3,
  name: pkg.displayName,
  version: pkg.version,
  description: pkg.description,
  icons: {
    "16": "public/logo-16.png",
    "32": "public/logo-32.png",
    "48": "public/logo-48.png",
    "128": "public/logo-128.png",
  },
  web_accessible_resources: [
    {
      resources: [
        "public/*",
        "assets/*",
      ],
      matches: [
        "<all_urls>",
      ],
    },
  ],
};

function getManifestV3(pageDirMap: { [x: string]: any }): ManifestTypeV3 {
  const pages = Object.keys(pageDirMap);

  if (pages.length === 0) {
    return manifest;
  }

  if (pages.indexOf("options") > -1) {
    manifest.options_ui = {
      page: pageDirMap["options"],
    };
  }

  if (pages.indexOf("background") > -1) {
    manifest.background = {
      service_worker: pageDirMap["background"],
      type: "module",
    };
  }

  if (pages.indexOf("popup") > -1) {
    manifest.action = {
      default_popup: pageDirMap["popup"],
      default_icon: "public/logo-32.png",
    };
  }

  if (pages.indexOf("newtab") > -1) {
    manifest.chrome_url_overrides = {
      newtab: pageDirMap["newtab"],
    };
  }

  if (pages.indexOf("bookmarks") > -1) {
    manifest.chrome_url_overrides = {
      bookmarks: pageDirMap["bookmarks"],
    };
  }

  if (pages.indexOf("history") > -1) {
    manifest.chrome_url_overrides = {
      history: pageDirMap["history"],
    };
  }

  if (pages.indexOf("content") > -1) {
    manifest.content_scripts = [
      {
        matches: [
          "http://*/*",
          "https://*/*",
          "<all_urls>",
        ],
        js: [
          pageDirMap["content"],
        ],
        css: pageDirMap["content-css"],
        run_at: "document_start",
      },
    ];
  }

  if (pages.indexOf("devtools") > -1) {
    manifest.devtools_page = pageDirMap["devtools"];
  }

  return manifest;
}

export default getManifestV3;
