/* Weapon drawing: falling pickup icons, laser beams, homing missiles with smoke, carpet bombs, and the active-weapon badge. */
function drawPickupIcon(p){
  const w=WEAPONS[p.type];
  const pulse=0.5+0.5*Math.sin(S.tick*0.006+p.phase);
  const fade=Math.max(0.15,Math.min(1,(H-84-p.y)/60));
  ctx.save();
  ctx.translate(p.x,p.y);
  ctx.globalAlpha=fade;
  fxGlow(0,0,38,w.rgb,0.35+0.2*pulse);
  ctx.fillStyle='rgba(6,14,10,0.82)';
  ctx.beginPath();ctx.arc(0,0,20,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='rgba('+w.rgb+','+(0.6+0.4*pulse)+')';
  ctx.lineWidth=1.6;
  ctx.beginPath();ctx.arc(0,0,20,0,Math.PI*2);ctx.stroke();
  ctx.save();
  ctx.rotate(S.tick*0.0012);
  ctx.setLineDash([4,6]);
  ctx.strokeStyle='rgba('+w.rgb+',0.5)';
  ctx.lineWidth=1;
  ctx.beginPath();ctx.arc(0,0,25,0,Math.PI*2);ctx.stroke();
  ctx.restore();
  ctx.lineCap='round';
  if(p.type==='laser'){
    ctx.fillStyle=w.hex;
    ctx.fillRect(-6,9,12,4);
    ctx.fillRect(-3,6,6,4);
    ctx.strokeStyle='rgba('+w.rgb+',0.35)';
    ctx.lineWidth=4;
    [-0.7,0,0.7].forEach(function(a){ctx.beginPath();ctx.moveTo(0,6);ctx.lineTo(Math.sin(a)*16,6-Math.cos(a)*16);ctx.stroke();});
    ctx.strokeStyle='#e8fdff';
    ctx.lineWidth=1.4;
    [-0.7,0,0.7].forEach(function(a){ctx.beginPath();ctx.moveTo(0,6);ctx.lineTo(Math.sin(a)*16,6-Math.cos(a)*16);ctx.stroke();});
  }else if(p.type==='homing'){
    ctx.strokeStyle='rgba(210,210,210,0.55)';
    ctx.lineWidth=2;
    ctx.setLineDash([2,3]);
    ctx.beginPath();ctx.moveTo(-13,10);ctx.quadraticCurveTo(-12,-2,-2,-4);ctx.stroke();
    ctx.setLineDash([]);
    ctx.save();
    ctx.translate(4,-5);
    ctx.rotate(-0.55);
    ctx.fillStyle=w.hex;
    ctx.fillRect(-3,-9,6,14);
    ctx.fillStyle='#fff1dc';
    ctx.beginPath();ctx.moveTo(-3,-9);ctx.lineTo(0,-15);ctx.lineTo(3,-9);ctx.closePath();ctx.fill();
    ctx.fillStyle='#b8431c';
    ctx.fillRect(-6,1,3,5);ctx.fillRect(3,1,3,5);
    ctx.restore();
  }else{
    [-8,0,8].forEach(function(dx,i){
      const dy=i===1?-3:2;
      ctx.fillStyle='#2a2418';
      ctx.strokeStyle=w.hex;
      ctx.lineWidth=1.2;
      ctx.beginPath();ctx.ellipse(dx,dy+2,3.4,6,0,0,Math.PI*2);ctx.fill();ctx.stroke();
      ctx.fillStyle=w.hex;
      ctx.fillRect(dx-3,dy-6,6,2.5);
    });
  }
  ctx.restore();
}

function drawBeams(){
  for(const b of S.beams){
    const len=Math.hypot(W,H)*1.1;
    const fade=b.t>b.dur?Math.max(0,1-(b.t-b.dur)/220):1;
    const lines=[[b.cur,1],[b.cur-0.04*Math.sign(b.a1-b.a0),0.5],[b.cur-0.09*Math.sign(b.a1-b.a0),0.28],[b.cur-0.15*Math.sign(b.a1-b.a0),0.14]];
    ctx.save();
    ctx.globalCompositeOperation='lighter';
    ctx.lineCap='round';
    for(const l of lines){
      const a=l[0],k=l[1]*fade;
      const ex=b.ox+Math.cos(a)*len,ey=b.oy+Math.sin(a)*len;
      ctx.strokeStyle='rgba(95,224,255,'+(0.25*k)+')';
      ctx.lineWidth=9;
      ctx.beginPath();ctx.moveTo(b.ox,b.oy);ctx.lineTo(ex,ey);ctx.stroke();
      ctx.strokeStyle='rgba(210,250,255,'+(0.95*k)+')';
      ctx.lineWidth=1.8*k+0.4;
      ctx.beginPath();ctx.moveTo(b.ox,b.oy);ctx.lineTo(ex,ey);ctx.stroke();
    }
    ctx.restore();
    fxGlow(b.ox,b.oy,26,'95,224,255',0.6*fade);
  }
}

function drawPlayerMissiles(){
  for(const m of S.pMissiles){
    ctx.save();
    for(const s of m.smoke){
      if(s.life<=0)continue;
      ctx.globalAlpha=Math.min(0.45,s.life*0.5);
      ctx.fillStyle='rgb(150,150,150)';
      ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
    fxGlow(m.x-Math.cos(m.ang)*5,m.y-Math.sin(m.ang)*5,16,'255,170,80',0.6);
    ctx.save();
    ctx.translate(m.x,m.y);
    ctx.rotate(m.ang);
    ctx.fillStyle='#e9e2d6';
    ctx.fillRect(-7,-2.2,12,4.4);
    ctx.fillStyle='#ff6a2a';
    ctx.beginPath();ctx.moveTo(5,-2.2);ctx.lineTo(10,0);ctx.lineTo(5,2.2);ctx.closePath();ctx.fill();
    ctx.fillStyle='#b8431c';
    ctx.fillRect(-8,-4.5,3,3);ctx.fillRect(-8,1.5,3,3);
    ctx.restore();
  }
}

function drawBombs(){
  for(const b of S.bombs){
    if(b.t<b.delay)continue;
    fxGlow(b.x,b.y,12,'255,205,90',0.4);
    ctx.save();
    ctx.translate(b.x,b.y);
    ctx.fillStyle='#2a2418';
    ctx.strokeStyle='#ffcd5a';
    ctx.lineWidth=1.2;
    ctx.beginPath();ctx.ellipse(0,0,3.6,6.5,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle='#ffcd5a';
    ctx.fillRect(-3.4,-9,6.8,3);
    ctx.fillStyle='#ff5a3a';
    ctx.fillRect(-1,5,2,2);
    ctx.restore();
  }
}

function drawWeaponBadge(){
  if(!S.weapon)return;
  const w=WEAPONS[S.weapon];
  const left=Math.max(0,S.weaponUntil-S.tick);
  const frac=Math.min(1,left/w.ms);
  const x=16,y=16,bw=132,bh=24;
  const warn=left<4000&&Math.floor(S.tick/250)%2===0;
  ctx.save();
  ctx.fillStyle='rgba(6,12,10,0.82)';
  ctx.fillRect(x,y,bw,bh);
  ctx.strokeStyle='rgba('+w.rgb+','+(warn?0.35:0.8)+')';
  ctx.lineWidth=1;
  ctx.strokeRect(x+0.5,y+0.5,bw-1,bh-1);
  ctx.fillStyle='rgba('+w.rgb+',0.9)';
  ctx.fillRect(x+4,y+bh-5,(bw-8)*frac,2);
  ctx.fillStyle='rgba('+w.rgb+','+(warn?0.5:1)+')';
  ctx.font='10px '+FX_HUD;
  ctx.textAlign='left';
  ctx.textBaseline='middle';
  ctx.fillText(w.name,x+7,y+10);
  ctx.textAlign='right';
  ctx.fillText(Math.ceil(left/1000)+'s',x+bw-6,y+10);
  ctx.restore();
}

function drawWeapons(){
  for(const p of S.pickups)drawPickupIcon(p);
  drawBeams();
  drawPlayerMissiles();
  drawBombs();
  drawWeaponBadge();
}
