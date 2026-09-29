
(function(){
  /* Landscape phones/tablets (not iPhone, which has no fullscreen for pages): browsers only allow fullscreen from a tap,
     so rotating to landscape arms it and the very next tap anywhere on the page switches to fullscreen. */
  if(/iPhone|iPod/.test(navigator.userAgent||''))return;
  var root=document.documentElement;
  var rq=root.requestFullscreen||root.webkitRequestFullscreen;
  if(!rq||!window.matchMedia)return;
  var mq=window.matchMedia('(orientation:landscape) and (max-height:500px) and (max-width:1024px) and (pointer:coarse)');
  var armed=false,weEntered=false,toast=null,toastTimer=null;
  function fsEl(){return document.fullscreenElement||document.webkitFullscreenElement||null;}
  function showToast(){
    if(!toast){toast=document.createElement('div');toast.id='ls-fs-toast';toast.textContent='Tap anywhere for full screen';document.body.appendChild(toast);}
    toast.classList.add('show');clearTimeout(toastTimer);
    toastTimer=setTimeout(function(){if(toast)toast.classList.remove('show');},5000);
  }
  function hideToast(){clearTimeout(toastTimer);if(toast)toast.classList.remove('show');}
  function onTap(){
    if(!mq.matches||fsEl()){disarm();return;}
    var p;
    try{p=rq.call(root);}catch(e){return;}
    if(p&&p.then){p.then(function(){weEntered=true;disarm();}).catch(function(){});}
    else{weEntered=true;disarm();}
  }
  function arm(){
    if(armed||fsEl()||!mq.matches)return;
    armed=true;
    document.addEventListener('click',onTap,true);
    document.addEventListener('touchend',onTap,true);
    showToast();
  }
  function disarm(){
    if(!armed)return;
    armed=false;
    document.removeEventListener('click',onTap,true);
    document.removeEventListener('touchend',onTap,true);
    hideToast();
  }
  function onChange(){
    if(mq.matches){arm();}
    else{
      disarm();
      if(weEntered&&fsEl()===root){var ex=document.exitFullscreen||document.webkitExitFullscreen;try{ex.call(document);}catch(e){}}
      weEntered=false;
    }
  }
  if(mq.addEventListener)mq.addEventListener('change',onChange);else if(mq.addListener)mq.addListener(onChange);
  function onFs(){ if(fsEl()===root){weEntered=true;disarm();} else if(!fsEl()){weEntered=false;} }
  document.addEventListener('fullscreenchange',onFs);
  document.addEventListener('webkitfullscreenchange',onFs);
  window.__lsFsRearm=function(){ if(mq.matches&&!fsEl())arm(); };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){arm();});else arm();
})();
