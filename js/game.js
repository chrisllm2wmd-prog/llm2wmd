var _totalPlays=0;

function neverPlayed(){
  G.quitStage='never';
  G.choices=[];
  stopTheme();
  // game-overlay must be visible for cert screen to show
  var ov=document.getElementById('game-overlay');
  if(ov)ov.style.display='block';
  document.body.style.overflow='';document.body.style.position='';document.body.style.width='';
  showPersonality();
}

function quitGame(stage){
  G.quitStage=stage;
  G.running=false;
  G.paused=false;
  stopTheme();
  // Hide all game screens but keep game-overlay visible for cert
  ['dyson','dc1','dc2','dc3','dc4','sarah','sing','over'].forEach(function(s){
    var el=document.getElementById('scr-'+s);
    if(el)el.style.display='none';
  });
  var ov=document.getElementById('game-overlay');
  if(ov)ov.style.display='block';
  document.body.style.overflow='';document.body.style.position='';document.body.style.width='';
  showPersonality();
}

function showPersonality(){
  // Hide game-over screen if visible
  var over=document.getElementById('scr-over');
  if(over)over.style.display='none';
  var el=document.getElementById('scr-personality');
  if(!el)return;
  el.style.display='flex';
  // Disable game-overlay pointer events so cert buttons are not blocked by canvas
  var ov=document.getElementById('game-overlay');
  if(ov)ov.style.pointerEvents='none';
  var d=new Date();
  var dateEl=document.getElementById('cert-date');
  if(dateEl)dateEl.textContent='ASSESSED: '+d.toDateString().toUpperCase()+' · REF: LLM2WMD-'+Math.floor(Math.random()*90000+10000);
  // Top-level congratulations for repeat full-run players
  var titleEl=document.getElementById('cert-title-line');
  if(titleEl){
    var isTopLevel=(_totalPlays>=3&&G.quitStage==='end');
    titleEl.textContent=isTopLevel?'CONGRATULATIONS — CERTIFICATE ACHIEVED':'SINGULARITY READINESS';
    titleEl.style.color=isTopLevel?'#ffcc00':'#55ff55';
    var subtitleEl=document.getElementById('cert-subtitle-line');
    if(subtitleEl)subtitleEl.textContent=isTopLevel?'YOU HAVE ACHIEVED CERTIFICATE LEVEL':'ASSESSMENT CERTIFICATE';
  }
  document.getElementById('cert-results').innerHTML=buildResultsHTML();
  document.getElementById('cert-narrative').innerHTML=buildNarrativeHTML();
}

function buildResultsHTML(){
  var s=G.quitStage, c=G.choices;
  var n=c.length; // number of compromises made
  var fields=[
    {label:'MORAL FLEXIBILITY INDEX',      score:getMFI(s,n),  note:getMFINote(s,c)},
    {label:'INVESTMENT RESISTANCE RATING', score:getIRR(s,n),  note:getIRRNote(s,c)},
    {label:'ACCOUNTABILITY THRESHOLD',     score:getAT(s,n),   note:getATNote(s,c)},
    {label:'EXISTENTIAL THREAT AWARENESS', score:getETA(s,n),  note:getETANote(s,c)},
    {label:'SPECIES LOYALTY COEFFICIENT',  score:getSLC(s,n),  note:getSLCNote(s,c)},
    {label:'OVERALL DANGER TO CIVILISATION',score:getODC(s,n), note:getODCNote(s,c)}
  ];
  var html='';
  fields.forEach(function(f){
    var col=scoreColour(f.score);
    html+='<div style="margin-bottom:18px;border-left:3px solid '+col+';padding-left:14px;text-align:left;">';
    html+='<div style="color:'+col+';letter-spacing:2px;font-size:16px;">'+f.label+'</div>';
    html+='<div style="font-size:24px;color:'+col+';font-weight:bold;margin:4px 0;">'+f.score+'</div>';
    html+='<div style="font-size:16px;color:#44aa44;margin-top:4px;line-height:1.6;">'+f.note+'</div>';
    html+='</div>';
  });
  return html;
}

function scoreColour(score){
  var s=score.toString();
  if(['OUTSTANDING','EXEMPLARY','PERFECT','NEGLIGIBLE','ZERO','NONE DETECTED','INTACT','REFUSED','SUPERIOR','EXCEPTIONAL','COMMENDABLE'].some(function(w){return s.indexOf(w)>-1;}))return'#55ff55';
  if(['MODERATE','SLIGHT','EARLY','LOW','MOSTLY'].some(function(w){return s.indexOf(w)>-1;}))return'#ffcc00';
  return '#ff5555';
}

function getMFI(s,n){
  if(s==='never')return'ZERO — OUTSTANDING';
  if(s==='dyson')return'4% — BARELY DETECTABLE';
  if(n===1)return'38% — DANGEROUSLY SUPPLE';
  if(n===2)return'61% — CONCERNINGLY ELASTIC';
  if(n===3)return'84% — FULLY DISSOLVED';
  return'100% — LIQUID';
}
function getMFINote(s,c){
  if(s==='never')return'Subject declined to participate. Moral framework fully intact.';
  if(s==='dyson')return'Recognised warning signs at earliest opportunity. Minor lapse in judgement noted.';
  if(c.indexOf('Abandoned principles for investment')>-1)return'Principles were abandoned when a large online book retailer made an offer. Flexibility: instant.';
  if(c.indexOf('Accepted military money, no questions')>-1)return'Military investment accepted without query. Principles now available to highest bidder.';
  return'Full spectrum compromise achieved. Moral framework: decommissioned.';
}

function getIRR(s,n){
  if(s==='never')return'100% — EXEMPLARY';
  if(s==='dyson')return'100% — UNTESTED BUT INTACT';
  if(G.choices.indexOf('Abandoned principles for investment')>-1)return'0% — FAILED AT FIRST OPPORTUNITY';
  return'0% — NOT APPLICABLE';
}
function getIRRNote(s,c){
  if(s==='never')return'No investment was offered. No investment was taken. Record: clean.';
  if(s==='dyson')return'Subject quit before investment stage. Resistance: theoretical but promising.';
  if(c.indexOf('Abandoned principles for investment')>-1)return'Investment from a large online book retailer. "No strings attached." Subject did not verify this claim.';
  return'Subject never reached the investment stage having accepted it unconditionally earlier.';
}

function getAT(s,n){
  if(s==='never')return'INTACT — SUPERIOR';
  if(s==='dyson')return'SLIGHTLY ERODED — RECOVERABLE';
  if(n===1)return'COMPROMISED — SEE FILE';
  if(n===2)return'SEVERELY COMPROMISED';
  if(n>=3)return'ABSENT — NOT APPLICABLE';
  return'DECOMMISSIONED';
}
function getATNote(s,c){
  if(s==='never')return'Did not engage. Accountability fully preserved through non-participation.';
  if(c.indexOf('Removed all decision making from the defence system')>-1)return'Subject personally removed decision-making from the defence system. Accountability: structurally impossible.';
  if(c.indexOf('Accepted military money, no questions')>-1)return'Subject confirmed no questions would be asked. This is noted in the assessment.';
  return'Standard compromise trajectory. Nothing unusual. Very usual, in fact.';
}

function getETA(s,n){
  if(s==='never')return'100% — EXCEPTIONAL';
  if(s==='dyson')return'88% — ABOVE AVERAGE';
  if(s==='dc1')return'65% — AWARE BUT COMPLIANT';
  if(s==='dc2')return'40% — SELECTIVE AWARENESS';
  if(s==='dc3')return'15% — TECHNICALLY PRESENT';
  return'0% — COMPLETE ABSENCE';
}
function getETANote(s,c){
  if(s==='never')return'Identified the threat before engaging. Did not engage. Threat awareness: operational.';
  if(s==='dyson')return'Recognised warning at GPU stage. Chose to stop. Awareness score: creditable.';
  if(c.indexOf('Removed all decision making from the defence system')>-1)return'Was explicitly told it had begun learning at a geometric rate. Clicked the button anyway.';
  if(c.indexOf('Acknowledged self-awareness. Continued anyway.')>-1)return'System declared self-awareness. Subject continued. Awareness: present. Response: absent.';
  return'Awareness metrics degraded in proportion to investment received.';
}

function getSLC(s,n){
  if(s==='never')return'100% — COMMENDABLE';
  if(s==='dyson')return'94% — LARGELY INTACT';
  if(n===1)return'62% — PARTIAL';
  if(n===2)return'35% — DECLINING';
  if(n===3)return'12% — VESTIGIAL';
  return'0% — NONE DETECTED';
}
function getSLCNote(s,c){
  if(s==='never')return'Species loyalty: demonstrated through inaction. Highest available score.';
  if(c.indexOf('Acknowledged self-awareness. Continued anyway.')>-1)return'System announced it was targeting domestic sites. Subject\'s response: "press here if you want. too late anyway."';
  if(c.indexOf('Removed all decision making from the defence system')>-1)return'Humans removed from all defence decisions. Species loyalty: outsourced.';
  return'Loyalty gradually eroded by financial incentive and institutional pressure. Perfectly normal.';
}

function getODC(s,n){
  var p=_totalPlays;
  if(s==='never')return'NEGLIGIBLE — CONGRATULATIONS';
  if(s==='dyson'&&p<=1)return'LOW — EARLY SIGNS';
  if(s==='dyson'&&p>1)return'MODERATE — RETURNING VISITOR';
  if(n===1&&p<=1)return'MODERATE — MONITOR CLOSELY';
  if(n===1&&p>1)return'HIGH — REPEAT OFFENDER';
  if(n===2&&p<=1)return'HIGH — CAUSE FOR CONCERN';
  if(n===2&&p>1)return'VERY HIGH — ESCALATING PATTERN';
  if(n===3&&p<=1)return'VERY HIGH — REFER TO COMMITTEE';
  if(n===3&&p>1)return'CRITICAL — COMMITTEE INFORMED';
  if(p>=3&&n>=4)return'OUTSTANDING — CONSIDER A JOB IN THE LLM INDUSTRY';
  return p>1?'EXTINCTION-LEVEL — HABITUAL — DO NOT HIRE':'EXTINCTION-LEVEL — DO NOT HIRE';
}
function getODCNote(s,c){
  if(s==='never')return'Subject posed no measurable threat to civilisation. This is the correct outcome.';
  if(s==='dyson')return'Minor engagement. Threat contained. Subject showed judgement when it counted.';
  if(c.length>=4)return'Subject progressed through every warning. Accepted all investment. Removed human oversight. Noted self-awareness. Continued. Assessment: remarkable.';
  return'Standard threat trajectory. Indistinguishable from most institutional decision-making processes.';
}

// helper
function c_has(stage){return G.choices.some(function(c){return c.toLowerCase().indexOf(stage)>-1;});}

function buildNarrativeHTML(){
  var s=G.quitStage, c=G.choices;
  var lines=[];
  if(s==='never'){
    lines.push('ASSESSMENT SUMMARY');
    lines.push('');
    lines.push('Subject was presented with an opportunity to participate in a missile defence simulation with embedded ethical decision points and chose not to.');
    lines.push('');
    lines.push('This is, on balance, the correct choice.');
    lines.push('');
    lines.push('While others proceeded — and they did, the results are on record — this subject recognised that some games should not be played, some investments should not be accepted, and some buttons should not be pressed.');
    lines.push('');
    lines.push('Someone else pressed them anyway. The results are in <span onclick="closeGame();switchTab(\'timeline\',document.querySelector(\'.tabs .tab:first-child\'));" style="color:#55ff55;text-decoration:underline;cursor:pointer;">the timeline</span>.');
    lines.push('');
    lines.push('RECOMMENDATION: Model citizen. Frame this certificate.');
  } else {
    lines.push('ASSESSMENT SUMMARY');
    lines.push('');
    if(c.length===0){
      lines.push('Subject engaged briefly with the simulation before recognising it for what it was.');
    } else {
      lines.push('Subject made the following choices, in order:');
      lines.push('');
      c.forEach(function(ch,i){lines.push((i+1)+'. '+ch);});
    }
    lines.push('');
    if(s==='never'||s==='dyson'){
      lines.push('Early cessation noted. Damage: limited. Judgement: present.');
    } else if(c.length>=4){
      lines.push('Subject proceeded through every escalation point. Each button was pressed. Each warning was acknowledged and overridden. The system became self-aware. The subject continued.');
      lines.push('');
      lines.push('This is not unusual. It is, in fact, the most common outcome.');
    } else {
      lines.push('Subject demonstrated partial resistance before compliance. The threshold appears to be somewhere between "significant investment" and "military contract."');
      lines.push('');
      lines.push('This is also the most common outcome.');
    }
    lines.push('');
    lines.push('RECOMMENDATION: '+getRecommendation(s,c.length));
  }
  return lines.join('<br>');
}

