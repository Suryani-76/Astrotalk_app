/**
 * AstroTalk — App Logic
 * Starfield canvas · Zodiac calculator · Prompt generator · Screen navigation
 */

'use strict';

/* ================================================
   CELESTIAL STARFIELD & 12 ZODIAC CONSTELLATIONS
   Twinkling stars · 4-Point cross flares · Floating constellations
   ================================================ */
let triggerConstellationHighlight = null;

(function initCelestialEngine() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = 0;
  let height = 0;
  let dpr = 1;
  let mouseX = -9999;
  let mouseY = -9999;
  let isMouseActive = false;

  // Ambient stars
  let ambientStars = [];
  const AMBIENT_COUNT = 220;

  // Shooting stars (meteors)
  let meteors = [];
  let lastMeteorTime = 0;

  /* -----------------------------------------------
     12 ZODIAC CONSTELLATION DEFINITIONS
     Faithfully modeled from reference constellation charts
     ----------------------------------------------- */
  const CONSTELLATIONS_DATA = [
    {
      id: 'aries',
      name: 'ARIES',
      symbol: '♈',
      element: 'Fire',
      accentColor: '#ff9d5c',
      stars: [
        { x: 18, y: 34, flare: true,  r: 3.2 },  // Hamal (alpha)
        { x: 44, y: 48, flare: false, r: 2.3 },  // Sheratan
        { x: 68, y: 58, flare: false, r: 2.1 },  // Mesarthim
        { x: 78, y: 82, flare: false, r: 1.9 },  // 41 Arietis
        { x: 40, y: 22, flare: false, r: 1.8 }   // horn upper tip
      ],
      edges: [[0, 4], [0, 1], [1, 2], [2, 3]]
    },
    {
      id: 'taurus',
      name: 'TAURUS',
      symbol: '♉',
      element: 'Earth',
      accentColor: '#6bffb8',
      stars: [
        { x: 15, y: 18, flare: false, r: 2.1 },  // Tianguan (horn L)
        { x: 76, y: 14, flare: false, r: 2.3 },  // Elnath (horn R)
        { x: 34, y: 46, flare: true,  r: 3.8 },  // Aldebaran (brilliant cross star)
        { x: 52, y: 52, flare: false, r: 2.2 },  // Hyades apex
        { x: 58, y: 34, flare: false, r: 2.0 },  // Ain
        { x: 40, y: 76, flare: false, r: 2.1 },  // chest
        { x: 62, y: 86, flare: false, r: 2.2 },  // belly
        { x: 82, y: 72, flare: false, r: 1.9 },  // flank
        { x: 88, y: 88, flare: false, r: 2.0 }   // Pleiades side
      ],
      edges: [[0, 2], [1, 4], [4, 3], [2, 3], [2, 5], [5, 6], [6, 7], [7, 8]]
    },
    {
      id: 'gemini',
      name: 'GEMINI',
      symbol: '♊',
      element: 'Air',
      accentColor: '#99d9ff',
      stars: [
        { x: 26, y: 20, flare: true,  r: 3.4 },  // Pollux (sparkle head)
        { x: 68, y: 18, flare: true,  r: 3.2 },  // Castor (sparkle head)
        { x: 24, y: 38, flare: false, r: 2.0 },  // Left shoulder
        { x: 65, y: 36, flare: false, r: 2.0 },  // Right shoulder
        { x: 46, y: 46, flare: false, r: 2.2 },  // Joined hands
        { x: 28, y: 60, flare: false, r: 1.9 },  // Left waist
        { x: 62, y: 58, flare: false, r: 1.9 },  // Right waist
        { x: 16, y: 86, flare: false, r: 1.9 },  // Left foot L
        { x: 36, y: 88, flare: false, r: 1.9 },  // Left foot R
        { x: 54, y: 88, flare: false, r: 1.9 },  // Right foot L
        { x: 76, y: 86, flare: false, r: 1.9 },  // Right foot R
        { x: 12, y: 46, flare: false, r: 1.7 },  // Left hand outer
        { x: 84, y: 42, flare: false, r: 1.7 }   // Right hand outer
      ],
      edges: [
        [0, 2], [2, 5], [5, 7], [5, 8], [2, 11], [2, 4],
        [1, 3], [3, 6], [6, 9], [6, 10], [3, 12], [3, 4]
      ]
    },
    {
      id: 'cancer',
      name: 'CANCER',
      symbol: '♋',
      element: 'Water',
      accentColor: '#80b8ff',
      stars: [
        { x: 50, y: 44, flare: true,  r: 3.4 },  // Acubens (central cross star)
        { x: 50, y: 16, flare: true,  r: 2.7 },  // Tegmine (top apex)
        { x: 34, y: 64, flare: false, r: 2.1 },  // Claw mid L
        { x: 18, y: 86, flare: false, r: 2.0 },  // Claw low L
        { x: 66, y: 64, flare: false, r: 2.1 },  // Claw mid R
        { x: 82, y: 86, flare: false, r: 2.0 }   // Claw low R
      ],
      edges: [[1, 0], [0, 2], [2, 3], [0, 4], [4, 5]]
    },
    {
      id: 'leo',
      name: 'LEO',
      symbol: '♌',
      element: 'Fire',
      accentColor: '#f5c842',
      stars: [
        { x: 16, y: 42, flare: false, r: 2.0 },  // Ras Elased (nose)
        { x: 26, y: 20, flare: false, r: 2.1 },  // Adhafera (crown)
        { x: 44, y: 16, flare: false, r: 2.3 },  // Algieba top
        { x: 42, y: 38, flare: false, r: 2.1 },  // Algieba (neck)
        { x: 46, y: 56, flare: false, r: 1.9 },  // chest
        { x: 48, y: 78, flare: true,  r: 3.8 },  // Regulus (brilliant cross star!)
        { x: 74, y: 42, flare: false, r: 2.3 },  // Zosma (back)
        { x: 92, y: 56, flare: false, r: 2.5 },  // Denebola (tail)
        { x: 70, y: 78, flare: false, r: 2.1 }   // Chertan (hind flank)
      ],
      edges: [
        [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
        [3, 6], [6, 7], [7, 8], [8, 5]
      ]
    },
    {
      id: 'virgo',
      name: 'VIRGO',
      symbol: '♍',
      element: 'Earth',
      accentColor: '#72f2b8',
      stars: [
        { x: 38, y: 32, flare: false, r: 2.3 },  // Porrima
        { x: 20, y: 30, flare: false, r: 1.9 },  // Shoulder
        { x: 12, y: 45, flare: false, r: 1.8 },  // Arm tip
        { x: 28, y: 60, flare: false, r: 2.0 },  // Waist L
        { x: 55, y: 52, flare: false, r: 2.1 },  // Waist R
        { x: 48, y: 72, flare: false, r: 2.1 },  // Hip
        { x: 82, y: 78, flare: true,  r: 3.7 },  // Spica (brilliant cross star!)
        { x: 36, y: 90, flare: false, r: 1.9 },  // Foot
        { x: 56, y: 28, flare: false, r: 1.9 }   // Wing reach
      ],
      edges: [
        [1, 0], [1, 2], [0, 3], [3, 5], [5, 7],
        [0, 8], [8, 4], [4, 5], [4, 6]
      ]
    },
    {
      id: 'libra',
      name: 'LIBRA',
      symbol: '♎',
      element: 'Air',
      accentColor: '#b98eff',
      stars: [
        { x: 48, y: 20, flare: true,  r: 3.2 },  // Zubeneschamali (apex)
        { x: 24, y: 44, flare: true,  r: 3.0 },  // Zubenelgenubi (beam left)
        { x: 74, y: 40, flare: false, r: 2.3 },  // Zubenelhakrabi (beam right)
        { x: 18, y: 72, flare: false, r: 1.9 },  // Pan left hanger
        { x: 34, y: 84, flare: false, r: 2.0 },  // Pan left base
        { x: 80, y: 70, flare: false, r: 1.9 },  // Pan right hanger
        { x: 64, y: 84, flare: false, r: 2.0 }   // Pan right base
      ],
      edges: [[0, 1], [0, 2], [1, 2], [1, 3], [3, 4], [2, 5], [5, 6]]
    },
    {
      id: 'scorpio',
      name: 'SCORPIO',
      symbol: '♏',
      element: 'Water',
      accentColor: '#ff7b72',
      stars: [
        { x: 30, y: 16, flare: false, r: 1.9 },  // Claw L
        { x: 50, y: 12, flare: false, r: 2.0 },  // Claw M
        { x: 70, y: 16, flare: false, r: 1.9 },  // Claw R
        { x: 50, y: 26, flare: false, r: 2.3 },  // Dschubba
        { x: 46, y: 40, flare: true,  r: 3.8 },  // Antares (fire heart sparkle!)
        { x: 44, y: 54, flare: false, r: 2.1 },  // Spine 1
        { x: 42, y: 68, flare: false, r: 2.1 },  // Spine 2
        { x: 46, y: 80, flare: false, r: 2.1 },  // Spine 3
        { x: 58, y: 88, flare: false, r: 2.2 },  // Tail hook
        { x: 74, y: 84, flare: false, r: 2.3 },  // Stinger curve
        { x: 82, y: 70, flare: false, r: 2.3 },  // Shaula
        { x: 84, y: 58, flare: false, r: 2.0 }   // Lesath (stinger tip)
      ],
      edges: [
        [0, 3], [1, 3], [2, 3], [3, 4], [4, 5],
        [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11]
      ]
    },
    {
      id: 'sagittarius',
      name: 'SAGITTARIUS',
      symbol: '♐',
      element: 'Fire',
      accentColor: '#f5c842',
      stars: [
        { x: 48, y: 20, flare: true,  r: 3.4 },  // Kaus Borealis (lid apex)
        { x: 18, y: 44, flare: false, r: 2.1 },  // Spout tip
        { x: 30, y: 54, flare: false, r: 2.1 },  // Spout base
        { x: 46, y: 46, flare: false, r: 2.3 },  // Kaus Media
        { x: 44, y: 72, flare: true,  r: 3.0 },  // Kaus Australis
        { x: 68, y: 44, flare: false, r: 2.3 },  // Nunki
        { x: 66, y: 70, flare: false, r: 2.2 },  // Ascella
        { x: 84, y: 56, flare: false, r: 2.0 },  // Handle outer
        { x: 26, y: 26, flare: false, r: 1.9 },  // Bow top
        { x: 34, y: 86, flare: false, r: 1.9 }   // Bow bottom
      ],
      edges: [
        [0, 3], [0, 5], [3, 5], [3, 4], [5, 6], [4, 6], [5, 7], [6, 7],
        [1, 2], [2, 3], [2, 4], [8, 1], [1, 9]
      ]
    },
    {
      id: 'capricorn',
      name: 'CAPRICORN',
      symbol: '♑',
      element: 'Earth',
      accentColor: '#6bffb8',
      stars: [
        { x: 16, y: 72, flare: true,  r: 3.6 },  // Deneb Algedi (sparkle star at tip)
        { x: 44, y: 28, flare: true,  r: 2.8 },  // Algedi
        { x: 48, y: 18, flare: false, r: 2.0 },  // Horn tip
        { x: 70, y: 32, flare: false, r: 2.1 },  // Back
        { x: 88, y: 46, flare: false, r: 2.1 },  // Tail upper
        { x: 86, y: 72, flare: false, r: 2.2 },  // Tail tip
        { x: 62, y: 84, flare: false, r: 2.1 },  // Belly
        { x: 38, y: 80, flare: false, r: 2.1 }   // Chest
      ],
      edges: [[0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0], [1, 7]]
    },
    {
      id: 'aquarius',
      name: 'AQUARIUS',
      symbol: '♒',
      element: 'Air',
      accentColor: '#99d9ff',
      stars: [
        { x: 48, y: 20, flare: true,  r: 3.6 },  // Sadalmelik (shoulder sparkle)
        { x: 26, y: 36, flare: false, r: 2.1 },  // Sadalsuud
        { x: 68, y: 26, flare: false, r: 2.1 },  // Urn mouth
        // Stream 1 (left cascade)
        { x: 36, y: 52, flare: false, r: 1.9 },
        { x: 44, y: 68, flare: false, r: 2.0 },
        { x: 38, y: 88, flare: false, r: 1.9 },
        // Stream 2 (right cascade)
        { x: 60, y: 48, flare: false, r: 1.9 },
        { x: 74, y: 62, flare: false, r: 2.0 },
        { x: 84, y: 76, flare: false, r: 2.1 },
        { x: 80, y: 92, flare: false, r: 1.9 }
      ],
      edges: [[1, 0], [0, 2], [0, 3], [3, 4], [4, 5], [2, 6], [6, 7], [7, 8], [8, 9]]
    },
    {
      id: 'pisces',
      name: 'PISCES',
      symbol: '♓',
      element: 'Water',
      accentColor: '#80b8ff',
      stars: [
        { x: 18, y: 68, flare: true,  r: 3.4 },  // Alrescha (knot sparkle)
        // Northern ribbon & fish
        { x: 32, y: 54, flare: false, r: 1.9 },
        { x: 48, y: 42, flare: false, r: 2.0 },
        { x: 66, y: 32, flare: false, r: 2.1 },
        { x: 80, y: 22, flare: true,  r: 2.7 },  // Northern fish circlet
        { x: 88, y: 34, flare: false, r: 2.0 },
        { x: 74, y: 42, flare: false, r: 2.0 },
        // Western ribbon & fish
        { x: 28, y: 80, flare: false, r: 1.9 },
        { x: 42, y: 86, flare: false, r: 2.0 },
        { x: 54, y: 84, flare: false, r: 2.0 },
        { x: 48, y: 94, flare: false, r: 1.9 }
      ],
      edges: [
        [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3],
        [0, 7], [7, 8], [8, 9], [9, 10], [10, 8]
      ]
    }
  ];

  // Initialize runtime state for constellations
  const constellations = CONSTELLATIONS_DATA.map((c, idx) => ({
    ...c,
    driftPhase: Math.random() * Math.PI * 2,
    driftSpeed: 0.0006 + Math.random() * 0.0004,
    highlight: 0,            // 0..1 smooth interpolation
    manualHighlightTimer: 0, // seconds to stay highlighted when clicked
    computedX: 0,
    computedY: 0,
    computedSize: 120,
    stars: c.stars.map((s, sIdx) => ({
      ...s,
      phase: Math.random() * Math.PI * 2,
      speed: 0.8 + Math.random() * 0.8,
      px: 0,
      py: 0
    }))
  }));

  /* -----------------------------------------------
     RESIZE & SETUP
     ----------------------------------------------- */
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width  = window.innerWidth;
    height = window.innerHeight;
    canvas.width  = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width  = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    buildAmbientStars();
  }

  function buildAmbientStars() {
    const starColors = [
      'rgba(255, 255, 255,',
      'rgba(215, 235, 255,',
      'rgba(255, 238, 204,',
      'rgba(230, 210, 255,'
    ];
    ambientStars = Array.from({ length: AMBIENT_COUNT }, () => ({
      x:       Math.random() * width,
      y:       Math.random() * height,
      r:       Math.random() * 1.5 + 0.3,
      baseAlpha: Math.random() * 0.5 + 0.3,
      speed:   Math.random() * 0.004 + 0.002,
      phase:   Math.random() * Math.PI * 2,
      color:   starColors[Math.floor(Math.random() * starColors.length)]
    }));
  }

  /* -----------------------------------------------
     SHOOTING STARS (METEORS)
     ----------------------------------------------- */
  function spawnMeteor(time) {
    if (time - lastMeteorTime < 3500 + Math.random() * 3000) return;
    lastMeteorTime = time;

    const angle = (Math.PI / 4) + (Math.random() * 0.3 - 0.15); // ~45 deg downward
    const speed = 14 + Math.random() * 8;
    const startX = Math.random() * width * 0.8;
    const startY = Math.random() * height * 0.35;

    meteors.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      length: 100 + Math.random() * 80,
      life: 1.0,
      decay: 0.02 + Math.random() * 0.015,
      width: 1.8 + Math.random() * 0.8
    });
  }

  function updateMeteors() {
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.x += m.vx;
      m.y += m.vy;
      m.life -= m.decay;
      if (m.life <= 0 || m.x > width + 200 || m.y > height + 200) {
        meteors.splice(i, 1);
      }
    }
  }

  function drawMeteors() {
    meteors.forEach(m => {
      ctx.save();
      const tailX = m.x - (m.vx / 16) * m.length;
      const tailY = m.y - (m.vy / 16) * m.length;

      const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
      grad.addColorStop(0, 'rgba(160, 200, 255, 0)');
      grad.addColorStop(0.7, `rgba(210, 230, 255, ${m.life * 0.6})`);
      grad.addColorStop(1, `rgba(255, 255, 255, ${m.life})`);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(m.x, m.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = m.width;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Glowing head
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.width * 1.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${m.life})`;
      ctx.shadowColor = '#88d4ff';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.restore();
    });
  }

  /* -----------------------------------------------
     DRAWING HELPERS: 4-POINT CROSS FLARE & STAR
     ----------------------------------------------- */
  function drawSparkleCross(x, y, size, alpha, color) {
    ctx.save();
    ctx.translate(x, y);

    // Soft diamond/glow halo
    const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 2.5);
    glowGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.95})`);
    glowGrad.addColorStop(0.25, `${color}${Math.floor(alpha * 120).toString(16).padStart(2, '0')}`);
    glowGrad.addColorStop(1, 'rgba(120, 160, 255, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(0, 0, size * 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 4-pointed primary spikes (horizontal & vertical)
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.shadowColor = color || '#a8c5ff';
    ctx.shadowBlur = 10;

    const spikeLen = size * 3.6;
    const spikeThick = Math.max(1.0, size * 0.32);

    // Horizontal spike
    ctx.beginPath();
    ctx.moveTo(-spikeLen, 0);
    ctx.quadraticCurveTo(0, -spikeThick, spikeLen, 0);
    ctx.quadraticCurveTo(0, spikeThick, -spikeLen, 0);
    ctx.fill();

    // Vertical spike
    ctx.beginPath();
    ctx.moveTo(0, -spikeLen);
    ctx.quadraticCurveTo(-spikeThick, 0, 0, spikeLen);
    ctx.quadraticCurveTo(spikeThick, 0, 0, -spikeLen);
    ctx.fill();

    // Secondary diagonal spikes (smaller, 45 deg)
    const diagLen = size * 1.5;
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.65})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-diagLen, -diagLen);
    ctx.lineTo(diagLen, diagLen);
    ctx.moveTo(-diagLen, diagLen);
    ctx.lineTo(diagLen, -diagLen);
    ctx.stroke();

    // Brilliant white hot star core
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(1.5, size * 0.65), 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.restore();
  }

  function drawConstellationStar(x, y, r, alpha, color) {
    ctx.save();
    // Glowing halo
    const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 3.4);
    glow.addColorStop(0, `rgba(225, 240, 255, ${alpha * 0.9})`);
    glow.addColorStop(0.4, `${color}${Math.floor(alpha * 90).toString(16).padStart(2, '0')}`);
    glow.addColorStop(1, 'rgba(100, 150, 255, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, r * 3.4, 0, Math.PI * 2);
    ctx.fill();

    // Core star
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, alpha * 1.3)})`;
    ctx.shadowColor = color || '#a8c5ff';
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.restore();
  }

  /* -----------------------------------------------
     COMPUTE CONSTELLATION SCREEN POSITIONS
     Balanced framing layout that adapts to any viewport
     ----------------------------------------------- */
  function getLayoutAnchors() {
    const isPortrait = height > width * 1.15;
    if (isPortrait) {
      // 2 columns along sides so central card is clear
      const leftX  = width * 0.16;
      const rightX = width * 0.84;
      const anchors = [];
      for (let i = 0; i < 6; i++) {
        anchors.push({ x: leftX, y: height * (0.09 + (i / 5) * 0.82) });
      }
      for (let i = 0; i < 6; i++) {
        anchors.push({ x: rightX, y: height * (0.09 + (i / 5) * 0.82) });
      }
      return anchors;
    } else {
      // Landscape: 4 corner quadrants matching reference mockup (Aries, Leo, Sagittarius, Pisces)
      return [
        { x: width * 0.11, y: height * 0.22 }, // 0: Aries (Top-Left)
        { x: width * 0.35, y: height * 0.08 }, // 1: Taurus (Top-Mid L)
        { x: width * 0.65, y: height * 0.08 }, // 2: Gemini (Top-Mid R)
        { x: width * 0.75, y: height * 0.16 }, // 3: Cancer (Top-Right inner)
        { x: width * 0.89, y: height * 0.22 }, // 4: Leo (Top-Right)
        { x: width * 0.92, y: height * 0.50 }, // 5: Virgo (Right wing)
        { x: width * 0.75, y: height * 0.88 }, // 6: Libra (Bottom-Right inner)
        { x: width * 0.28, y: height * 0.90 }, // 7: Scorpio (Bottom-Left inner)
        { x: width * 0.12, y: height * 0.78 }, // 8: Sagittarius (Bottom-Left)
        { x: width * 0.07, y: height * 0.50 }, // 9: Capricorn (Left wing)
        { x: width * 0.60, y: height * 0.92 }, // 10: Aquarius (Bottom-Mid R)
        { x: width * 0.90, y: height * 0.78 }, // 11: Pisces (Bottom-Right)
      ];
    }
  }

  // Fixed featured sparkle stars with 4-point flares matching mockup
  const FEATURED_SPARKLE_STARS = [
    { xRel: 0.16, yRel: 0.14, size: 3.5, color: '#fef08a', phase: 0.2, speed: 1.2 },
    { xRel: 0.88, yRel: 0.44, size: 4.8, color: '#ffd56b', phase: 1.5, speed: 0.9 }, // Mockup bright golden flare star below Leo
    { xRel: 0.19, yRel: 0.66, size: 3.6, color: '#99d9ff', phase: 2.8, speed: 1.4 },
    { xRel: 0.84, yRel: 0.84, size: 4.0, color: '#d8b4fe', phase: 4.1, speed: 1.1 },
    { xRel: 0.74, yRel: 0.28, size: 3.2, color: '#ffffff', phase: 5.0, speed: 1.3 },
    { xRel: 0.26, yRel: 0.46, size: 2.8, color: '#fed7aa', phase: 3.4, speed: 1.0 },
  ];

  /* -----------------------------------------------
     MAIN ANIMATION LOOP
     ----------------------------------------------- */
  let lastFrameTime = performance.now();

  function render(now) {
    const dt = Math.min((now - lastFrameTime) / 1000, 0.1);
    lastFrameTime = now;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw Ambient Twinkling Stars
    ambientStars.forEach(s => {
      s.opacity = s.baseAlpha * (0.4 + 0.6 * Math.abs(Math.sin(s.phase + now * s.speed)));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `${s.color} ${s.opacity.toFixed(2)})`;
      ctx.fill();
    });

    // 1b. Featured 4-point Cross Sparkle Stars (Mockup signature celestial flares)
    FEATURED_SPARKLE_STARS.forEach(fs => {
      const sx = fs.xRel * width;
      const sy = fs.yRel * height;
      const t = now * 0.002 * fs.speed + fs.phase;
      const pulse = 0.75 + 0.35 * Math.sin(t);
      const alpha = 0.65 + 0.35 * Math.sin(t * 1.3);
      drawSparkleCross(sx, sy, fs.size * pulse, alpha, fs.color);
    });

    // 2. Meteors / Shooting Stars
    spawnMeteor(now);
    updateMeteors();
    drawMeteors();

    // 3. Layout & Render Zodiac Constellations
    const anchors = getLayoutAnchors();
    const baseSize = Math.max(82, Math.min(150, Math.min(width, height) * 0.135));

    // Mouse parallax offsets
    const parallaxX = isMouseActive ? (mouseX - width / 2) * 0.025 : 0;
    const parallaxY = isMouseActive ? (mouseY - height / 2) * 0.025 : 0;

    constrainActiveBadges();

    const CORNER_CONSTELLATIONS = ['aries', 'leo', 'sagittarius', 'pisces'];

    constellations.forEach((c, idx) => {
      const isCorner = CORNER_CONSTELLATIONS.includes(c.id);

      const anchor = anchors[idx] || { x: width * 0.5, y: height * 0.5 };

      // Gentle orbital celestial drift
      const floatX = Math.sin(now * c.driftSpeed + c.driftPhase) * 10;
      const floatY = Math.cos(now * c.driftSpeed * 0.9 + c.driftPhase) * 8;

      const cx = anchor.x + floatX + parallaxX;
      const cy = anchor.y + floatY + parallaxY;
      const size = baseSize;

      c.computedX = cx;
      c.computedY = cy;
      c.computedSize = size;

      // Mouse proximity detection
      let isNear = false;
      if (isMouseActive) {
        const dx = mouseX - cx;
        const dy = mouseY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < size * 0.95) {
          isNear = true;
        }
      }

      // Update manual highlight timer from clicks / badge hovers
      if (c.manualHighlightTimer > 0) {
        c.manualHighlightTimer -= dt;
        isNear = true;
      }

      // Smooth highlight interpolation
      const targetHighlight = isNear ? 1.0 : 0.0;
      c.highlight += (targetHighlight - c.highlight) * Math.min(dt * 6, 1);

      // If not a featured corner constellation and not currently highlighted/hovered, skip to keep screen clean like mockup
      if (!isCorner && c.highlight < 0.02) {
        return;
      }

      // Precalculate transformed star positions (normalized [0..100] -> canvas px)
      c.stars.forEach(s => {
        s.px = cx + (s.x - 50) * (size / 100);
        s.py = cy + (s.y - 50) * (size / 100);
      });

      const elementGlow = c.accentColor;
      const highlightFactor = c.highlight;

      // --- Draw Constellation Lines ---
      ctx.save();
      const lineAlpha = (0.38 + highlightFactor * 0.52) * (isCorner ? 1 : highlightFactor);
      ctx.lineWidth = 1.0 + highlightFactor * 0.6;
      ctx.strokeStyle = highlightFactor > 0.1
        ? `rgba(220, 240, 255, ${lineAlpha})`
        : `rgba(165, 195, 250, ${lineAlpha})`;
      ctx.shadowColor = elementGlow;
      ctx.shadowBlur = 4 + highlightFactor * 8;

      c.edges.forEach(([i, j]) => {
        const s1 = c.stars[i];
        const s2 = c.stars[j];
        if (!s1 || !s2) return;

        ctx.beginPath();
        ctx.moveTo(s1.px, s1.py);
        ctx.lineTo(s2.px, s2.py);
        ctx.stroke();

        // Stardust pulse packet traversing line
        const pulseProgress = (now * 0.00045 + (i * 0.23 + j * 0.17)) % 1;
        const pulseX = s1.px + (s2.px - s1.px) * pulseProgress;
        const pulseY = s1.py + (s2.py - s1.py) * pulseProgress;

        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 1.1 + highlightFactor * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${(lineAlpha * 0.95).toFixed(2)})`;
        ctx.fill();
      });
      ctx.restore();

      // --- Draw Constellation Stars (Twinkling & 4-Point Cross Flares) ---
      c.stars.forEach(s => {
        // Individual twinkle calculation
        const t = (now * 0.0022 * s.speed) + s.phase;
        const sineWave = 0.55 + 0.45 * Math.sin(t);
        const microFlicker = (Math.sin(t * 3.4) + Math.cos(t * 4.9)) * 0.08;
        const twinkleAlpha = Math.min(1, Math.max(0.25, sineWave + microFlicker));

        // Combined alpha taking highlight into account
        const finalAlpha = Math.min(1, twinkleAlpha * (0.75 + highlightFactor * 0.4)) * (isCorner ? 1 : highlightFactor);
        const finalRadius = s.r * (0.85 + 0.3 * twinkleAlpha) * (1 + highlightFactor * 0.2);

        if (s.flare) {
          // 4-point cross diffraction spikes flare (like reference diagram)
          const flarePulse = (0.85 + 0.35 * Math.sin(t * 1.4 + s.phase)) * (1.0 + highlightFactor * 0.4);
          drawSparkleCross(s.px, s.py, s.r * 2.8 * flarePulse, finalAlpha, elementGlow);
        } else {
          // Regular glowing star vertex
          drawConstellationStar(s.px, s.py, finalRadius, finalAlpha, elementGlow);
        }
      });

      // --- Draw Constellation Label (Matching mockup 4 featured corner labels) ---
      if (isCorner || highlightFactor > 0.25) {
        ctx.save();
        const labelY = cy + size * 0.54;
        const labelAlpha = isCorner ? 0.72 + highlightFactor * 0.28 : highlightFactor;

        ctx.font = '600 11px "Cinzel", "Outfit", serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.letterSpacing = '2.5px';

        ctx.fillStyle = highlightFactor > 0.3
          ? 'rgba(255, 245, 215, 0.98)'
          : `rgba(215, 225, 255, ${labelAlpha.toFixed(2)})`;
        ctx.shadowColor = highlightFactor > 0.3 ? elementGlow : 'rgba(168, 85, 247, 0.5)';
        ctx.shadowBlur = highlightFactor > 0.3 ? 12 : 5;

        // Mockup exact label strings
        let labelText = `${c.symbol}  ${c.name}`;
        if (c.id === 'aries') {
          labelText = 'ARIES';
        }
        ctx.fillText(labelText, cx, labelY);
        ctx.restore();
      }
    });

    requestAnimationFrame(render);
  }

  /* -----------------------------------------------
     SYNC INTERACTION WITH ZODIAC CARDS
     ----------------------------------------------- */
  function constrainActiveBadges() {
    const cards = document.querySelectorAll('.zodiac-card, .zodiac-badge');
    if (!cards.length) return;

    cards.forEach(card => {
      const signId = card.getAttribute('data-sign');
      const c = constellations.find(item => item.id === signId);
      if (c && c.highlight > 0.65 && !card.classList.contains('active')) {
        card.style.borderColor = 'rgba(192, 132, 252, 0.65)';
      } else if (!card.classList.contains('active')) {
        card.style.borderColor = '';
      }
    });
  }

  // Trigger highlight externally (e.g. clicking card on screen)
  triggerConstellationHighlight = function(signId, duration = 3.5) {
    const c = constellations.find(item => item.id === signId.toLowerCase());
    if (c) {
      c.manualHighlightTimer = duration;
      // Add a quick meteor flash near the constellation for cosmic drama!
      meteors.push({
        x: c.computedX - 70,
        y: c.computedY - 60,
        vx: 12,
        vy: 10,
        length: 120,
        life: 1.0,
        decay: 0.025,
        width: 2.2
      });
    }
  };

  /* -----------------------------------------------
     EVENT LISTENERS
     ----------------------------------------------- */
  window.addEventListener('resize', resize);

  window.addEventListener('pointermove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMouseActive = true;
  });

  window.addEventListener('pointerleave', () => {
    isMouseActive = false;
    mouseX = -9999;
    mouseY = -9999;
  });

  // Attach click & hover events to zodiac cards & badges
  function bindZodiacCards() {
    const cards = document.querySelectorAll('.zodiac-card, .zodiac-badge');
    cards.forEach(card => {
      const sign = card.getAttribute('data-sign');
      card.addEventListener('mouseenter', () => {
        if (triggerConstellationHighlight) triggerConstellationHighlight(sign, 2.5);
      });
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        if (triggerConstellationHighlight) triggerConstellationHighlight(sign, 5.0);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindZodiacCards);
  } else {
    bindZodiacCards();
  }

  resize();
  requestAnimationFrame(render);
})();


