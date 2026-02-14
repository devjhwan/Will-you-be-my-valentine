// Yes 클릭 시 이미지와 메시지를 변경합니다.
function yesClicked() {
  const photo = document.getElementById('photo');
  const ask = document.querySelector('.ask');
  if (photo) {
    const png = 'assets/after.png';
    const jpg = 'assets/after.jpg';
    const attempt = (src, fallback) => {
      const img = new Image();
      img.onload = () => { photo.src = src; };
      img.onerror = () => { if (fallback) attempt(fallback, null); };
      img.src = src;
    };
    attempt(png, jpg);
  }
  if (ask) ask.textContent = 'You said Yes! 💖';
}

// No 버튼 이동 및 크기 감소 기능
const NoButtonController = (function () {
  let isFixed = false;
  let scale = 1;
  const shrinkFactor = 0.95; // 클릭마다 95% (5% 작아짐)
  const duration = 500; // ms
  const easing = 'cubic-bezier(0.0, 0.8, 0.2, 1)'; // 빠르게 시작해 천천히 도착

  function ensureFixed(btn) {
    if (isFixed) return;
    const rect = btn.getBoundingClientRect();
    // set fixed at exact viewport coordinates to avoid jump
    btn.style.position = 'fixed';
    btn.style.left = rect.left + 'px';
    btn.style.top = rect.top + 'px';
    btn.style.margin = '0';
    btn.style.zIndex = '9999';
    // enable smooth transitions for left/top and transform
    btn.style.transition = `left ${duration}ms ${easing}, top ${duration}ms ${easing}, transform ${duration}ms ${easing}`;
    btn.style.transformOrigin = 'center center';
    isFixed = true;
  }

  function moveToRandom(btn) {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const bw = btn.offsetWidth;
    const bh = btn.offsetHeight;
    const padding = 8;
    const maxX = Math.max(0, vw - 4*bw - padding);
    const maxY = Math.max(0, vh - 4*bh - padding);
    const left = Math.floor(Math.random() * maxX) + padding;
    const top = Math.floor(Math.random() * maxY) + padding;
    btn.style.left = left + 'px';
    btn.style.top = top + 'px';
  }

  function shrink(btn) {
    scale = scale * shrinkFactor;
    btn.style.transform = `scale(${scale})`;
  }

  function handleClick(evt) {
    const btn = evt.currentTarget;
    ensureFixed(btn);
    // trigger move and shrink
    // small timeout to ensure transitions apply if we just set fixed
    requestAnimationFrame(() => {
      moveToRandom(btn);
      shrink(btn);
    });
  }

  return { bind: function (btn) { if (btn) btn.addEventListener('click', handleClick); } };
})();

function noClicked() {
  // kept for compatibility; main behavior bound via controller
}

document.addEventListener('DOMContentLoaded', function () {
  const yes = document.getElementById('yesBtn');
  const no = document.getElementById('noBtn');
  if (yes) yes.addEventListener('click', yesClicked);
  if (no) {
    // Bind both the controller and keep legacy handler
    NoButtonController.bind(no);
    no.addEventListener('click', noClicked);
  }
});
