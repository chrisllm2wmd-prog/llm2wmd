

const PX_QUESTIONS = [
  {
    id:'assistant', text:'Which AI assistants do you use regularly? (select all that apply)',
    type:'multi',
    options:[
      {label:'ChatGPT', pts:2, hit:'OpenAI — ChatGPT', note:"Consumer accounts are opted in to training by default — turning it off only stops future chats, not the ones already used. Business, Team, Enterprise and API traffic are excluded by contract. Free users get no such contract."},
      {label:'Claude', pts:2, hit:'Anthropic — Claude', note:"Until August 2025, Anthropic didn't train on consumer chats. That policy is now reversed: Free, Pro and Max conversations train Claude by default unless you opt out, and opted-in data is kept five years, not thirty days. As of a June 2026 update, conversations flagged for safety review can be used for training even if you opted out — the exception isn't publicly defined."},
      {label:'Gemini', pts:2, hit:'Google — Gemini App', note:"Trains on your conversations by default. Chats are kept up to 18 months and a portion are read by human reviewers unless you switch off 'Gemini Apps Activity' — a setting most people never find."},
      {label:'Meta AI (Facebook)', pts:2, hit:'Meta AI (Assistant)', note:"Your conversations with Meta AI train its models by default. There's no simple toggle — stopping it means filing a formal objection through Meta's Privacy Center, and Meta decides whether to honor it."},
      {label:'Copilot', pts:2, hit:'Microsoft — Copilot (Consumer)', note:"Consumer Copilot and Bing Chat conversations can train Microsoft's models by default; an opt-out exists in account privacy settings. Copilot inside a paid Microsoft 365 tenant is excluded — but Word and Excel have a separate 'Connected Experiences' setting, on by default, that lets Microsoft analyze your documents regardless."},
      {label:'No, none of these', pts:0, hit:null, note:null, exclusive:true}
    ]
  },
  {
    id:'phone', text:'What phone do you use?',
    type:'single',
    options:[
      {label:'iPhone', pts:1, hit:'Apple — iOS', note:"Apple markets itself as the on-device holdout — Siri requests and Apple Intelligence tasks are processed on the phone or in a claimed no-retention 'Private Cloud Compute' when they can't be. That leaves App Store policy as the real lever: it decides which AI products reach you at all, and on what terms."},
      {label:'Android (any brand)', pts:1, hit:'Google — Android (OS-Level Gemini)', note:"Gemini is built into Android at the OS level on billions of devices, often impossible to fully remove without breaking system features. This is separate from Gemini-the-app's own training policy above — this is the assistant reading your device by default."},
      {label:"I don't own a smartphone", pts:0, hit:null, note:null}
    ]
  },
  {
    id:'hyperscale', text:'Do you regularly use any of these? (select all that apply)',
    type:'multi',
    options:[
      {label:'Amazon (shopping or AWS)', pts:1, hit:'Amazon — AWS / Alexa', note:"AWS is the compute layer under a large share of the AI industry, defense contracts included. Separately: since March 2025, Echo devices can no longer opt out of sending voice recordings to Amazon's cloud — the local-processing option was removed outright so those recordings could train the Alexa+ model."},
      {label:'Meta (Facebook / Instagram / WhatsApp)', pts:1, hit:'Meta — Platform Infrastructure', note:"Since mid-2024, Meta trains its AI on the public posts, photos and captions of every adult user on Facebook and Instagram by default. Objecting requires a manually filed form, is honored more reliably in the EU than the US, and does nothing about data already used."},
      {label:'X (Twitter)', pts:1, hit:'X / xAI — Grok Training', note:"X shares your public posts, replies, and Grok conversations with xAI by default; a toggle exists to stop future training but not to undo what's already in the model. In February 2026, xAI was folded into a $1.25 trillion SpaceX/xAI/X structure — your data now sits inside a single entity preparing for public markets."},
      {label:'Tesla (car, Powerwall, or stock)', pts:1, hit:'Tesla — Autopilot / FSD', note:"Tesla vehicles continuously upload camera and sensor footage that trains the same neural nets underneath Autopilot, FSD, and Optimus. It's in the Tesla ToS you accepted to activate the car."},
      {label:'Microsoft (Windows, Office, Azure)', pts:1, hit:'Microsoft — Windows / Office 365', note:"Azure is one of three hyperscalers whose compute underwrites the AI industry, including military-facing deployments. On the desktop, Word and Excel's 'Connected Experiences' setting — on by default — lets Microsoft analyze your documents unless you dig into Trust Center settings and turn it off."},
      {label:'Google (Search, YouTube, Cloud)', pts:1, hit:'Google — Search / Cloud', note:"Google Cloud is another of the three hyperscalers. A July 2026 privacy policy revision reportedly widened Google's ability to draw on Gmail and Drive content to build and train products unless 'Smart features' are switched off — Workspace business accounts are contractually excluded; personal Gmail is not."},
      {label:'None of these', pts:0, hit:null, note:null, exclusive:true}
    ]
  },
  {
    id:'pension', text:'Do you have a retirement account, pension, or superannuation of any kind — even a small one, even if someone else manages it?',
    type:'single',
    options:[
      {label:'Yes', pts:2, hit:'Pension / retirement fund', note:'The largest index funds are overwhelmingly weighted toward the same handful of AI-driving companies on this timeline. No prospectus mentions AI risk in terms you signed anything about — the exposure arrives by default, through market-cap weighting.'},
      {label:'Not sure', pts:2, hit:'Pension / retirement fund (probably)', note:'Almost nobody actually checks. The honest default assumption is: some of it, whether you chose it or not.'},
      {label:'No', pts:0, hit:null, note:null}
    ]
  },
  {
    id:'index', text:'Any index funds, mutual funds, or investments where "the bank / an advisor handles it"?',
    type:'single',
    options:[
      {label:'Yes', pts:2, hit:'Index / managed fund', note:'"Someone else handles it" almost always means a fund tracking the S&P 500 — Microsoft, Nvidia, Apple, Amazon, Alphabet and Meta by default. The fund\'s terms authorize the manager to hold and vote these shares on your behalf; you never see a consent screen.'},
      {label:'Not sure', pts:2, hit:'Index / managed fund (probably)', note:'Same answer as above. Not knowing what a fund holds is the default state, not an exception.'},
      {label:'No', pts:0, hit:null, note:null}
    ]
  },
  {
    id:'cloud', text:'Does your employer, school, or government almost certainly run on AWS, Azure, or Google Cloud?',
    type:'single',
    options:[
      {label:'Yes', pts:1, hit:'Cloud infrastructure', note:"The physical infrastructure AI models are trained and run on. Institutional cloud contracts are negotiated by IT departments and governments, not by you — AI features are frequently switched on tenant-wide by an administrator, with zero individual notice or consent step."},
      {label:"Don't know", pts:1, hit:'Cloud infrastructure (almost certainly)', note:'At this scale, "don\'t know" and "yes" resolve to the same answer more often than not.'},
      {label:'Definitely not', pts:0, hit:null, note:null}
    ]
  },
  {
    id:'algo', text:'Which of these do you use regularly? (select all that apply)',
    type:'multi',
    options:[
      {label:'YouTube', pts:1, hit:'Google — YouTube Algorithm', note:"YouTube's recommendation model decides what plays next, built by the same research org behind Gemini. Google's terms grant it a broad standing license to analyze everything you upload and watch to train and improve its products."},
      {label:'Facebook (Meta)', pts:1, hit:'Meta — News Feed Algorithm', note:"Distinct from Meta's generative-AI training above — this is the older ranking system, one of the largest deployed AI models on earth, running billions of predictions a second on what you see."},
      {label:'X (Twitter)', pts:1, hit:'X — For You Algorithm', note:"The feed-ranking model, separate from Grok's training pipeline listed above but built and run by the same company on the same underlying user data."},
      {label:'TikTok', pts:1, hit:'TikTok / ByteDance', note:"TikTok's terms permit collecting 'faceprints and voiceprints' from your content, and a 2026 policy update explicitly extends that collection to whatever you type into its AI features — including anything you'd rather not have stored, since prompts about sensitive topics are treated as ordinary data."},
      {label:'Netflix', pts:1, hit:'Netflix', note:'One of the earliest large-scale commercial deployments of machine learning for behavioral prediction — a business model every recommendation engine after it, including the ones above, was built to imitate.'},
      {label:'Spotify', pts:1, hit:'Spotify', note:'Recommendation and generative playlist AI shape most of what you hear without you choosing it directly, trained continuously on your listening history under terms you accepted once and never read again.'},
      {label:'Amazon suggestions', pts:1, hit:'Amazon — Recommendations (Rufus)', note:"Separate from Alexa above: Amazon's Rufus shopping assistant is trained on its product catalog, your reviews and questions, and the open web — another Amazon AI product with its own data pipeline, running on the AWS infrastructure it also sells to everyone else."},
      {label:'None of these', pts:0, hit:null, note:null, exclusive:true}
    ]
  },
  {
    id:'sovereign', text:"Does your country's public pension fund or sovereign wealth fund invest in index funds or the S&P 500?",
    type:'single',
    options:[
      {label:'Yes', pts:2, hit:'Sovereign / public pension fund', note:'Public pension and sovereign wealth funds are overwhelmingly index-weighted — meaning they hold these companies whether citizens opted in or not, under fund mandates almost no citizen has read.'},
      {label:'Not sure', pts:2, hit:'Sovereign / public pension fund (almost certainly)', note:'Most people have never checked. Most public funds hold these companies regardless.'},
      {label:'No', pts:0, hit:null, note:null}
    ]
  }
];

