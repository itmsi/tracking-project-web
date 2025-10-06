# 🔧 Port Configuration - Project Tracker

## 📋 Port Assignment

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| **Frontend** | **9554** | `http://localhost:9554` | React.js Application |
| **Backend API** | **9552** | `http://localhost:9552/api` | REST API Server |
| **WebSocket** | **9552** | `ws://localhost:9552` | Real-time Communication |

## 🚀 Cara Menjalankan

### 1. Development Mode
```bash
# Masuk ke direktori project
cd project-tracker-frontend

# Install dependencies (jika belum)
npm install

# Jalankan aplikasi di port 9554
npm start
```

### 2. Dengan Environment Variable
```bash
# Set port secara manual
PORT=9554 npm start

# Atau dengan environment file
echo "PORT=9554" > .env
npm start
```

### 3. Docker Development
```bash
# Jalankan dengan Docker Compose
docker-compose -f docker-compose.dev.yml up

# Aplikasi akan tersedia di http://localhost:9554
```

### 4. Docker Production
```bash
# Build dan jalankan production
docker-compose up --build

# Aplikasi akan tersedia di http://localhost:9554
```

## ⚙️ Konfigurasi

### Package.json Scripts
```json
{
  "scripts": {
    "start": "PORT=9554 react-scripts start",
    "start:dev": "PORT=9554 react-scripts start",
    "preview": "serve -s build -l 9554"
  }
}
```

### Environment Variables
```bash
# .env file
REACT_APP_API_URL=http://localhost:9552/api
REACT_APP_WS_URL=ws://localhost:9552
REACT_APP_FRONTEND_URL=http://localhost:9554
REACT_APP_FRONTEND_PORT=9554
```

### Docker Compose
```yaml
services:
  frontend:
    ports:
      - "9554:80"  # Production
      - "9554:9554" # Development
    environment:
      - PORT=9554
      - REACT_APP_FRONTEND_URL=http://localhost:9554
```

## 🔍 Troubleshooting

### Port Already in Use
```bash
# Cek proses yang menggunakan port 9554
lsof -i :9554

# Kill proses jika diperlukan
kill -9 <PID>

# Atau gunakan port lain
PORT=9555 npm start
```

### Port Conflict dengan Backend
```bash
# Pastikan backend API berjalan di port 9552
# Dan frontend di port 9554
# Tidak ada konflik karena port berbeda
```

### CORS Issues
```bash
# Pastikan backend API mengizinkan origin dari port 9554
# Di backend, tambahkan:
# CORS_ORIGIN=http://localhost:9554
```

## 📱 Access URLs

- **Frontend**: http://localhost:9554
- **Backend API**: http://localhost:9552/api
- **API Documentation**: http://localhost:9552/api/docs (jika tersedia)

## 🔄 Hot Reload

Aplikasi akan otomatis reload ketika ada perubahan file:
- ✅ Hot reload aktif di development mode
- ✅ File changes detection
- ✅ Browser auto-refresh

## 🐳 Docker Ports

### Development Container
- Host Port: 9554
- Container Port: 9554
- Access: http://localhost:9554

### Production Container
- Host Port: 9554
- Container Port: 80 (nginx)
- Access: http://localhost:9554

---

**Aplikasi Project Tracker siap digunakan di http://localhost:9554** 🎉
