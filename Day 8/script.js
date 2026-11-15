document.addEventListener('DOMContentLoaded', () => {
  const topNavbar = document.getElementById('topNavbar');
  const courseNavbar = document.getElementById('courseNavbar');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const topNavLinks = document.getElementById('topNavLinks');
  const courseDaySelect = document.getElementById('courseDaySelect');
  const lessonImage = document.getElementById('lessonImage');
  const lessonImageFallback = document.getElementById('lessonImageFallback');
  const quizForm = document.getElementById('day8QuizForm');
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
      correct: 'c',
      label: 'https://app.example.com/login and https://app.example.com/api/v1/users',
      explanation: 'Both URLs share the exact same scheme (https), hostname (app.example.com), and port (443); only the path differs.'
    },
    q2: {
      correct: 'b',
      label: 'The user\'s web browser',
      explanation: 'Web browsers enforce the Same-Origin Policy and CORS headers. Non-browser tools like curl and Postman ignore CORS.'
    },
    q3: {
      correct: 'b',
      label: 'On cross-origin requests that use non-simple methods (like PATCH/DELETE), application/json, or custom headers like Authorization',
      explanation: 'Browsers send an automatic OPTIONS preflight to ask the server for permission before dispatching non-simple cross-origin requests.'
    },
    q4: {
      correct: 'a',
      label: 'Because wildcard * combined with credentials would let any arbitrary website on the internet read authenticated user data',
      explanation: 'When credentials: true is active, browsers require Access-Control-Allow-Origin to name one explicit trusted origin.'
    },
    q5: {
      correct: 'b',
      label: 'It dynamically reflects ANY incoming Origin header back as allowed with credentials, bypassing origin isolation',
      explanation: 'Blindly mirroring every Origin with credentials allows malicious third-party sites to read authenticated responses from a victim\'s browser.'
    },
    q6: {
      correct: 'a',
      label: 'Because non-browser clients like curl, Postman, and attacker scripts ignore CORS completely',
      explanation: 'CORS only protects browser users; server-side authentication, authorization, and rate limiting are always required to secure endpoints.'
    },
    q7: {
      correct: 'b',
      label: 'The preflight fails (browser requests do not include user tokens on OPTIONS), so the browser blocks the real API request',
      explanation: 'Preflight OPTIONS requests never carry user credentials, so cors() must be mounted before authentication middleware.'
    },
    q8: {
      correct: 'b',
      label: 'exposedHeaders',
      explanation: 'Browsers hide custom response headers from frontend fetch() code unless the server lists them in Access-Control-Expose-Headers (exposedHeaders).'
    },
    q9: {
      correct: 'a',
      label: 'Browsers send the Origin header without a trailing slash (https://myapp.com), so exact string comparison fails',
      explanation: 'Origins consist only of scheme, host, and port with no path or trailing slash.'
    },
    q10: {
      correct: 'b',
      label: 'It instructs the browser to cache preflight OPTIONS permissions for 600 seconds, reducing redundant preflight round-trips',
      explanation: 'Setting Access-Control-Max-Age caches preflight approvals in the browser to improve API responsiveness.'
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
        summaryNote = 'Excellent mastery of CORS and Same-Origin Policy!';
      } else if (percentage >= 70) {
        summaryNote = 'Strong work! Review any missed questions before moving to Day 9.';
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