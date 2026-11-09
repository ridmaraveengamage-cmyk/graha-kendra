/* Graha Kendra accounts: Firebase sign-in (email + Google) and saved charts in Firestore */
import { firebaseConfig } from "./firebase-config.js";

const SDK = "https://www.gstatic.com/firebasejs/10.12.2/";
const $ = (id) => document.getElementById(id);
const configured = firebaseConfig && firebaseConfig.apiKey && !String(firebaseConfig.apiKey).startsWith("PASTE");

const API = {
  ready: false, configured, user: null,
  open: (mode) => openDialog(mode || "signin"),
  signOut: async () => {}, saveChart: async () => {}, listCharts: async () => [], deleteChart: async () => {}
};
window.GK_AUTH = API;
const announce = () => window.dispatchEvent(new CustomEvent("gk-auth"));

/* ---------- plain-language error messages ---------- */
const MESSAGES = {
  "auth/invalid-email": "That email address doesn't look right. Check it and try again.",
  "auth/missing-password": "Enter your password.",
  "auth/invalid-credential": "The email or password is incorrect. Try again, or reset your password.",
  "auth/wrong-password": "The email or password is incorrect. Try again, or reset your password.",
  "auth/user-not-found": "No account uses that email. Create an account instead.",
  "auth/email-already-in-use": "An account already uses this email. Sign in instead.",
  "auth/weak-password": "Use a password with at least 8 characters.",
  "auth/too-many-requests": "Too many attempts. Wait a few minutes, then try again.",
  "auth/popup-closed-by-user": "The Google window was closed before signing in finished.",
  "auth/popup-blocked": "Your browser blocked the Google window. Allow pop-ups for this site and try again.",
  "auth/network-request-failed": "No connection. Check your internet and try again.",
  "auth/unauthorized-domain": "This web address isn't approved for sign-in yet. Add it under Authentication › Settings › Authorised domains in Firebase."
};
const friendly = (e) => MESSAGES[e && e.code] || "Something went wrong. Please try again.";

/* ---------- dialog ---------- */
let mode = "signin";
function setMode(m) {
  mode = m;
  const dlg = $("authDlg");
  dlg.dataset.mode = m;
  $("authTitle").textContent = m === "signup" ? "Create your account" : m === "reset" ? "Reset your password" : "Welcome back";
  $("authLede").textContent = m === "signup" ? "Save your charts and open them on any device." : m === "reset" ? "Enter your email and we'll send you a link to choose a new password." : "Sign in to see your saved charts.";
  $("authSubmit").textContent = m === "signup" ? "Create account" : m === "reset" ? "Send reset link" : "Sign in";
  $("au-name-row").hidden = m !== "signup";
  $("au-pass-row").hidden = m === "reset";
  $("au-pass").setAttribute("autocomplete", m === "signup" ? "new-password" : "current-password");
  $("authGoogle").hidden = m === "reset";
  $("authOr").hidden = m === "reset";
  document.querySelectorAll("#authDlg [data-tab]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tab === m)));
  $("authTabs").hidden = m === "reset";
  $("authMsg").textContent = ""; $("authMsg").className = "authmsg";
}
function openDialog(m) {
  const dlg = $("authDlg"); if (!dlg) return;
  setMode(m);
  if (!configured) { showMsg("Sign-in isn't switched on yet. Add your Firebase settings to firebase-config.js (see SETUP.md).", true); }
  if (!dlg.open) dlg.showModal();
  setTimeout(() => (m === "signup" ? $("au-name") : $("au-email")).focus(), 30);
}
function showMsg(t, isErr) { const el = $("authMsg"); el.textContent = t; el.className = "authmsg " + (isErr ? "err" : "ok"); }
function busy(on) { $("authSubmit").disabled = on; $("authGoogle").disabled = on; $("authSubmit").dataset.busy = on ? "1" : ""; }

function wireDialog(fns) {
  const dlg = $("authDlg"); if (!dlg) return;
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg) dlg.close();
    const t = e.target.closest("[data-tab],[data-auth]"); if (!t) return;
    if (t.dataset.tab) setMode(t.dataset.tab);
    if (t.dataset.auth === "close") dlg.close();
    if (t.dataset.auth === "forgot") setMode("reset");
    if (t.dataset.auth === "back") setMode("signin");
  });
  $("authGoogle").addEventListener("click", async () => {
    if (!configured) return;
    busy(true);
    try { await fns.google(); dlg.close(); } catch (e) { showMsg(friendly(e), true); } finally { busy(false); }
  });
  $("authForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!configured) return;
    const email = $("au-email").value.trim(), pass = $("au-pass").value, name = $("au-name").value.trim();
    if (!email) return showMsg("Enter your email address.", true);
    if (mode !== "reset" && !pass) return showMsg("Enter your password.", true);
    if (mode === "signup" && pass.length < 8) return showMsg("Use a password with at least 8 characters.", true);
    busy(true);
    try {
      if (mode === "reset") { await fns.reset(email); showMsg("Check your inbox for a link to reset your password.", false); }
      else if (mode === "signup") { await fns.signUp(email, pass, name); dlg.close(); }
      else { await fns.signIn(email, pass); dlg.close(); }
    } catch (err) { showMsg(friendly(err), true); } finally { busy(false); }
  });
}

