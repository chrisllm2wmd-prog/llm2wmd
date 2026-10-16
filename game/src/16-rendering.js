/* Rendering: everything drawn on the canvas.
   Style: dark military phosphor display. Glow comes from cached radial sprites drawn
   additively ('lighter'), not shadowBlur, so it stays cheap on phones. */
const FX_HUD="'Share Tech Mono','Courier New',monospace";
const FX_TITLE="'Barlow Condensed','Arial Narrow',Arial,sans-serif";
const fxParticles=[];
const fxSprites={};
let fxBg=null;
let fxBgKey='';
let fxLastT=0;

function fxRgb(hex){const n=parseInt(String(hex).slice(1),16);return((n>>16)&255)+','+((n>>8)&255)+','+(n&255);}
function fxSprite(rgb){
  if(fxSprites[rgb])return fxSprites[rgb];
  const c=document.createElement('canvas');
  c.width=c.height=64;
  const g=c.getContext('2d');
  const gr=g.createRadialGradient(32,32,0,32,32,32);
  gr.addColorStop(0,'rgba('+rgb+',1)');
  gr.addColorStop(0.35,'rgba('+rgb+',0.38)');
  gr.addColorStop(1,'rgba('+rgb+',0)');
  g.fillStyle=gr;
  g.fillRect(0,0,64,64);
  fxSprites[rgb]=c;
  return c;
}
function fxGlow(x,y,r,rgb,a){
  ctx.save();
  ctx.globalCompositeOperation='lighter';
  ctx.globalAlpha=a;
  ctx.drawImage(fxSprite(rgb),x-r,y-r,r*2,r*2);
  ctx.restore();
}
function fxSpawnBurst(x,y,color,power){
  const rgb=fxRgb(color);
  const n=Math.round(10+power*16);
  for(let i=0;i<n&&fxParticles.length<420;i++){
    const a=Math.random()*Math.PI*2;
    const sp=(0.5+Math.random()*2.8)*Math.sqrt(power);
    fxParticles.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-0.4,life:1,decay:0.016+Math.random()*0.02,size:0.8+Math.random()*1.8,rgb});
  }
}
function fxStepParticles(dt){
  const f=dt/16;
  for(let i=fxParticles.length-1;i>=0;i--){
    const p=fxParticles[i];
    p.x+=p.vx*f;
    p.y+=p.vy*f;
    p.vy+=0.05*f;
    p.vx*=Math.pow(0.985,f);
    p.life-=p.decay*f;
    if(p.life<=0)fxParticles.splice(i,1);
  }
}
function fxDrawParticles(){
  if(!fxParticles.length)return;
  ctx.save();
  ctx.globalCompositeOperation='lighter';
  ctx.lineCap='round';
  for(const p of fxParticles){
    ctx.globalAlpha=Math.max(0,p.life);
    ctx.strokeStyle='rgb('+p.rgb+')';
    ctx.lineWidth=p.size;
    ctx.beginPath();
    ctx.moveTo(p.x-p.vx*2.4,p.y-p.vy*2.4);
    ctx.lineTo(p.x,p.y);
    ctx.stroke();
  }
  ctx.restore();
}

function wrapBannerLines(msg,font,maxWidth,maxLines){
  ctx.save();
  ctx.font=font;
  const words=String(msg||'').split(/\s+/).filter(Boolean);
  const lines=[];
  let line='';
  for(const word of words){
    const test=line?line+' '+word:word;
    if(ctx.measureText(test).width<=maxWidth||!line){line=test;}
    else{lines.push(line);line=word;if(lines.length>=maxLines-1)break;}
  }
  if(line&&lines.length<maxLines)lines.push(line);
  const consumed=lines.join(' ').split(/\s+/).filter(Boolean).length;
  if(consumed<words.length&&lines.length){
    let last=lines[lines.length-1].replace(/…$/,'');
    while(last&&ctx.measureText(last+'…').width>maxWidth)last=last.slice(0,-1);
    lines[lines.length-1]=(last||'').trimEnd()+'…';
  }
  ctx.restore();
  return lines;
}

