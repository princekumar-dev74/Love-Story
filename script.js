const CONFIG = {
  yourName: "Arjun",
  partnerName: "Riya",
  birthdayName: "Riya",
  namesLine: "Arjun & Riya",
  togetherSince: "2021-03-14",
  letterDate: "June 2025",

  date1: "Spring 2021",
  date2: "March 2021",
  date3: "Summer 2021",
  date4: "2022 — onwards",
  date5: "Today & Always",
};

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max));
const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function applyConfig() {
  $$("[data-cfg]").forEach((el) => {
    const key = el.dataset.cfg;
    if (CONFIG[key] !== undefined) {
      el.textContent = CONFIG[key];
    }
  });

  const letterDateEl = $("#letterDate");
  if (letterDateEl) {
    letterDateEl.textContent = `— ${CONFIG.letterDate} —`;
  }
}

function initDayCounter() {
  const el = $("#dayCount");
  if (!el) return;

  const start = new Date(CONFIG.togetherSince);
  if (isNaN(start.getTime())) {
    el.textContent = "∞";
    return;
  }

  const totalDays = Math.max(
    0,
    Math.floor((Date.now() - start.getTime()) / 86400000),
  );
  let current = 0;

  if (prefersReducedMotion()) {
    el.textContent = totalDays.toLocaleString();
    return;
  }

  const duration = 2800;
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const progress = clamp(elapsed / duration, 0, 1);

    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const value = Math.round(eased * totalDays);

    if (value !== current) {
      current = value;
      el.textContent = current.toLocaleString();
    }
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = totalDays.toLocaleString();
  }

  setTimeout(() => requestAnimationFrame(tick), 1600);
}

function initPreloader() {
  const loader = $("#preloader");
  if (!loader) return;

  function dismiss() {
    loader.classList.add("fade-out");
    loader.addEventListener(
      "transitionend",
      () => {
        loader.classList.add("gone");
      },
      { once: true },
    );
  }

  const timeout = prefersReducedMotion() ? 200 : 2500;
  setTimeout(dismiss, timeout);
}

function initEnvelope() {
  const intro = $("#envelope-intro");
  const scene = $("#envelopeScene");
  const wrap = $("#envelopeWrap");
  const flap = $("#envFlap");
  const seal = $("#envSeal");
  const letter = $("#envLetter");
  const b1 = $("#butterfly1");
  const b2 = $("#butterfly2");

  if (!intro || !scene) return;

  let opened = false;

  function openEnvelope() {
    if (opened) return;
    opened = true;

    scene.style.cursor = "default";
    scene.setAttribute("aria-label", "Letter is opening");

    seal && seal.classList.add("breaking");

    setTimeout(() => {
      flap && flap.classList.add("open");
    }, 350);

    setTimeout(() => {
      letter && letter.classList.add("rising");
    }, 700);

    setTimeout(() => {
      if (b1) b1.classList.add("fly-left");
      if (b2) b2.classList.add("fly-right");
    }, 900);

    setTimeout(() => {
      intro.classList.add("exit");
      document.body.classList.remove("no-scroll");
    }, 1600);

    setTimeout(() => {
      intro.classList.add("gone");
    }, 2700);
  }

  scene.addEventListener("click", openEnvelope);
  scene.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openEnvelope();
    }
  });

  const replayBtn = $("#replayBtn");
  if (replayBtn) {
    function replay(e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "instant" });
      intro.classList.remove("exit", "gone");
      document.body.classList.add("no-scroll");

      opened = false;
      scene.style.cursor = "pointer";
      if (flap) flap.classList.remove("open");
      if (seal) seal.classList.remove("breaking");
      if (letter) letter.classList.remove("rising");
      if (b1) {
        b1.classList.remove("fly-left");
      }
      if (b2) {
        b2.classList.remove("fly-right");
      }
    }
    replayBtn.addEventListener("click", replay);
    replayBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") replay(e);
    });
  }
}

