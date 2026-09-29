
(function(){
  var overlay=document.getElementById('dm-zoom-overlay');
  var vp=document.getElementById('dm-zoom-viewport');
  var img=document.getElementById('dm-zoom-img');
  var closeBtn=document.getElementById('dm-zoom-close');
  var navPrev=document.getElementById('dm-zoom-nav-prev');
  var navNext=document.getElementById('dm-zoom-nav-next');
  var swatchesWrap=document.getElementById('dm-zoom-swatches');
  var currentProductId=null;
  var scale=1,minScale=1,maxScale=4,posX=0,posY=0;
  var dragging=false,startX=0,startY=0,startPosX=0,startPosY=0;
  var pinchStartDist=0,pinchStartScale=1;
  var scrollY=0;
  var hintEl=document.getElementById('dm-zoom-hint');
  var isTouch=window.matchMedia&&window.matchMedia('(pointer:coarse)').matches;
  if(hintEl)hintEl.textContent=isTouch?'Tap to hide controls \u00b7 Swipe for next view \u00b7 Pinch to zoom':'Click to hide controls \u00b7 Scroll to zoom \u00b7 Drag to pan';

  function fsEl(){return document.fullscreenElement||document.webkitFullscreenElement||null;}
  function enterFs(){
    if(!isTouch||fsEl())return;
    var rq=overlay.requestFullscreen||overlay.webkitRequestFullscreen;
    if(!rq)return;
    try{var p=rq.call(overlay);if(p&&p.catch)p.catch(function(){});}catch(e){}
  }
  function exitFs(){
    if(fsEl()!==overlay)return;
    var ex=document.exitFullscreen||document.webkitExitFullscreen;
    try{var p=ex&&ex.call(document);if(p&&p.catch)p.catch(function(){});}catch(e){}
  }
  function setClean(on){
    overlay.classList.toggle('dm-clean',!!on);
    if(on)enterFs(); else exitFs();
  }
  function onFsChange(){ if(!fsEl()&&overlay.classList.contains('dm-clean')&&isTouch)overlay.classList.remove('dm-clean'); }
  document.addEventListener('fullscreenchange',onFsChange);
  document.addEventListener('webkitfullscreenchange',onFsChange);

  function swapTo(dir){
    if(!currentProductId||typeof dmNav!=='function')return;
    dmNav(currentProductId,dir);
    syncZoomFromMain();
    img.classList.remove('dm-swap');void img.offsetWidth;img.classList.add('dm-swap');
  }

  function syncZoomFromMain(){
    if(!currentProductId)return;
    var mainImg=document.getElementById('img-'+currentProductId);
    if(!mainImg)return;
    img.src=mainImg.src;
    img.alt=mainImg.alt||'Product zoom';
    resetZoom();
  }
  function updateZoomNav(){
    var prevScroll=swatchesWrap.scrollLeft;
    swatchesWrap.innerHTML='';
    swatchesWrap.style.display='none';
    navPrev.classList.add('dm-zoom-hidden');
    navNext.classList.add('dm-zoom-hidden');
    if(!currentProductId || typeof DM_DATA==='undefined' || typeof DM_STATE==='undefined')return;
    var data=DM_DATA[currentProductId];
    var st=DM_STATE[currentProductId];
    if(!data||!st)return;
    var views=data[st.color]||[];
    if(views.length>1){
      navPrev.classList.remove('dm-zoom-hidden');
      navNext.classList.remove('dm-zoom-hidden');
    }
    var colors=Object.keys(data);
    if(colors.length>1){
      colors.forEach(function(color){
        var thumb=(data[color]&&data[color][0]&&data[color][0].src)||'';
        var btn=document.createElement('button');
        btn.type='button';
        btn.className='dm-zoom-swatch'+(color===st.color?' active':'');
        btn.title=color;
        btn.setAttribute('aria-label','View in '+color);
        var im=document.createElement('img');
        im.src=thumb;im.alt=color;
        btn.appendChild(im);
        btn.addEventListener('click',function(){
          if(typeof dmSelectColor==='function')dmSelectColor(currentProductId,color);
          syncZoomFromMain();
          updateZoomNav();
        });
        swatchesWrap.appendChild(btn);
      });
      swatchesWrap.style.display='flex';
      swatchesWrap.scrollLeft=prevScroll;
      var act=swatchesWrap.querySelector('.dm-zoom-swatch.active');
      if(act){
        var l=act.offsetLeft,r=l+act.offsetWidth,vw=swatchesWrap.clientWidth,sl=swatchesWrap.scrollLeft;
        if(l<sl+8||r>sl+vw-8)swatchesWrap.scrollLeft=Math.max(0,l-(vw-act.offsetWidth)/2);
      }
    }
  }
  navPrev.addEventListener('click',function(){
    if(!currentProductId||typeof dmNav!=='function')return;
    dmNav(currentProductId,-1);
    syncZoomFromMain();
  });
  navNext.addEventListener('click',function(){
    if(!currentProductId||typeof dmNav!=='function')return;
    dmNav(currentProductId,1);
    syncZoomFromMain();
  });

  function applyTransform(){
    img.style.transform='translate('+posX+'px,'+posY+'px) scale('+scale+')';
    img.classList.toggle('dm-zoomed',scale>1.001);
  }
  function clampPos(){
    if(scale<=1){posX=0;posY=0;return;}
    var rect=img.getBoundingClientRect();
    var vpRect=vp.getBoundingClientRect();
    var overflowX=Math.max(0,(rect.width-vpRect.width)/2);
    var overflowY=Math.max(0,(rect.height-vpRect.height)/2);
    posX=Math.max(-overflowX,Math.min(overflowX,posX));
    posY=Math.max(-overflowY,Math.min(overflowY,posY));
  }
  function resetZoom(){scale=1;posX=0;posY=0;applyTransform();}

  window.dmOpenZoom=function(src,alt,productId){
    if(!src)return false;
    img.src=src;
    img.alt=alt||'Product zoom';
    resetZoom();
    currentProductId=productId||null;
    updateZoomNav();
    overlay.classList.remove('dm-clean');
    overlay.classList.add('open');
    scrollY=window.scrollY||document.documentElement.scrollTop||0;
    document.body.classList.add('dm-zoom-lock');
    document.body.style.top=(-scrollY)+'px';
    return false;
  };
  function closeZoom(){
    clearTimeout(tapTimer);
    overlay.classList.remove('dm-clean');
    exitFs();
    overlay.classList.remove('open');
    if(window.__lsFsRearm)setTimeout(window.__lsFsRearm,50);
    document.body.classList.remove('dm-zoom-lock');
    document.body.style.top='';
    var html=document.documentElement;
    var prevBehavior=html.style.scrollBehavior;
    html.style.scrollBehavior='auto';
    window.scrollTo(0,scrollY);
    html.style.scrollBehavior=prevBehavior;
    resetZoom();
  }
  closeBtn.addEventListener('click',closeZoom);
  var tapTimer=null,swallowClickUntil=0,gStartX=0,gStartY=0,gMoved=false,gMulti=false,gActive=false;
  vp.addEventListener('click',function(e){
    if(Date.now()<swallowClickUntil)return;
    clearTimeout(tapTimer);
    tapTimer=setTimeout(function(){ setClean(!overlay.classList.contains('dm-clean')); },230);
  });
  vp.addEventListener('touchstart',function(e){
    if(e.touches.length>1){gMulti=true;return;}
    gMulti=false;gMoved=false;gActive=true;
    gStartX=e.touches[0].clientX;gStartY=e.touches[0].clientY;
  },{passive:true});
  vp.addEventListener('touchmove',function(e){
    if(!gActive)return;
    var t=e.touches[0];
    if(Math.abs(t.clientX-gStartX)>10||Math.abs(t.clientY-gStartY)>10)gMoved=true;
  },{passive:true});
  vp.addEventListener('touchend',function(e){
    if(e.touches.length>0)return;
    if(!gActive)return;
    gActive=false;
    var t=e.changedTouches[0];
    var dx=t.clientX-gStartX,dy=t.clientY-gStartY;
    if(gMulti||gMoved)swallowClickUntil=Date.now()+450;
    if(!gMulti&&scale<=1.001&&Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.5){
      if(!navPrev.classList.contains('dm-zoom-hidden')) swapTo(dx<0?1:-1);
    }
  },{passive:true});
  document.addEventListener('keydown',function(e){
    if(!overlay.classList.contains('open'))return;
    if(e.key==='Escape'){closeZoom();return;}
    if(e.key==='ArrowLeft'&&!navPrev.classList.contains('dm-zoom-hidden')){navPrev.click();return;}
    if(e.key==='ArrowRight'&&!navNext.classList.contains('dm-zoom-hidden')){navNext.click();return;}
  });

  img.addEventListener('dblclick',function(e){
    e.preventDefault();
    clearTimeout(tapTimer);
    if(scale>1.001){ resetZoom(); } else { scale=2.4; clampPos(); applyTransform(); }
  });

  img.addEventListener('wheel',function(e){
    e.preventDefault();
    var delta=e.deltaY<0?0.18:-0.18;
    scale=Math.max(minScale,Math.min(maxScale,scale+delta));
    if(scale<=1.001)resetZoom(); else { clampPos(); applyTransform(); }
  },{passive:false});

  img.addEventListener('mousedown',function(e){
    if(scale<=1.001)return;
    dragging=true; img.classList.add('dm-dragging');
    startX=e.clientX; startY=e.clientY; startPosX=posX; startPosY=posY;
    e.preventDefault();
  });
  window.addEventListener('mousemove',function(e){
    if(!dragging)return;
    posX=startPosX+(e.clientX-startX);
    posY=startPosY+(e.clientY-startY);
    if(Math.abs(e.clientX-startX)>4||Math.abs(e.clientY-startY)>4)swallowClickUntil=Date.now()+300;
    clampPos(); applyTransform();
  });
  window.addEventListener('mouseup',function(){ dragging=false; img.classList.remove('dm-dragging'); });

  function touchDist(t){ var dx=t[0].clientX-t[1].clientX,dy=t[0].clientY-t[1].clientY; return Math.sqrt(dx*dx+dy*dy); }
  img.addEventListener('touchstart',function(e){
    if(e.touches.length===2){
      pinchStartDist=touchDist(e.touches); pinchStartScale=scale;
    } else if(e.touches.length===1 && scale>1.001){
      dragging=true; startX=e.touches[0].clientX; startY=e.touches[0].clientY; startPosX=posX; startPosY=posY;
    }
  },{passive:true});
  img.addEventListener('touchmove',function(e){
    if(e.touches.length===2){
      e.preventDefault();
      var d=touchDist(e.touches);
      var next=pinchStartScale*(d/pinchStartDist);
      scale=Math.max(minScale,Math.min(maxScale,next));
      if(scale<=1.001)resetZoom(); else { clampPos(); applyTransform(); }
    } else if(e.touches.length===1 && dragging){
      e.preventDefault();
      posX=startPosX+(e.touches[0].clientX-startX);
      posY=startPosY+(e.touches[0].clientY-startY);
      clampPos(); applyTransform();
    }
  },{passive:false});
  img.addEventListener('touchend',function(e){ if(e.touches.length===0)dragging=false; });

  document.querySelectorAll('.dm-main-img').forEach(function(mainImg){
    mainImg.addEventListener('click',function(){
      if(!mainImg.src)return;
      var pid=(mainImg.id||'').replace(/^img-/,'');
      window.dmOpenZoom(mainImg.src,mainImg.alt,pid);
    });
  });
})();