/* ================================================
   ZODIAC DATA
   ================================================ */
const ZODIAC_SIGNS = [
  { name: 'Capricorn',  symbol: '♑', element: 'Earth', planet: 'Saturn',    startMo: 12, startDay: 22 },
  { name: 'Aquarius',   symbol: '♒', element: 'Air',   planet: 'Uranus',    startMo:  1, startDay: 20 },
  { name: 'Pisces',     symbol: '♓', element: 'Water', planet: 'Neptune',   startMo:  2, startDay: 19 },
  { name: 'Aries',      symbol: '♈', element: 'Fire',  planet: 'Mars',      startMo:  3, startDay: 21 },
  { name: 'Taurus',     symbol: '♉', element: 'Earth', planet: 'Venus',     startMo:  4, startDay: 20 },
  { name: 'Gemini',     symbol: '♊', element: 'Air',   planet: 'Mercury',   startMo:  5, startDay: 21 },
  { name: 'Cancer',     symbol: '♋', element: 'Water', planet: 'Moon',      startMo:  6, startDay: 21 },
  { name: 'Leo',        symbol: '♌', element: 'Fire',  planet: 'Sun',       startMo:  7, startDay: 23 },
  { name: 'Virgo',      symbol: '♍', element: 'Earth', planet: 'Mercury',   startMo:  8, startDay: 23 },
  { name: 'Libra',      symbol: '♎', element: 'Air',   planet: 'Venus',     startMo:  9, startDay: 23 },
  { name: 'Scorpio',    symbol: '♏', element: 'Water', planet: 'Pluto',     startMo: 10, startDay: 23 },
  { name: 'Sagittarius',symbol: '♐', element: 'Fire',  planet: 'Jupiter',   startMo: 11, startDay: 22 },
  { name: 'Capricorn',  symbol: '♑', element: 'Earth', planet: 'Saturn',    startMo: 12, startDay: 22 },
];

