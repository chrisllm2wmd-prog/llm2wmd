(function(){function setThemeToggleState(on){var btn=document.getElementById('theme-toggle-btn');var state=document.getElementById('theme-toggle-state');if(!btn||!state)return;btn.classList.toggle('on',!!on);btn.classList.toggle('muted',!on);}
function inferThemeAudioOn(){try{if(typeof _playing!=='undefined')return!!_playing;}catch(e){}
var oldBtn=document.getElementById('audio-btn');if(oldBtn)return!oldBtn.classList.contains('muted');var audioEls=document.querySelectorAll('audio');for(var i=0;i<audioEls.length;i++){var audio=audioEls[i];if(!audio.paused&&!audio.muted&&audio.volume>0)return true;}
var toggleBtn=document.getElementById('theme-toggle-btn');return!!(toggleBtn&&toggleBtn.classList.contains('on'));}
function refreshRailParity(){try{if(typeof updateRailProgress==='function')updateRailProgress();}catch(e){}
try{if(typeof updateResumeCard==='function')updateResumeCard();}catch(e){}
try{if(typeof updateSaveStatusUI==='function')updateSaveStatusUI();}catch(e){}
try{if(typeof updateSimpleModeProgressUI==='function')updateSimpleModeProgressUI();}catch(e){}
try{if(typeof showSavePrompt==='function'&&typeof _saveProgress!=='undefined')showSavePrompt(_saveProgress===null);}catch(e){}
try{if(typeof showSaveStatus==='function'&&typeof _saveProgress!=='undefined')showSaveStatus(!!_saveProgress);}catch(e){}}
function syncThemeToggle(){setThemeToggleState(inferThemeAudioOn());refreshRailParity();}
document.addEventListener('DOMContentLoaded',syncThemeToggle);window.addEventListener('load',syncThemeToggle);document.addEventListener('visibilitychange',function(){if(!document.hidden)syncThemeToggle();});if(typeof window.toggleAudio==='function'&&!window.__themeToggleParityWrapped){var oldToggleAudioParity=window.toggleAudio;window.toggleAudio=function(){var result=oldToggleAudioParity.apply(this,arguments);setTimeout(syncThemeToggle,20);return result;};window.__themeToggleParityWrapped=true;}})();