/* ---------- Firebase ---------- */
async function start() {
  if (!configured) { wireDialog({}); API.ready = true; announce(); return; }
  const [{ initializeApp }, A, F] = await Promise.all([
    import(SDK + "firebase-app.js"), import(SDK + "firebase-auth.js"), import(SDK + "firebase-firestore.js")
  ]);
  const app = initializeApp(firebaseConfig);
  const auth = A.getAuth(app), db = F.getFirestore(app);
  auth.useDeviceLanguage();
  const google = new A.GoogleAuthProvider();

  wireDialog({
    signIn: (e, p) => A.signInWithEmailAndPassword(auth, e, p),
    signUp: async (e, p, n) => {
      const cred = await A.createUserWithEmailAndPassword(auth, e, p);
      if (n) await A.updateProfile(cred.user, { displayName: n });
      try { await A.sendEmailVerification(cred.user); } catch (_) {}
      API.user = { uid: cred.user.uid, email: cred.user.email, name: n || "" }; announce();
    },
    google: () => A.signInWithPopup(auth, google),
    reset: (e) => A.sendPasswordResetEmail(auth, e)
  });

  const col = () => F.collection(db, "users", API.user.uid, "charts");
  const chartId = (b) => [b.y, b.m, b.d, b.hh, b.mm, b.city, (b.name || "chart").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30)].join("_");
  API.saveChart = async (b) => {
    if (!API.user) return;
    const clean = JSON.parse(JSON.stringify(b));
    await F.setDoc(F.doc(col(), chartId(b)), { ...clean, savedAt: F.serverTimestamp() }, { merge: true });
  };
  API.listCharts = async () => {
    if (!API.user) return [];
    const snap = await F.getDocs(F.query(col(), F.orderBy("savedAt", "desc"), F.limit(50)));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  };
  API.deleteChart = async (id) => { if (API.user) await F.deleteDoc(F.doc(col(), id)); };
  API.signOut = () => A.signOut(auth);

  A.onAuthStateChanged(auth, async (u) => {
    API.user = u ? { uid: u.uid, email: u.email, name: u.displayName || "" } : null;
    API.ready = true;
    if (u) {
      // Bring this device's current chart into the account, or restore the latest saved one.
      try {
        const local = JSON.parse(localStorage.getItem("gk-last") || "null");
        if (local) await API.saveChart(local);
        else { const list = await API.listCharts(); if (list[0]) { const { id, savedAt, ...b } = list[0]; localStorage.setItem("gk-last", JSON.stringify(b)); } }
      } catch (_) {}
    }
    announce();
  });
}
start().catch((e) => { console.error(e); API.ready = true; announce(); });
