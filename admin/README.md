# ⚙️ E-Market: Admin Dashboard

This is the independent administrator dashboard for the E-Market platform. Built as a fast, responsive Single Page Application (SPA) using React, Vite, and Lucide Icons, it interfaces directly with the serverless Cloudflare Workers API.

## 🚀 Features
- **Modern Dark UI:** Sleek glassmorphic dark-theme controls and data tables.
- **Product CRUD:** Manage catalog, variants, and colors.
- **Image Optimizer & R2 Uploader:** Compresses images to 800x800px WebP client-side inside the browser before uploading them directly, reducing API execution limits.
- **Order & Returns Manager:** Visual order lifecycle tracking and customer return approval screens with proof images.
- **System settings:** Real-time configuration for shipping rates, weight calculations, and maintenance flags.

## 📦 Scripts
- `npm run dev` - Launch development server.
- `npm run build` - Compile production package (`dist/`).
- `npm run preview` - Preview production build.
- `npm run lint` - Run ESLint verification.