let pxCurrent = -1; // -1 = intro
let pxAnswers = {}; // id -> array of selected option indices
let pxLastPct = 0;
let pxLastVerdict = '';

function pxEl(sel){ return document.querySelector(sel); }

function pxScrollTop(){
  var card = document.querySelector('.proximity-card');
  if(card) card.scrollTop = 0;
}

function pxShowScreen(id){
  document.querySelectorAll('.px-screen').forEach(s=>s.classList.remove('active'));
  pxEl('#px-screen-'+id).classList.add('active');
  pxScrollTop();
}

function pxUpdateProgress(){
  const pct = pxCurrent < 0 ? 0 : Math.round(((pxCurrent) / PX_QUESTIONS.length) * 100);
  pxEl('#progressFill').style.width = pct + '%';
}

function pxRenderQuestion(){
  const q = PX_QUESTIONS[pxCurrent];
  pxEl('#qCount').textContent = 'QUESTION ' + (pxCurrent+1) + ' / ' + PX_QUESTIONS.length;
  pxEl('#qText').textContent = q.text;
  const container = pxEl('#qOptions');
  container.innerHTML = '';
  const selected = pxAnswers[q.id] || [];

  q.options.forEach((opt, i)=>{
    const btn = document.createElement('div');
    btn.className = 'px-opt' + (selected.includes(i) ? ' selected' : '');
    btn.textContent = opt.label;
    btn.addEventListener('click', ()=>{
      if(q.type === 'single'){
        pxAnswers[q.id] = [i];
      } else {
        let cur = pxAnswers[q.id] || [];
        if(opt.exclusive){
          cur = cur.includes(i) ? [] : [i];
        } else {
          cur = cur.filter(x=>!q.options[x].exclusive);
          if(cur.includes(i)) cur = cur.filter(x=>x!==i);
          else cur.push(i);
        }
        pxAnswers[q.id] = cur;
      }
      pxRenderQuestion();
    });
    container.appendChild(btn);
  });

  pxEl('#nextBtn').removeAttribute('disabled');
  if(!pxAnswers[q.id] || pxAnswers[q.id].length === 0) pxEl('#nextBtn').setAttribute('disabled','true');
  pxEl('#backLink').style.visibility = pxCurrent === 0 ? 'hidden' : 'visible';
  pxUpdateProgress();
}

