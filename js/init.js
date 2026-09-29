window.addEventListener('scroll', function() {
  var d = document.documentElement;
  var prog = document.getElementById('prog');
  if (prog) prog.style.width = (d.scrollTop / (d.scrollHeight - d.clientHeight) * 100) + '%';
});

function toggleCard(card, evt) {
  if (evt) evt.stopPropagation();
  var isOpen = card.classList.toggle('open');
  // Remove any inline maxHeight — let CSS handle it entirely
  var more = card.querySelector('.more');
  if (more) more.style.maxHeight = '';
  var hint = card.querySelector('.hint');
  if (hint) {
    var textNode = hint.childNodes[0];
    if (textNode && textNode.nodeType === 3) textNode.textContent = isOpen ? 'CLICK TO COLLAPSE ' : 'CLICK TO EXPAND ';
    else hint.innerHTML = (isOpen ? 'CLICK TO COLLAPSE ' : 'CLICK TO EXPAND ') + '<span class="hint-arrow">▼</span>';
  }
}

function buildDateGroups() {
  // Structure already in HTML — just open all groups and wire cards
  document.querySelectorAll('.date-group-events').forEach(function(el) {
    el.classList.add('open');
  });
  document.querySelectorAll('.date-group-header').forEach(function(hdr) {
    hdr.classList.add('open');
    var tick = hdr.querySelector('.date-group-tick');
    if (tick) tick.textContent = '−';
    hdr.addEventListener('click', function() {
      var events = hdr.nextElementSibling;
      if (!events) return;
      var open = events.classList.toggle('open');
      hdr.classList.toggle('open', open);
      if (tick) tick.textContent = open ? '−' : '+';
    });
  });
  // Card expand via delegation
  var tl = document.getElementById('tl');
  if (tl) {
    tl.addEventListener('click', function(e) {
      var node = e.target;
      while (node && node !== tl) {
        if (node.classList && node.classList.contains('card')) {
          node.classList.toggle('open');
          var hint = node.querySelector('.hint');
          if (hint) {
            var isOpen = node.classList.contains('open');
            var tn = hint.childNodes[0];
            if (tn && tn.nodeType === 3) tn.textContent = isOpen ? 'CLICK TO COLLAPSE ' : 'CLICK TO EXPAND ';
          }
          return;
        }
        // Don't let clicks on date-group-header bubble to card
        if (node.classList && node.classList.contains('date-group-header')) return;
        node = node.parentNode;
      }
    });
  }
}

function setPhaseStickyOffset() {
  var tabsEl = document.querySelector('.tabs');
  var navEl = document.querySelector('.nav');
  var top = 145;

  if (tabsEl) {
    var tabsRect = tabsEl.getBoundingClientRect();
    top = Math.round(tabsRect.top + tabsEl.offsetHeight + 22);
  } else if (navEl) {
    top = Math.round(navEl.offsetHeight + 12);
  }

  document.documentElement.style.setProperty('--phase-sticky-top', top + 'px');
  document.documentElement.style.setProperty('--phase-sticky-top-mobile', top + 'px');
}


function setSimpleMode(enabled){
  document.body.classList.toggle('simple-mode', !!enabled);
  var cb = document.getElementById('ui-mode-toggle-input');
  if (cb) cb.checked = !!enabled;
  try { localStorage.setItem('llm2wmd_simple_mode', enabled ? '1' : '0'); } catch(e) {}
}
function toggleSimpleMode(forceState){
  var enabled = typeof forceState === 'boolean' ? forceState : !document.body.classList.contains('simple-mode');
  setSimpleMode(enabled);
}
function initSimpleModeToggle(){
  var enabled = false;
  try { enabled = localStorage.getItem('llm2wmd_simple_mode') === '1'; } catch(e) {}
  setSimpleMode(enabled);
}