const ELEMENT_EMOJI = { Fire: '🔥', Earth: '🌿', Air: '💨', Water: '🌊' };
const ELEMENT_COLOR = {
  Fire:  '#ff8c42',
  Earth: '#6bffb8',
  Air:   '#88d4ff',
  Water: '#6baaff',
};

/**
 * Returns the zodiac sign object for a given month (1-12) and day (1-31).
 */
function getSunSign(month, day) {
  for (let i = 1; i < ZODIAC_SIGNS.length; i++) {
    const cur  = ZODIAC_SIGNS[i];
    const prev = ZODIAC_SIGNS[i - 1];
    if (month === cur.startMo && day >= cur.startDay) {
      return cur;
    }
    if (month === prev.startMo && day < cur.startDay) {
      return prev;
    }
  }
  // December before 22nd → Sagittarius
  return ZODIAC_SIGNS[ZODIAC_SIGNS.length - 1];
}

/**
 * Returns approximate Numerology Life Path number from full DOB string "YYYY-MM-DD".
 */
function getLifePathNumber(dobStr) {
  const digits = dobStr.replace(/-/g, '').split('').map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = String(sum).split('').reduce((a, c) => a + Number(c), 0);
  }
  return sum;
}

/**
 * Formats a date string "YYYY-MM-DD" to "Month D, YYYY".
 */
