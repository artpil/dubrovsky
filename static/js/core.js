$(document).ready(function () {
  const langSwitcher = document.getElementById('language-switcher');
  const defaultLang = 'en';

// 1. Устанавливаем язык
  async function setLanguage(lang) {
    try {
      const response = await fetch(`./static/js/locales/${lang}.json`);
      const translations = await response.json();

      document.documentElement.lang = lang;

      document.querySelectorAll('[data-i18n-key]').forEach(element => {
        const key = element.getAttribute('data-i18n-key');
        if (translations[key]) {
          element.innerText = translations[key];

          if (key === 'page_title') {
            document.title = translations[key];
          }
        }
      });

      // Обновление активной кнопки
      document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
      });

      // Сохраняем язык
      localStorage.setItem('lang', lang);
    } catch (error) {
      console.error('Ошибка загрузки перевода:', error);
    }
  }

// 2. Обработчик кликов
  if (langSwitcher) {
    langSwitcher.addEventListener('click', (event) => {
      if (event.target.classList.contains('lang-btn')) {
        const newLang = event.target.getAttribute('data-lang');
        if (newLang) {
          setLanguage(newLang);
        }
      }
    });
  }

// 3. Загружаем язык при старте
  document.addEventListener('DOMContentLoaded', () => {
    const userLang = localStorage.getItem('lang') || defaultLang;
    setLanguage(userLang);
  });


  //---modal
  $('.toggler').on('click', function (e) {
    e.preventDefault();
    var $this = $(e.currentTarget);
    var target = $this.data('target');
    $('.modal').removeClass('_active');
    $('body').removeClass('_modal-open');
    $('.modal__backdrop').fadeOut();

    $("#" + $(this).data("target")).toggleClass('_active');
    $('.modal__backdrop').fadeIn();
    $("#" + $(this).data("target")).closest('body').toggleClass('_modal-open');
  });

  $('.modal__close, .modal__mask, .modal__backdrop').on('click', function (e) {
    e.preventDefault();

    $('.modal').removeClass('_active');
    $('.modal__backdrop').fadeOut();
    $('body').removeClass('_modal-open');
  });
  // modal-sort


});
