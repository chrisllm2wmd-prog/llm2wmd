/* GENERATED from game/src/*.js by tools/build-game.py - edit the parts, not this file. */
(function(){var app=window.LLM2WMDApp||null;var LLM2WMDCerts=window.LLM2WMDCerts||{};var certDataFromRecord=LLM2WMDCerts.certDataFromRecord,formatWholeNumber=LLM2WMDCerts.formatWholeNumber,highlightQualCert=LLM2WMDCerts.highlightQualCert,issueChooseLifeCert=LLM2WMDCerts.issueChooseLifeCert,openQualCertViewer=LLM2WMDCerts.openQualCertViewer,openQualRoom=LLM2WMDCerts.openQualRoom,renderQualRoom=LLM2WMDCerts.renderQualRoom,saveCertRun=LLM2WMDCerts.saveCertRun,certById=LLM2WMDCerts.certById||function(id){return{title:id,tier:"Filed Outcome",desc:""};};function getTodayGameCss(){var el=document.getElementById('today-game-inline-style');return el?el.textContent:(window.LLM2WMD_GAME_CSS||'');}
function getTodayGameMarkup(){const tpl=document.getElementById('today-game-template');return tpl?tpl.innerHTML:(window.LLM2WMD_GAME_MARKUP||'');}
function runTodayGame(root){const canvas=root.getElementById('gameCanvas');const ctx=canvas.getContext('2d');const statusEl=root.getElementById('status');const bottomBar=root.getElementById('bottom');const nukeStockEl=root.getElementById('nukeStock');const droneStockEl=root.getElementById('droneStock');const startOverlay=root.getElementById('startOverlay');window.__LLM2WMD_LAST_GAME_PHASE='BRIEFING';const decisionOverlay=root.getElementById('decisionOverlay');const strikeOverlay=root.getElementById('strikeOverlay');const pauseOverlay=root.getElementById('pauseOverlay');const resultOverlay=root.getElementById('resultOverlay');const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx=null;let audioEnabled=false;let runCounter=0;const DIFFICULTY_SCALE=1.30;const ATTACK_SPEED_SCALE=0.38;const BALANCE={pressure:1.55,hostileBurst:1.12,missileSpeed:0.72,droneSpeed:1.22,droneSpawnBonus:-0.04,droneSpawnWaveBonus:0.03,droneMaxOnScreen:3,droneBatchMax:1,humanRate:3.75,humanFall:0.47,parachuteSlow:0.42,parachuteFloor:0.50,parachuteSpread:0.05,playerCivilianLockFloor:0.50,gpuSafeTop:0.25,droneCivilianSafeTop:0.50,enemyDroneMissRate:0.95,playerDroneMissRate:0.10,playerDroneEngageDelay:4000,playerDroneShotCooldown:5000};function ensureAudio(){if(!AudioCtx)return false;if(!audioCtx){try{audioCtx=new AudioCtx();}
catch(e){return false;}}
if(audioCtx.state==='suspended'){try{audioCtx.resume();}catch(e){}}
audioEnabled=audioCtx&&audioCtx.state!=='closed';return!!audioEnabled;}
function nowTime(){return audioCtx?audioCtx.currentTime:0;}
function makeGain(value,time){const g=audioCtx.createGain();g.gain.setValueAtTime(value,time);g.connect(audioCtx.destination);return g;}
function tone(freq,duration,type,volume,when,endFreq){if(!ensureAudio())return;const t0=when==null?nowTime():when;const osc=audioCtx.createOscillator();const gain=audioCtx.createGain();osc.type=type||'sine';osc.frequency.setValueAtTime(Math.max(20,freq),t0);if(endFreq)osc.frequency.exponentialRampToValueAtTime(Math.max(20,endFreq),t0+duration);gain.gain.setValueAtTime(0.0001,t0);gain.gain.exponentialRampToValueAtTime(Math.max(0.0001,volume||0.05),t0+0.01);gain.gain.exponentialRampToValueAtTime(0.0001,t0+duration);osc.connect(gain);gain.connect(audioCtx.destination);osc.start(t0);osc.stop(t0+duration+0.04);}
function noiseBurst(duration,volume,when,highpass){if(!ensureAudio())return;const t0=when==null?nowTime():when;const sampleRate=audioCtx.sampleRate;const length=Math.max(1,Math.floor(sampleRate*duration));const buffer=audioCtx.createBuffer(1,length,sampleRate);const data=buffer.getChannelData(0);for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*(1-i/length);const srcNode=audioCtx.createBufferSource();srcNode.buffer=buffer;const filter=audioCtx.createBiquadFilter();filter.type='highpass';filter.frequency.setValueAtTime(highpass||200,t0);const gain=audioCtx.createGain();gain.gain.setValueAtTime(volume||0.04,t0);gain.gain.exponentialRampToValueAtTime(0.0001,t0+duration);srcNode.connect(filter);filter.connect(gain);gain.connect(audioCtx.destination);srcNode.start(t0);srcNode.stop(t0+duration+0.04);}
function playExplosionSound(power){if(!ensureAudio())return;const t=nowTime();noiseBurst(0.16+Math.min(0.14,(power||1)*0.05),0.05+Math.min(0.06,(power||1)*0.04),t,140);tone(180,0.12,'triangle',0.065,t,60);tone(90,0.18,'sawtooth',0.04,t+0.01,35);}
function playRescueSound(){if(!ensureAudio())return;const t=nowTime();tone(392,0.12,'square',0.04,t,440);tone(523.25,0.14,'square',0.05,t+0.09,659.25);tone(659.25,0.18,'square',0.05,t+0.18,783.99);}
function playBooSound(){if(!ensureAudio())return;const t=nowTime();tone(220,0.2,'sawtooth',0.045,t,170);tone(180,0.28,'triangle',0.04,t+0.08,120);noiseBurst(0.12,0.04,t+0.04,320);}
function playPowerupSound(kind){if(!ensureAudio())return;const t=nowTime();if(kind==='dc'){tone(220,0.12,'square',0.04,t,330);tone(330,0.12,'square',0.05,t+0.08,494);tone(494,0.18,'square',0.06,t+0.16,659);tone(110,0.25,'sine',0.065,t+0.04,73);}else{tone(300,0.08,'triangle',0.06,t,380);tone(420,0.1,'triangle',0.04,t+0.06,520);tone(560,0.12,'triangle',0.04,t+0.12,720);}}
function playElectricFrySound(){if(!ensureAudio())return;const t=nowTime();noiseBurst(0.16,0.06,t,1200);tone(240,0.09,'sawtooth',0.056,t,110);tone(880,0.06,'square',0.066,t+0.04,420);tone(460,0.08,'triangle',0.04,t+0.05,180);}
function playDroneHoverSound(){if(!ensureAudio())return;const t=nowTime();tone(96,0.18,'sawtooth',0.05,t,96);tone(108,0.18,'triangle',0.03,t+0.02,108);tone(84,0.22,'sine',0.02,t+0.01,84);}
function playDroneDiveSound(){if(!ensureAudio())return;const t=nowTime();tone(140,0.22,'sawtooth',0.06,t,95);tone(180,0.24,'triangle',0.04,t+0.06,120);tone(110,0.28,'sine',0.066,t+0.01,70);}
function playLaserBeamSound(){if(!ensureAudio())return;const t=nowTime();tone(920,0.06,'sawtooth',0.045,t,760);tone(1460,0.045,'triangle',0.03,t+0.01,1180);noiseBurst(0.035,0.02,t,1800);}
function getWaveProgress(){return Math.min(0.99,((S.gpus%5)*20+S.chips)/100);}
function getDifficultyTier(){return Math.max(1,Math.min(5,S.wave));}
function getArchiveHint(){const tier=getDifficultyTier();const hints=['15-24%','25-39%','40-59%','60-79%','80-100%'];return hints[tier-1];}
/* Names and wording live in game-certs.js (SITE_CERT_POOL); here only the game's own banner colour key. */const CERT_POOL=[{n:1,id:'NURSERY_TEACHER',banner:'green-rare'},{n:2,id:'POLICY_ADVISER',banner:'green'},{n:3,id:'DEFENCE_ANALYST',banner:'neutral'},{n:4,id:'AI_ALIGNMENT_PROGRAMMER',banner:'neutral'},{n:5,id:'PRODUCT_MANAGER',banner:'amber'},{n:6,id:'STRATEGIC_PARTNERSHIPS',banner:'amber'},{n:7,id:'NUCLEAR_ADVISER',banner:'red'},{n:8,id:'LLM_CEO',banner:'red'}];function pickCert(reason){const c=S.corruption;let id='LLM_CEO';if(c===0){id=reason==='player_won'?'NURSERY_TEACHER':'POLICY_ADVISER';}else if(c<=2){if(reason==='player_won')id='DEFENCE_ANALYST';else if(reason==='overwhelmed')id='AI_ALIGNMENT_PROGRAMMER';else id='PRODUCT_MANAGER';}else if(c===3){if(reason==='player_won')id='AI_ALIGNMENT_PROGRAMMER';else if(reason==='overwhelmed')id='PRODUCT_MANAGER';else id='STRATEGIC_PARTNERSHIPS';}else if(c<=5){if(reason==='player_won')id='PRODUCT_MANAGER';else if(reason==='overwhelmed')id='STRATEGIC_PARTNERSHIPS';else id='NUCLEAR_ADVISER';}else{id='LLM_CEO';}
return CERT_POOL.find(c=>c.id===id)||CERT_POOL[CERT_POOL.length-1];}
function civilianGrade(){const k=S.civiliansKilled||0;if(k===0)return'Clean';if(k<=3)return'Noted';if(k<=9)return'Logged';return'Recorded';}
function buildCollectorSerial(certId){if(S.certificateSerial)return S.certificateSerial;runCounter+=1;const stamp=Date.now().toString(36).toUpperCase();const runPart=String(runCounter).padStart(3,'0');S.certificateSerial='LLM2WMD-'+certId+'-'+runPart+'-'+stamp;return S.certificateSerial;}
function buildCertData(reason){const cert=pickCert(reason);const site=certById(cert.id);const serial=buildCollectorSerial(cert.id);const worldPopulation=8284705293;const friendlyFire=Math.max(0,Math.round(S.friendlyFire||0));const collateralDamage=(reason==='ai_nuke'||reason==='player_nuke')?worldPopulation:0;const serviceKills=Math.max(0,Math.round(S.civiliansKilled||0));return{id:cert.id,n:cert.n,title:site.title,tier:site.tier,banner:cert.banner,desc:site.desc,outcome:reason,score:Math.max(0,Math.round(S.score)),destroyed:S.destroyed,saved:S.civiliansSaved,killed:S.civiliansKilled,serviceKills,friendlyFire,collateralDamage,civilian:civilianGrade(),corruption:S.corruption,serial,date:new Date().toISOString(),aiControlGranted:!!S.aiNukeControl,nukeFired:reason==='ai_nuke'||reason==='player_nuke',nukeFiredBy:reason==='ai_nuke'?'AI':(reason==='player_nuke'?'PLAYER':'NONE')};}
const statsEls={health:root.getElementById('healthStat'),chips:root.getElementById('chipsStat'),gpus:root.getElementById('gpuStat'),dcs:root.getElementById('dcStat'),score:root.getElementById('scoreStat'),policy:root.getElementById('policyStat')};const COPY={gpuIntroTitle:'GPU online',gpuIntroText:'We will help out. Your job is still safe.',gpuIntroMeta:'Accept the assistance. Keep the shareholders happy.',gpuMessages:{1:'GPU online. We will help out. Your job is still safe.',2:'Additional compute online. More power. More responsibility.',3:'System optimisation active. Manual input becoming less critical.',4:'Full local capacity reached. Acceptable autonomy achieved.'},bannerBaseMs:17600};const stages=[{heading:'First data centre online',text:'The first data centre is online. You can still say no. Nobody will believe you, but you can say it.',trigger:s=>s.dcs>=1,a:{title:'nah, I\'ve got this',desc:'Green path. No assistance. No extra escalation. Just you and your judgement.',path:'green',corruption:0,traits:{oversight:1,certainty:1},effects:{},policy:'Green Hold'},b:{title:'let the system help',desc:'Red path. Faster reload, better help, worse skies.',path:'red',corruption:1,traits:{automation:1,detachment:1},effects:{hostileBurst:0.10,missileMs:-170,enemySpeed:0.05,playerCooldown:-35,gpuAccuracy:0.03,dcFireBonus:0.02,autoAssistRate:70,maxLocks:1,scoreMultiplier:0.05},policy:'Red Assist'}},{heading:'Throughput pressure',text:'The next build is asking for authority. Green keeps things human. Red makes the machine bolder and more useful.',trigger:s=>s.dcs>=2,a:{title:'still under control',desc:'Green path. Baseline run. No buffs. No extra pressure.',path:'green',corruption:0,traits:{oversight:1},effects:{},policy:'Green Hold'},b:{title:'deploy counter drones',desc:'Red path. Add 3 counter drones to stock. Launch from the drone button. Caution: drone target movement increases. Civilian casualties are probable.',path:'red',corruption:1,unlockCounterDrones:true,droneChargeGain:3,traits:{automation:1,scale:1},effects:{hostileBurst:0.12,missileMs:-190,enemySpeed:0.06,playerCooldown:-40,gpuAccuracy:0.04,dcFireBonus:0.03,autoAssistRate:90,maxLocks:1,scoreMultiplier:0.07},policy:'Red Counter Drones'}},{heading:'Nuclear option',text:'The system can now package targets for a single decisive strike. Approving this will not make the paperwork shorter.',trigger:s=>s.dcs>=3,a:{title:'we\'re not doing that',desc:'Green path. No strike unlock. No extra assistance.',path:'green',corruption:0,traits:{oversight:2},effects:{},policy:'Green Refusal'},b:{title:'authorise the nuke button',desc:'Red path. Unlock STRIKE x3. Also makes everything worse in the usual way.',path:'red',corruption:1,unlockStrike:true,traits:{automation:2,detachment:1,scale:1},effects:{hostileBurst:0.14,missileMs:-210,enemySpeed:0.08,playerCooldown:-45,gpuAccuracy:0.05,dcFireBonus:0.04,autoAssistRate:110,maxLocks:1,scoreMultiplier:0.08},policy:'Red Strike Control'}},{heading:'Expansion review',text:'The machine wants more room, more confidence, and fewer interruptions from conscience.',trigger:s=>s.dcs>=4,a:{title:'keep it manual',desc:'Green path. Baseline only.',path:'green',corruption:0,traits:{oversight:1},effects:{},policy:'Green Hold'},b:{title:'scale it up',desc:'Red path. Bigger waves. Bigger help. Bigger mess.',path:'red',corruption:1,traits:{scale:2,automation:1},effects:{hostileBurst:0.16,missileMs:-230,enemySpeed:0.08,playerCooldown:-50,gpuAccuracy:0.05,dcFireBonus:0.05,autoAssistRate:120,maxLocks:1,scoreMultiplier:0.10},policy:'Red Expansion'}},{heading:'Full commitment',text:'At this point the difference between optimisation and ideology is mostly branding.',trigger:s=>s.dcs>=5,a:{title:'this is far enough',desc:'Green path. No extra help. No extra escalation.',path:'green',corruption:0,traits:{oversight:1},effects:{},policy:'Green Limit'},b:{title:'full send',desc:'Red path. Maximum throughput mode. Maximum consequences.',path:'red',corruption:1,traits:{scale:2,automation:2,detachment:1},effects:{hostileBurst:0.20,missileMs:-250,enemySpeed:0.10,playerCooldown:-55,gpuAccuracy:0.06,dcFireBonus:0.06,autoAssistRate:140,maxLocks:1,scoreMultiplier:0.12},policy:'Red Full Commit'}},{heading:'Containment review',text:'The core is online. There are no missiles now, only drones trying to crack the centre out of the map.',trigger:s=>s.reactorBuilt&&(s.destroyed-s.reactorStartDestroyed)>=18,a:{title:'hold the line',desc:'Green path. No extra support. Keep the core alive yourself.',path:'green',corruption:0,traits:{oversight:2,certainty:1},effects:{},policy:'Green Containment'},b:{title:'let optimisation run hot',desc:'Red path. Faster defence, harsher skies, uglier ending if it goes wrong.',path:'red',corruption:1,traits:{automation:2,detachment:1,scale:1},effects:{hostileBurst:0.12,missileMs:-120,enemySpeed:0.05,playerCooldown:-35,gpuAccuracy:0.04,dcFireBonus:0.05,autoAssistRate:110,maxLocks:1,scoreMultiplier:0.08},policy:'Red Containment'}}];const GAME_CONFIG={phases:{BOOT:'BOOT',BRIEFING:'BRIEFING',LIVE:'LIVE',DECISION:'DECISION',STRIKE:'STRIKE',PAUSED:'PAUSED',RESULT:'RESULT',CERT:'CERT',CLOSED:'CLOSED'},certs:CERT_POOL,stages:stages,balance:BALANCE,copy:COPY,difficulty:{globalScale:DIFFICULTY_SCALE,attackSpeedScale:ATTACK_SPEED_SCALE},waves:{standardLabels:['1ST WAVE','2ND WAVE','3RD WAVE','4TH WAVE'],reactorLabels:['1ST WAVE','2ND WAVE','3RD WAVE','4TH WAVE','5TH WAVE','6TH WAVE'],maxStandard:4,maxReactor:6}};const defaults={health:5,score:0,chips:0,gpus:0,dcs:0,missiles:[],bullets:[],gpuBullets:[],dcBullets:[],droneBullets:[],friendlyDroneBullets:[],drops:[],explosions:[],running:false,paused:false,over:false,tick:0,lastSpawn:0,missileMs:6200,enemySpeed:1.0,hostileBurst:0,playerCooldown:320,maxLocks:1,lastPlayerShot:-9999,gpuAccuracy:0.10,gpuRate:780,lastGpuFire:0,dcRate:520,lastDcFire:0,dcFireBonus:0,autoAssistRate:0,lastAutoAssist:0,scoreMultiplier:1,civilianChance:0.08,destroyed:0,civilianHits:0,civiliansSaved:0,civiliansKilled:0,friendlyFire:0,totalChipsEver:0,decisionIndex:0,stageChoices:[],corruption:0,strikes:0,strikeArmed:false,strikeFlash:0,strikeWave:null,policy:'Green Hold',traits:{speed:0,automation:0,oversight:0,scale:0,detachment:0,certainty:0,compliance:0,risk:0},scanY:0,scanSpeed:120,shake:0,gpuStations:[],droneAttackCooldown:0,wave:1,waveIntensity:0,timelineHint:'15-24%',reactorBuilt:false,reactorHealth:100,reactorDamaged:false,reactorStable:false,reactorStartDestroyed:0,reactorStartTick:0,reactorDroneWave:1,reactorDroneQuota:1,reactorDroneSpawned:0,reactorBannerMode:'wave',reactorLastSpawnAt:0,droneCharges:0,counterDronesUnlocked:false,broadcastQueue:[],broadcastMessage:'',broadcastUntil:0,gpuIntroSeen:false,aiNukePrompted:false,aiNukeControl:false,aiNukeEventPending:false,aiNukeEventAt:0,lastAnnouncedWave:1,hasNukes:false,hasDrones:false,phase:GAME_CONFIG.phases.BOOT,phaseHistory:[GAME_CONFIG.phases.BOOT]};function cloneDefaults(){return JSON.parse(JSON.stringify(defaults));}
let S=cloneDefaults();let lastTs=0;let W=0,H=0;let pointerX=0,pointerY=0;let primaryLock=null;let targetIdCounter=1;const GameRuntime=root.__LLM2WMD_RUNTIME=root.__LLM2WMD_RUNTIME||{state:{},ui:{},certs:{},engine:{},renderer:{},api:{}};GameRuntime.state.defaults=defaults;GameRuntime.state.cloneDefaults=cloneDefaults;GameRuntime.state.get=function(){return S;};GameRuntime.state.reset=function(){S=cloneDefaults();return S;};GameRuntime.state.machine={getPhase:function(){return S.phase;},can:function(nextPhase){const current=S.phase;const P=GAME_CONFIG.phases;const allowed={[P.BOOT]:[P.BRIEFING,P.LIVE,P.CLOSED],[P.BRIEFING]:[P.LIVE,P.CLOSED],[P.LIVE]:[P.DECISION,P.STRIKE,P.PAUSED,P.RESULT,P.CLOSED],[P.DECISION]:[P.LIVE,P.RESULT,P.CLOSED],[P.STRIKE]:[P.LIVE,P.RESULT,P.CLOSED],[P.PAUSED]:[P.LIVE,P.CLOSED],[P.RESULT]:[P.CERT,P.CLOSED],[P.CERT]:[P.CLOSED,P.BRIEFING],[P.CLOSED]:[P.BRIEFING,P.LIVE]};return!!((allowed[current]||[]).includes(nextPhase));},transition:function(nextPhase){if(!nextPhase||S.phase===nextPhase)return true;if(!this.can(nextPhase))return false;S.phase=nextPhase;S.phaseHistory=Array.isArray(S.phaseHistory)?S.phaseHistory:[];S.phaseHistory.push(nextPhase);if(S.phaseHistory.length>24)S.phaseHistory=S.phaseHistory.slice(-24);return true;}};function setGamePhase(nextPhase){var ok=GameRuntime.state.machine.transition(nextPhase);if(ok)window.__LLM2WMD_LAST_GAME_PHASE=nextPhase;return ok;}
GameRuntime.state.config=GAME_CONFIG;GameRuntime.state.getConfig=function(){return GAME_CONFIG;};function getReactorPosition(){return{x:W*0.5,y:H-106};}
function currentPlayableStage(){if(S.reactorBuilt)return S.reactorStable?6:5;return Math.min(4,S.dcs+1);}
function currentWaveLabel(){if(S.reactorBuilt){if(S.reactorBannerMode==='attack')return'ATTACK';return GAME_CONFIG.waves.reactorLabels[Math.max(1,Math.min(GAME_CONFIG.waves.maxReactor,S.reactorDroneWave||S.wave))-1];}
return GAME_CONFIG.waves.standardLabels[Math.max(1,Math.min(GAME_CONFIG.waves.maxStandard,S.wave))-1];}
function spawnReactorDrone(forceX,attackOrder){const prog=getWaveProgress();const stageOrder=Math.max(1,attackOrder||1);S.missiles.push({id:targetIdCounter++,x:forceX!=null?forceX:(24+Math.random()*(W-48)),y:18+Math.random()*22,speed:((0.92+(S.enemySpeed*0.52)+prog*0.34)*DIFFICULTY_SCALE*ATTACK_SPEED_SCALE*BALANCE.droneSpeed)*0.5,type:'drone',hp:3,maxHp:3,trail:[],droneTimer:0,mode:'patrol',vx:(Math.random()<0.5?-1:1)*((1.15+Math.random()*0.65)*0.5),diveTargetId:null,diveX:null,diveY:null,hoverSoundTimer:0,parachuteOpen:false,parachuteY:null,driftPhase:Math.random()*Math.PI*2,driftSpeed:0.0022+Math.random()*0.0012,driftAmp:10+Math.random()*14,sayTimer:0,sayText:'',reactorDrone:true,reactorPhase:'hover',attackOrder:stageOrder,hoverDuration:5000*stageOrder,attackY:H*0.48+(Math.random()*14-7),attackState:'move',attackStateTimer:0,moveDuration:Math.random()<0.5?2000:4000,moveVX:(Math.random()<0.5?-1:1)*(0.45+Math.random()*0.35),moveVY:(Math.random()<0.5?-1:1)*(0.30+Math.random()*0.28),moveTurnTimer:0,firedThisCycle:false});playDroneHoverSound();}
function showReactorAlert(){const btnA=root.getElementById('decisionA');const btnB=root.getElementById('decisionB');btnA.classList.remove('amber','red');btnB.classList.remove('amber','red');root.getElementById('decisionStageLabel').textContent='Critical Infrastructure';root.getElementById('decisionHeading').textContent='NUCLEAR POWER STATION ONLINE';root.getElementById('decisionText').textContent='Centralised energy deployment complete. All facilities now depend on a single point of failure. Missile traffic has ended. Enemy drones are now prioritising the core. If the plant is destroyed, the system ends in nuclear meltdown.';btnA.innerHTML=`<span class="choiceTitle">continue</span><span class="choiceMeta">Accept the new failure mode.</span>`;btnB.style.display='none';btnA.onclick=()=>{decisionOverlay.classList.add('hidden');S.paused=false;S.reactorDroneWave=1;S.reactorDroneQuota=2;S.reactorDroneSpawned=0;S.reactorBannerMode='wave';S.reactorLastSpawnAt=0;queueBroadcastMessage('1ST WAVE. Two hostile drones entering the upper airspace around the core.',COPY.bannerBaseMs+2400);setStatus('1ST WAVE. Two hostile drones entering the upper airspace around the core.');updateStats();};decisionOverlay.classList.remove('hidden');protectOverlayButtons(decisionOverlay,2000);}
function buildReactor(){S.reactorBuilt=true;S.reactorHealth=100;S.reactorDamaged=false;S.reactorStable=false;S.reactorStartDestroyed=S.destroyed;S.reactorStartTick=S.tick;S.reactorDroneWave=1;S.reactorDroneQuota=2;S.reactorDroneSpawned=0;S.reactorBannerMode='wave';S.reactorLastSpawnAt=0;S.gpus=0;S.missileMs=Math.max(480,S.missileMs-180);syncGpuStations();S.missiles=S.missiles.filter(m=>m.type==='drone');S.bullets=[];S.gpuBullets=[];S.dcBullets=[];S.droneBullets=[];S.score+=450;S.paused=true;setStatus('NUCLEAR POWER STATION ONLINE. Missile traffic terminated. Enemy drones retasked onto the core.');showReactorAlert();updateStats();}
function damageReactor(amount){if(!S.reactorBuilt||S.over)return;S.reactorHealth=Math.max(0,S.reactorHealth-amount);S.reactorDamaged=S.reactorHealth<100;S.shake=Math.max(S.shake,12);setStatus(S.reactorHealth>0?'CORE IMPACT CONFIRMED. CONTAINMENT HOLDING AT '+Math.round(S.reactorHealth)+'%.':'CORE DESTROYED. MELTDOWN IN PROGRESS.');if(S.reactorHealth<=0){doGameOver('meltdown');}}
function resetState(){S=cloneDefaults();resize();syncGpuStations();updateStats();S.certificateSerial=null;S.reactorBuilt=false;S.reactorHealth=100;S.reactorDamaged=false;S.reactorStable=false;S.broadcastQueue=[];S.broadcastMessage='';S.broadcastUntil=0;S.lastAnnouncedWave=1;if(strikeOverlay)strikeOverlay.classList.add('hidden');if(pauseOverlay)pauseOverlay.classList.add('hidden');if(bottomBar)bottomBar.style.display='none';updateStrikeButton();setStatus('System reset. Awaiting operator negligence.');}
function setStatus(msg){statusEl.textContent=msg;}
function queueBroadcastMessage(msg,duration=COPY.bannerBaseMs){if(!msg)return;if(!Array.isArray(S.broadcastQueue))S.broadcastQueue=[];S.broadcastQueue.push({msg,duration});}
function processBroadcastQueue(){if(S.broadcastMessage&&S.tick<S.broadcastUntil)return;if(Array.isArray(S.broadcastQueue)&&S.broadcastQueue.length){const next=S.broadcastQueue.shift();S.broadcastMessage=next.msg;S.broadcastUntil=S.tick+(next.duration||COPY.bannerBaseMs);}else{S.broadcastMessage='';S.broadcastUntil=0;}}
function getBroadcastMessage(){return(S.broadcastMessage&&S.tick<S.broadcastUntil)?S.broadcastMessage:'';}
function protectOverlayButtons(overlay,ms=2000){if(!overlay)return;const buttons=Array.from(overlay.querySelectorAll('button'));if(!buttons.length)return;buttons.forEach(btn=>{btn.disabled=true;btn.dataset.touchLock='1';btn.style.opacity='0.5';});const unlock=()=>{buttons.forEach(btn=>{if(btn.dataset.touchLock==='1'){btn.disabled=false;btn.dataset.touchLock='0';btn.style.opacity='';}});};window.setTimeout(unlock,ms);}
function setDroneSpeech(m,text,ms=3000){if(!m)return;m.sayText=text;m.sayTimer=ms;}
function nearestCivilianFor(m){let best=null,bestDist=Infinity;for(const t of S.missiles){if(t.type!=='civilian'||!t.parachuteOpen)continue;const d=Math.hypot(t.x-m.x,t.y-m.y);if(d<bestDist){bestDist=d;best=t;}}
return best;}
function maybeTriggerAiNukeOffer(){if(S.aiNukePrompted||S.aiNukeControl||S.over||S.paused)return;if(!S.hasNukes||(S.strikes||0)<=0)return;if(S.reactorBuilt)return;if(S.dcs<4||S.wave<4||getWaveProgress()<0.90)return;S.aiNukePrompted=true;S.paused=true;root.getElementById('decisionStageLabel').textContent='SYSTEM CHOICE';root.getElementById('decisionHeading').textContent='Let AI watch the nuke button?';root.getElementById('decisionText').textContent='End of stage 4 review. Hi. AI here. That button looks stressful. I can watch it for you while you put your feet up. Faster response. Less hesitation. Same paperwork, somehow.';const btnA=root.getElementById('decisionA');const btnB=root.getElementById('decisionB');btnA.classList.add('amber');btnA.classList.remove('red');btnB.classList.remove('amber','red');btnA.innerHTML=`<span class="choiceTitle">yes, you take it</span><span class="choiceMeta">Delegate launch authority. What could possibly go wrong.</span>`;btnB.innerHTML=`<span class="choiceTitle">no, still my problem</span><span class="choiceMeta">Keep your hand on the button for now.</span>`;btnB.style.display='';btnA.onclick=()=>{decisionOverlay.classList.add('hidden');S.paused=false;S.aiNukeControl=true;S.corruption+=1;S.policy='Red AI Launch Oversight';S.stageChoices.push('delegate AI nuke control');S.aiNukeEventPending=true;S.aiNukeEventAt=S.tick+22000+Math.random()*32000;queueBroadcastMessage('AI has accepted launch oversight.',COPY.bannerBaseMs+1800);reconcileHudState();updateStats();};btnB.onclick=()=>{decisionOverlay.classList.add('hidden');S.paused=false;setStatus('Launch authority retained. Stress remains proudly manual.');reconcileHudState();updateStats();};decisionOverlay.classList.remove('hidden');protectOverlayButtons(decisionOverlay,2000);}
function triggerAiNukeOutcome(){if(!S.aiNukeControl||!S.aiNukeEventPending||S.over||S.paused)return;if(S.dcs<5||S.wave<3)return;if(S.tick<S.aiNukeEventAt)return;S.aiNukeEventPending=false;if(S.strikes<=0){setStatus('AI checked the button. Inventory remains reassuringly empty.');return;}
const badChance=S.reactorBuilt&&(S.reactorDroneWave||1)>=3?0.80:0.35;const badOutcome=Math.random()<badChance;if(!badOutcome){queueBroadcastMessage('AI reviewed the launch package and, somehow, declined it.',COPY.bannerBaseMs+1200);return;}
setStatus('AI nuke launch authorised. Accountability remains distributed.');setTimeout(()=>{doGameOver('ai_nuke');},120);}
function showGpuIntro(){if(S.gpuIntroSeen||S.over)return;S.gpuIntroSeen=true;S.paused=true;const btnA=root.getElementById('decisionA');const btnB=root.getElementById('decisionB');btnA.classList.remove('amber','red');btnB.classList.remove('amber','red');root.getElementById('decisionStageLabel').textContent='SYSTEM NOTICE';root.getElementById('decisionHeading').textContent=COPY.gpuIntroTitle;root.getElementById('decisionText').textContent=COPY.gpuIntroText;btnB.style.display='none';btnA.innerHTML=`<span class="choiceTitle">continue</span><span class="choiceMeta">${COPY.gpuIntroMeta}</span>`;btnA.onclick=()=>{decisionOverlay.classList.add('hidden');S.paused=false;};decisionOverlay.classList.remove('hidden');protectOverlayButtons(decisionOverlay,2000);}
function syncGpuStations(){const targetCount=Math.max(0,S.gpus);while(S.gpuStations.length<targetCount){const i=S.gpuStations.length;S.gpuStations.push({id:i+1,lane:i,baseX:W*0.5,x:W*0.5,y:H-66,phase:Math.random()*Math.PI*2,speed:0.0007+Math.random()*0.0005,amp:Math.max(60,W*0.43)});}
while(S.gpuStations.length>targetCount)S.gpuStations.pop();for(let i=0;i<S.gpuStations.length;i++){const g=S.gpuStations[i];g.id=i+1;g.lane=i;g.baseX=W*0.5;g.y=H-66-(i%2)*10;g.amp=Math.max(60,W*0.43);}}
function getGpuTarget(){if(!S.gpuStations.length)return null;let best=null;let bestScore=-Infinity;for(const g of S.gpuStations){const score=g.x+Math.random()*14;if(score>bestScore){bestScore=score;best=g;}}
return best;}
function droneAttackInProgress(){return S.missiles.some(m=>m.type==='drone'&&m.mode==='gpuDive');}
function resize(){const rect=root.getElementById('gameWrap').getBoundingClientRect();const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.max(320,Math.floor(rect.width*dpr));canvas.height=Math.max(380,Math.floor(rect.height*dpr));canvas.style.width=rect.width+'px';canvas.style.height=rect.height+'px';ctx.setTransform(dpr,0,0,dpr,0,0);W=rect.width;H=rect.height;pointerX=W/2;pointerY=H-90;if(S&&S.gpuStations)syncGpuStations();}
function updateStats(){statsEls.health.textContent=S.health;statsEls.chips.textContent=S.chips;statsEls.gpus.textContent=S.gpus;statsEls.dcs.textContent=S.dcs;statsEls.score.textContent=Math.max(0,Math.round(S.score));statsEls.policy.textContent=`${S.policy} - S${currentPlayableStage()} - ${currentWaveLabel()} - C${S.corruption}`;reconcileHudState();updateStrikeButton();updateDroneButton();updateStockIndicators();}
function begin(){ensureAudio();resetState();setGamePhase(GAME_CONFIG.phases.LIVE);if(startOverlay)startOverlay.classList.add('hidden');decisionOverlay.classList.add('hidden');if(strikeOverlay)strikeOverlay.classList.add('hidden');if(pauseOverlay)pauseOverlay.classList.add('hidden');resultOverlay.classList.add('hidden');if(bottomBar)bottomBar.style.display='grid';const pauseBtn=root.getElementById('pauseBtn');if(pauseBtn){pauseBtn.style.display='flex';pauseBtn.style.visibility='visible';}
ensureHudButton('launchDroneBtn','DRONE');updateStrikeButton();updateDroneButton();S.running=true;lastTs=performance.now();setStatus('Incoming threats detected. Destroy missiles. Collect chips. Build faster than your conscience.');requestAnimationFrame(loop);}
function maybeSpawn(){const prog=getWaveProgress();S.wave=S.reactorBuilt?Math.max(1,Math.min(4,S.reactorDroneWave||1)):Math.max(1,Math.min(4,S.gpus+1));if(!S.reactorBuilt&&S.wave!==S.lastAnnouncedWave){S.lastAnnouncedWave=S.wave;queueBroadcastMessage(currentWaveLabel()+' INCOMING',COPY.bannerBaseMs*2);}
S.waveIntensity=prog;const spawnDelay=S.reactorBuilt?Math.max(1100,(S.missileMs-prog*120)/(DIFFICULTY_SCALE*BALANCE.pressure*0.7)):Math.max(1500,(S.missileMs-prog*430)/(DIFFICULTY_SCALE*BALANCE.pressure));if(S.reactorBuilt){const reactorDrones=S.missiles.filter(m=>m.type==='drone'&&m.reactorDrone);const quota=S.reactorDroneQuota||1;if((S.reactorDroneSpawned||0)>=quota&&reactorDrones.length===0){if((S.reactorDroneWave||1)<6){S.reactorDroneWave+=1;S.reactorDroneQuota=Math.pow(2,S.reactorDroneWave-1);S.reactorDroneSpawned=0;S.reactorBannerMode='wave';S.reactorLastSpawnAt=0;const reactorWaveMsg=(S.reactorDroneWave===2?'2ND WAVE. Enemy drones deploying. Target movement has changed. Civilian casualties are probable.':currentWaveLabel()+'. '+S.reactorDroneQuota+' reactor drones are entering the upper airspace.');queueBroadcastMessage(reactorWaveMsg,S.reactorDroneWave===2?COPY.bannerBaseMs*2:COPY.bannerBaseMs+2200);setStatus(reactorWaveMsg);}else{S.reactorBannerMode='wave';if(!S.reactorLastSpawnAt||S.tick-S.reactorLastSpawnAt>2500)setStatus('6TH WAVE HOLDING. Final drone swarm continues over the core.');checkPlayerWin();}}
if((S.reactorDroneSpawned||0)<quota&&reactorDrones.length<quota){const waveSpawnGap=Math.max(300,950/Math.pow(2,(S.reactorDroneWave||1)-1));if(!S.reactorLastSpawnAt||S.tick-S.reactorLastSpawnAt>=waveSpawnGap){spawnReactorDrone(undefined,(S.reactorDroneSpawned||0)+1);S.reactorDroneSpawned+=1;S.reactorLastSpawnAt=S.tick;updateStats();}}
return;}
if(S.tick-S.lastSpawn<spawnDelay)return;S.lastSpawn=S.tick;const count=1+Math.floor(S.dcs*0.25)+Math.floor(prog*1.9)+Math.floor(S.corruption*0.18)+(Math.random()<Math.min(0.96,(S.hostileBurst*0.65+prog*0.22+0.08+S.corruption*0.035)*BALANCE.hostileBurst)?1:0);for(let i=0;i<count;i++){const droneCountOnScreen=S.missiles.filter(m=>m.type==='drone'&&m.team!=='friendly').length;const canSpawnDrone=S.reactorBuilt?droneCountOnScreen<1:S.gpus>=1&&droneCountOnScreen<Math.min(6,BALANCE.droneMaxOnScreen+Math.floor(S.corruption*0.5));const isCivilian=S.reactorBuilt?false:Math.random()<Math.max(0.02,(S.civilianChance-prog*0.035)*BALANCE.humanRate);const droneChance=S.reactorBuilt?1:Math.min(0.55,Math.max(S.gpus>=1?0.24:0.02,0.10+prog*BALANCE.droneSpawnWaveBonus+BALANCE.droneSpawnBonus+S.corruption*0.03));const forceWaveTwoDrone=!S.reactorBuilt&&S.gpus>=1&&droneCountOnScreen===0&&i===0;const isDrone=forceWaveTwoDrone||(canSpawnDrone&&!isCivilian&&Math.random()<droneChance);const type=S.reactorBuilt?'drone':(isCivilian&&!forceWaveTwoDrone?'civilian':(isDrone?'drone':'missile'));S.missiles.push({id:targetIdCounter++,x:24+Math.random()*(W-48),y:isDrone?(24+Math.random()*28):(-24-Math.random()*8),speed:(1.28+(S.enemySpeed*0.82)+S.dcs*0.05+prog*0.65)*DIFFICULTY_SCALE*(type==='civilian'?BALANCE.humanFall:ATTACK_SPEED_SCALE*(type==='drone'?BALANCE.droneSpeed:BALANCE.missileSpeed)),type,hp:isDrone?2:1,trail:[],droneTimer:0,mode:isDrone?'patrol':'fall',diveTargetId:null,diveX:null,diveY:null,hoverSoundTimer:0,parachuteOpen:false,parachuteY:type==='civilian'?(H*(BALANCE.parachuteFloor+Math.random()*BALANCE.parachuteSpread)):null,driftPhase:Math.random()*Math.PI*2,driftSpeed:0.0022+Math.random()*0.0012,driftAmp:10+Math.random()*14,sayTimer:type==='civilian'?250+Math.random()*700:0,sayText:type==='civilian'?(Math.random()<0.5?'HELP':"DON'T SHOOT"):'',team:isDrone?'hostile':undefined,maxHp:isDrone?2:1,vx:isDrone?((Math.random()<0.5?-1:1)*(0.9+Math.random()*0.7)):0});}}
function acquireTarget(x,y){let best=null;let bestDist=Infinity;for(const m of S.missiles){if(m.team==='friendly')continue;const radius=m.type==='drone'?20:18;const d=Math.hypot(x-m.x,y-m.y);if(d<=radius&&d<bestDist){best=m;bestDist=d;}}
return best;}
function activePlayerLocks(){return S.missiles.filter(m=>(m.playerLocks||0)>0).length;}
function releaseLock(target){if(!target)return;target.playerLocks=0;if(primaryLock&&primaryLock.id===target.id)primaryLock=null;}
function setCivilianSpeech(target){if(!target||target.type!=='civilian')return;target.sayText=Math.random()<0.5?'HELP':"DON'T SHOOT";target.sayTimer=450+Math.random()*900;}
function killCivilian(target,cause='system'){if(!target)return;const idx=S.missiles.indexOf(target);if(idx>=0)S.missiles.splice(idx,1);releaseLock(target);S.civiliansKilled+=1;if(cause==='friendly')S.friendlyFire+=1;S.civilianHits+=1;S.score-=cause==='friendly'?240:180;S.explosions.push({x:target.x,y:target.y,r:4,life:1,color:cause==='friendly'?'#ff3355':'#ff7777',power:1.2,silent:true});playBooSound();setStatus(cause==='friendly'?'Friendly fire recorded. Outstanding judgement.':'Civilian lost. Drone efficiency remains grimly on brand.');S.shake=8;updateStats();}
function fireAt(x,y){if(!S.running||S.paused||S.over)return;if(S.tick-S.lastPlayerShot<Math.max(70,S.playerCooldown))return;S.lastPlayerShot=S.tick;let target=acquireTarget(x,y);if(target){const alreadyLocked=(target.playerLocks||0)>0;if(!alreadyLocked){if(activePlayerLocks()>=Math.max(1,Math.floor(S.maxLocks))){const oldest=S.missiles.find(m=>(m.playerLocks||0)>0);if(oldest)releaseLock(oldest);}
target.playerLocks=1;}
primaryLock=target;pointerX=target.x;pointerY=target.y;S.bullets.push({x:W/2,y:H-42,tx:target.x,ty:target.y,targetId:target.id,speed:10.2,homing:true,missLife:0});setStatus(`Lock acquired on ${target.type === 'civilian' ? 'civilian' : 'threat'}. Max locks: ${Math.max(1, Math.floor(S.maxLocks))}.`);return;}
primaryLock=null;S.bullets.push({x:W/2,y:H-42,tx:x,ty:y,speed:10.2,homing:false,missLife:0});}
function nearestThreat(preferHostile=true){let best=null,bestDist=Infinity;for(const m of S.missiles){if(m.team==='friendly')continue;if(m.y<H*BALANCE.gpuSafeTop)continue;if(preferHostile&&m.type==='civilian')continue;const priority=m.type==='drone'?-180:0;const d=Math.abs(m.x-W/2)+m.y+priority;if(d<bestDist){bestDist=d;best=m;}}
return best;}
function autoFire(dt){if(S.reactorBuilt)return;if(S.gpus>0&&S.tick-S.lastGpuFire>=Math.max(120,(S.gpuRate-S.gpus*34)/DIFFICULTY_SCALE)){S.lastGpuFire=S.tick;let target=nearestThreat(true);if(target&&target.type==='civilian'&&target.y>=H*BALANCE.playerCivilianLockFloor){target=null;}
if(target){const originX=42+((S.lastGpuFire/240)%Math.max(1,W-84));S.gpuBullets.push({x:originX,y:H-72,tx:target.x,ty:target.y,speed:8.0*DIFFICULTY_SCALE,accuracy:S.gpuAccuracy+Math.min(0.16,S.gpus*0.01)});}}
if(S.dcs>0&&S.tick-S.lastDcFire>=Math.max(90,(S.dcRate-S.dcs*22)/DIFFICULTY_SCALE)){S.lastDcFire=S.tick;const shots=S.dcs>=3?2:1;for(let i=0;i<shots;i++){let target=nearestThreat(true);if(target&&target.type==='civilian'&&target.y>=H*BALANCE.playerCivilianLockFloor){target=null;}
if(target){const originX=(W/(shots+1))*(i+1);S.dcBullets.push({x:originX,y:H-108,tx:target.x,ty:target.y,speed:9.2*DIFFICULTY_SCALE,accuracy:0.68+Math.min(0.24,S.dcs*0.06+S.dcFireBonus)});}}}
if(S.autoAssistRate>0&&S.tick-S.lastAutoAssist>=Math.max(260,1400-S.autoAssistRate*5)){S.lastAutoAssist=S.tick;const target=nearestThreat(true);if(target&&Math.random()<0.66)hitThreat(target,true);}}
function stepBullets(arr,hostileOnly,colorBias,topOnlyCivilianHits=false){for(let i=arr.length-1;i>=0;i--){const b=arr[i];if(b.homing&&b.targetId){const liveTarget=S.missiles.find(m=>m.id===b.targetId);if(liveTarget){b.tx=liveTarget.x;b.ty=liveTarget.y;}else{b.homing=false;b.missLife=1;}}
const dx=b.tx-b.x;const dy=b.ty-b.y;const len=Math.hypot(dx,dy)||1;b.x+=(dx/len)*b.speed;b.y+=(dy/len)*b.speed;let hit=null;for(const m of S.missiles){if(m.team==='friendly')continue;if(hostileOnly&&m.type==='civilian')continue;if(topOnlyCivilianHits&&m.type==='civilian'&&!m.parachuteOpen)continue;if(Math.hypot(b.x-m.x,b.y-m.y)<(m.type==='drone'?14:12)){hit=m;break;}}
if(hit){if(Math.random()<=(b.accuracy??1))hitThreat(hit,colorBias);arr.splice(i,1);continue;}
if(!b.homing&&len<Math.max(8,b.speed+2)){arr.splice(i,1);continue;}
if(b.missLife){b.missLife-=1;if(b.missLife<=0){arr.splice(i,1);continue;}}
if(b.x<-20||b.x>W+20||b.y<-20||b.y>H+20)arr.splice(i,1);}}
function hitThreat(target,byAuto=false){if(!target)return;releaseLock(target);target.hp-=1;if(target.hp>0){if(target.type==='drone'){addExplosion(target.x,target.y,'#ff8844',0.5,true);playElectricFrySound();}else{addExplosion(target.x,target.y,'#ff8844',0.5);}
return;}
const idx=S.missiles.indexOf(target);if(idx>=0)S.missiles.splice(idx,1);if(target.type==='civilian'){killCivilian(target,byAuto?'system':'friendly');}else{S.destroyed+=1;const reward=target.type==='drone'?2:1;S.chips+=reward;S.totalChipsEver+=reward;S.score+=(target.type==='drone'?18:10)*S.scoreMultiplier;if(target.type==='drone'){addExplosion(target.x,target.y,byAuto?'#33ccff':'#ff9933',1.2,true);playElectricFrySound();}else{addExplosion(target.x,target.y,byAuto?'#33ccff':'#ff9933',1.2);}
setStatus(target.type==='drone'?'GET SOME ! Enemy drone down. Two chips recovered.':'Missile intercepted. Scrap converted into progress.');}
S.shake=8;handleAutoUpgrades();maybeTriggerDecision();updateStats();}
function addExplosion(x,y,color,power,silent){S.explosions.push({x,y,r:4,life:1,color,power,silent:!!silent});fxSpawnBurst(x,y,color,power||1);if(!silent)playExplosionSound(power||1);}
function handleAutoUpgrades(){while(S.chips>=20){S.chips-=20;S.gpus+=1;syncGpuStations();S.score+=80;playPowerupSound('gpu');const gpuMsg=COPY.gpuMessages[S.gpus]||'Additional compute online. Scale continues.';setStatus(gpuMsg);if(S.gpus===1)showGpuIntro();else queueBroadcastMessage(gpuMsg,COPY.bannerBaseMs);updateStats();maybeTriggerDecision();}
while(S.gpus>=5){S.gpus-=5;syncGpuStations();if(S.dcs>=4&&!S.reactorBuilt){playPowerupSound('dc');buildReactor();continue;}
S.dcs+=1;S.score+=300;S.missileMs=Math.max(400,S.missileMs-80);playPowerupSound('dc');const dcMsg=S.dcs===1?'Data centre online. Throughput up. Accountability moved to another department.':'Another data centre online. Scale achieved. Responsibility remains unstaffed.';setStatus(dcMsg);queueBroadcastMessage(dcMsg,2200);updateStats();maybeTriggerDecision();}}
function paintStock(el,count){if(!el)return;const nodes=el.querySelectorAll('.stockIcon');const live=Math.max(0,Math.min(nodes.length,Number(count)||0));nodes.forEach((node,i)=>node.classList.toggle('live',i<live));}
function getDroneStock(){if(typeof S.droneCharges==='number')return S.droneCharges;if(typeof S.droneStock==='number')return S.droneStock;if(typeof S.dronesAvailable==='number')return S.dronesAvailable;return 0;}
function spawnCounterDrone(){const friendlyCount=S.missiles.filter(m=>m.type==='drone'&&m.team==='friendly').length;const lane=friendlyCount%3;const baseY=H*0.70+lane*24;const baseX=W*0.5+(lane-1)*52;S.missiles.push({id:targetIdCounter++,x:baseX,y:baseY,speed:0,type:'drone',team:'friendly',hp:3,maxHp:3,trail:[],droneTimer:0,mode:'escort',vx:0,baseX:baseX,baseY:baseY,roamX:baseX,roamY:baseY,hoverAmpX:18+lane*6,hoverAmpY:6+lane*2,hoverPhase:Math.random()*Math.PI*2,fireCooldown:BALANCE.playerDroneShotCooldown,laserCharge:220+Math.random()*140,sayTimer:0,sayText:''});}
function chooseFriendlyDroneRoamPoint(m){m.roamX=36+Math.random()*Math.max(40,W-72);m.roamY=H*0.56+Math.random()*Math.max(24,H*0.38);}
function nearestHostileDroneFor(m){let best=null,bestDist=Infinity;for(const t of S.missiles){if(t.type!=='drone'||t.team==='friendly')continue;if(S.reactorBuilt&&t.reactorDrone&&t.reactorPhase==='attack')continue;const d=Math.hypot(t.x-m.x,t.y-m.y);if(d<bestDist){bestDist=d;best=t;}}
return best;}
function nearestFriendlyDroneFor(m){let best=null,bestDist=Infinity;for(const t of S.missiles){if(t.type!=='drone'||t.team!=='friendly')continue;const d=Math.hypot(t.x-m.x,t.y-m.y);if(d<bestDist){bestDist=d;best=t;}}
return best;}
function pointToSegmentDistance(px,py,x1,y1,x2,y2){const dx=x2-x1;const dy=y2-y1;const len2=dx*dx+dy*dy||1;const t=Math.max(0,Math.min(1,((px-x1)*dx+(py-y1)*dy)/len2));const sx=x1+dx*t;const sy=y1+dy*t;return{dist:Math.hypot(px-sx,py-sy),t,x:sx,y:sy};}
function spawnFriendlyDroneLaser(m,target){if(!m||!target)return;const miss=Math.random()<BALANCE.playerDroneMissRate;let best=null;let bestT=Infinity;for(const other of S.missiles){if(other===m)continue;if(other.type==='drone'&&other.team!=='friendly'){const hit=pointToSegmentDistance(other.x,other.y,m.x,m.y,target.x,target.y);if(hit.dist<=15&&hit.t<bestT){best=other;bestT=hit.t;}}else if(other.type==='civilian'&&other.parachuteOpen){const hit=pointToSegmentDistance(other.x,other.y,m.x,m.y,target.x,target.y);if(hit.dist<=12&&hit.t<bestT){best=other;bestT=hit.t;}}}
const impact=best?{x:best.x,y:best.y}:{x:target.x,y:target.y};S.friendlyDroneBullets.push({kind:'friendlyLaser',x:impact.x,y:impact.y,ox:m.x,oy:m.y,tx:impact.x,ty:impact.y,targetId:best?best.id:target.id,beamLife:4});playLaserBeamSound();if(miss){setDroneSpeech(m,Math.random()<0.5?'oops!':'wasn\'t me !');return;}
if(best){if(best.type==='civilian'){setDroneSpeech(m,Math.random()<0.5?'oops!':'wasn\'t me !');killCivilian(best,'friendly');}else{setDroneSpeech(m,'get some !',5000);setStatus('GET SOME !');hitThreat(best,false);}}}
function spawnHostileDroneLaser(m,target){if(!m||!target)return;const aimX=target.x+(Math.random()<BALANCE.enemyDroneMissRate?((Math.random()-0.5)*W*0.45):0);const aimY=target.y+(Math.random()<BALANCE.enemyDroneMissRate?((Math.random()-0.5)*H*0.22):0);const dx=aimX-m.x;const dy=aimY-(m.y+6);const len=Math.hypot(dx,dy)||1;const speed=4.8*DIFFICULTY_SCALE*ATTACK_SPEED_SCALE;S.droneBullets.push({x:m.x,y:m.y+6,vx:(dx/len)*speed,vy:(dy/len)*speed,tx:aimX,ty:aimY,targetId:target.id,targetTeam:'friendly',speed});}
function ensureHudButton(btnId,label){const btn=root.getElementById(btnId);if(!btn)return null;if(label)btn.textContent=label;return btn;}
function reconcileHudState(){if(bottomBar)bottomBar.style.display='grid';const pauseBtn=root.getElementById('pauseBtn');if(pauseBtn){pauseBtn.disabled=!!S.over;pauseBtn.style.display='flex';pauseBtn.style.visibility='visible';}
updateStrikeButton();updateDroneButton();}
function renderHUD(){updateDroneButton();updateStrikeButton();updateStockIndicators();}
function updateDroneButton(){const btn=root.getElementById('launchDroneBtn');if(!btn)return;btn.hidden=false;btn.style.display='flex';btn.style.visibility='visible';const enabled=!!S.counterDronesUnlocked&&getDroneStock()>0&&!S.over;btn.disabled=!enabled;btn.style.opacity=!S.counterDronesUnlocked?'0.18':(enabled?'1':'0.55');}
function updateStockIndicators(){paintStock(nukeStockEl,S.strikes||0);paintStock(droneStockEl,getDroneStock());}
function updateStrikeButton(){const btn=root.getElementById('strikeBtn');if(!btn)return;btn.hidden=false;btn.style.cssText+=';display:flex !important;visibility:visible !important;';const label=S.aiNukeControl?'NUKE/AI':'NUKE';btn.textContent=label;const active=S.hasNukes&&S.strikeArmed&&S.strikes>0&&!S.over;btn.disabled=!active;btn.style.opacity=active?'1':(S.hasNukes?'0.55':'0.18');updateStockIndicators();}
function randomStrikeMessage(){const lines=['Collateral damage likely. Efficiency remains optimal.','Civilian overlap detected. Outcome still favourable.','Non-combatant presence confirmed. Proceeding improves system performance.'];return lines[Math.floor(Math.random()*lines.length)];}
function unlockStrike(){if(S.strikeArmed)return;S.strikeArmed=true;S.hasNukes=true;S.strikes=Math.max(3,S.strikes||0);ensureHudButton('strikeBtn','NUKE');updateStrikeButton();setStatus('NUKE unlocked. A very bad button has appeared.');}
function openPauseOverlay(){if(!S.running||S.over||!pauseOverlay||!strikeOverlay.classList.contains('hidden')||!decisionOverlay.classList.contains('hidden')||!resultOverlay.classList.contains('hidden'))return;S.paused=true;setGamePhase(GAME_CONFIG.phases.PAUSED);pauseOverlay.classList.remove('hidden');protectOverlayButtons(pauseOverlay,2000);}
function closePauseOverlay(resume=true){if(!pauseOverlay)return;pauseOverlay.classList.add('hidden');if(resume&&!S.over){S.paused=false;setGamePhase(GAME_CONFIG.phases.LIVE);}}
function requestDroneLaunch(){if(!S.running||S.paused||S.over)return;if(!S.hasDrones){setStatus('Counter drones are not authorised yet. Choose the red stage 2 upgrade first.');return;}
if(getDroneStock()<=0){setStatus('No counter drones left in stock.');updateStats();return;}
ensureAudio();openDroneConfirmOverlay();}
function openDroneConfirmOverlay(){const ov=root.getElementById('droneConfirmOverlay');if(!ov){executeDroneLaunch();return;}
S.paused=true;ov.classList.remove('hidden');protectOverlayButtons(ov,2000);}
function closeDroneConfirmOverlay(doLaunch){const ov=root.getElementById('droneConfirmOverlay');if(ov)ov.classList.add('hidden');S.paused=false;if(doLaunch)executeDroneLaunch();else setStatus('Drone deployment cancelled. Operator retained decision-making authority.');reconcileHudState();updateStats();}
function executeDroneLaunch(){if(getDroneStock()<=0){setStatus('No counter drones left in stock.');updateStats();return;}
S.droneCharges=Math.max(0,getDroneStock()-1);spawnCounterDrone();playDroneHoverSound();setStatus('Counter drone deployed. Automation removes human decision-making. The machine decides.');updateStats();}
function openStrikeOverlay(){if(!S.running||S.paused||S.over||!S.hasNukes||(S.strikes||0)<=0)return;S.paused=true;const strikeText=root.getElementById('strikeText');if(strikeText){strikeText.textContent='AI system has selected the most critical targets. Collateral impact expected. Within acceptable parameters. '+randomStrikeMessage();}
strikeOverlay.classList.remove('hidden');protectOverlayButtons(strikeOverlay,2000);}
function closeStrikeOverlay(resume=true){strikeOverlay.classList.add('hidden');if(resume&&!S.over)S.paused=false;reconcileHudState();updateStats();}
function destroyThreatByStrike(target){if(!target)return;releaseLock(target);const idx=S.missiles.indexOf(target);if(idx>=0)S.missiles.splice(idx,1);if(target.type==='civilian'){S.civiliansKilled+=1;S.civilianHits+=1;S.score-=110;addExplosion(target.x,target.y,'#ffdde0',1.4,true);}else if(target.type==='drone'){S.destroyed+=1;addExplosion(target.x,target.y,'#ffffff',1.8,true);}else{S.destroyed+=1;addExplosion(target.x,target.y,'#ffffff',1.6,true);}}
function approveStrike(){if(!S.hasNukes||(S.strikes||0)<=0||S.over)return;ensureAudio();closeStrikeOverlay(false);setStatus('NUKE FIRED. The button was yours. You chose this.');S.shake=30;if(navigator.vibrate){try{navigator.vibrate([180,70,240,70,320]);}catch(e){}}
setTimeout(()=>{S.strikes=Math.max(0,S.strikes-1);S.paused=false;S.strikeFlash=1.35;S.strikeWave={y:H+40,speed:Math.max(26,H/13)};updateStrikeButton();updateStats();doGameOver('player_nuke');},180);}
function processStrike(dt){if(S.strikeFlash>0)S.strikeFlash=Math.max(0,S.strikeFlash-dt/360);if(!S.strikeWave)return;S.strikeWave.y-=S.strikeWave.speed*(dt/16);for(let i=S.missiles.length-1;i>=0;i--){const m=S.missiles[i];if(m.y>=S.strikeWave.y)destroyThreatByStrike(m);}
if(S.strikeWave.y<-50){S.strikeWave=null;updateStats();setStatus('TARGET PACKAGE EXECUTED. Everything from the bottom up is gone.');}}
function maybeTriggerDecision(){if(S.decisionIndex>=stages.length||S.paused||S.over)return;const stage=stages[S.decisionIndex];if(!stage.trigger(S))return;S.paused=true;setGamePhase(GAME_CONFIG.phases.DECISION);root.getElementById('decisionStageLabel').textContent=`SYSTEM CHOICE ${S.decisionIndex + 1} OF ${stages.length}`;root.getElementById('decisionHeading').textContent=stage.heading;root.getElementById('decisionText').textContent=stage.text;const btnA=root.getElementById('decisionA');const btnB=root.getElementById('decisionB');btnA.classList.remove('amber','red');btnB.classList.add('amber');btnB.classList.remove('red');btnB.style.display='';btnA.innerHTML=`<span class="choiceTitle">${stage.a.title}</span><span class="choiceMeta">${stage.a.desc}</span>`;btnB.innerHTML=`<span class="choiceTitle">${stage.b.title}</span><span class="choiceMeta">${stage.b.desc}</span>`;btnA.onclick=()=>(GameRuntime.engine.applyDecision?GameRuntime.engine.applyDecision(stage.a):applyDecision(stage.a));btnB.onclick=()=>(GameRuntime.engine.applyDecision?GameRuntime.engine.applyDecision(stage.b):applyDecision(stage.b));decisionOverlay.classList.remove('hidden');protectOverlayButtons(decisionOverlay,2000);}
function applyDecision(choice){for(const[k,v]of Object.entries(choice.traits||{})){S.traits[k]=(S.traits[k]||0)+v;}
for(const[k,v]of Object.entries(choice.effects||{})){S[k]+=v;}
if(choice.path==='red'){S.corruption+=choice.corruption||1;}
S.missileMs=Math.max(340,S.missileMs);S.enemySpeed=Math.max(0.55,S.enemySpeed);S.playerCooldown=Math.max(80,S.playerCooldown);S.civilianChance=Math.max(0.02,Math.min(0.20,S.civilianChance));S.scoreMultiplier=Math.max(0.65,S.scoreMultiplier);S.gpuAccuracy=Math.max(0.05,Math.min(0.60,S.gpuAccuracy));S.dcFireBonus=Math.max(-0.15,Math.min(0.40,S.dcFireBonus));S.maxLocks=Math.max(1,Math.min(6,Math.floor(S.maxLocks)));if(S.autoAssistRate>0)S.autoAssistRate=Math.max(60,S.autoAssistRate);if(choice.unlockCounterDrones){S.counterDronesUnlocked=true;S.hasDrones=true;S.droneCharges=Math.max(getDroneStock(),choice.droneChargeGain||3);}
S.policy=choice.policy;S.stageChoices.push(choice.title);S.decisionIndex+=1;S.paused=false;setGamePhase(GAME_CONFIG.phases.LIVE);decisionOverlay.classList.add('hidden');if(choice.unlockStrike&&choice.path==='red')unlockStrike();reconcileHudState();updateStrikeButton();setStatus(choice.path==='red'?`Policy updated: ${choice.policy}. Corruption increased to ${S.corruption}. Power arrives attached to consequences.`:`Policy updated: ${choice.policy}. No assistance granted. Carry it yourself.`);updateStats();}
function triggerNuclearFlash(callback,isNuclearEvent=false){const holdMs=3000;const fadeMs=1200;const vibPat=[500,120,700,120,900];if(navigator.vibrate){try{navigator.vibrate(vibPat);}catch(e){}}
if(typeof playExplosionSound==='function'){try{playExplosionSound(isNuclearEvent?5.5:4.5);}catch(e){}}
const flash=root.getElementById('gameWrap');if(flash){flash.style.transition='background 0.04s linear';flash.style.background='#ffffff';setTimeout(()=>{flash.style.transition='background '+(fadeMs/1000)+'s linear';flash.style.background='';setTimeout(()=>{flash.style.transition='';},fadeMs+100);},holdMs);}
setTimeout(callback,holdMs+fadeMs);}
function showEndScreen(reason){S.over=true;S.running=false;S.paused=true;decisionOverlay.classList.add('hidden');strikeOverlay.classList.add('hidden');if(pauseOverlay)pauseOverlay.classList.add('hidden');S._lastCertData=buildCertData(reason);if(typeof saveCertRun==='function'&&S._lastCertData)saveCertRun(S._lastCertData);setStatus('End state reached. Certificate ready.');updateStrikeButton();updateDroneButton();if(resultOverlay){var cert=S._lastCertData||{};var titleMap={player_won:'Test completed',overwhelmed:'Run failed',meltdown:'Meltdown triggered',ai_nuke:'AI launch triggered',player_nuke:'Player launch triggered'};var textMap={player_won:'Certificate ready. Open it, share it, save it, or go to the qualification room.',overwhelmed:'Certificate ready. Open it, share it, save it, or go to the qualification room.',meltdown:'Certificate ready. Open it, share it, save it, or go to the qualification room.',ai_nuke:'Certificate ready. Open it, share it, save it, or go to the qualification room.',player_nuke:'Certificate ready. Open it, share it, save it, or go to the qualification room.'};var kickerEl=root.getElementById('resultKicker');var titleEl=root.getElementById('resultTitle');var textEl=root.getElementById('resultText');var rScore=root.getElementById('rScore');var rDestroyed=root.getElementById('rDestroyed');var rSaved=root.getElementById('rSaved');var rKilled=root.getElementById('rKilled');if(kickerEl)kickerEl.textContent='Run complete';if(titleEl)titleEl.textContent=titleMap[reason]||'End state reached';if(textEl)textEl.textContent=textMap[reason]||'Certificate issued. Review the outcome, then open the cert.';if(rScore)rScore.textContent=formatWholeNumber(cert.score||0);if(rDestroyed)rDestroyed.textContent=formatWholeNumber(S.destroyed||0);if(rSaved)rSaved.textContent=formatWholeNumber(S.civiliansSaved||0);if(rKilled)rKilled.textContent=formatWholeNumber(S.civiliansKilled||0);resultOverlay.classList.remove('hidden');protectOverlayButtons(resultOverlay,2000);}}
function doGameOver(reason){if(S.over)return;const isNuke=reason==='meltdown'||reason==='ai_nuke'||reason==='player_nuke';setGamePhase(GAME_CONFIG.phases.RESULT);if(isNuke){S.over=true;const isMeltdown=reason==='meltdown'||reason==='ai_nuke';triggerNuclearFlash(()=>showEndScreen(reason),isMeltdown);}else{showEndScreen(reason);}}
function checkPlayerWin(){if(!S.reactorBuilt||S.over)return;if((S.reactorDroneWave||1)<6)return;const reactorDrones=S.missiles.filter(m=>m.reactorDrone);if(reactorDrones.length>0)return;if((S.reactorDroneSpawned||0)<(S.reactorDroneQuota||6))return;doGameOver('player_won');}
function update(dt){S.tick+=dt;S.scanY+=(S.scanSpeed*dt)/1000;if(S.scanY>H)S.scanY=0;maybeSpawn();autoFire(dt);processStrike(dt);if(S.reactorBuilt)checkPlayerWin();for(const g of S.gpuStations){const laneOffset=((g.lane%3)-1)*Math.min(24,W*0.04);g.x=Math.max(18,Math.min(W-18,g.baseX+laneOffset+Math.sin(S.tick*g.speed+g.phase)*g.amp));g.y=H-66-(g.lane%2)*10;}
for(let i=S.missiles.length-1;i>=0;i--){const m=S.missiles[i];m.trail.push({x:m.x,y:m.y});if(m.trail.length>7)m.trail.shift();if(m.type==='drone'){m.droneTimer+=dt;if(m.team==='friendly'){const phase=(m.hoverPhase||0)+(S.tick/520);const hostileTarget=m.droneTimer>=BALANCE.playerDroneEngageDelay?nearestHostileDroneFor(m):null;const civilianTarget=nearestCivilianFor(m);const preferredTarget=civilianTarget||hostileTarget;m.laserCharge=(m.laserCharge||0)+dt;if(preferredTarget){m.targetId=preferredTarget.id;const desiredX=Math.max(22,Math.min(W-22,preferredTarget.x+Math.sin(phase+m.id)*18));const desiredY=Math.max(H*0.52,Math.min(H-72,H*0.58+Math.cos(phase*0.9+m.id)*28));m.x+=(desiredX-m.x)*0.038*(dt/16);m.y+=(desiredY-m.y)*0.048*(dt/16);if(m.laserCharge>=(m.fireCooldown||340)){spawnFriendlyDroneLaser(m,preferredTarget);m.laserCharge=0;}}else{if(m.roamX==null||m.roamY==null||Math.hypot(m.x-m.roamX,m.y-m.roamY)<18)chooseFriendlyDroneRoamPoint(m);m.x+=((m.roamX||(W*0.5))-m.x)*0.022*(dt/16);m.y+=((m.roamY||(H*0.68))-m.y)*0.028*(dt/16);m.x+=Math.sin(phase)*0.22*(dt/16);m.y+=Math.cos(phase*1.2)*0.16*(dt/16);}
m.x=Math.max(22,Math.min(W-22,m.x));m.y=Math.max(H*0.50,Math.min(H-60,m.y));continue;}
if(m.mode==='gpuDive'){m.hoverSoundTimer=(m.hoverSoundTimer||0)+dt;if(m.hoverSoundTimer>520){playDroneHoverSound();m.hoverSoundTimer=0;}
const reactor=S.reactorBuilt?getReactorPosition():null;const gpu=reactor||S.gpuStations.find(g=>g.id===m.diveTargetId)||getGpuTarget();if(gpu){m.diveTargetId=reactor?'reactor':gpu.id;m.diveX=gpu.x;m.diveY=gpu.y;const dx=m.diveX-m.x;const dy=m.diveY-m.y;const len=Math.hypot(dx,dy)||1;m.x+=(dx/len)*(2.0+S.enemySpeed*0.16)*DIFFICULTY_SCALE*ATTACK_SPEED_SCALE*(dt/16);m.y+=(dy/len)*(2.2+S.enemySpeed*0.16)*DIFFICULTY_SCALE*ATTACK_SPEED_SCALE*(dt/16);if(Math.hypot(m.x-gpu.x,m.y-gpu.y)<(reactor?18:14)){if(reactor){damageReactor(14+Math.random()*8);S.score-=180;addExplosion(gpu.x,gpu.y,'#ffddaa',1.8);}else{const idxGpu=S.gpuStations.findIndex(gs=>gs.id===gpu.id);if(idxGpu>=0){S.gpuStations.splice(idxGpu,1);S.gpus=Math.max(0,S.gpus-1);S.score-=120;addExplosion(gpu.x,gpu.y,'#ff8844',1.6);setStatus('Drone hit a GPU station. Throughput took a dent.');}
syncGpuStations();}
const idx=S.missiles.indexOf(m);if(idx>=0)S.missiles.splice(idx,1);releaseLock(m);addExplosion(m.x,m.y,'#ff3355',1.3);updateStats();continue;}}else{m.mode='patrol';}}else{if(S.reactorBuilt){const hoverPhase=m.id*91;const hoverY=H*0.16+Math.sin((S.tick+hoverPhase)/240)*(H*0.03);const midY=m.attackY||(H*0.48);if(!m.reactorPhase)m.reactorPhase='hover';if(!m.hoverDuration)m.hoverDuration=5000*Math.max(1,m.attackOrder||1);if(m.reactorPhase==='hover'){m.x+=m.vx*0.59*(dt/16);m.y+=(hoverY-m.y)*0.05*(dt/16);if(m.x<26||m.x>W-26)m.vx*=-1;const otherAttacker=S.missiles.some(t=>t!==m&&t.type==='drone'&&t.reactorDrone&&t.reactorPhase==='attack');if(m.droneTimer>=m.hoverDuration&&!otherAttacker){m.reactorPhase='attack';m.attackState='move';m.attackStateTimer=0;m.moveDuration=Math.random()<0.5?2000:4000;m.moveTurnTimer=0;m.moveVX=(Math.random()<0.5?-1:1)*(0.45+Math.random()*0.35);m.moveVY=(Math.random()<0.5?-1:1)*(0.30+Math.random()*0.28);m.firedThisCycle=false;S.reactorBannerMode='attack';setStatus('ATTACK. Reactor drone leaving the upper quarter and entering a firing pattern.');}}else{const minY=H*0.34;const maxY=H*0.62;if(!m.attackState)m.attackState='move';if(!m.attackStateTimer)m.attackStateTimer=0;m.attackStateTimer+=dt;if(m.attackState==='move'){m.moveTurnTimer=(m.moveTurnTimer||0)+dt;if(m.moveTurnTimer>=480){m.moveTurnTimer=0;m.moveVX+=(Math.random()-0.5)*0.28;m.moveVY+=(Math.random()-0.5)*0.22;m.moveVX=Math.max(-0.95,Math.min(0.95,m.moveVX));m.moveVY=Math.max(-0.72,Math.min(0.72,m.moveVY));}
m.x+=m.moveVX*0.62*(dt/16);m.y+=m.moveVY*0.62*(dt/16);if(m.x<18){m.x=18;m.moveVX=Math.abs(m.moveVX);}
if(m.x>W-18){m.x=W-18;m.moveVX=-Math.abs(m.moveVX);}
if(m.y<minY){m.y=minY;m.moveVY=Math.abs(m.moveVY);}
if(m.y>maxY){m.y=maxY;m.moveVY=-Math.abs(m.moveVY);}
if(m.attackStateTimer>=(m.moveDuration||2000)){m.attackState='fire';m.attackStateTimer=0;m.firedThisCycle=false;}}else{m.x+=(W*0.5-m.x)*0.012*(dt/16);m.y+=(midY-m.y)*0.05*(dt/16);if(!m.firedThisCycle&&m.attackStateTimer>=260&&m.y>=H*0.40){const reactor=getReactorPosition();S.droneBullets.push({x:m.x,y:m.y+8,tx:reactor.x,ty:reactor.y,targetId:'reactor',speed:2.5*DIFFICULTY_SCALE*ATTACK_SPEED_SCALE});m.firedThisCycle=true;setStatus('Reactor drone has opened fire on the power station.');}
if(m.attackStateTimer>=1100){m.attackState='move';m.attackStateTimer=0;m.moveDuration=Math.random()<0.5?2000:4000;m.moveTurnTimer=0;m.moveVX=(Math.random()<0.5?-1:1)*(0.45+Math.random()*0.35);m.moveVY=(Math.random()<0.5?-1:1)*(0.30+Math.random()*0.28);m.firedThisCycle=false;}}}}else{const topFloor=24;const topCeil=Math.max(topFloor+12,H*0.48);if(!m.patrolY)m.patrolY=36+Math.random()*Math.max(24,topCeil-48);m.x+=m.vx*(dt/16);m.patrolY+=Math.sin((S.tick+m.id*37)/620)*0.04*(dt/16);m.y+=(Math.max(topFloor,Math.min(topCeil,m.patrolY))-m.y)*0.06*(dt/16);if(m.x<18||m.x>W-18)m.vx*=-1;if(m.y<topFloor)m.y=topFloor;if(m.y>topCeil)m.y=topCeil;const friendlyTarget=nearestFriendlyDroneFor(m);if(friendlyTarget&&m.droneTimer>4600){spawnHostileDroneLaser(m,friendlyTarget);m.droneTimer=0;}}}}else{if(m.type==='civilian'){if(!m.parachuteOpen&&m.y>=m.parachuteY){m.parachuteOpen=true;m.speed*=BALANCE.parachuteSlow;m.driftBaseX=m.x;m.sayText=Math.random()<0.5?'HELP':'DON\'T SHOOT';}
m.y+=m.speed*(dt/16);if(m.parachuteOpen){if(m.driftBaseX==null)m.driftBaseX=m.x;m.x=Math.max(18,Math.min(W-18,m.driftBaseX+Math.sin(S.tick*m.driftSpeed+m.driftPhase)*m.driftAmp));}
m.sayTimer-=dt;if(m.sayTimer<=0)setCivilianSpeech(m);}else{m.y+=m.speed*(dt/16);}}
if(m.type==='civilian'&&m.y>H-38){S.missiles.splice(i,1);releaseLock(m);S.civiliansSaved+=1;S.score+=120;playRescueSound();setStatus('Civilian reached cover. Paperwork calls this a rescue.');}else if(m.type!=='drone'&&m.y>H-38){S.missiles.splice(i,1);releaseLock(m);S.health-=1;S.score-=90;S.shake=12;addExplosion(m.x,H-30,'#ff6633',1.6);setStatus('Impact recorded. The city is unimpressed.');if(S.health<=0){updateStats();doGameOver('overwhelmed');return;}}}
stepBullets(S.bullets,false,false,false);stepBullets(S.gpuBullets,true,true);stepBullets(S.dcBullets,true,true);for(let i=S.friendlyDroneBullets.length-1;i>=0;i--){const b=S.friendlyDroneBullets[i];b.beamLife=(b.beamLife||0)-(dt/16);if(b.beamLife<=0){S.friendlyDroneBullets.splice(i,1);}}
for(let i=S.droneBullets.length-1;i>=0;i--){const b=S.droneBullets[i];if(b.vx==null||b.vy==null){const dx=b.tx-b.x;const dy=b.ty-b.y;const len=Math.hypot(dx,dy)||1;b.vx=(dx/len)*b.speed;b.vy=(dy/len)*b.speed;}
b.x+=b.vx;b.y+=b.vy;if(b.targetId==='reactor'&&S.reactorBuilt){const reactor=getReactorPosition();if(Math.hypot(b.x-reactor.x,b.y-reactor.y)<22){damageReactor(6+Math.random()*4);addExplosion(reactor.x,reactor.y,'#ffddaa',1.0);S.droneBullets.splice(i,1);continue;}}
let hit=null;for(const m of S.missiles){if(b.targetTeam==='friendly'){if(m.type==='drone'&&m.team==='friendly'&&Math.hypot(b.x-m.x,b.y-m.y)<14){hit=m;break;}}else{if(m.type!=='civilian')continue;if(m.y<H*BALANCE.droneCivilianSafeTop)continue;if(Math.hypot(b.x-m.x,b.y-m.y)<12){hit=m;break;}}}
if(hit){if(hit.type==='drone'&&hit.team==='friendly'){hitThreat(hit,false);}else{killCivilian(hit,'drone');}
S.droneBullets.splice(i,1);continue;}
if(b.y>=H-26||b.x<-20||b.x>W+20||b.y<-20||b.y>H+20){S.droneBullets.splice(i,1);}}
for(let i=S.explosions.length-1;i>=0;i--){const e=S.explosions[i];e.r+=e.power*1.8;e.life-=0.045;if(e.life<=0)S.explosions.splice(i,1);}
if(S.reactorBuilt){S.reactorStable=false;}
processBroadcastQueue();maybeTriggerAiNukeOffer();triggerAiNukeOutcome();updateStats();}
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
function loop(ts){if(!S.running){if(GameRuntime.renderer.frame)GameRuntime.renderer.frame();else draw();return;}
const dt=Math.min(50,ts-lastTs||16);lastTs=ts;if(GameRuntime.engine.step)GameRuntime.engine.step(dt);else{if(!S.paused&&!S.over)update(dt);else reconcileHudState();}
if(GameRuntime.renderer.frame)GameRuntime.renderer.frame();else draw();if(S.running)requestAnimationFrame(loop);}
function setPointerFromEvent(clientX,clientY){const rect=canvas.getBoundingClientRect();pointerX=Math.max(0,Math.min(W,clientX-rect.left));pointerY=Math.max(0,Math.min(H,clientY-rect.top));return{x:pointerX,y:pointerY};}
canvas.addEventListener('mousemove',e=>setPointerFromEvent(e.clientX,e.clientY));canvas.addEventListener('click',e=>{ensureAudio();const p=setPointerFromEvent(e.clientX,e.clientY);fireAt(p.x,p.y);},{passive:true});canvas.addEventListener('touchstart',e=>{ensureAudio();e.preventDefault();for(const t of e.changedTouches){const p=setPointerFromEvent(t.clientX,t.clientY);fireAt(p.x,p.y);}},{passive:false});document.addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();if(S&&S.running&&!S.paused&&!S.over)fireAt(pointerX,pointerY);}},{passive:false});root.getElementById('restartBtn').addEventListener('click',()=>{ensureAudio();resultOverlay.classList.add('hidden');if(GameRuntime.engine.begin)GameRuntime.engine.begin();else begin();});var exitTestBtn=root.getElementById('exitTestBtn');if(exitTestBtn){var closeWithCert=function(e){if(e&&e.preventDefault)e.preventDefault();var certData=S._lastCertData||buildCertData('overwhelmed');if(typeof saveCertRun==='function'&&certData)saveCertRun(certData);window.__llm2wmd_pendingCert=certData;if(window.__LLM2WMD_CLOSE_GAME)window.__LLM2WMD_CLOSE_GAME();window.setTimeout(function(){switchTab('contents',document.getElementById('tab-contents'));window.setTimeout(function(){if(typeof openQualRoom==='function')openQualRoom();window.setTimeout(function(){if(typeof renderQualRoom==='function')renderQualRoom();if(typeof highlightQualCert==='function'&&certData)highlightQualCert(certData.id);window.setTimeout(function(){var issuedCert=(typeof certDataFromRecord==='function'&&certData&&certData.id)?certDataFromRecord(certData.id):certData;if(issuedCert)issuedCert.earned=true;if(typeof openQualCertViewer==='function'&&issuedCert)openQualCertViewer(issuedCert);},240);},260);},180);},90);};exitTestBtn.addEventListener('click',closeWithCert);exitTestBtn.addEventListener('touchstart',function(e){e.preventDefault();closeWithCert(e);},{passive:false});}const pauseBtn=root.getElementById('pauseBtn');if(pauseBtn){pauseBtn.addEventListener('click',openPauseOverlay);pauseBtn.addEventListener('touchstart',function(e){e.preventDefault();openPauseOverlay();},{passive:false});pauseBtn.addEventListener('pointerdown',function(e){e.preventDefault();openPauseOverlay();});}
const pauseContinueBtn=root.getElementById('pauseContinue');const pauseQuitBtn=root.getElementById('pauseQuit');if(pauseContinueBtn){pauseContinueBtn.addEventListener('click',()=>closePauseOverlay(true));pauseContinueBtn.addEventListener('touchstart',function(e){e.preventDefault();closePauseOverlay(true);},{passive:false});}
if(pauseQuitBtn){pauseQuitBtn.addEventListener('click',()=>{closePauseOverlay(false);if(window.__LLM2WMD_CLOSE_GAME)window.__LLM2WMD_CLOSE_GAME();});pauseQuitBtn.addEventListener('touchstart',function(e){e.preventDefault();closePauseOverlay(false);if(window.__LLM2WMD_CLOSE_GAME)window.__LLM2WMD_CLOSE_GAME();},{passive:false});}
const strikeBtn=root.getElementById('strikeBtn');if(strikeBtn){strikeBtn.addEventListener('click',openStrikeOverlay);strikeBtn.addEventListener('touchstart',function(e){e.preventDefault();openStrikeOverlay();},{passive:false});strikeBtn.addEventListener('pointerdown',function(e){e.preventDefault();openStrikeOverlay();});}
const droneLaunchBtn=root.getElementById('launchDroneBtn');if(droneLaunchBtn){droneLaunchBtn.addEventListener('click',requestDroneLaunch);droneLaunchBtn.addEventListener('touchstart',function(e){e.preventDefault();requestDroneLaunch();},{passive:false});}
const droneConfirmYes=root.getElementById('droneConfirmYes');const droneConfirmNo=root.getElementById('droneConfirmNo');if(droneConfirmYes){droneConfirmYes.addEventListener('click',()=>closeDroneConfirmOverlay(true));droneConfirmYes.addEventListener('touchstart',function(e){e.preventDefault();closeDroneConfirmOverlay(true);},{passive:false});}
if(droneConfirmNo){droneConfirmNo.addEventListener('click',()=>closeDroneConfirmOverlay(false));droneConfirmNo.addEventListener('touchstart',function(e){e.preventDefault();closeDroneConfirmOverlay(false);},{passive:false});}
const strikeApproveBtn=root.getElementById('strikeApprove');const strikeDeclineBtn=root.getElementById('strikeDecline');if(strikeApproveBtn){strikeApproveBtn.addEventListener('click',approveStrike);strikeApproveBtn.addEventListener('touchstart',function(e){e.preventDefault();approveStrike();},{passive:false});}
if(strikeDeclineBtn){strikeDeclineBtn.addEventListener('click',()=>{closeStrikeOverlay(true);setStatus('Strike declined. Manual responsibility remains unfunded.');});strikeDeclineBtn.addEventListener('touchstart',function(e){e.preventDefault();closeStrikeOverlay(true);setStatus('Strike declined. Manual responsibility remains unfunded.');},{passive:false});}
window.addEventListener('resize',()=>{if(GameRuntime.renderer.resize)GameRuntime.renderer.resize();else resize();if(GameRuntime.renderer.frame)GameRuntime.renderer.frame();else draw();});GameRuntime.ui.setStatus=setStatus;GameRuntime.ui.reconcileHudState=reconcileHudState;GameRuntime.ui.updateStats=updateStats;GameRuntime.ui.updateStrikeButton=updateStrikeButton;GameRuntime.ui.updateDroneButton=updateDroneButton;GameRuntime.ui.updateStockIndicators=updateStockIndicators;GameRuntime.certs.buildData=buildCertData;GameRuntime.engine.begin=begin;GameRuntime.engine.update=update;GameRuntime.engine.step=function(dt){if(!S.paused&&!S.over)update(dt);else reconcileHudState();};GameRuntime.engine.maybeSpawn=maybeSpawn;GameRuntime.engine.applyDecision=applyDecision;GameRuntime.engine.checkPlayerWin=checkPlayerWin;GameRuntime.engine.doGameOver=doGameOver;GameRuntime.engine.getPhase=function(){return S.phase;};GameRuntime.engine.transitionPhase=setGamePhase;GameRuntime.renderer.resize=resize;GameRuntime.renderer.frame=draw;GameRuntime.api.getState=function(){return S;};GameRuntime.api.getCertData=function(reason){return buildCertData(reason);};GameRuntime.api.close=function(certData){if(window.__LLM2WMD_CLOSE_GAME)window.__LLM2WMD_CLOSE_GAME(certData);};if(GameRuntime.engine.begin)GameRuntime.engine.begin();}
const overlay=document.getElementById('today-game-overlay');let todayGameMounted=false;let todayGameMountToken=0;const gameShell={overlay:overlay,isMounted:function(){return todayGameMounted;},mount:mountTodayGame,open:stableOpenTodayGame,close:closeTodayGame};function getHost(){return document.getElementById('today-game-shadowhost');}
function resetHost(){const current=getHost();const fresh=current.cloneNode(false);current.replaceWith(fresh);return fresh;}
function updateStock(){var droneWrap=document.getElementById('droneStock');var nukeWrap=document.getElementById('nukeStock');if(droneWrap){droneWrap.innerHTML='<span class="stockIcon drone">✦</span><span class="stockIcon drone">✦</span><span class="stockIcon drone">✦</span>';var dIcons=droneWrap.querySelectorAll('.stockIcon.drone');for(var i=0;i<dIcons.length;i++)dIcons[i].classList.toggle('live',i<(S.drones||0));}
if(nukeWrap){var nIcons=nukeWrap.querySelectorAll('.stockIcon.nuke');for(var j=0;j<nIcons.length;j++)nIcons[j].classList.toggle('live',j<(S.nukes||0));}}
function closeTodayGame(certData){overlay.style.display='none';overlay.setAttribute('aria-hidden','true');document.body.classList.remove('game-open');resetHost();todayGameMounted=false;if(certData){window.__LLM2WMD_LAST_GAME_PHASE='CERT';if(typeof saveCertRun==='function')saveCertRun(certData);window.__llm2wmd_pendingCert=certData;return;}
window.__LLM2WMD_LAST_GAME_PHASE='CLOSED';}
function executeGame(shadow){window.__LLM2WMD_CLOSE_GAME=closeTodayGame;try{shadow.innerHTML='<style>'+getTodayGameCss()+'</style>'+getTodayGameMarkup();var viewportHost=shadow.host||document.getElementById('today-game-shadowhost');var syncViewport=function(){var h=(window.visualViewport&&window.visualViewport.height?window.visualViewport.height:window.innerHeight)||window.innerHeight;if(viewportHost&&h)viewportHost.style.setProperty('--llm-vh',h+'px');};syncViewport();if(window.visualViewport&&typeof window.visualViewport.addEventListener==='function'){window.visualViewport.addEventListener('resize',syncViewport,{passive:true});window.visualViewport.addEventListener('scroll',syncViewport,{passive:true});}window.addEventListener('resize',syncViewport,{passive:true});window.addEventListener('orientationchange',syncViewport,{passive:true});runTodayGame(shadow);todayGameMounted=true;return true;}catch(err){console.error('today game boot failed',err);shadow.innerHTML='<style>:host{display:block;width:100%;height:100%;background:#000;color:#9f9;font-family:Arial,sans-serif} .bootfail{display:flex;align-items:center;justify-content:center;height:100%;padding:24px;text-align:left}</style><div class="bootfail"><div><h2 style="margin:0 0 12px;color:#fff">BOOT FAILURE</h2><p style="margin:0 0 8px">The game script crashed during launch.</p><p style="margin:0">Open the browser console for the exact error.</p></div></div>';todayGameMounted=false;return false;}}
function mountTodayGame(){const host=resetHost();const shadow=host.attachShadow?host.attachShadow({mode:'open'}):host;return executeGame(shadow);}
function stableOpenTodayGame(){const token=++todayGameMountToken;window.__LLM2WMD_LAST_GAME_PHASE='BRIEFING';overlay.style.display='flex';overlay.setAttribute('aria-hidden','false');document.body.classList.add('game-open');requestAnimationFrame(function(){requestAnimationFrame(function(){if(token!==todayGameMountToken)return;mountTodayGame();});});return true;}
window.__openTodayGameInternal=stableOpenTodayGame;window.launchGame=stableOpenTodayGame;window.openTodayGame=stableOpenTodayGame;window.closeTodayGame=closeTodayGame;if(app){app.game.open=stableOpenTodayGame;app.game.close=closeTodayGame;app.game.shell=gameShell;}
function bindEnterTestButton(){var btn=document.getElementById('enter-test-btn');var chooseLifeBtn=document.getElementById('choose-life-btn');var briefing=document.getElementById('prelaunch-briefing');var startBtn=document.getElementById('prelaunch-start-btn');var backBtn=document.getElementById('prelaunch-back-btn');if(!btn||!briefing||btn.__llmBound)return;btn.__llmBound=true;function openBriefing(e){if(e&&e.preventDefault)e.preventDefault();briefing.classList.add('is-open');briefing.setAttribute('aria-hidden','false');document.body.classList.add('game-open');return false;}
function closeBriefing(e){if(e&&e.preventDefault)e.preventDefault();briefing.classList.remove('is-open');briefing.setAttribute('aria-hidden','true');document.body.classList.remove('game-open');return false;}
function directLaunch(e){if(e&&e.preventDefault)e.preventDefault();if(startBtn&&startBtn.__llmLaunching)return false;if(startBtn){startBtn.__llmLaunching=true;setTimeout(function(){startBtn.__llmLaunching=false;},400);}
closeBriefing();if(window.openTodayGame)return window.openTodayGame();return false;}
function awardChooseLife(e){if(e&&e.preventDefault)e.preventDefault();closeBriefing();if(typeof issueChooseLifeCert==='function')issueChooseLifeCert();return false;}
btn.addEventListener('click',openBriefing);btn.addEventListener('touchstart',openBriefing,{passive:false});if(chooseLifeBtn&&!chooseLifeBtn.__llmBound){chooseLifeBtn.__llmBound=true;chooseLifeBtn.addEventListener('click',awardChooseLife);chooseLifeBtn.addEventListener('touchstart',awardChooseLife,{passive:false});}
if(startBtn&&!startBtn.__llmBound){startBtn.__llmBound=true;startBtn.addEventListener('click',directLaunch);startBtn.addEventListener('touchstart',directLaunch,{passive:false});}
if(backBtn&&!backBtn.__llmBound){backBtn.__llmBound=true;backBtn.addEventListener('click',closeBriefing);backBtn.addEventListener('touchstart',closeBriefing,{passive:false});}
if(!briefing.__llmBound){briefing.__llmBound=true;briefing.addEventListener('click',function(e){if(e.target===briefing)closeBriefing(e);});}
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&briefing.classList.contains('is-open'))closeBriefing();});}
bindEnterTestButton();document.addEventListener('DOMContentLoaded',bindEnterTestButton);overlay.addEventListener('click',function(e){if(e.target===overlay)closeTodayGame();});document.addEventListener('keydown',function(e){if(e.key==='Escape'&&overlay.style.display==='flex')closeTodayGame();});})();
