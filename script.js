document.addEventListener('DOMContentLoaded', () => {

  /* ---- Mobile Menu ---- */
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    hamburger.classList.toggle('is-active');
    hamburger.setAttribute('aria-label', isOpen ? '关闭菜单' : '打开菜单');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('is-open');
      hamburger.classList.remove('is-active');
      hamburger.setAttribute('aria-label', '打开菜单');
      document.body.style.overflow = '';
    });
  });

  /* ---- Active nav link ---- */
  const sections = document.querySelectorAll('.section[id]');
  const navLinks = document.querySelectorAll('.nav__links a');

  function updateNav() {
    let current = '';
    sections.forEach(s => {
      const rect = s.getBoundingClientRect();
      if (rect.top <= 200) current = s.getAttribute('id');
    });
    navLinks.forEach(link => {
      const id = link.getAttribute('href').slice(1);
      const active = id === current;
      link.style.color = active ? '#fff' : 'rgba(255,255,255,0.8)';
      link.style.fontWeight = active ? '600' : '400';
    });
  }
  window.addEventListener('scroll', () => requestAnimationFrame(updateNav));

  /* ---- Entrance animations ---- */
  const animated = document.querySelectorAll(
    '.info-card, .concept-card, .step-card, .resource-item, .quote, .tip-box'
  );
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06 });
    animated.forEach(el => observer.observe(el));
  } else {
    animated.forEach(el => el.classList.add('is-visible'));
  }

  /* ---- Resource click ---- */
  document.querySelectorAll('.resource-item').forEach(el => {
    el.addEventListener('click', () => {
      const t = el.querySelector('.resource-item__title');
      if (t) console.log('[TransFS] 资源:', t.textContent);
    });
  });


  /* ---- Share Modal ---- */
  const shareBtn = document.getElementById('shareBtn');
  const shareModal = document.getElementById('shareModal');
  const shareOverlay = document.getElementById('shareOverlay');
  const shareClose = document.getElementById('shareClose');
  const shareToast = document.getElementById('shareToast');
  let toastTimer = null;

  function openShare() {
    shareModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeShare() {
    shareModal.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  function showToast(msg) {
    shareToast.textContent = msg || '链接已复制';
    shareToast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => shareToast.classList.remove('is-visible'), 2000);
  }

  shareBtn.addEventListener('click', openShare);
  shareOverlay.addEventListener('click', closeShare);
  shareClose.addEventListener('click', closeShare);

  // WeChat: copy link with WeChat-friendly note
  document.getElementById('shareWechat').addEventListener('click', () => {
    const url = window.location.href;
    const text = 'Trans Family Support - 关于跨性别，给家长和孩子的话\n' + url;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('已复制，去微信粘贴发送');
      }).catch(() => {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  });

  // QQ: open QQ chat link or copy
  document.getElementById('shareQQ').addEventListener('click', () => {
    const url = window.location.href;
    const text = 'Trans Family Support - 关于跨性别，给家长和孩子的话\n' + url;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('已复制，去QQ粘贴发送');
      }).catch(() => {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  });

  // Copy link
  document.getElementById('shareCopy').addEventListener('click', () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        showToast('链接已复制');
      }).catch(() => {
        fallbackCopy(url);
      });
    } else {
      fallbackCopy(url);
    }
  });

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast('链接已复制');
    } catch (e) {
      showToast('复制失败，请手动复制');
    }
    document.body.removeChild(ta);
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && shareModal.classList.contains('is-open')) {
      closeShare();
    }
  });

  console.log('[TransFS] 页面已加载');
});