function formatDate(dobStr) {
  const [year, month, day] = dobStr.split('-').map(Number);
  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  return `${months[month - 1]} ${day}, ${year}`;
}

/**
 * Formats a time string "HH:MM" to "H:MM AM/PM".
 */
function formatTime(timeStr) {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}


/* ================================================
   PROMPT GENERATOR
   ================================================ */
function generateAstrologyPrompt({ name, dob, tob, place, gender, sign }) {
  const formattedDate = formatDate(dob);
  const formattedTime = tob ? formatTime(tob) : 'Unknown';
  const lifePathNum   = getLifePathNumber(dob);
  const genderLine    = gender ? `\n  • Gender          : ${gender}` : '';
  const timeLine      = tob
    ? `\n  • Time of Birth   : ${formattedTime} (local time at ${place})`
    : `\n  • Time of Birth   : Unknown (Rising Sign / Ascendant cannot be precisely calculated)`;

  return `╔══════════════════════════════════════════════════════════════════╗
║              🔮  PERSONALIZED ASTROLOGY READING REQUEST         ║
╚══════════════════════════════════════════════════════════════════╝

You are an expert Western astrologer with deep knowledge of natal charts,
planetary transits, and astrological psychology. Please provide a
comprehensive, deeply personalized astrology reading for the individual
described below.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  BIRTH DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  • Full Name        : ${name}
  • Date of Birth    : ${formattedDate}${timeLine}
  • Place of Birth   : ${place}${genderLine}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  CALCULATED DETAILS (for reference)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  • Sun Sign         : ${sign.symbol} ${sign.name} (${sign.element} sign, ruled by ${sign.planet})
  • Element          : ${sign.element}
  • Ruling Planet    : ${sign.planet}
  • Numerology Life Path : ${lifePathNum}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  READING SCOPE — Please address each section in detail:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 🌟 NATAL CHART OVERVIEW
   • Sun Sign personality traits and core identity
   • Moon Sign emotional nature (estimate if time is unknown)
   • Rising / Ascendant sign (only if birth time is known)
   • Overall chart temperament and dominant energies

2. 🪐 PLANETARY POSITIONS & INFLUENCES
   • Key planetary placements based on date and place of birth
   • Dominant planets and how they shape personality
   • Any notable conjunctions, oppositions, or trines to consider

3. 💼 CAREER & LIFE PURPOSE
   • Natural talents and ideal career paths aligned with their chart
   • 10th House themes (Midheaven) and professional calling
   • Best periods for career growth and advancement

4. 💕 RELATIONSHIPS & LOVE
   • Relationship style, attachment patterns, and compatibility tendencies
   • 7th House themes — what they seek in a partner
   • Current or upcoming relationship transits to watch for

5. 🌿 HEALTH & WELL-BEING
   • Physical constitution based on Sun Sign element (${sign.element})
   • Areas of the body to pay special attention to
   • Lifestyle recommendations in harmony with their chart

6. 🔮 CURRENT LIFE PHASE & PREDICTIONS
   • Major transits currently influencing ${name}'s life (as of ${new Date().toLocaleDateString('en-IN', { year:'numeric', month:'long' })})
   • Upcoming opportunities and challenges in the next 12 months
   • Saturn and Jupiter transits and their impact

7. 🌱 SPIRITUAL GROWTH & SOUL PURPOSE
   • North Node (Rahu) direction — life lessons and karmic path
   • South Node (Ketu) — past-life gifts and patterns to release
   • Spiritual practices best suited for their chart

8. ✨ LUCKY ELEMENTS
   • Lucky numbers, colors, days, and gemstones for ${sign.name}
   • Favorable directions and elements to incorporate daily
   • Affirmations and mantras aligned with ${sign.planet} energy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  TONE & FORMAT INSTRUCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Address the person by their first name (${name.split(' ')[0]}) throughout.
• Be warm, empowering, and insightful — not fatalistic.
• Use clear section headings as listed above.
• Provide specific, actionable guidance — avoid vague generalities.
• Length: Aim for a thorough reading of at least 800–1000 words.
• If birth time is unknown, clearly note when a placement is approximate.

Please begin the reading now.`;
}


