# 🌾 AgriTrust Connect — Demo

A friendly Next.js + TypeScript demo UI showcasing a network-aware rural farming & insurance dashboard. Built with mock data to demonstrate features like claim filing, offline sync indications, truck deliveries, equipment rental, and an embedded map view.

This repo is a lightweight demo used in a hackathon setting — feel free to adapt, extend, or reuse components for your own projects.

## 🚀 Highlights

- Beautiful, responsive UI built with Tailwind CSS and Framer Motion
- Mock data for claims, trucks, weather alerts, and equipment rentals
- Internationalization (i18n) with English, Hindi, and Bengali translations
- Map view (react-leaflet) integrated client-side (demo-ready)
- Offline-aware UI indicators and simple toast notifications

## 🧩 Quick start

Make sure Node.js is installed (recommended v18+). Then:

```powershell
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## 🛠 Available scripts

- `npm run dev` — Run development server
- `npm run build` — Build for production
- `npm run start` — Start production server (after build)

## 🧪 Notes & troubleshooting

- The demo uses `react-leaflet` for the map. If you see type warnings during local development, they were intentionally relaxed in the demo to keep things simple. For production-grade apps, extract the map into a client-only component and provide explicit types for `react-leaflet` and `leaflet`.
- If Tailwind styles don't show, ensure `npm install` completed and your editor restarted (sometimes Tailwind requires a restart to pick up the JIT build).

## 📦 Tech stack

- Next.js 15 + app router
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- react-leaflet + leaflet
- i18next / react-i18next

## 🤝 Contributing

This repository is intended as a small demo. If you'd like to contribute improvements (better typing for the map, smaller bundle, tests), please open a PR or reach out.

## 📝 License

This project is available under the MIT License. See `LICENSE`.

---

Made with ❤️ for farmers and hackathons.
