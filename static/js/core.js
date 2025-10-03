$(document).ready(function () {
  const langSwitcher = document.getElementById('language-switcher');
  const defaultLang = 'en';

  const basePath = window.location.pathname.includes("/dubrovsky/")
    ? "/dubrovsky/"
    : "/";

  // ----------------------------------------------------------------------
  // Обновляем все ссылки на странице (чтобы сохранялся ?lang=ru)
  function updateAllLinksLanguage(lang) {
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');

      if (
        href &&
        !href.startsWith('http') &&
        !href.startsWith('#') &&
        !href.startsWith('mailto') &&
        !href.startsWith('javascript')
      ) {
        // нормализуем путь (чтобы не было двойных //)
        const cleanHref = href.replace(/^\/+/, '');
        const url = new URL(basePath + cleanHref, window.location.origin);

        url.searchParams.set('lang', lang);
        link.setAttribute('href', url.pathname + url.search);

        console.log(`🔗 Обновил ссылку: ${href} -> ${url.pathname + url.search}`);
      }
    });
  }

  // ----------------------------------------------------------------------
  // Обновляем URL браузера (pushState)
  function updateUrlLang(lang) {
    const url = new URL(window.location);
    url.searchParams.set('lang', lang);
    window.history.replaceState({ path: url.href }, '', url.href);
  }

  // ----------------------------------------------------------------------
  // Устанавливаем язык
  async function setLanguage(lang) {
    try {
      console.log("🔄 Устанавливаю язык:", lang);

      const response = await fetch(`static/js/locales/${lang}.json`);
      if (!response.ok) {
        console.error(`❌ Не удалось загрузить ${lang}.json. Статус: ${response.status}`);
        return;
      }

      const translations = await response.json();

      // обновляем lang в <html>
      document.documentElement.lang = lang;

      // применяем переводы
      document.querySelectorAll('[data-i18n-key]').forEach((element) => {
        const key = element.getAttribute('data-i18n-key');
        if (translations[key]) {
          element.innerText = translations[key];
          if (key === 'page_title') {
            document.title = translations[key];
          }
        }
      });

      // подсвечиваем активную кнопку
      document.querySelectorAll('.lang-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
      });

      // сохраняем
      localStorage.setItem('lang', lang);
      console.log("💾 localStorage.lang =", localStorage.getItem('lang'));

      // обновляем URL и ссылки
      updateUrlLang(lang);
      updateAllLinksLanguage(lang);
    } catch (err) {
      console.error('❌ Ошибка при setLanguage:', err);
    }
  }

  // ----------------------------------------------------------------------
  // Определение языка по браузеру
  function detectUserLang() {
    const browserLang = navigator.language || navigator.userLanguage;
    console.log("🌍 Язык браузера:", browserLang);

    return (browserLang && browserLang.startsWith("ru")) ? "ru" : "en";
  }

  // ----------------------------------------------------------------------
  // Обработчик кликов
  if (langSwitcher) {
    langSwitcher.addEventListener('click', (event) => {
      if (event.target.classList.contains('lang-btn')) {
        const newLang = event.target.getAttribute('data-lang');
        if (newLang) {
          console.log("🖱 Клик по языку:", newLang);
          setLanguage(newLang);
        }
      }
    });
  }

  // ----------------------------------------------------------------------
  // Загружаем язык при старте
  (async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const langFromUrl = urlParams.get('lang');
    const langFromStorage = localStorage.getItem('lang');

    let userLang = langFromUrl || langFromStorage;

    if (!userLang) {
      userLang = detectUserLang();
    }

    if (!userLang) {
      userLang = defaultLang;
    }

    console.log("🚀 Язык при старте:", userLang);
    setLanguage(userLang);

    // если был lang в URL → обновляем localStorage
    if (langFromUrl && langFromUrl !== langFromStorage) {
      localStorage.setItem('lang', langFromUrl);
      console.log("💾 Сохранил язык из URL в localStorage:", langFromUrl);
    }
  })();




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
