# 🚀 Project Tracker Frontend

Aplikasi web modern untuk mengelola proyek dan tugas menggunakan React.js dengan Material-UI dan TypeScript.

## ✨ Fitur Utama

- 🔐 **Authentication** - Login dan registrasi dengan JWT
- 📊 **Dashboard** - Statistik dan ringkasan proyek
- 📁 **Project Management** - Kelola proyek dengan grid layout yang responsif
- ✅ **Task Management** - Kanban board dengan drag & drop
- 👥 **Team Management** - Kelola tim dan anggota
- 🎨 **Modern UI/UX** - Desain yang clean dan user-friendly
- 📱 **Responsive Design** - Optimal di semua perangkat

## 🛠️ Teknologi yang Digunakan

- **React 18** - Library JavaScript untuk UI
- **TypeScript** - Type safety dan developer experience
- **Material-UI (MUI)** - Komponen UI yang modern
- **Redux Toolkit** - State management
- **React Router** - Routing dan navigasi
- **@dnd-kit** - Drag and drop functionality
- **Axios** - HTTP client untuk API calls
- **React Hook Form** - Form handling
- **Yup** - Validation schema

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 atau lebih baru)
- npm atau yarn
- Backend API yang berjalan di `http://localhost:9552`

### Installation

1. Clone repository:
```bash
git clone <repository-url>
cd project-tracker-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

4. Buka browser dan akses `http://localhost:9554`

## 📁 Struktur Project

```
src/
├── components/          # Komponen React
│   ├── auth/           # Komponen authentication
│   ├── common/         # Komponen umum
│   ├── layout/         # Layout components
│   ├── projects/       # Komponen project
│   └── tasks/          # Komponen task
├── pages/              # Halaman utama
├── services/           # API services
├── store/              # Redux store
├── theme.ts            # Material-UI theme
└── App.tsx             # Root component
```

## 🔧 Konfigurasi

### API Configuration

API base URL dikonfigurasi di `src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:9552/api';
```

### Environment Variables

Buat file `.env` di root project:

```env
REACT_APP_API_URL=http://localhost:9552/api
REACT_APP_WS_URL=ws://localhost:9552
```

## 🎨 UI/UX Features

### Modern Design System
- **Color Palette**: Primary blue dengan accent colors
- **Typography**: Inter font family untuk readability
- **Spacing**: Consistent spacing system
- **Shadows**: Subtle shadows untuk depth
- **Animations**: Smooth transitions dan hover effects

### Responsive Layout
- **Mobile-first approach**
- **Breakpoints**: xs, sm, md, lg, xl
- **Flexible grid system**
- **Adaptive components**

### Interactive Elements
- **Drag & Drop**: Kanban board dengan @dnd-kit
- **Hover Effects**: Card lift dan color transitions
- **Loading States**: Skeleton dan progress indicators
- **Error Handling**: User-friendly error messages

## 📱 Pages Overview

### 1. Login/Register
- Modern gradient design
- Form validation dengan Yup
- Responsive layout
- Error handling

### 2. Dashboard
- Statistics cards dengan charts
- Recent tasks dan projects
- Quick actions
- Real-time updates

### 3. Projects
- Grid layout dengan cards
- Filter dan search functionality
- Status tabs
- Create/edit dialogs

### 4. Tasks (Kanban)
- Drag & drop kanban board
- Task cards dengan priority indicators
- Status columns
- Real-time updates

### 5. Teams
- Team member management
- Avatar groups
- Project assignments
- Role-based access

## 🔐 Authentication Flow

1. **Login/Register** - User authentication
2. **JWT Storage** - Token disimpan di localStorage
3. **Protected Routes** - Route protection dengan Redux
4. **Auto Refresh** - Token refresh mechanism
5. **Logout** - Clear tokens dan redirect

## 🎯 State Management

### Redux Store Structure
```typescript
{
  auth: {
    user: User | null,
    token: string | null,
    isAuthenticated: boolean,
    loading: boolean,
    error: string | null
  },
  projects: {
    projects: Project[],
    currentProject: Project | null,
    loading: boolean,
    error: string | null
  },
  tasks: {
    tasks: Task[],
    currentTask: Task | null,
    loading: boolean,
    error: string | null
  }
}
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Docker Deployment

#### Production Build
```bash
# Build and run with Docker
docker build -t project-tracker-frontend .
docker run -p 3000:80 project-tracker-frontend

# Or use docker-compose
docker-compose up --build
```

#### Development with Docker
```bash
# Run development server with hot reload
docker-compose -f docker-compose.dev.yml up

# Access the app at http://localhost:9554
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Material-UI team untuk komponen yang luar biasa
- React team untuk framework yang powerful
- Redux team untuk state management solution
- @dnd-kit team untuk drag & drop functionality

---

**Dibuat dengan ❤️ menggunakan React.js dan Material-UI**