/* ================================================
   SCREEN NAVIGATION
   ================================================ */
const screens = {
  welcome: document.getElementById('screen-welcome'),
  form:    document.getElementById('screen-form'),
  result:  document.getElementById('screen-result'),
};

function showScreen(name) {
  Object.entries(screens).forEach(([key, el]) => {
    if (key === name) {
      el.removeAttribute('hidden');
      // Trigger reflow for transition
      void el.offsetWidth;
      el.classList.add('active');
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      el.classList.remove('active');
      setTimeout(() => {
        if (!el.classList.contains('active')) {
          el.setAttribute('hidden', '');
        }
      }, 450);
    }
  });
}


/* ================================================
   FORM VALIDATION
   ================================================ */
function validateField(id, errorId, message) {
  const input = document.getElementById(id);
  const error = document.getElementById(errorId);
  const group = input.closest('.form-group');

  if (!input.value.trim()) {
    input.classList.add('error');
    error.textContent = message;
    group.classList.add('has-error');
    return false;
  }

  input.classList.remove('error');
  error.textContent = '';
  group.classList.remove('has-error');
  return true;
}

function clearError(inputEl, errorId) {
  inputEl.classList.remove('error');
  document.getElementById(errorId).textContent = '';
}


/* ================================================
   EVENT LISTENERS
   ================================================ */

