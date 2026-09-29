
const DM_STATE = {};

function dmSelectColor(productId, color) {
  DM_STATE[productId].color = color;
  DM_STATE[productId].idx = 0;
  const row = document.querySelector('#card-' + productId + ' .dm-swatch-row');
  row.querySelectorAll('.dm-swatch').forEach(b => b.classList.toggle('active', b.dataset.color === color));
  dmRender(productId);
}

function dmSelectSize(productId, size) {
  DM_STATE[productId].size = size;
  const row = document.querySelector('#card-' + productId + ' .dm-size-row');
  row.querySelectorAll('.dm-size-btn').forEach(b => b.classList.toggle('active', b.dataset.size === size));
  dmUpdateOrder(productId);
}

function dmNav(productId, dir) {
  const st = DM_STATE[productId];
  const views = DM_DATA[productId][st.color];
  st.idx = (st.idx + dir + views.length) % views.length;
  dmRender(productId);
}

function dmUpdateOrder(productId) {
  const st = DM_STATE[productId];
  const name = DM_NAMES[productId];
  const subject = 'Order: ' + name;
  const body = "Hi Chris,\n\nI'd like to order:\nProduct: " + name +
    "\nColor: " + st.color + "\nSize: " + st.size +
    "\n\nShipping address: " +
    "\n\n----------------------------------------\nTERMS OF SALE\nAll orders are fulfilled by Printful. Prices shown are subject to change and don't include shipping, which is calculated per order based on delivery location. Payment is accepted securely via Stripe \u2014 a secure payment link for the exact total will be sent to you based on the item, colour, size, and shipping location, and shipping details follow once payment is received. Returns follow Printful's returns policy. Making payment counts as agreement to these terms.\n\nPrices reflect the low-volume, custom nature of these products \u2014 margins are kept as low as we can reasonably make them.";
  const href = 'mailto:' + DM_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  document.getElementById('order-' + productId).href = href;
}

function dmRender(productId) {
  const st = DM_STATE[productId];
  const views = DM_DATA[productId][st.color];
  const v = views[st.idx];
  const img = document.getElementById('img-' + productId);
  img.src = v.src;
  img.alt = st.color + ' — ' + v.label;
  document.getElementById('tag-' + productId).textContent = v.label;
  document.getElementById('colorname-' + productId).textContent = st.color;

  const dotsWrap = document.getElementById('dots-' + productId);
  dotsWrap.innerHTML = '';
  views.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'dm-dot' + (i === st.idx ? ' active' : '');
    d.setAttribute('aria-label', 'View ' + (i + 1));
    d.onclick = () => { st.idx = i; dmRender(productId); };
    dotsWrap.appendChild(d);
  });

  const arrowsHidden = views.length <= 1;
  document.querySelectorAll('#card-' + productId + ' .dm-arrow').forEach(a => a.style.display = arrowsHidden ? 'none' : 'flex');
  dotsWrap.style.display = arrowsHidden ? 'none' : 'flex';

  dmUpdateOrder(productId);
}

const FIRST = {"swarm-tee":"Charcoal","sticker-resist":"White","sticker-panda":"White","swarm-hoodie":"Charcoal","mousepad": "White", "sticker-swarm": "White", "hoodie-clear": "Black", "hoodie-dark": "Black", "tee-dark": "Black", "tee-clear": "Black", "basic-dark": "Black", "basic-clear": "Black", "quote-tee": "Black", "beanie": "Black", "bottle": "Black", "sweatshirt": "Military Green", "sticker": "White", "tee-heavy": "Black", "longsleeve": "Black"};
Object.keys(FIRST).forEach(productId => {
  const sizes = DM_SIZES_BY_PRODUCT[productId] || DM_SIZES;
  DM_STATE[productId] = { color: FIRST[productId], idx: 0, size: sizes[0] };
  dmRender(productId);
});