function drawWaveBanner(){
  const pulse=0.08+((Math.sin(S.tick*0.0042)+1)*0.30);
  const broadcast=getBroadcastMessage();
  const title=broadcast||currentWaveLabel();
  const stageLine=S.reactorBuilt?'NUCLEAR DEFENCE STAGE '+currentPlayableStage():'STAGE '+currentPlayableStage();
  const subtitle=broadcast?(S.reactorBuilt?stageLine:stageLine+' / '+currentWaveLabel()):stageLine;
  const titleSize=broadcast?Math.max(20,Math.min(30,W*0.058)):(S.reactorBuilt?34:30);
  const titleFont='700 '+titleSize+'px '+FX_TITLE;
  const subFont='12px '+FX_HUD;
  const maxWidth=W*0.78;
  const lines=broadcast?wrapBannerLines(title,titleFont,maxWidth,3):[title];
  const lineHeight=Math.round(titleSize*1.08);
  const titleY=H*0.16;
  const blockHeight=lineHeight*lines.length;
  const alpha=broadcast?Math.min(0.95,0.3+pulse):Math.min(0.9,0.3+pulse*0.8);
  ctx.save();
  ctx.textAlign='center';
  ctx.textBaseline='middle';
  ctx.font=titleFont;
  if('letterSpacing' in ctx)ctx.letterSpacing='2px';
  lines.forEach((line,idx)=>{
    const y=titleY+idx*lineHeight;
    ctx.fillStyle='rgba(255,70,60,'+(alpha*0.28)+')';
    ctx.fillText(line,W/2+1.5,y+1.5,maxWidth);
    ctx.fillStyle='rgba(255,120,100,'+alpha+')';
    ctx.fillText(line,W/2,y,maxWidth);
  });
  if('letterSpacing' in ctx)ctx.letterSpacing='3px';
  ctx.font=subFont;
  ctx.fillStyle=S.reactorBuilt?'rgba(255,200,170,0.75)':'rgba(170,255,185,0.7)';
  const subY=titleY+blockHeight+(broadcast?8:2);
  ctx.fillText(subtitle,W/2,subY,maxWidth);
  const ruleW=Math.min(120,W*0.3);
  const ruleY=subY+13;
  const rule=ctx.createLinearGradient(W/2-ruleW,0,W/2+ruleW,0);
  rule.addColorStop(0,'rgba(255,110,90,0)');
  rule.addColorStop(0.5,'rgba(255,110,90,0.55)');
  rule.addColorStop(1,'rgba(255,110,90,0)');
  ctx.fillStyle=rule;
  ctx.fillRect(W/2-ruleW,ruleY,ruleW*2,1);
  ctx.restore();
}

function drawReactor(){
  if(!S.reactorBuilt)return;
  const core=getReactorPosition();
  const pulse=0.75+(Math.sin(S.tick*0.008)+1)*0.12;
  fxGlow(core.x,core.y-18,70,'255,170,70',0.35*pulse);
  ctx.save();
  const body=ctx.createLinearGradient(0,core.y-46,0,core.y+8);
  body.addColorStop(0,'#3a2610');
  body.addColorStop(1,'#1a1006');
  ctx.fillStyle=body;
  ctx.fillRect(core.x-34,core.y-46,68,54);
  ctx.strokeStyle='rgba(255,200,120,0.7)';
  ctx.lineWidth=1.5;
  ctx.strokeRect(core.x-34,core.y-46,68,54);
  ctx.strokeStyle='rgba(255,200,120,0.28)';
  ctx.beginPath();
  ctx.arc(core.x,core.y-18,17+Math.sin(S.tick*0.006)*1.5,0,Math.PI*2);
  ctx.stroke();
  const orb=ctx.createRadialGradient(core.x,core.y-18,0,core.x,core.y-18,11);
  orb.addColorStop(0,'rgba(255,250,230,'+pulse+')');
  orb.addColorStop(1,'rgba(255,170,60,'+(pulse*0.55)+')');
  ctx.fillStyle=orb;
  ctx.beginPath();
  ctx.arc(core.x,core.y-18,10,0,Math.PI*2);
  ctx.fill();
  ctx.fillStyle='#ffb347';
  ctx.fillRect(core.x-18,core.y-4,36,10);
  ctx.fillStyle='rgba(255,255,255,0.35)';
  ctx.fillRect(core.x-18,core.y-4,36,2);
  ctx.restore();
}