pxEl('#startBtn').addEventListener('click', ()=>{
  pxCurrent = 0;
  pxShowScreen('question');
  pxRenderQuestion();
});

pxEl('#nextBtn').addEventListener('click', ()=>{
  if(pxCurrent < PX_QUESTIONS.length - 1){
    pxCurrent++;
    pxScrollTop();
    pxRenderQuestion();
  } else {
    pxShowResult();
  }
});

pxEl('#backLink').addEventListener('click', ()=>{
  if(pxCurrent > 0){ pxCurrent--; pxScrollTop(); pxRenderQuestion(); }
});

pxEl('#retakeBtn').addEventListener('click', ()=>{
  pxAnswers = {};
  pxCurrent = 0;
  pxShowScreen('question');
  pxRenderQuestion();
});

pxEl('#continueSiteBtn').addEventListener('click', ()=>{
  closeProximityOverlay();
});

function pxWrapText(ctx, text, x, y, maxWidth, lineHeight){
  const words = String(text||'').split(/\s+/);
  let line = '';
  const lines = [];
  words.forEach(word=>{
    const test = line ? line + ' ' + word : word;
    if(ctx.measureText(test).width > maxWidth && line){ lines.push(line); line = word; }
    else { line = test; }
  });
  if(line) lines.push(line);
  lines.forEach((l,i)=> ctx.fillText(l, x, y + i*lineHeight));
  return y + (lines.length-1)*lineHeight;
}