// Navigation Links
document.getElementById('logo-home')?.addEventListener('click', (e) => {
  e.preventDefault();
  showScreen('welcome');
});

document.getElementById('nav-home')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  e.currentTarget.classList.add('active');
  showScreen('welcome');
});

// Modals Helper
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.removeAttribute('hidden');
  }
}
function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.setAttribute('hidden', '');
  }
}

// Nav: Login Modal
document.getElementById('btn-open-login')?.addEventListener('click', () => {
  openModal('modal-login');
});
document.getElementById('btn-close-login')?.addEventListener('click', () => {
  closeModal('modal-login');
});

// Nav: About Modal
document.getElementById('nav-about')?.addEventListener('click', (e) => {
  e.preventDefault();
  openModal('modal-about');
});
document.getElementById('btn-close-about')?.addEventListener('click', () => {
  closeModal('modal-about');
});

// Nav: Features Modal
document.getElementById('nav-features')?.addEventListener('click', (e) => {
  e.preventDefault();
  openModal('modal-features');
});
document.getElementById('btn-close-features')?.addEventListener('click', () => {
  closeModal('modal-features');
});

// Click outside modal card to close
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.setAttribute('hidden', '');
    }
  });
});

// Close modal on Escape
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay').forEach(m => m.setAttribute('hidden', ''));
  }
});

