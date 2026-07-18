/* ========================================
   WEDDING SITE — SCRIPTS
   ======================================== */

(function () {
  'use strict';

  /* ===== CONFIG ===== */

  const WEDDING_DATE = new Date('2026-10-09T16:30:00+03:00');
  // Укажите URL Google Apps Script здесь после деплоя
  const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycby9tJSTtV40xC6jdpKmb4bd0LIrHqSI-v1L-SL4W_lDLnwC4JXcxuiwichljiuyg9JKZw/exec';

  /* ===== SCROLL ANIMATIONS (IntersectionObserver) ===== */

  function initScrollAnimations() {
    var elements = document.querySelectorAll('.animate-on-scroll');
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var delay = entry.target.dataset.delay || 0;
            setTimeout(function () {
              entry.target.classList.add('is-visible');
            }, parseInt(delay));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    elements.forEach(function (el) { observer.observe(el); });
  }

  /* ===== POLAROID DEVELOPMENT ANIMATION ===== */

  function initPolaroidAnimation() {
    var polaroids = document.querySelectorAll('.animate-polaroid');
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var delay = parseInt(entry.target.dataset.delay) || 0;
            setTimeout(function () {
              entry.target.classList.add('developed');
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    polaroids.forEach(function (p) { observer.observe(p); });
  }

  /* ===== CALENDAR (October 2026) ===== */

  function buildCalendar() {
    var grid = document.getElementById('calendarGrid');
    if (!grid) return;

    var year = 2026;
    var month = 9; // October (0-indexed)
    var weddingDay = 9;

    var firstDay = new Date(year, month, 1).getDay();
    var startOffset = firstDay === 0 ? 6 : firstDay - 1;
    var daysInMonth = 31;

    for (var i = 0; i < startOffset; i++) {
      var empty = document.createElement('div');
      empty.className = 'calendar-day empty';
      grid.appendChild(empty);
    }

    for (var d = 1; d <= daysInMonth; d++) {
      var cell = document.createElement('div');
      cell.className = 'calendar-day';
      cell.textContent = d;
      if (d === weddingDay) {
        cell.classList.add('wedding-day');
        cell.id = 'weddingDayCell';
      }
      grid.appendChild(cell);
    }

    requestAnimationFrame(function () {
      positionHeartBadge();
    });
  }

  function positionHeartBadge() {
    var cell = document.getElementById('weddingDayCell');
    var badge = document.getElementById('heartBadge');
    var grid = document.getElementById('calendarGrid');
    if (!cell || !badge || !grid) return;

    var gridRect = grid.getBoundingClientRect();
    var cellRect = cell.getBoundingClientRect();

    var x = cellRect.left - gridRect.left + cellRect.width / 2;
    var y = cellRect.top - gridRect.top + cellRect.height / 2;

    badge.style.left = (x - badge.offsetWidth / 2) + 'px';
    badge.style.top = (y - badge.offsetHeight / 2 + 37) + 'px';
  }

  function initHeartAnimation() {
    var badge = document.getElementById('heartBadge');
    if (!badge) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setTimeout(function () {
              badge.classList.add('drawn');
            }, 600);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(badge);
  }

  /* ===== COUNTDOWN TIMER ===== */

  function updateCountdown() {
    var now = new Date();
    var diff = WEDDING_DATE - now;

    if (diff <= 0) {
      document.getElementById('timerDays').textContent = '00';
      document.getElementById('timerHours').textContent = '00';
      document.getElementById('timerMinutes').textContent = '00';
      document.getElementById('timerSeconds').textContent = '00';
      return;
    }

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('timerDays').textContent = String(days).padStart(2, '0');
    document.getElementById('timerHours').textContent = String(hours).padStart(2, '0');
    document.getElementById('timerMinutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('timerSeconds').textContent = String(seconds).padStart(2, '0');
  }

  function initCountdown() {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  /* ===== FINALE SMOOTH REVEAL ===== */

  function initFinaleAnimation() {
    var title = document.getElementById('finaleTitle');
    if (!title) return;

    var words = title.querySelectorAll('.word');
    var heart = title.querySelector('.finale-heart');

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            title.classList.add('animate');
            words.forEach(function (word, i) {
              word.style.transitionDelay = (i * 0.4 + 0.2) + 's';
            });
            if (heart) {
              heart.style.transitionDelay = (words.length * 0.4 + 0.6) + 's';
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    observer.observe(title);
  }

  /* ===== RSVP FORM ===== */

  function initForm() {
    var form = document.getElementById('rsvpForm');
    var messageEl = document.getElementById('formMessage');
    var drinkGroup = document.getElementById('drinkGroup');
    var wishesGroup = document.getElementById('wishesGroup');
    if (!form) return;

    // Show/hide drink & wishes groups based on attending selection
    var attendingRadios = form.querySelectorAll('input[name="attending"]');
    attendingRadios.forEach(function (radio) {
      radio.addEventListener('change', function () {
        if (this.value === 'Приду') {
          drinkGroup.classList.add('visible');
          wishesGroup.classList.add('visible');
        } else {
          drinkGroup.classList.remove('visible');
          wishesGroup.classList.remove('visible');
          // Reset drink selection when hiding
          var drinkChecks = form.querySelectorAll('input[name="drink"]');
          drinkChecks.forEach(function (r) { r.checked = false; });
        }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = form.querySelector('input[name="name"]').value.trim();
      var attending = form.querySelector('input[name="attending"]:checked');
      var drinkChecks = form.querySelectorAll('input[name="drink"]:checked');
      var drinks = Array.from(drinkChecks).map(function (c) { return c.value; });
      var wishes = form.querySelector('textarea[name="wishes"]').value.trim();

      // Clear previous messages
      messageEl.innerHTML = '';
      messageEl.className = 'form-message';

      // Validation — field by field
      if (!name) {
        showMessage('Кажется, вы забыли представиться!', 'error');
        form.querySelector('input[name="name"]').focus();
        return;
      }

      if (!attending) {
        showMessage('Нам очень важно знать, сможете ли вы прийти', 'error');
        return;
      }

      if (attending.value === 'Приду' && drinks.length === 0) {
        showMessage('Расскажите, пожалуйста, что вы предпочитаете.', 'error');
        return;
      }

      var data = {
        name: name,
        attending: attending.value,
        drink: attending.value === 'Приду' ? drinks.join(', ') : '',
        wishes: wishes,
        timestamp: new Date().toLocaleString('ru-RU')
      };

      var btn = form.querySelector('.submit-btn');
      btn.disabled = true;
      btn.textContent = 'Отправка...';

      if (GOOGLE_SHEET_URL) {
        fetch(GOOGLE_SHEET_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        .then(function () {
          form.reset();
          drinkGroup.classList.remove('visible');
          wishesGroup.classList.remove('visible');
          btn.textContent = 'Отправить';
          btn.disabled = false;
          if (attending.value === 'Приду') {
            showMessage('Спасибо! Мы получили ваш ответ и уже очень ждем нашей встречи.', 'success');
          } else {
            showMessage('Спасибо, что дали нам знать. Нам будет вас не хватать, но мы ценим, что вы ответили.', 'success');
          }
        })
        .catch(function () {
          btn.textContent = 'Отправить';
          btn.disabled = false;
          showMessage('Произошла ошибка. Попробуйте еще раз.', 'error');
        });
      } else {
        // Demo mode
        console.log('RSVP Data (demo):', data);
        form.reset();
        drinkGroup.classList.remove('visible');
        wishesGroup.classList.remove('visible');
        btn.textContent = 'Отправить';
        btn.disabled = false;
        if (attending.value === 'Приду') {
          showMessage('Спасибо! Мы получили ваш ответ и уже очень ждем нашей встречи.<br><small>(Демо-режим: настройте Google Apps Script)</small>', 'success');
        } else {
          showMessage('Спасибо, что дали нам знать. Нам будет вас не хватать, но мы ценим, что вы ответили.<br><small>(Демо-режим: настройте Google Apps Script)</small>', 'success');
        }
      }
    });

    function showMessage(text, type) {
      messageEl.innerHTML = text;
      messageEl.className = 'form-message ' + type;
    }
  }

  /* ===== INIT ===== */

  document.addEventListener('DOMContentLoaded', function () {
    initScrollAnimations();
    initPolaroidAnimation();
    buildCalendar();
    initHeartAnimation();
    initCountdown();
    initFinaleAnimation();
    initForm();

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(positionHeartBadge, 200);
    });
  });
})();