function drawReactorHealth(){
  if(!S.reactorBuilt||!S.reactorDamaged)return;
  const barW=Math.min(220,W*0.56);
  const x=(W-barW)/2;
  const y=18;
  const hp=Math.max(0,S.reactorHealth)/100;
  const low=S.reactorHealth<=45;
  ctx.save();
  ctx.fillStyle='rgba(8,8,8,0.82)';
  ctx.fillRect(x,y,barW,12);
  const fill=ctx.createLinearGradient(0,y,0,y+12);
  fill.addColorStop(0,low?'#ff7a6a':'#ffd27a');
  fill.addColorStop(1,low?'#c01818':'#e08a20');
  ctx.fillStyle=fill;
  ctx.fillRect(x+1,y+1,(barW-2)*hp,10);
  ctx.strokeStyle=low?'rgba(255,100,90,0.8)':'rgba(255,200,130,0.7)';
  ctx.lineWidth=1;
  ctx.strokeRect(x+0.5,y+0.5,barW-1,11);
  ctx.fillStyle='#fff4dc';
  ctx.font='10px '+FX_HUD;
  ctx.textAlign='center';
  ctx.textBaseline='middle';
  ctx.fillText('CORE '+Math.round(S.reactorHealth)+'%',W/2,y+6.5);
  ctx.restore();
}

function fxBackground(){
  const dpr=Math.min(window.devicePixelRatio||1,2);
  const key=W+'x'+H+'@'+dpr;
  if(fxBg&&fxBgKey===key)return fxBg;
  const c=document.createElement('canvas');
  c.width=Math.ceil(W*dpr);
  c.height=Math.ceil(H*dpr);
  const g=c.getContext('2d');
  g.scale(dpr,dpr);
  const sky=g.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#02060a');
  sky.addColorStop(0.6,'#041009');
  sky.addColorStop(1,'#0a1c0e');
  g.fillStyle=sky;
  g.fillRect(0,0,W,H);
  const horizon=g.createRadialGradient(W/2,H,0,W/2,H,H*0.75);
  horizon.addColorStop(0,'rgba(70,170,80,0.20)');
  horizon.addColorStop(1,'rgba(70,170,80,0)');
  g.fillStyle=horizon;
  g.fillRect(0,0,W,H);
  g.lineWidth=1;
  for(let x=0;x<=W;x+=32){
    g.strokeStyle=(x%128===0)?'rgba(70,170,80,0.16)':'rgba(70,170,80,0.06)';
    g.beginPath();g.moveTo(x+0.5,0);g.lineTo(x+0.5,H);g.stroke();
  }
  for(let y=0;y<=H;y+=32){
    g.strokeStyle=(y%128===0)?'rgba(70,170,80,0.16)':'rgba(70,170,80,0.06)';
    g.beginPath();g.moveTo(0,y+0.5);g.lineTo(W,y+0.5);g.stroke();
  }
  g.fillStyle='rgba(0,0,0,0.13)';
  for(let y=0;y<H;y+=3)g.fillRect(0,y,W,1);
  const vig=g.createRadialGradient(W/2,H*0.5,Math.min(W,H)*0.3,W/2,H*0.5,Math.max(W,H)*0.78);
  vig.addColorStop(0,'rgba(0,0,0,0)');
  vig.addColorStop(1,'rgba(0,0,0,0.62)');
  g.fillStyle=vig;
  g.fillRect(0,0,W,H);
  g.strokeStyle='rgba(120,230,130,0.3)';
  g.lineWidth=1.5;
  const k=16,m=6;
  [[m,m,1,1],[W-m,m,-1,1],[m,H-m,1,-1],[W-m,H-m,-1,-1]].forEach(function(p){
    g.beginPath();g.moveTo(p[0],p[1]+p[3]*k);g.lineTo(p[0],p[1]);g.lineTo(p[0]+p[2]*k,p[1]);g.stroke();
  });
  fxBg=c;
  fxBgKey=key;
  return c;
}

