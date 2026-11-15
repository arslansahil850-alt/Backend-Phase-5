document.addEventListener('DOMContentLoaded', () => {
  const topNavbar = document.getElementById('topNavbar');
  const courseNavbar = document.getElementById('courseNavbar');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const topNavLinks = document.getElementById('topNavLinks');
  const courseDaySelect = document.getElementById('courseDaySelect');
  const lessonImage = document.getElementById('lessonImage');
  const lessonImageFallback = document.getElementById('lessonImageFallback');
  const quizForm = document.getElementById('day7QuizForm');
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
      label: '429 Too Many Requests',
      explanation: 'HTTP 429 is the standard status code indicating the client has sent too many requests in a given amount of time.'
    },
    q2: {
      correct: 'b',
      label: 'All users appear to share the reverse proxy\'s IP address, so a few requests from one user can lock out every user on your site',
      explanation: 'Without trust proxy enabled, req.ip resolves to the proxy server instead of the client IP from X-Forwarded-For.'
    },
    q3: {
      correct: 'b',
      label: 'To stop automated password brute-forcing, credential stuffing, and email-flooding abuse without breaking normal API browsing',
      explanation: 'Tiered strict limiters protect sensitive auth and email routes while letting normal read endpoints handle regular traffic.'
    },
    q4: {
      correct: 'b',
      label: 'How long (in seconds or an HTTP date) the client should wait before sending another request',
      explanation: 'Retry-After helps compliant clients pause and back off before retrying a throttled request.'
    },
    q5: {
      correct: 'a',
      label: 'Each container keeps its own separate RAM counter, so clients can multiply their effective quota across instances',
      explanation: 'Local MemoryStore does not synchronize counters across separate Node processes or server containers.'
    },
    q6: {
      correct: 'b',
      label: 'Redis',
      explanation: 'Redis provides fast atomic in-memory counters shared across all Express server instances behind a load balancer.'
    },
    q7: {
      correct: 'a',
      label: 'So load balancers and uptime monitors pinging continuously do not receive 429 and falsely restart healthy servers',
      explanation: 'Health checks must remain responsive so infrastructure monitors do not mistake throttling for a crashed server.'
    },
    q8: {
      correct: 'b',
      label: 'Only failed login attempts count toward the limit, preventing normal users from getting locked out when they enter the right password',
      explanation: 'skipSuccessfulRequests keeps legitimate users from consuming their failure quota on valid logins.'
    },
    q9: {
      correct: 'a',
      label: 'It lets users on a shared office/campus Wi-Fi IP fail independently without locking out other people on the same network',
      explanation: 'Keying by ip + normalized email isolates failed attempts to a specific account+IP pair.'
    },
    q10: {
      correct: 'b',
      label: 'Before expensive database queries and bcrypt.compare() so blocked requests are rejected cheaply',
      explanation: 'Placing rate limiting early in the middleware pipeline saves CPU and database connections when rejecting abusive traffic.'
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
        summaryNote = 'Excellent mastery of Rate Limiting!';
      } else if (percentage >= 70) {
        summaryNote = 'Great work! Review any missed questions before moving to Day 8.';
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