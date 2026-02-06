# Đám cưới Huy & Hoa - Thiệp Cưới

Công cụ tạo thiệp cưới cá nhân hóa - nhập tên khách mời và tải về ảnh chất lượng cao.

## Chạy dự án

```bash
npm install
npm run dev
```

Mở http://localhost:5173 trong trình duyệt.

## Build

```bash
npm run build
```

File build nằm trong thư mục `dist/`.

## Deploy & GitHub

### Đẩy code lên GitHub

1. Cài đặt [Git](https://git-scm.com/) nếu chưa có.
2. Tạo repository mới trên [GitHub](https://github.com/new) (đặt tên ví dụ: `wedding-huy-hoa`).
3. Chạy trong thư mục dự án:

```bash
git init
git add .
git commit -m "Initial commit - Đám cưới Huy & Hoa"
git branch -M main
git remote add origin https://github.com/TEN-CUA-BAN/wedding-huy-hoa.git
git push -u origin main
```

*(Thay `TEN-CUA-BAN` bằng tên tài khoản GitHub của bạn)*

### Deploy lên GitHub Pages

1. Chạy `npm run build`
2. Vào Settings → Pages của repo trên GitHub
3. Source chọn **Deploy from a branch**
4. Branch chọn `main`, folder chọn `/ (root)` hoặc `/dist` tùy cấu hình

Hoặc dùng GitHub Actions để tự động deploy.

### Deploy lên Vercel

1. Push code lên GitHub
2. Vào [vercel.com](https://vercel.com) → Import Project → chọn repo
3. Vercel tự nhận Vite (có `vercel.json`). Bấm **Deploy**
4. Sau khi deploy xong, bạn có URL dạng: `wedding-huy-hoa.vercel.app`

### Cài app trên điện thoại (PWA)

1. Mở web trên trình duyệt Chrome/Safari trên điện thoại
2. **Android (Chrome):** Menu (⋮) → **Cài đặt** → **Thêm vào màn hình chính** / **Install app**
3. **iOS (Safari):** Nút Chia sẻ (⬆) → **Thêm vào Màn hình chính**
