
function getLanguage() {
    return localStorage.getItem('language') || (navigator.language.split('-')[0] === 'ko' ? 'ko' : 'en');
}

function translate(key) {
    const lang = getLanguage();
    if (!translations[key] || !translations[key][lang]) {
        console.warn(`Translation not found for key: ${key}, lang: ${lang}`);
        return key;
    }
    return translations[key][lang];
}

function applyTranslations() {
    const lang = getLanguage();
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-translate-key]').forEach(el => {
        const key = el.dataset.translateKey;
        if (el.placeholder && translations[key]) {
            el.placeholder = translations[key][lang];
        } else if (el.type === 'submit' || el.type === 'button') {
            el.value = translations[key][lang];
        } else if (translations[key]) {
            el.innerHTML = translations[key][lang];
        }
    });

    document.title = translate('pageTitle');
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.content = translate('pageDescription');
    }

    const switcher = document.getElementById('language-switcher');
    if (switcher) {
        const currentActive = switcher.querySelector('.active-lang');
        if(currentActive) currentActive.classList.remove('active-lang', 'bg-sky-500', 'text-slate-900');
        
        const newActive = switcher.querySelector(`[data-lang="${lang}"]`);
        if (newActive) {
            newActive.classList.add('active-lang', 'bg-sky-500', 'text-slate-900');
        }
    }
}

function setLanguage(lang) {
    localStorage.setItem('language', lang);
    applyTranslations();
    if (window.updateInterface) {
        window.updateInterface();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const languageSwitcher = document.getElementById('language-switcher');
    if (languageSwitcher) {
        languageSwitcher.addEventListener('click', (e) => {
            const target = e.target.closest('[data-lang]');
            if (target && !target.classList.contains('active-lang')) {
                setLanguage(target.dataset.lang);
            }
        });
    }
    
    // Defer initial translation slightly to ensure all DOM is ready
    setTimeout(() => {
        applyTranslations();
        if (window.updateInterface) {
            window.updateInterface();
        }
    }, 0);
});