function ensureTimelineSourceButtons(root){
  var scope = root || document.getElementById('page-timeline') || document;
  scope.querySelectorAll('.date-group').forEach(function(group){
    var card = group.querySelector('.card');
    var titleEl = group.querySelector('.et');
    var more = group.querySelector('.more');
    if (!card || !titleEl || !more) return;
    if (more.querySelector('.timeline-source-btn-wrap')) return;
    var title = titleEl.textContent.trim();
    var wrap = document.createElement('div');
    wrap.className = 'timeline-source-btn-wrap';
    var row = document.createElement('div');
    row.className = 'timeline-source-row';
    var btn = document.createElement('button');
    btn.className = 'timeline-source-btn';
    btn.type = 'button';
    btn.textContent = 'SHOW SOURCE';
    var panel = document.createElement('div');
    panel.className = 'timeline-source-panel';
    panel.innerHTML = renderTimelineSourcePanel(title);
    btn.onclick = function(e){
      e.stopPropagation();
      var isOpen = panel.classList.toggle('open');
      btn.textContent = isOpen ? 'HIDE SOURCE' : 'SHOW SOURCE';
    };
    row.appendChild(btn);
    wrap.appendChild(row);
    wrap.appendChild(panel);
    more.appendChild(wrap);
  });
}
function initPage() {
  // ── GROUP TIMELINE EVENTS BY DATE ──
  buildDateGroups();
  ensureTimelineSourceButtons();
  buildSourcesIndex();
  initSimpleModeToggle();
  setPhaseStickyOffset();

  // Set mission spacer to clear nav + tabs exactly
  var spacer = document.getElementById('mission-spacer');
  if (spacer) {
    var tabsEl = document.querySelector('.tabs');
    var tabEl = document.querySelector('.tab');
    if (tabsEl && tabEl) {
      var tabsBottom = tabsEl.getBoundingClientRect().top + tabsEl.offsetHeight;
      // Measure from page top (tabs is fixed, so top = tabs top + height)
      var tabsTop = parseInt(tabsEl.style.top || window.getComputedStyle(tabsEl).top) || 0;
      var tabsH = tabsEl.offsetHeight;
      spacer.style.height = (tabsTop + tabsH + 32) + 'px';
    } else {
      spacer.style.height = '220px';
    }
  }
  // Init comments
  // Review spacer (same logic as mission spacer)
  var rSpacer = document.getElementById('review-spacer');
  if (rSpacer) {
    var tabsEl2 = document.querySelector('.tabs');
    if (tabsEl2) {
      var tabsTop2 = parseInt(window.getComputedStyle(tabsEl2).top)||133;
      rSpacer.style.height = (tabsEl2.offsetHeight + tabsTop2 + 32) + 'px';
    } else { rSpacer.style.height = '180px'; }
  }
  // Thesis spacer
  var thSpacer = document.getElementById('thesis-spacer');
  if (thSpacer) {
    var tabsEl3 = document.querySelector('.tabs');
    if (tabsEl3) {
      var tabsTop3 = parseInt(window.getComputedStyle(tabsEl3).top)||133;
      thSpacer.style.height = (tabsEl3.offsetHeight + tabsTop3 + 32) + 'px';
    } else { thSpacer.style.height = '200px'; }
  }
  // Contents spacer
  var ctSpacer = document.getElementById('contents-spacer');
  if (ctSpacer) {
    var tabsEl4 = document.querySelector('.tabs');
    if (tabsEl4) {
      var tabsTop4 = parseInt(window.getComputedStyle(tabsEl4).top)||133;
      ctSpacer.style.height = (tabsEl4.offsetHeight + tabsTop4 + 32) + 'px';
    } else { ctSpacer.style.height = '220px'; }
  }
  function recalcSpacers(){
    var tabs=document.querySelector('.tabs');
    if(!tabs)return;
    var tt=parseInt(window.getComputedStyle(tabs).top)||0;
    var th=tabs.offsetHeight;
    var h=(th+tt+32)+'px';
    ['mission-spacer','review-spacer','thesis-spacer','contents-spacer'].forEach(function(id){
      var el=document.getElementById(id);if(el)el.style.height=h;
    });
  }
  window.addEventListener('resize',recalcSpacers);
  setTimeout(recalcSpacers, 300);
  // Mobile tab label swap
  function applyTabLabels(){
    var mobile = window.innerWidth <= 480;
    document.querySelectorAll('.tab[data-full]').forEach(function(t){
      t.textContent = mobile ? t.dataset.mobile : t.dataset.full;
    });
  }
  applyTabLabels();
  window.addEventListener('resize', applyTabLabels);
  // Thesis: animated data stream + fake progress
  (function(){
    var fragments = [
      'SCANNING ARGUMENT STRUCTURE...','CROSS-REFERENCING TIMELINE DATA...','CALCULATING WORD COUNT...',
      'ASSESSING RHETORICAL IMPACT...','THREAT LEVEL: SIGNIFICANT','CHECKING FOR NEUTRALITY: NONE FOUND',
      'BIAS DETECTED: INTENTIONAL','SOURCES: DOCUMENTED','FOOTNOTES: PENDING','DRAFT STATUS: DRAFT 0.0',
      'AUTHOR LOCATION: UNKNOWN','DEADLINE: SELF-IMPOSED','SELF-IMPOSED DEADLINE: IGNORED',
      'IRONY LEVELS: ELEVATED','ESTIMATED PAGES: MANY','ESTIMATED PAGES: TOO MANY',
      'ARGUMENT: IN PROGRESS','CONCLUSION: REACHED. WRITTEN? NO.','WORD COUNT: INSUFFICIENT',
      'WORD COUNT: EXCESSIVE','REDRAFTING...','STILL REDRAFTING...','OPENING LINE: DELETED AGAIN',
    ];
    var stream = document.getElementById('thesis-stream');
    var bar = document.getElementById('thesis-bar');
    var label = document.getElementById('thesis-progress-label');
    var wc = document.getElementById('thesis-wordcount');
    var fakeWords = 0;
    var fakeProgress = 0;
    if (!stream) return;
    // Fake word count ticking up then stopping
    var wcTick = setInterval(function(){
      fakeWords += Math.floor(Math.random()*40+10);
      if (fakeWords > 847) { fakeWords = 847; clearInterval(wcTick); if(wc) wc.textContent = fakeWords + ' WORDS · INCOMPLETE'; }
      else if (wc) wc.textContent = fakeWords + ' WORDS';
    }, 120);
    // Fake progress bar crawls to 12% then stalls
    setTimeout(function(){
      if(bar) bar.style.width = '12%';
      if(label) label.textContent = '12% · STALLED';
    }, 1800);
    // Data stream lines
    var si = 0;
    var streamTick = setInterval(function(){
      if (!document.getElementById('thesis-stream')) { clearInterval(streamTick); return; }
      var line = document.createElement('div');
      line.textContent = '> ' + fragments[si % fragments.length];
      stream.appendChild(line);
      if (stream.children.length > 4) stream.removeChild(stream.firstChild);
      si++;
    }, 1400);
  })();
  window.addEventListener('resize', function() {
    var spacer = document.getElementById('mission-spacer');
    var tabsEl = document.querySelector('.tabs');
    if (spacer && tabsEl) {
      var tabsTop = tabsEl.offsetTop || 133;
      spacer.style.height = (tabsEl.offsetHeight + parseInt(window.getComputedStyle(tabsEl).top) + 32) + 'px';
    }
  });
  // Make all timeline events visible immediately (IO was unreliable when page starts hidden)
  var evs = document.querySelectorAll('.ev');
  for (var i = 0; i < evs.length; i++) evs[i].classList.add('vis');

  // Wire touchstart on tab divs for iOS (passive — no scroll suppression)
  var tabMappings = [['tab-timeline','timeline'],['tab-mission','mission'],['tab-credits','credits'],['tab-thesis','thesis'],['tab-review','review'],['tab-contents','contents']];
  tabMappings.forEach(function(pair) {
    var el = document.getElementById(pair[0]);
    if (!el) return;
    el.addEventListener('touchstart', function(e) {
      switchTab(pair[1], el);
    }, {passive: true});
  });
  // Show mission page (default)
  var defPage = document.getElementById('page-mission');
  if (defPage) { defPage.style.display = 'block'; defPage.classList.add('active'); }
  // Kick iOS scroll context — without this, page won't scroll until first tab tap
  setTimeout(function(){ window.scrollTo(0,1); window.scrollTo(0,0); }, 50);
}

