const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const guestNameInput = document.getElementById('guestName');
const fontSelect = document.getElementById('fontFamily');
const TEXT_COLOR = "#2d3748";
const POS_X = 84, POS_Y = 65;

let currentImage = null;
let imageBlob = null; // Lưu blob gốc để export không bị tainted
let fontSize = 50;
const DEFAULT_IMAGE_PATH = "/thiep cuoi.jpg";

canvas.width = 800;
canvas.height = 600;

function loadDefaultImage() {
  fetch(DEFAULT_IMAGE_PATH)
    .then((res) => {
      if (!res.ok) throw new Error("Network error");
      return res.blob();
    })
    .then((blob) => {
      imageBlob = blob;
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        canvas.width = img.width;
        canvas.height = img.height;
        currentImage = img;
        fontSize = Math.floor(img.width / 25);
        document.getElementById("placeholder").style.display = "none";
        draw();
        showToast("Đã tải ảnh mẫu! Hãy nhập tên khách.");
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        imageBlob = null;
        showToast("Không thể tải ảnh mẫu.");
      };
      img.src = url;
    })
    .catch(() => showToast("Không thể tải ảnh mẫu."));
}
loadDefaultImage();

function draw() {
  if (!currentImage) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(currentImage, 0, 0);
  const text = guestNameInput.value.trim();
  if (!text) return;
  ctx.font = `${fontSize}px ${fontSelect.value}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = TEXT_COLOR;
  ctx.fillText(text, (POS_X / 100) * canvas.width, (POS_Y / 100) * canvas.height);
}

function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}
let rafId = null;
function scheduleDraw() {
  if (rafId) return;
  rafId = requestAnimationFrame(() => { draw(); rafId = null; });
}

guestNameInput.addEventListener('input', debounce(scheduleDraw, 80));
fontSelect.addEventListener('input', scheduleDraw);

let isDownloading = false;

function setButtonsState(enabled) {
  const btns = [document.getElementById('downloadBtn'), document.getElementById('downloadBtnMobileBtn')].filter(Boolean);
  btns.forEach(b => {
    b.disabled = !enabled;
    b.style.opacity = enabled ? '1' : '0.6';
    b.style.pointerEvents = enabled ? 'auto' : 'none';
  });
}

function showLoading(show) {
  const el = document.getElementById('loadingOverlay');
  if (!el) return;
  el.style.opacity = show ? '1' : '0';
  el.style.pointerEvents = show ? 'auto' : 'none';
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toastMsg');
  if (!toast || !msgEl) return;
  msgEl.textContent = msg;
  toast.classList.remove('translate-y-20', 'opacity-0');
  setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 3000);
}

/** Tạo canvas export từ blob gốc (createImageBitmap) để tránh canvas tainted → ảnh không bị đen */
async function createExportImage() {
  if (!imageBlob) throw new Error("Chưa có ảnh gốc");
  const bitmap = await createImageBitmap(imageBlob);
  const guestName = guestNameInput.value.trim();
  const scale = 2;
  const w = bitmap.width * scale;
  const h = bitmap.height * scale;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx2 = c.getContext("2d");
  ctx2.imageSmoothingEnabled = true;
  ctx2.imageSmoothingQuality = "high";
  ctx2.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  ctx2.font = `${fontSize * scale}px ${fontSelect.value}`;
  ctx2.textAlign = "center";
  ctx2.textBaseline = "middle";
  ctx2.fillStyle = TEXT_COLOR;
  ctx2.fillText(guestName, (POS_X / 100) * w, (POS_Y / 100) * h);
  return c;
}

function getSafeFileName(name) {
  return (name || 'thiep_moi').replace(/[^a-zA-Z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]/g, '_').trim() || 'thiep_moi';
}

function triggerDownload(dataUrl, fileName) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = fileName;
  a.style.cssText = 'position:fixed;left:-9999px;';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

async function handleDownload() {
  if (!currentImage || !imageBlob) {
    showToast("Đang tải ảnh mẫu, vui lòng đợi...");
    return;
  }
  const guestName = guestNameInput.value.trim();
  if (!guestName) {
    showToast("Vui lòng nhập tên khách mời");
    return;
  }
  if (isDownloading) return;

  isDownloading = true;
  setButtonsState(false);
  showLoading(true);

  const done = (success, msg) => {
    isDownloading = false;
    setButtonsState(true);
    showLoading(false);
    if (success && msg) showToast(msg);
  };

  let exportCanvas;
  try {
    exportCanvas = await createExportImage();
  } catch (err) {
    done(false);
    showToast("Không thể tạo ảnh. Vui lòng thử lại.");
    return;
  }
  const fileName = getSafeFileName(guestName) + ".png";

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  exportCanvas.toBlob(
    (blob) => {
      if (!blob) {
        const dataUrl = exportCanvas.toDataURL('image/png');
        if (dataUrl && dataUrl.length > 100) {
          triggerDownload(dataUrl, fileName);
          done(true, "Tải thành công!");
        } else {
          done(false);
          showToast("Không thể tạo ảnh. Vui lòng thử lại.");
        }
        return;
      }

      const file = new File([blob], fileName, { type: 'image/png' });
      const isAndroid = /Android/i.test(navigator.userAgent);

      // Android & iOS: Web Share – có ảnh thật, lưu/gửi qua bảng chia sẻ
      if ((isIOS || isAndroid) && navigator.share && navigator.canShare?.({ files: [file] })) {
        navigator
          .share({ files: [file], title: 'Thiệp cưới ' + guestName })
          .then(() => {
            done(true, isAndroid
              ? "Đã chia sẻ thành công! Ảnh đã lưu/gửi qua app bạn chọn."
              : "Đã xong! Nếu chọn 'Lưu ảnh', thiệp đã nằm trong Thư viện Ảnh.");
          })
          .catch((err) => {
            if (err.name === 'AbortError') done(false);
            else {
              // iOS/Android fallback: mở ảnh trong tab mới → chạm giữ để lưu
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = fileName;
              a.target = '_blank';
              a.style.cssText = 'position:fixed;left:-9999px;';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              setTimeout(() => URL.revokeObjectURL(url), 10000);
              done(true, isIOS
                ? "Ảnh đã mở. Chạm giữ ảnh → chọn 'Lưu ảnh' để lưu vào Thư viện Ảnh."
                : "Mở ảnh trong tab mới. Chạm giữ ảnh → Lưu ảnh.");
            }
          });
        return;
      }

      // Desktop: tải về
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.style.cssText = 'position:fixed;left:-9999px;';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      done(true, "Tải thành công!");
    },
    'image/png',
    1
  );
}

document.addEventListener('click', (e) => {
  const t = e.target.closest('#downloadBtn, #downloadBtnMobileBtn');
  if (t && !t.disabled) {
    e.preventDefault();
    handleDownload();
  }
});

let deferredPrompt;
const installBtn = document.getElementById('installBtn');
const installBtnWrap = document.getElementById('installBtnWrap');
if (installBtn && installBtnWrap) {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtnWrap.classList.remove('hidden');
  });
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') showToast('Đã thêm app vào màn hình!');
    deferredPrompt = null;
  });
  if (window.matchMedia('(display-mode: standalone)').matches || navigator.standalone) {
    installBtnWrap.classList.add('hidden');
  }
}
