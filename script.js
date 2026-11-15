document.addEventListener('DOMContentLoaded', () => {
  const topNavbar = document.getElementById('topNavbar');
  const courseNavbar = document.getElementById('courseNavbar');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const topNavLinks = document.getElementById('topNavLinks');
  const courseDaySelect = document.getElementById('courseDaySelect');
  const filterButtons = document.querySelectorAll('.filter-btn[data-filter]');
  const dayCards = document.querySelectorAll('#daysGrid .day-card');
  const doneToggleButtons = document.querySelectorAll('.done-toggle[data-day-toggle]');
  const progressSummaryText = document.getElementById('progressSummaryText');
  const courseProgressBar = document.getElementById('courseProgressBar');
  const courseProgressFill = document.getElementById('courseProgressFill');
  const resetProgressBtn = document.getElementById('resetProgressBtn');

  let lastScrollY = window.scrollY || 0;
  let isMenuOpen = false;

  const setMenuState = (open) => {
    isMenuOpen = open;
    if (!mobileMenuToggle || !topNavLinks) {
      return;
    }
    mobileMenuToggle.setAttribute('aria-expanded', String(open));
    topNavLinks.classList.toggle('is-open', open);
  };

  if (mobileMenuToggle && topNavLinks) {
    mobileMenuToggle.addEventListener('click', () => {
      setMenuState(!isMenuOpen);
    });

    topNavLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        setMenuState(false);
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setMenuState(false);
        mobileMenuToggle.focus();
      }
    });

    document.addEventListener('click', (event) => {
      if (
        isMenuOpen &&
        !topNavLinks.contains(event.target) &&
        !mobileMenuToggle.contains(event.target)
      ) {
        setMenuState(false);
      }
    });
  }

  const handleScroll = () => {
    const currentScrollY = Math.max(0, window.scrollY || window.pageYOffset || 0);

    if (!topNavbar || !courseNavbar) {
      lastScrollY = currentScrollY;
      return;
    }

    if (isMenuOpen) {
      topNavbar.classList.remove('is-hidden');
      courseNavbar.classList.remove('is-stuck');
      lastScrollY = currentScrollY;
      return;
    }

    if (currentScrollY <= 20) {
      topNavbar.classList.remove('is-hidden');
      courseNavbar.classList.remove('is-stuck');
    } else if (currentScrollY > lastScrollY && currentScrollY >= 20) {
      topNavbar.classList.add('is-hidden');
      courseNavbar.classList.add('is-stuck');
    } else if (currentScrollY < lastScrollY) {
      topNavbar.classList.remove('is-hidden');
      courseNavbar.classList.remove('is-stuck');
    }

    lastScrollY = currentScrollY;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  if (courseDaySelect) {
    courseDaySelect.addEventListener('change', (event) => {
      const targetUrl = event.target.value;
      if (targetUrl) {
        window.location.href = targetUrl;
      }
    });
  }

  if (filterButtons.length > 0 && dayCards.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const selectedFilter = button.getAttribute('data-filter');

        filterButtons.forEach((btn) => {
          btn.classList.remove('is-active');
        });
        button.classList.add('is-active');

        dayCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          const shouldShow = selectedFilter === 'all' || category === selectedFilter;
          card.classList.toggle('is-hidden', !shouldShow);
        });
      });
    });
  }

  const PROGRESS_STORAGE_KEY = 'phase5_completed_days';
  const totalDays = 16;

  const readCompletedSet = () => {
    try {
      const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (!raw) {
        return new Set();
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return new Set();
      }
      return new Set(parsed.map((item) => String(item)));
    } catch {
      return new Set();
    }
  };

  const writeCompletedSet = (completedSet) => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(Array.from(completedSet)));
    } catch {
      return;
    }
  };

  let completedDays = readCompletedSet();

  const renderProgress = () => {
    const count = Math.min(totalDays, completedDays.size);
    const percentage = Math.round((count / totalDays) * 100);

    if (progressSummaryText) {
      progressSummaryText.textContent = `${count} of ${totalDays} days marked complete (${percentage}%)`;
    }

    if (courseProgressBar) {
      courseProgressBar.setAttribute('aria-valuenow', String(count));
    }

    if (courseProgressFill) {
      courseProgressFill.style.width = `${percentage}%`;
    }

    doneToggleButtons.forEach((button) => {
      const dayId = button.getAttribute('data-day-toggle');
      const card = button.closest('.day-card');
      const isDone = dayId ? completedDays.has(dayId) : false;

      button.setAttribute('aria-pressed', String(isDone));
      button.classList.toggle('is-done', isDone);
      button.textContent = isDone ? 'Completed' : 'Mark Done';

      if (card) {
        card.classList.toggle('is-done', isDone);
      }
    });
  };

  doneToggleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const dayId = button.getAttribute('data-day-toggle');
      if (!dayId) {
        return;
      }

      if (completedDays.has(dayId)) {
        completedDays.delete(dayId);
      } else {
        completedDays.add(dayId);
      }

      writeCompletedSet(completedDays);
      renderProgress();
    });
  });

  if (resetProgressBtn) {
    resetProgressBtn.addEventListener('click', () => {
      completedDays = new Set();
      writeCompletedSet(completedDays);
      renderProgress();
    });
  }

  renderProgress();
});