function filt(t, btn) {
  // Clear category button highlights
  document.querySelectorAll('.hero-filters .fb').forEach(function(b){ b.classList.remove('on'); });
  if (btn) btn.classList.add('on');
  // Clear company button highlights
  document.querySelectorAll('.co-filters .fb').forEach(function(b){ b.classList.remove('on'); });

  // Reset ALL ev gone state first
  document.querySelectorAll('.ev').forEach(function(ev){ ev.classList.remove('gone'); });

  var groups = document.querySelectorAll('.date-group');
  groups.forEach(function(group) {
    var groupEvs = group.querySelectorAll('.ev');
    var anyVisible = false;
    groupEvs.forEach(function(ev) {
      var matches = t === 'all' || ev.getAttribute('data-t') === t;
      ev.classList.toggle('gone', !matches);
      if (matches) anyVisible = true;
    });
    group.style.display = anyVisible ? '' : 'none';
  });
}

function filtCo(co, btn) {
  // Clear company button highlights
  document.querySelectorAll('.co-filters .fb').forEach(function(b){ b.classList.remove('on'); });
  if (btn) btn.classList.add('on');
  // Clear category button highlights
  document.querySelectorAll('.hero-filters .fb').forEach(function(b){ b.classList.remove('on'); });

  // Reset ALL ev gone state first
  document.querySelectorAll('.ev').forEach(function(ev){ ev.classList.remove('gone'); });

  var groups = document.querySelectorAll('.date-group');
  groups.forEach(function(group) {
    var groupEvs = group.querySelectorAll('.ev');
    var anyVisible = false;
    groupEvs.forEach(function(ev) {
      var matches = ev.getAttribute('data-co') === co;
      ev.classList.toggle('gone', !matches);
      if (matches) anyVisible = true;
    });
    group.style.display = anyVisible ? '' : 'none';
  });
}

