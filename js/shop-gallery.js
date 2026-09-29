function llm2wmdOpenShop(targetSelector){if(typeof maybeShowTabIntro==='function')maybeShowTabIntro('shop');var target=null;if(targetSelector){target=document.querySelector(targetSelector);}var el=target||document.getElementById('shop-section');if(el){var tabsEl=document.querySelector('.tabs');var headerBottom;if(tabsEl&&tabsEl.offsetHeight>0&&getComputedStyle(tabsEl).display!=='none'){headerBottom=tabsEl.getBoundingClientRect().bottom;}else{var siteNav=document.getElementById('site-nav');headerBottom=siteNav?siteNav.getBoundingClientRect().bottom:0;}var rect=el.getBoundingClientRect();var targetY=window.pageYOffset+rect.top-headerBottom-24;window.scrollTo({top:Math.max(targetY,0),behavior:'smooth'});}try{history.replaceState(history.state,'','#shop');}catch(e){}return false;}
function handleShopImgError(img){
  try{
    var wrap=img.closest('.shop-img-wrap');
    if(wrap)wrap.classList.add('img-failed');
  }catch(e){console.error('[shop] handleShopImgError failed:',e);}
}
function openShopGallery(el){
  try{
    var wrap=el.closest('.shop-img-wrap');
    var images=[];
    try{images=JSON.parse((wrap&&wrap.getAttribute('data-gallery'))||'[]');}catch(e){images=[];}
    if(!images.length){var src=el.getAttribute('src');if(src)images=[{src:src,alt:el.getAttribute('alt')||'',label:''}];}
    var name='';
    var card=el.closest('.shop-card');
    if(card){var nameEl=card.querySelector('.shop-name');if(nameEl)name=nameEl.textContent.trim();}
    window.__shopGalleryImages=images;
    window.__shopGalleryIndex=0;
    window.__shopGalleryName=name;
    renderShopLightbox();
  }catch(e){console.error('[shop] openShopGallery failed:',e);}
  return false;
}
function renderShopLightbox(){
  var images=window.__shopGalleryImages||[];
  if(!images.length)return;
  var idx=window.__shopGalleryIndex||0;
  if(idx<0)idx=images.length-1;
  if(idx>=images.length)idx=0;
  window.__shopGalleryIndex=idx;
  var overlay=document.getElementById('shop-lightbox-overlay');
  if(!overlay){
    overlay=document.createElement('div');
    overlay.id='shop-lightbox-overlay';
    overlay.className='shop-lightbox-overlay';
    overlay.innerHTML='<button class="shop-lightbox-close" type="button" aria-label="Close">×</button><button class="shop-lightbox-prev" type="button" aria-label="Previous image">‹</button><img class="shop-lightbox-img" alt=""/><button class="shop-lightbox-next" type="button" aria-label="Next image">›</button><div class="shop-lightbox-caption"></div><div class="shop-lightbox-dots"></div>';
    document.body.appendChild(overlay);
    overlay.querySelector('.shop-lightbox-close').addEventListener('click',closeShopGallery);
    overlay.addEventListener('click',function(e){if(e.target===overlay)closeShopGallery();});
    overlay.querySelector('.shop-lightbox-prev').addEventListener('click',function(){window.__shopGalleryIndex=(window.__shopGalleryIndex-1);renderShopLightbox();});
    overlay.querySelector('.shop-lightbox-next').addEventListener('click',function(){window.__shopGalleryIndex=(window.__shopGalleryIndex+1);renderShopLightbox();});
    document.addEventListener('keydown',shopLightboxKeyHandler);
  }
  var img=images[idx];
  var src=typeof img==='string'?img:img.src;
  var alt=typeof img==='string'?'':(img.alt||'');
  var label=typeof img==='string'?'':(img.label||'');
  var imgEl=overlay.querySelector('.shop-lightbox-img');
  imgEl.src=src;
  imgEl.alt=alt||window.__shopGalleryName||'';
  var caption=overlay.querySelector('.shop-lightbox-caption');
  var parts=[];
  if(window.__shopGalleryName)parts.push(window.__shopGalleryName);
  if(label)parts.push(label);
  caption.textContent=parts.join(' — ');
  var multi=images.length>1;
  overlay.querySelector('.shop-lightbox-prev').style.display=multi?'':'none';
  overlay.querySelector('.shop-lightbox-next').style.display=multi?'':'none';
  var dotsWrap=overlay.querySelector('.shop-lightbox-dots');
  if(multi){
    dotsWrap.innerHTML='';
    images.forEach(function(im,i){
      var dot=document.createElement('button');
      dot.type='button';
      dot.className='shop-lightbox-dot'+(i===idx?' active':'');
      dot.setAttribute('aria-label','View image '+(i+1));
      dot.addEventListener('click',function(){window.__shopGalleryIndex=i;renderShopLightbox();});
      dotsWrap.appendChild(dot);
    });
    dotsWrap.style.display='';
  }else{
    dotsWrap.style.display='none';
  }
  overlay.classList.add('open');
  document.body.classList.add('shop-lightbox-lock');
}
function closeShopGallery(){
  var overlay=document.getElementById('shop-lightbox-overlay');
  if(overlay)overlay.classList.remove('open');
  document.body.classList.remove('shop-lightbox-lock');
}
function shopLightboxKeyHandler(e){
  var overlay=document.getElementById('shop-lightbox-overlay');
  if(!overlay||!overlay.classList.contains('open'))return;
  if(e.key==='Escape')closeShopGallery();
  else if(e.key==='ArrowLeft'){window.__shopGalleryIndex=(window.__shopGalleryIndex-1);renderShopLightbox();}
  else if(e.key==='ArrowRight'){window.__shopGalleryIndex=(window.__shopGalleryIndex+1);renderShopLightbox();}
}