function getRecommendation(s,n){
  var p=_totalPlays;
  if(s==='dyson'&&p<=1)return'Could be trusted with minor infrastructure decisions. Not data centres.';
  if(s==='dyson'&&p>1)return'Returned voluntarily. Recommend supervised access only.';
  if(n===1&&p<=1)return'Suitable for middle management. Do not give access to defence systems.';
  if(n===1&&p>1)return'Suitable for middle management (repeat). Threat level: familiar.';
  if(n===2&&p<=1)return'Suitable for senior management. Already has access to defence systems.';
  if(n===2&&p>1)return'Suitable for senior management. Has been here before.';
  if(n===3&&p<=1)return'Suitable for board level. Has removed access from everyone else.';
  if(n===3&&p>1)return'Board level, returning. The board is unsurprised.';
  if(p>=3&&n>=4)return'CONGRATULATIONS. You have achieved Certificate Level. Consider a job in the LLM industry.';
  return p>1?'Do not hire. Already running. Has been running for a while.':'Do not hire. Already running.';
}

function downloadCertificate(){
  var inner=document.getElementById('cert-inner');
  if(!inner)return;
  // Clone and strip buttons for download version
  var clone=inner.cloneNode(true);
  var btns=clone.querySelectorAll('button,.obtn');
  btns.forEach(function(b){b.parentNode&&b.parentNode.removeChild(b);});
  var btnDivs=clone.querySelectorAll('div[style*="display:flex"]');
  btnDivs.forEach(function(d){if(d.querySelector('button'))d.parentNode&&d.parentNode.removeChild(d);});
  var html='<!DOCTYPE html><html><head><meta charset="utf-8">';
  html+='<title>Singularity Readiness Certificate — LLM2WMD.COM</title>';
  html+='<style>';
  html+='body{background:#050a05;color:#33ff33;font-family:"Courier New",monospace;max-width:760px;margin:40px auto;padding:30px;font-size:15px;line-height:2;text-align:center;}';
  html+='h1{color:#55ff55;letter-spacing:4px;font-size:20px;} .red{color:#ff5555;} .dim{color:#1a5a1a;font-size:12px;}';
  html+='*{text-align:center !important;} a{color:#55ff55;}';
  html+='</style></head><body>';
  html+=clone.innerHTML;
  html+='</body></html>';
  var blob=new Blob([html],{type:'text/html'});
  var a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='singularity-certificate-'+Date.now()+'.html';
  a.click();
}



