
function openGuaranteeOverlay(){
  var ov = document.getElementById('guarantee-overlay');
  if(!ov) return;
  ov.classList.add('is-open');
  ov.setAttribute('aria-hidden','false');
  document.body.classList.add('guarantee-overlay-open');
  if(!ov.__llmBound){
    ov.__llmBound = true;
    ov.addEventListener('click', function(e){ if(e.target === ov) closeGuaranteeOverlay(); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && ov.classList.contains('is-open')) closeGuaranteeOverlay(); });
  }
}
function closeGuaranteeOverlay(){
  var ov = document.getElementById('guarantee-overlay');
  if(!ov) return;
  ov.classList.remove('is-open');
  ov.setAttribute('aria-hidden','true');
  document.body.classList.remove('guarantee-overlay-open');
}
