document.addEventListener('DOMContentLoaded', () => {
  const topNavbar = document.getElementById('topNavbar');
  const courseNavbar = document.getElementById('courseNavbar');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const topNavLinks = document.getElementById('topNavLinks');
  const courseDaySelect = document.getElementById('courseDaySelect');
  const lessonImage = document.getElementById('lessonImage');
  const lessonImageFallback = document.getElementById('lessonImageFallback');
  const quizForm = document.getElementById('day12QuizForm');
  const retryQuizBtn = document.getElementById('retryQuizBtn');
  const quizResult = document.getElementById('quizResult');

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

  if (lessonImage && lessonImageFallback) {
    const showFallback = () => {
      lessonImage.hidden = true;
      lessonImageFallback.hidden = false;
    };

    const showImage = () => {
      lessonImage.hidden = false;
      lessonImageFallback.hidden = true;
    };

    lessonImage.addEventListener('error', showFallback);
    lessonImage.addEventListener('load', () => {
      if (lessonImage.naturalWidth > 0) {
        showImage();
      } else {
        showFallback();
      }
    });

    if (lessonImage.complete) {
      if (lessonImage.naturalWidth === 0) {
        showFallback();
      } else {
        showImage();
      }
    }
  }

  const answerKey = {
    q1: {
      correct: 'b',
      label: '(page - 1) * limit',
      explanation: 'For page 1 you skip 0 records, for page 2 you skip limit records, and so on using (page - 1) * limit.'
    },
    q2: {
      correct: 'a',
      label: 'Because control keys like page and sort are treated as document fields, and attackers can inject MongoDB operators or probe private fields',
      explanation: 'Always build filters explicitly from allow-listed query keys after validation.'
    },
    q3: {
      correct: 'a',
      label: 'To stop clients from passing ?limit=500000 and exhausting server RAM, DB bandwidth, and CPU in one request',
      explanation: 'Bounding limit with a server maximum protects database and Node.js stability.'
    },
    q4: {
      correct: 'a',
      label: 'Without a unique tie-breaker, tied items can shift order between queries, causing duplicates or skipped items across pages',
      explanation: 'Adding _id as a secondary sort key makes pagination deterministic even when primary sort values tie.'
    },
    q5: {
      correct: 'b',
      label: 'It skips full Mongoose Document hydration and returns lightweight plain JavaScript objects faster with lower RAM',
      explanation: '.lean() speeds up read-only list endpoints by returning plain objects instead of full Mongoose documents.'
    },
    q6: {
      correct: 'b',
      label: 'totalPages = 5, hasNextPage = false',
      explanation: 'Math.ceil(42 / 10) = 5 pages. On page 5 of 5, currentPage < totalPages is false.'
    },
    q7: {
      correct: 'a',
      label: 'Running both independent database queries concurrently reduces total response latency compared to running them sequentially',
      explanation: 'Promise.all executes the slice query and countDocuments in parallel.'
    },
    q8: {
      correct: 'a',
      label: 'Otherwise totalItems and totalPages would count the whole collection instead of matching the user\'s active filters',
      explanation: 'Accurate pagination metadata must reflect the exact filtered subset.'
    },
    q9: {
      correct: 'a',
      label: 'MongoDB must still walk through and discard the first N entries for deep pages, making very large offsets slower than cursor-based pagination',
      explanation: 'Cursor-based pagination uses indexed range comparisons like _id < lastId to stay fast at arbitrary depth.'
    },
    q10: {
      correct: 'a',
      label: 'Allow-listing prevents users from sorting on sensitive/unindexed fields and guarantees a safe tie-breaker like _id is always included',
      explanation: 'Mapping a known sort keyword to a frozen sort specification ensures safety, index alignment, and stability.'
    }
  };

  if (quizForm && quizResult) {
    quizForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const questionKeys = Object.keys(answerKey);
      let score = 0;

      questionKeys.forEach((key) => {
        const fieldset = quizForm.querySelector(`fieldset[data-question="${key}"]`);
        const feedbackEl = document.getElementById(`feedback-${key}`);
        const options = quizForm.querySelectorAll(`input[name="${key}"]`);
        const selected = quizForm.querySelector(`input[name="${key}"]:checked`);
        const item = answerKey[key];

        if (fieldset) {
          fieldset.querySelectorAll('.quiz-option').forEach((label) => {
            label.classList.remove('is-correct', 'is-incorrect');
          });
        }

        options.forEach((input) => {
          const parentLabel = input.closest('.quiz-option');
          if (!parentLabel) {
            return;
          }
          if (input.value === item.correct) {
            parentLabel.classList.add('is-correct');
          } else if (selected && input.value === selected.value && selected.value !== item.correct) {
            parentLabel.classList.add('is-incorrect');
          }
        });

        if (feedbackEl) {
          if (selected && selected.value === item.correct) {
            score += 1;
            feedbackEl.className = 'quiz-feedback correct';
            feedbackEl.textContent = `Correct! ${item.explanation}`;
          } else if (selected) {
            feedbackEl.className = 'quiz-feedback incorrect';
            feedbackEl.textContent = `Incorrect. Correct answer: "${item.label}". ${item.explanation}`;
          } else {
            feedbackEl.className = 'quiz-feedback incorrect';
            feedbackEl.textContent = `Not answered. Correct answer: "${item.label}". ${item.explanation}`;
          }
        }
      });

      const percentage = Math.round((score / questionKeys.length) * 100);
      let summaryNote = 'Review the explanations above and retry to reinforce your understanding.';
      if (percentage >= 90) {
        summaryNote = 'Excellent mastery of Pagination and Filtering!';
      } else if (percentage >= 70) {
        summaryNote = 'Strong work! Review any missed questions before moving to Day 13.';
      }

      quizResult.hidden = false;
      quizResult.textContent = `Your Score: ${score} / ${questionKeys.length} (${percentage}%). ${summaryNote}`;
    });

    if (retryQuizBtn) {
      retryQuizBtn.addEventListener('click', () => {
        quizForm.reset();
        quizForm.querySelectorAll('.quiz-option').forEach((label) => {
          label.classList.remove('is-correct', 'is-incorrect');
        });
        quizForm.querySelectorAll('.quiz-feedback').forEach((box) => {
          box.className = 'quiz-feedback';
          box.textContent = '';
        });
        quizResult.hidden = true;
        quizResult.textContent = '';
      });
    }
  }
});