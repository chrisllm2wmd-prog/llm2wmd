
(function(){
  var NARROW_PAGE_IDS=['page-timeline','page-headlines','page-faq','page-contents','page-mission','page-thesis','page-review'];
  var wrap=null;

  function pickWidgetItems(){
    if(typeof DM_DATA==='undefined'||typeof DM_NAMES==='undefined')return [];
    var ids=Object.keys(DM_DATA);
    for(var i=ids.length-1;i>0;i--){
      var j=Math.floor(Math.random()*(i+1));
      var t=ids[i];ids[i]=ids[j];ids[j]=t;
    }
    var count=(Math.random()<0.5?3:4);
    return ids.slice(0,Math.min(count,ids.length));
  }

  function renderWidget(){
    var itemsEl=document.getElementById('lsw-items');
    if(!itemsEl)return;
    var picks=pickWidgetItems();
    if(!picks.length)return;
    var html='<div class="lsw-kicker">FROM THE SHOP</div>';
    picks.forEach(function(pid){
      var colors=Object.keys(DM_DATA[pid]||{});
      if(!colors.length)return;
      var color=colors[Math.floor(Math.random()*colors.length)];
      var views=DM_DATA[pid][color];
      if(!views||!views.length)return;
      var view=views[0];
      var name=DM_NAMES[pid]||pid;
      var safeName=String(name).replace(/"/g,'&quot;');
      var safeLabel=String(view.label||name).replace(/"/g,'&quot;');
      html+='<a class="lsw-item" href="javascript:void(0)" data-pid="'+pid+'" aria-label="'+safeName+'">'
          +'<img src="'+view.src+'" alt="'+safeLabel+'" loading="lazy">'
          +'<div class="lsw-name">'+name+'</div>'
          +'</a>';
    });
    itemsEl.innerHTML=html;
    itemsEl.querySelectorAll('.lsw-item').forEach(function(a){
      a.addEventListener('click',function(){
        var pid=a.getAttribute('data-pid');
        if(typeof llm2wmdOpenShop==='function'){
          llm2wmdOpenShop('#card-'+pid);
        }
        setTimeout(function(){
          var card=document.getElementById('card-'+pid);
          if(card){
            card.classList.add('dm-card-flash');
            setTimeout(function(){card.classList.remove('dm-card-flash');},1700);
          }
        },600);
      });
    });
  }

  function updateVisibility(){
    if(!wrap)return;
    var show=false;
    for(var i=0;i<NARROW_PAGE_IDS.length;i++){
      var p=document.getElementById(NARROW_PAGE_IDS[i]);
      if(p&&getComputedStyle(p).display!=='none'){show=true;break;}
    }
    wrap.classList.toggle('lsw-page-ok',show);
  }

  function init(){
    wrap=document.getElementById('llm2wmd-shop-widget');
    if(!wrap)return;
    renderWidget();
    updateVisibility();
    window.addEventListener('scroll',updateVisibility,{passive:true});
    window.addEventListener('resize',updateVisibility);
    setInterval(updateVisibility,500);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init);
  }else{
    init();
  }
})();
