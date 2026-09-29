
/* Direct link to the V.I.P List signup: https://llm2wmd.com/#vip
   (also accepts #vip-signup and #survivor-signup-section).
   Why this exists: the router treated any hash that was not a page id as "mission" and rewrote it,
   so a plain #survivor-signup-section link never scrolled. The signup lives in the always-present
   shop section below the pages, so the router now hands #vip hashes to this function instead. */
(function(){
  var VIP_HASHES={'vip':1,'vip-signup':1,'survivor-signup-section':1};
  var cancelled=false;
  var events=['wheel','touchstart','mousedown','keydown'];
  function headerBottom(){
    var tabsEl=document.querySelector('.tabs');
    if(tabsEl&&tabsEl.offsetHeight>0&&getComputedStyle(tabsEl).display!=='none')return tabsEl.getBoundingClientRect().bottom;
    var nav=document.getElementById('site-nav');
    return nav?nav.getBoundingClientRect().bottom:0;
  }
  function scrollToVip(){
    if(cancelled)return;
    var el=document.getElementById('survivor-signup-section')||document.getElementById('shop-section');
    if(!el)return;
    var y=window.pageYOffset+el.getBoundingClientRect().top-headerBottom()-24;
    window.scrollTo(0,Math.max(y,0));
    try{document.body.classList.add('shop-view-active');}catch(e){}
  }
  function stop(){
    cancelled=true;
    events.forEach(function(ev){window.removeEventListener(ev,stop,true);});
  }
  window.llm2wmdGoToVip=function(){
    cancelled=false;
    /* Re-align a few times because lazy images and fonts shift the layout after first paint;
       stop as soon as the visitor scrolls or taps so we never fight them. */
    events.forEach(function(ev){window.addEventListener(ev,stop,{capture:true,passive:true,once:true});});
    scrollToVip();
    setTimeout(scrollToVip,150);
    setTimeout(scrollToVip,600);
    if(document.readyState!=='complete')window.addEventListener('load',function(){setTimeout(scrollToVip,50);},{once:true});
    setTimeout(stop,4000);
    return false;
  };
  /* Same-tab case: visitor is already on the site and pastes/opens the #vip link. */
  window.addEventListener('hashchange',function(){
    var h=(location.hash||'').replace('#','');
    if(VIP_HASHES[h])setTimeout(window.llm2wmdGoToVip,0);
  });
})();