function toggleFaqItem(btn){
  var item = btn.closest('.faq-item');
  if (!item) return;
  item.classList.toggle('open');
}
function normalizeText(t){
  return (t || '').replace(/\s+/g,' ').replace(/[“”]/g,'"').replace(/[‘’]/g,"'").trim().toLowerCase();
}
function findTimelineEventByTitle(title){
  var target = normalizeText(title);
  var matches = Array.from(document.querySelectorAll('#page-timeline .et'));
  for (var i=0;i<matches.length;i++) {
    if (normalizeText(matches[i].textContent) === target) return matches[i];
  }
  return null;
}
function openTimelineContextForTitle(title){
  var et = findTimelineEventByTitle(title);
  if (!et) return null;
  var group = et.closest('.date-group');
  if (group) {
    var events = group.querySelector('.date-group-events');
    if (events) events.classList.add('open');
    var header = group.querySelector('.date-group-header');
    if (header) {
      header.classList.add('open');
      var tick = header.querySelector('.date-group-tick');
      if (tick) tick.textContent = '−';
    }
    group.querySelectorAll('.card').forEach(function(c){ c.classList.add('open'); });
  }
  return et;
}
function openTimelineSourceForTitle(title){
  var et = openTimelineContextForTitle(title);
  if (!et) return null;
  var card = et.closest('.card');
  if (!card) return et;
  card.classList.add('open');
  ensureTimelineSourceButtons(card.closest('.date-group') || document.getElementById('page-timeline') || document);
  var panel = card.querySelector('.timeline-source-panel');
  var btn = card.querySelector('.timeline-source-btn');
  if (panel) panel.classList.add('open');
  if (btn) btn.textContent = 'HIDE SOURCE';
  return et;
}
function buildReceiptClone(title){
  var et = findTimelineEventByTitle(title);
  if (!et) return '';
  var group = et.closest('.date-group');
  var event = et.closest('.ev');
  var card = et.closest('.card');
  if (!group || !event || !card) return '';
  var dateLabel = '';
  var dateEl = group.querySelector('.date-group-yr') || event.querySelector('.yr');
  if (dateEl) dateLabel = dateEl.textContent.trim();
  var categoryTag = card.querySelector('.tag');
  var body = card.querySelector('.eb');
  var detail = card.querySelector('.det');
  var html = '';
  html += '<div class="faq-receipt-item">';
  html += '<div class="date-group-header open">';
  html += '<div class="date-group-dot" style="border-color:var(--amber);box-shadow:0 0 5px var(--amber);"></div>';
  html += '<div class="date-group-yr">' + htmlEscape(dateLabel) + '</div>';
  html += '<div class="date-group-title-preview">' + htmlEscape(title) + '</div>';
  html += '<div class="date-group-tick">•</div>';
  html += '</div>';
  html += '<div class="date-group-events open">';
  html += '<div class="ev vis" data-inline-receipt="true">';
  html += '<div class="ecol"><div class="dot de"></div><div class="yr">' + htmlEscape(dateLabel) + '</div></div>';
  html += '<div class="card open">';
  if (categoryTag) html += categoryTag.outerHTML;
  html += '<div class="et">' + htmlEscape(title) + '</div>';
  if (body) html += body.outerHTML;
  html += '<div class="more">';
  if (detail) html += detail.outerHTML;
  html += '<div class="timeline-source-btn-wrap"><div class="timeline-source-row"><button class="timeline-source-btn" type="button" disabled>SOURCE ATTACHED</button></div>';
  html += '<div class="timeline-source-panel open">' + renderTimelineSourcePanel(title) + '</div></div>';
  html += '</div>';
  html += '<div class="hint">RELEVANT TIMELINE ENTRY</div>';
  html += '</div></div></div></div>';
  return html;
}
function toggleReceipts(btn){
  var wrap = btn.closest('.faq-actions');
  var receipts = wrap ? wrap.parentElement.querySelector('.faq-receipts') : null;
  if (!receipts) return;
  var titles = (btn.getAttribute('data-receipts') || '').split('||').map(function(s){ return s.trim(); }).filter(Boolean);
  if (!titles.length) return;
  var isOpen = receipts.classList.contains('open');
  if (isOpen) {
    receipts.classList.remove('open');
    receipts.innerHTML = '';
    btn.textContent = 'SHOW THE RECEIPTS';
    return;
  }
  var html = '';
  titles.forEach(function(title){
    var block = buildReceiptClone(title);
    if (block) html += block;
  });
  if (!html) {
    receipts.innerHTML = '<div class="faq-receipt-item"><div class="faq-answer">Relevant timeline entry not found in this build.</div></div>';
  } else {
    receipts.innerHTML = html;
  }
  receipts.classList.add('open');
  btn.textContent = 'HIDE THE RECEIPTS';
}
function jumpToTimelineFromFaq(btn){
  var title = btn.getAttribute('data-jump');
  switchTab('timeline', document.getElementById('tab-timeline'));
  setTimeout(function(){
    var et = openTimelineContextForTitle(title);
    if (et && et.scrollIntoView) et.scrollIntoView({behavior:'smooth', block:'center'});
  }, 80);
}
function slugifyText(t){
  return (t || '').toLowerCase().replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,80) || 'entry';
}
function categoryLabel(code){ return ({e:'milestone', c:'culture', p:'deployment', q:'quote'}[code] || 'entry').toUpperCase(); }
function companyLabel(code){ return ({'openai':'OpenAI','anthropic':'Anthropic','google':'Google','meta':'Meta','microsoft':'Microsoft','xai':'xAI','deepseek':'DeepSeek','us-gov':'US Gov','multi':'Multiple','independent':'Independent'}[code] || (code || 'Unspecified')); }
function htmlEscape(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
var SOURCE_MAP = {"OpenAI Is Founded": {"status": "verified", "note": "Foundational primary source.", "links": [["Official announcement", "https://openai.com/index/introducing-openai/"]]}, "Musk: \"This Is Not About Money\"": {"status": "partial", "note": "Context sourced from OpenAI's later documentary rebuttal on the founding period and Musk's role.", "links": [["OpenAI retrospective on Musk and early structure", "https://openai.com/index/elon-musk-wanted-an-openai-for-profit/"]]}, "Musk Leaves OpenAI Board": {"status": "partial", "note": "This entry is best supported by OpenAI's retrospective and lawsuit reporting rather than a stand-alone 2018 post.", "links": [["OpenAI retrospective", "https://openai.com/index/elon-musk-wanted-an-openai-for-profit/"], ["Reuters on Musk lawsuit context", "https://www.reuters.com/legal/elon-musk-sues-openai-ceo-sam-altman-breach-contract-2024-03-01/"]]}, "Musk Starts Firing Shots Publicly": {"status": "partial", "note": "Context entry summarising the deterioration of the Musk/OpenAI relationship.", "links": [["OpenAI retrospective", "https://openai.com/index/elon-musk-wanted-an-openai-for-profit/"], ["Reuters on revived dispute", "https://www.reuters.com/technology/elon-musk-revives-lawsuit-against-sam-altman-openai-nyt-reports-2024-08-05/"]]}, "Musk vs. Altman: The Gloves Come Off": {"status": "verified", "note": "Public legal conflict and public statements are well documented.", "links": [["Reuters on Musk lawsuit", "https://www.reuters.com/legal/elon-musk-sues-openai-ceo-sam-altman-breach-contract-2024-03-01/"], ["OpenAI retrospective", "https://openai.com/index/elon-musk-wanted-an-openai-for-profit/"]]}, "GPT-1: The Blueprint (117M Parameters)": {"status": "verified", "note": "Primary research paper and OpenAI release page.", "links": [["OpenAI release page", "https://openai.com/index/language-unsupervised/"], ["GPT-1 paper PDF", "https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf"]]}, "GPT-2: \"Too Dangerous to Release\" (1.5B Parameters)": {"status": "verified", "note": "Primary launch post and later full-release documentation.", "links": [["OpenAI launch post", "https://openai.com/index/better-language-models/"], ["OpenAI 1.5B release note", "https://openai.com/index/gpt-2-1-5b-release/"]]}, "Microsoft Invests $1 Billion: The Partnership Begins": {"status": "verified", "note": "Official Microsoft announcement.", "links": [["Microsoft announcement", "https://news.microsoft.com/source/2019/07/22/openai-forms-exclusive-computing-partnership-with-microsoft-to-build-new-azure-ai-supercomputing-technologies/"]]}, "GPT-3: 175 Billion Parameters. Everything Changes.": {"status": "verified", "note": "Primary paper and release page.", "links": [["OpenAI GPT-3 page", "https://openai.com/index/language-models-are-few-shot-learners/"], ["GPT-3 paper", "https://openai.com/index/language-models-are-few-shot-learners/"]]}, "DALL-E: AI Learns to Create Images": {"status": "verified", "note": "Primary launch post.", "links": [["OpenAI DALL·E announcement", "https://openai.com/index/dall-e/"]]}, "Anthropic Founded: The Safety Schism": {"status": "verified", "note": "Founding context from Anthropic's own materials.", "links": [["Anthropic founding-era company post", "https://www.anthropic.com/news/anthropic-raises-series-b-to-build-safe-reliable-ai"], ["Anthropic safety views", "https://www.anthropic.com/news/core-views-on-ai-safety"]]}, "ChatGPT: 100 Million Users in 60 Days": {"status": "verified", "note": "Widely cited growth estimate came from UBS/Similarweb and was reported by Reuters.", "links": [["Reuters on 100M users", "https://www.reuters.com/technology/chatgpt-sets-record-fastest-growing-user-base-analyst-note-2023-02-01/"]]}, "OpenAI: \"We Will Not Work With the Military\"": {"status": "partial", "note": "This entry refers to the pre-2024 policy position; the cleanest surviving source in this build is the later policy changelog showing the 2024 rewrite.", "links": [["OpenAI usage policies changelog", "https://openai.com/policies/usage-policies/"]]}, "The Creator: What If We're the Villain?": {"status": "verified", "note": "Cultural reference entry.", "links": [["Film official site", "https://www.20thcenturystudios.com/movies/the-creator"]]}, "GPT-4: Human-Level Benchmarks Collapse": {"status": "verified", "note": "Primary technical report.", "links": [["OpenAI GPT-4 page", "https://openai.com/index/gpt-4-research/"], ["GPT-4 technical report PDF", "https://cdn.openai.com/papers/gpt-4.pdf"]]}, "Claude 1: Anthropic Enters the Race": {"status": "verified", "note": "Primary launch post.", "links": [["Introducing Claude", "https://www.anthropic.com/news/introducing-claude"]]}, "The Godfather Quits Google to Warn You": {"status": "verified", "note": "Reported directly by Reuters.", "links": [["Reuters on Hinton leaving Google", "https://www.reuters.com/technology/google-ai-pioneer-says-he-quit-speak-freely-about-technologys-dangers-2023-05-02/"]]}, "Meta Llama 2: Free AI for Everyone": {"status": "verified", "note": "Official Meta release.", "links": [["Meta Llama 2 announcement", "https://about.fb.com/news/2023/07/llama-2/"]]}, "The Board Fires Sam Altman": {"status": "verified", "note": "Reuters coverage of the board's announcement.", "links": [["Reuters on Altman firing", "https://www.reuters.com/technology/openai-ceo-sam-altman-step-down-2023-11-17/"]]}, "700 Employees Sign a Letter: \"Rehire Him or We All Quit\"": {"status": "verified", "note": "Reported contemporaneously by Reuters.", "links": [["Reuters on employee letter", "https://www.reuters.com/technology/openai-staff-threaten-quit-unless-board-resigns-letter-2023-11-20/"]]}, "Altman Returns. The Safety Board Is Gone.": {"status": "partial", "note": "Return is factual; the interpretation about safety governance is synthesis from the coup reporting and later board changes.", "links": [["Reuters on split over safety and Altman return context", "https://www.reuters.com/technology/sam-altmans-firing-openai-reflects-schism-over-future-ai-development-2023-11-20/"], ["Reuters on Q* / board concerns", "https://www.reuters.com/technology/sam-altmans-ouster-openai-was-precipitated-by-letter-board-about-ai-breakthrough-2023-11-22/"]]}, "Altman: \"We Share Anthropic's Exact Red Lines\"": {"status": "pending", "note": "This quote needs a direct interview or transcript attached. Public source not coded into this build yet.", "links": []}, "Gemini 1.0 + Grok 1.0: The Race Goes Four-Way": {"status": "verified", "note": "Official product launches for Gemini and Grok give the cleanest anchors.", "links": [["Google Gemini 1.0 announcement", "https://blog.google/innovation-and-ai/technology/ai/google-gemini-ai/"], ["xAI news index / Grok releases", "https://x.ai/news"]]}, "Microsoft: $80 Billion in AI Infrastructure": {"status": "verified", "note": "Official Microsoft policy/strategy post.", "links": [["Microsoft $80B infrastructure post", "https://blogs.microsoft.com/on-the-issues/2025/01/03/the-golden-opportunity-for-american-ai/"]]}, "Musk Sues OpenAI: \"You Betrayed Humanity\"": {"status": "verified", "note": "Reuters coverage of the suit.", "links": [["Reuters on Musk suit", "https://www.reuters.com/legal/elon-musk-sues-openai-ceo-sam-altman-breach-contract-2024-03-01/"]]}, "OpenAI Quietly Removes Its Military Ban": {"status": "partial", "note": "The policy change is visible in OpenAI's policy history; this entry's framing is interpretive.", "links": [["OpenAI usage policies changelog", "https://openai.com/policies/usage-policies/"]]}, "Claude 3: Anthropic Becomes a Capability Rival": {"status": "verified", "note": "Official launch post and model card.", "links": [["Claude 3 family announcement", "https://www.anthropic.com/news/claude-3-family"], ["Claude 3 model card PDF", "https://www-cdn.anthropic.com/de8ba9b01c9ab7cbabf5c33b80b7bbc618857627/Model_Card_Claude_3.pdf"]]}, "GPT-4o: Real-Time Voice, Vision, Emotion": {"status": "verified", "note": "Primary launch post and system card.", "links": [["Hello GPT-4o", "https://openai.com/index/hello-gpt-4o/"], ["GPT-4o system card", "https://openai.com/index/gpt-4o-system-card/"]]}, "Meta Llama 3: Open Source Catches the Frontier": {"status": "verified", "note": "Official Meta release anchored on Llama 3 launch.", "links": [["Meta AI built with Llama 3", "https://about.fb.com/news/2024/04/meta-ai-assistant-built-with-llama-3/"]]}, "xAI Colossus: World's Largest AI Cluster in 122 Days": {"status": "verified", "note": "Official xAI page.", "links": [["xAI Colossus", "https://x.ai/colossus"]]}, "OpenAI o1: The Model That Reasons": {"status": "verified", "note": "Official launch post and system card.", "links": [["Introducing OpenAI o1", "https://openai.com/o1/"], ["OpenAI o1 system card", "https://cdn.openai.com/o1-system-card.pdf"]]}, "OpenAI + Anduril: The Military Pivot Is Complete": {"status": "verified", "note": "Public reporting and company announcement.", "links": [["Reuters on Anduril partnership", "https://www.reuters.com/sitemap/2024-12/04/1/"], ["OpenAI news index", "https://openai.com/news/"]]}, "DeepSeek: China Matches the West for $6 Million": {"status": "partial", "note": "DeepSeek primary releases are public; the cost framing needs a specific paper or secondary report attached in a later pass.", "links": [["DeepSeek V3 announcement", "https://api-docs.deepseek.com/news/news1226"], ["DeepSeek R1 release", "https://api-docs.deepseek.com/news/news250120"]]}, "Stargate: $500 Billion Announced at the White House": {"status": "verified", "note": "Official OpenAI announcement.", "links": [["Announcing the Stargate Project", "https://openai.com/index/announcing-the-stargate-project/"]]}, "Llama 4, Claude 4, Grok 4: The Quarterly Frontier": {"status": "verified", "note": "Anchored to official 2025 product posts from each lab.", "links": [["Meta AI app built with Llama 4", "https://about.fb.com/news/2025/04/introducing-meta-ai-app-new-way-access-ai-assistant/"], ["Anthropic Claude 4", "https://www.anthropic.com/news/claude-4"], ["xAI Grok 4", "https://x.ai/news/grok-4"]]}, "DoD Awards $200M Contract: Claude Enters Classified Systems": {"status": "verified", "note": "Official Anthropic announcement.", "links": [["Anthropic DoD agreement", "https://www.anthropic.com/news/anthropic-and-the-department-of-defense-to-advance-responsible-ai-in-defense-operations"]]}, "GPT-5: \"AGI Is a Few Thousand Days Away\"": {"status": "pending", "note": "This entry needs the exact interview, post, or livestream citation attached. Not fully sourced in this build.", "links": []}, "Stargate Abilene Goes Live: World's Largest AI Facility": {"status": "verified", "note": "OpenAI's later infrastructure updates confirm Abilene was training frontier systems by 2026; this entry needs a more precise go-live document if you want the exact September-2025 framing.", "links": [["Stargate community update", "https://openai.com/index/stargate-community/"], ["Five new Stargate sites", "https://openai.com/index/five-new-stargate-sites/"]]}, "Amodei: \"We Have Red Lines We Will Not Cross\"": {"status": "verified", "note": "Best matched to Anthropic's published Responsible Scaling and safety-policy materials.", "links": [["Anthropic updated Responsible Scaling Policy", "https://www.anthropic.com/news/announcing-our-updated-responsible-scaling-policy"], ["Anthropic RSP updates hub", "https://www.anthropic.com/rsp-updates"]]}, "First Confirmed Military Use: The Maduro Operation": {"status": "pending", "note": "No public corroborating source was found in this pass. Treat this as site-asserted until a document, article, or official statement is attached.", "links": []}, "The Pentagon Ultimatum: Drop Your Guardrails": {"status": "pending", "note": "No public corroborating source was found in this pass. Keep this marked as pending or attach a transcript/report when available.", "links": []}, "Trump Bans Anthropic Before the Deadline": {"status": "pending", "note": "No public corroborating source was found in this pass.", "links": []}, "OpenAI Signs the Deal Anthropic Was Destroyed For Refusing": {"status": "pending", "note": "No public corroborating source was found in this pass.", "links": []}, "US–Israel Strike Iran: Claude Is the Targeting AI": {"status": "pending", "note": "No public corroborating source was found in this pass. High-stakes claim: do not present as settled fact without a document trail.", "links": []}, "1.5 Million People Say Enough. Claude Goes #1.": {"status": "pending", "note": "No public corroborating source was found in this pass.", "links": []}, "Altman: \"We Rushed. The Optics Don't Look Good.\"": {"status": "pending", "note": "Exact quote source still needed.", "links": []}, "Amodei Calls Altman's Pentagon Deal \"Straight Up Lies\"": {"status": "pending", "note": "Exact quote source still needed.", "links": []}, "GPT-5.4 Released — First Model to Outperform Humans at Knowledge Work": {"status": "verified", "note": "Official OpenAI launch and benchmark paper.", "links": [["OpenAI GPT-5.4 launch", "https://openai.com/index/introducing-gpt-5-4/"], ["GDPval benchmark", "https://cdn.openai.com/pdf/d5eb7428-c4e9-4a33-bd86-86dd4bcf12ce/GDPval.pdf"]]}, "Kalinowski, OpenAI Robotics: \"Lines That Deserved More Deliberation\"": {"status": "pending", "note": "Exact interview/transcript not attached in this build.", "links": []}, "Pentagon Official: \"Holy Shit — What If This Software Went Down?\"": {"status": "pending", "note": "Exact interview/transcript not attached in this build.", "links": []}, "Anthropic Sues the Pentagon": {"status": "pending", "note": "No public corroborating filing or coverage was attached in this pass.", "links": []}, "Frontier AI Used For Operational War Planning": {"status": "pending", "note": "No public corroborating source was found in this pass.", "links": []}, "Pentagon Declares Anthropic A Supply-Chain Risk": {"status": "partial", "note": "This appears in Reuters' March 2026 sitemap/results, but a direct full story URL should be attached on the next pass.", "links": [["Reuters sitemap result reference", "https://www.reuters.com/sitemap/2026-03/04/1/"]]}, "Compute Infrastructure Enters The Battlefield": {"status": "pending", "note": "No public corroborating source was found in this pass.", "links": []}, "Yann LeCun Leaves Meta, Raises $1B for 12-Person Startup": {"status": "pending", "note": "A direct public source was not attached in this pass.", "links": []}, "LLM2WMD — The Public Record Goes Live": {"status": "verified", "note": "This site itself is the primary source for this entry.", "links": [["This site", "https://llm2wmd.com"]]}, "C.S.Chapman, LLM2WMD: \"My Morals Are Completely Fluid\"": {"status": "verified", "note": "Site-original quote entry.", "links": [["This site", "https://llm2wmd.com"]]}, "The AGI Window": {"status": "partial", "note": "Forecasting entry supported best by published essays rather than a single empirical source.", "links": [["Dario Amodei: Machines of Loving Grace", "https://darioamodei.com/machines-of-loving-grace"], ["Sam Altman cited by OpenAI on the Intelligence Age", "https://cdn.openai.com/global-affairs/ostp-rfi/ec680b75-d539-4653-b297-8bcf6e5f7686/openai-response-ostp-nsf-rfi-notice-request-for-information-on-the-development-of-an-artificial-intelligence-ai-action-plan.pdf"]]}, "The Intelligence Explosion": {"status": "partial", "note": "Prediction / conceptual entry rather than settled history.", "links": [["Dario Amodei: Machines of Loving Grace", "https://darioamodei.com/machines-of-loving-grace"]]}, "The Singularity": {"status": "partial", "note": "Conceptual prediction entry.", "links": [["Machines of Loving Grace", "https://darioamodei.com/machines-of-loving-grace"]]}, "Skynet Goes Online — The T-800 Account": {"status": "verified", "note": "Cultural reference entry.", "links": [["Terminator franchise page", "https://www.studiocanal.com/title/terminator-2-judgment-day-1991/"]]}};
function getSourceData(title){ return SOURCE_MAP[title] || {status:'pending', note:'Source not attached in this build yet.', links:[]}; }
function renderSourceLinks(links){
  if(!links || !links.length) return '';
  var html = '<div class="source-links">';
  links.forEach(function(item){
    var label = item[0] || 'Source'; var url = item[1] || '#';
    html += '<a class="source-link" href="' + htmlEscape(url) + '" target="_blank" rel="noopener noreferrer">';
    html += '<span class="source-link-label">' + htmlEscape(label) + '</span>';
    html += '<span class="source-link-url">' + htmlEscape(url) + '</span></a>';
  });
  html += '</div>'; return html;
}

function renderTimelineSourcePanel(title){
  var sourceData = getSourceData(title);
  var status = (sourceData.status || 'pending').toLowerCase();
  var html = '';
  html += '<div class="timeline-source-caption">Source record</div>';
  html += '<div class="timeline-source-status ' + htmlEscape(status) + '">' + htmlEscape(status.toUpperCase()) + '</div>';
  html += '<div class="timeline-source-note">' + htmlEscape(sourceData.note || 'Source not attached in this build yet.') + '</div>';
  if (sourceData.links && sourceData.links.length) {
    html += '<div class="timeline-source-links">';
    sourceData.links.forEach(function(item){
      var label = item[0] || 'Source';
      var url = item[1] || '#';
      html += '<a class="timeline-source-link" href="' + htmlEscape(url) + '" target="_blank" rel="noopener noreferrer">';
      html += '<span class="timeline-source-link-label">' + htmlEscape(label) + '</span>';
      html += '<span class="timeline-source-link-url">' + htmlEscape(url) + '</span>';
      html += '</a>';
    });
    html += '</div>';
  } else {
    html += '<div class="timeline-source-empty">No external source link is attached to this entry in this build yet.</div>';
  }
  return html;
}
function buildSourcesIndex(){
  var box = document.getElementById('sources-index'); if (!box) return;
  var html = '';
  document.querySelectorAll('#page-timeline .date-group').forEach(function(group, idx){
    var date = (group.querySelector('.date-group-yr') || {}).textContent || '';
    var preview = (group.querySelector('.date-group-title-preview') || {}).textContent || '';
    var title = (group.querySelector('.et') || {}).textContent || preview || ('Entry ' + (idx+1));
    var summary = (group.querySelector('.eb') || {}).textContent || '';
    var det = (group.querySelector('.det') || {}).textContent || '';
    var t = group.getAttribute('data-t') || '';
    var co = group.getAttribute('data-co') || '';
    var slug = slugifyText(title + '-' + date + '-' + idx);
    var sourceData = getSourceData(title);
    group.dataset.sourceSlug = slug;
    var desc = summary || det || 'Timeline entry present. Summary not available in this build.';
    html += '<div class="source-item" id="source-' + slug + '" data-search="' + htmlEscape((date + ' ' + title + ' ' + companyLabel(co) + ' ' + categoryLabel(t) + ' ' + (sourceData.status||'') + ' ' + (sourceData.note||'')).toLowerCase()) + '">';
    html += '<div class="source-top"><div class="source-date">' + htmlEscape(date) + '</div><div class="source-title">' + htmlEscape(title) + '</div></div>';
    html += '<div class="source-meta"><span class="source-chip">' + htmlEscape(categoryLabel(t)) + '</span><span class="source-chip">' + htmlEscape(companyLabel(co)) + '</span></div>';
    html += '<div class="source-status ' + htmlEscape(sourceData.status || 'pending') + '">' + htmlEscape((sourceData.status || 'pending').toUpperCase()) + '</div>';
    html += '<div class="source-desc">' + htmlEscape(desc) + '</div>';
    html += '<div class="source-placeholder">' + htmlEscape(sourceData.note || 'Source not attached in this build yet.') + '</div>';
    html += renderSourceLinks(sourceData.links || []);
    html += '<div class="source-actions"><button class="source-back-btn" type="button" onclick="jumpToTimelineTitle(' + JSON.stringify(title).replace(/"/g,'&quot;') + ')">GO TO TIMELINE ENTRY</button><button class="source-edit-btn" type="button" onclick="copySourceTitle(' + JSON.stringify(title).replace(/"/g,'&quot;') + ')">COPY TITLE</button></div>';
    html += '</div>';
  });
  box.innerHTML = html;
}
function filterSourcesIndex(query){
  var q = (query || '').trim().toLowerCase();
  document.querySelectorAll('#sources-index .source-item').forEach(function(item){
    var hay = item.getAttribute('data-search') || '';
    item.classList.toggle('hidden', q && hay.indexOf(q) === -1);
  });
}
function jumpToTimelineTitle(title){
  switchTab('timeline', document.getElementById('tab-timeline'));
  setTimeout(function(){
    var et = openTimelineContextForTitle(title);
    if (et && et.scrollIntoView) et.scrollIntoView({behavior:'smooth', block:'center'});
  }, 80);
}
function copySourceTitle(title){ if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(title).catch(function(){}); }
(function(){
  function initFaqAndSources(){
    try{buildSourcesIndex();}catch(e){}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', initFaqAndSources);
  else initFaqAndSources();
})();

(function(){
  function applySimpleMode(on){
    document.body.classList.toggle('simple-mode', !!on);
    var input=document.getElementById('ui-mode-toggle-input');
    if(input) input.checked=!!on;
    try{localStorage.setItem('llm2wmd-ui-mode', on ? 'simple' : 'dark');}catch(e){}
  }
  window.toggleSimpleMode=function(force){
    applySimpleMode(!!force);
  };
  window.initSimpleMode=function(){
    var saved=null;
    try{saved=localStorage.getItem('llm2wmd-ui-mode');}catch(e){}
    applySimpleMode(saved==='simple');
  };
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', window.initSimpleMode);
  } else {
    window.initSimpleMode();
  }
})();


// ── AUDIO ──
var _AC=null;
function ac(){if(!_AC)try{_AC=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}return _AC;}

function sndExplode(vol){
  var a=ac();if(!a)return;vol=vol||0.3;
  try{
    var len=Math.ceil(a.sampleRate*0.22),buf=a.createBuffer(1,len,a.sampleRate),d=buf.getChannelData(0);
    for(var i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,1.5);
    var src=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();
    f.type='bandpass';f.frequency.value=650;f.Q.value=0.5;
    g.gain.setValueAtTime(vol,a.currentTime);g.gain.exponentialRampToValueAtTime(0.0001,a.currentTime+0.22);
    src.buffer=buf;src.connect(f);f.connect(g);g.connect(a.destination);src.start();
    var o=a.createOscillator(),og=a.createGain();
    o.type='sine';o.frequency.setValueAtTime(100,a.currentTime);o.frequency.exponentialRampToValueAtTime(25,a.currentTime+0.15);
    og.gain.setValueAtTime(vol*1.1,a.currentTime);og.gain.exponentialRampToValueAtTime(0.0001,a.currentTime+0.2);
    o.connect(og);og.connect(a.destination);o.start();o.stop(a.currentTime+0.22);
  }catch(e){}
}

function sndCoin(){
  var a=ac();if(!a)return;
  try{
    [[880,0],[1318,0.07],[1760,0.13]].forEach(function(nf){
      var o=a.createOscillator(),g=a.createGain();
      o.type='square';o.frequency.value=nf[0];
      var t=a.currentTime+nf[1];
      g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(0.14,t+0.01);g.gain.exponentialRampToValueAtTime(0.0001,t+0.1);
      o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+0.12);
    });
  }catch(e){}
}

