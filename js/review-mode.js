

var currentReviewIndex = 0;

function buildReviewProgress(){
  var wrap = document.getElementById('rv-progress');
  if(!wrap || wrap.childNodes.length) return;
  var frag = document.createDocumentFragment();
  SYSTEM_STORIES.forEach(function(story, i){
    var dot = document.createElement('span');
    dot.className = 'ha-progress-dot';
    dot.dataset.idx = i;
    frag.appendChild(dot);
    if(i < SYSTEM_STORIES.length - 1){
      var line = document.createElement('span');
      line.className = 'ha-progress-line';
      frag.appendChild(line);
    }
  });
  wrap.appendChild(frag);
}

function renderReviewProgress(idx){
  var wrap = document.getElementById('rv-progress');
  if(!wrap) return;
  var dots = wrap.querySelectorAll('.ha-progress-dot');
  var lines = wrap.querySelectorAll('.ha-progress-line');
  dots.forEach(function(dot, i){
    dot.classList.toggle('active', i === idx);
    dot.classList.toggle('filled', i < idx);
  });
  lines.forEach(function(line, i){
    line.classList.toggle('filled', i < idx);
  });
}

function renderReviewArticle(idx){
  var max = SYSTEM_STORIES.length - 1;
  if(idx < 0) idx = 0;
  if(idx > max) idx = max;
  currentReviewIndex = idx;
  var s = SYSTEM_STORIES[idx];
  var art = document.getElementById('review-article');
  if(!art || !s) return;
  var html = '';
  html += '<h2 class="ha-headline">' + s.headline + '</h2>';
  html += '<div class="ha-deck">' + s.deck + '</div>';
  html += '<div class="ha-byline">' + s.byline + '</div>';
  html += '<div class="ha-rule"></div>';
  html += '<div class="ha-body">' + s.body + '</div>';
  if(s.pull) html += '<div class="ha-pull">' + s.pull + '</div>';
  html += '<div class="ha-sources">Original piece written by Chris Chapman</div>';
  art.innerHTML = html;
  art.scrollTop = 0;
  renderReviewProgress(idx);
  var counter = document.getElementById('rv-nav-counter');
  if(counter) counter.textContent = (idx + 1) + ' / ' + SYSTEM_STORIES.length;
  var prevBtn = document.getElementById('rv-nav-prev');
  var nextBtn = document.getElementById('rv-nav-next');
  if(prevBtn) prevBtn.disabled = (idx === 0);
  if(nextBtn) nextBtn.disabled = (idx === max);
  var sidePrevBtn = document.getElementById('rv-side-prev');
  var sideNextBtn = document.getElementById('rv-side-next');
  if(sidePrevBtn) sidePrevBtn.disabled = (idx === 0);
  if(sideNextBtn) sideNextBtn.disabled = (idx === max);
}

window.reviewNav = function(delta){
  var next = currentReviewIndex + delta;
  if(next < 0 || next > SYSTEM_STORIES.length - 1) return false;
  if(window.playPageTurnSound) window.playPageTurnSound();
  renderReviewArticle(next);
  var computeTargetY = function(){
    var target = document.querySelector('#review-article .ha-headline') || document.getElementById('review-article');
    if(!target) return null;
    var tabsEl = document.querySelector('.tabs');
    var tabsVisible = tabsEl && tabsEl.offsetHeight > 0 && getComputedStyle(tabsEl).display !== 'none';
    var tabsFixed = tabsEl && getComputedStyle(tabsEl).position === 'fixed';
    var barEl = document.getElementById('rv-sticky-bar');
    var barHeight = (barEl && document.body.classList.contains('review-page-active')) ? barEl.offsetHeight : 0;
    var headerBottom = tabsVisible ? (tabsFixed ? tabsEl.getBoundingClientRect().bottom : 0) : (function(){var n=document.getElementById('site-nav');return n?n.getBoundingClientRect().bottom:0;})();
    var clearance = headerBottom + barHeight + 24;
    return target.getBoundingClientRect().top + window.pageYOffset - clearance;
  };
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      var y = computeTargetY();
      if(y === null) return;
      window.scrollTo({top:y, left:0, behavior:'smooth'});
      setTimeout(function(){
        var y2 = computeTargetY();
        if(y2 === null) return;
        if(Math.abs(window.pageYOffset - y2) > 3){
          window.scrollTo({top:y2, left:0, behavior:'auto'});
        }
      }, 450);
    });
  });
  return false;
};

