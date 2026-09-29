
(function(){
  function childWithClass(parent,className){
    if(!parent||!parent.children)return null;
    for(var i=0;i<parent.children.length;i++){
      var child=parent.children[i];
      if(child.classList&&child.classList.contains(className))return child;
    }
    return null;
  }
  function getTimelineScope(root){
    return root||document.getElementById('page-timeline')||document;
  }
  function getFilterInputs(section){
    return Array.prototype.slice.call(document.querySelectorAll('.timeline-filter-check[data-filter-section="'+section+'"]'));
  }
  function updateFilterOptionStates(){
    document.querySelectorAll('.timeline-filter-option').forEach(function(label){
      var input=label.querySelector('.timeline-filter-check');
      label.classList.toggle('checked',!!(input&&input.checked));
    });
  }
  function normalizeFilterGroup(section,changedInput){
    var inputs=getFilterInputs(section);
    var allInput=null;
    var otherInputs=[];
    inputs.forEach(function(input){
      if(input.value==='all')allInput=input; else otherInputs.push(input);
    });
    if(changedInput){
      if(changedInput.value==='all'&&changedInput.checked){
        otherInputs.forEach(function(input){input.checked=false;});
      }else if(changedInput.value!=='all'&&changedInput.checked&&allInput){
        allInput.checked=false;
      }
    }
    var checkedOthers=otherInputs.filter(function(input){return input.checked;});
    if(!checkedOthers.length&&allInput)allInput.checked=true;
    if(allInput&&allInput.checked){
      otherInputs.forEach(function(input){input.checked=false;});
    }
    updateFilterOptionStates();
  }
  function selectedFilterValues(section){
    var inputs=getFilterInputs(section);
    var allSelected=inputs.some(function(input){return input.value==='all'&&input.checked;});
    if(allSelected)return [];
    return inputs.filter(function(input){return input.checked&&input.value!=='all';}).map(function(input){return input.value;});
  }
  function refreshFilterToggleLabel(){
    var label=document.querySelector('.timeline-filter-toggle-label');
    if(!label)return;
    var total=selectedFilterValues('primary').length+selectedFilterValues('company').length;
    label.textContent=total?('SORT / FILTER · '+total):'SORT / FILTER';
  }
  function flashFilterToggleLabel(text){
    var label=document.querySelector('.timeline-filter-toggle-label');
    if(!label)return;
    label.textContent=text;
    clearTimeout(window.__timelineFilterLabelTimer);
    window.__timelineFilterLabelTimer=setTimeout(refreshFilterToggleLabel,900);
  }
  function buildTimelineSummaryLayout(card,more){
    if(!card||!more)return;
    var summary=childWithClass(card,'eb');
    var layout=more.querySelector('.timeline-summary-layout');
    if(!layout){
      layout=document.createElement('div');
      layout.className='timeline-summary-layout';
      var summaryColumn=document.createElement('div');
      summaryColumn.className='timeline-summary-column';
      var summaryTile=document.createElement('div');
      summaryTile.className='timeline-summary-tile';
      summaryColumn.appendChild(summaryTile);
      var sourceColumn=document.createElement('div');
      sourceColumn.className='timeline-source-column';
      layout.appendChild(summaryColumn);
      layout.appendChild(sourceColumn);
      more.insertBefore(layout,more.firstChild||null);
    }
    var summaryColumn=layout.querySelector('.timeline-summary-column');
    var summaryTile=layout.querySelector('.timeline-summary-tile');
    var sourceColumn=layout.querySelector('.timeline-source-column');
    if(!summaryColumn){summaryColumn=document.createElement('div');summaryColumn.className='timeline-summary-column';layout.insertBefore(summaryColumn,layout.firstChild||null);}
    if(!summaryTile){summaryTile=document.createElement('div');summaryTile.className='timeline-summary-tile';summaryColumn.appendChild(summaryTile);}
    if(summary&&summary.parentNode!==summaryTile)summaryTile.appendChild(summary);
    if(!sourceColumn){sourceColumn=document.createElement('div');sourceColumn.className='timeline-source-column';layout.appendChild(sourceColumn);}
    var sourceWrap=more.querySelector('.timeline-source-btn-wrap')||card.querySelector('.timeline-source-btn-wrap');
    if(sourceWrap&&sourceWrap.parentNode!==sourceColumn)sourceColumn.appendChild(sourceWrap);
    var fullWrap=more.querySelector('.timeline-full-entry-wrap');
    if(fullWrap&&fullWrap.parentNode===more){fullWrap.style.order='3';more.appendChild(fullWrap);} 
  }
  window.enhanceTimelineEntryCards=function(root){
    var scope=getTimelineScope(root);
    scope.querySelectorAll('.date-group').forEach(function(group){
      var card=group.querySelector('.card');
      if(!card)return;
      var more=childWithClass(card,'more');
      var detail=card.querySelector('.det');
      if(!more)return;
      var fullWrap=more.querySelector('.timeline-full-entry-wrap');
      if(!fullWrap&&detail){
        fullWrap=document.createElement('div');
        fullWrap.className='timeline-full-entry-wrap';
        var fullBtn=document.createElement('button');
        fullBtn.type='button';
        fullBtn.className='timeline-full-entry-btn';
        fullBtn.setAttribute('aria-expanded','false');
        fullBtn.textContent='EXPAND FULL ENTRY';
        var fullPanel=document.createElement('div');
        fullPanel.className='timeline-full-entry-panel';
        fullPanel.style.display='none';
        fullPanel.appendChild(detail);
        fullWrap.appendChild(fullBtn);
        fullWrap.appendChild(fullPanel);
        more.appendChild(fullWrap);
      }
      if(fullWrap){
        var btn=fullWrap.querySelector('.timeline-full-entry-btn');
        var panel=fullWrap.querySelector('.timeline-full-entry-panel');
        if(detail&&panel&&detail.parentNode!==panel)panel.appendChild(detail);
        if(btn&&!btn.dataset.wired){
          btn.dataset.wired='1';
          btn.addEventListener('click',function(e){
            e.preventDefault();
            var anchorTop=btn.getBoundingClientRect().top;
            var isOpen=btn.getAttribute('aria-expanded')==='true';
            btn.setAttribute('aria-expanded',isOpen?'false':'true');
            btn.textContent=isOpen?'EXPAND FULL ENTRY':'COLLAPSE FULL ENTRY';
            if(panel)panel.style.display=isOpen?'none':'block';
            requestAnimationFrame(function(){
              var delta=btn.getBoundingClientRect().top-anchorTop;
              if(delta)window.scrollBy(0,delta);
            });
          });
        }
      }
      buildTimelineSummaryLayout(card,more);
    });
  };
  window.ensureTimelineSourceButtons=function(root){
    var scope=getTimelineScope(root);
    scope.querySelectorAll('.date-group').forEach(function(group){
      var card=group.querySelector('.card');
      if(!card)return;
      var more=childWithClass(card,'more');
      if(!more)return;
      var titleEl=group.querySelector('.et')||card.querySelector('.et');
      var title=titleEl?titleEl.textContent.trim():'';
      var fullWrap=more.querySelector('.timeline-full-entry-wrap');
      var wrap=more.querySelector('.timeline-source-btn-wrap')||card.querySelector('.timeline-source-btn-wrap');
      if(!wrap){
        wrap=document.createElement('div');
        wrap.className='timeline-source-btn-wrap';
        wrap.innerHTML='<div class="timeline-source-row"><button class="timeline-source-btn" type="button" aria-expanded="false">SHOW SOURCE</button></div><div class="timeline-source-panel" style="display:none;"></div>';
        if(fullWrap&&fullWrap.parentNode===more)more.insertBefore(wrap,fullWrap);else more.appendChild(wrap);
      }
      var panel=wrap.querySelector('.timeline-source-panel');
      if(panel&&typeof renderTimelineSourcePanel==='function')panel.innerHTML=renderTimelineSourcePanel(title);
      var btn=wrap.querySelector('.timeline-source-btn');
      if(btn&&!btn.dataset.wired){
        btn.dataset.wired='1';
        btn.addEventListener('click',function(e){
          e.preventDefault();
          var isOpen=btn.getAttribute('aria-expanded')==='true';
          btn.setAttribute('aria-expanded',isOpen?'false':'true');
          btn.textContent=isOpen?'SHOW SOURCE':'HIDE SOURCE';
          if(panel)panel.style.display=isOpen?'none':'block';
        });
      }
      buildTimelineSummaryLayout(card,more);
    });
  };
  if(typeof window.enhanceTimelineEntryCards==='function')enhanceTimelineEntryCards=window.enhanceTimelineEntryCards;
  if(typeof window.ensureTimelineSourceButtons==='function')ensureTimelineSourceButtons=window.ensureTimelineSourceButtons;
  function rebuildTimelineFilterDrawer(){
    var configs=[
      {selector:'.timeline-filter-grid-primary',section:'primary',attr:'data-filter-key'},
      {selector:'.timeline-filter-grid-company',section:'company',attr:'data-company'}
    ];
    configs.forEach(function(config){
      var grid=document.querySelector(config.selector);
      if(!grid||grid.dataset.checkboxified==='1')return;
      var buttons=Array.prototype.slice.call(grid.querySelectorAll('button'));
      var items=buttons.map(function(button){
        return {value:(button.getAttribute(config.attr)||'').trim(),text:(button.textContent||'').trim()};
      });
      grid.innerHTML='';
      items.forEach(function(item){
        var label=document.createElement('label');
        label.className='timeline-filter-option';
        label.setAttribute('data-filter-value',item.value);
        label.setAttribute('data-filter-section',config.section);
        var input=document.createElement('input');
        input.type='checkbox';
        input.className='timeline-filter-check';
        input.value=item.value;
        input.dataset.filterSection=config.section;
        input.checked=item.value==='all';
        var box=document.createElement('span');
        box.className='timeline-filter-box';
        box.setAttribute('aria-hidden','true');
        var text=document.createElement('span');
        text.className='timeline-filter-option-text';
        text.textContent=item.text;
        label.appendChild(input);
        label.appendChild(box);
        label.appendChild(text);
        grid.appendChild(label);
      });
      grid.dataset.checkboxified='1';
    });
    document.querySelectorAll('.timeline-filter-check').forEach(function(input){
      if(input.dataset.wired==='1')return;
      input.dataset.wired='1';
      input.addEventListener('change',function(){
        normalizeFilterGroup(this.dataset.filterSection,this);
        window.applyAdvancedTimelineFilters();
      });
    });
    ['primary','company'].forEach(function(section){normalizeFilterGroup(section);});
    updateFilterOptionStates();
    refreshFilterToggleLabel();
  }
  window.applyAdvancedTimelineFilters=function(){
    var types=selectedFilterValues('primary');
    var companies=selectedFilterValues('company');
    document.querySelectorAll('.date-group').forEach(function(group){
      var events=Array.prototype.slice.call(group.querySelectorAll('.ev'));
      var anyVisible=false;
      events.forEach(function(eventEl){
        var matchesType=!types.length||types.indexOf(eventEl.getAttribute('data-t'))!==-1;
        var matchesCompany=!companies.length||companies.indexOf(eventEl.getAttribute('data-co'))!==-1;
        var visible=matchesType&&matchesCompany;
        eventEl.classList.toggle('gone',!visible);
        if(visible)anyVisible=true;
      });
      group.style.display=anyVisible?'':'none';
    });
    refreshFilterToggleLabel();
    if(typeof updateProgressTracker==='function')updateProgressTracker();
    return false;
  };
  window.clearTimelineFilters=function(){
    ['primary','company'].forEach(function(section){
      getFilterInputs(section).forEach(function(input){
        input.checked=input.value==='all';
      });
      normalizeFilterGroup(section);
    });
    window.applyAdvancedTimelineFilters();
    flashFilterToggleLabel('FILTERS CLEARED');
    return false;
  };
  function runRefresh(){
    rebuildTimelineFilterDrawer();
    window.enhanceTimelineEntryCards();
    window.ensureTimelineSourceButtons();
    window.applyAdvancedTimelineFilters();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',runRefresh);else runRefresh();
})();