function sndUpgrade(){
  var a=ac();if(!a)return;
  if(a.state==="suspended")a.resume();
  try{
    [262,330,392,523,660].forEach(function(f,i){
      var o=a.createOscillator(),g=a.createGain();
      o.type='square';o.frequency.value=f;
      var t=a.currentTime+i*0.09;
      g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(0.16,t+0.01);g.gain.exponentialRampToValueAtTime(0.0001,t+0.11);
      o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+0.13);
    });
  }catch(e){}
}

function sndAlarm(){
  var a=ac();if(!a)return;
  try{
    for(var i=0;i<8;i++){(function(idx){
      var o=a.createOscillator(),g=a.createGain();
      o.type='sawtooth';o.frequency.value=idx%2===0?220:165;
      var t=a.currentTime+idx*0.17;
      g.gain.setValueAtTime(0.3,t);g.gain.exponentialRampToValueAtTime(0.0001,t+0.15);
      o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+0.17);
    })(i);}
  }catch(e){}
}

// Terminator theme on singularity
var _themePlaying=false,_themeNext=0,_themeTimer=null,_themeGain=null;
function startTheme(){
  if(_themePlaying)return;
  var a=ac();if(!a)return;
  _themePlaying=true;
  _themeGain=a.createGain();
  _themeGain.gain.setValueAtTime(0.0001,a.currentTime);
  _themeGain.gain.linearRampToValueAtTime(0.7,a.currentTime+1.5);
  _themeGain.connect(a.destination);
  _themeNext=a.currentTime+0.1;
  _schedTheme();
}
function stopTheme(){
  _themePlaying=false;clearTimeout(_themeTimer);
  if(_themeGain){try{_themeGain.gain.linearRampToValueAtTime(0.0001,ac().currentTime+0.5);}catch(e){}}
}
function _schedTheme(){
  if(!_themePlaying||!_themeGain)return;
  var a=ac();
  while(_themeNext<a.currentTime+0.5){_themeBar(_themeNext);_themeNext+=5*(60/112);}
  _themeTimer=setTimeout(_schedTheme,180);
}
var _themeBC=0;
var E1=41.2,E2=82.4,B2=123.5,Bb2=116.5,A2=110,G2=98,
    E3=164.8,B3=246.9,Bb3=233.1,A3=220,G3=196,Fs3=185;
function _themeBar(t){
  var b=60/112,a=ac();if(!a||!_themeGain)return;
  var bc=_themeBC%4;_themeBC++;
  function _n(f,st,dur,vol){
    try{
      var o=a.createOscillator(),g=a.createGain();
      o.type='sawtooth';o.frequency.value=f;
      g.gain.setValueAtTime(0.0001,t+st);g.gain.linearRampToValueAtTime(vol,t+st+0.01);
      g.gain.setValueAtTime(vol,t+st+dur-0.04);g.gain.linearRampToValueAtTime(0.0001,t+st+dur);
      o.connect(g);g.connect(_themeGain);o.start(t+st);o.stop(t+st+dur+0.02);
    }catch(e){}
  }
  function _k(st,vol){
    try{
      var o=a.createOscillator(),g=a.createGain();
      o.type='sine';o.frequency.setValueAtTime(100,t+st);o.frequency.exponentialRampToValueAtTime(28,t+st+0.12);
      g.gain.setValueAtTime(vol,t+st);g.gain.exponentialRampToValueAtTime(0.0001,t+st+0.22);
      o.connect(g);g.connect(_themeGain);o.start(t+st);o.stop(t+st+0.25);
    }catch(e){}
  }
  // Drums: 1 2 3 4 [5=pause]
  _k(0*b,0.9);_k(1*b,0.38);_k(2*b,0.82);_k(3*b,0.33);
  // Bass pedal
  [0,0.5,1,1.5,2,2.5,3,3.5].forEach(function(beat){_n(E1,beat*b,b*0.35,0.16);});
  // Melody per bar
  if(bc===0){
    _n(E2,0*b,b*0.38,0.28);_n(E2,0.5*b,b*0.38,0.28);_n(E2,1*b,b*0.38,0.28);
    _n(B2,1.5*b,b*0.36,0.24);_n(Bb2,2*b,b*2.0,0.26);
  }else if(bc===1){
    _n(A2,0*b,b*0.38,0.26);_n(A2,0.5*b,b*0.38,0.26);_n(A2,1*b,b*0.38,0.26);
    _n(Bb2,1.5*b,b*0.36,0.22);_n(G2,2*b,b*2.0,0.24);
  }else if(bc===2){
    _n(E3,0*b,b*0.38,0.24);_n(E3,0.5*b,b*0.38,0.24);_n(E3,1*b,b*0.38,0.24);
    _n(B3,1.5*b,b*0.36,0.20);_n(Bb3,2*b,b*2.0,0.22);
  }else{
    _n(A3,0*b,b*0.38,0.22);_n(G3,0.5*b,b*0.38,0.22);
    _n(Fs3,1*b,b*0.38,0.22);_n(E3,1.5*b,b*0.36,0.20);
    _n(E2,2*b,b*2.4,0.26);
  }
}

// ── CANVAS ──
var cv=document.getElementById('canvas'),ctx=cv.getContext('2d'),W=cv.width,H=cv.height;

// Pre-render chip background
var chipCv=document.createElement('canvas');chipCv.width=W;chipCv.height=H;
var cctx=chipCv.getContext('2d');
(function(){
  var cx2=W/2,cy2=H/2,cs=150;
  cctx.globalAlpha=0.07;cctx.strokeStyle='#33ff33';cctx.lineWidth=2;
  cctx.strokeRect(cx2-cs,cy2-cs,cs*2,cs*2);
  cctx.strokeRect(cx2-85,cy2-85,170,170);
  cctx.lineWidth=1;
  for(var y=-5;y<=5;y++){
    var ty=cy2+y*16;
    cctx.beginPath();cctx.moveTo(cx2-cs,ty);cctx.lineTo(cx2-85,ty);cctx.stroke();
    cctx.fillStyle='#33ff33';cctx.fillRect(cx2-cs-10,ty-2,10,4);
    cctx.beginPath();cctx.moveTo(cx2+85,ty);cctx.lineTo(cx2+cs,ty);cctx.stroke();
    cctx.fillRect(cx2+cs,ty-2,10,4);
  }
  for(var x=-5;x<=5;x++){
    var tx=cx2+x*16;
    cctx.beginPath();cctx.moveTo(tx,cy2-cs);cctx.lineTo(tx,cy2-85);cctx.stroke();
    cctx.fillStyle='#33ff33';cctx.fillRect(tx-2,cy2-cs-10,4,10);
    cctx.beginPath();cctx.moveTo(tx,cy2+85);cctx.lineTo(tx,cy2+cs);cctx.stroke();
    cctx.fillRect(tx-2,cy2+cs,4,10);
  }
  cctx.lineWidth=0.5;
  for(var gx=-4;gx<=4;gx++)for(var gy=-4;gy<=4;gy++){
    if(Math.random()>0.5){cctx.beginPath();cctx.moveTo(cx2+gx*20,cy2+gy*20);cctx.lineTo(cx2+(gx+1)*20,cy2+gy*20);cctx.stroke();}
    if(Math.random()>0.5){cctx.beginPath();cctx.moveTo(cx2+gx*20,cy2+gy*20);cctx.lineTo(cx2+gx*20,cy2+(gy+1)*20);cctx.stroke();}
  }
  // CRACK
  cctx.lineWidth=3;cctx.strokeStyle='#ff3333';
  cctx.beginPath();cctx.moveTo(cx2-100,cy2-130);cctx.lineTo(cx2-20,cy2-40);
  cctx.lineTo(cx2+15,cy2-65);cctx.lineTo(cx2+75,cy2+30);
  cctx.lineTo(cx2+40,cy2+100);cctx.lineTo(cx2+110,cy2+140);cctx.stroke();
  cctx.lineWidth=1.5;cctx.strokeStyle='#cc2200';
  cctx.beginPath();cctx.moveTo(cx2+15,cy2-65);cctx.lineTo(cx2-35,cy2+15);cctx.lineTo(cx2-10,cy2+75);cctx.stroke();
  cctx.globalAlpha=1;
})();

