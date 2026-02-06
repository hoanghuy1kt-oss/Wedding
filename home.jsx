<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover">
    <title>Công Cụ Viết Tên Thiệp Cưới</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Added subset=vietnamese to ensure full support -->
    <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@400;600&display=swap&subset=vietnamese" rel="stylesheet">
    <style>
        body {
            font-family: 'Montserrat', sans-serif;
            background-color: #fdfbf7;
        }
        /* Custom scrollbar for better look */
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
        ::-webkit-scrollbar-thumb {
            background: #d4af37;
            border-radius: 4px;
        }
        .canvas-container {
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            border: 1px solid #e5e7eb;
            background-image: url('data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%239C92AC" fill-opacity="0.1" fill-rule="evenodd"%3E%3Ccircle cx="3" cy="3" r="3"/%3E%3Ccircle cx="13" cy="13" r="3"/%3E%3C/g%3E%3C/svg%3E');
        }
        input[type=range] {
            accent-color: #1e3a8a;
            min-height: 44px; /* Touch target for mobile */
        }
        @media (max-width: 640px) {
            .canvas-container { max-width: 100%; }
            #canvas { max-width: 100%; height: auto; }
        }
        /* Fix for input font */
        input#guestName {
            font-family: 'Montserrat', sans-serif;
        }
    </style>