(function(){
  var touchStartX = 0, touchStartY = 0, touchActive = false, swipeDecision = null;
  function onTouchStart(e){
    if(!e.touches || e.touches.length !== 1) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchActive = true;
    swipeDecision = null;
  }
  function onTouchMove(e){
    if(!touchActive || !e.touches || e.touches.length !== 1) return;
    var dx = e.touches[0].clientX - touchStartX;
    var dy = e.touches[0].clientY - touchStartY;
    if(swipeDecision === null && (Math.abs(dx) > 12 || Math.abs(dy) > 12)){
      swipeDecision = (Math.abs(dx) > Math.abs(dy) * 1.2) ? 'h' : 'v';
    }
    if(swipeDecision === 'h' && e.cancelable){ e.preventDefault(); }
  }
  function onTouchEnd(e){
    if(!touchActive) return;
    touchActive = false;
    var touch = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0] : null;
    if(!touch || swipeDecision !== 'h'){ swipeDecision = null; return; }
    var dx = touch.clientX - touchStartX;
    swipeDecision = null;
    if(Math.abs(dx) < 55) return;
    if(dx < 0){ reviewNav(1); }
    else { reviewNav(-1); }
  }
  function onTouchCancel(){ touchActive = false; swipeDecision = null; }
  function attachSwipe(){
    var target = document.getElementById('page-review');
    if(!target) return;
    target.addEventListener('touchstart', onTouchStart, {passive:true});
    target.addEventListener('touchmove', onTouchMove, {passive:false});
    target.addEventListener('touchend', onTouchEnd, {passive:true});
    target.addEventListener('touchcancel', onTouchCancel, {passive:true});
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', attachSwipe);
  } else {
    attachSwipe();
  }
})();

function sizeReviewSpacer(){
  var spacer = document.getElementById('review-spacer');
  var tabsEl = document.querySelector('.tabs');
  var bar = document.getElementById('rv-sticky-bar');
  if(!spacer || !tabsEl) return;
  var tabsVisible = tabsEl.offsetHeight > 0 && getComputedStyle(tabsEl).display !== 'none';
  var tabsFixed = getComputedStyle(tabsEl).position === 'fixed';
  var tabsBottom = tabsVisible ? (tabsFixed ? tabsEl.getBoundingClientRect().bottom : (tabsEl.offsetHeight + (parseInt(getComputedStyle(tabsEl).top) || 0))) : 0;
  if(!tabsVisible){var navEl=document.getElementById('site-nav'); if(navEl) tabsBottom = navEl.getBoundingClientRect().bottom;}
  var barActive = bar && document.body.classList.contains('review-page-active');
  var barHeight = 0;
  if(bar){
    if(barActive){
      bar.style.top = tabsBottom + 'px';
      barHeight = bar.offsetHeight;
    } else {
      bar.style.top = tabsBottom + 'px';
    }
  }
  spacer.style.height = (tabsBottom + (barActive ? barHeight : 0) + 32) + 'px';
}
window.sizeReviewSpacer = sizeReviewSpacer;

syncTimelineTab();
buildReviewProgress();
renderReviewArticle(0);
sizeReviewSpacer();
setTimeout(sizeReviewSpacer, 300);
window.addEventListener('resize', function(){ sizeReviewSpacer(); });
window.addEventListener('load', sizeReviewSpacer);

