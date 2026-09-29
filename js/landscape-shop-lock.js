
(function(){
  var mq = window.matchMedia("(orientation:landscape) and (max-height:500px) and (max-width:1024px)");
  var savedScrollY = 0;
  function enterLock(){
    if(document.body.classList.contains("landscape-shop-lock"))return;
    savedScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    if(typeof closeMobileNav==="function"){ try{ closeMobileNav(); }catch(e){} }
    document.body.classList.add("landscape-shop-lock");
    var chipEl = document.getElementById("dyson-chip-img");
    if(chipEl) chipEl.style.setProperty("display","none","important");
    var skullEl = document.getElementById("skull-bg");
    if(skullEl) skullEl.style.setProperty("display","none","important");
    if(typeof maybeShowTabIntro==="function"){ try{ maybeShowTabIntro("shop"); }catch(e){} }
    try{ history.replaceState(history.state,"","#shop"); }catch(e){}
    window.scrollTo(0,0);
  }
  function exitLock(){
    if(!document.body.classList.contains("landscape-shop-lock"))return;
    document.body.classList.remove("landscape-shop-lock");
    var chipEl = document.getElementById("dyson-chip-img");
    if(chipEl) chipEl.style.removeProperty("display");
    var skullEl = document.getElementById("skull-bg");
    if(skullEl) skullEl.style.removeProperty("display");
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        window.scrollTo(0, savedScrollY);
      });
    });
  }
  function handleChange(e){
    if(e.matches) enterLock(); else exitLock();
  }
  if(mq.addEventListener){ mq.addEventListener("change", handleChange); }
  else if(mq.addListener){ mq.addListener(handleChange); }
  function initCheck(){ if(mq.matches) enterLock(); }
  if(document.readyState==="loading"){ document.addEventListener("DOMContentLoaded", initCheck); }
  else { initCheck(); }
})();