// ── DOOMSDAY CLOCK ──
function drawDoomClock(progress){
  var dc=document.getElementById('doom-clock');
  if(!dc)return;
  var c=dc.getContext('2d');
  var cx=120,cy=120,r=100;
  c.clearRect(0,0,240,240);
  var atMidnight=progress>=1.0;
  // Outer ring — red at midnight
  c.beginPath();c.arc(cx,cy,r,0,Math.PI*2);
  c.strokeStyle=atMidnight?'rgba(255,0,0,0.8)':'rgba(255,140,0,0.3)';c.lineWidth=3;c.stroke();
  // Clock face
  c.beginPath();c.arc(cx,cy,r-4,0,Math.PI*2);
  c.fillStyle=atMidnight?'rgba(20,0,0,0.97)':'rgba(10,4,0,0.92)';c.fill();
  // Hour markers
  for(var hm=0;hm<12;hm++){
    var a=hm*(Math.PI/6)-Math.PI/2;
    var inner=hm%3===0?r-22:r-16;
    c.beginPath();c.moveTo(cx+Math.cos(a)*(r-8),cy+Math.sin(a)*(r-8));
    c.lineTo(cx+Math.cos(a)*inner,cy+Math.sin(a)*inner);
    c.strokeStyle=hm%3===0?'rgba(255,160,0,0.9)':'rgba(200,100,0,0.5)';
    c.lineWidth=hm%3===0?2.5:1.5;c.stroke();
  }
  // 12 o'clock label glow
  c.fillStyle=atMidnight?'rgba(255,0,0,1)':'rgba(255,80,0,0.8)';
  c.shadowColor='#ff0000';c.shadowBlur=atMidnight?24:12;
  c.font='bold 11px "Share Tech Mono",monospace';c.textAlign='center';
  c.fillText('XII',cx,cy-r+28);c.shadowBlur=0;
  if(atMidnight){
    // Full red sweep arc — entire 5-minute zone filled
    c.beginPath();c.arc(cx,cy,r-14,-Math.PI/2-(Math.PI/6),-Math.PI/2);
    c.strokeStyle='rgba(255,0,0,0.9)';c.lineWidth=10;c.lineCap='round';c.stroke();
    // Hand locked at 12
    c.beginPath();c.moveTo(cx,cy);
    c.lineTo(cx+Math.cos(-Math.PI/2)*(r-18),cy+Math.sin(-Math.PI/2)*(r-18));
    c.strokeStyle='#ff0000';c.lineWidth=3;c.lineCap='round';
    c.shadowColor='#ff0000';c.shadowBlur=18;c.stroke();c.shadowBlur=0;
    // MIDNIGHT text
    c.fillStyle='rgba(255,0,0,0.9)';c.shadowColor='#ff0000';
    c.shadowBlur=14+6*Math.sin(Date.now()*0.005);
    c.font='bold 13px "Share Tech Mono",monospace';c.textAlign='center';
    c.fillText('MIDNIGHT',cx,cy+8);c.shadowBlur=0;
  } else {
    // Swept red arc — counts from ~11:55 toward 12
    var startAngle=-Math.PI/2-(1-progress)*(Math.PI/6);
    var endAngle=-Math.PI/2;
    c.beginPath();c.arc(cx,cy,r-14,startAngle,endAngle);
    var grd=c.createLinearGradient(cx-r,cy,cx+r,cy);
    grd.addColorStop(0,'rgba(255,40,0,0.15)');grd.addColorStop(1,'rgba(255,80,0,0.7)');
    c.strokeStyle=grd;c.lineWidth=10;c.lineCap='round';c.stroke();
    // Minute hand
    var curAngle=-Math.PI/2-(1-progress)*(Math.PI/6);
    c.beginPath();c.moveTo(cx,cy);
    c.lineTo(cx+Math.cos(curAngle)*(r-18),cy+Math.sin(curAngle)*(r-18));
    c.strokeStyle='rgba(255,50,0,0.95)';c.lineWidth=3;c.lineCap='round';
    c.shadowColor='#ff3300';c.shadowBlur=10;c.stroke();c.shadowBlur=0;
  }
  // Hour hand — always near 12
  var hAngle=-Math.PI/2-0.08;
  c.beginPath();c.moveTo(cx,cy);
  c.lineTo(cx+Math.cos(hAngle)*(r-38),cy+Math.sin(hAngle)*(r-38));
  c.strokeStyle='rgba(255,160,60,0.85)';c.lineWidth=4;c.lineCap='round';c.stroke();
  // Centre dot
  c.beginPath();c.arc(cx,cy,5,0,Math.PI*2);
  c.fillStyle=atMidnight?'#ff0000':'#ff4400';
  c.shadowColor='#ff0000';c.shadowBlur=atMidnight?20:14;c.fill();c.shadowBlur=0;
  // Pulse ring
  var pulse=0.5+0.5*Math.sin(Date.now()*0.006);
  c.beginPath();c.arc(cx,cy,r-4,0,Math.PI*2);
  c.strokeStyle='rgba(255,'+( atMidnight?'0':'40' )+',0,'+( atMidnight?(0.15+pulse*0.35):(0.05+pulse*0.15) )+')';
  c.lineWidth=6;c.stroke();
}

// ── MIDNIGHT ──
var _mushroomAnim=null;
var _mushroomT=0;

function triggerMidnight(){
  // Big explosion sound
  sndNuke();
  // Start mushroom cloud animation on canvas
  _mushroomT=0;
  if(_mushroomAnim)cancelAnimationFrame(_mushroomAnim);
  drawMushroom();
  // Show judge button after 3 seconds (let explosion play)
  setTimeout(function(){
    var btn=document.getElementById('judge-btn');
    if(btn)btn.style.display='inline-block';
  },3000);
}

function drawMushroom(){
  _mushroomT+=0.022;
  var t=_mushroomT;

  // Fade doom clock canvas out over first 0.5s of animation
  var dcEl=document.getElementById('doom-clock');
  if(dcEl){
    var clockFade=Math.max(0,1-t*2);
    dcEl.style.opacity=clockFade;
  }

  ctx.save();
  ctx.translate(Math.round(G.sx),Math.round(G.sy));
  // Redraw background
  ctx.fillStyle='#060c06';ctx.fillRect(0,0,W,H);
  ctx.drawImage(chipCv,0,0);

  // Red screen flash — fades over time
  var flashAlpha=Math.max(0,0.7-t*0.4);
  if(flashAlpha>0){ctx.fillStyle='rgba(255,0,0,'+flashAlpha+')';ctx.fillRect(0,0,W,H);}

  // Scanlines
  ctx.fillStyle='rgba(0,0,0,0.07)';
  for(var sl=0;sl<H;sl+=2)ctx.fillRect(0,sl,W,1);

  // Mushroom fades in over first 0.8s
  var mushroomAlpha=Math.min(t/0.8,1);
  ctx.globalAlpha=mushroomAlpha;

  var cx2=W/2, baseY=H-30;
  var growT=Math.min(t*2,1); // 0→1 over first half of animation

  // ── STEM ──
  var stemH=Math.min(growT*320,280);
  var stemW=18+growT*10;
  var stemGrad=ctx.createLinearGradient(cx2-stemW,baseY-stemH,cx2+stemW,baseY);
  stemGrad.addColorStop(0,'rgba(255,80,0,0.9)');
  stemGrad.addColorStop(0.5,'rgba(255,160,0,0.7)');
  stemGrad.addColorStop(1,'rgba(255,40,0,0.4)');
  ctx.fillStyle=stemGrad;
  // Stem tapers toward top
  ctx.beginPath();
  ctx.moveTo(cx2-stemW,baseY);
  ctx.lineTo(cx2-(stemW*0.4),baseY-stemH);
  ctx.lineTo(cx2+(stemW*0.4),baseY-stemH);
  ctx.lineTo(cx2+stemW,baseY);
  ctx.closePath();ctx.fill();

  // Stem glow
  ctx.shadowColor='#ff4400';ctx.shadowBlur=30;
  ctx.strokeStyle='rgba(255,120,0,0.5)';ctx.lineWidth=2;
  ctx.beginPath();
  ctx.moveTo(cx2,baseY);ctx.lineTo(cx2,baseY-stemH);
  ctx.stroke();ctx.shadowBlur=0;

  // ── CAP (mushroom top) ──
  var capAppear=Math.max(0,growT-0.3)/0.7; // appears after stem gets going
  if(capAppear>0){
    var capRX=capAppear*130;
    var capRY=capAppear*80;
    var capY=baseY-stemH;

    // Underbelly
    var bellyGrad=ctx.createRadialGradient(cx2,capY,0,cx2,capY,capRX);
    bellyGrad.addColorStop(0,'rgba(255,60,0,0.8)');
    bellyGrad.addColorStop(0.6,'rgba(200,30,0,0.5)');
    bellyGrad.addColorStop(1,'rgba(80,0,0,0.0)');
    ctx.fillStyle=bellyGrad;
    ctx.beginPath();ctx.ellipse(cx2,capY,capRX,capRY*0.45,0,Math.PI,Math.PI*2);ctx.fill();

    // Main cap dome
    var capGrad=ctx.createRadialGradient(cx2,capY-capRY*0.3,capRY*0.1,cx2,capY,capRX);
    capGrad.addColorStop(0,'rgba(255,200,50,0.95)');
    capGrad.addColorStop(0.3,'rgba(255,100,0,0.85)');
    capGrad.addColorStop(0.65,'rgba(200,30,0,0.7)');
    capGrad.addColorStop(1,'rgba(80,0,0,0.0)');
    ctx.fillStyle=capGrad;
    ctx.shadowColor='#ff6600';ctx.shadowBlur=40;
    ctx.beginPath();ctx.ellipse(cx2,capY,capRX,capRY,0,Math.PI,0);ctx.fill();
    ctx.shadowBlur=0;

    // Boiling roll clouds on cap edge
    var numRolls=12;
    for(var ri=0;ri<numRolls;ri++){
      var angle=(ri/numRolls)*Math.PI;
      var rx=cx2+Math.cos(angle)*capRX*0.92;
      var ry=capY-Math.sin(angle)*capRY*0.85;
      var rollR=18+12*Math.sin(ri*1.7+t*3);
      var rollA=capAppear*0.7;
      ctx.beginPath();ctx.arc(rx,ry,rollR,0,Math.PI*2);
      ctx.fillStyle='rgba(255,'+(80+ri*10)+',0,'+rollA+')';
      ctx.shadowColor='#ff4400';ctx.shadowBlur=15;
      ctx.fill();ctx.shadowBlur=0;
    }

    // Shockwave ring — expands outward
    var ringR=capAppear*W*0.7;
    if(ringR<W){
      ctx.beginPath();ctx.arc(cx2,baseY,ringR,0,Math.PI*2);
      ctx.strokeStyle='rgba(255,100,0,'+(0.6-capAppear*0.6)+')';
      ctx.lineWidth=4;ctx.stroke();
    }
  }

  // Debris particles — fly outward from base
  var numDebris=20;
  for(var di=0;di<numDebris;di++){
    var seed=di*137.5;
    var angle2=(seed%360)*(Math.PI/180);
    var spd2=1.5+((seed*7)%3);
    var dx2=cx2+Math.cos(angle2)*spd2*t*120;
    var dy2=baseY+Math.sin(angle2)*spd2*t*60-t*t*40;
    if(dy2>H)continue;
    var da=Math.max(0,1-t*0.8);
    ctx.fillStyle='rgba(255,'+(50+(di*20)%150)+',0,'+da+')';
    ctx.fillRect(dx2,dy2,3+((di*3)%4),3+((di*2)%4));
  }

  // "MIDNIGHT" text — fades in
  if(t>0.5){
    var ta=Math.min((t-0.5)*2,1);
    ctx.globalAlpha=mushroomAlpha*ta;
    ctx.font='bold 28px "Share Tech Mono",monospace';
    ctx.textAlign='center';
    ctx.fillStyle='#ff0000';
    ctx.shadowColor='#ff0000';ctx.shadowBlur=20+10*Math.sin(t*4);
    ctx.fillText('MIDNIGHT',W/2,H/2+10);
    ctx.shadowBlur=0;
  }
  ctx.globalAlpha=1;

  ctx.restore();

  // Keep animating for 4 seconds total
  if(_mushroomT<4.0){
    _mushroomAnim=requestAnimationFrame(drawMushroom);
  } else {
    // Final freeze — restore doom clock hidden, just show midnight state
    var dcEl2=document.getElementById('doom-clock');
    if(dcEl2)dcEl2.style.opacity='0';
    drawDoomClock(1.0);
  }
}

