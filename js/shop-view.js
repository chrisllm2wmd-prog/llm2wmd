
(function(){
  var shopSection = document.getElementById('shop-section');
  if(!shopSection) return;
  function setShopView(active){
    document.body.classList.toggle('shop-view-active', active);
  }
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        setShopView(entry.isIntersecting);
      });
    }, {threshold: 0.08});
    io.observe(shopSection);
  } else {
    window.addEventListener('scroll', function(){
      var r = shopSection.getBoundingClientRect();
      setShopView(r.top < window.innerHeight * 0.9 && r.bottom > 0);
    }, {passive:true});
  }
  var origOpenShop = window.llm2wmdOpenShop;
  if(typeof origOpenShop === 'function'){
    window.llm2wmdOpenShop = function(targetSelector){
      setShopView(true);
      return origOpenShop(targetSelector);
    };
  }
})();
