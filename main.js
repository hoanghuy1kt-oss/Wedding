const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const guestNameInput = document.getElementById('guestName');
const fontSizeInput = document.getElementById('fontSize');
const fontSelect = document.getElementById('fontFamily');
const colorInput = document.getElementById('textColor');
const posXInput = document.getElementById('posX');
const posYInput = document.getElementById('posY');
const downloadBtn = document.getElementById('downloadBtn');
const downloadBtnHeader = document.getElementById('downloadBtnHeader');
const sizeValDisplay = document.getElementById('sizeVal');
const placeholder = document.getElementById('placeholder');
const colorHexDisplay = document.getElementById('colorHex');
const posXValDisplay = document.getElementById('posXVal');
const posYValDisplay = document.getElementById('posYVal');

let currentImage = null;
const DEFAULT_IMAGE_PATH = "/thiep cuoi.jpg";

canvas.width = 800;
canvas.height = 600;

function loadDefaultImage() {
  const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    currentImage = img;
    const autoSize = Math.floor(img.width / 25);
    fontSizeInput.value = autoSize;
    fontSizeInput.max = autoSize * 3;
    fontSizeInput.min = Math.floor(autoSize / 2);
    sizeValDisplay.textContent = autoSize + 'px';
    placeholder.style.display = 'none';
    posXInput.value = 84;
    posYInput.value = 65;
    posXValDisplay.textContent = '84%';
    posYValDisplay.textContent = '65%';
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
  const fontSize = parseInt(fontSizeInput.value);
  const fontFamily = fontSelect.value;
  const color = colorInput.value;
  const x = (parseInt(posXInput.value) / 100) * canvas.width;
  const y = (parseInt(posYInput.value) / 100) * canvas.height;
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  if (!isExporting) {
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const textHeight = fontSize;
    ctx.save();
    ctx.strokeStyle = "rgba(255, 0, 0, 0.7)";
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 5]);
    ctx.strokeRect(x - textWidth/2 - 10, y - textHeight/2 - 5, textWidth + 20, textHeight + 10);
    ctx.beginPath();
    ctx.moveTo(x - 10, y); ctx.lineTo(x + 10, y);
    ctx.moveTo(x, y - 10); ctx.lineTo(x, y + 10);
    ctx.stroke();
    ctx.restore();
  }
}

// Tối ưu: debounce cho ô nhập tên (giảm lag khi gõ)
function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}
// requestAnimationFrame - chỉ vẽ tối đa 1 lần/frame
let rafId = null;
function scheduleDraw() {
  if (rafId) return;
  rafId = requestAnimationFrame(() => {
    draw(false);
    rafId = null;
  });
}
const debouncedDraw = debounce(scheduleDraw, 80);

const inputs = [guestNameInput, fontSizeInput, fontSelect, colorInput, posXInput, posYInput];
inputs.forEach(input => {
  input.addEventListener('input', () => {
    if (input === fontSizeInput) sizeValDisplay.textContent = input.value + 'px';
    if (input === colorInput) colorHexDisplay.textContent = input.value.toUpperCase();
    if (input === posXInput) posXValDisplay.textContent = input.value + '%';
    if (input === posYInput) posYValDisplay.textContent = input.value + '%';
    // Ô tên: debounce để gõ mượt; slider/select/color: rAF
    if (input === guestNameInput) debouncedDraw();
    else scheduleDraw();
  });
});

function getCanvasCoords(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
}
function handleCanvasPointer(e) {
  if (!currentImage) return;
  e.preventDefault();
  const { x, y } = getCanvasCoords(e);
  const percentX = (x / canvas.width) * 100;
  const percentY = (y / canvas.height) * 100;
  posXInput.value = percentX;
  posYInput.value = percentY;
  posXValDisplay.textContent = Math.round(percentX) + '%';
  posYValDisplay.textContent = Math.round(percentY) + '%';
  draw(false);
}
canvas.addEventListener('mousedown', handleCanvasPointer);
canvas.addEventListener('touchstart', handleCanvasPointer, { passive: false });

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
    exportCtx.font = `${parseInt(fontSizeInput.value) * scale}px ${fontSelect.value}`;
    exportCtx.textAlign = "center";
    exportCtx.textBaseline = "middle";
    exportCtx.fillStyle = colorInput.value;
    exportCtx.fillText(text, (parseInt(posXInput.value) / 100) * exportCanvas.width, (parseInt(posYInput.value) / 100) * exportCanvas.height);
  }
  const guestName = guestNameInput.value.trim() || "thiep_moi";
  const safeName = guestName.replace(/[^a-z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]/gi, '_');
  const link = document.createElement('a');
  link.download = `${safeName}.png`;
  link.href = exportCanvas.toDataURL('image/png');
  link.click();
  showToast("Tải thành công!");
};
downloadBtn.addEventListener('click', handleDownload);
if (downloadBtnHeader) downloadBtnHeader.addEventListener('click', handleDownload);

function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').innerText = msg;
  toast.classList.remove('translate-y-20', 'opacity-0');
  setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 3000);
}

// Nút Tải app (PWA)
let deferredPrompt;
const installBtn = document.getElementById('installBtn');
if (installBtn) {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.classList.remove('hidden');
  });
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      installBtn.classList.add('hidden');
      showToast('Đã thêm app vào màn hình!');
    }
    deferredPrompt = null;
  });
  // Ẩn nút nếu đã cài (chạy ở chế độ standalone)
  if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
    installBtn.classList.add('hidden');
  }
}
