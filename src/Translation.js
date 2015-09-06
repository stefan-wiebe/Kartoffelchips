function setLanguage(lang) {
var translationSRC = document.createElement('script');
translationSRC.src = 'lang/' + lang + '.js';
document.body.appendChild(translationSRC);
}
setLanguage(navigator.language.substring(0,2));