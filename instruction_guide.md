# Periodically Rational: Complete Setup & Domain Connection Guide

Welcome! This guide is written in clear, plain language with zero technical jargon. It walks you through connecting your Porkbun domain (**www.periodicallyrational.com**) to your GitHub repository (**github.com/Caleob/periodicallyrational**) so your conference presentation and all future student apps are live at your own web address.

---

## 🧭 The Big Picture (How It Works)

Think of your website like a real-world house:
1. **Porkbun** is City Hall where you registered your official street address (`www.periodicallyrational.com`).
2. **GitHub** is the land where the building and rooms live (your slides, tools, and apps).
3. **DNS (Domain Name System)** is the road sign at the intersection that points cars from your street address to the GitHub building.
4. **GitHub Pages** is the front door that serves the pages to whoever visits.

Because everything is hosted through your custom domain, **students and school administrators will only see `www.periodicallyrational.com`**—never GitHub or developer URLs.

---

## 📁 What Has Been Prepared in Your Folder

All the necessary plumbing files have already been created directly in your folder (`C:\Users\caleo\Documents\PeriodicallyRational`):

| File / Folder | What It Does in Plain English |
| :--- | :--- |
| `CNAME` | Tells GitHub: *"When someone requests www.periodicallyrational.com, answer with this website."* |
| `.nojekyll` | A special flag that prevents GitHub from accidentally hiding files or scripts in your presentation. |
| `index.html` | Your new main homepage hub with links to the presentation, apps, ideas, and bio. |
| `404.html` | A friendly "Page Not Found" screen if someone mistypes a link, keeping them on your domain. |
| `Conference/` | The complete interactive presentation ("The Classroom Genie") with all 13 demo tools and audio. |
| `Apps/` | Your student learning hub, ready for you to drop in classroom tools. |
| `AboutMe/` | A clean educator bio page featuring your portrait (`Caleob King Portrait.png`). |
| `Ideas/` | An area for math proof notes and essays. |
| `.gitignore` | Prevents computer junk files (like temporary thumbnails) from cluttering your website. |

---

## ✅ Step-by-Step Checklist

Follow these 4 checklists in order. Check off each box as you complete it!

---

### Phase 1: Porkbun Domain Setup (Pointing the Road Signs)

You only have to do this once.

