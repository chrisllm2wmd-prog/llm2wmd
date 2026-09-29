
var currentHeadlineIndex = 0;

function buildHeadlineProgress(){
  var wrap = document.getElementById('ha-progress');
  if(!wrap || wrap.childNodes.length) return;
  var frag = document.createDocumentFragment();
  HEADLINE_STORIES.forEach(function(story, i){
    var dot = document.createElement('span');
    dot.className = 'ha-progress-dot';
    dot.dataset.idx = i;
    frag.appendChild(dot);
    if(i < HEADLINE_STORIES.length - 1){
      var line = document.createElement('span');
      line.className = 'ha-progress-line';
      frag.appendChild(line);
    }
  });
  wrap.appendChild(frag);
}

function renderHeadlineProgress(idx){
  var wrap = document.getElementById('ha-progress');
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

function renderHeadlineArticle(idx){
  var max = HEADLINE_STORIES.length - 1;
  if(idx < 0) idx = 0;
  if(idx > max) idx = max;
  currentHeadlineIndex = idx;
  var s = HEADLINE_STORIES[idx];
  var art = document.getElementById('headline-article');
  if(!art || !s) return;
  var html = '';
  html += '<h2 class="ha-headline">' + s.headline + '</h2>';
  html += '<div class="ha-deck">' + s.deck + '</div>';
  html += '<div class="ha-byline">' + s.byline + '</div>';
  html += '<div class="ha-rule"></div>';
  html += '<div class="ha-body">' + s.body + '</div>';
  html += '<div class="ha-sources"><span class="cx">SOURCES:</span> ' + s.sources + '</div>';
  art.innerHTML = html;
  art.scrollTop = 0;
  renderHeadlineProgress(idx);
  var counter = document.getElementById('ha-nav-counter');
  if(counter) counter.textContent = (idx + 1) + ' / ' + HEADLINE_STORIES.length;
  var prevBtn = document.getElementById('ha-nav-prev');
  var nextBtn = document.getElementById('ha-nav-next');
  if(prevBtn) prevBtn.disabled = (idx === 0);
  if(nextBtn) nextBtn.disabled = (idx === max);
  var sidePrevBtn = document.getElementById('ha-side-prev');
  var sideNextBtn = document.getElementById('ha-side-next');
  if(sidePrevBtn) sidePrevBtn.disabled = (idx === 0);
  if(sideNextBtn) sideNextBtn.disabled = (idx === max);
}

(function(){
  var pageTurnCtx;
  function getPageTurnCtx(){
    if(!pageTurnCtx){
      var AC = window.AudioContext || window.webkitAudioContext;
      if(AC){ try{ pageTurnCtx = new AC(); }catch(e){} }
    }
    return pageTurnCtx;
  }
  window.playPageTurnSound = function(){
    var ctx = getPageTurnCtx();
    if(!ctx) return;
    if(ctx.state === 'suspended'){ try{ ctx.resume(); }catch(e){} }
    var now = ctx.currentTime;
    var dur = 0.32;
    var bufferSize = Math.max(1, Math.floor(ctx.sampleRate * dur));
    var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    var data = buffer.getChannelData(0);
    for(var i=0;i<bufferSize;i++){
      var envelope = 1 - (i / bufferSize);
      data[i] = (Math.random()*2-1) * envelope;
    }
    var noise = ctx.createBufferSource();
    noise.buffer = buffer;

    var filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 0.6;
    filter.frequency.setValueAtTime(2600, now);
    filter.frequency.exponentialRampToValueAtTime(700, now + dur);

    var gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.55, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    try{
      noise.start(now);
      noise.stop(now + dur);
    }catch(e){}
  };
})();

window.headlineNav = function(delta){
  var next = currentHeadlineIndex + delta;
  if(next < 0 || next > HEADLINE_STORIES.length - 1) return false;
  if(window.playPageTurnSound) window.playPageTurnSound();
  renderHeadlineArticle(next);
  var computeTargetY = function(){
    var target = document.querySelector('#headline-article .ha-headline') || document.getElementById('headline-article');
    if(!target) return null;
    var tabsEl = document.querySelector('.tabs');
    var tabsVisible = tabsEl && tabsEl.offsetHeight > 0 && getComputedStyle(tabsEl).display !== 'none';
    var tabsFixed = tabsEl && getComputedStyle(tabsEl).position === 'fixed';
    var barEl = document.getElementById('ha-sticky-bar');
    var barHeight = (barEl && document.body.classList.contains('headlines-page-active')) ? barEl.offsetHeight : 0;
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
    if(dx < 0){ headlineNav(1); }
    else { headlineNav(-1); }
  }
  function onTouchCancel(){ touchActive = false; swipeDecision = null; }
  function attachSwipe(){
    var target = document.getElementById('page-headlines');
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
  document.addEventListener('keydown', function(e){
    var current = (window.LLM2WMDApp && window.LLM2WMDApp.state) ? window.LLM2WMDApp.state.currentPage : null;
    if(current === 'headlines'){
      if(e.key === 'ArrowLeft'){ headlineNav(1); }
      else if(e.key === 'ArrowRight'){ headlineNav(-1); }
    } else if(current === 'review'){
      if(e.key === 'ArrowLeft'){ reviewNav(-1); }
      else if(e.key === 'ArrowRight'){ reviewNav(1); }
    }
  });
})();

(function(){
  function isHeadlineMode(){ return lsGet('llm2wmd_headline_mode') === '1'; }
  function setHeadlineMode(active){ lsSet('llm2wmd_headline_mode', active ? '1' : '0'); syncTimelineTab(); }
  function syncTimelineTab(){
    var current = (window.LLM2WMDApp && window.LLM2WMDApp.state) ? window.LLM2WMDApp.state.currentPage : null;
    document.body.classList.toggle('headlines-page-active', current === 'headlines');
    document.body.classList.toggle('review-page-active', current === 'review');
    var tab = document.getElementById('tab-timeline');
    if(!tab) return;
    var active = isHeadlineMode();
    var label = active ? 'HEADLINE' : 'TIMELINE';
    tab.setAttribute('data-full', label);
    tab.setAttribute('data-mobile', label);
    var mobile = window.innerWidth <= 480;
    tab.textContent = mobile ? tab.getAttribute('data-mobile') : tab.getAttribute('data-full');
    if(current === 'timeline' || current === 'headlines') tab.classList.add('active');
  }
  window.syncTimelineTab = syncTimelineTab;
    window.gotoTimelineTab = function(el){
    var target = isHeadlineMode() ? 'headlines' : 'timeline';
    return switchTab(target, el);
  };
  if(window.LLM2WMDApp && window.LLM2WMDApp.router && typeof window.LLM2WMDApp.router.switchPage === 'function'){
    var _origSwitchPage = window.LLM2WMDApp.router.switchPage;
    window.LLM2WMDApp.router.switchPage = function(id, opts){
      var result = _origSwitchPage(id, opts);
      if(id === 'headlines'){
        setHeadlineMode(true);
        renderHeadlineArticle(0);
        if(window.sizeHeadlinesSpacer) window.sizeHeadlinesSpacer();
        setTimeout(function(){ if(window.sizeHeadlinesSpacer) window.sizeHeadlinesSpacer(); }, 60);
      }
      else if(id === 'timeline') setHeadlineMode(false);
      else if(id === 'review'){
        syncTimelineTab();
        if(window.renderReviewArticle) window.renderReviewArticle(0);
        if(window.sizeReviewSpacer) window.sizeReviewSpacer();
        setTimeout(function(){ if(window.sizeReviewSpacer) window.sizeReviewSpacer(); }, 60);
      }
      else syncTimelineTab();
      return result;
    };
  }
  function sizeHeadlinesSpacer(){
    var spacer = document.getElementById('headlines-spacer');
    var tabsEl = document.querySelector('.tabs');
    var bar = document.getElementById('ha-sticky-bar');
    if(!spacer || !tabsEl) return;
    var tabsVisible = tabsEl.offsetHeight > 0 && getComputedStyle(tabsEl).display !== 'none';
    var tabsFixed = getComputedStyle(tabsEl).position === 'fixed';
    var tabsBottom = tabsVisible ? (tabsFixed ? tabsEl.getBoundingClientRect().bottom : (tabsEl.offsetHeight + (parseInt(getComputedStyle(tabsEl).top) || 0))) : 0;
    if(!tabsVisible){var navEl=document.getElementById('site-nav'); if(navEl) tabsBottom = navEl.getBoundingClientRect().bottom;}
    var barActive = bar && document.body.classList.contains('headlines-page-active');
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
  window.sizeHeadlinesSpacer = sizeHeadlinesSpacer;
  syncTimelineTab();
  buildHeadlineProgress();
  renderHeadlineArticle(0);
  sizeHeadlinesSpacer();
  setTimeout(sizeHeadlinesSpacer, 300);
  window.addEventListener('resize', function(){ syncTimelineTab(); sizeHeadlinesSpacer(); });
  window.addEventListener('load', sizeHeadlinesSpacer);
})();