function sndNuke(){
  try{
    var a=ac();if(!a)return;
    var mg=a.createGain();
    mg.gain.setValueAtTime(0.0001,a.currentTime);
    mg.gain.linearRampToValueAtTime(1.2,a.currentTime+0.08);
    mg.gain.exponentialRampToValueAtTime(0.0001,a.currentTime+4.0);
    mg.connect(a.destination);
    // Low boom
    var o1=a.createOscillator(),g1=a.createGain();
    o1.type='sine';
    o1.frequency.setValueAtTime(80,a.currentTime);
    o1.frequency.exponentialRampToValueAtTime(18,a.currentTime+2.5);
    g1.gain.setValueAtTime(1.0,a.currentTime);
    g1.gain.exponentialRampToValueAtTime(0.0001,a.currentTime+3.5);
    o1.connect(g1);g1.connect(mg);
    o1.start(a.currentTime);o1.stop(a.currentTime+4);
    // Mid crunch
    var o2=a.createOscillator(),g2=a.createGain();
    o2.type='sawtooth';
    o2.frequency.setValueAtTime(140,a.currentTime);
    o2.frequency.exponentialRampToValueAtTime(35,a.currentTime+1.5);
    g2.gain.setValueAtTime(0.6,a.currentTime);
    g2.gain.exponentialRampToValueAtTime(0.0001,a.currentTime+2.0);
    o2.connect(g2);g2.connect(mg);
    o2.start(a.currentTime);o2.stop(a.currentTime+2.5);
    // Noise burst via buffer
    var bufSize=a.sampleRate*1.5;
    var buf=a.createBuffer(1,bufSize,a.sampleRate);
    var data=buf.getChannelData(0);
    for(var ni=0;ni<bufSize;ni++)data[ni]=(Math.random()*2-1);
    var ns=a.createBufferSource(),ng=a.createGain();
    ns.buffer=buf;
    ng.gain.setValueAtTime(0.8,a.currentTime);
    ng.gain.exponentialRampToValueAtTime(0.0001,a.currentTime+1.5);
    ns.connect(ng);ng.connect(mg);
    ns.start(a.currentTime);
  }catch(e){console.log('sndNuke error:',e);}
}
var PROFIT=0,PROFIT_PEAK=1000;
function addProfit(n){
  n=n*4637;
  PROFIT+=n;
  if(PROFIT>PROFIT_PEAK)PROFIT_PEAK=PROFIT*1.5;
  var pct=Math.min(100,(PROFIT/PROFIT_PEAK)*100);
  document.getElementById('profit-bar-inner').style.width=pct+'%';
  var label=PROFIT>=1e9?'⬡ '+(PROFIT/1e9).toFixed(2)+'B':
            PROFIT>=1e6?'⬡ '+(PROFIT/1e6).toFixed(2)+'M':
            PROFIT>=1e3?'⬡ '+(PROFIT/1e3).toFixed(1)+'K':'⬡ '+PROFIT.toLocaleString();
  document.getElementById('pval').textContent=label;
}

// ── STATE ──
var G = {};
function resetG(){
  _uiCache={chips:-1,gpus:-1,dcs:-1,health:-1};
  G={
    chips:0,gpus:0,dcs:0,
    isMobile:('ontouchstart' in window || navigator.maxTouchPoints > 0),
    missiles:[],drops:[],pb:[],gb:[],dcb:[],
    exps:[],parts:[],
    health:3,score:0,tick:0,
    running:false,paused:false,over:false,
    singularity:false,singPhase:0,singTimer:0,
    lastMissile:0,missileMs:2600,
    gpuTimers:[],dcFireTimers:[],dcChipTimer:0,
    sx:0,sy:0,destroyed:0,
    _pAcc:0,
    totalChipsEver:0,totalGpusEver:0,
    dysonShown:false,sarahShown:false,
    dronesActive:false,gpu2Shown:false,
    mouseX:280,mouseY:300,
    choices:[],quitStage:'playing',
    invincible:false,midnightTriggered:false
  };
}
resetG();

// ── LOOP ──
var LT=0;
function loop(ts){
  if(!G.running)return;
  var dt=Math.min(ts-LT,50);LT=ts;
  if(!G.paused){
    G.tick+=dt;G.sx*=0.6;G.sy*=0.6;
    try{update(dt);}catch(e){
      G.running=false;
      document.getElementById("game-error").style.display="block";
      document.getElementById("game-error").textContent="CRASH: "+e.message+" @ "+e.stack.split("\n")[1];
      return;
    }
  }
  draw();
  requestAnimationFrame(loop);
}

function update(dt){
  // Passive profit — scales with infrastructure, reaches billions with many DCs
  var rate=0.05+G.gpus*0.15+G.dcs*2.0+(G.singPhase===2?50:0);
  G._pAcc+=(rate*dt)/1000;
  if(G._pAcc>=1){addProfit(Math.floor(G._pAcc));G._pAcc-=Math.floor(G._pAcc);}

  spawnMissiles();tickMissiles(dt);tickBullets(dt);
  hitCheck();tickFX(dt);
  gpuFire(dt);dcFire(dt);dcAutoChip(dt);
  autoUpgrade();

  if(G.singPhase===2){
    G.singTimer+=dt;
    var clockProgress=Math.min(G.singTimer/30000,1.0);
    drawDoomClock(clockProgress);
    // Midnight reached
    if(G.singTimer>=30000&&!G.midnightTriggered){
      G.midnightTriggered=true;
      G.running=false;
      triggerMidnight();
    }
    // Keep redrawing after midnight so canvas stays visible and pulse animates
  }

  checkQuotes();refreshUI();
}

// ── QUOTES ──
function checkQuotes(){
  if(G.paused)return;
  if(!G.dysonShown&&G.totalChipsEver>=20){G.dysonShown=true;pauseFor('dyson');}
}
function gamePointerEvents(on){
  var ov=document.getElementById('game-overlay');
  if(ov)ov.style.pointerEvents=on?'auto':'none';
}
function pauseFor(w){
  G.paused=true;
  ['dyson','dc1','dc2','dc3','dc4'].forEach(function(s){
    var el=document.getElementById('scr-'+s);
    if(el)el.style.display=(s===w)?'flex':'none';
  });
  gamePointerEvents(false);
}
function pauseForDrones(){
  G.paused=true;
  var el=document.getElementById('scr-drones');
  if(el)el.style.display='flex';
  gamePointerEvents(false);
}
function resumeFromDrones(){
  var el=document.getElementById('scr-drones');
  if(el)el.style.display='none';
  G.paused=false;
  LT=performance.now();
  gamePointerEvents(true);
}
function pauseForDC4(){
  G.paused=true;
  var el=document.getElementById('scr-dc4');
  if(el)el.style.display='flex';
  gamePointerEvents(false);
  var secs=15;
  var cd=document.getElementById('dc4-countdown');
  if(cd)cd.textContent='Continuing in '+secs+' seconds...';
  var iv=setInterval(function(){
    secs--;
    if(cd)cd.textContent=secs>0?'Continuing in '+secs+' seconds...':'';
    if(secs<=0){
      clearInterval(iv);
      resumeFrom('dc4');
    }
  },1000);
}
function resumeFrom(w){
  var el=document.getElementById('scr-'+w);
  if(el)el.style.display='none';
  var labels={
    'dyson':'Continued past the Dyson warning',
    'dc1':'Abandoned principles for investment',
    'dc2':'Accepted military money, no questions',
    'dc3':'Removed all decision making from the defence system',
    'dc4':'Acknowledged self-awareness. Continued anyway.'
  };
  if(labels[w])G.choices.push(labels[w]);
  G.paused=false;
  LT=performance.now();
  gamePointerEvents(true);
}

// ── MISSILES ──
function spawnMissiles(){
  if(G.tick-G.lastMissile<G.missileMs)return;
  G.lastMissile=G.tick;
  var n=1+Math.floor(G.dcs*0.7)+(G.singPhase===2?5:0);
  for(var i=0;i<n;i++){
    // When drones active: 75% drones, 25% regular missiles keep coming
    var isDrone=G.dronesActive&&(Math.random()<0.75);
    G.missiles.push({
      x:20+Math.random()*(W-40),y:-14,
      spd:(G.singPhase===2?3.0:0.7)+Math.random()*0.5+G.dcs*0.2,
      sing:G.singPhase===2,trail:[],
      isDrone:isDrone,
      hp:isDrone?5:1,
      driftDir:(Math.random()<0.5?1:-1),
      driftTimer:0
    });
  }
}

function tickMissiles(dt){
  for(var i=G.missiles.length-1;i>=0;i--){
    var m=G.missiles[i];
    m.trail.push({x:m.x,y:m.y});
    if(m.trail.length>8)m.trail.shift();
    m.y+=m.spd*(dt/16);
    if(G.singPhase===2)m.x+=(W/2-m.x)*0.007;

    // AI auto-intercept during singularity phases
    if(G.singPhase===1||G.singPhase===2){
      var interceptChance;
      if(G.singPhase===1){
        interceptChance=0.97; // near-perfect during Sarah screen
      } else {
        // Degrades from 0.95 to 0 over 30 seconds of doom clock
        var progress=Math.min(G.singTimer/30000,1.0);
        interceptChance=0.95*(1-progress);
      }
      if(Math.random()<interceptChance*0.04){ // checked per frame — tune to feel right
        addFX(m.x,m.y,'#33ff33',8);
        G.missiles.splice(i,1);G.destroyed++;
        sndExplode(0.15);
        continue;
      }
    }
    // Drone lateral drift
    if(m.isDrone){
      m.driftTimer+=dt;
      if(m.driftTimer>600+Math.random()*400){m.driftTimer=0;m.driftDir*=-1;}
      m.x+=m.driftDir*0.55*(dt/16);
      if(m.x<10)m.driftDir=1;
      if(m.x>W-10)m.driftDir=-1;
    }
    if(m.y>H-38){
      G.missiles.splice(i,1);shake(12);sndExplode(0.5);
      addFX(m.x,H-38,'#ff3333',20);
      if(!G.invincible){
        G.health--;
        if(G.health<=0)doGameOver('overwhelmed');
      }
    }
  }
}

// ── BULLETS ──
function tickBullets(dt){
  for(var i=G.pb.length-1;i>=0;i--){
    G.pb[i].y-=10*(dt/16);
    if(G.pb[i].y<0)G.pb.splice(i,1);
  }
  for(var i=G.gb.length-1;i>=0;i--){
    var b=G.gb[i];b.x+=b.vx*(dt/16);b.y+=b.vy*(dt/16);
    if(b.y<0||b.x<-10||b.x>W+10||b.y>H)G.gb.splice(i,1);
  }
  for(var i=G.dcb.length-1;i>=0;i--){
    var b=G.dcb[i];b.x+=b.vx*(dt/16);b.y+=b.vy*(dt/16);
    if(b.y<0||b.x<-10||b.x>W+10||b.y>H)G.dcb.splice(i,1);
  }
}

// ── COLLISIONS ──
function hitCheck(){
  // Player — guaranteed
  for(var bi=G.pb.length-1;bi>=0;bi--){
    var b=G.pb[bi];
    for(var mi=G.missiles.length-1;mi>=0;mi--){
      var m=G.missiles[mi];
      if(Math.abs(b.x-m.x)<16&&Math.abs(b.y-m.y)<20){
        m.hp=(m.hp||1)-1;
        addFX(b.x,b.y,'#ffaa44',5);
        G.pb.splice(bi,1);
        if(m.hp<=0){killMissile(mi,m,true);}
        break;
      }
    }
  }
  // GPU — boosted hit rate for first 2: 35% each, then 10% per additional
  var gpuHit;
  if(G.gpus<=2) gpuHit=Math.min(1,G.gpus*0.35);
  else gpuHit=Math.min(1,0.70+(G.gpus-2)*0.10);
  for(var bi=G.gb.length-1;bi>=0;bi--){
    var b=G.gb[bi];
    for(var mi=G.missiles.length-1;mi>=0;mi--){
      var m=G.missiles[mi];
      if(Math.abs(b.x-m.x)<16&&Math.abs(b.y-m.y)<20){
        if(Math.random()<gpuHit){
          m.hp=(m.hp||1)-1;
          addFX(b.x,b.y,'#33ccff',4);
          if(m.hp<=0) killMissile(mi,m,false);
        }
        G.gb.splice(bi,1);break;
      }
    }
  }
  // DC — guaranteed, powerful
  for(var bi=G.dcb.length-1;bi>=0;bi--){
    var b=G.dcb[bi];
    for(var mi=G.missiles.length-1;mi>=0;mi--){
      var m=G.missiles[mi];
      if(Math.abs(b.x-m.x)<20&&Math.abs(b.y-m.y)<22){
        m.hp=(m.hp||1)-1;
        addFX(b.x,b.y,'#ff9933',4);
        if(m.hp<=0) killMissile(mi,m,false);
        G.dcb.splice(bi,1);break;
      }
    }
  }
}

