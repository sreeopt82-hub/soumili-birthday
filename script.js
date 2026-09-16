(() => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  const openBtn = $("#openBtn");
  const continueBtn = $("#continueBtn");
  const typeText = $("#typeText");
  const heartField = $("#heartField");
  const toast = $("#toast");
  const memoryTitle = $("#memoryTitle");
  const memoryCopy = $("#memoryCopy");
  const lightbox = $("#lightbox");
  const lightboxImg = $("#lightboxImg");
  const lightboxCaption = $("#lightboxCaption");

  const story = `Sometimes I still think about how strangely beautiful life can be. Out of all the people in this world, one simple story reply became the beginning of something I never imagined would become such an important part of my life. From those first conversations to all the laughs, late-night talks, silly moments, little fights and countless memories — somehow, you became my person.`;

  function hearts(count = 14) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    for (let i = 0; i < count; i++) {
      const h = document.createElement("span");
      h.className = "floating-heart";
      h.textContent = ["♡","♥","✦"][Math.floor(Math.random()*3)];
      h.style.left = `${8 + Math.random()*84}%`;
      h.style.bottom = `${-5 + Math.random()*15}%`;
      h.style.animationDelay = `${Math.random()*.45}s`;
      h.style.fontSize = `${14 + Math.random()*22}px`;
      heartField.appendChild(h);
      setTimeout(() => h.remove(), 4100);
    }
  }

  function toastMsg(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastMsg.t);
    toastMsg.t = setTimeout(() => toast.classList.remove("show"), 2300);
  }

  function typeStory() {
    typeText.textContent = "";
    let i = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { typeText.textContent = story; return; }
    clearInterval(typeStory.timer);
    typeStory.timer = setInterval(() => {
      typeText.textContent = story.slice(0, ++i);
      if (i >= story.length) clearInterval(typeStory.timer);
    }, 16);
  }

  openBtn.addEventListener("click", () => {
    $("#letter").scrollIntoView({behavior:"smooth"});
    typeStory();
    hearts(18);
  });

  continueBtn.addEventListener("click", () => {
    $("#journey").scrollIntoView({behavior:"smooth"});
    hearts(8);
  });

  $$(".memory").forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".memory").forEach(x => x.classList.remove("active"));
      btn.classList.add("active");
      memoryTitle.textContent = btn.dataset.title;
      memoryCopy.textContent = btn.dataset.copy;
    });
  });

  $$(".photo").forEach(photo => {
    photo.addEventListener("click", () => {
      const img = photo.querySelector("img");
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = photo.dataset.caption || "";
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden","false");
    });
  });

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden","true");
  }
  $("#closeLightbox").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });

  $("#shuffleBtn").addEventListener("click", () => {
    $$(".photo").forEach((p, i) => {
      p.animate(
        [{transform:"translateY(0) rotate(0deg)"},{transform:`translateY(-14px) rotate(${i ? -3 : 2}deg)`},{transform:`translateY(0) rotate(${i ? 2 : -1}deg)`}],
        {duration:700, easing:"cubic-bezier(.2,.8,.2,1)"}
      );
    });
    hearts(10);
    toastMsg("A few memories just danced around ✨");
  });

  $("#heartBtn").addEventListener("click", (e) => {
    hearts(28);
    const rect = e.currentTarget.getBoundingClientRect();
    for (let i=0;i<12;i++) {
      const s = document.createElement("span");
      s.className = "spark";
      s.textContent = i % 2 ? "✦" : "♡";
      s.style.left = `${rect.left + rect.width/2}px`;
      s.style.top = `${rect.top + 40}px`;
      s.style.setProperty("--x", `${(Math.random()-.5)*260}px`);
      s.style.setProperty("--y", `${-50-Math.random()*180}px`);
      document.body.appendChild(s);
      setTimeout(()=>s.remove(),1000);
    }
    toastMsg("One giant heart, delivered. ❤️");
  });

  $("#replayBtn").addEventListener("click", () => {
    window.scrollTo({top:0, behavior:"smooth"});
    setTimeout(() => {
      typeText.textContent = "";
      $("#letter").scrollIntoView({behavior:"smooth"});
      typeStory();
    }, 500);
  });

  // Gentle reveal-on-scroll.
  const sections = $$(".reveal-section");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:.08});
    sections.forEach(s => {
      s.style.opacity = "0";
      s.style.transform = "translateY(24px)";
      s.style.transition = "opacity .8s ease, transform .8s ease";
      observer.observe(s);
    });
  }

  // Clicking anywhere creates a tiny heart on non-control areas.
  document.addEventListener("click", e => {
    if (e.target.closest("button,a")) return;
    const h = document.createElement("span");
    h.className = "spark";
    h.textContent = "♡";
    h.style.left = `${e.clientX}px`;
    h.style.top = `${e.clientY}px`;
    h.style.setProperty("--x", `${(Math.random()-.5)*70}px`);
    h.style.setProperty("--y", `${-40-Math.random()*70}px`);
    document.body.appendChild(h);
    setTimeout(()=>h.remove(),1000);
  });
})();
