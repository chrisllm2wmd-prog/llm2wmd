
(function(){
  function positionHamburgerDesktop(){
    try{
      if(window.innerWidth<769){return;}
      var tabs=document.querySelector('.tabs')||document.getElementById('tab-bar');
      if(!tabs)return;
      var visible=tabs.offsetHeight>0 && getComputedStyle(tabs).display!=='none';
      if(!visible)return;
      var rect=tabs.getBoundingClientRect();
      var top=rect.top+(rect.height/2);
      document.documentElement.style.setProperty('--hamburger-desktop-top',top+'px');
    }catch(e){}
  }
  window.positionHamburgerDesktop=positionHamburgerDesktop;
  window.addEventListener('resize',positionHamburgerDesktop);
  window.addEventListener('load',positionHamburgerDesktop);
  document.addEventListener('DOMContentLoaded',positionHamburgerDesktop);
  positionHamburgerDesktop();
  setTimeout(positionHamburgerDesktop,300);
  var origSetSimpleMode=window.setSimpleMode;
  if(typeof origSetSimpleMode==='function'){
    window.setSimpleMode=function(){
      var r=origSetSimpleMode.apply(this,arguments);
      positionHamburgerDesktop();
      return r;
    };
  }
})();
