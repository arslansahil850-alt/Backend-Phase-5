document.addEventListener('DOMContentLoaded', () => {
  const topNavbar = document.getElementById('topNavbar');
  const courseNavbar = document.getElementById('courseNavbar');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const topNavLinks = document.getElementById('topNavLinks');
  const courseDaySelect = document.getElementById('courseDaySelect');
  const lessonImage = document.getElementById('lessonImage');
  const lessonImageFallback = document.getElementById('lessonImageFallback');
  const quizForm = document.getElementById('day5QuizForm');
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
      label: 'A client requesting a product ID that does not exist in MongoDB (404)',
      explanation: 'Missing records, invalid inputs, and timeouts are expected runtime operational errors, whereas typos and undefined property bugs are programming errors.'
    },
    q2: {
      correct: 'c',
      label: 'At the very end of app.js, after all routes and the 404 fallback handler',
      explanation: 'Express passes errors downward through the middleware stack, so the centralized error handler must sit last to catch errors from all routes and 404s.'
    },
    q3: {
      correct: 'a',
      label: 'So the error handler knows the error is a predictable operational failure whose message is safe to send to clients in production',
      explanation: 'The isOperational flag lets the global error middleware distinguish trusted AppError messages from unexpected internal bugs.'
    },
    q4: {
      correct: 'c',
      label: '409 Conflict',
      explanation: 'Duplicate unique values conflict with the current state of the collection, making 409 Conflict the semantically accurate status code.'
    },
    q5: {
      correct: 'b',
      label: 'A value such as a route :id could not be cast to the expected schema type (e.g., an invalid ObjectId string)',
      explanation: 'Mongoose throws a CastError when an input cannot be converted to the schema field type, such as a malformed ObjectId.'
    },
    q6: {
      correct: 'a',
      label: 'Stack traces leak internal file paths, library versions, and implementation details that help attackers',
      explanation: 'Stack traces are invaluable during local debugging but expose sensitive server internals if returned in production.'
    },
    q7: {
      correct: 'b',
      label: 'A generic 500 JSON message with a requestId, while logging full details privately on the server',
      explanation: 'Returning a safe generic message protects internals while the requestId allows engineers to locate the full error in server logs.'
    },
    q8: {
      correct: 'b',
      label: 'It passes a SyntaxError (with err.type === "entity.parse.failed") to Express error-handling middleware',
      explanation: 'Normalizing entity.parse.failed turns broken client JSON into a clean 400 Bad Request JSON response.'
    },
    q9: {
      correct: 'a',
      label: 'Because if headers were already sent to the client, trying to send another JSON error throws ERR_HTTP_HEADERS_SENT; delegating to Express safely closes the connection',
      explanation: 'Checking res.headersSent prevents double-response crashes when an error occurs after streaming has started.'
    },
    q10: {
      correct: 'b',
      label: 'Log the error and exit the process cleanly so a process manager restarts the app in a clean state',
      explanation: 'After an uncaughtException, application memory may be corrupted, so logging and exiting for a clean restart is safest.'
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
        summaryNote = 'Excellent mastery of Advanced Error Handling!';
      } else if (percentage >= 70) {
        summaryNote = 'Solid work! Review any missed questions before moving to Day 6.';
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