function initNav() {
  const nav = $("#main-nav");
  const burger = $("#navBurger");
  const links = $(".nav__links");

  if (!nav) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (burger && links) {
    let menuOpen = false;

    function toggleMenu() {
      menuOpen = !menuOpen;
      burger.setAttribute("aria-expanded", menuOpen);

      if (menuOpen) {
        links.style.display = "flex";
        links.style.flexDirection = "column";
        links.style.position = "absolute";
        links.style.top = "100%";
        links.style.left = "0";
        links.style.right = "0";
        links.style.background = "rgba(255,246,248,0.97)";
        links.style.backdropFilter = "blur(18px)";
        links.style.padding = "1rem 1.5rem 1.5rem";
        links.style.boxShadow = "0 8px 24px rgba(107,40,64,0.15)";
        links.style.gap = "0.75rem";

        const lines = $$(".nav__burger-line", burger);
        if (lines[0])
          lines[0].style.transform = "translateY(7px) rotate(45deg)";
        if (lines[1]) lines[1].style.opacity = "0";
        if (lines[2])
          lines[2].style.transform = "translateY(-7px) rotate(-45deg)";
      } else {
        links.style.display = "";
        links.style.flexDirection = "";
        links.style.position = "";
        links.style.top = "";
        links.style.left = "";
        links.style.right = "";
        links.style.background = "";
        links.style.backdropFilter = "";
        links.style.padding = "";
        links.style.boxShadow = "";
        links.style.gap = "";
        const lines = $$(".nav__burger-line", burger);
        if (lines[0]) lines[0].style.transform = "";
        if (lines[1]) lines[1].style.opacity = "";
        if (lines[2]) lines[2].style.transform = "";
      }
    }

    burger.addEventListener("click", toggleMenu);

    $$(".nav__link, .nav__cta", links).forEach((link) => {
      link.addEventListener("click", () => {
        if (menuOpen) toggleMenu();
      });
    });
  }
}

function initScrollReveal() {
  const revealEls = $$(
    ".reveal-up, .reveal-left, .reveal-right, .reveal-scale",
  );

  if (prefersReducedMotion()) {
    revealEls.forEach((el) => el.classList.add("visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  revealEls.forEach((el) => io.observe(el));
}

function initPetalCanvas() {
  if (prefersReducedMotion()) return;

  const canvas = $("#petal-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  const PETAL_COLORS = [
    "rgba(232,138,160,VAL)",
    "rgba(246,199,212,VAL)",
    "rgba(201, 66,104,VAL)",
    "rgba(255,204,220,VAL)",
    "rgba(255,180,200,VAL)",
    "rgba(217,160, 91,VAL)",
  ];

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = rand(0, canvas.width);
      this.y = initial ? rand(-canvas.height, 0) : rand(-60, -10);
      this.size = rand(6, 18);
      this.speedY = rand(0.4, 1.2);
      this.speedX = rand(-0.4, 0.4);
      this.rot = rand(0, Math.PI * 2);
      this.rotSpeed = rand(-0.02, 0.02);
      this.wobble = rand(0, Math.PI * 2);
      this.wobbleSpeed = rand(0.01, 0.04);
      this.opacity = rand(0.35, 0.75);
      this.colorTemplate = PETAL_COLORS[randInt(0, PETAL_COLORS.length)];
      this.scaleX = rand(0.5, 1.0);
    }

    update() {
      this.wobble += this.wobbleSpeed;
      this.x += this.speedX + Math.sin(this.wobble) * 0.35;
      this.y += this.speedY;
      this.rot += this.rotSpeed;

      if (this.y > canvas.height + 30) this.reset();
    }

    draw() {
      const color = this.colorTemplate.replace("VAL", this.opacity.toFixed(2));
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.scale(this.scaleX, 1);
      ctx.beginPath();

      ctx.ellipse(0, 0, this.size * 0.5, this.size, 0, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(
        -this.size * 0.1,
        -this.size * 0.25,
        this.size * 0.12,
        this.size * 0.3,
        -0.2,
        0,
        Math.PI * 2,
      );
      ctx.fillStyle = `rgba(255,255,255,${(this.opacity * 0.35).toFixed(2)})`;
      ctx.fill();
      ctx.restore();
    }
  }

  const PETAL_COUNT = Math.min(28, Math.floor(canvas.width / 55));
  const petals = Array.from({ length: PETAL_COUNT }, () => new Petal());

  let raf;
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach((p) => {
      p.update();
      p.draw();
    });
    raf = requestAnimationFrame(loop);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else loop();
  });

  loop();
}