</head>
<body class="min-h-screen text-gray-800">

    <!-- Header -->
    <header class="bg-blue-900 text-white p-3 md:p-4 shadow-md sticky top-0 z-50">
        <div class="container mx-auto flex justify-center items-center">
            <h1 class="text-lg sm:text-xl md:text-2xl font-serif font-bold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Đám cưới Huy & Hoa
            </h1>
        </div>
    </header>

    <main class="container mx-auto p-3 md:p-8 flex flex-col lg:flex-row gap-4 md:gap-8">
        
        <!-- Left Column: Controls -->
        <div class="w-full lg:w-1/3 space-y-4 md:space-y-6 bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100 h-fit">
            
            <div class="space-y-4">
                <label class="block text-sm font-semibold text-gray-600 uppercase tracking-wider">1. Nhập thông tin</label>
                
                <div>
                    <label class="text-xs text-gray-500 font-bold mb-1 block">Tên khách mời:</label>
                    <!-- Changed class font-serif to font-sans and added explicit style to fix font issue -->
                    <input type="text" id="guestName" placeholder="Nhập tên vào đây..." class="w-full p-3 border-2 border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-sans text-lg text-blue-900 placeholder-blue-200">
                    <p class="text-[10px] text-gray-400 mt-1">* Nhập tên để thấy khung đỏ định vị trên hình</p>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2">
                        <label class="text-xs text-gray-500 font-bold mb-1 block">Phông chữ (trên ảnh):</label>
                        <select id="fontFamily" class="w-full p-2 border border-gray-300 rounded-lg bg-white">
                            <option value="'Great Vibes', cursive">Viết tay mềm mại</option>
                            <option value="'Dancing Script', cursive">Viết tay hiện đại</option>
                            <option value="'Montserrat', sans-serif">Hiện đại (Sans)</option>
                        </select>
                    </div>
                    <div class="col-span-2">
                        <label class="text-xs text-gray-500 font-bold mb-1 block">Màu chữ:</label>
                        <div class="flex items-center gap-2 border p-1 rounded-lg">
                            <input type="color" id="textColor" value="#2d3748" class="h-8 w-8 p-0 border-0 rounded cursor-pointer">
                            <span class="text-xs font-mono text-gray-600" id="colorHex">#2D3748</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="space-y-4 pt-4 border-t border-gray-100">
                <label class="block text-sm font-semibold text-gray-600 uppercase tracking-wider">2. Căn chỉnh vị trí</label>
                
                <!-- Sliders -->
                <div class="space-y-3 bg-gray-50 p-3 rounded-lg">
                    <div>
                        <div class="flex justify-between mb-1">
                            <label class="text-xs text-gray-500">Cỡ chữ (To/Nhỏ)</label>
                            <span id="sizeVal" class="text-xs font-bold text-blue-600">--</span>
                        </div>
                        <input type="range" id="fontSize" min="20" max="300" value="50" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer hover:bg-gray-300">
                    </div>

                    <div>
                        <div class="flex justify-between mb-1">
                            <label class="text-xs text-gray-500">Vị trí Ngang (Trái/Phải)</label>
                            <span id="posXVal" class="text-xs font-bold text-blue-600">84%</span>
                        </div>
                        <input type="range" id="posX" min="0" max="100" value="84" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer hover:bg-gray-300">
                    </div>

                    <div>
                        <div class="flex justify-between mb-1">
                            <label class="text-xs text-gray-500">Vị trí Dọc (Lên/Xuống)</label>
                            <span id="posYVal" class="text-xs font-bold text-blue-600">65%</span>
                        </div>
                        <input type="range" id="posY" min="0" max="100" value="65" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer hover:bg-gray-300">
                    </div>
                </div>
            </div>

            <button id="downloadBtn" class="w-full bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-white font-bold py-4 px-4 min-h-[52px] rounded-xl shadow-xl hover:shadow-2xl transition transform active:scale-[0.98] flex items-center justify-center gap-2 group touch-manipulation">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span class="text-lg">Tải Thiệp Về Ngay</span>
            </button>
            <p class="text-xs text-gray-400 text-center italic">Chạm hoặc click lên ảnh để đặt vị trí chữ.</p>

        </div>

        <!-- Right Column: Canvas Preview -->
        <div class="w-full lg:w-2/3 flex flex-col items-center">
            <div class="canvas-container bg-white rounded-lg overflow-hidden w-full relative shadow-2xl">
                <!-- Fallback Text if Canvas not supported -->
                <div id="placeholder" class="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none z-0 bg-gray-50">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 md:h-20 md:w-20 mb-4 text-blue-200 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="font-bold text-sm md:text-lg text-gray-500 text-center px-4">Đang tải ảnh mẫu...</span>
                </div>
                <!-- The Canvas -->
                <canvas id="canvas" class="w-full h-auto cursor-crosshair relative z-10"></canvas>
            </div>
        </div>

    </main>

    <!-- Notification Toast -->
    <div id="toast" class="fixed bottom-5 right-5 left-5 sm:left-auto sm:right-5 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl transform translate-y-20 opacity-0 transition-all duration-300 z-50 flex items-center gap-3 max-w-[calc(100vw-2rem)]">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span id="toastMsg">Thành công!</span>
    </div>

    <script>
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const guestNameInput = document.getElementById('guestName');
        const fontSizeInput = document.getElementById('fontSize');
        const fontSelect = document.getElementById('fontFamily');
        const colorInput = document.getElementById('textColor');
        // Removed strokeInput as requested
        const posXInput = document.getElementById('posX');
        const posYInput = document.getElementById('posY');
        const downloadBtn = document.getElementById('downloadBtn');
        const sizeValDisplay = document.getElementById('sizeVal');
        const placeholder = document.getElementById('placeholder');
        const colorHexDisplay = document.getElementById('colorHex');
        const posXValDisplay = document.getElementById('posXVal');
        const posYValDisplay = document.getElementById('posYVal');

        let currentImage = null;
        const fileName = "thiep_cuoi";
        const DEFAULT_IMAGE_PATH = "thiep cuoi.jpg";

        // Initialize Canvas with default width/height
        canvas.width = 800;
        canvas.height = 600;

        // Load default image on page load
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
            img.onerror = () => {
                showToast("Không thể tải ảnh mẫu. Kiểm tra đường dẫn: " + DEFAULT_IMAGE_PATH);
            };
            img.src = DEFAULT_IMAGE_PATH;
        }
        loadDefaultImage();

        // --- Core Functions ---

        // isExporting = true means we are downloading (no red box)
        // isExporting = false means we are editing (show red box)
        function draw(isExporting = false) {
            if (!currentImage) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                return;
            }

            // 1. Draw Image
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(currentImage, 0, 0);

            // 2. Get Input Values
            const text = guestNameInput.value;
            if (!text) return; // If no text, just show image

            const fontSize = parseInt(fontSizeInput.value);
            const fontFamily = fontSelect.value;
            const color = colorInput.value;
            
            // Convert % slider values to pixel coordinates
            const x = (parseInt(posXInput.value) / 100) * canvas.width;
            const y = (parseInt(posYInput.value) / 100) * canvas.height;

            // 3. Setup Font
            ctx.font = `${fontSize}px ${fontFamily}`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            // 4. Draw Text (No stroke)
            ctx.fillStyle = color;
            ctx.fillText(text, x, y);

            // 5. Draw Helper Box (Only when NOT exporting)
            if (!isExporting) {
                const metrics = ctx.measureText(text);
                const textWidth = metrics.width;
                const textHeight = fontSize; // Approximate height

                ctx.save();
                ctx.strokeStyle = "rgba(255, 0, 0, 0.7)"; // Red dashed line
                ctx.lineWidth = 2;
                ctx.setLineDash([10, 5]);
                // Draw rect centered at x, y
                ctx.strokeRect(x - textWidth/2 - 10, y - textHeight/2 - 5, textWidth + 20, textHeight + 10);
                
                // Draw a crosshair at the exact center point
                ctx.beginPath();
                ctx.moveTo(x - 10, y);
                ctx.lineTo(x + 10, y);
                ctx.moveTo(x, y - 10);
                ctx.lineTo(x, y + 10);
                ctx.stroke();
                ctx.restore();
            }
        }

        // --- Event Listeners ---

        // 1. Handle Inputs

        // 2. Handle Inputs triggering redraw
        const inputs = [guestNameInput, fontSizeInput, fontSelect, colorInput, posXInput, posYInput];
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input === fontSizeInput) sizeValDisplay.textContent = input.value + 'px';
                if (input === colorInput) colorHexDisplay.textContent = input.value.toUpperCase();
                if (input === posXInput) posXValDisplay.textContent = input.value + '%';
                if (input === posYInput) posYValDisplay.textContent = input.value + '%';
                draw(false); // Draw with guide box
            });
        });

        // 2. Click/Touch on Canvas to set Position (mobile-friendly)
        function getCanvasCoords(e) {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const x = (clientX - rect.left) * scaleX;
            const y = (clientY - rect.top) * scaleY;
            return { x, y };
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

        // 3. Download Function - Highest quality export (2x resolution for print)
        downloadBtn.addEventListener('click', () => {
            if (!currentImage) {
                alert("Đang tải ảnh mẫu, vui lòng đợi...");
                return;
            }
            if (!guestNameInput.value.trim()) {
                if(!confirm("Bạn chưa nhập tên khách. Vẫn muốn tải về?")) return;
            }
            
            // Create high-res export canvas (2x for highest quality)
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
                const fontSize = parseInt(fontSizeInput.value) * scale;
                const fontFamily = fontSelect.value;
                const color = colorInput.value;
                const x = (parseInt(posXInput.value) / 100) * exportCanvas.width;
                const y = (parseInt(posYInput.value) / 100) * exportCanvas.height;
                exportCtx.font = `${fontSize}px ${fontFamily}`;
                exportCtx.textAlign = "center";
                exportCtx.textBaseline = "middle";
                exportCtx.fillStyle = color;
                exportCtx.fillText(text, x, y);
            }
            
            const link = document.createElement('a');
            const guestName = guestNameInput.value.trim() || "thiep_moi";
            const safeName = guestName.replace(/[^a-z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]/gi, '_');
            link.download = `${safeName}.png`;
            link.href = exportCanvas.toDataURL('image/png');
            link.click();
            
            showToast("Đang tải ảnh chất lượng cao...");
        });

        function showToast(msg) {
            const toast = document.getElementById('toast');
            const toastMsg = document.getElementById('toastMsg');
            toastMsg.innerText = msg;
            toast.classList.remove('translate-y-20', 'opacity-0');
            setTimeout(() => {
                toast.classList.add('translate-y-20', 'opacity-0');
            }, 3000);
        }
        
    </script>
</body>
</html>