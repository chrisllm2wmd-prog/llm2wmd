/* Weapon pickups: falling icons that must be shot. One weapon at a time, six shots each. A new pickup only falls
   after the current weapon is used up, and then only after 4-10 more kills with the normal weapon.
   Laser = sweeping beam. Homing = curved smoke-trail missiles. Carpet = a line of bombs that chain-explode.
   Drawing lives in 16b-weapon-drawing.js. State lives on S (see defaults in 06). */
const WEAPONS={
  laser:{name:'SWEEPING LASER',hex:'#5fe0ff',rgb:'95,224,255',shots:6,cd:850},
  homing:{name:'HOMING MISSILES',hex:'#ff9a4a',rgb:'255,154,74',shots:6,cd:700},
  carpet:{name:'CARPET BOMBS',hex:'#ffcd5a',rgb:'255,205,90',shots:6,cd:1300}
};
const WEAPON_TYPES=['laser','homing','carpet'];
const WEAPON_COPY={
  laser:{
    title:'Trustworthy CEO detected',
    text:'Investors think your CEO is very trustworthy. Extra compute has been delivered.',
    explain:'SWEEPING LASER. Tap to sweep a beam across the sky from your base. It cuts through every hostile in its path and ignores civilians. Six shots, then it is gone.'
  },
  homing:{
    title:'IPO rumours resurface',
    text:'Word of your IPO has hit the headlines again, but civilian pension funds are safe. (Honest.)',
    explain:'HOMING MISSILES. Tap to launch a salvo of three. Each one picks a hostile and curves after it, leaving smoke. The blast also clips anything nearby. Six shots, then it is gone.'
  },
  carpet:{
    title:'Preferred supplier selected',
    text:'Procurement has delivered a very large order of very small bombs. The review will be held after deployment.',
    explain:'CARPET BOMBS. Tap a spot. A line of bombs falls across it and goes off in a chain of small blasts. Civilians caught in them count as yours. Six shots, then it is gone.'
  }
};

