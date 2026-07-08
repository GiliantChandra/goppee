# NovaPay — Setup Guide

## Prerequisites

### Install Docker Desktop
1. Download Docker Desktop: https://www.docker.com/products/docker-desktop/
2. Install and restart your computer
3. Open Docker Desktop and wait until it shows "Engine running"

---

## Quick Start (After Docker is installed)

### 1. Copy the environment file
```powershell
# From the goppee/ root directory:
copy server\.env.example server\.env
```
> Edit `server\.env` with strong secrets for production. For dev, defaults are fine.

### 2. Start the database
```powershell
cd c:\Software\goppee

# Start PostgreSQL container
docker-compose up -d db

# Wait ~10 seconds for DB to be ready
Start-Sleep -Seconds 10
```

### 3. Set up the database schema and seed demo data
```powershell
cd server
npm run db:push
npm run db:seed
```

### 4. Start the backend API
```powershell
# From server/ directory:
npm run dev
```
You should see:
```
🚀 NovaPay API running on port 4000
⚠️  DEMO_MODE enabled — OTPs printed to console
```

### 5. Start the frontend (separate terminal)
```powershell
cd c:\Software\goppee
npm run dev
```

### 6. Open the app
- **App**: http://localhost:5173
- **API Health**: http://localhost:4000/api/health
- **DB Studio**: `cd server && npm run db:studio` → http://localhost:5555

---

## Demo Credentials

| Field | Value |
|---|---|
| Email | `arjuna@novapay.id` |
| Password | `Password1!` |
| PIN | `1234` |

---

## Top-Up OTP (Demo Mode)

When you request a Top-Up, the 6-digit OTP will be printed in the **backend terminal** like:
```
🔑 [DEMO OTP] User cla... | Amount: Rp 100.000 | OTP: 847291 | Expires: 2026-07-08T...
```

---

## Production Deployment with HTTPS

### Generate self-signed SSL certificate (for local HTTPS test)
```powershell
# Run in the goppee/nginx/ssl/ directory
openssl req -x509 -nodes -days 365 -newkey rsa:2048 `
  -keyout server.key -out server.crt `
  -subj "/C=ID/ST=Jakarta/O=NovaPay/CN=localhost"
```

### Run full production stack
```powershell
docker-compose -f docker-compose.prod.yml up --build
```
App will be available at https://localhost (port 443)

### For real domain + Let's Encrypt
See `nginx/README.md` for instructions on replacing self-signed certs with Let's Encrypt.

---

## Security Checklist

- [ ] Changed `JWT_SECRET` to a random 64+ char string
- [ ] Changed `JWT_REFRESH_SECRET` to a different random string  
- [ ] Changed `ENCRYPTION_KEY` to a random 32-byte hex string
- [ ] Changed `DB_PASSWORD` to a strong password
- [ ] Set `DEMO_MODE=false` in production
- [ ] Set `CORS_ORIGIN` to your actual domain
- [ ] Never committed `.env` to Git (it's in .gitignore)
- [ ] PostgreSQL port NOT exposed outside Docker network ✅ (already configured)