function pxBuildShareImage(pct, verdict){
  const canvas = document.createElement('canvas');
  canvas.width = 1200; canvas.height = 675;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0,0,0,675);
  grad.addColorStop(0,'#141821'); grad.addColorStop(1,'#0a0b0d');
  ctx.fillStyle = grad; ctx.fillRect(0,0,1200,675);
  ctx.fillStyle = '#ff5555'; ctx.fillRect(0,0,1200,10);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#8a96a8'; ctx.font = "600 24px 'Courier New', monospace";
  ctx.fillText('LLM2WMD.COM  ·  PROXIMITY TEST', 64, 94);
  ctx.fillStyle = '#8a96a8'; ctx.font = "600 26px 'Courier New', monospace";
  ctx.fillText('PROXIMITY SCORE', 64, 210);
  ctx.fillStyle = '#ff5555'; ctx.font = "700 168px Georgia, serif";
  ctx.fillText(pct + '%', 58, 380);
  ctx.fillStyle = '#f2f4f7'; ctx.font = "700 66px Georgia, serif";
  pxWrapText(ctx, verdict, 64, 480, 1080, 72);
  ctx.fillStyle = '#8a96a8'; ctx.font = "600 22px 'Courier New', monospace";
  ctx.fillText('llm2wmd.com', 64, 618);
  return canvas.toDataURL('image/png');
}

function pxShareResult(){
  const text = "I just learned my level of involvement. Find out yours — if you can live with it.";
  const url = 'https://llm2wmd.com/#proximity-test';
  const dataUrl = pxBuildShareImage(pxLastPct, pxLastVerdict);
  function fallback(){
    try{
      const tweetUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text + ' ' + url);
      window.open(tweetUrl, '_blank', 'noopener');
    }catch(e){}
  }
  fetch(dataUrl).then(r=>r.blob()).then(blob=>{
    const file = new File([blob], 'llm2wmd-proximity-result.png', {type:'image/png'});
    if(navigator.canShare && navigator.canShare({files:[file]})){
      return navigator.share({title:'LLM2WMD Proximity Test', text:text, url:url, files:[file]});
    }
    if(navigator.share) return navigator.share({title:'LLM2WMD Proximity Test', text:text, url:url});
    fallback();
  }).catch(fallback);
}

