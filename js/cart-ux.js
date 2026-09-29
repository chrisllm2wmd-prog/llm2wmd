
(function(){
  /* ---- 1. One order button per product: build a size <select> from the existing (hidden)
     button row, park it next to Add to Cart, and drop the old standalone email-order link. ---- */
  function buildSizeDropdowns(){
    var rows = document.querySelectorAll('.dm-size-row');
    rows.forEach(function(row){
      if(row.dataset.llmConverted) return;
      var buttons = row.querySelectorAll('.dm-size-btn');
      if(!buttons.length) return;
      var productId = null, sizes = [], activeSize = null;
      buttons.forEach(function(btn){
        var m = (btn.getAttribute('onclick')||'').match(/dmSelectSize\('([^']+)','([^']+)'\)/);
        if(!m) return;
        if(!productId) productId = m[1];
        sizes.push(m[2]);
        if(btn.classList.contains('active')) activeSize = m[2];
      });
      if(!productId || !sizes.length) return;
      var cartBtn = document.getElementById('cartbtn-'+productId);
      var orderLink = document.getElementById('order-'+productId);
      if(orderLink && orderLink.parentNode) orderLink.parentNode.removeChild(orderLink);
      if(!cartBtn || !cartBtn.parentNode) return;
      var orderRow = document.createElement('div');
      orderRow.className = 'dm-order-row';
      cartBtn.parentNode.insertBefore(orderRow, cartBtn);
      if(sizes.length > 1){
        var select = document.createElement('select');
        select.className = 'dm-size-select';
        select.id = 'sizeselect-'+productId;
        select.setAttribute('aria-label','Select size');
        var placeholderOpt = document.createElement('option');
        placeholderOpt.value = '';
        placeholderOpt.textContent = 'SELECT SIZE';
        placeholderOpt.disabled = true;
        placeholderOpt.selected = true;
        select.appendChild(placeholderOpt);
        sizes.forEach(function(sz){
          var opt = document.createElement('option');
          opt.value = sz; opt.textContent = sz;
          select.appendChild(opt);
        });
        select.addEventListener('change', function(){
          if(select.value === '') return;
          select.classList.remove('dm-size-select-warn');
          var warnEl = select.parentNode.querySelector('.dm-size-warn');
          if(warnEl) warnEl.style.display = 'none';
          var target = row.querySelector('.dm-size-btn[data-size="'+select.value.replace(/"/g,'\\"')+'"]');
          if(target) target.click(); else if(typeof dmSelectSize==='function') dmSelectSize(productId, select.value);
        });
        /* The "SIZE" tag moves in here too, directly above the dropdown and nothing else — a
           tight column, not centered over the whole row (which also has the cart button in it). */
        var sizeGroup = document.createElement('div');
        sizeGroup.className = 'dm-size-group';
        var label = row.previousElementSibling;
        if(label && label.classList && label.classList.contains('dm-size-label')){
          sizeGroup.appendChild(label);
        }
        sizeGroup.appendChild(select);
        var warnMsg = document.createElement('div');
        warnMsg.className = 'dm-size-warn';
        warnMsg.textContent = 'SELECT A SIZE';
        sizeGroup.appendChild(warnMsg);
        orderRow.appendChild(sizeGroup);
      }
      orderRow.appendChild(cartBtn);
      row.classList.add('dm-size-row-hidden');
      row.dataset.llmConverted = '1';
    });
  }

  /* dmSelectColor/dmSelectSize both end by calling dmUpdateOrder(), which used to point the
     (now-removed) "ORDER NOW — EMAIL" link at a fresh mailto href. Redefined as a safe no-op so
     those two functions keep working without erroring on the missing element. */
  window.dmUpdateOrder = function(){};

  /* Order email: one item per line, with a blank line between items so a multi-item order
     doesn't read as a wall of text. Also switched to CRLF line breaks — plain "\n" alone isn't
     guaranteed to render as a real line break once it goes through a mailto: link into every
     mail client, CRLF is the safe/standard choice. */
  function cartComputeTotals(cart, country){
    var subtotal = 0;
    cart.forEach(function(item){
      var unit = (typeof DM_PRICE !== 'undefined' && typeof DM_PRICE[item.productId] === 'number') ? DM_PRICE[item.productId] : 0;
      subtotal += unit * (item.qty || 1);
    });
    var fulfilmentFee = 3.99;
    var base = subtotal + fulfilmentFee;
    var ukPattern = /^(uk|u\.k\.?|united kingdom|great britain|gb|england|scotland|wales|northern ireland)$/i;
    var trimmedCountry = (country || '').trim();
    var stripeFee = null;
    if(trimmedCountry){
      stripeFee = ukPattern.test(trimmedCountry) ? (base * 0.015 + 0.20) : (base * 0.025 + 0.20);
    }
    var estimatedTotal = base + (stripeFee !== null ? stripeFee : 0);
    return {
      subtotal: subtotal,
      fulfilmentFee: fulfilmentFee,
      base: base,
      stripeFee: stripeFee,
      estimatedTotal: estimatedTotal,
      hasCountry: !!trimmedCountry
    };
  }

  /* Live breakdown in the cart itself -- updates the moment a country is typed, per Chris's
     request (2026-09-12) to show the customer cost-per-item, fulfilment fee and secure checkout
     fee as soon as we know where they're shipping to. Shipping itself still can't be calculated
     here (no live Printful shipping-rate lookup wired up), so that line stays "confirmed after
     checkout" rather than showing a number that isn't real. */
  window.cartRenderSummary = function(){
    var cart = (typeof cartLoad === 'function') ? cartLoad() : [];
    var countryEl = document.getElementById('cart-country');
    var totals = cartComputeTotals(cart, countryEl ? countryEl.value : '');
    var subtotalEl = document.getElementById('cs-subtotal');
    var fulfilmentEl = document.getElementById('cs-fulfilment');
    var stripeFeeEl = document.getElementById('cs-stripefee');
    var totalEl = document.getElementById('cs-total');
    if(subtotalEl) subtotalEl.textContent = '\u00a3' + totals.subtotal.toFixed(2);
    if(fulfilmentEl) fulfilmentEl.textContent = '\u00a3' + totals.fulfilmentFee.toFixed(2);
    if(stripeFeeEl) stripeFeeEl.textContent = totals.hasCountry ? ('\u00a3' + totals.stripeFee.toFixed(2)) : 'enter your country';
    if(totalEl) totalEl.textContent = '\u00a3' + totals.estimatedTotal.toFixed(2);
  };

  var origCartRenderForSummary = window.cartRender;
  window.cartRender = function(){
    if(typeof origCartRenderForSummary === 'function') origCartRenderForSummary();
    if(typeof window.cartRenderSummary === 'function') window.cartRenderSummary();
  };

  window.cartCheckout = function(){
    var cart = (typeof cartLoad === 'function') ? cartLoad() : [];
    if(!cart.length) return false;

    var nameEl = document.getElementById('cart-name');
    var addr1El = document.getElementById('cart-address1');
    var cityEl = document.getElementById('cart-city');
    var postcodeEl = document.getElementById('cart-postcode');
    var countryEl = document.getElementById('cart-country');
    var warnEl = document.getElementById('cart-address-warn');

    var custName = nameEl ? nameEl.value.trim() : '';
    var addr1 = addr1El ? addr1El.value.trim() : '';
    var city = cityEl ? cityEl.value.trim() : '';
    var postcode = postcodeEl ? postcodeEl.value.trim() : '';
    var country = countryEl ? countryEl.value.trim() : '';

    if(!custName || !addr1 || !city || !postcode || !country){
      if(warnEl){
        warnEl.style.display = 'block';
        clearTimeout(warnEl.__hideTimer);
        warnEl.__hideTimer = setTimeout(function(){ warnEl.style.display = 'none'; }, 3200);
      }
      var firstEmpty = !custName ? nameEl : (!addr1 ? addr1El : (!city ? cityEl : (!postcode ? postcodeEl : countryEl)));
      if(firstEmpty) firstEmpty.focus();
      return false;
    }
    if(warnEl) warnEl.style.display = 'none';

    var CRLF = '\r\n';
    var lines = cart.map(function(item, i){
      var name = (typeof DM_NAMES !== 'undefined' && DM_NAMES[item.productId]) || item.productId;
      var unit = (typeof DM_PRICE !== 'undefined' && typeof DM_PRICE[item.productId] === 'number') ? DM_PRICE[item.productId] : 0;
      var qty = item.qty || 1;
      var lineTotal = unit * qty;
      return (i+1) + '. ' + name + ' \u2014 Colour: ' + item.color + ', Size: ' + item.size + ', Qty: ' + qty +
        ' \u2014 \u00a3' + unit.toFixed(2) + ' each (\u00a3' + lineTotal.toFixed(2) + ')';
    });

    var totals = cartComputeTotals(cart, country);
    var stripeFee = totals.stripeFee !== null ? totals.stripeFee : (totals.base * 0.02);

    var totalQty = (typeof cartCount === 'function') ? cartCount() : cart.length;
    var subject = 'Order: ' + totalQty + ' item' + (totalQty === 1 ? '' : 's') + ' from LLM2WMD';
    var body = 'Hi Chris,' + CRLF + CRLF + "I'd like to order:" + CRLF + CRLF +
      lines.join(CRLF) + CRLF + CRLF +
      '----------------------------------------' + CRLF +
      'ORDER SUMMARY (estimate \u2014 exact total confirmed on your Stripe payment link)' + CRLF +
      'Items subtotal: \u00a3' + totals.subtotal.toFixed(2) + CRLF +
      'Order fulfilment fee: \u00a3' + totals.fulfilmentFee.toFixed(2) + CRLF +
      'Secure checkout fee (Stripe, est.): \u00a3' + stripeFee.toFixed(2) + CRLF +
      'Shipping: to be confirmed for the delivery address below' + CRLF +
      'Estimated total before shipping: \u00a3' + (totals.base + stripeFee).toFixed(2) + CRLF + CRLF +
      '----------------------------------------' + CRLF +
      'DELIVERY DETAILS' + CRLF +
      'Name: ' + custName + CRLF +
      'Address: ' + addr1 + CRLF +
      'Town/City: ' + city + CRLF +
      'Postcode/ZIP: ' + postcode + CRLF +
      'Country: ' + country + CRLF + CRLF +
      '----------------------------------------' + CRLF +
      'TERMS OF SALE' + CRLF +
      "All orders are fulfilled by Printful. Prices shown are subject to change and don't include shipping, which is calculated per order based on delivery location. Payment is accepted securely via Stripe \u2014 a secure payment link for the exact total will be sent to you based on the item, colour, size, and shipping location, and shipping details follow once payment is received. Returns follow Printful's returns policy. Making payment counts as agreement to these terms." + CRLF + CRLF +
      'Prices reflect the low-volume, custom nature of these products \u2014 margins are kept as low as we can reasonably make them.';
    var href = 'mailto:' + DM_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    window.location.href = href;
    return false;
  };

  /* ---- 2. Cart FAB: live position (top-right in shop/landscape-lock, else just under the
     header), visible only once the cart actually has something in it. ---- */
  function positionCartFab(){
    var fab = document.getElementById('cart-fab');
    if(!fab) return;
    fab.style.bottom = 'auto';
    fab.style.left = 'auto';
    fab.style.right = '14px';
    /* The nav banner only actually disappears in the locked-landscape shop view — everywhere
       else (including the normal, scrollable shop view) it stays on screen, so the fab needs to
       sit below it there too rather than pinning to the very top and covering it. */
    if(document.body.classList.contains('landscape-shop-lock')){
      fab.style.top = '14px';
      return;
    }
    var bottomEdge = 70;
    var nav = document.getElementById('site-nav');
    if(nav && nav.offsetHeight > 0 && getComputedStyle(nav).display !== 'none'){
      bottomEdge = nav.getBoundingClientRect().bottom;
    }
    var tabs = document.querySelector('.tabs') || document.getElementById('tab-bar');
    if(tabs && tabs.offsetHeight > 0 && getComputedStyle(tabs).display !== 'none'){
      var tabsBottom = tabs.getBoundingClientRect().bottom;
      if(tabsBottom > bottomEdge) bottomEdge = tabsBottom;
    }
    fab.style.top = (bottomEdge + 10) + 'px';
  }
  window.addEventListener('resize', positionCartFab);
  window.addEventListener('orientationchange', function(){ setTimeout(positionCartFab, 250); });
  window.addEventListener('load', positionCartFab);
  new MutationObserver(positionCartFab).observe(document.body, {attributes:true, attributeFilter:['class']});

  /* Wrap (not replace) cartUpdateBadges so the original badge-count logic still runs, and add:
     toggling visibility by whether the cart actually has items, keeping the fab positioned. */
  var origCartUpdateBadges = window.cartUpdateBadges;
  window.cartUpdateBadges = function(){
    if(typeof origCartUpdateBadges === 'function') origCartUpdateBadges();
    var n = (typeof cartCount === 'function') ? cartCount() : 0;
    document.body.classList.toggle('llm2wmd-cart-has-items', n > 0);
    positionCartFab();
  };

  /* Wrap cartAdd so adding something gives feedback in two places: a pop on the floating cart
     icon, and a brief flash on "VIEW CART" in the hamburger drawer. */
  var origCartAdd = window.cartAdd;
  window.cartAdd = function(productId){
    var select = document.getElementById('sizeselect-'+productId);
    if(select && select.value === ''){
      select.classList.add('dm-size-select-warn');
      select.focus();
      var warnEl = select.parentNode.querySelector('.dm-size-warn');
      if(warnEl){
        warnEl.style.display = 'block';
        clearTimeout(warnEl.__hideTimer);
        warnEl.__hideTimer = setTimeout(function(){
          warnEl.style.display = 'none';
          select.classList.remove('dm-size-select-warn');
        }, 2600);
      }
      return false;
    }
    var result = (typeof origCartAdd === 'function') ? origCartAdd(productId) : undefined;
    var fab = document.getElementById('cart-fab');
    if(fab){
      fab.classList.remove('cart-fab-pop');
      void fab.offsetWidth;
      fab.classList.add('cart-fab-pop');
      setTimeout(function(){ fab.classList.remove('cart-fab-pop'); }, 600);
    }
    var badge = document.getElementById('mnd-cart-count');
    if(badge && badge.closest){
      var item = badge.closest('.mnd-subitem');
      if(item){
        item.classList.remove('mnd-cart-flash');
        void item.offsetWidth;
        item.classList.add('mnd-cart-flash');
        setTimeout(function(){ item.classList.remove('mnd-cart-flash'); }, 900);
      }
    }
    return result;
  };

  function init(){
    buildSizeDropdowns();
    if(typeof cartUpdateBadges === 'function') cartUpdateBadges();
    positionCartFab();
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', init);
  }else{
    init();
  }
})();
