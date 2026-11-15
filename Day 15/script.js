
document.addEventListener('DOMContentLoaded', () => {
    const topNavbar = document.getElementById('topNavbar');
    const courseNavbar = document.getElementById('courseNavbar');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const topNavLinks = document.getElementById('topNavLinks');
    const courseDaySelect = document.getElementById('courseDaySelect');
    const lessonImage = document.getElementById('lessonImage');
    const lessonImageFallback = document.getElementById('lessonImageFallback');
    const quizForm = document.getElementById('day15QuizForm');
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
            label: 'Measure baseline latency, query execution stats, and payload sizes to locate the actual bottleneck',
            explanation: 'Measuring first ensures you optimize real bottlenecks instead of guessing.'
        },
        q2: {
            correct: 'b',
            label: 'Fetching N parent items in 1 query and then running N separate database queries inside a loop for each item',
            explanation: 'N+1 loops multiply database round-trips; solve them with batched $in queries or aggregations.'
        },
        q3: {
            correct: 'a',
            label: 'Every index consumes RAM/disk and adds write overhead because MongoDB must update all indexes on every insert, update, or delete',
            explanation: 'Indexes accelerate reads at the cost of write speed and memory, so index only frequent query patterns.'
        },
        q4: {
            correct: 'b',
            label: 'MongoDB lacked an appropriate index and had to scan every document in the collection',
            explanation: 'COLLSCAN means full collection scan; adding an ESR-aligned index switches it to a fast IXSCAN.'
        },
        q5: {
            correct: 'a',
            label: 'They block Node.js\'s single main event loop thread, freezing all other concurrent user requests until finished',
            explanation: 'Always use asynchronous non-blocking APIs inside Express handlers so concurrent requests remain responsive.'
        },
        q6: {
            correct: 'a',
            label: 'Memory grows unboundedly over time (a memory leak) until Node.js crashes, and stale data is served indefinitely',
            explanation: 'In-memory caches must always enforce both TTL expiration and a maxEntries bound.'
        },
        q7: {
            correct: 'b',
            label: 'Deleting or updating cached entries whenever the underlying database records are created, updated, or deleted so users don\'t see stale data',
            explanation: 'Explicit write-path invalidation paired with TTL keeps cached data fresh.'
        },
        q8: {
            correct: 'a',
            label: 'Cross-user data leakage: User B receives User A\'s private cached orders',
            explanation: 'Never share global cache keys for private user data; namespace keys by userId or cache public data only.'
        },
        q9: {
            correct: 'a',
            label: 'Compressing tiny payloads or binary WebP/JPEG files wastes CPU for negligible (or negative) byte savings',
            explanation: 'Compression gives the largest wins on text/JSON payloads larger than ~1 KB.'
        },
        q10: {
            correct: 'b',
            label: 'Strictly against your local machine or a dedicated isolated staging environment',
            explanation: 'Never run load-testing tools against production or third-party servers.'
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
                summaryNote = 'Excellent mastery of Performance Optimization!';
            } else if (percentage >= 70) {
                summaryNote = 'Great work! Review any missed questions before moving to Day 16 Revision & Assessment.';
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