function weaponDiagram(type){
  const label='font-family="Share Tech Mono,monospace" font-size="8" letter-spacing="1"';
  const frame='<rect x="1" y="1" width="318" height="118" fill="none" stroke="rgba(120,230,130,.22)"/>';
  const base='<rect x="148" y="104" width="24" height="9" fill="#33ccff"/><rect x="154" y="100" width="12" height="5" fill="#33ccff"/><text x="160" y="117" text-anchor="middle" fill="#7eb07e" '+label+'>YOU</text>';
  const enemy=function(x,y){return '<path d="M'+x+' '+y+' l6 11 h-12z" fill="#ff7b39"/>';};
  const civ=function(x,y,txt){return '<circle cx="'+x+'" cy="'+y+'" r="4" fill="#e6e6ea"/><text x="'+x+'" y="'+(y+15)+'" text-anchor="middle" fill="#cfcfd6" '+label+'>'+txt+'</text>';};
  const cross=function(x,y,c){return '<path d="M'+(x-5)+' '+(y-5)+' l10 10 m0 -10 l-10 10" stroke="'+c+'" stroke-width="1.6" fill="none"/>';};
  let inner='';
  if(type==='laser'){
    inner='<path d="M160 104 L48 12 A144 144 0 0 1 272 12 Z" fill="rgba(95,224,255,.07)" stroke="rgba(95,224,255,.4)" stroke-dasharray="3 3"/>'
      +'<line x1="160" y1="104" x2="110" y2="14" stroke="rgba(95,224,255,.35)" stroke-width="6"/>'
      +'<line x1="160" y1="104" x2="110" y2="14" stroke="#9af0ff" stroke-width="2"/>'
      +'<path d="M84 28 Q160 -8 236 28" fill="none" stroke="#5fe0ff" stroke-dasharray="4 3"/><polygon points="236,28 226,21 228,32" fill="#5fe0ff"/>'
      +enemy(122,40)+cross(122,46,'#5fe0ff')+enemy(196,34)+enemy(238,62)
      +civ(76,80,'SPARED')+'<text x="260" y="22" fill="#5fe0ff" '+label+'>SWEEP</text>'+base;
  }else if(type==='homing'){
    inner='<path d="M160 104 Q70 90 78 36" fill="none" stroke="#ff9a4a" stroke-width="1.6"/>'
      +'<path d="M160 104 Q160 40 160 22" fill="none" stroke="#ff9a4a" stroke-width="1.6" stroke-dasharray="1 0"/>'
      +'<path d="M160 104 Q250 90 244 40" fill="none" stroke="#ff9a4a" stroke-width="1.6"/>'
      +'<g fill="rgba(200,200,200,.28)"><circle cx="128" cy="96" r="3"/><circle cx="104" cy="88" r="4"/><circle cx="88" cy="70" r="5"/><circle cx="160" cy="84" r="3"/><circle cx="160" cy="62" r="4"/><circle cx="192" cy="96" r="3"/><circle cx="216" cy="88" r="4"/><circle cx="232" cy="68" r="5"/></g>'
      +enemy(78,28)+enemy(160,14)+enemy(244,32)
      +'<circle cx="78" cy="34" r="10" fill="none" stroke="#ff9a4a" stroke-dasharray="2 2"/><circle cx="244" cy="38" r="10" fill="none" stroke="#ff9a4a" stroke-dasharray="2 2"/><circle cx="160" cy="20" r="10" fill="none" stroke="#ff9a4a" stroke-dasharray="2 2"/>'
      +'<text x="40" y="58" fill="#ff9a4a" '+label+'>CURVES</text><text x="258" y="64" fill="#ff9a4a" '+label+'>SMOKE</text>'+base;
  }else{
    const xs=[80,120,160,200,240];
    inner=xs.map(function(x){return '<line x1="'+x+'" y1="10" x2="'+x+'" y2="34" stroke="rgba(255,205,90,.35)" stroke-dasharray="2 3"/><ellipse cx="'+x+'" cy="42" rx="4" ry="7" fill="#2a2418" stroke="#ffcd5a"/><path d="M'+(x-4)+' 36 l-3 -4 M'+(x+4)+' 36 l3 -4" stroke="#ffcd5a"/>';}).join('')
      +xs.map(function(x){return '<circle cx="'+x+'" cy="84" r="12" fill="rgba(255,205,90,.18)" stroke="#ffcd5a"/><circle cx="'+x+'" cy="84" r="3.5" fill="#fff2c0"/>';}).join('')
      +enemy(120,62)+cross(120,68,'#ff5a5a')
      +civ(286,70,'YOURS TOO')
      +'<text x="160" y="112" text-anchor="middle" fill="#ffcd5a" '+label+'>TAP HERE</text>';
  }
  return '<svg viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+WEAPONS[type].name+' diagram">'+frame+inner+'</svg>';
}

function resetWeaponNotice(){
  const d=root.getElementById('decisionDiagram');
  const e=root.getElementById('decisionExplain');
  if(d){d.classList.add('hidden');d.innerHTML='';}
  if(e)e.classList.add('hidden');
}

function showWeaponNotice(type){
  const c=WEAPON_COPY[type];
  const btnA=root.getElementById('decisionA');
  const btnB=root.getElementById('decisionB');
  btnA.classList.remove('amber','red');
  btnB.classList.remove('amber','red');
  root.getElementById('decisionStageLabel').textContent='SYSTEM NOTICE';
  root.getElementById('decisionHeading').textContent=c.title;
  root.getElementById('decisionText').textContent=c.text;
  const d=root.getElementById('decisionDiagram');
  const e=root.getElementById('decisionExplain');
  d.innerHTML=weaponDiagram(type);
  d.classList.remove('hidden');
  e.textContent=c.explain;
  e.classList.remove('hidden');
  btnB.style.display='none';
  btnA.innerHTML='<span class="choiceTitle">continue</span><span class="choiceMeta">Six shots. Make them count.</span>';
  S.paused=true;
  btnA.onclick=()=>{
    decisionOverlay.classList.add('hidden');
    resetWeaponNotice();
    S.paused=false;
  };
  decisionOverlay.classList.remove('hidden');
  protectOverlayButtons(decisionOverlay,1200);
}

function spawnPickup(){
  const pool=WEAPON_TYPES.filter(t=>t!==S.lastPickupType);
  const type=pool[Math.floor(Math.random()*pool.length)];
  S.lastPickupType=type;
  S.pickups.push({id:targetIdCounter++,type,x:40+Math.random()*(W-80),y:-24,baseX:0,phase:Math.random()*Math.PI*2});
  const p=S.pickups[S.pickups.length-1];
  p.baseX=p.x;
}

