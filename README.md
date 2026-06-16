# Immersive 3D AI Security Portfolio

A high-end, premium portfolio website designed with an Apple-style aesthetic (space-gray dark mode, glassmorphism, responsive Bento-grid layout) featuring real-time 3D interactive elements and a simulated security laboratory console. 

Live representation of **Moh. Siraj Khan Mansoori**—AI Security and Machine Learning Engineer.

---

## 🌟 Key Features

*   **Apple Design Style**: Clean typography (Inter), space-gray dark color scheme, glassmorphism card layouts, and subtle ambient glows.
*   **Three.js 3D Background**: Interactive particle system resembling a neural network core, with orbiting rings and floating geometric wireframe shapes that respond dynamically to scroll actions and window resize.
*   **Security Lab Console**: An interactive terminal simulator showcasing three mock security modules:
    *   *Adversarial ML Simulator*: Demonstrates FGSM evasion attacks against deep neural networks.
    *   *Intrusion Detection System*: Simulates network traffic inspection and threat detection.
    *   *Decryption Lab*: Simulates real-time cryptographic key cracking.
*   **Bento Grid Layout**: Beautifully structured grid system showcasing Education, Advanced Capabilities, and Core Projects.
*   **Responsive Design**: Fully optimized with fluid typography and layout shifts for mobile, tablet, and desktop viewports.
*   **Privacy & Offline-Ready**: All dependency libraries (Three.js, GSAP, and ScrollTrigger) are stored locally under `assets/` to ensure offline functionality and bypass network restrictions.

---

## 🛠️ Technology Stack

*   **Frontend Structure**: HTML5 (Semantic elements, clean structure)
*   **Styling & Layout**: CSS3 (Vanilla CSS, Custom Properties, Flexbox, CSS Grid, Media Queries)
*   **3D Visuals & Math**: [Three.js](https://threejs.org/) (WebGL Canvas rendering, dynamic particle meshes, orbital mechanics)
*   **Motion & Scroll Animations**: [GSAP](https://gsap.com/) & [ScrollTrigger](https://gsap.com/scrolltrigger/)
*   **Icons**: Custom SVGs

---

## 📂 Project Structure

```
├── assets/
│   ├── about-profile.png       # Profile photo for About section
│   ├── hero-profile.png        # Profile photo for Hero section
│   ├── project_ids.png         # Project illustration: Intrusion Detection
│   ├── project_rag.png         # Project illustration: RAG Chatbot
│   ├── project_screener.png    # Project illustration: Resume Screener
│   ├── project_diffusion.png   # Project illustration: Stable Diffusion
│   ├── project_dashboard.png   # Project illustration: Job Tracker
│   ├── resume.pdf              # Direct download resume document
│   ├── three.min.js            # Local Three.js library
│   ├── gsap.min.js             # Local GSAP library
│   └── ScrollTrigger.min.js    # Local GSAP ScrollTrigger plugin
├── index.html                  # Semantic structural skeleton
├── style.css                   # Core CSS design system
├── main.js                     # WebGL rendering, animations, & console simulator
└── README.md                   # Project documentation
```

---

## 💻 Running the Project Locally

Since this is a fully static website, you don't need any complex build steps or dependencies. You can run it locally in seconds:

### Option 1: Open index.html directly
Simply double-click the `index.html` file in your file explorer to open it in your web browser.

### Option 2: Run a lightweight local server
For the best experience (especially if you want to test network requests or prevent local file path restrictions in some browsers):

**Using Python:**
```bash
python3 -m http.server 8000
```

**Using Node.js (if installed):**
```bash
npm install -g serve
serve .
```

Open your browser and navigate to `http://localhost:8000` or the port provided by your server.

---

## 👤 About the Author

**Moh. Siraj Khan Mansoori**
*   **M.Tech in CS (Information Security)** — NITK Surathkal (2025 - Present)
*   **B.Tech in CS & Engineering** — University of Allahabad (2021 - 2025)
*   **GATE '25 CS** — Qualified with Score 628

Explore the code, play with the WebGL interactive background, and check out the interactive modules in the **Security Lab**!
