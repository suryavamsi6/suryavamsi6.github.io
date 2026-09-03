/* ============================================================
   SURYA VAMSI — Portfolio v2 interactions
   Three.js 3D background + premium interactions
   ============================================================ */

(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = window.matchMedia('(min-width: 901px)').matches;

  /* ---------- Year stamp ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- THREE.JS 3D BACKGROUND ---------- */
  if (!prefersReducedMotion && typeof THREE !== 'undefined') {
    const canvas = document.getElementById('three-canvas');
    if (canvas) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 30;

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);

      /* --- Floating geometry --- */
      const geometries = [];
      const materials = [
        new THREE.MeshPhongMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.15, wireframe: true }),
        new THREE.MeshPhongMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.12, wireframe: true }),
        new THREE.MeshPhongMaterial({ color: 0xf472b6, transparent: true, opacity: 0.10, wireframe: true }),
        new THREE.MeshPhongMaterial({ color: 0x34d399, transparent: true, opacity: 0.08, wireframe: true }),
      ];

      const shapes = [
        new THREE.IcosahedronGeometry(2, 0),
        new THREE.OctahedronGeometry(1.8, 0),
        new THREE.TorusGeometry(1.5, 0.4, 8, 16),
        new THREE.DodecahedronGeometry(1.6, 0),
        new THREE.TetrahedronGeometry(1.5, 0),
        new THREE.TorusKnotGeometry(1.2, 0.35, 64, 8),
        new THREE.IcosahedronGeometry(2.5, 1),
        new THREE.OctahedronGeometry(2, 1),
      ];

      for (let i = 0; i < 14; i++) {
        const geo = shapes[i % shapes.length];
        const mat = materials[i % materials.length];
        const mesh = new THREE.Mesh(geo, mat);

        const spread = 40;
        mesh.position.set(
          (Math.random() - 0.5) * spread,
          (Math.random() - 0.5) * spread,
          (Math.random() - 0.5) * 20 - 5
        );

        const scale = 0.3 + Math.random() * 0.7;
        mesh.scale.setScalar(scale);

        mesh.userData = {
          rotSpeed: { x: (Math.random() - 0.5) * 0.005, y: (Math.random() - 0.5) * 0.005, z: (Math.random() - 0.5) * 0.003 },
          floatSpeed: 0.3 + Math.random() * 0.5,
          floatAmp: 0.5 + Math.random() * 1.5,
          initialY: mesh.position.y,
          phase: Math.random() * Math.PI * 2,
        };

        scene.add(mesh);
        geometries.push(mesh);
      }

      /* --- Particle field --- */
      const particleCount = 200;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3]     = (Math.random() - 0.5) * 60;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
      }
      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particleMat = new THREE.PointsMaterial({ color: 0xa78bfa, size: 0.06, transparent: true, opacity: 0.4 });
      const particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);

      /* --- Lights --- */
      const ambientLight = new THREE.AmbientLight(0x404060, 0.5);
      scene.add(ambientLight);

      const pointLight1 = new THREE.PointLight(0xa78bfa, 1, 60);
      pointLight1.position.set(10, 10, 10);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0x06b6d4, 0.8, 50);
      pointLight2.position.set(-10, -5, 5);
      scene.add(pointLight2);

      /* --- Mouse interaction --- */
      let mouseX = 0, mouseY = 0;
      document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      }, { passive: true });

      /* --- Animate --- */
      let scrollY = 0;
      window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

      const animate = () => {
        requestAnimationFrame(animate);
        const time = performance.now() * 0.001;

        geometries.forEach((mesh) => {
          const d = mesh.userData;
          mesh.rotation.x += d.rotSpeed.x;
          mesh.rotation.y += d.rotSpeed.y;
          mesh.rotation.z += d.rotSpeed.z;
          mesh.position.y = d.initialY + Math.sin(time * d.floatSpeed + d.phase) * d.floatAmp;
        });

        particles.rotation.y = time * 0.02;
        particles.rotation.x = time * 0.01;

        camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 2 - camera.position.y) * 0.02;
        camera.position.z = 30 - scrollY * 0.005;
        camera.lookAt(0, -scrollY * 0.01, 0);

        pointLight1.position.x = Math.sin(time * 0.3) * 15;
        pointLight1.position.y = Math.cos(time * 0.2) * 10;
        pointLight2.position.x = Math.cos(time * 0.4) * 12;

        renderer.render(scene, camera);
      };
      animate();

      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });
    }
  }

  /* ---------- Header scroll ---------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (window.scrollY > 12) header?.classList.add('scrolled');
    else header?.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });
    nav.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  /* ---------- Custom cursor ---------- */
  if (isDesktop && !prefersReducedMotion) {
    const ring = document.querySelector('.cursor-ring');
    const glow = document.querySelector('.cursor-glow');
    let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    let rx = cx, ry = cy;
    let gx = cx, gy = cy;

    requestAnimationFrame(() => {
      ring?.classList.add('active');
      glow?.classList.add('active');
    });

    window.addEventListener('mousemove', (e) => {
      cx = e.clientX;
      cy = e.clientY;
    }, { passive: true });

    const tick = () => {
      rx += (cx - rx) * 0.3;
      ry += (cy - ry) * 0.3;
      gx += (cx - gx) * 0.1;
      gy += (cy - gy) * 0.1;
      if (ring) ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      if (glow) glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    };
    tick();

    const hoverEls = document.querySelectorAll('a, button, .bento-card, .social-card');
    hoverEls.forEach((el) => {
      el.addEventListener('mouseenter', () => ring?.classList.add('hovered'));
      el.addEventListener('mouseleave', () => ring?.classList.remove('hovered'));
    });
  }

  /* ---------- Bento card glow ---------- */
  if (isDesktop) {
    document.querySelectorAll('.bento-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100) + '%');
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  revealEls.forEach((el) => {
    const delay = el.dataset.revealDelay;
    if (delay) el.style.setProperty('--delay', `${delay}ms`);
  });

  const revealAll = () => revealEls.forEach((el) => el.classList.add('visible'));

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const vh = window.innerHeight;
    const targets = [];
    revealEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top >= vh) {
        el.classList.add('pending');
        targets.push(el);
      } else {
        el.classList.add('visible');
      }
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.classList.remove('pending');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -10% 0px' }
    );
    targets.forEach((el) => io.observe(el));
  } else {
    revealAll();
  }

  setTimeout(() => {
    document.querySelectorAll('.reveal.pending').forEach((el) => el.classList.add('visible'));
  }, 1200);

  /* ---------- Count-up ---------- */
  const counters = document.querySelectorAll('.stat-value[data-target]');
  const animateCount = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const start = parseInt(el.textContent, 10) || 0;
    const duration = 1400;
    const startTime = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);

    const step = (now) => {
      const t = Math.min(1, (now - startTime) / duration);
      el.textContent = Math.round(start + (target - start) * ease(t)) + suffix;
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            co.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((c) => co.observe(c));
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- Copy email ---------- */
  const copyBtn = document.getElementById('copyEmail');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const email = 'd.suryavamsi@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = email;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (_) {}
        ta.remove();
      }
      copyBtn.classList.add('copied');
      setTimeout(() => copyBtn.classList.remove('copied'), 1800);
    });
  }

  /* ---------- Live GitHub stats ---------- */
  const setStat = (selector, value) => {
    const el = document.querySelector(selector);
    if (!el) return;
    el.dataset.target = String(value);
    if (!el.classList.contains('visible')) el.textContent = value + (el.dataset.suffix || '');
    else animateCount(el);
  };

  const fetchGitHubStats = async () => {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 4000);
      const res = await fetch('https://api.github.com/users/suryavamsi6', { signal: ctrl.signal });
      clearTimeout(t);
      if (!res.ok) throw new Error('GitHub API non-OK');
      const data = await res.json();
      if (typeof data.public_repos === 'number') setStat('.stat-card:nth-child(1) .stat-value', data.public_repos);
      if (data.created_at) {
        const years = new Date().getFullYear() - new Date(data.created_at).getFullYear();
        setStat('.stat-card:nth-child(2) .stat-value', years);
      }
      if (typeof data.followers === 'number') setStat('.stat-card:nth-child(3) .stat-value', data.followers);
    } catch (_) {}
  };
  fetchGitHubStats();

  /* ---------- Smooth anchor scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Hero parallax ---------- */
  if (isDesktop && !prefersReducedMotion) {
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
      window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 14;
        const y = (e.clientY / window.innerHeight - 0.5) * 14;
        heroVisual.style.transform = `translate(${x}px, ${y}px)`;
      }, { passive: true });
    }
  }
})();
