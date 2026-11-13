#!/usr/bin/env node
// render-ads.mjs — 构建期渲染 6 个 Adsterra 广告 iframe 页（public/ads/*.html）
// key 从 NEXT_PUBLIC_AD_* 环境变量读取（GitHub Secrets 经 workflow env 注入）。
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "ads");
const SRC_TPL = process.env.NEXT_PUBLIC_ADSTERRA_BANNER_URL_TEMPLATE || "https://bicea.org/22/{key}";
const MARK = process.env.GITHUB_SHA ? process.env.GITHUB_SHA.slice(0, 7) : "local";

const SIZES = [
  ["banner-468x60", "NEXT_PUBLIC_AD_BANNER_468X60", 468, 60],
  ["banner-300x250", "NEXT_PUBLIC_AD_BANNER_300X250", 300, 250],
  ["banner-728x90", "NEXT_PUBLIC_AD_BANNER_728X90", 728, 90],
  ["banner-320x50", "NEXT_PUBLIC_AD_MOBILE_320X50", 320, 50],
  ["sidebar-160x300", "NEXT_PUBLIC_AD_SIDEBAR_160X300", 160, 300],
  ["sidebar-160x600", "NEXT_PUBLIC_AD_SIDEBAR_160X600", 160, 600],
];

mkdirSync(ROOT, { recursive: true });

for (const [file, envName, width, height] of SIZES) {
  const key = (process.env[envName] || "").trim();
  const hexOk = key.length === 32 && [...key].every(c => "0123456789abcdef".includes(c));
  console.log(`render ${file}.html: ${hexOk ? "real-key" : "placeholder"} len=${key.length}`);
  let html;
  if (hexOk) {
    html = `<!doctype html>
<html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;overflow:hidden}</style></head>
<body>
<script type="text/javascript">
	atOptions = {
		'key' : '${key}',
		'format' : 'iframe',
		'height' : ${height},
		'width' : ${width},
		'params' : {}
	};
</script>
<script type="text/javascript" src="${SRC_TPL.replace("{key}", key)}"></script>
<!-- build ${MARK} -->
</body></html>
`;
  } else {
    html = `<!doctype html><html><body style="margin:0"></body><!-- ${envName} not configured build=${MARK} --></html>
`;
  }
  writeFileSync(join(ROOT, `${file}.html`), html);
}
