
var KLAVIYO_PUBLIC_KEY='R6qni3';
var KLAVIYO_LIST_ID='YynFxz';
function survivorSignupSubmit(e){
  if(e&&e.preventDefault)e.preventDefault();
  var emailInput=document.getElementById('ss-email');
  var email=emailInput?emailInput.value.trim():'';
  var btn=document.getElementById('ss-submit-btn');
  var msg=document.getElementById('ss-message');
  if(!email){return false;}
  if(btn){btn.disabled=true;btn.textContent='JOINING\u2026';}
  if(msg){msg.className='ss-message';msg.textContent='';}
  var fd=new FormData();
  fd.append('g',KLAVIYO_LIST_ID);
  fd.append('email',email);
  fetch('https://manage.kmail-lists.com/ajax/subscriptions/subscribe',{method:'POST',mode:'no-cors',body:fd})
    .then(function(){ survivorSignupSuccess(); })
    .catch(function(){ survivorSignupFallback(email); });
  return false;
}
function survivorSignupSuccess(){
  var msg=document.getElementById('ss-message');
  var form=document.getElementById('ss-form');
  try{ if(typeof lsSet==='function') lsSet('llm2wmd_survivor','1'); }catch(err){}
  if(form) form.style.display='none';
  if(msg){msg.className='ss-message ss-success';msg.textContent="YOU'RE IN. Check your inbox for the discount code.";}
}
function survivorSignupFallback(email){
  var btn=document.getElementById('ss-submit-btn');
  var msg=document.getElementById('ss-message');
  if(btn){btn.disabled=false;btn.textContent='JOIN';}
  if(msg){msg.className='ss-message ss-error';msg.textContent="Couldn't reach the signup service \u2014 try again in a moment.";}
}