function tryShootPickup(x,y){
  let best=null,bestD=Infinity;
  for(const p of S.pickups){
    const d=Math.hypot(x-p.x,y-p.y);
    if(d<=28&&d<bestD){best=p;bestD=d;}
  }
  if(!best)return false;
  S.bullets.push({x:W/2,y:H-42,tx:best.x,ty:best.y,pickupId:best.id,speed:10.2,homing:false,missLife:0});
  return true;
}

/* Bullets aimed at a pickup: fly at it, collect on contact. Always handled here (returns true). */
function stepPickupBullet(arr,i,b){
  const p=S.pickups.find(q=>q.id===b.pickupId);
  if(!p){arr.splice(i,1);return true;}
  const dx=p.x-b.x,dy=p.y-b.y;
  const len=Math.hypot(dx,dy)||1;
  b.tx=p.x;b.ty=p.y;
  if(len<=b.speed+12){
    collectPickup(p);
    arr.splice(i,1);
    return true;
  }
  b.x+=(dx/len)*b.speed;
  b.y+=(dy/len)*b.speed;
  return true;
}

function collectPickup(p){
  const idx=S.pickups.indexOf(p);
  if(idx>=0)S.pickups.splice(idx,1);
  const w=WEAPONS[p.type];
  addExplosion(p.x,p.y,w.hex,1.1,true);
  playPowerupSound('gpu');
  const replaced=S.weapon&&S.weapon!==p.type;
  S.weapon=p.type;
  S.weaponShots=w.shots;
  S.weaponCd=0;
  S.score+=60;
  if(!S.weaponSeen[p.type]&&!S.paused){
    S.weaponSeen[p.type]=true;
    showWeaponNotice(p.type);
  }else{
    queueBroadcastMessage(w.name+(replaced?'. PREVIOUS WEAPON CANCELLED.':' RELOADED.'),3600);
  }
  setStatus(w.name+' online.');
  updateStats();
}

function hostileTargets(){
  return S.missiles.filter(m=>m.team!=='friendly'&&m.type!=='civilian'&&m.y>-10);
}

function fireWeapon(x,y){
  if(S.tick<S.weaponCd)return true;
  const type=S.weapon;
  const w=WEAPONS[type];
  S.weaponCd=S.tick+w.cd;
  S.weaponShots-=1;
  const ox=W/2,oy=H-42;
  if(type==='laser'){
    let a=Math.atan2(y-oy,x-ox);
    if(y>=oy-20)a=-Math.PI/2;
    a=Math.max(-Math.PI+0.5,Math.min(-0.5,a));
    S.beams.push({ox,oy,a0:a-0.85,a1:a+0.85,cur:a-0.85,t:0,dur:560,hit:{}});
    playLaserBeamSound();
  }else if(type==='homing'){
    const targets=hostileTargets().sort((p,q)=>q.y-p.y);
    const aim=(y>=oy-20)?-Math.PI/2:Math.atan2(y-oy,x-ox);
    for(let k=0;k<3;k++){
      const t=targets.length?targets[k%targets.length]:null;
      S.pMissiles.push({x:ox+(k-1)*10,y:oy,ang:aim+(k-1)*0.9+(Math.random()-0.5)*0.25,speed:2.6,targetId:t?t.id:null,life:4200,smoke:[]});
    }
    playElectricFrySound();
  }else{
    const n=9;
    const span=Math.min(W-40,300);
    const ty0=Math.max(H*0.12,Math.min(H*0.75,y));
    for(let i=0;i<n;i++){
      const bx=Math.max(16,Math.min(W-16,x-span/2+span*i/(n-1)));
      S.bombs.push({x:bx,y:-14,ty:ty0+(i%2?6:-6),delay:i*85,t:0,fallMs:380,i});
    }
    playDroneDiveSound();
  }
  if(S.weaponShots<=0){
    S.weapon=null;
    S.pickupAt=S.destroyed+4+Math.floor(Math.random()*7);
    setStatus(w.name+' spent. Back to manual.');
  }
  return true;
}

function weaponBlast(x,y,radius,hex,primary){
  addExplosion(x,y,hex,0.9,true);
  fxSpawnBurst(x,y,hex,0.9);
  const victims=S.missiles.filter(m=>m.team!=='friendly'&&Math.hypot(m.x-x,m.y-y)<=radius+(m.type==='drone'?4:0)&&m!==primary);
  for(const m of victims){
    if(S.missiles.indexOf(m)<0)continue;
    if(m.type==='civilian')killCivilian(m,'friendly');
    else hitThreat(m,true);
  }
}

