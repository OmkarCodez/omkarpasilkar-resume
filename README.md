# Omkar Pasilkar — QA Resume Website

> Dark purple-themed animated resume website with crawling bugs.  
> Built for **GitHub Pages** hosting — zero dependencies, pure HTML/CSS/JS.

---

## 🚀 Deploy to GitHub Pages (Step-by-Step)

### Option A — Quick Deploy (Recommended)

1. **Create a new GitHub repository**
   - Go to [github.com/new](https://github.com/new)
   - Name it: `omkar-pasilkar-resume` (or any name you like)
   - Set to **Public**
   - Click **Create repository**

2. **Upload the files**
   - Click **"uploading an existing file"** link on the empty repo page
   - Drag & drop **all files and folders** from this zip:
     ```
     index.html
     css/
       style.css
     js/
       bugs.js
       main.js
     README.md
     ```
   - Commit message: `Initial resume deploy`
   - Click **Commit changes**

3. **Enable GitHub Pages**
   - Go to **Settings → Pages**
   - Source: **Deploy from a branch**
   - Branch: `main` → Folder: `/ (root)`
   - Click **Save**

4. **Your site is live!**
   - URL: `https://YOUR_USERNAME.github.io/REPO_NAME/`
   - Takes ~2 minutes to build on first deploy

---

### Option B — Git CLI

```bash
git clone https://github.com/YOUR_USERNAME/omkar-pasilkar-resume.git
# Copy all resume files into the cloned folder
cd omkar-pasilkar-resume
git add .
git commit -m "Deploy resume website"
git push origin main
# Then enable GitHub Pages in repo Settings → Pages
```

---

## 🐛 Features

| Feature | Description |
|---|---|
| **Animated Bugs** | 22 SVG-drawn bugs (cockroach, spider, ant, beetle, fly) crawl around |
| **Click to Squash** | Click any bug — satisfying purple splat + kill counter |
| **Mouse Avoidance** | Bugs flee from your cursor |
| **Particle Hero** | Floating purple particles with constellation lines |
| **Scroll Reveal** | Sections animate in as you scroll |
| **Skill Bars** | Animated fill bars triggered on scroll |
| **Counter Animation** | Stats count up on page load |
| **Glitch Effect** | Hover the name for a glitch scramble |
| **3D Tilt Cards** | Cards subtly tilt following mouse position |
| **Easter Egg** | Type `qa` on keyboard for a bug invasion! |

---

## 🎨 Theme

- **Background:** Deep space purple-black (`#09080f`)
- **Accent:** Electric violet (`#9b5de5`) + bright lavender (`#c77dff`)
- **Highlight:** Deep violet (`#7b2fff`) + magenta (`#f72585`)
- **Fonts:** Syne (display) + JetBrains Mono (code) + DM Sans (body)

---

## 📁 File Structure

```
omkar-pasilkar-resume/
├── index.html        ← Main page (all content)
├── css/
│   └── style.css     ← Complete purple dark theme
├── js/
│   ├── bugs.js       ← SVG bug crawling engine
│   └── main.js       ← Particles, scroll, interactions
└── README.md         ← This file
```

---

*© Omkar Pasilkar — Senior QA Engineer · Mumbai, India*