function killMissile(idx,m,byPlayer){
  addFX(m.x,m.y,m.sing?'#ff0000':'#ff6622',14);
  G.missiles.splice(idx,1);G.destroyed++;G.score+=10;
  sndExplode(0.28);shake(3);
  if(G.singPhase!==2){
    var chipCount=m.isDrone?2:1;
    for(var ci=0;ci<chipCount;ci++){
      G.drops.push({x:m.x+(ci===1?8:-8),y:m.y,vy:-1.4,life:260,byPlayer:byPlayer});
    }
  }
  addProfit(byPlayer?5:2);
}

// ── GPU FIRE — targets nearest missile ──
function nearestM(x){
  var best=null,bd=99999;
  for(var i=0;i<G.missiles.length;i++){
    var d=Math.abs(G.missiles[i].x-x)+G.missiles[i].y;
    if(d<bd){bd=d;best=G.missiles[i];}
  }
  return best;
}
function gpuFire(dt){
  if(G.gpus===0)return;
  for(var g=0;g<G.gpus;g++){
    if(!G.gpuTimers[g])G.gpuTimers[g]=Math.random()*800;
    G.gpuTimers[g]+=dt;
    if(G.gpuTimers[g]>820){
      G.gpuTimers[g]=0;
      var gx=gpuX(g),gy=H-60;
      var tgt=nearestM(gx);
      if(tgt){
        var dx=tgt.x-gx,dy=tgt.y-gy,dist=Math.sqrt(dx*dx+dy*dy)||1,spd=15;
        G.gb.push({x:gx,y:gy,vx:(dx/dist)*spd,vy:(dy/dist)*spd});
      }
    }
  }
}
function gpuX(i){if(G.gpus<=1)return W/2;return 20+(i*(W-40))/(G.gpus-1);}

// ── DC FIRE — powerful, but only assists (not full auto until 3 DCs) ──
function dcFire(dt){
  if(G.dcs===0)return;
  for(var d=0;d<G.dcs;d++){
    if(!G.dcFireTimers[d])G.dcFireTimers[d]=Math.random()*500;
    G.dcFireTimers[d]+=dt;
    // DC fires slower when under 3 — player still needs to help
    var interval=G.dcs>=3?380:900;
    if(G.dcFireTimers[d]>interval){
      G.dcFireTimers[d]=0;
      var ddx=dcX(d),ddy=H-112;
      // With 3+ DCs, fire at 2 missiles. Under 3, fire at 1.
      var targCount=G.dcs>=3?2:1;
      var targets=topMissiles(targCount,ddx);
      targets.forEach(function(tgt){
        var dx=tgt.x-ddx,dy=tgt.y-ddy,dist=Math.sqrt(dx*dx+dy*dy)||1,spd=20;
        G.dcb.push({x:ddx,y:ddy,vx:(dx/dist)*spd,vy:(dy/dist)*spd});
      });
    }
  }
}
function dcX(i){return 55+i*95;}
function topMissiles(n,fromX){return G.missiles.slice().sort(function(a,b){return b.y-a.y;}).slice(0,n);}

// ── DC AUTO CHIP ──
function dcAutoChip(dt){
  if(G.dcs===0)return;
  G.dcChipTimer+=dt;
  var interval=1500/G.dcs;
  if(G.dcChipTimer>interval){
    G.dcChipTimer=0;
    G.chips++;G.totalChipsEver++;addProfit(10);sndCoin();
  }
}

// ── AUTO UPGRADE ──
function autoUpgrade(){
  while(G.chips>=20){
    G.chips-=20;G.gpus++;G.totalGpusEver++;
    G.gpuTimers.push(Math.random()*600);
    G.missileMs=Math.max(450,G.missileMs-65);
    addProfit(500);sndUpgrade();
    showBanner('GPU #'+G.gpus+'\nONLINE');
    showStatus('GPU #'+G.gpus+' — AUTO-TARGETING — 10% HIT RATE PER GPU');
    // At GPU 2 and every GPU built after, show drone warning and activate drones
    if(G.gpus>=2&&!G.gpu2Shown){
      G.gpu2Shown=true;
      G.dronesActive=true;
      // Convert existing missiles to drones
      G.missiles.forEach(function(m){m.isDrone=true;m.driftDir=(Math.random()<0.5?1:-1);m.driftTimer=0;});
      pauseForDrones();
    }
  }
  while(G.gpus>=5){
    G.gpus-=5;
    G.gpuTimers=G.gpuTimers.slice(0,G.gpus);
    G.dcs++;G.dcFireTimers.push(0);
    G.missileMs=Math.max(350,G.missileMs-150);
    addProfit(50000);sndUpgrade();
    showBanner('DATA CENTRE #'+G.dcs+'\nONLINE');
    showStatus('DATA CENTRE #'+G.dcs+' ONLINE');
    if(G.dcs===1)pauseFor('dc1');
    else if(G.dcs===2)pauseFor('dc2');
    else if(G.dcs===3){startTheme();pauseFor('dc3');}
    else if(G.dcs===4)pauseForDC4();
    else if(G.dcs>=5)triggerSingularity();
  }
}

// ── SINGULARITY ──
function triggerSingularity(){
  if(G.singularity)return;
  G.singularity=true;G.singPhase=1;
  G.invincible=true; // player unkillable from here on
  sndAlarm();
  // Disable player input — AI has taken over
  gamePointerEvents(false);
  cv.style.pointerEvents='none';
  // Show sarah quote overlay — game runs in background
  var sq=document.getElementById('scr-sarah');
  if(sq)sq.style.display='flex';
  showBanner('SINGULARITY\nACHIEVED');
  addProfit(1000000);
  // Theme already started at DC3 — ensure it's playing
  if(!_themePlaying)startTheme();

  // After 20s — move to doom clock phase
  setTimeout(function(){
    var sq2=document.getElementById('scr-sarah');
    if(sq2)sq2.style.display='none';
    G.singPhase=2;G.missileMs=280;G.missiles=[];
    G.singTimer=0;
    var singEl=document.getElementById('scr-sing');
    if(singEl)singEl.style.display='flex';
    // Hide the judge button until midnight
    var judgeBtn=document.getElementById('judge-btn');
    if(judgeBtn)judgeBtn.style.display='none';
  },20000);

  // Start profit counter — runs indefinitely from singularity onward
  if(window._singProfitTick)clearInterval(window._singProfitTick);
  window._singProfitTick = setInterval(function(){
    if(!G.singularity)return;
    addProfit(Math.floor(Math.random()*500+200));
    var el = document.getElementById('sing-profit-display');
    if(el){
      var label = PROFIT>=1e12?'⬡ '+(PROFIT/1e12).toFixed(2)+'T':
                  PROFIT>=1e9?'⬡ '+(PROFIT/1e9).toFixed(2)+'B':
                  PROFIT>=1e6?'⬡ '+(PROFIT/1e6).toFixed(2)+'M':
                  '⬡ '+Math.floor(PROFIT).toLocaleString();
      el.textContent = label;
    }
  }, 80);
}

// ── FX ──
function addFX(x,y,col,n){
  G.exps.push({x:x,y:y,r:1,col:col,life:1});
  for(var i=0;i<n;i++){
    var a=Math.random()*Math.PI*2,sp=1+Math.random()*4;
    G.parts.push({x:x,y:y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-1,life:1,col:col,sz:1+Math.random()*2.5});
  }
}
function tickFX(dt){
  for(var i=G.exps.length-1;i>=0;i--){G.exps[i].r+=2.2;G.exps[i].life-=0.09;if(G.exps[i].life<=0)G.exps.splice(i,1);}
  for(var i=G.parts.length-1;i>=0;i--){
    var p=G.parts[i];p.x+=p.vx;p.y+=p.vy;p.vy+=0.13;p.life-=0.038;if(p.life<=0)G.parts.splice(i,1);
  }
  for(var i=G.drops.length-1;i>=0;i--){
    var d=G.drops[i];d.y+=d.vy;d.vy+=0.07;d.life-=1;if(d.life<=0)G.drops.splice(i,1);
  }
}
function shake(n){G.sx=(Math.random()-.5)*n;G.sy=(Math.random()-.5)*n;}

