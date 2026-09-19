# AstroTalk — Discover Your Cosmic Blueprint

AstroTalk is a modern, responsive astrology web application built with a celestial starfield canvas and an ultra-refined glassmorphism design system.

![AstroTalk Preview](https://img.shields.io/badge/AstroTalk-Live-7c3aed?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## ✨ Features

- **Cosmic Celestial Engine (`<canvas>`)**:
  - Real-time animated starfield with ambient twinkling stars and shooting meteors.
  - Faithfully modeled 12 zodiac constellations with stars, lines, and stardust pulse packets.
  - Prominent 4-pointed cross diffraction flare stars (golden and cyan) and corner constellation framing:
    - **Aries** (Top-Left)
    - **♌ Leo** (Top-Right)
    - **♐ Sagittarius** (Bottom-Left)
    - **♓ Pisces** (Bottom-Right)
  - Interactive mouse parallax drift and dynamic constellation highlight when selecting zodiac cards.

- **Glassmorphic UI Design System**:
  - Multi-layered frosted glass panels (`backdrop-filter: blur(...) saturate(...)`).
  - Physical specular light rims (`border-top: 1.5px solid rgba(255, 255, 255, ...)`).
  - Floating crystal zodiac cards with Ram horns, Bull face, Gemini `II`, Crab, Lion mane, Virgo `♍`, Libra scales, Scorpio `♏`, Sagittarius arrow `↗`, Aquarius urn, and Pisces `♓`.
  - Floating glass console with a 3-step progress track and glossy crystalline CTA button.

- **Structured Astrology Prompt Generator**:
  - Interactive birth details form (Name, Date of Birth, Time of Birth, Place of Birth, Life Focus areas).
  - Calculates Western Sun Sign, Vedic Moon/Sun sign, ruling element, and qualities.
  - Produces an in-depth structured astrology reading prompt optimized for AI (Claude, GPT, Gemini) or expert astrologers.
  - One-click copy with instant visual feedback.

- **Accessible & Responsive**:
  - Single-viewport desktop layout with zero vertical scroll overflow.
  - Horizontal drag-scroll zodiac track on mobile screens.
  - Full modal system for Login, About, and Features with keyboard Escape support.

---

## 🚀 Getting Started

### Prerequisites
No frameworks or build steps required. Any modern web browser will run the app directly.

### Running Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Suryani-76/Astrotalk_app.git
   cd Astrotalk_app
   ```

2. **Serve with any local web server**:
   - Using Python:
     ```bash
     python -m http.server 3000
     ```
   - Or using Node.js:
     ```bash
     npx serve .
     ```

3. **Open in browser**:
   Navigate to `http://localhost:3000`.

---

## 📁 Project Structure

```
Astrotalk_app/
├── index.html       # Semantic HTML5 markup, SVG emblems, and modals
├── style.css        # Cosmic design system, tokens, glassmorphism, animations
├── app.js           # Celestial canvas engine, zodiac math, prompt generator
└── README.md        # Project documentation
```

---

## 📜 License
MIT License. Feel free to use and adapt for personal or commercial projects.