function initHeroParallax() {
  if (prefersReducedMotion()) return;
  const hero = $("#hero");
  if (!hero) return;

  const layers = [
    { el: hero.querySelector(".hero__scene-svg"), depth: 0.015 },
    { el: hero.querySelector(".hero__content"), depth: -0.008 },
  ];

  let tX = 0,
    tY = 0,
    cX = 0,
    cY = 0;

  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    tX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    tY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  });

  function animate() {
    cX = lerp(cX, tX, 0.06);
    cY = lerp(cY, tY, 0.06);

    layers.forEach(({ el, depth }) => {
      if (el) {
        el.style.transform = `translate(${cX * depth * 40}px, ${cY * depth * 30}px)`;
      }
    });
    requestAnimationFrame(animate);
  }

  animate();
}

function initBirthday() {
  const btn = $("#blowBtn");
  const cakeScene = $("#cakeScene");
  const wish = $("#bdayWish");
  const confetti = $("#bdayConfetti");

  if (!btn) return;

  const CONFETTI_COLORS = [
    "#e05080",
    "#d09500",
    "#9ab850",
    "#8b5cf6",
    "#f6c7d4",
    "#ffd54f",
    "#aae0a0",
    "#c4a0f8",
    "#ff8faa",
    "#ffe066",
    "#4088cc",
    "#ff5090",
  ];
  const CONFETTI_SHAPES = ["circle", "rect", "ribbon"];

  class ConfettiPiece {
    constructor() {
      this.x = rand(0, confetti.offsetWidth || window.innerWidth);
      this.y = rand(-20, -80);
      this.size = rand(5, 12);
      this.color = CONFETTI_COLORS[randInt(0, CONFETTI_COLORS.length)];
      this.shape = CONFETTI_SHAPES[randInt(0, CONFETTI_SHAPES.length)];
      this.speedX = rand(-1.8, 1.8);
      this.speedY = rand(2.5, 5.5);
      this.rot = rand(0, 360);
      this.rotSpeed = rand(-6, 6);
      this.opacity = 1;
      this.gravityY = rand(0.04, 0.12);
      this.wobble = rand(0, Math.PI * 2);
      this.wobbleAmp = rand(0.3, 1.0);

      this.el = document.createElement("div");
      this.el.style.cssText = `
        position:absolute;
        left:${this.x}px;
        top:${this.y}px;
        width:${this.shape === "ribbon" ? this.size * 0.4 : this.size}px;
        height:${this.shape === "ribbon" ? this.size * 2.5 : this.size}px;
        background:${this.color};
        border-radius:${this.shape === "circle" ? "50%" : this.shape === "rect" ? "1px" : "1px"};
        opacity:1;
        pointer-events:none;
        will-change:transform;
        transform-origin:center center;
      `;
      confetti.appendChild(this.el);
    }

    update() {
      this.wobble += 0.08;
      this.speedY += this.gravityY;
      this.x += this.speedX + Math.sin(this.wobble) * this.wobbleAmp;
      this.y += this.speedY;
      this.rot += this.rotSpeed;
      this.opacity -= 0.008;

      this.el.style.left = `${this.x}px`;
      this.el.style.top = `${this.y}px`;
      this.el.style.opacity = `${clamp(this.opacity, 0, 1)}`;
      this.el.style.transform = `rotate(${this.rot}deg)`;

      return this.opacity > 0 && this.y < window.innerHeight + 60;
    }

    destroy() {
      this.el.remove();
    }
  }

  function launchConfetti() {
    if (prefersReducedMotion()) return;
    const count = 90;
    const pieces = [];

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        pieces.push(new ConfettiPiece());
      }, i * 18);
    }

    function animateConfetti() {
      let alive = false;
      for (let i = pieces.length - 1; i >= 0; i--) {
        if (pieces[i].update()) {
          alive = true;
        } else {
          pieces[i].destroy();
          pieces.splice(i, 1);
        }
      }
      if (alive || pieces.length > 0) requestAnimationFrame(animateConfetti);
    }
    requestAnimationFrame(animateConfetti);
  }

  function launchFireworks() {
    if (prefersReducedMotion()) return;

    const positions = [20, 50, 80];
    positions.forEach((xPct, i) => {
      setTimeout(() => {
        const burst = document.createElement("div");
        burst.style.cssText = `
          position:absolute;
          left:${xPct}%;
          bottom:10%;
          width:6px;
          height:6px;
          border-radius:50%;
          background:${CONFETTI_COLORS[randInt(0, CONFETTI_COLORS.length)]};
          pointer-events:none;
          box-shadow:0 0 8px 4px currentColor;
          animation:firework-launch 0.7s ease-out forwards;
        `;
        confetti.appendChild(burst);
        burst.addEventListener(
          "animationend",
          () => {
            burst.remove();

            const centerX = (confetti.offsetWidth * xPct) / 100;
            const centerY = confetti.offsetHeight * 0.1;
            const numParticles = 16;
            for (let j = 0; j < numParticles; j++) {
              const angle = (j / numParticles) * Math.PI * 2;
              const dist = rand(40, 90);
              const dx = Math.cos(angle) * dist;
              const dy = Math.sin(angle) * dist;
              const p = document.createElement("div");
              const color = CONFETTI_COLORS[randInt(0, CONFETTI_COLORS.length)];
              p.style.cssText = `
              position:absolute;
              left:${centerX}px;
              top:${centerY}px;
              width:5px;
              height:5px;
              border-radius:50%;
              background:${color};
              pointer-events:none;
              --dx:${dx}px;
              --dy:${dy}px;
              animation:firework-burst-particle 0.9s ease-out forwards;
            `;
              confetti.appendChild(p);
              p.addEventListener("animationend", () => p.remove(), {
                once: true,
              });
            }
          },
          { once: true },
        );
      }, i * 300);
    });
  }

  btn.addEventListener("click", () => {
    if (btn.disabled) return;
    btn.disabled = true;
    btn.textContent = "Wish made ✨";

    cakeScene && cakeScene.classList.add("blown");
    $$(".flame-group").forEach((fg) => {
      fg.style.opacity = "0";
      fg.style.transition = "opacity 0.4s ease";
    });
    $$(".smoke-group").forEach((sg) => {
      sg.style.opacity = "1";
      sg.style.transition = "opacity 0.3s ease 0.3s";
    });

    setTimeout(() => {
      wish && wish.classList.add("show");
    }, 700);

    setTimeout(() => {
      launchConfetti();
      launchFireworks();
    }, 900);

    setTimeout(launchConfetti, 2200);
  });
}

