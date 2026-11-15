document.addEventListener('DOMContentLoaded', () => {
  const topNavbar = document.getElementById('topNavbar');
  const courseNavbar = document.getElementById('courseNavbar');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const topNavLinks = document.getElementById('topNavLinks');
  const courseDaySelect = document.getElementById('courseDaySelect');
  const lessonImage = document.getElementById('lessonImage');
  const lessonImageFallback = document.getElementById('lessonImageFallback');
  const quizForm = document.getElementById('day3QuizForm');
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
      label: 'To separate data logic (Model), presentation (View), and request coordination (Controller) for maintainability',
      explanation: 'MVC divides an application into distinct layers so data rules, HTTP handling, and output formatting stay clean and independent.'
    },
    q2: {
      correct: 'b',
      label: 'Defining data schemas, validation constraints, and database queries',
      explanation: 'The Model owns data integrity, Mongoose schemas, and database operations, completely separate from HTTP req and res objects.'
    },
    q3: {
      correct: 'b',
      label: 'Because Models should remain HTTP-agnostic and reusable outside Express (such as in tests or background scripts)',
      explanation: 'Keeping HTTP details out of Models lowers coupling and lets you invoke Model methods from jobs, CLI tools, or unit tests.'
    },
    q4: {
      correct: 'b',
      label: 'The JSON response formatter/serializer (or template renderer in SSR apps) that shapes data sent to clients',
      explanation: 'In REST APIs, View/presenter functions shape safe public JSON DTOs, stripping internal fields like __v or password hashes.'
    },
    q5: {
      correct: 'a',
      label: 'Splitting each distinct responsibility (routing, validation, data access, formatting) into focused modules',
      explanation: 'Separation of Concerns ensures each module has one clear job, making code easier to reason about, test, and modify.'
    },
    q6: {
      correct: 'b',
      label: 'Schema update validators are skipped, allowing invalid enum or out-of-range values to be saved',
      explanation: 'Mongoose disables schema validation on update queries unless { runValidators: true } is explicitly passed.'
    },
    q7: {
      correct: 'a',
      label: 'Mass assignment, where a client sends extra fields like role: "admin" that get saved directly',
      explanation: 'Passing unvalidated req.body directly to Model.create() lets attackers overwrite privileged fields unless you whitelist inputs.'
    },
    q8: {
      correct: 'b',
      label: 'Router -> Controller -> Model -> Database -> Model -> Controller -> View/Response',
      explanation: 'The Router dispatches to the Controller, which calls the Model to query MongoDB and formats the response via the View layer.'
    },
    q9: {
      correct: 'a',
      label: 'Putting all business logic, calculations, and complex queries inside controllers while Models only hold bare field definitions',
      explanation: 'Fat Controllers bloat HTTP handlers and prevent business/domain logic from being reused cleanly across endpoints.'
    },
    q10: {
      correct: 'b',
      label: 'It catches malformed IDs early and lets you return a clean 400 Bad Request instead of triggering a database CastError',
      explanation: 'Validating ObjectId syntax before querying prevents unnecessary database errors and gives clients clear 400 feedback.'
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
        summaryNote = 'Excellent mastery of MVC Architecture!';
      } else if (percentage >= 70) {
        summaryNote = 'Strong work! Review any missed questions before moving to Day 4.';
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