// Login Form Submit Simulation
document.getElementById('form-login')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('.btn-modal-submit');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<span>Signing in...</span>';
  btn.style.opacity = '0.75';
  setTimeout(() => {
    btn.innerHTML = '<span>✓ Welcome Back!</span>';
    btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
    setTimeout(() => {
      closeModal('modal-login');
      btn.innerHTML = originalText;
      btn.style.background = '';
      btn.style.opacity = '';
      // Update nav button to indicate signed in
      const navBtn = document.getElementById('btn-open-login');
      if (navBtn) {
        navBtn.innerHTML = '<span class="nav-login-sparkle">✦</span><span>My Sanctuary</span>';
      }
    }, 600);
  }, 700);
});

// Guest Pass Button
document.getElementById('btn-login-guest')?.addEventListener('click', () => {
  closeModal('modal-login');
  showScreen('form');
});

// Google Login Simulation
document.getElementById('btn-login-google')?.addEventListener('click', function() {
  this.innerHTML = '<span>Connecting...</span>';
  setTimeout(() => {
    closeModal('modal-login');
    const navBtn = document.getElementById('btn-open-login');
    if (navBtn) {
      navBtn.innerHTML = '<span class="nav-login-sparkle">✦</span><span>My Sanctuary</span>';
    }
  }, 600);
});

