(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.EDUKASS_I18N=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  function create({locales,defaultLanguage='et',supportedLanguages=[defaultLanguage],requestedLanguage}={}){
    const available=locales||{};
    const requested=requestedLanguage||defaultLanguage;
    const language=supportedLanguages.includes(requested)&&available[requested]?requested:defaultLanguage;
    const fallback=available[defaultLanguage]?.strings||{};
    const strings=available[language]?.strings||fallback;

    function t(key,params={},fallbackText){
      const template=strings[key]??fallback[key]??fallbackText??key;
      return String(template).replace(/\{([a-zA-Z0-9_]+)\}/g,(match,name)=>Object.prototype.hasOwnProperty.call(params,name)?String(params[name]):match);
    }

    function apply(documentRoot){
      if(!documentRoot)return;
      documentRoot.documentElement?.setAttribute('lang',language);
      documentRoot.querySelectorAll('[data-i18n]').forEach(element=>{
        element.textContent=t(element.dataset.i18n,{},element.textContent);
      });
      documentRoot.querySelectorAll('[data-i18n-aria-label]').forEach(element=>{
        element.setAttribute('aria-label',t(element.dataset.i18nAriaLabel,{},element.getAttribute('aria-label')||''));
      });
      documentRoot.querySelectorAll('[data-i18n-content]').forEach(element=>{
        element.setAttribute('content',t(element.dataset.i18nContent,{},element.getAttribute('content')||''));
      });
    }

    return {language,t,apply};
  }

  return {create};
});