function drawGrid(){
  ctx.drawImage(fxBackground(),0,0,W,H);
  ctx.fillStyle='rgba(150,255,170,0.5)';
  for(let i=0;i<34;i++){
    const sp=0.006+(i%5)*0.003;
    const x=(i*97.31)%W;
    const y=((i*53.7)+S.tick*sp)%H;
    ctx.globalAlpha=0.08+((i*7)%5)*0.04;
    ctx.fillRect(x,y,1.4,1.4);
  }
  ctx.globalAlpha=1;
  const band=70;
  ctx.save();
  ctx.globalCompositeOperation='lighter';
  const sweep=ctx.createLinearGradient(0,S.scanY-band,0,S.scanY);
  sweep.addColorStop(0,'rgba(255,60,50,0)');
  sweep.addColorStop(1,'rgba(255,60,50,0.05)');
  ctx.fillStyle=sweep;
  ctx.fillRect(0,S.scanY-band,W,band);
  ctx.fillStyle='rgba(255,90,70,0.28)';
  ctx.fillRect(0,S.scanY,W,1.5);
  ctx.restore();
}

function drawCity(){
  const blocks=[[0,32,26],[32,18,22],[58,36,18],[80,22,22],[106,40,16],[126,23,22],[154,30,28],[188,18,20],[212,30,22],[238,36,20],[264,24,26],[296,32,18],[318,16,20],[342,28,22],[366,23,26],[396,34,18],[418,22,20],[442,30,28],[474,24,24],[504,34,22],[532,18,24],[560,26,20]];
  const scale=2;
  ctx.fillStyle='#071309';
  for(const[x0,h0,w0]of blocks){
    const x=x0*scale+14;
    if(x>W)break;
    ctx.fillRect(x,H-h0*scale*1.35,w0*scale,h0*scale*1.35);
  }
  for(const[x0,h0,w0]of blocks){
    const x=x0*scale;
    const h=h0*scale;
    const w=w0*scale;
    if(x>W)break;
    const fill=ctx.createLinearGradient(0,H-h,0,H);
    fill.addColorStop(0,'#112513');
    fill.addColorStop(1,'#0a160b');
    ctx.fillStyle=fill;
    ctx.fillRect(x,H-h,w,h);
    ctx.fillStyle='rgba(130,235,140,0.28)';
    ctx.fillRect(x,H-h,w,1);
    for(let wy=H-h+5;wy<H-8;wy+=10){
      for(let wx=x+4;wx<x+w-4;wx+=8){
        if(((wx*3+wy*7+Math.floor(S.tick*0.04))%3)>0){
          ctx.fillStyle=((wx+wy)%5===0)?'rgba(255,190,100,0.32)':'rgba(90,200,100,0.2)';
          ctx.fillRect(wx,wy,3,3);
        }
      }
    }
  }
  const ground=ctx.createLinearGradient(0,H-8,0,H);
  ground.addColorStop(0,'#14341a');
  ground.addColorStop(1,'#08140a');
  ctx.fillStyle=ground;
  ctx.fillRect(0,H-8,W,8);
  ctx.fillStyle='rgba(120,235,130,0.45)';
  ctx.fillRect(0,H-8,W,1);
}