// Welcome → Form
document.getElementById('btn-start').addEventListener('click', () => {
  showScreen('form');
});

// Form → Welcome
document.getElementById('btn-back').addEventListener('click', () => {
  showScreen('welcome');
});

// Result → Welcome
document.getElementById('btn-restart').addEventListener('click', () => {
  document.getElementById('astro-form').reset();
  document.getElementById('tob-unknown-check').checked = false;
  document.getElementById('input-tob').disabled = false;
  document.getElementById('input-tob').style.opacity = '1';
  showScreen('welcome');
});

// Unknown time toggle
document.getElementById('tob-unknown-check').addEventListener('change', function () {
  const tobInput = document.getElementById('input-tob');
  if (this.checked) {
    tobInput.value = '';
    tobInput.disabled = true;
    tobInput.style.opacity = '0.4';
  } else {
    tobInput.disabled = false;
    tobInput.style.opacity = '1';
  }
});

// Live clear errors on input
['input-name', 'input-dob', 'input-place'].forEach(id => {
  document.getElementById(id).addEventListener('input', function () {
    const errorId = 'error-' + id.replace('input-', '');
    clearError(this, errorId);
  });
});

// Form submit
document.getElementById('astro-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const nameOk  = validateField('input-name',  'error-name',  'Please enter your full name.');
  const dobOk   = validateField('input-dob',   'error-dob',   'Please enter your date of birth.');
  const placeOk = validateField('input-place', 'error-place', 'Please enter your place of birth.');

  if (!nameOk || !dobOk || !placeOk) return;

  const name   = document.getElementById('input-name').value.trim();
  const dob    = document.getElementById('input-dob').value;
  const tob    = document.getElementById('tob-unknown-check').checked
                   ? null
                   : document.getElementById('input-tob').value || null;
  const place  = document.getElementById('input-place').value.trim();
  const gender = document.querySelector('input[name="gender"]:checked')?.value || null;

  // Compute Sun Sign
  const [year, month, day] = dob.split('-').map(Number);
  const sign = getSunSign(month, day);

  // Simulate brief loading
  const btn = document.getElementById('btn-generate');
  btn.classList.add('loading');
  btn.disabled = true;

  setTimeout(() => {
    btn.classList.remove('loading');
    btn.disabled = false;

    // Populate result screen
    populateResult({ name, dob, tob, place, gender, sign });
    showScreen('result');

    // Illuminate their constellation in the cosmos!
    if (typeof triggerConstellationHighlight === 'function') {
      triggerConstellationHighlight(sign.name, 6.0);
    }
  }, 800);
});


/* ================================================
   POPULATE RESULT SCREEN
   ================================================ */
function populateResult({ name, dob, tob, place, gender, sign }) {
  // User summary
  document.getElementById('user-name-display').textContent = name;
  document.getElementById('user-avatar').textContent = sign.symbol;

  const badgeSign = document.getElementById('badge-sign');
  badgeSign.textContent = `${sign.symbol} ${sign.name}`;

  const badgeElement = document.getElementById('badge-element');
  badgeElement.textContent = `${ELEMENT_EMOJI[sign.element]} ${sign.element}`;
  badgeElement.style.color = ELEMENT_COLOR[sign.element];
  badgeElement.style.borderColor = ELEMENT_COLOR[sign.element] + '55';
  badgeElement.style.background = ELEMENT_COLOR[sign.element] + '15';

  document.getElementById('badge-dob').textContent = `📅 ${formatDate(dob)}`;

  // Generate prompt
  const prompt = generateAstrologyPrompt({ name, dob, tob, place, gender, sign });
  document.getElementById('prompt-text').textContent = prompt;
}


/* ================================================
   COPY TO CLIPBOARD
   ================================================ */
document.getElementById('btn-copy').addEventListener('click', async function () {
  const text = document.getElementById('prompt-text').textContent;
  try {
    await navigator.clipboard.writeText(text);
    this.classList.add('copied');
    document.getElementById('copy-icon').textContent  = '✓';
    document.getElementById('copy-label').textContent = 'Copied!';
    setTimeout(() => {
      this.classList.remove('copied');
      document.getElementById('copy-icon').textContent  = '📋';
      document.getElementById('copy-label').textContent = 'Copy Prompt';
    }, 2500);
  } catch {
    // Fallback
    const range = document.createRange();
    range.selectNode(document.getElementById('prompt-text'));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    document.getElementById('copy-label').textContent = 'Copied!';
    setTimeout(() => {
      document.getElementById('copy-label').textContent = 'Copy Prompt';
    }, 2500);
  }
});


/* ================================================
   DOWNLOAD AS TEXT FILE
   ================================================ */
document.getElementById('btn-download').addEventListener('click', function () {
  const text     = document.getElementById('prompt-text').textContent;
  const name     = document.getElementById('user-name-display').textContent || 'person';
  const filename = `AstroTalk_${name.replace(/\s+/g, '_')}_Reading.txt`;
  const blob     = new Blob([text], { type: 'text/plain' });
  const url      = URL.createObjectURL(blob);
  const a        = document.createElement('a');
  a.href         = url;
  a.download     = filename;
  a.click();
  URL.revokeObjectURL(url);
});


/* ================================================
   INITIAL SCREEN
   ================================================ */
window.addEventListener('DOMContentLoaded', () => {
  // Trigger welcome screen entrance
  requestAnimationFrame(() => {
    screens.welcome.classList.add('active');
  });
});