function launchGame() {
  var ov = document.getElementById('game-overlay');
  if (ov) ov.style.display = 'block';
  ['scr-personality','scr-dyson','scr-dc1','scr-dc2','scr-dc3','scr-dc4','scr-sarah','scr-sing','scr-over','scr-drones'].forEach(function(id) {
    var el = document.getElementById(id); if (el) el.style.display = 'none';
  });
  var st = document.getElementById('scr-start');
  if (st) st.style.display = 'flex';
  // Hide nav and tabs entirely during game
  var nav = document.querySelector('nav'); if (nav) nav.style.display = 'none';
  var tabs = document.getElementById('tab-bar'); if (tabs) tabs.style.display = 'none';
  // Lock body scroll so only overlays scroll on iOS
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
  if (typeof _playing !== 'undefined' && _playing) { try { toggleAudio(); } catch(e) {} }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPage);
} else {
  initPage();
}

function switchTab(id, el) {
  // Close game if open
  var ov = document.getElementById('game-overlay');
  if (ov && ov.style.display !== 'none' && ov.style.display !== '') { closeGame(); }
  document.querySelectorAll('.page').forEach(function(p){ p.style.display='none'; p.classList.remove('active'); });
  ['tab-timeline','tab-mission','tab-credits','tab-thesis','tab-review','tab-contents','tab-faq','tab-sources'].forEach(function(tid){
    var t=document.getElementById(tid); if(t){ t.classList.remove('active'); }
  });
  var page=document.getElementById('page-'+id);
  if(page){ page.style.display='block'; page.classList.add('active'); }
  var activeTab=document.getElementById('tab-'+id);
  if(activeTab){ activeTab.classList.add('active'); }
  window.scrollTo(0,0);
  if(id==='timeline'){
    document.querySelectorAll('.ev').forEach(function(ev){ ev.classList.add('vis'); });
    document.querySelectorAll('.date-group-events').forEach(function(dge){ dge.classList.add('open'); });
    ensureTimelineSourceButtons();
  }
  if(id==='sources'){ buildSourcesIndex(); }
}

function showChooseLife() {
  var el = document.getElementById('choose-life-overlay');
  if (el) { el.style.display = 'block'; window.scrollTo(0,0); }
}

function closeGame() {
  var ov = document.getElementById('game-overlay');
  if (ov) ov.style.display = 'none';
  if (ov) ov.style.pointerEvents = '';
  // Hide all overlay screens
  ['scr-start','scr-personality','scr-dyson','scr-dc1','scr-dc2','scr-dc3','scr-dc4','scr-sarah','scr-sing','scr-over','scr-drones'].forEach(function(id){
    var el = document.getElementById(id); if (el) el.style.display = 'none';
  });
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.width = '';
  // Stop game loop
  if (typeof G !== 'undefined') { G.running = false; G.paused = false; }
  // Stop theme music
  if (typeof stopTheme === 'function') { try { stopTheme(); } catch(e) {} }
  // Restore nav and tabs
  var nav = document.querySelector('nav'); if (nav) nav.style.display = '';
  var tabs = document.getElementById('tab-bar'); if (tabs) tabs.style.display = '';
  tabs = document.getElementById('tab-bar'); if (tabs) tabs.style.zIndex = '';
  // Restore page scroll position
  window.scrollTo(0, 0);
}
</script>