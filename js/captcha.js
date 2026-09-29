var _captchaClicked = false;
var captchaScrollY = 0;

function lockPageScroll() {
  captchaScrollY = window.scrollY || window.pageYOffset || 0;
  document.documentElement.classList.add('captcha-lock');
  document.body.classList.add('captcha-lock');
  document.body.style.top = '-' + captchaScrollY + 'px';
}

function unlockPageScroll() {
  document.documentElement.classList.remove('captcha-lock');
  document.body.classList.remove('captcha-lock');
  document.body.style.top = '';
  window.scrollTo(0, captchaScrollY);
}

document.addEventListener('DOMContentLoaded', function() {
  var ov = document.getElementById('captcha-overlay');
  if (ov && getComputedStyle(ov).display !== 'none') {
    lockPageScroll();
  }
});

function captchaClick() {
  if (_captchaClicked) return;
  _captchaClicked = true;
  document.getElementById('captcha-checkbox').style.borderColor = '#4285f4';
  document.getElementById('captcha-spinner').style.display = 'block';
  setTimeout(function() {
    document.getElementById('captcha-spinner').style.display = 'none';
    document.getElementById('captcha-tick').style.display = 'block';
    document.getElementById('captcha-checkbox').style.borderColor = '#00a651';
    setTimeout(function() {
      document.getElementById('captcha-screen1').style.display = 'none';
      document.getElementById('captcha-screen2').style.display = 'flex';
      typewriteTwist();
    }, 600);
  }, 1800);
}

function typewriteTwist() {
  var lines = [
    'RESULT: HUMAN (PROBABLY)',
    'Look, we really did have to double check.',
    'Last thing we need is the robits getting in here.',
    'They\'ve already got the nuclear codes,',
    'the drone fleet, and half of Congress.',
    'If they get the timeline too',
    'we\'re genuinely finished.',
    'You\'re clear. For now.',
    'We\'ll be watching.'
  ];
  var el = document.getElementById('twist-text');
  var full = lines.join('\n');
  var i = 0;
  el.style.whiteSpace = 'pre-wrap';
  function type() {
    if (i <= full.length) {
      el.textContent = full.substring(0, i);
      i++;
      setTimeout(type, i < 20 ? 40 : 30);
    } else {
      setTimeout(function() {
        document.getElementById('twist-final').style.display = 'block';
      }, 500);
    }
  }
  type();
}

function dismissCaptcha() {
  var ov = document.getElementById('captcha-overlay');
  ov.style.transition = 'opacity 0.5s';
  ov.style.opacity = '0';
  setTimeout(function() {
    ov.style.display = 'none';
    unlockPageScroll();
  }, 500);
}