pxEl('#pxShareBtn').addEventListener('click', ()=>{
  pxShareResult();
});

function pxShowResult(){
  let score = 0, maxScore = 0;
  const hits = [];
  PX_QUESTIONS.forEach(q=>{
    const sel = pxAnswers[q.id] || [];
    let qMax = 0;
    if(q.type === 'multi'){
      qMax = q.options.filter(o=>!o.exclusive).reduce((a,o)=>a+o.pts,0);
    } else {
      q.options.forEach(o=>{ qMax = Math.max(qMax, o.pts); });
    }
    maxScore += qMax;
    sel.forEach(i=>{
      const opt = q.options[i];
      score += opt.pts;
      if(opt.hit) hits.push({hit:opt.hit, note:opt.note});
    });
  });

  const pct = maxScore ? Math.round((score/maxScore)*100) : 0;
  let verdict, body;

  if(pct >= 70){
    verdict = 'FULLY ENTANGLED';
    body = "You didn't just \"use the technology.\" Your phone, your retirement, and the infrastructure under half the apps on your homescreen all trace back to the same handful of companies on this timeline. That's not a coincidence — it's the design.";
  } else if(pct >= 35){
    verdict = 'MORE THAN YOU THOUGHT';
    body = "You probably came in thinking you'd score low. The pension and index-fund questions are usually where that changes — almost nobody actually knows what's inside those, and the honest answer is almost always: some of it.";
  } else {
    verdict = 'THIN, BUT NOT ZERO';
    body = "Genuinely lighter contact than most people who take this. But check the sovereign/public pension question again — if your country has one, the exposure is very likely there whether you opted in or not.";
  }

  pxEl('#resultScore').textContent = 'PROXIMITY SCORE: ' + pct + '%';
  pxEl('#resultVerdict').textContent = verdict;
  pxEl('#resultBody').textContent = body;
  pxLastPct = pct;
  pxLastVerdict = verdict;

  const seen = new Set();
  const uniqueHits = hits.filter(h=>{
    if(seen.has(h.hit)) return false;
    seen.add(h.hit);
    return true;
  });

  const hitList = pxEl('#hitList');
  if(uniqueHits.length){
    hitList.innerHTML = uniqueHits.map(h=>
      '<div class="px-hit-item"><div class="px-hit-name">▸ ' + h.hit + '</div><div class="px-hit-note">' + h.note + '</div></div>'
    ).join('');
  } else {
    hitList.innerHTML = '<div class="px-hit-item"><div class="px-hit-note">No direct touchpoints recorded — rare.</div></div>';
  }

  pxShowScreen('result');
  pxEl('#progressFill').style.width = '100%';
}


function resetProximityWidget(){
  pxCurrent = -1;
  pxAnswers = {};
  document.querySelectorAll('#proximity-overlay .px-screen').forEach(function(s){ s.classList.remove('active'); });
  var introEl = pxEl('#px-screen-intro');
  if(introEl) introEl.classList.add('active');
  var pf = pxEl('#progressFill');
  if(pf) pf.style.width = '0%';
}

function openProximityOverlay(){
  var ov = document.getElementById('proximity-overlay');
  if(!ov) return;
  resetProximityWidget();
  ov.classList.add('is-open');
  ov.setAttribute('aria-hidden','false');
  document.body.classList.add('proximity-overlay-open');
  if(!ov.__llmBound){
    ov.__llmBound = true;
    ov.addEventListener('click', function(e){ if(e.target === ov) closeProximityOverlay(); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && ov.classList.contains('is-open')) closeProximityOverlay(); });
  }
}

function closeProximityOverlay(){
  var ov = document.getElementById('proximity-overlay');
  if(!ov) return;
  ov.classList.remove('is-open');
  ov.setAttribute('aria-hidden','true');
  document.body.classList.remove('proximity-overlay-open');
}

if(window.location.hash === '#proximity-test'){
  document.addEventListener('DOMContentLoaded', function(){
    setTimeout(openProximityOverlay, 400);
  });
}