function initTimelineInteractions() {
  $$(".t-chapter").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      const ill = card.querySelector(".t-chapter__illustration");
      if (ill) ill.style.transform = "scale(1.03)";
      ill && (ill.style.transition = "transform 0.4s ease");
    });
    card.addEventListener("mouseleave", () => {
      const ill = card.querySelector(".t-chapter__illustration");
      if (ill) ill.style.transform = "";
    });
  });
}

function initGalleryLightbox() {
  const polaroids = $$(".polaroid");
  if (!polaroids.length) return;

  const backdrop = document.createElement("div");
  backdrop.style.cssText = `
    position:fixed; inset:0; z-index:300;
    background:rgba(15,5,32,0.88);
    display:none; align-items:center; justify-content:center;
    cursor:pointer; backdrop-filter:blur(8px);
  `;
  document.body.appendChild(backdrop);

  const enlarged = document.createElement("div");
  enlarged.style.cssText = `
    max-width:min(420px,88vw);
    background:var(--cream-warm);
    padding:0.8rem 0.8rem 1.5rem;
    border-radius:5px;
    box-shadow:0 30px 80px rgba(0,0,0,0.6);
    transform:scale(0.88);
    opacity:0;
    transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease;
    cursor:default;
  `;
  backdrop.appendChild(enlarged);

  function openCard(polaroid) {
    const clone = polaroid.cloneNode(true);
    clone.style.transform = "none";
    clone.style.cursor = "default";
    clone.style.boxShadow = "none";
    enlarged.innerHTML = "";
    enlarged.appendChild(clone);

    backdrop.style.display = "flex";
    requestAnimationFrame(() => {
      enlarged.style.transform = "scale(1)";
      enlarged.style.opacity = "1";
    });
  }

  function close() {
    enlarged.style.transform = "scale(0.88)";
    enlarged.style.opacity = "0";
    setTimeout(() => {
      backdrop.style.display = "none";
      enlarged.innerHTML = "";
    }, 350);
  }

  polaroids.forEach((p) => {
    p.style.cursor = "pointer";
    p.addEventListener("click", () => openCard(p));
  });

  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

function initLetterReveal() {
  const letterCard = $(".letter-card");
  if (!letterCard || prefersReducedMotion()) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          $$("p", letterCard).forEach((p, i) => {
            p.style.opacity = "0";
            p.style.transform = "translateY(10px)";
            p.style.transition = `opacity 0.7s ease ${i * 0.18 + 0.2}s, transform 0.7s ease ${i * 0.18 + 0.2}s`;
            requestAnimationFrame(() => {
              p.style.opacity = "1";
              p.style.transform = "";
            });
          });
          io.unobserve(letterCard);
        }
      });
    },
    { threshold: 0.3 },
  );

  io.observe(letterCard);
}

