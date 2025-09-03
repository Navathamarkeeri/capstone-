# InternFinder

Production-ready React + Express app (Vite) with file uploads.

## Prerequisites
- Node 20+
- npm

## Local development
```bash
npm install
npm run dev
```
- App runs on http://localhost:5000 in dev (Vite middleware)

## Production build
```bash
npm run build
npm start
```
- Defaults: PORT=5000, HOST=0.0.0.0 on Linux, 127.0.0.1 on Windows

## File uploads
- Uploads are stored in `uploads/`. Ensure this path is writable and persistent in production.

## Deploy: Render.com
- Web Service
  - Build: `npm run build`
  - Start: `npm start`
  - Add Disk: name `uploads`, mount `/opt/render/project/src/uploads`

## Deploy: Railway.app
- Build: `npm run build`
- Start: `npm start`
- Add Volume: mount `/app/uploads`

## Deploy: VPS (Ubuntu)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm i -g pm2

# Pull code
cd /opt
sudo git clone <repo> InternFinder
cd InternFinder
npm install
npm run build
mkdir -p uploads && chmod 775 uploads
PORT=80 HOST=0.0.0.0 pm2 start dist/index.js --name internfinder --update-env
pm2 save && pm2 startup
```

## Environment variables
- `PORT` (optional): port to listen on
- `HOST` (optional): host bind (0.0.0.0 in containers; Windows uses 127.0.0.1)

## Scripts
- `dev`: start Express with Vite in dev
- `build`: bundle client (Vite) and server (esbuild)
- `start`: run production server
