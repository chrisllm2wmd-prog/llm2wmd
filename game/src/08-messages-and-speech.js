function setStatus(msg){statusEl.textContent=msg;}
function queueBroadcastMessage(msg,duration=COPY.bannerBaseMs){if(!msg)return;if(!Array.isArray(S.broadcastQueue))S.broadcastQueue=[];S.broadcastQueue.push({msg,duration});}
function processBroadcastQueue(){if(S.broadcastMessage&&S.tick<S.broadcastUntil)return;if(Array.isArray(S.broadcastQueue)&&S.broadcastQueue.length){const next=S.broadcastQueue.shift();S.broadcastMessage=next.msg;S.broadcastUntil=S.tick+(next.duration||COPY.bannerBaseMs);}else{S.broadcastMessage='';S.broadcastUntil=0;}}
function getBroadcastMessage(){return(S.broadcastMessage&&S.tick<S.broadcastUntil)?S.broadcastMessage:'';}
function protectOverlayButtons(overlay,ms=2000){if(!overlay)return;const buttons=Array.from(overlay.querySelectorAll('button'));if(!buttons.length)return;buttons.forEach(btn=>{btn.disabled=true;btn.dataset.touchLock='1';btn.style.opacity='0.5';});const unlock=()=>{buttons.forEach(btn=>{if(btn.dataset.touchLock==='1'){btn.disabled=false;btn.dataset.touchLock='0';btn.style.opacity='';}});};window.setTimeout(unlock,ms);}
function setDroneSpeech(m,text,ms=3000){if(!m)return;m.sayText=text;m.sayTimer=ms;}
function nearestCivilianFor(m){let best=null,bestDist=Infinity;for(const t of S.missiles){if(t.type!=='civilian'||!t.parachuteOpen)continue;const d=Math.hypot(t.x-m.x,t.y-m.y);if(d<bestDist){bestDist=d;best=t;}}
return best;}