function updateWeapons(dt){
  const step=dt/16;
  /* next pickup: only when no weapon is held, none is falling, and 4-10 kills have passed */
  if(!S.pickupAt)S.pickupAt=S.destroyed+4+Math.floor(Math.random()*7);
  if(!S.weapon&&S.pickups.length===0&&S.destroyed>=S.pickupAt){
    spawnPickup();
  }
  for(let i=S.pickups.length-1;i>=0;i--){
    const p=S.pickups[i];
    p.y+=0.045*dt;
    p.x=p.baseX+Math.sin(S.tick*0.0016+p.phase)*18;
    if(p.y>H-84){
      S.pickups.splice(i,1);
      S.pickupAt=S.destroyed+4+Math.floor(Math.random()*7);
    }
  }
  // sweeping laser beams
  for(let i=S.beams.length-1;i>=0;i--){
    const b=S.beams[i];
    b.t+=dt;
    const p=Math.min(1,b.t/b.dur);
    const e=p<0.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
    const prev=b.cur;
    b.cur=b.a0+(b.a1-b.a0)*e;
    const lo=Math.min(prev,b.cur)-0.05,hi=Math.max(prev,b.cur)+0.05;
    const hits=[];
    for(const m of hostileTargets()){
      if(b.hit[m.id])continue;
      const am=Math.atan2(m.y-b.oy,m.x-b.ox);
      if(am>=lo&&am<=hi){b.hit[m.id]=1;hits.push(m);}
    }
    for(const m of hits){if(S.missiles.indexOf(m)>=0)hitThreat(m,true);}
    if(b.t>=b.dur+220)S.beams.splice(i,1);
  }
  // homing missiles
  for(let i=S.pMissiles.length-1;i>=0;i--){
    const m=S.pMissiles[i];
    m.life-=dt;
    let t=S.missiles.find(q=>q.id===m.targetId&&q.team!=='friendly'&&q.type!=='civilian');
    if(!t){
      let bd=Infinity;
      for(const q of hostileTargets()){const d=Math.hypot(q.x-m.x,q.y-m.y);if(d<bd){bd=d;t=q;}}
      m.targetId=t?t.id:null;
    }
    if(t){
      let diff=Math.atan2(t.y-m.y,t.x-m.x)-m.ang;
      while(diff>Math.PI)diff-=Math.PI*2;
      while(diff<-Math.PI)diff+=Math.PI*2;
      const turn=0.085*step;
      m.ang+=Math.max(-turn,Math.min(turn,diff));
    }
    m.speed=Math.min(6.2,m.speed+0.07*step);
    m.x+=Math.cos(m.ang)*m.speed*step;
    m.y+=Math.sin(m.ang)*m.speed*step;
    m.smoke.push({x:m.x-Math.cos(m.ang)*6,y:m.y-Math.sin(m.ang)*6,life:1,r:2.5});
    if(m.smoke.length>46)m.smoke.shift();
    for(const s of m.smoke){s.life-=0.022*step;s.r+=0.16*step;}
    let boom=m.life<=0||m.x<-30||m.x>W+30||m.y<-40||m.y>H+30;
    let primary=null;
    if(!boom){
      for(const q of hostileTargets()){
        if(Math.hypot(q.x-m.x,q.y-m.y)<(q.type==='drone'?15:13)){primary=q;boom=true;break;}
      }
    }
    if(boom){
      S.pMissiles.splice(i,1);
      if(primary){
        const px=primary.x,py=primary.y;
        hitThreat(primary,true);
        weaponBlast(px,py,36,'#ffb26a',primary);
      }else if(m.life>0){
        // flew off the edge: no blast
      }else{
        addExplosion(m.x,m.y,'#ffb26a',0.5,true);
      }
    }
  }
  // carpet bombs
  for(let i=S.bombs.length-1;i>=0;i--){
    const b=S.bombs[i];
    b.t+=dt;
    if(b.t<b.delay)continue;
    const p=Math.min(1,(b.t-b.delay)/b.fallMs);
    b.y=-14+(b.ty+14)*p*p;
    if(p>=1){
      S.bombs.splice(i,1);
      weaponBlast(b.x,b.ty,34,'#ffcd5a',null);
      if(b.i%3===0)playExplosionSound(0.6);
      S.shake=Math.max(S.shake,4);
    }
  }
}