function initCursorSparkles() {
  if (prefersReducedMotion()) return;

  if ("ontouchstart" in window) return;

  const SPARK_COLORS = [
    "var(--rose-400)",
    "var(--gold-300)",
    "var(--rose-200)",
    "#fff",
  ];
  let lastX = 0,
    lastY = 0,
    sparkTimer = null;

  document.addEventListener("mousemove", (e) => {
    const dx = Math.abs(e.clientX - lastX);
    const dy = Math.abs(e.clientY - lastY);
    if (dx + dy < 8) return;
    lastX = e.clientX;
    lastY = e.clientY;

    clearTimeout(sparkTimer);
    sparkTimer = setTimeout(() => {}, 0);

    if (Math.random() > 0.25) return;

    const spark = document.createElement("div");
    const size = rand(4, 10);
    const color = SPARK_COLORS[randInt(0, SPARK_COLORS.length)];
    const angle = rand(0, 360);
    const drift = rand(18, 42);

    spark.style.cssText = `
      position:fixed;
      left:${e.clientX - size / 2}px;
      top:${e.clientY - size / 2}px;
      width:${size}px;
      height:${size}px;
      border-radius:50%;
      background:${color};
      pointer-events:none;
      z-index:9999;
      opacity:0.85;
      transform:scale(1);
      transition:
        transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94),
        opacity 0.7s ease,
        left 0.7s ease,
        top 0.7s ease;
    `;
    document.body.appendChild(spark);

    const rad = (angle * Math.PI) / 180;
    requestAnimationFrame(() => {
      spark.style.left = `${e.clientX + Math.cos(rad) * drift - size / 2}px`;
      spark.style.top = `${e.clientY + Math.sin(rad) * drift - size / 2}px`;
      spark.style.opacity = "0";
      spark.style.transform = "scale(0.1)";
    });

    setTimeout(() => spark.remove(), 750);
  });
}