function drawLockBox(m){
  if(!(m.playerLocks>0))return;
  const civ=m.type==='civilian';
  const r=(m.type==='drone'?17:15)+Math.sin(S.tick*0.016)*1.6;
  const k=6;
  ctx.save();
  ctx.strokeStyle=civ?'rgba(225,225,225,0.9)':'rgba(255,70,60,1)';
  ctx.lineWidth=1.6;
  [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(function(c){
    ctx.beginPath();
    ctx.moveTo(m.x+c[0]*r,m.y+c[1]*(r-k));
    ctx.lineTo(m.x+c[0]*r,m.y+c[1]*r);
    ctx.lineTo(m.x+c[0]*(r-k),m.y+c[1]*r);
    ctx.stroke();
  });
  ctx.restore();
}

function fxTrail(m,rgb,width){
  const t=m.trail;
  if(!t.length)return;
  ctx.save();
  ctx.globalCompositeOperation='lighter';
  ctx.lineCap='round';
  let px=t[0].x,py=t[0].y;
  for(let i=1;i<=t.length;i++){
    const p=i<t.length?t[i]:m;
    const f=i/t.length;
    ctx.strokeStyle='rgba('+rgb+','+(f*0.5)+')';
    ctx.lineWidth=width*f;
    ctx.beginPath();
    ctx.moveTo(px,py);
    ctx.lineTo(p.x,p.y);
    ctx.stroke();
    px=p.x;py=p.y;
  }
  ctx.restore();
}

function fxSayLabel(text,x,y,civilian){
  ctx.save();
  ctx.font='700 10px '+FX_HUD;
  ctx.textAlign='center';
  ctx.textBaseline='middle';
  const w=ctx.measureText(text).width+10;
  ctx.fillStyle='rgba(6,12,8,0.78)';
  ctx.fillRect(x-w/2,y-8,w,16);
  ctx.strokeStyle=civilian?'rgba(230,230,230,0.55)':'rgba(120,255,170,0.55)';
  ctx.lineWidth=1;
  ctx.strokeRect(x-w/2+0.5,y-7.5,w-1,15);
  ctx.fillStyle=civilian?'#f2f2f2':'#dcffe9';
  ctx.fillText(text,x,y+0.5);
  ctx.restore();
}

function drawThreat(m){
  if(m.type==='civilian'){
    fxTrail(m,'200,200,210',5);
    fxGlow(m.x,m.y,17,'210,220,255',0.22);
    if(m.parachuteOpen){
      ctx.strokeStyle='rgba(245,245,245,0.92)';
      ctx.lineWidth=1.2;
      ctx.beginPath();ctx.arc(m.x,m.y-11,11,Math.PI,0);ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(m.x-11,m.y-11);ctx.lineTo(m.x-2,m.y-1);
      ctx.moveTo(m.x,m.y-11);ctx.lineTo(m.x,m.y-1);
      ctx.moveTo(m.x+11,m.y-11);ctx.lineTo(m.x+2,m.y-1);
      ctx.stroke();
    }
    ctx.fillStyle='#e6e6ea';
    ctx.beginPath();ctx.arc(m.x,m.y,5,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#6a6a74';
    ctx.fillRect(m.x-2,m.y+4,4,8);
    ctx.fillRect(m.x-5,m.y+5,3,2);
    ctx.fillRect(m.x+2,m.y+5,3,2);
    if(m.sayText)fxSayLabel(m.sayText,m.x,m.y-22,true);
    return;
  }
  if(m.type==='drone'){
    const friendly=m.team==='friendly';
    const hex=friendly?'#39ff8a':'#ff3355';
    const rgb=friendly?'57,255,138':'255,51,85';
    fxTrail(m,rgb,5);
    fxGlow(m.x,m.y,24,rgb,0.4);
    const spin=Math.sin(S.tick*0.09+m.id);
    ctx.save();
    ctx.strokeStyle='rgba('+rgb+',0.85)';
    ctx.lineWidth=1.4;
    ctx.beginPath();
    ctx.moveTo(m.x-6,m.y-3);ctx.lineTo(m.x-13,m.y-9);
    ctx.moveTo(m.x+6,m.y-3);ctx.lineTo(m.x+13,m.y-9);
    ctx.stroke();
    ctx.fillStyle='rgba('+rgb+',0.35)';
    [-13,13].forEach(function(dx){
      ctx.beginPath();
      ctx.ellipse(m.x+dx,m.y-9,6.5*Math.abs(spin)+1.5,1.8,0,0,Math.PI*2);
      ctx.fill();
    });
    const body=ctx.createLinearGradient(m.x,m.y-8,m.x,m.y+8);
    body.addColorStop(0,friendly?'#b8ffd6':'#ff8aa0');
    body.addColorStop(1,hex);
    ctx.fillStyle=body;
    ctx.beginPath();
    ctx.moveTo(m.x,m.y-8);ctx.lineTo(m.x+6,m.y);ctx.lineTo(m.x,m.y+8);ctx.lineTo(m.x-6,m.y);
    ctx.closePath();ctx.fill();
    ctx.fillStyle=friendly?'#eafff2':'#fff';
    ctx.beginPath();ctx.arc(m.x,m.y,2.2,0,Math.PI*2);ctx.fill();
    if(!friendly){
      ctx.fillStyle='rgba(255,40,40,'+(0.5+0.5*Math.sin(S.tick*0.02+m.id))+')';
      ctx.beginPath();ctx.arc(m.x,m.y,1.4,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
    if((m.maxHp||1)>1){
      const pips=m.maxHp||3,pw=5,gap=2;
      const total=pips*pw+(pips-1)*gap;
      const bx=m.x-total/2,by=m.y-19;
      ctx.fillStyle='rgba(6,8,10,0.85)';
      ctx.fillRect(bx-2,by-2,total+4,7);
      for(let i=0;i<pips;i++){
        ctx.fillStyle=i<m.hp?(m.hp>=3?'#6dff8a':m.hp===2?'#ffd166':'#ff5a5a'):(friendly?'rgba(20,80,40,0.6)':'rgba(90,20,25,0.6)');
        ctx.fillRect(bx+i*(pw+gap),by,pw,3);
      }
    }
    if(friendly&&m.sayText)fxSayLabel(m.sayText,m.x,m.y-32,false);
    return;
  }
  fxTrail(m,'255,120,50',8);
  const flick=7+Math.random()*7;
  fxGlow(m.x,m.y-9,17,'255,140,60',0.55);
  fxGlow(m.x,m.y,26,'255,90,40',0.2);
  ctx.save();
  const flame=ctx.createLinearGradient(0,m.y-8-flick,0,m.y-6);
  flame.addColorStop(0,'rgba(255,200,90,0)');
  flame.addColorStop(1,'rgba(255,235,170,0.95)');
  ctx.fillStyle=flame;
  ctx.beginPath();
  ctx.moveTo(m.x-3,m.y-8);ctx.lineTo(m.x,m.y-8-flick);ctx.lineTo(m.x+3,m.y-8);
  ctx.closePath();ctx.fill();
  const hull=ctx.createLinearGradient(m.x-4,0,m.x+4,0);
  hull.addColorStop(0,'#7a2a10');
  hull.addColorStop(0.5,'#ff9a55');
  hull.addColorStop(1,'#7a2a10');
  ctx.fillStyle=hull;
  ctx.fillRect(m.x-4,m.y-8,8,15);
  ctx.fillStyle='#ff5a2a';
  ctx.beginPath();
  ctx.moveTo(m.x-4,m.y+7);ctx.lineTo(m.x,m.y+16);ctx.lineTo(m.x+4,m.y+7);
  ctx.closePath();ctx.fill();
  ctx.fillStyle='#b8431c';
  ctx.fillRect(m.x-7,m.y-10,3,6);
  ctx.fillRect(m.x+4,m.y-10,3,6);
  ctx.fillStyle='rgba(255,255,255,0.45)';
  ctx.fillRect(m.x-2,m.y-7,1,12);
  ctx.restore();
}

function drawBullets(arr,color){
  const rgb=fxRgb(color);
  for(const b of arr){
    if(b.kind==='friendlyLaser'){
      const ox=b.ox??b.x,oy=b.oy??b.y;
      const life=Math.max(0.18,Math.min(1,(b.beamLife||1)/4));
      ctx.save();
      ctx.globalCompositeOperation='lighter';
      ctx.lineCap='round';
      ctx.globalAlpha=life*0.35;
      ctx.strokeStyle='rgb('+rgb+')';
      ctx.lineWidth=7;
      ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(b.tx,b.ty);ctx.stroke();
      ctx.globalAlpha=life;
      ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(b.tx,b.ty);ctx.stroke();
      ctx.strokeStyle='rgba(235,255,245,0.95)';
      ctx.lineWidth=0.9;
      ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(b.tx,b.ty);ctx.stroke();
      ctx.restore();
      fxGlow(b.tx,b.ty,12,rgb,0.55*life);
      continue;
    }
    let dx=b.vx,dy=b.vy;
    if(dx===undefined||dy===undefined){dx=(b.tx??b.x)-b.x;dy=(b.ty??b.y)-b.y;}
    const len=Math.hypot(dx,dy)||1;
    const ux=dx/len,uy=dy/len;
    const tail=15;
    ctx.save();
    ctx.globalCompositeOperation='lighter';
    ctx.lineCap='round';
    const grad=ctx.createLinearGradient(b.x,b.y,b.x-ux*tail,b.y-uy*tail);
    grad.addColorStop(0,'rgba('+rgb+',0.95)');
    grad.addColorStop(1,'rgba('+rgb+',0)');
    ctx.strokeStyle=grad;
    ctx.lineWidth=2.6;
    ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x-ux*tail,b.y-uy*tail);ctx.stroke();
    ctx.restore();
    fxGlow(b.x,b.y,8,rgb,0.6);
    ctx.fillStyle='#fff';
    ctx.fillRect(b.x-1,b.y-1,2,2);
  }
}

function drawCrosshair(){
  if(primaryLock){
    const locked=S.missiles.find(m=>m.id===primaryLock.id);
    if(locked){pointerX=locked.x;pointerY=locked.y;}
    else{primaryLock=null;}
  }
  const x=pointerX,y=pointerY;
  const locked=!!primaryLock;
  const rgb=locked?'255,70,60':'255,95,80';
  ctx.save();
  ctx.strokeStyle='rgba('+rgb+',0.95)';
  ctx.fillStyle='rgba('+rgb+',0.95)';
  ctx.lineWidth=locked?1.8:1.3;
  if(locked){
    const r=17,rot=S.tick*0.004;
    for(let i=0;i<4;i++){
      const a=rot+i*Math.PI/2;
      ctx.beginPath();ctx.arc(x,y,r,a,a+Math.PI/4);ctx.stroke();
    }
  }else{
    ctx.beginPath();ctx.arc(x,y,11,0,Math.PI*2);ctx.stroke();
  }
  [[-1,0],[1,0],[0,-1],[0,1]].forEach(function(d){
    ctx.beginPath();
    ctx.moveTo(x+d[0]*(locked?21:15),y+d[1]*(locked?21:15));
    ctx.lineTo(x+d[0]*27,y+d[1]*27);
    ctx.stroke();
  });
  ctx.beginPath();ctx.arc(x,y,1.5,0,Math.PI*2);ctx.fill();
  if(locked){
    ctx.font='700 11px '+FX_HUD;
    ctx.textAlign='left';
    ctx.textBaseline='middle';
    ctx.fillText('LOCK',x+24,y-20);
  }
  ctx.restore();
}

function draw(){
  const now=performance.now();
  const frameDt=fxLastT?Math.min(50,now-fxLastT):16;
  fxLastT=now;
  if(!S.paused)fxStepParticles(frameDt);
  ctx.save();
  if(S.shake>0){
    ctx.translate((Math.random()-0.5)*S.shake,(Math.random()-0.5)*S.shake);
    S.shake*=0.84;
  }
  drawGrid();
  drawWaveBanner();
  if(S.strikeWave){
    ctx.save();
    const sw=ctx.createLinearGradient(0,S.strikeWave.y,0,S.strikeWave.y+90);
    sw.addColorStop(0,'rgba(255,255,255,0.55)');
    sw.addColorStop(0.12,'rgba(255,255,255,0.2)');
    sw.addColorStop(1,'rgba(255,255,255,0.16)');
    ctx.fillStyle=sw;
    ctx.fillRect(0,S.strikeWave.y,W,H-S.strikeWave.y+30);
    ctx.restore();
  }
  for(const e of S.explosions){
    const rgb=fxRgb(e.color);
    const a=Math.max(0,e.life);
    fxGlow(e.x,e.y,e.r*2.2+10,rgb,a*0.7);
    ctx.save();
    ctx.globalCompositeOperation='lighter';
    ctx.globalAlpha=a;
    ctx.strokeStyle='rgb('+rgb+')';
    ctx.lineWidth=2.2;
    ctx.beginPath();ctx.arc(e.x,e.y,e.r,0,Math.PI*2);ctx.stroke();
    ctx.globalAlpha=a*0.5;
    ctx.lineWidth=1;
    ctx.beginPath();ctx.arc(e.x,e.y,e.r*0.62,0,Math.PI*2);ctx.stroke();
    ctx.restore();
  }
  for(const m of S.missiles){drawThreat(m);drawLockBox(m);}
  drawBullets(S.bullets,'#55ff55');
  drawBullets(S.gpuBullets,'#33ccff');
  drawBullets(S.dcBullets,'#ffb347');
  drawBullets(S.droneBullets,'#ff6666');
  drawBullets(S.friendlyDroneBullets,'#7dffb2');
  fxDrawParticles();
  for(const g of S.gpuStations.slice(0,18)){
    const x=g.x;
    fxGlow(x,H-55,20,'51,204,255',0.28);
    const mod=ctx.createLinearGradient(0,H-62,0,H-51);
    mod.addColorStop(0,'#7be3ff');
    mod.addColorStop(1,'#1d93c4');
    ctx.fillStyle=mod;
    ctx.fillRect(x-8,H-58,16,7);
    ctx.fillRect(x-5,H-62,10,4);
    ctx.fillStyle='rgba(255,255,255,0.5)';
    ctx.fillRect(x-8,H-58,16,1);
    ctx.fillStyle='rgba(51,204,255,0.25)';
    ctx.fillRect(x-14,H-52,28,2);
  }
  const drawRack=function(x){
    fxGlow(x+35,H-70,52,'255,159,45',0.2);
    const rack=ctx.createLinearGradient(0,H-102,0,H-68);
    rack.addColorStop(0,'#3a2a14');
    rack.addColorStop(1,'#1c130a');
    ctx.fillStyle=rack;
    ctx.fillRect(x,H-102,70,34);
    ctx.strokeStyle='rgba(255,159,45,0.85)';
    ctx.lineWidth=1.2;
    ctx.strokeRect(x+0.5,H-101.5,69,33);
    for(let r=0;r<4;r++){
      ctx.fillStyle='#0a0d12';
      ctx.fillRect(x+5,H-96+r*7,52,4);
      const on=Math.sin(S.tick*0.005+r*1.9+x)>-0.35;
      ctx.fillStyle=on?(r%2?'#7dffb2':'#ffb347'):'#3a2a14';
      ctx.fillRect(x+60,H-96+r*7,3,4);
    }
  };
  if(!S.reactorBuilt){
    for(let i=0;i<Math.min(S.dcs,6);i++)drawRack(W-78-i*84);
  }else{
    const dcXs=[W*0.14,W*0.30,W*0.62,W*0.78];
    for(let i=0;i<dcXs.length;i++)drawRack(dcXs[i]-35);
    drawReactor();
  }
  drawCity();
  drawReactorHealth();
  drawCrosshair();
  if(S.strikeFlash>0){
    ctx.save();
    ctx.globalAlpha=Math.min(1,S.strikeFlash);
    ctx.fillStyle='#ffffff';
    ctx.fillRect(0,0,W,H);
    ctx.restore();
  }
  ctx.restore();
}
