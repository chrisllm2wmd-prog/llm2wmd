
(function(){
  function getUA(){return navigator.userAgent||navigator.vendor||window.opera||'';}
  function detectProblemBrowser(){
    var ua=getUA();
    if(/FBAN|FBAV|FB_IAB|FBIOS|FB4A/i.test(ua))return'facebook';
    if(/SamsungBrowser/i.test(ua))return'samsung';
    return null;
  }
  var BW_COPY={
    facebook:{
      kicker:'BROWSER WARNING',
      title:"YOU'RE INSIDE FACEBOOK'S BROWSER",
      body:"Meta has routed this page through its own in-app browser instead of yours. Local storage doesn\u2019t reliably persist here, and scripts don\u2019t always run the way they should. The shop, the quiz, and Headline Mode may quietly stop working, and nothing in here will tell you why.<br><br>It's a company built on extracting attention deciding how you're allowed to look at a site about what happens when that kind of power keeps compounding.<br><br>Screw you Zuckerberg.<br><br>Open this in Chrome instead."
    },
    samsung:{
      kicker:'BROWSER WARNING',
      title:'SAMSUNG INTERNET DETECTED',
      body:"This browser handles scripts and local storage differently than Chrome does. Expect the shop, the quiz, and Headline Mode to misbehave in ways that are hard to predict and harder to explain.<br><br>Open this in Chrome instead."
    }
  };
  function buildOverlay(kind){
    var c=BW_COPY[kind];
    var ov=document.createElement('div');
    ov.id='browser-warning-overlay';
    ov.setAttribute('role','dialog');
    ov.setAttribute('aria-modal','true');
    ov.setAttribute('aria-label','Browser warning');
    ov.innerHTML=
      '<div class="bw-card">'+
        '<button type="button" class="bw-close" onclick="closeBrowserWarning()" aria-label="Close">&#10005;</button>'+
        '<div class="bw-kicker">'+c.kicker+'</div>'+
        '<div class="bw-title">'+c.title+'</div>'+
        '<div class="bw-body">'+c.body+'</div>'+
        '<div class="bw-actions"><button type="button" class="bw-btn-primary" onclick="llm2wmdEscapeBrowser()">OPEN IN CHROME &rarr;</button></div>'+
        '<div class="bw-fallback">Or open the menu (usually \u22EF or \u2261) in the corner and choose \u201COpen in Browser.\u201D</div>'+
      '</div>';
    document.body.appendChild(ov);
    return ov;
  }
  window.closeBrowserWarning=function(){
    var ov=document.getElementById('browser-warning-overlay');
    if(!ov)return;
    ov.classList.remove('is-open');
    document.body.classList.remove('browser-warning-open');
    setTimeout(function(){if(ov&&ov.parentNode)ov.parentNode.removeChild(ov);},300);
  };
  window.llm2wmdEscapeBrowser=function(){
    var ua=getUA();
    var href=window.location.href;
    var isAndroid=/Android/i.test(ua);
    var isIOS=/iPhone|iPad|iPod/i.test(ua);
    if(isAndroid){
      var stripped=href.replace(/^https?:\/\//,'');
      /* S.browser_fallback_url is the piece that was missing before — if Chrome can't be
         resolved on this device, Android redirects back to this same https URL instead of
         throwing the hard "site can't be reached" error. With it, this is Google's own
         documented pattern for jumping straight to Chrome from inside another app's browser. */
      window.location='intent://'+stripped+'#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url='+encodeURIComponent(href)+';end';
      return;
    }
    if(isIOS){
      /* Chrome registers its own URL scheme on iOS specifically for this — googlechromes:// for
         an https page, googlechrome:// for http. If Chrome's installed, this opens it directly
         to this exact page; if it's not installed, iOS just ignores the scheme rather than
         showing a page-level error. */
      var strippedIOS=href.replace(/^https:\/\//,'').replace(/^http:\/\//,'');
      var scheme=href.indexOf('https://')===0?'googlechromes://':'googlechrome://';
      window.location=scheme+strippedIOS;
      return;
    }
  };
  function initBrowserWarning(){
    var kind=detectProblemBrowser();
    if(!kind)return;
    var ov=buildOverlay(kind);
    requestAnimationFrame(function(){
      ov.classList.add('is-open');
      document.body.classList.add('browser-warning-open');
    });
    ov.addEventListener('click',function(e){if(e.target===ov)closeBrowserWarning();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')closeBrowserWarning();});
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',initBrowserWarning);
  }else{
    initBrowserWarning();
  }
})();