- [ ] **1. Log in to Porkbun**
  - Go to [porkbun.com](https://porkbun.com) and sign in to your account.
- [ ] **2. Open Your Domain Details**
  - Go to your **Domain Management** dashboard.
  - Find `periodicallyrational.com` and click **Details** (or click the DNS button).
- [ ] **3. Open the DNS Records Manager**
  - Next to **DNS Records**, click **Manage** (or **Edit**).
- [ ] **4. Clear Default Parking Records (If Present)**
  - If Porkbun created default placeholder records (like a parking page pointing to Porkbun), click the small trash can icon next to them to delete them so they don't conflict with GitHub.
- [ ] **5. Add the 4 GitHub Address Records (Type: A)**
  - GitHub uses 4 numbers (IP addresses) to keep your website fast and reliable. Add each one:
  
  **First Record:**
  - **Type:** `A`
  - **Host:** leave blank (or type `@`)
  - **Answer:** `185.199.108.153`
  - **TTL:** `600` (or default)
  - Click **Submit** / **Add**.

  **Second Record:**
  - **Type:** `A`
  - **Host:** leave blank (or type `@`)
  - **Answer:** `185.199.109.153`
  - **TTL:** `600`
  - Click **Submit** / **Add**.

  **Third Record:**
  - **Type:** `A`
  - **Host:** leave blank (or type `@`)
  - **Answer:** `185.199.110.153`
  - **TTL:** `600`
  - Click **Submit** / **Add**.

  **Fourth Record:**
  - **Type:** `A`
  - **Host:** leave blank (or type `@`)
  - **Answer:** `185.199.111.153`
  - **TTL:** `600`
  - Click **Submit** / **Add**.

- [ ] **6. Add the WWW Record (Type: CNAME)**
  - Now tell browsers what to do when people type `www.periodicallyrational.com`:
  - **Type:** `CNAME`
  - **Host:** `www`
  - **Answer:** `caleob.github.io`
  - **TTL:** `600`
  - Click **Submit** / **Add**.

*That is all you need to do in Porkbun!*

---

### Phase 2: Upload Your Files to GitHub

> **Great news:** This step has **already been completed for you!** All 139 files (including your presentation, all 13 interactive tools, audio tracks, and student hubs) have been cleanly packaged, committed, and pushed to your GitHub repository at [https://github.com/Caleob/periodicallyrational](https://github.com/Caleob/periodicallyrational).

If you ever need to manually push changes in the future, these are the commands that were used:
- [x] **1. Initialized repository and created main branch** (`git init; git branch -M main`) — *Done!*
- [x] **2. Staged and committed all files** (`git add .; git commit -m "..."`) — *Done!*
- [x] **3. Connected remote and pushed to GitHub** (`git remote add origin ...; git push -u origin main`) — *Done!*

You can verify your files right now by visiting [github.com/Caleob/periodicallyrational](https://github.com/Caleob/periodicallyrational). All files are waiting for you there!

---

### Phase 3: Turn On GitHub Pages (Flipping the Switch)

Once your files are on GitHub, you turn on the free hosting service:

- [ ] **1. Open your repository on GitHub**
  - In your web browser, navigate to: [https://github.com/Caleob/periodicallyrational](https://github.com/Caleob/periodicallyrational)
- [ ] **2. Go to Settings**
  - Click the **Settings** tab with the gear icon near the top right of the page.
- [ ] **3. Open the Pages Menu**
  - In the left sidebar, click **Pages** (under the "Code and automation" section).
- [ ] **4. Configure the Publishing Source**
  - Under **Build and deployment**:
    - **Source:** select **Deploy from a branch**.
    - **Branch:** select **`main`** from the dropdown, leave the folder set to **`/(root)`**, and click **Save**.
- [ ] **5. Confirm Your Custom Domain**
  - Scroll down to **Custom domain**.
  - You should see `www.periodicallyrational.com` already populated (from our `CNAME` file).
  - If not, type `www.periodicallyrational.com` and click **Save**.
  - GitHub will check the DNS records you entered at Porkbun.
- [ ] **6. Turn on Enforce HTTPS**
  - Check the box for **Enforce HTTPS**.
  - *Helpful Note:* If this box is grayed out for a few minutes, do not panic! GitHub is generating a free SSL security certificate (the lock icon in the browser). Refresh the page after 10–15 minutes and check the box.

---

### Phase 4: Verification & Testing

- [ ] **1. Test Your Main Site**
  - Visit: `https://www.periodicallyrational.com`
  - You should see your homepage hub!
- [ ] **2. Test Your Presentation**
  - Click "Launch Presentation" or visit:
    `https://www.periodicallyrational.com/Conference/`
  - Notice the URL stays on your custom domain—no GitHub mentions anywhere!
- [ ] **3. Test Your Subpages**
  - Check the student apps hub: `https://www.periodicallyrational.com/Apps/`
  - Check your bio: `https://www.periodicallyrational.com/AboutMe/`
  - Check math notes: `https://www.periodicallyrational.com/Ideas/`

---

## 🚀 How to Add Future Apps for Your Students

Whenever you build a new tool or calculator for your students:

1. **Create a folder** inside `Apps`, for example:
   `C:\Users\caleo\Documents\PeriodicallyRational\Apps\fraction-bars`
2. **Put your tool's `index.html`** (and any script/css files) inside that folder.
3. **Send it to the web** with these 3 quick commands in PowerShell:
   ```powershell
   git add .
   git commit -m "Add new fraction bars app"
   git push
   ```
4. **Give your students the link**:
   `https://www.periodicallyrational.com/Apps/fraction-bars/`

Students can open that link directly in any browser on student devices without sign-in prompts, ads, or administrative concerns.

---

## ❓ Frequently Asked Questions & Troubleshooting

### Why is my website showing "Not Found" or a Porkbun page right after I saved?
Internet road signs (DNS) can take **5 to 30 minutes** (sometimes up to an hour) to update across the globe. If you just entered the settings, wait 15 minutes, close your browser, and open it again. You can also test on your phone with Wi-Fi turned off to see if the cellular network has updated faster.

### Do I need to pay GitHub anything?
No. GitHub Pages hosting is 100% free with unlimited visitors for static educational websites.

### Will students ever see the word "GitHub"?
No. Because you have a custom domain (`periodicallyrational.com`), the browser address bar only ever shows your domain. Even if a student types a wrong URL, your custom `404.html` page keeps them on your site.
