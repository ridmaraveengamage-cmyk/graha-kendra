// Builds the hostable website into ./public from the shared site files.
// Run with:  node build.js
const fs = require("fs"), path = require("path");
const SITE = path.join(__dirname, "..", "site"), SRC = path.join(__dirname, "src"), OUT = path.join(__dirname, "public");
fs.mkdirSync(OUT, { recursive: true });

for (const f of ["core.js", "readings.js", "shared.js", "extra.js", "narrative.js", "app.js"]) fs.copyFileSync(path.join(SITE, f), path.join(OUT, f));
fs.copyFileSync(path.join(SRC, "auth.js"), path.join(OUT, "auth.js"));
// Keep an existing firebase-config.js so your settings are never overwritten.
if (!fs.existsSync(path.join(OUT, "firebase-config.js"))) fs.copyFileSync(path.join(SRC, "firebase-config.js"), path.join(OUT, "firebase-config.js"));

let body = fs.readFileSync(path.join(SITE, "index.html"), "utf8");
const title = body.match(/<title>.*?<\/title>/)[0];
body = body.replace(title, "").replace(/<meta name="claude:viewport-fit-sides"[^>]*>\n?/, "");

// Account button in the nav, account link in the phone menu, and the auth module
body = body.replace('<button class="menu" id="menuBtn"', '<div id="acct" class="acct" hidden></div>\n <button class="menu" id="menuBtn"');
body = body.replace('<a href="#learn">Learn</a></div>', '<a href="#learn">Learn</a><a href="#account" id="mobileAcct" class="mobile-only">Sign in</a></div>');
body = body.replace('<script src="app.js"></script>', '<script src="app.js"></script>\n<script type="module" src="auth.js"></script>');

const icon = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#0a0816"/><g fill="none" stroke="#c9b8ff" stroke-width="1.6"><rect x="5" y="5" width="22" height="22" rx="2"/><path d="M16 5L27 16L16 27L5 16Z M5 5L27 27M27 5L5 27"/></g></svg>');

const dialog = `
<dialog id="authDlg" aria-labelledby="authTitle">
 <form id="authForm" class="authcard" novalidate>
  <button type="button" class="authx" data-auth="close" aria-label="Close">×</button>
  <div class="seg" id="authTabs" role="tablist"><button type="button" data-tab="signin" role="tab">Sign in</button><button type="button" data-tab="signup" role="tab">Create account</button></div>
  <h2 id="authTitle">Welcome back</h2><p id="authLede" class="muted">Sign in to see your saved charts.</p>
  <button type="button" class="btn glass google" id="authGoogle"><svg viewBox="0 0 18 18" width="18" height="18" aria-hidden="true"><path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"/><path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33z"/><path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/></svg>Continue with Google</button>
  <div class="or" id="authOr"><span>or with email</span></div>
  <div class="field" id="au-name-row" hidden><label for="au-name">Your name</label><input id="au-name" autocomplete="name" placeholder="Nimal Perera"></div>
  <div class="field"><label for="au-email">Email</label><input id="au-email" type="email" autocomplete="email" placeholder="you@example.com"></div>
  <div class="field" id="au-pass-row"><label for="au-pass">Password</label><input id="au-pass" type="password" autocomplete="current-password" placeholder="At least 8 characters"></div>
  <p id="authMsg" class="authmsg" role="alert"></p>
  <button class="btn primary" id="authSubmit" type="submit">Sign in</button>
  <p class="authfoot"><button type="button" class="linkbtn signin-only" data-auth="forgot">Forgot your password?</button><button type="button" class="linkbtn reset-only" data-auth="back">Back to sign in</button></p>
 </form>
</dialog>`;

const css = `<style>
html,body{margin:0}[hidden]{display:none!important}img{max-width:100%}
:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
.acct{display:flex;align-items:center;margin-right:6px}
.avatar{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;text-decoration:none;font:600 15px var(--sans);color:#0b0914;background:linear-gradient(135deg,var(--lilac),var(--rose))}
.mobile-only{display:none!important}
@media (max-width:900px){.links.open .mobile-only{display:block!important}.acct .btn{display:none}}
dialog#authDlg{border:0;padding:0;background:transparent;color:var(--ink);max-width:min(440px,calc(100vw - 32px));width:100%}
dialog#authDlg::backdrop{background:rgba(3,2,8,.72);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}
.authcard{position:relative;display:grid;gap:14px;padding:30px;border-radius:28px;background:linear-gradient(180deg,#171329,#0d0b1b);border:1px solid var(--line2);box-shadow:0 40px 120px -30px rgba(120,90,255,.45)}
.authcard h2{margin:6px 0 0;font-size:2.2rem}
.authcard .seg{justify-self:start}
.authx{position:absolute;top:14px;right:14px;width:36px;height:36px;border-radius:50%;border:1px solid var(--line2);background:var(--glass2);color:var(--ink);font-size:22px;line-height:1;cursor:pointer}
.google{width:100%;height:50px;gap:12px}
.or{display:flex;align-items:center;gap:12px;color:var(--mut);font-size:13px}.or::before,.or::after{content:"";flex:1;height:1px;background:var(--line2)}
.authcard .btn.primary{width:100%;height:52px;font-size:16px}
.authcard .btn[disabled]{opacity:.6;cursor:wait}
.authmsg{margin:0;font-size:14px;min-height:0}.authmsg.err{color:var(--hard)}.authmsg.ok{color:var(--good)}
.authfoot{margin:0;text-align:center}
.linkbtn{background:none;border:0;color:var(--lilac);font:500 14px var(--sans);cursor:pointer;text-decoration:underline;text-underline-offset:3px}
#authDlg[data-mode="reset"] .signin-only,#authDlg:not([data-mode="reset"]) .reset-only,#authDlg[data-mode="signup"] .signin-only{display:none}
</style>`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${title}
<meta name="description" content="Vedic astrology for Sri Lanka in plain words: your birth chart (kendaraya), life periods, monthly lagna palapala, porondam matching and nakath times.">
<meta name="theme-color" content="#05040b">
<meta property="og:title" content="Graha Kendra">
<meta property="og:description" content="Read the sky you were born under. Vedic astrology for Sri Lanka, in plain words.">
<link rel="icon" href="${icon}">
${css}
</head>
<body>
${body}
${dialog}
</body>
</html>`;
fs.writeFileSync(path.join(OUT, "index.html"), html);
console.log("Built", OUT);