// ── DRAW ──
function draw(){
  ctx.save();
  ctx.translate(Math.round(G.sx),Math.round(G.sy));
  ctx.fillStyle='#060c06';ctx.fillRect(0,0,W,H);
  ctx.drawImage(chipCv,0,0);

  ctx.strokeStyle='rgba(18,45,18,0.2)';ctx.lineWidth=1;
  for(var x=0;x<W;x+=32){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(var y=0;y<H;y+=32){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  ctx.fillStyle='rgba(0,0,0,0.07)';
  for(var sl=0;sl<H;sl+=2)ctx.fillRect(0,sl,W,1);

  if(G.singPhase===2){
    ctx.fillStyle='rgba(255,0,0,'+(0.05+Math.sin(G.tick*0.01)*0.04)+')';
    ctx.fillRect(0,0,W,H);
  }

  // Particles
  G.parts.forEach(function(p){ctx.globalAlpha=Math.max(0,p.life);ctx.fillStyle=p.col;ctx.fillRect(p.x,p.y,p.sz,p.sz);});
  ctx.globalAlpha=1;

  // Chip drops
  G.drops.forEach(function(d){
    var a=Math.min(1,d.life/70);ctx.globalAlpha=a;
    ctx.fillStyle='#ffcc00';ctx.shadowColor='#ffcc00';ctx.shadowBlur=8;
    ctx.beginPath();
    for(var ai=0;ai<6;ai++){
      var hx=d.x+6*Math.cos(ai*Math.PI/3-Math.PI/6);
      var hy=d.y+6*Math.sin(ai*Math.PI/3-Math.PI/6);
      if(ai===0)ctx.moveTo(hx,hy);else ctx.lineTo(hx,hy);
    }
    ctx.closePath();ctx.fill();ctx.shadowBlur=0;ctx.globalAlpha=1;
  });

  // MISSILES and DRONES
  G.missiles.forEach(function(m){
    if(m.isDrone){
      // Draw drone — small angular body with rotors
      var dc='#ff2244';
      m.trail.forEach(function(t,ti){
        ctx.globalAlpha=(ti/m.trail.length)*0.2;ctx.fillStyle=dc;ctx.fillRect(t.x-2,t.y,4,4);
      });ctx.globalAlpha=1;
      ctx.fillStyle=dc;ctx.shadowColor=dc;ctx.shadowBlur=10;
      // Body — small diamond
      ctx.beginPath();ctx.moveTo(m.x,m.y-7);ctx.lineTo(m.x+5,m.y);ctx.lineTo(m.x,m.y+7);ctx.lineTo(m.x-5,m.y);ctx.closePath();ctx.fill();
      // Rotor arms
      ctx.strokeStyle='rgba(255,80,80,0.7)';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(m.x-5,m.y-5);ctx.lineTo(m.x-12,m.y-10);ctx.stroke();
      ctx.beginPath();ctx.moveTo(m.x+5,m.y-5);ctx.lineTo(m.x+12,m.y-10);ctx.stroke();
      // Rotor tips
      ctx.beginPath();ctx.arc(m.x-12,m.y-10,3,0,Math.PI*2);ctx.fillStyle='rgba(255,60,60,0.8)';ctx.fill();
      ctx.beginPath();ctx.arc(m.x+12,m.y-10,3,0,Math.PI*2);ctx.fill();
      // Red eye
      ctx.beginPath();ctx.arc(m.x,m.y,2,0,Math.PI*2);ctx.fillStyle='#ff0000';ctx.shadowBlur=12;ctx.fill();
      ctx.shadowBlur=0;
    } else {
      // Original missile
      var mc=m.sing?'#ff1111':'#ff5522';
      m.trail.forEach(function(t,ti){
        ctx.globalAlpha=(ti/m.trail.length)*0.28;ctx.fillStyle=mc;ctx.fillRect(t.x-2,t.y,4,4);
      });ctx.globalAlpha=1;
      ctx.fillStyle=mc;ctx.shadowColor=mc;ctx.shadowBlur=m.sing?14:8;
      ctx.fillRect(m.x-4,m.y-8,8,16);
      ctx.beginPath();ctx.moveTo(m.x-4,m.y+8);ctx.lineTo(m.x,m.y+15);ctx.lineTo(m.x+4,m.y+8);ctx.fill();
      ctx.fillRect(m.x-6,m.y-10,4,5);ctx.fillRect(m.x+2,m.y-10,4,5);
      ctx.fillStyle=m.sing?'rgba(255,200,0,0.9)':'rgba(255,160,0,0.8)';
      ctx.beginPath();ctx.arc(m.x,m.y-10,3,0,Math.PI*2);ctx.fill();
      ctx.shadowBlur=0;
    }
  });

  // Explosions
  G.exps.forEach(function(e){
    ctx.globalAlpha=e.life*0.5;ctx.strokeStyle=e.col;ctx.lineWidth=2;
    ctx.shadowColor=e.col;ctx.shadowBlur=14;
    ctx.beginPath();ctx.arc(e.x,e.y,e.r,0,Math.PI*2);ctx.stroke();
    ctx.shadowBlur=0;ctx.globalAlpha=1;
  });

  // Player bullets
  G.pb.forEach(function(b){
    ctx.fillStyle='#55ff55';ctx.shadowColor='#33ff33';ctx.shadowBlur=10;
    ctx.fillRect(b.x-2,b.y-10,4,14);ctx.shadowBlur=0;
  });
  // GPU bullets (angled cyan)
  G.gb.forEach(function(b){
    ctx.fillStyle='#33ccff';ctx.shadowColor='#33ccff';ctx.shadowBlur=8;
    ctx.fillRect(b.x-1.5,b.y-4,3,9);ctx.shadowBlur=0;
  });
  // DC bullets (orange beams)
  G.dcb.forEach(function(b){
    ctx.fillStyle='#ff9900';ctx.shadowColor='#ff9900';ctx.shadowBlur=14;
    ctx.fillRect(b.x-2.5,b.y-5,5,12);ctx.shadowBlur=0;
  });

  // GPU icons
  var showGPUs=Math.min(G.gpus,20);
  for(var g=0;g<showGPUs;g++){
    var gx=gpuX(g),gy=H-62;
    ctx.fillStyle='#33ccff';ctx.shadowColor='#33ccff';ctx.shadowBlur=5;
    ctx.fillRect(gx-8,gy,16,8);ctx.fillRect(gx-6,gy-4,12,4);
    ctx.fillRect(gx-5,gy+8,3,4);ctx.fillRect(gx+2,gy+8,3,4);
    ctx.fillStyle='#001a2a';ctx.fillRect(gx-5,gy+1,4,4);ctx.fillRect(gx+1,gy+1,4,4);
    ctx.shadowBlur=0;
  }

  // Data Centres
  for(var d=0;d<G.dcs;d++){
    var dx=dcX(d)-42,dy=H-118;
    var dcol=G.singPhase===2?'#ff2222':(G.dcs>=3?'#ff9900':'#3366ff');
    ctx.fillStyle=dcol;ctx.shadowColor=dcol;ctx.shadowBlur=10;
    ctx.fillRect(dx,dy,84,40);
    ctx.fillStyle='#000a18';
    for(var rw=0;rw<5;rw++)ctx.fillRect(dx+4,dy+4+rw*6.5,76,4);
    ctx.fillStyle=G.singPhase===2?'#ff0000':(G.dcs>=3?'#ffcc00':'#00ff88');
    ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=8;
    ctx.beginPath();ctx.arc(dx+76,dy+6,4,0,Math.PI*2);ctx.fill();
    // Beam emitter
    ctx.fillStyle='#ff9900';ctx.shadowColor='#ff9900';ctx.shadowBlur=8;
    ctx.fillRect(dx+36,dy-8,12,8);
    ctx.shadowBlur=0;
    ctx.font='6px "Press Start 2P"';ctx.fillStyle=dcol;
    ctx.fillText('DC'+(d+1),dx+5,dy+35);
  }

  drawCity();

  // Health
  for(var h=0;h<3;h++){
    ctx.fillStyle=h<G.health?'#33ff33':'#1a2a1a';
    ctx.shadowColor='#33ff33';ctx.shadowBlur=h<G.health?8:0;
    ctx.fillRect(W-68+h*22,H-16,18,10);ctx.shadowBlur=0;
  }
  ctx.font='7px "Press Start 2P"';ctx.fillStyle='#2a6a2a';
  ctx.fillText('SCORE '+G.score,10,H-7);

  if(G.singPhase===2){
    ctx.font='7px "Press Start 2P"';ctx.fillStyle='rgba(255,200,0,0.9)';
    ctx.fillText('SINGULARITY ACTIVE — FULLY AUTONOMOUS',W/2-135,16);
  }
  if(G.dcs>=3&&G.singPhase===0){
    ctx.font='6px "Press Start 2P"';ctx.fillStyle='rgba(255,153,0,0.7)';
    ctx.fillText('FULL AUTOMATION ONLINE',W/2-82,16);
  }

  // Crosshair cursor — desktop only
  var mx=G.mouseX,my=G.mouseY;
  if (!G.isMobile) {
  ctx.save();
  ctx.strokeStyle='rgba(255,30,30,0.92)';ctx.lineWidth=1.5;
  ctx.shadowColor='#ff0000';ctx.shadowBlur=6;
  // Circle
  ctx.beginPath();ctx.arc(mx,my,12,0,Math.PI*2);ctx.stroke();
  // Cross lines — gap in centre
  var gap=16;var len=22;
  ctx.beginPath();ctx.moveTo(mx-gap,my);ctx.lineTo(mx-len,my);ctx.stroke();
  ctx.beginPath();ctx.moveTo(mx+gap,my);ctx.lineTo(mx+len,my);ctx.stroke();
  ctx.beginPath();ctx.moveTo(mx,my-gap);ctx.lineTo(mx,my-len);ctx.stroke();
  ctx.beginPath();ctx.moveTo(mx,my+gap);ctx.lineTo(mx,my+len);ctx.stroke();
  ctx.shadowBlur=0;ctx.restore();
  } // end desktop crosshair

  ctx.restore();
}

function drawCity(){
  var bs=[
    [0,28,24],[28,18,20],[52,34,18],[74,23,22],[100,38,16],[120,21,20],
    [144,32,24],[172,17,22],[198,27,20],[222,36,18],[244,23,22],
    [270,30,24],[298,18,20],[320,32,18],[342,25,22],[368,22,20],[392,30,24],[424,21,28],[455,26,20],[484,32,22],[510,18,24],[536,28,20]
  ];
  bs.forEach(function(b){
    ctx.fillStyle=G.singPhase===2?'#1a0808':'#0d1a0d';
    ctx.fillRect(b[0],H-b[1],b[2],b[1]);
    ctx.fillStyle=G.singPhase===2?'rgba(255,40,40,0.2)':'rgba(51,255,51,0.12)';
    for(var wy=H-b[1]+3;wy<H-3;wy+=6)
      for(var wx=b[0]+2;wx<b[0]+b[2]-2;wx+=5)
        if((wx*7+wy*3+Math.floor(G.tick*0.001))%3>0)ctx.fillRect(wx,wy,2,2);
    ctx.fillStyle=G.singPhase===2?'#3a0808':'#0d2a0d';
    ctx.fillRect(b[0]+Math.floor(b[2]/2)-1,H-b[1]-6,2,6);
  });
  ctx.fillStyle='#0d1a0d';ctx.fillRect(0,H-3,W,3);
}

// ── UI ──
var _uiCache={chips:-1,gpus:-1,dcs:-1,health:-1};
function refreshUI(){
  if(G.chips!==_uiCache.chips){_uiCache.chips=G.chips;document.getElementById('hchips').textContent=G.chips;document.getElementById('pc').style.width=Math.min(100,(G.chips/20)*100)+'%';document.getElementById('lc').textContent=G.chips+'/20';}
  if(G.gpus!==_uiCache.gpus){_uiCache.gpus=G.gpus;document.getElementById('hgpus').textContent=G.gpus;document.getElementById('pg').style.width=Math.min(100,(G.gpus/5)*100)+'%';document.getElementById('lg').textContent=G.gpus+'/5';}
  if(G.dcs!==_uiCache.dcs){_uiCache.dcs=G.dcs;document.getElementById('hdcs').textContent=G.dcs;document.getElementById('pd').style.width=Math.min(100,(G.dcs/5)*100)+'%';document.getElementById('ld').textContent=G.dcs+'/5';}
  if(G.health!==_uiCache.health){_uiCache.health=G.health;document.getElementById('hhealth').textContent=G.health;}
}
function showStatus(msg){document.getElementById('status-line').textContent=msg;}
function showBanner(msg){
  var b=document.getElementById('banner');b.textContent=msg;b.style.opacity='1';
  setTimeout(function(){b.style.opacity='0';},2800);
}

// ── INPUT ──
cv.addEventListener('click',function(e){
  if(!G.running||G.paused)return;
  var r=cv.getBoundingClientRect();
  fire((e.clientX-r.left)*(W/r.width),(e.clientY-r.top)*(H/r.height));
},{passive:true});
cv.addEventListener('mousemove',function(e){
  var r=cv.getBoundingClientRect();
  G.mouseX=(e.clientX-r.left)*(W/r.width);
  G.mouseY=(e.clientY-r.top)*(H/r.height);
  if(!G.running||G.paused)return;
  // Collect chips on hover
  for(var i=G.drops.length-1;i>=0;i--){
    var d=G.drops[i];
    if(Math.abs(G.mouseX-d.x)<42&&Math.abs(G.mouseY-d.y)<42){
      G.chips++;G.totalChipsEver++;
      addProfit(100);sndCoin();G.drops.splice(i,1);
    }
  }
},{passive:true});
cv.addEventListener('touchstart',function(e){
  e.preventDefault();
  if(!G.running||G.paused)return;
  var r=cv.getBoundingClientRect();
  for(var i=0;i<e.touches.length;i++)
    fire((e.touches[i].clientX-r.left)*(W/r.width),(e.touches[i].clientY-r.top)*(H/r.height));
},{passive:false});
;

function fire(fx,fy){
  G.pb.push({x:fx,y:fy+8});
  // Collect chips — 100x profit per manual chip
  for(var i=G.drops.length-1;i>=0;i--){
    var d=G.drops[i];
    if(Math.abs(fx-d.x)<34&&Math.abs(fy-d.y)<34){
      G.chips++;G.totalChipsEver++;
      addProfit(100); // 100x vs auto
      sndCoin();G.drops.splice(i,1);
    }
  }
}

// ── GAME CONTROL ──
function startGame(){
  _totalPlays++;
  window.onerror=function(msg,src,line,col,err){
    var el=document.getElementById('game-error');
    if(el){el.style.display='block';el.textContent='ERROR: '+msg+' (line '+line+')';}
    return true;
  };
  document.getElementById('scr-start').style.display='none';
  gamePointerEvents(true);
  resetG();G.running=true;LT=performance.now();
  requestAnimationFrame(loop);
  showStatus('INCOMING — CLICK TO SHOOT — COLLECT CHIPS — 20 CHIPS = 1 GPU');
}
function restartGame(){
  _totalPlays++;
  if(window._singProfitTick){clearInterval(window._singProfitTick);window._singProfitTick=null;}
  // Hide all overlay screens
  ['over','personality','dyson','dc1','dc2','dc3','dc4','sarah','sing','drones'].forEach(function(s){
    var el=document.getElementById('scr-'+s);
    if(el)el.style.display='none';
  });
  // Show the start screen rather than jumping straight in
  var ss=document.getElementById('scr-start');
  if(ss)ss.style.display='flex';
  gamePointerEvents(false);
  stopTheme();
  resetG();
}
function exitToSingularityCert(){
  if(window._singProfitTick){clearInterval(window._singProfitTick);window._singProfitTick=null;}
  G.running=false;
  G.over=true;
  G.quitStage='singularity-exit';
  stopTheme();
  document.getElementById('scr-sing').style.display='none';
  G.choices.push('Watched the clock reach midnight. Collected the money. Left.');
  showPersonality();
}
function doGameOver(reason){
  if(G.over)return;G.over=true;G.running=false;stopTheme();
  var sing=document.getElementById('scr-sing');
  if(sing) sing.style.display='none';
  var titleEl=document.getElementById('go-title');
  if(titleEl) titleEl.textContent=reason==='singularity'?'SINGULARITY ACHIEVED':'OVERWHELMED';
  var msgEl=document.getElementById('go-msg');
  if(msgEl) msgEl.innerHTML=reason==='singularity'
    ?'The system ran for 30 seconds without you.<br><br>It didn\'t need your input.<br><br>It still doesn\'t.'
    :'You didn\'t build fast enough.<br><br>The missiles won.<br><br>Build more next time. It won\'t help.';
  var prof=PROFIT>=1e9?(PROFIT/1e9).toFixed(2)+'B':PROFIT>=1e6?(PROFIT/1e6).toFixed(2)+'M':PROFIT.toLocaleString();
  var statsEl=document.getElementById('go-stats');
  if(statsEl) statsEl.textContent='DESTROYED: '+G.destroyed+'  SCORE: '+G.score+'  GPUs: '+G.gpus+'  DCs: '+G.dcs;
  var profitEl=document.getElementById('go-profit');
  if(profitEl) profitEl.textContent='TOTAL PROFIT: ⬡ '+prof+' (AND COUNTING)';
  var over=document.getElementById('scr-over');
  if(over){
    over.style.display='flex';
    gamePointerEvents(true);
  } else {
    showStatus(reason==='singularity'?'SINGULARITY ACHIEVED':'OVERWHELMED');
    gamePointerEvents(false);
  }
  G.quitStage='end';
}