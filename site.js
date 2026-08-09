(() => {
  const menuButton = document.querySelector('.menu-button');
  const siteNav = document.querySelector('.site-nav');

  const setMenu = (open) => {
    if (!menuButton || !siteNav) return;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? '关闭导航' : '打开导航');
    siteNav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    menuButton.innerHTML = `<i data-lucide="${open ? 'x' : 'menu'}" aria-hidden="true"></i>`;
    window.lucide?.createIcons();
  };

  menuButton?.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  siteNav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) setMenu(false);
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const soundButton = document.querySelector('.sound-control');
  const audio = document.querySelector('#site-audio');

  const updateSoundButton = (playing) => {
    if (!soundButton) return;
    soundButton.setAttribute('aria-pressed', String(playing));
    soundButton.setAttribute('aria-label', playing ? '暂停背景音乐' : '播放背景音乐');
    soundButton.innerHTML = `<i data-lucide="${playing ? 'pause' : 'volume-2'}" aria-hidden="true"></i><span data-sound-label>${playing ? 'PAUSE TRACK' : 'PLAY TRACK'}</span>`;
    window.lucide?.createIcons();
  };

  soundButton?.addEventListener('click', async () => {
    if (!audio) return;
    try {
      if (audio.paused) {
        await audio.play();
        updateSoundButton(true);
      } else {
        audio.pause();
        updateSoundButton(false);
      }
    } catch {
      updateSoundButton(false);
    }
  });

  audio?.addEventListener('ended', () => updateSoundButton(false));

  if (document.body.classList.contains('article-page')) {
    const progress = document.createElement('div');
    progress.className = 'reading-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.append(progress);

    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const percentage = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      progress.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
  }

  window.lucide?.createIcons();
})();
