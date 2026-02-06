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
const POS_X = 50, POS_Y = 65; // Vị trí cố định: giữa ngang, 65% dọc

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

const handleDownload = () => {
  if (!currentImage) { alert("Đang tải ảnh mẫu, vui lòng đợi..."); return; }
  if (!guestNameInput.value.trim() && !confirm("Bạn chưa nhập tên khách. Vẫn muốn tải về?")) return;
  const scale = 2;
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = canvas.width * scale;
  exportCanvas.height = canvas.height * scale;
  const exportCtx = exportCanvas.getContext('2d');
  exportCtx.imageSmoothingEnabled = true;
  exportCtx.imageSmoothingQuality = 'high';
  exportCtx.drawImage(currentImage, 0, 0, exportCanvas.width, exportCanvas.height);
  const text = guestNameInput.value.trim();
  if (text) {
    exportCtx.font = `${fontSize * scale}px ${fontSelect.value}`;
    exportCtx.textAlign = "center";
    exportCtx.textBaseline = "middle";
    exportCtx.fillStyle = TEXT_COLOR;
    exportCtx.fillText(text, (POS_X / 100) * exportCanvas.width, (POS_Y / 100) * exportCanvas.height);
  }
  const guestName = guestNameInput.value.trim() || "thiep_moi";
  const safeName = guestName.replace(/[^a-z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]/gi, '_').trim() || "thiep_moi";
  const fileName = `${safeName}.png`;

  // iOS/Android: dùng Web Share API để lưu ảnh đúng định dạng
  const isMobile = /iPad|iPhone|iPod|Android/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (isMobile && navigator.canShare) {
    exportCanvas.toBlob((blob) => {
      if (blob && navigator.canShare({ files: [new File([blob], fileName, { type: "image/png" })] })) {
        navigator.share({
          files: [new File([blob], fileName, { type: "image/png" })],
          title: "Thiệp cưới " + guestName,
          text: "Thiệp mời đám cưới Huy & Hoa"
        }).then(() => showToast("Tải thành công!")).catch(() => fallbackDownload(exportCanvas, fileName));
      } else {
        fallbackDownload(exportCanvas, fileName);
      }
    }, "image/png", 1);
    return;
  }

  fallbackDownload(exportCanvas, fileName);
};

function fallbackDownload(canvasEl, fileName) {
  canvasEl.toBlob((blob) => {
    if (!blob) {
      const link = document.createElement("a");
      link.download = fileName;
      link.href = canvasEl.toDataURL("image/png");
      link.click();
    } else {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = fileName;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }
    showToast("Tải thành công!");
  }, "image/png", 1);
};
if (downloadBtn) downloadBtn.addEventListener('click', handleDownload);
const mobileDownloadBtn = downloadBtnMobile?.querySelector('button');
if (mobileDownloadBtn) mobileDownloadBtn.addEventListener('click', handleDownload);

function showToast(msg) {
  const toast = document.getElementById('toast');
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
