(()=>{const drawer=document.querySelector('[data-drawer]'),scrim=document.querySelector('.drawer-scrim');const close=()=>{drawer?.classList.remove('open');scrim?.classList.remove('open')};document.querySelectorAll('[data-drawer-open]').forEach(b=>b.onclick=()=>{drawer?.classList.add('open');scrim?.classList.add('open')});document.querySelectorAll('[data-drawer-close]').forEach(b=>b.onclick=close);document.addEventListener('keydown',e=>{if(e.key==='Escape')close()})})();


// Global day/night appearance preference. Persist separately from page layouts and study state.
(()=>{
  const button=document.querySelector('[data-theme-toggle]');
  if(!button)return;
  const root=document.documentElement;
  const meta=document.querySelector('meta[data-theme-color]');
  const pageLang=document.body?.dataset.lang==='es'?'es':'en';
  const labels={
    en:{day:'Switch to day mode',night:'Switch to night mode'},
    es:{day:'Cambiar a modo diurno',night:'Cambiar a modo nocturno'}
  };
  const apply=(theme,persist=false)=>{
    const night=theme==='night';
    root.dataset.theme=night?'night':'day';
    button.setAttribute('aria-pressed',String(night));
    button.setAttribute('aria-label',night?labels[pageLang].day:labels[pageLang].night);
    button.title=night?labels[pageLang].day:labels[pageLang].night;
    const icon=button.querySelector('.theme-toggle__icon');
    if(icon)icon.textContent=night?'☀':'☾';
    meta?.setAttribute('content',night?'#0d1114':'#f5f2eb');
    if(persist){try{localStorage.setItem('mk.preferences.theme',night?'night':'day')}catch(_){}}
  };
  apply(root.dataset.theme==='night'?'night':'day');
  button.addEventListener('click',()=>apply(root.dataset.theme==='night'?'day':'night',true));
})();
