document.addEventListener('DOMContentLoaded', () => {
  const topNavbar = document.getElementById('topNavbar');
  const courseNavbar = document.getElementById('courseNavbar');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const topNavLinks = document.getElementById('topNavLinks');
  const courseDaySelect = document.getElementById('courseDaySelect');
  const lessonImage = document.getElementById('lessonImage');
  const lessonImageFallback = document.getElementById('lessonImageFallback');
  const quizForm = document.getElementById('day16QuizForm');
  const retryQuizBtn = document.getElementById('retryQuizBtn');
  const quizResult = document.getElementById('quizResult');
  const completionChecklist = document.getElementById('completionChecklist');

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

  if (completionChecklist) {
    const storageKey = 'phase5_day16_checklist';
    let savedChecks = {};

    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        savedChecks = JSON.parse(raw);
      }
    } catch {
      savedChecks = {};
    }

    completionChecklist.querySelectorAll('input[type="checkbox"][data-check]').forEach((checkbox) => {
      const key = checkbox.getAttribute('data-check');
      const label = checkbox.closest('.check-item');

      if (key && savedChecks[key]) {
        checkbox.checked = true;
        if (label) {
          label.classList.add('is-checked');
        }
      }

      checkbox.addEventListener('change', () => {
        if (label) {
          label.classList.toggle('is-checked', checkbox.checked);
        }
        if (key) {
          savedChecks[key] = checkbox.checked;
          try {
            localStorage.setItem(storageKey, JSON.stringify(savedChecks));
          } catch {
            return;
          }
        }
      });
    });
  }

  const answerKey = {
    q1: {
      correct: 'b',
      label: 'It keeps middleware/routes modular and lets tests import app without binding a TCP port',
      explanation: 'Separating Express app setup from app.listen() makes architecture modular and testing clean.'
    },
    q2: {
      correct: 'b',
      label: 'Express matches /:id first and sets req.params.id = "featured"',
      explanation: 'Express evaluates routes top-to-bottom, so static paths must sit above parameterized :id paths.'
    },
    q3: {
      correct: 'b',
      label: 'By checking that it declares four parameters: (err, req, res, next)',
      explanation: 'Express identifies error middleware strictly by its 4-argument function signature.'
    },
    q4: {
      correct: 'c',
      label: '403 Forbidden',
      explanation: '401 indicates missing or invalid credentials; 403 indicates an authenticated user lacks permission.'
    },
    q5: {
      correct: 'a',
      label: 'Models must stay HTTP-agnostic so data rules and queries remain reusable outside Express',
      explanation: 'Keeping req and res out of Models lowers coupling and enables reuse across scripts, jobs, and tests.'
    },
    q6: {
      correct: 'b',
      label: 'Update validation is skipped, allowing invalid enum or out-of-range values to save',
      explanation: 'Mongoose skips update validators unless { runValidators: true } is explicitly passed.'
    },
    q7: {
      correct: 'b',
      label: 'Routes -> Controllers -> Services -> Models (with config/ and utils/ at the base)',
      explanation: 'Strict one-way downward imports prevent circular dependencies between layers.'
    },
    q8: {
      correct: 'a',
      label: 'To fail fast immediately on boot rather than crashing hours later during a live request',
      explanation: 'Central startup validation catches misconfigured deployments before traffic is served.'
    },
    q9: {
      correct: 'c',
      label: '409 Conflict',
      explanation: 'Duplicate unique key violations conflict with existing resource state, mapping cleanly to 409 Conflict.'
    },
    q10: {
      correct: 'b',
      label: 'A generic 500 JSON message + requestId while logging full stack details privately on the server',
      explanation: 'Hiding stack traces prevents information leakage while requestId links client reports to private server logs.'
    },
    q11: {
      correct: 'b',
      label: 'An authenticated user accessing or modifying another user\'s resource by changing an :id because ownership was not checked',
      explanation: 'Always verify resource ownership or query by ownerId alongside _id.'
    },
    q12: {
      correct: 'a',
      label: 'Enforce strict primitive type checks (typeof email === "string") and sanitize keys starting with $ or containing .',
      explanation: 'Type validation plus stripping MongoDB operator keys stops NoSQL injection.'
    },
    q13: {
      correct: 'a',
      label: 'Otherwise req.ip resolves to the load balancer\'s IP and one user can trigger 429 for all visitors',
      explanation: 'trust proxy lets Express read forwarded headers accurately behind reverse proxies.'
    },
    q14: {
      correct: 'a',
      label: 'Each container holds isolated RAM counters instead of sharing a central Redis store',
      explanation: 'Distributed servers require an external shared store like Redis for consistent rate-limit counting.'
    },
    q15: {
      correct: 'a',
      label: 'Because wildcard + credentials would allow any arbitrary site on the web to read authenticated responses',
      explanation: 'When credentials: true is active, Access-Control-Allow-Origin must specify an explicit trusted origin.'
    },
    q16: {
      correct: 'a',
      label: 'Because non-browser tools like curl, Postman, and attacker scripts ignore CORS completely',
      explanation: 'CORS only protects browser users; endpoints still require server-side authentication and authorization.'
    },
    q17: {
      correct: 'a',
      label: 'Because extensions and Content-Type headers can be spoofed trivially in HTTP requests',
      explanation: 'Inspecting leading binary magic bytes verifies the true file format.'
    },
    q18: {
      correct: 'a',
      label: 'It omits the required multipart boundary=... string and breaks server parsing',
      explanation: 'Omit Content-Type when passing FormData to fetch() so the browser inserts the exact boundary.'
    },
    q19: {
      correct: 'a',
      label: 'To rotate portrait smartphone photos upright using the EXIF orientation flag before stripping private GPS/camera metadata',
      explanation: 'Calling .rotate() first preserves orientation while removing private EXIF metadata during re-encoding.'
    },
    q20: {
      correct: 'a',
      label: 'Changing domains, staging hosts, or CDNs never requires rewriting existing database records',
      explanation: 'Relative storage keys keep database records portable across environments and CDNs.'
    },
    q21: {
      correct: 'b',
      label: 'Set from to your own verified EMAIL_FROM address and set replyTo to the visitor\'s validated email',
      explanation: 'Sending from a verified domain preserves SPF/DKIM deliverability while replyTo routes replies to the visitor.'
    },
    q22: {
      correct: 'a',
      label: 'To prevent HTML/phishing link injection inside the recipient\'s inbox',
      explanation: 'Escaping HTML special characters prevents user text from rendering active links or markup.'
    },
    q23: {
      correct: 'a',
      label: 'Without a unique tie-breaker, tied items can shift across pages, causing duplicates or skipped items',
      explanation: 'Appending _id makes multi-page sorting deterministic even when primary sort values match.'
    },
    q24: {
      correct: 'b',
      label: 'totalPages = 4, skip = 20',
      explanation: 'Math.ceil(35 / 10) = 4 pages, and skip = (3 - 1) * 10 = 20.'
    },
    q25: {
      correct: 'a',
      label: 'To prevent regex syntax crashes on inputs like "C++" and defend against ReDoS backtracking',
      explanation: 'Escaping metacharacters treats user symbols literally and prevents regex denial-of-service.'
    },
    q26: {
      correct: 'a',
      label: 'When the application requires fuzzy typo tolerance, instant autocomplete, synonyms, and faceted counts at scale',
      explanation: 'Dedicated engines like Atlas Search, Meilisearch, or Typesense handle fuzzy, synonym, and faceted search efficiently.'
    },
    q27: {
      correct: 'a',
      label: 'Defining shared schemas and error responses once lets every path reference the exact same contract consistently',
      explanation: 'Reusable components + $ref keep large OpenAPI specs maintainable and synchronized.'
    },
    q28: {
      correct: 'b',
      label: 'Real passwords, live JWT/API keys, or database credentials',
      explanation: 'Always use safe non-sensitive placeholder strings inside OpenAPI examples.'
    },
    q29: {
      correct: 'b',
      label: 'Collect all author IDs and run a single batched Book.find({ authorId: { $in: authorIds } }).lean() query',
      explanation: 'Batching lookups with $in eliminates N+1 database round-trips.'
    },
    q30: {
      correct: 'b',
      label: 'Use bounded TTL caches, namespace private keys by userId, invalidate keys on writes, and measure before/after safely in local/staging',
      explanation: 'Bounded TTL, private key namespacing, write invalidation, and safe local/staging benchmarking ensure fast, safe performance gains.'
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
      let summaryNote = 'Review the revision summaries and explanations above, then retry the assessment!';
      if (percentage >= 90) {
        summaryNote = 'Outstanding! You have mastered Phase 5: Advanced Backend Development!';
      } else if (percentage >= 75) {
        summaryNote = 'Great result! Review any missed items to sharpen your backend expertise.';
      }

      quizResult.hidden = false;
      quizResult.textContent = `Final Assessment Score: ${score} / ${questionKeys.length} (${percentage}%). ${summaryNote}`;
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