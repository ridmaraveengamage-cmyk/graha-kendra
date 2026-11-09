# Putting Graha Kendra online: GitHub + Firebase

How it works once set up:

- **GitHub** keeps your code and the full history of every change.
- **Firebase** runs the live website, sign-in (email/password and Google) and each user's saved charts.
- Every time a change is pushed to GitHub, the site rebuilds and goes live on Firebase automatically.

Readings stay free without an account; signing in adds saving and syncing across devices. Everything below is free to start (Firebase Spark plan, free GitHub account). Allow about 30 minutes.

---

## Part A: Firebase (in your browser)

### A1. Create the project
1. Go to **console.firebase.google.com** and sign in with your Google account.
2. Click **Create a project**, name it `graha-kendra` (Firebase may add a few letters). Google Analytics can be off.
3. Click the **web icon `</>`** to add a web app. Nickname: `Graha Kendra`. Tick **Also set up Firebase Hosting**. Click **Register app**.
4. Firebase shows `const firebaseConfig = { ... }`. **Keep this page open** for step A4.
5. Note your **Project ID** (shown under Project settings, for example `graha-kendra-1a2b3`). You need it in step B3.

### A2. Turn on sign-in
1. **Build › Authentication › Get started**.
2. **Sign-in method** tab: turn on **Email/Password**, then **Add new provider › Google** and turn that on too (choose your support email).

### A3. Create the database and protect it
1. **Build › Firestore Database › Create database**. Location: **asia-south1 (Mumbai)**, the closest to Sri Lanka (this can't be changed later). Choose **production mode**.
2. Open the **Rules** tab, delete what's there, paste the whole contents of `firebase-site/firestore.rules`, and click **Publish**. This makes sure each person can only see their own charts.

### A4. Add your settings to the site
Open `firebase-site/public/firebase-config.js` in a text editor and replace the placeholder values with the ones from step A1.4. Save the file. These values only identify your project, so they're safe to put in a public website.

---

## Part B: GitHub

### B1. Put the code on GitHub
1. Create a free account at **github.com** if you don't have one.
2. Create a **new repository** named `graha-kendra`. Choose **Private**. Don't add a README (the project already has one).
3. Upload this project to it. Either:
   - ask Claude to do it for you (it can push the code if GitHub is connected on your computer), or
   - use **GitHub Desktop**: *File › Add local repository*, choose this project folder, then **Publish repository**.

### B2. Give GitHub permission to deploy to Firebase
1. In the Firebase console open **Project settings (gear icon) › Service accounts**.
2. Click **Generate new private key**, then **Generate key**. A `.json` file downloads.
3. In your GitHub repository go to **Settings › Secrets and variables › Actions**.
4. On the **Secrets** tab click **New repository secret**:
   - Name: `FIREBASE_SERVICE_ACCOUNT`
   - Value: open the downloaded `.json` file in Notepad, copy **everything**, and paste it here.
5. **Delete the downloaded `.json` file** from your computer afterwards. It's a master key to your Firebase project, so never email it, share it or put it in the project folder.

### B3. Tell GitHub your project ID
On the same page, switch to the **Variables** tab and click **New repository variable**:
- Name: `FIREBASE_PROJECT_ID`
- Value: your Project ID from step A1.5

### B4. Go live
1. In GitHub open the **Actions** tab. If you see "Workflows aren't being run", click **I understand, enable them**.
2. Click **Deploy to Firebase Hosting › Run workflow**, or push any change to `main`.
3. After about two minutes the run turns green. Your site is live at `https://YOUR-PROJECT-ID.web.app`.

---

## Part C: Check it works
1. Open your site. Click **Sign in › Create account** and make a test account.
2. Cast a chart, then click your initial in the top-right corner. The chart should appear under **Your charts**.
3. Sign out, then try **Continue with Google**.

## Using your own domain (optional)
In Firebase go to **Hosting › Add custom domain** (for example `grahakendra.lk`) and add the DNS records it gives you at your domain registrar. SSL is free and automatic. Then check **Authentication › Settings › Authorised domains** lists your domain.

## Everyday updates
Change files in `site/`, then commit and push to `main`. GitHub builds and deploys automatically; watch progress on the **Actions** tab.

Opening a pull request instead of pushing to `main` creates a private preview link (valid for 7 days), so you can check changes before they go live.

## What's in this folder

| File | What it is |
|---|---|
| `public/` | The website that gets uploaded (rebuilt automatically) |
| `public/firebase-config.js` | Your Firebase settings (step A4) |
| `src/auth.js` | Sign-in, sign-up, password reset, Google sign-in and saved charts |
| `firestore.rules` | Database security: each person sees only their own charts |
| `firebase.json` | Hosting settings |
| `build.js` | Builds `public/` from `../site` (run automatically by GitHub) |

## Deploying by hand (optional)
If you ever want to deploy without GitHub: install Node.js and run `npm install -g firebase-tools`, then `firebase login`. From this folder, run `firebase use --add`, then `node build.js`, then `firebase deploy`.
