
(function(){
  /* Ordering temporarily disabled: the cart checkout button/flow (address form, live fee
     summary, cartCheckout) is hidden via inline display:none on its containers above rather
     than removed, so this is easy to reverse later. In its place, #cart-email-btn sends a
     plain purchase-inquiry email listing the cart contents, no address or price breakdown. */
  function cartBuildInquiryHref(){
    var cart = (typeof cartLoad === 'function') ? cartLoad() : [];
    if(!cart.length) return null;
    var lines = cart.map(function(item, i){
      var name = (typeof DM_NAMES !== 'undefined' && DM_NAMES[item.productId]) || item.productId;
      return (i+1) + '. ' + name + ' — Colour: ' + item.color + ', Size: ' + item.size + ', Qty: ' + item.qty;
    });
    var totalQty = (typeof cartCount === 'function') ? cartCount() : cart.length;
    var subject = 'Purchase inquiry: ' + totalQty + ' item' + (totalQty === 1 ? '' : 's') + ' from LLM2WMD';
    var body = "Hi Chris,\n\nOnline ordering shows it's currently disabled, but I'd like to enquire about buying:\n\n" +
      lines.join('\n') +
      "\n\nShipping address: " +
      "\n\n----------------------------------------\nTERMS OF SALE\nAll orders are fulfilled by Printful. Prices shown are subject to change and don't include shipping, which is calculated per order based on delivery location. Payment is accepted securely via Stripe — a secure payment link for the exact total will be sent to you based on the item, colour, size, and shipping location, and shipping details follow once payment is received. Returns follow Printful's returns policy. Making payment counts as agreement to these terms.\n\nPrices reflect the low-volume, custom nature of these products — margins are kept as low as we can reasonably make them.";
    return 'mailto:' + DM_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }
  function cartUpdateEmailBtn(){
    var btn = document.getElementById('cart-email-btn');
    if(!btn) return;
    var href = cartBuildInquiryHref();
    btn.href = href || '#';
  }
  var origCartRenderForDisabledNotice = window.cartRender;
  window.cartRender = function(){
    if(typeof origCartRenderForDisabledNotice === 'function') origCartRenderForDisabledNotice();
    cartUpdateEmailBtn();
  };
  cartUpdateEmailBtn();
})();