function initSmoothScroll() {
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href").slice(1);
      const target = id ? document.getElementById(id) : null;
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

function initHeroClickEffect() {
  if (prefersReducedMotion()) return;
  const hero = $("#hero");
  if (!hero) return;

  hero.addEventListener("click", (e) => {
    if (e.target.closest("a, button")) return;

    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (let i = 0; i < 6; i++) {
      const h = document.createElement("div");
      const angle = (i / 6) * Math.PI * 2;
      const dist = rand(20, 50);
      h.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24"><path d="M12 21C12 21 3 15.5 3 9.2 3 6.3 5.2 4 7.8 4c1.6 0 3.1.9 4.2 2.3C13.1 4.9 14.6 4 16.2 4 18.8 4 21 6.3 21 9.2 21 15.5 12 21 12 21Z" fill="var(--rose-300)"/></svg>`;
      h.style.cssText = `
        position:absolute;
        left:${x}px; top:${y}px;
        pointer-events:none; z-index:50;
        opacity:1;
        transition: all 0.8s ease-out;
      `;
      hero.appendChild(h);

      requestAnimationFrame(() => {
        h.style.left = `${x + Math.cos(angle) * dist}px`;
        h.style.top = `${y + Math.sin(angle) * dist}px`;
        h.style.opacity = "0";
        h.style.transform = "scale(0.3)";
      });

      setTimeout(() => h.remove(), 850);
    }
  });
}

function initActiveSection() {
  const sections = $$("section[id]");
  const navLinks = $$(".nav__link");

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.style.color =
              link.getAttribute("href") === `#${id}` ? "var(--wine-500)" : "";
          });
        }
      });
    },
    { rootMargin: "-40% 0px -40% 0px" },
  );

  sections.forEach((s) => io.observe(s));
}

function initMomentCardTilt() {
  if (prefersReducedMotion()) return;
  if ("ontouchstart" in window) return;

  $$(".moment-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const tiltX = clamp(dy * -6, -6, 6);
      const tiltY = clamp(dx * 6, -6, 6);
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

function initTimelineProgress() {
  if (prefersReducedMotion()) return;
  const timeline = $(".timeline");
  if (!timeline) return;

  const progressLine = document.createElement("div");
  progressLine.style.cssText = `
    position:absolute;
    left:50%;
    top:0;
    width:2px;
    height:0%;
    background:linear-gradient(var(--rose-400), var(--gold-400));
    transform:translateX(-50%);
    z-index:2;
    transition:height 0.1s linear;
    pointer-events:none;
  `;
  timeline.style.position = "relative";

  timeline.insertBefore(progressLine, timeline.firstChild);

  function updateProgress() {
    const rect = timeline.getBoundingClientRect();
    const viewH = window.innerHeight;
    if (rect.top > viewH || rect.bottom < 0) return;

    const scrolled = clamp((viewH - rect.top) / (rect.height + viewH), 0, 1);
    progressLine.style.height = `${scrolled * 100}%`;
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
}

function boot() {
  applyConfig();
  initPreloader();
  initEnvelope();
  initNav();
  initScrollReveal();
  initDayCounter();
  initPetalCanvas();
  initHeroParallax();
  initBirthday();
  initTimelineInteractions();
  initGalleryLightbox();
  initLetterReveal();
  initCursorSparkles();
  initSmoothScroll();
  initHeroClickEffect();
  initActiveSection();
  initMomentCardTilt();
  initTimelineProgress();

  if (window.innerWidth <= 680) {
    const nav = $(".nav__links");
    if (nav) nav.style.display = "none";
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
