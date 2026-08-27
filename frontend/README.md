# CosmoVision Frontend

React + Vite + Tailwind, chuyen doi tu thiet ke Google Stitch, ket noi that voi backend CosmoVision.

## Cai dat

```bash
cd cosmovision-frontend
npm install
cp .env.example .env
```

Mo `.env`, dam bao `VITE_API_BASE_URL` tro dung toi backend dang chay:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## Chay

**Quan trong: phai chay backend TRUOC** (o thu muc `cosmovision-backend`, lenh `npm run dev`), roi moi chay frontend:

```bash
npm run dev
```

Mo trinh duyet vao `http://localhost:3000`.

## Cau truc

```
src/
├── api/
│   ├── client.js        # Goi API backend (auth, planets, chatbot...)
│   └── AuthContext.jsx  # Quan ly trang thai dang nhap toan app
├── components/          # TopNavBar, BottomNavBar, Loading/Error, ProtectedRoute
├── layouts/
│   └── MainLayout.jsx   # Khung chung (NavBar + noi dung)
├── pages/                # 10 man hinh, moi file 1 trang
├── App.jsx               # Dinh nghia route
├── main.jsx
└── index.css             # Cac class dung chung tu thiet ke Stitch (glass-panel, chip, btn-gradient...)
```

## Danh sach trang va API tuong ung

| Trang | Route | API goi |
|---|---|---|
| Sign In | `/signin` | POST `/auth/signin` |
| Sign Up | `/signup` | POST `/auth/signup` |
| Home Dashboard | `/` | GET `/sky-events`, `/planets`, `/stargazing/recommendations` |
| Planet Explorer | `/planets` | GET `/planets`, `/planets/search` |
| Planet Detail | `/planets/:id` | GET `/planets/:id` |
| Chatbot | `/chat` | POST `/chatbot/message` |
| Stargazing | `/stargazing` | GET `/stargazing/recommendations` |
| Constellation Identifier | `/constellations` | POST `/stargazing/constellations/identify` |
| Observatory Finder | `/observatories` | GET `/observatories/nearby` |
| News | `/news` | GET `/news/summary` |
| Profile | `/profile` (can dang nhap) | GET/PATCH `/users/me` |

## Ghi chu quan trong

- **Geolocation**: cac trang Home, Stargazing, Observatory Finder se xin quyen truy cap vi tri trinh duyet.
  Neu tu choi, se dung mac dinh toa do Ha Noi.
- **accessToken** chi luu trong bo nho (khong dung localStorage de an toan hon truoc XSS) — nghia la
  F5 trang se tu dong goi lai `/auth/refresh` (dua vao cookie) de khoi phuc dang nhap. Neu backend
  chua chay hoac cookie het han, se tro ve trang thai chua dang nhap — binh thuong.
- **Ban do that** (Observatory Finder) hien dang la placeholder — can tich hop Google Maps hoac
  Mapbox neu muon co ban do that (co the yeu cau them API key rieng).
- Doi voi phan **Constellation Identifier**, ket qua tra ve tu backend hien la **du lieu gia lap**
  (mock) — dung nhu ghi chu trong backend, chua phai model AI that.

## Build production

```bash
npm run build
```

File build nam trong thu muc `dist/`, co the deploy len Vercel/Netlify/GitHub Pages...
