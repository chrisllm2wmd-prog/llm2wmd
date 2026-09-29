
function openVipInfoOverlay(){
  var ov = document.getElementById('vip-info-overlay');
  if(!ov) return;
  var img = document.getElementById('vip-info-logo-img');
  if(img && !img.getAttribute('src')){
    var srcLogo = document.querySelector('.dm-shop-logo');
    if(srcLogo) img.src = srcLogo.src;
  }
  ov.classList.add('is-open');
  ov.setAttribute('aria-hidden','false');
  document.body.classList.add('vip-info-overlay-open');
  if(!ov.__llmBound){
    ov.__llmBound = true;
    ov.addEventListener('click', function(e){ if(e.target === ov) closeVipInfoOverlay(); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && ov.classList.contains('is-open')) closeVipInfoOverlay(); });
  }
}
function closeVipInfoOverlay(){
  var ov = document.getElementById('vip-info-overlay');
  if(!ov) return;
  ov.classList.remove('is-open');
  ov.setAttribute('aria-hidden','true');
  document.body.classList.remove('vip-info-overlay-open');
}
