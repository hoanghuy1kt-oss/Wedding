const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const guestNameInput = document.getElementById('guestName');
const fontSelect = document.getElementById('fontFamily');
const TEXT_COLOR = "#2d3748";
const downloadBtn = document.getElementById('downloadBtn');
const downloadBtnMobile = document.getElementById('downloadBtnMobile');
const placeholder = document.getElementById('placeholder');

let currentImage = null;
let fontSize = 50;
const DEFAULT_IMAGE_PATH = "/thiep cuoi.jpg";
const POS_X = 84, POS_Y = 65; // Vị trí mặc định: Ngang 84%, Dọc 65%

canvas.width = 800;
canvas.height = 600;

function loadDefaultImage() {
  const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    currentImage = img;
    fontSize = Math.floor(img.width / 25);
    placeholder.style.display = 'none';
    draw();
    showToast("Đã tải ảnh mẫu! Hãy nhập tên khách.");
  };
  img.onerror = () => showToast("Không thể tải ảnh mẫu.");
  img.src = DEFAULT_IMAGE_PATH;
}
loadDefaultImage();

function draw(isExporting = false) {
  if (!currentImage) { ctx.clearRect(0, 0, canvas.width, canvas.height); return; }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(currentImage, 0, 0);
  const text = guestNameInput.value;
  if (!text) return;
  const fontFamily = fontSelect.value;
  const x = (POS_X / 100) * canvas.width;
  const y = (POS_Y / 100) * canvas.height;
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = TEXT_COLOR;
  ctx.fillText(text, x, y);
}

function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}
let rafId = null;
function scheduleDraw() {
  if (rafId) return;
  rafId = requestAnimationFrame(() => { draw(false); rafId = null; });
}
const debouncedDraw = debounce(scheduleDraw, 80);

guestNameInput.addEventListener('input', debouncedDraw);
fontSelect.addEventListener('input', scheduleDraw);

let isDownloading = false;
function setDownloadButtonsEnabled(enabled) {
  const btns = [downloadBtn, downloadBtnMobile?.querySelector('button')].filter(Boolean);
  btns.forEach(btn => {
    btn.disabled = !enabled;
    btn.classList.toggle('opacity-60', !enabled);
    btn.classList.toggle('pointer-events-none', !enabled);
  });
}

function showLoadingOverlay() {
  const el = document.getElementById('loadingOverlay');
  if (el) {
    el.classList.remove('opacity-0', 'pointer-events-none');
    el.classList.add('opacity-100', 'pointer-events-auto');
    el.setAttribute('aria-hidden', 'false');
  }
}

function hideLoadingOverlay() {
  const el = document.getElementById('loadingOverlay');
  if (el) {
    el.classList.add('opacity-0', 'pointer-events-none');
    el.classList.remove('opacity-100', 'pointer-events-auto');
    el.setAttribute('aria-hidden', 'true');
  }
}

const handleDownload = () => {
  if (!currentImage) { showToast("Đang tải ảnh mẫu, vui lòng đợi..."); return; }
  const guestName = guestNameInput.value.trim();
  if (!guestName) { showToast("Vui lòng nhập tên khách mời"); return; }
  if (isDownloading) return;
  isDownloading = true;
  setDownloadButtonsEnabled(false);
  showLoadingOverlay();
  // Vẽ lại canvas chính để đảm bảo có nội dung mới nhất
  draw();
  const scale = 2;
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = canvas.width * scale;
  exportCanvas.height = canvas.height * scale;
  const exportCtx = exportCanvas.getContext('2d');
  exportCtx.imageSmoothingEnabled = true;
  exportCtx.imageSmoothingQuality = 'high';
  // Sao chép từ canvas chính (đã hiển thị đúng) để tránh lỗi CORS/tainted canvas
  exportCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, exportCanvas.width, exportCanvas.height);

  const safeName = guestName.replace(/[^a-z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]/gi, '_').trim() || "thiep_moi";
  const fileName = `${safeName}.png`;

  function onDownloadComplete() {
    isDownloading = false;
    setDownloadButtonsEnabled(true);
    hideLoadingOverlay();
    showToast("Tải thành công!");
  }

  const isMobile = /iPad|iPhone|iPod|Android/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  exportCanvas.toBlob((blob) => {
    if (!blob) {
      onDownloadComplete();
      showToast("Không thể tạo ảnh. Vui lòng thử lại.");
      return;
    }
    const file = new File([blob], fileName, { type: "image/png" });

    // iOS/Android: Web Share API - cách tin cậy nhất trên mobile
    if (isMobile && navigator.share) {
      let canShareFiles = false;
      try {
        canShareFiles = navigator.canShare && navigator.canShare({ files: [file] });
      } catch (_) {}
      if (canShareFiles) {
        navigator.share({
          files: [file],
          title: "Thiệp cưới " + guestName,
          text: "Thiệp mời đám cưới Huy & Hoa"
        }).then(() => onDownloadComplete()).catch((err) => {
          if (err.name !== "AbortError") {
            fallbackDownload(blob, fileName, onDownloadComplete, isMobile);
          } else {
            onDownloadComplete();
          }
        });
        return;
      }
    }

    fallbackDownload(blob, fileName, onDownloadComplete, isMobile);
  }, "image/png", 1);
};

function fallbackDownload(blobOrCanvas, fileName, onComplete, isMobile = false) {
  if (blobOrCanvas instanceof HTMLCanvasElement) {
    blobOrCanvas.toBlob((b) => b && fallbackDownload(b, fileName, onComplete, isMobile), "image/png", 1);
    return;
  }
  const blob = blobOrCanvas;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = fileName;
  link.href = url;
  link.rel = "noopener";
  if (isMobile) {
    link.target = "_blank";
    link.style.display = "none";
  }
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
  if (isMobile) {
    showToast("Mở ảnh trong tab mới. Chạm giữ ảnh để lưu.");
  }
  onComplete();
}
if (downloadBtn) downloadBtn.addEventListener('click', handleDownload);
const mobileDownloadBtn = downloadBtnMobile?.querySelector('button');
if (mobileDownloadBtn) mobileDownloadBtn.addEventListener('click', handleDownload);

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  document.getElementById('toastMsg').innerText = msg;
  toast.classList.remove('translate-y-20', 'opacity-0');
  setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 3000);
}

// Nút Tải app (PWA)
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
    if (outcome === 'accepted') {
      installBtnWrap.classList.add('hidden');
      showToast('Đã thêm app vào màn hình!');
    }
    deferredPrompt = null;
  });
  // Ẩn nút nếu đã cài (chạy ở chế độ standalone)
  if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
    installBtnWrap.classList.add('hidden');
  }
}
