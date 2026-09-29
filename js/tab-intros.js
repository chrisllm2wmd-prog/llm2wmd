
(function(){
var TAB_INTRO_SEEN_PREFIX='llm2wmd_intro_seen_';
var TAB_INTRO_SEEN_PREFIX='llm2wmd_intro_seen_';
var GENERAL_INTRO_KEY='llm2wmd_general_intro_seen';
var GENERAL_INTRO_HTML='Read through the contents at your leisure. Your position will be saved in your browser. Full screen helps. Music is optional. Recommended anyway. Look for \'Add to Home Screen\' in your browser options for an app-like experience.<br/><br/>Top right: Simple mode for easier readability, Dark mode for the intended atmosphere. Neither is wrong.<br/><br/>Check the Contents tab any time for what has changed.<hr style="border:none;border-top:1px solid rgba(255,85,85,.25);margin:18px 0;">';
var TAB_INTRO_COPY={
  timeline:{title:'TIMELINE',body:'The factual record. OpenAI founding to Claude targeting missiles over Iran. Eleven years. One page.'},
  headlines:{title:'HEADLINE MODE',body:"The stories worth knowing before the rest. The machines won't rest, so neither will this section."},
  faq:{title:'FAQ / SEARCH ENTRY PAGE',body:'The ten AI questions people actually search for, answered using the evidence already on this site.'},
  thesis:{title:'THESIS',body:'Opinion. Analysis. No longer stalled. The author finally stopped building long enough to write.'},
  review:{title:'SYSTEM ANALYSIS',body:'Less review now. More breakdown. Ongoing attempts to map the system underneath the timeline while it is still moving.'},
  contents:{title:'CONTENTS',body:'The full site index. Every section, one line each, so you know what you are about to click into.'},
  credits:{title:'CREDITS & LEGAL',body:'One person. Six roles. A disclaimer written four times and then made smaller. The game no longer lives here.'},
  sources:{title:'SOURCES / RECEIPTS INDEX',body:'A verification layer for the timeline: source status, links, and jump-back navigation for each entry.'},
  gameguide:{title:'GAME SELECT',body:'System briefing, live mechanics, certificate ladder, super rare pulls, and the button that lets you volunteer anyway.'},
  contact:{title:'CONTACT',body:'Built and run by one person. Feedback, corrections, and notes from anyone who made it this far are genuinely welcome.'},
  shop:{title:'SHOP',body:'Wearable pieces from the timeline, printed to order. Buying one funds the site. That\'s the whole pitch. Told you I\'d sell out at the first opportunity.'}
};
window.maybeShowTabIntro=function(id){
  try{
    if(id==='mission')return;
    if(document.body.classList.contains('captcha-lock'))return;
    if(document.querySelector('.tab-intro-overlay'))return;
    var copy=TAB_INTRO_COPY[id];
    if(!copy)return;
    var key=TAB_INTRO_SEEN_PREFIX+id;
    if(localStorage.getItem(key)==='1')return;
    var showGeneral=localStorage.getItem(GENERAL_INTRO_KEY)!=='1';
    var bodyHtml=(showGeneral?GENERAL_INTRO_HTML:'')+copy.body;
    if(showGeneral)localStorage.setItem(GENERAL_INTRO_KEY,'1');
    var overlay=document.createElement('div');
    overlay.className='tab-intro-overlay';
    overlay.innerHTML='<div class="tab-intro-card"><div class="tab-intro-title">'+copy.title+'</div><div class="tab-intro-body">'+bodyHtml+'</div><button class="tab-intro-dismiss" type="button">DISMISS</button><button class="tab-intro-never" type="button">DON\'T SHOW AGAIN</button></div>';
    document.body.appendChild(overlay);
    var overlayReadyAt=Date.now()+400;
    var closeOnly=function(){if(overlay.parentNode)overlay.parentNode.removeChild(overlay);};
    var neverAgain=function(){localStorage.setItem(key,'1');closeOnly();refreshTabNotifyDots();};
    overlay.querySelector('.tab-intro-dismiss').addEventListener('click',closeOnly);
    overlay.querySelector('.tab-intro-never').addEventListener('click',neverAgain);
    overlay.addEventListener('click',function(e){if(e.target===overlay&&Date.now()>=overlayReadyAt)closeOnly();});
  }catch(e){console.error('[tab-intro] maybeShowTabIntro failed:',e);}
};
function refreshTabNotifyDots(){
  try{
    Object.keys(TAB_INTRO_COPY).forEach(function(id){
      var tabEl=document.getElementById('tab-'+id);
      if(!tabEl)return;
      var seen=localStorage.getItem(TAB_INTRO_SEEN_PREFIX+id)==='1';
      if(seen)tabEl.removeAttribute('data-unseen');else tabEl.setAttribute('data-unseen','1');
    });
  }catch(e){console.error('[tab-intro] refreshTabNotifyDots failed:',e);}
}
window.refreshTabNotifyDots=refreshTabNotifyDots;
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refreshTabNotifyDots);else refreshTabNotifyDots();
})();
