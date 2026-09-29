
function cartLoad(){
  try{
    var raw = lsGet('llm2wmd_cart');
    var parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  }catch(e){ return []; }
}
function cartSave(cart){
  try{ lsSet('llm2wmd_cart', JSON.stringify(cart)); }catch(e){}
}
function cartCount(){
  return cartLoad().reduce(function(sum,item){ return sum + (item.qty||1); }, 0);
}
function cartUpdateBadges(){
  var n = cartCount();
  var fabBadge = document.getElementById('cart-fab-badge');
  if(fabBadge) fabBadge.textContent = n;
  var mndCount = document.getElementById('mnd-cart-count');
  if(mndCount) mndCount.textContent = n ? ' (' + n + ')' : '';
}
function cartAdd(productId){
  if(typeof DM_STATE === 'undefined' || !DM_STATE[productId]) return false;
  var st = DM_STATE[productId];
  var cart = cartLoad();
  var existing = null;
  for(var i=0;i<cart.length;i++){
    if(cart[i].productId===productId && cart[i].color===st.color && cart[i].size===st.size){ existing = cart[i]; break; }
  }
  if(existing){ existing.qty = (existing.qty||1) + 1; }
  else{ cart.push({productId:productId, color:st.color, size:st.size, qty:1}); }
  cartSave(cart);
  cartRender();
  cartUpdateBadges();
  cartFlashAdded(productId);
  return false;
}
function cartFlashAdded(productId){
  var btn = document.getElementById('cartbtn-'+productId);
  if(!btn) return;
  if(btn.__cartFlashTimer) clearTimeout(btn.__cartFlashTimer);
  var original = btn.__cartOriginalText || btn.textContent;
  btn.__cartOriginalText = original;
  btn.textContent = 'ADDED \u2713';
  btn.classList.add('added');
  btn.__cartFlashTimer = setTimeout(function(){
    btn.textContent = original;
    btn.classList.remove('added');
  }, 1200);
}
function cartRemove(index){
  var cart = cartLoad();
  cart.splice(index,1);
  cartSave(cart);
  cartRender();
  cartUpdateBadges();
}
function cartChangeQty(index, delta){
  var cart = cartLoad();
  if(!cart[index]) return;
  cart[index].qty = (cart[index].qty||1) + delta;
  if(cart[index].qty < 1) cart[index].qty = 1;
  cartSave(cart);
  cartRender();
  cartUpdateBadges();
}
function cartClear(){
  cartSave([]);
  cartRender();
  cartUpdateBadges();
}
function cartRender(){
  var wrap = document.getElementById('cart-items');
  var emptyEl = document.getElementById('cart-empty');
  var footerEl = document.getElementById('cart-footer');
  if(!wrap) return;
  var cart = cartLoad();
  wrap.innerHTML = '';
  if(!cart.length){
    if(emptyEl) emptyEl.style.display = 'block';
    if(footerEl) footerEl.style.display = 'none';
    return;
  }
  if(emptyEl) emptyEl.style.display = 'none';
  if(footerEl) footerEl.style.display = 'block';
  cart.forEach(function(item, i){
    var name = (typeof DM_NAMES !== 'undefined' && DM_NAMES[item.productId]) || item.productId;
    var row = document.createElement('div');
    row.className = 'cart-item-row';
    var infoDiv = document.createElement('div');
    infoDiv.className = 'cart-item-info';
    var nameDiv = document.createElement('div');
    nameDiv.className = 'cart-item-name';
    nameDiv.textContent = name;
    var metaDiv = document.createElement('div');
    metaDiv.className = 'cart-item-meta';
    metaDiv.textContent = item.color + ' \u00b7 ' + item.size;
    infoDiv.appendChild(nameDiv);
    infoDiv.appendChild(metaDiv);
    var qtyDiv = document.createElement('div');
    qtyDiv.className = 'cart-item-qty';
    var minusBtn = document.createElement('button');
    minusBtn.type = 'button'; minusBtn.className = 'cart-qty-btn'; minusBtn.setAttribute('aria-label','Decrease quantity');
    minusBtn.textContent = '\u2212';
    minusBtn.onclick = (function(idx){ return function(){ cartChangeQty(idx,-1); }; })(i);
    var qtyNum = document.createElement('span');
    qtyNum.className = 'cart-qty-num';
    qtyNum.textContent = item.qty;
    var plusBtn = document.createElement('button');
    plusBtn.type = 'button'; plusBtn.className = 'cart-qty-btn'; plusBtn.setAttribute('aria-label','Increase quantity');
    plusBtn.textContent = '+';
    plusBtn.onclick = (function(idx){ return function(){ cartChangeQty(idx,1); }; })(i);
    qtyDiv.appendChild(minusBtn); qtyDiv.appendChild(qtyNum); qtyDiv.appendChild(plusBtn);
    var removeBtn = document.createElement('button');
    removeBtn.type = 'button'; removeBtn.className = 'cart-remove-btn'; removeBtn.setAttribute('aria-label','Remove item');
    removeBtn.innerHTML = '&times;';
    removeBtn.onclick = (function(idx){ return function(){ cartRemove(idx); }; })(i);
    row.appendChild(infoDiv);
    row.appendChild(qtyDiv);
    row.appendChild(removeBtn);
    wrap.appendChild(row);
  });
}
function openCartOverlay(){
  cartRender();
  var ov = document.getElementById('cart-overlay');
  if(!ov) return false;
  ov.classList.add('is-open');
  ov.setAttribute('aria-hidden','false');
  document.body.classList.add('cart-overlay-open');
  if(!ov.__llmBound){
    ov.__llmBound = true;
    ov.addEventListener('click', function(e){ if(e.target === ov) closeCartOverlay(); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && ov.classList.contains('is-open')) closeCartOverlay(); });
  }
  return false;
}
function closeCartOverlay(){
  var ov = document.getElementById('cart-overlay');
  if(!ov) return;
  ov.classList.remove('is-open');
  ov.setAttribute('aria-hidden','true');
  document.body.classList.remove('cart-overlay-open');
}
function cartCheckout(){
  var cart = cartLoad();
  if(!cart.length) return false;
  var lines = cart.map(function(item, i){
    var name = (typeof DM_NAMES !== 'undefined' && DM_NAMES[item.productId]) || item.productId;
    return (i+1) + '. ' + name + ' \u2014 Colour: ' + item.color + ', Size: ' + item.size + ', Qty: ' + item.qty;
  });
  var totalQty = cartCount();
  var subject = 'Order: ' + totalQty + ' item' + (totalQty === 1 ? '' : 's') + ' from LLM2WMD';
  var body = "Hi Chris,\n\nI'd like to order:\n\n" + lines.join('\n') +
    "\n\nShipping address: " +
    "\n\n----------------------------------------\nTERMS OF SALE\nAll orders are fulfilled by Printful. Prices shown are subject to change and don't include shipping, which is calculated per order based on delivery location. Payment is accepted securely via Stripe \u2014 a secure payment link for the exact total will be sent to you based on the item, colour, size, and shipping location, and shipping details follow once payment is received. Returns follow Printful's returns policy. Making payment counts as agreement to these terms.\n\nPrices reflect the low-volume, custom nature of these products \u2014 margins are kept as low as we can reasonably make them.";
  var href = 'mailto:' + DM_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  window.location.href = href;
  return false;
}
cartUpdateBadges();
