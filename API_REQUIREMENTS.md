# Dokumentasi API Requirements - Project Tracker Frontend

## Ringkasan
Dokumen ini berisi daftar lengkap API endpoints yang diperlukan untuk mendukung semua fitur dalam aplikasi Project Tracker Frontend. API ini harus disiapkan oleh backend untuk memastikan semua komponen dan halaman dapat berfungsi dengan baik.

## Base URL
```
http://localhost:9552/api
```

## Authentication
Semua endpoint (kecuali auth) memerlukan Bearer token di header:
```
Authorization: Bearer <access_token>
```

---

## 1. AUTHENTICATION API

### 1.1 Register User
**Endpoint:** `POST /auth/register`
**Fungsi:** Mendaftarkan user baru
**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "role": "user"
}
```

**Contoh cURL:**
```bash
curl -X POST http://localhost:9552/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "first_name": "John",
    "last_name": "Doe",
    "role": "user"
  }'
```

### 1.2 Login User
**Endpoint:** `POST /auth/login`
**Fungsi:** Login user dan mendapatkan token
**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Contoh cURL:**
```bash
curl -X POST http://localhost:9552/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 1.3 Get User Profile
**Endpoint:** `GET /auth/me`
**Fungsi:** Mendapatkan profil user yang sedang login

**Contoh cURL:**
```bash
curl -X GET http://localhost:9552/api/auth/me \
  -H "Authorization: Bearer <access_token>"
```

### 1.4 Update Profile
**Endpoint:** `PUT /auth/profile`
**Fungsi:** Update profil user
**Body:**
```json
{
  "first_name": "John Updated",
  "last_name": "Doe Updated",
  "avatar_url": "https://example.com/avatar.jpg"
}
```

**Contoh cURL:**
```bash
curl -X PUT http://localhost:9552/api/auth/profile \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John Updated",
    "last_name": "Doe Updated"
  }'
```

### 1.5 Change Password
**Endpoint:** `PUT /auth/change-password`
**Fungsi:** Mengubah password user
**Body:**
```json
{
  "current_password": "oldpassword",
  "new_password": "newpassword",
  "confirm_password": "newpassword"
}
```

**Contoh cURL:**
```bash
curl -X PUT http://localhost:9552/api/auth/change-password \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "current_password": "oldpassword",
    "new_password": "newpassword",
    "confirm_password": "newpassword"
  }'
```

### 1.6 Logout
**Endpoint:** `POST /auth/logout`
**Fungsi:** Logout user

**Contoh cURL:**
```bash
curl -X POST http://localhost:9552/api/auth/logout \
  -H "Authorization: Bearer <access_token>"
```

### 1.7 Refresh Token
**Endpoint:** `POST /auth/refresh-token`
**Fungsi:** Refresh access token
**Body:**
```json
{
  "refresh_token": "refresh_token_here"
}
```

**Contoh cURL:**
```bash
curl -X POST http://localhost:9552/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "refresh_token_here"
  }'
```

---

## 2. PROJECTS API

### 2.1 Get Projects List
**Endpoint:** `GET /projects`
**Fungsi:** Mendapatkan daftar proyek dengan pagination dan filter
**Query Parameters:**
- `page` (optional): Halaman (default: 1)
- `limit` (optional): Jumlah data per halaman (default: 10)
- `status` (optional): Filter berdasarkan status
- `search` (optional): Pencarian berdasarkan nama/deskripsi

**Contoh cURL:**
```bash
curl -X GET "http://localhost:9552/api/projects?page=1&limit=10&status=active" \
  -H "Authorization: Bearer <access_token>"
```

### 2.2 Create Project
**Endpoint:** `POST /projects`
**Fungsi:** Membuat proyek baru
**Body:**
```json
{
  "name": "Project Name",
  "description": "Project Description",
  "status": "active",
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "color": "#3f51b5"
}
```

**Contoh cURL:**
```bash
curl -X POST http://localhost:9552/api/projects \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Project Name",
    "description": "Project Description",
    "status": "active",
    "start_date": "2024-01-01",
    "end_date": "2024-12-31",
    "color": "#3f51b5"
  }'
```

### 2.3 Get Project Detail
**Endpoint:** `GET /projects/{id}`
**Fungsi:** Mendapatkan detail proyek berdasarkan ID

**Contoh cURL:**
```bash
curl -X GET http://localhost:9552/api/projects/123 \
  -H "Authorization: Bearer <access_token>"
```

### 2.4 Update Project
**Endpoint:** `PUT /projects/{id}`
**Fungsi:** Update proyek
**Body:**
```json
{
  "name": "Updated Project Name",
  "description": "Updated Description",
  "status": "completed",
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "color": "#4caf50"
}
```

**Contoh cURL:**
```bash
curl -X PUT http://localhost:9552/api/projects/123 \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Project Name",
    "description": "Updated Description",
    "status": "completed"
  }'
```

### 2.5 Delete Project
**Endpoint:** `DELETE /projects/{id}`
**Fungsi:** Menghapus proyek

**Contoh cURL:**
```bash
curl -X DELETE http://localhost:9552/api/projects/123 \
  -H "Authorization: Bearer <access_token>"
```

### 2.6 Get Project Members
**Endpoint:** `GET /projects/{id}/members`
**Fungsi:** Mendapatkan daftar member proyek

**Contoh cURL:**
```bash
curl -X GET http://localhost:9552/api/projects/123/members \
  -H "Authorization: Bearer <access_token>"
```

### 2.7 Add Project Member
**Endpoint:** `POST /projects/{id}/members`
**Fungsi:** Menambahkan member ke proyek
**Body:**
```json
{
  "user_id": "user_id_here",
  "role": "member"
}
```

**Contoh cURL:**
```bash
curl -X POST http://localhost:9552/api/projects/123/members \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_id_here",
    "role": "member"
  }'
```

### 2.8 Update Project Member
**Endpoint:** `PUT /projects/{id}/members/{user_id}`
**Fungsi:** Update role member proyek
**Body:**
```json
{
  "role": "admin"
}
```

**Contoh cURL:**
```bash
curl -X PUT http://localhost:9552/api/projects/123/members/user_id_here \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "admin"
  }'
```

### 2.9 Remove Project Member
**Endpoint:** `DELETE /projects/{id}/members/{user_id}`
**Fungsi:** Menghapus member dari proyek

**Contoh cURL:**
```bash
curl -X DELETE http://localhost:9552/api/projects/123/members/user_id_here \
  -H "Authorization: Bearer <access_token>"
```

### 2.10 Get Project Statistics
**Endpoint:** `GET /projects/{id}/stats`
**Fungsi:** Mendapatkan statistik proyek (jumlah task per status, member, dll)

**Contoh cURL:**
```bash
curl -X GET http://localhost:9552/api/projects/123/stats \
  -H "Authorization: Bearer <access_token>"
```

---

## 3. TASKS API

### 3.1 Get Tasks List
**Endpoint:** `GET /tasks`
**Fungsi:** Mendapatkan daftar task dengan pagination dan filter
**Query Parameters:**
- `page` (optional): Halaman (default: 1)
- `limit` (optional): Jumlah data per halaman (default: 10)
- `project_id` (optional): Filter berdasarkan proyek
- `status` (optional): Filter berdasarkan status
- `priority` (optional): Filter berdasarkan priority
- `assigned_to` (optional): Filter berdasarkan assignee
- `search` (optional): Pencarian berdasarkan title/deskripsi

**Contoh cURL:**
```bash
curl -X GET "http://localhost:9552/api/tasks?project_id=123&status=todo&limit=20" \
  -H "Authorization: Bearer <access_token>"
```

### 3.2 Create Task
**Endpoint:** `POST /tasks`
**Fungsi:** Membuat task baru
**Body:**
```json
{
  "title": "Task Title",
  "description": "Task Description",
  "status": "todo",
  "priority": "medium",
  "project_id": "123",
  "assigned_to": "user_id_here",
  "due_date": "2024-12-31",
  "parent_task_id": null
}
```

**Contoh cURL:**
```bash
curl -X POST http://localhost:9552/api/tasks \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Task Title",
    "description": "Task Description",
    "status": "todo",
    "priority": "medium",
    "project_id": "123",
    "due_date": "2024-12-31"
  }'
```

### 3.3 Get Task Detail
**Endpoint:** `GET /tasks/{id}`
**Fungsi:** Mendapatkan detail task berdasarkan ID

**Contoh cURL:**
```bash
curl -X GET http://localhost:9552/api/tasks/456 \
  -H "Authorization: Bearer <access_token>"
```

### 3.4 Update Task
**Endpoint:** `PUT /tasks/{id}`
**Fungsi:** Update task
**Body:**
```json
{
  "title": "Updated Task Title",
  "description": "Updated Description",
  "status": "in_progress",
  "priority": "high",
  "due_date": "2024-12-31"
}
```

**Contoh cURL:**
```bash
curl -X PUT http://localhost:9552/api/tasks/456 \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Task Title",
    "description": "Updated Description",
    "status": "in_progress",
    "priority": "high"
  }'
```

### 3.5 Delete Task
**Endpoint:** `DELETE /tasks/{id}`
**Fungsi:** Menghapus task

**Contoh cURL:**
```bash
curl -X DELETE http://localhost:9552/api/tasks/456 \
  -H "Authorization: Bearer <access_token>"
```

### 3.6 Update Task Status
**Endpoint:** `PATCH /tasks/{id}/status`
**Fungsi:** Update status task (untuk drag & drop kanban)
**Body:**
```json
{
  "status": "in_progress",
  "position": 1
}
```

**Contoh cURL:**
```bash
curl -X PATCH http://localhost:9552/api/tasks/456/status \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress",
    "position": 1
  }'
```

### 3.7 Assign Task
**Endpoint:** `PATCH /tasks/{id}/assign`
**Fungsi:** Assign/unassign task ke user
**Body:**
```json
{
  "assigned_to": "user_id_here"
}
```

**Contoh cURL:**
```bash
curl -X PATCH http://localhost:9552/api/tasks/456/assign \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "assigned_to": "user_id_here"
  }'
```

### 3.8 Update Task Position
**Endpoint:** `PATCH /tasks/{id}/position`
**Fungsi:** Update posisi task dalam kanban
**Body:**
```json
{
  "position": 2
}
```

**Contoh cURL:**
```bash
curl -X PATCH http://localhost:9552/api/tasks/456/position \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "position": 2
  }'
```

### 3.9 Get Subtasks
**Endpoint:** `GET /tasks/{id}/subtasks`
**Fungsi:** Mendapatkan daftar subtask

**Contoh cURL:**
```bash
curl -X GET http://localhost:9552/api/tasks/456/subtasks \
  -H "Authorization: Bearer <access_token>"
```

### 3.10 Create Subtask
**Endpoint:** `POST /tasks/{id}/subtasks`
**Fungsi:** Membuat subtask
**Body:**
```json
{
  "title": "Subtask Title",
  "description": "Subtask Description",
  "priority": "medium",
  "assigned_to": "user_id_here",
  "due_date": "2024-12-31"
}
```

**Contoh cURL:**
```bash
curl -X POST http://localhost:9552/api/tasks/456/subtasks \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Subtask Title",
    "description": "Subtask Description",
    "priority": "medium"
  }'
```

### 3.11 Add Task Attachment
**Endpoint:** `POST /tasks/{id}/attachments`
**Fungsi:** Menambahkan attachment ke task
**Body:** (multipart/form-data)
```
file: [file]
description: "File description"
```

**Contoh cURL:**
```bash
curl -X POST http://localhost:9552/api/tasks/456/attachments \
  -H "Authorization: Bearer <access_token>" \
  -F "file=@/path/to/file.pdf" \
  -F "description=Important document"
```

### 3.12 Remove Task Attachment
**Endpoint:** `DELETE /tasks/{id}/attachments/{attachment_id}`
**Fungsi:** Menghapus attachment dari task

**Contoh cURL:**
```bash
curl -X DELETE http://localhost:9552/api/tasks/456/attachments/789 \
  -H "Authorization: Bearer <access_token>"
```

---

## 4. TEAMS API (BELUM ADA - PERLU DIBUAT)

### 4.1 Get Teams List
**Endpoint:** `GET /teams`
**Fungsi:** Mendapatkan daftar team
**Query Parameters:**
- `page` (optional): Halaman (default: 1)
- `limit` (optional): Jumlah data per halaman (default: 10)
- `search` (optional): Pencarian berdasarkan nama

**Contoh cURL:**
```bash
curl -X GET "http://localhost:9552/api/teams?page=1&limit=10" \
  -H "Authorization: Bearer <access_token>"
```

### 4.2 Create Team
**Endpoint:** `POST /teams`
**Fungsi:** Membuat team baru
**Body:**
```json
{
  "name": "Frontend Team",
  "description": "Team untuk pengembangan frontend",
  "status": "active"
}
```

**Contoh cURL:**
```bash
curl -X POST http://localhost:9552/api/teams \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Frontend Team",
    "description": "Team untuk pengembangan frontend",
    "status": "active"
  }'
```

### 4.3 Get Team Detail
**Endpoint:** `GET /teams/{id}`
**Fungsi:** Mendapatkan detail team

**Contoh cURL:**
```bash
curl -X GET http://localhost:9552/api/teams/789 \
  -H "Authorization: Bearer <access_token>"
```

### 4.4 Update Team
**Endpoint:** `PUT /teams/{id}`
**Fungsi:** Update team
**Body:**
```json
{
  "name": "Updated Team Name",
  "description": "Updated Description",
  "status": "inactive"
}
```

**Contoh cURL:**
```bash
curl -X PUT http://localhost:9552/api/teams/789 \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Team Name",
    "description": "Updated Description"
  }'
```

### 4.5 Delete Team
**Endpoint:** `DELETE /teams/{id}`
**Fungsi:** Menghapus team

**Contoh cURL:**
```bash
curl -X DELETE http://localhost:9552/api/teams/789 \
  -H "Authorization: Bearer <access_token>"
```

### 4.6 Get Team Members
**Endpoint:** `GET /teams/{id}/members`
**Fungsi:** Mendapatkan daftar member team

**Contoh cURL:**
```bash
curl -X GET http://localhost:9552/api/teams/789/members \
  -H "Authorization: Bearer <access_token>"
```

### 4.7 Add Team Member
**Endpoint:** `POST /teams/{id}/members`
**Fungsi:** Menambahkan member ke team
**Body:**
```json
{
  "user_id": "user_id_here",
  "role": "member"
}
```

**Contoh cURL:**
```bash
curl -X POST http://localhost:9552/api/teams/789/members \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_id_here",
    "role": "member"
  }'
```

### 4.8 Remove Team Member
**Endpoint:** `DELETE /teams/{id}/members/{user_id}`
**Fungsi:** Menghapus member dari team

**Contoh cURL:**
```bash
curl -X DELETE http://localhost:9552/api/teams/789/members/user_id_here \
  -H "Authorization: Bearer <access_token>"
```

---

## 5. COMMENTS API (BELUM ADA - PERLU DIBUAT)

### 5.1 Get Comments
**Endpoint:** `GET /comments`
**Fungsi:** Mendapatkan daftar komentar
**Query Parameters:**
- `task_id` (optional): Filter berdasarkan task
- `project_id` (optional): Filter berdasarkan proyek
- `page` (optional): Halaman (default: 1)
- `limit` (optional): Jumlah data per halaman (default: 10)

**Contoh cURL:**
```bash
curl -X GET "http://localhost:9552/api/comments?task_id=456&page=1&limit=10" \
  -H "Authorization: Bearer <access_token>"
```

### 5.2 Create Comment
**Endpoint:** `POST /comments`
**Fungsi:** Membuat komentar baru
**Body:**
```json
{
  "content": "This is a comment",
  "task_id": "456",
  "project_id": "123"
}
```

**Contoh cURL:**
```bash
curl -X POST http://localhost:9552/api/comments \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This is a comment",
    "task_id": "456"
  }'
```

### 5.3 Update Comment
**Endpoint:** `PUT /comments/{id}`
**Fungsi:** Update komentar
**Body:**
```json
{
  "content": "Updated comment content"
}
```

**Contoh cURL:**
```bash
curl -X PUT http://localhost:9552/api/comments/101 \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Updated comment content"
  }'
```

### 5.4 Delete Comment
**Endpoint:** `DELETE /comments/{id}`
**Fungsi:** Menghapus komentar

**Contoh cURL:**
```bash
curl -X DELETE http://localhost:9552/api/comments/101 \
  -H "Authorization: Bearer <access_token>"
```

---

## 6. NOTIFICATIONS API (BELUM ADA - PERLU DIBUAT)

### 6.1 Get Notifications
**Endpoint:** `GET /notifications`
**Fungsi:** Mendapatkan daftar notifikasi user
**Query Parameters:**
- `page` (optional): Halaman (default: 1)
- `limit` (optional): Jumlah data per halaman (default: 10)
- `unread_only` (optional): Hanya notifikasi yang belum dibaca (true/false)

**Contoh cURL:**
```bash
curl -X GET "http://localhost:9552/api/notifications?unread_only=true&page=1&limit=10" \
  -H "Authorization: Bearer <access_token>"
```

### 6.2 Mark Notification as Read
**Endpoint:** `PATCH /notifications/{id}/read`
**Fungsi:** Menandai notifikasi sebagai sudah dibaca

**Contoh cURL:**
```bash
curl -X PATCH http://localhost:9552/api/notifications/202/read \
  -H "Authorization: Bearer <access_token>"
```

### 6.3 Mark All Notifications as Read
**Endpoint:** `PATCH /notifications/read-all`
**Fungsi:** Menandai semua notifikasi sebagai sudah dibaca

**Contoh cURL:**
```bash
curl -X PATCH http://localhost:9552/api/notifications/read-all \
  -H "Authorization: Bearer <access_token>"
```

### 6.4 Delete Notification
**Endpoint:** `DELETE /notifications/{id}`
**Fungsi:** Menghapus notifikasi

**Contoh cURL:**
```bash
curl -X DELETE http://localhost:9552/api/notifications/202 \
  -H "Authorization: Bearer <access_token>"
```

### 6.5 Get Unread Count
**Endpoint:** `GET /notifications/unread-count`
**Fungsi:** Mendapatkan jumlah notifikasi yang belum dibaca

**Contoh cURL:**
```bash
curl -X GET http://localhost:9552/api/notifications/unread-count \
  -H "Authorization: Bearer <access_token>"
```

---

## 7. ANALYTICS API (BELUM ADA - PERLU DIBUAT)

### 7.1 Get Dashboard Analytics
**Endpoint:** `GET /analytics/dashboard`
**Fungsi:** Mendapatkan data analytics untuk dashboard
**Query Parameters:**
- `period` (optional): Periode data (week, month, year) - default: month

**Contoh cURL:**
```bash
curl -X GET "http://localhost:9552/api/analytics/dashboard?period=month" \
  -H "Authorization: Bearer <access_token>"
```

### 7.2 Get Project Analytics
**Endpoint:** `GET /analytics/projects`
**Fungsi:** Mendapatkan analytics proyek
**Query Parameters:**
- `project_id` (optional): ID proyek spesifik
- `period` (optional): Periode data (week, month, year)

**Contoh cURL:**
```bash
curl -X GET "http://localhost:9552/api/analytics/projects?period=month" \
  -H "Authorization: Bearer <access_token>"
```

### 7.3 Get Task Analytics
**Endpoint:** `GET /analytics/tasks`
**Fungsi:** Mendapatkan analytics task
**Query Parameters:**
- `project_id` (optional): ID proyek spesifik
- `period` (optional): Periode data (week, month, year)

**Contoh cURL:**
```bash
curl -X GET "http://localhost:9552/api/analytics/tasks?project_id=123&period=week" \
  -H "Authorization: Bearer <access_token>"
```

### 7.4 Get Team Performance
**Endpoint:** `GET /analytics/teams`
**Fungsi:** Mendapatkan analytics performa team
**Query Parameters:**
- `team_id` (optional): ID team spesifik
- `period` (optional): Periode data (week, month, year)

**Contoh cURL:**
```bash
curl -X GET "http://localhost:9552/api/analytics/teams?period=month" \
  -H "Authorization: Bearer <access_token>"
```

---

## 8. CALENDAR API (BELUM ADA - PERLU DIBUAT)

### 8.1 Get Calendar Events
**Endpoint:** `GET /calendar/events`
**Fungsi:** Mendapatkan event kalender
**Query Parameters:**
- `start_date` (required): Tanggal mulai (YYYY-MM-DD)
- `end_date` (required): Tanggal akhir (YYYY-MM-DD)
- `project_id` (optional): Filter berdasarkan proyek
- `user_id` (optional): Filter berdasarkan user

**Contoh cURL:**
```bash
curl -X GET "http://localhost:9552/api/calendar/events?start_date=2024-01-01&end_date=2024-01-31" \
  -H "Authorization: Bearer <access_token>"
```

### 8.2 Create Calendar Event
**Endpoint:** `POST /calendar/events`
**Fungsi:** Membuat event kalender
**Body:**
```json
{
  "title": "Meeting Title",
  "description": "Meeting Description",
  "start_date": "2024-01-15T10:00:00Z",
  "end_date": "2024-01-15T11:00:00Z",
  "type": "meeting",
  "project_id": "123",
  "attendees": ["user_id_1", "user_id_2"]
}
```

**Contoh cURL:**
```bash
curl -X POST http://localhost:9552/api/calendar/events \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Meeting Title",
    "description": "Meeting Description",
    "start_date": "2024-01-15T10:00:00Z",
    "end_date": "2024-01-15T11:00:00Z",
    "type": "meeting",
    "project_id": "123"
  }'
```

### 8.3 Update Calendar Event
**Endpoint:** `PUT /calendar/events/{id}`
**Fungsi:** Update event kalender
**Body:**
```json
{
  "title": "Updated Meeting Title",
  "start_date": "2024-01-15T14:00:00Z",
  "end_date": "2024-01-15T15:00:00Z"
}
```

**Contoh cURL:**
```bash
curl -X PUT http://localhost:9552/api/calendar/events/303 \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Meeting Title",
    "start_date": "2024-01-15T14:00:00Z",
    "end_date": "2024-01-15T15:00:00Z"
  }'
```

### 8.4 Delete Calendar Event
**Endpoint:** `DELETE /calendar/events/{id}`
**Fungsi:** Menghapus event kalender

**Contoh cURL:**
```bash
curl -X DELETE http://localhost:9552/api/calendar/events/303 \
  -H "Authorization: Bearer <access_token>"
```

---

## 9. USERS API (BELUM ADA - PERLU DIBUAT)

### 9.1 Get Users List
**Endpoint:** `GET /users`
**Fungsi:** Mendapatkan daftar user (untuk assign task, add member, dll)
**Query Parameters:**
- `page` (optional): Halaman (default: 1)
- `limit` (optional): Jumlah data per halaman (default: 10)
- `search` (optional): Pencarian berdasarkan nama/email
- `role` (optional): Filter berdasarkan role

**Contoh cURL:**
```bash
curl -X GET "http://localhost:9552/api/users?search=john&role=user" \
  -H "Authorization: Bearer <access_token>"
```

### 9.2 Get User Detail
**Endpoint:** `GET /users/{id}`
**Fungsi:** Mendapatkan detail user

**Contoh cURL:**
```bash
curl -X GET http://localhost:9552/api/users/404 \
  -H "Authorization: Bearer <access_token>"
```

---

## 10. SETTINGS API (BELUM ADA - PERLU DIBUAT)

### 10.1 Get User Settings
**Endpoint:** `GET /settings`
**Fungsi:** Mendapatkan pengaturan user

**Contoh cURL:**
```bash
curl -X GET http://localhost:9552/api/settings \
  -H "Authorization: Bearer <access_token>"
```

### 10.2 Update User Settings
**Endpoint:** `PUT /settings`
**Fungsi:** Update pengaturan user
**Body:**
```json
{
  "theme": "dark",
  "language": "id",
  "notifications": {
    "email": true,
    "push": false,
    "task_assigned": true,
    "task_completed": false
  },
  "timezone": "Asia/Jakarta"
}
```

**Contoh cURL:**
```bash
curl -X PUT http://localhost:9552/api/settings \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "dark",
    "language": "id",
    "notifications": {
      "email": true,
      "push": false,
      "task_assigned": true
    }
  }'
```

---

## 11. FILE UPLOAD API (BELUM ADA - PERLU DIBUAT)

### 11.1 Upload File
**Endpoint:** `POST /upload`
**Fungsi:** Upload file (untuk avatar, attachment task, dll)
**Body:** (multipart/form-data)
```
file: [file]
type: "avatar" | "task_attachment" | "project_file"
```

**Contoh cURL:**
```bash
curl -X POST http://localhost:9552/api/upload \
  -H "Authorization: Bearer <access_token>" \
  -F "file=@/path/to/file.jpg" \
  -F "type=avatar"
```

### 11.2 Delete File
**Endpoint:** `DELETE /upload/{file_id}`
**Fungsi:** Menghapus file

**Contoh cURL:**
```bash
curl -X DELETE http://localhost:9552/api/upload/505 \
  -H "Authorization: Bearer <access_token>"
```

---

## RINGKASAN API YANG BELUM ADA

Berdasarkan analisis aplikasi frontend, berikut adalah API yang **BELUM ADA** dan perlu dibuat oleh backend:

### 🔴 PRIORITAS TINGGI (Fitur utama yang belum berfungsi)
1. **Teams API** - Halaman Teams masih menggunakan mock data
2. **Comments API** - Fitur komentar belum ada sama sekali
3. **Notifications API** - Header menampilkan notifikasi tapi tidak ada API
4. **Users API** - Untuk assign task dan add member ke proyek/team

### 🟡 PRIORITAS SEDANG (Fitur "Coming Soon")
5. **Analytics API** - Halaman Analytics masih placeholder
6. **Calendar API** - Halaman Calendar masih placeholder
7. **Settings API** - Halaman Settings masih placeholder

### 🟢 PRIORITAS RENDAH (Fitur tambahan)
8. **File Upload API** - Untuk upload avatar dan attachment

### ✅ API YANG SUDAH ADA
- Authentication API (login, register, profile, dll)
- Projects API (CRUD lengkap)
- Tasks API (CRUD lengkap dengan drag & drop support)

---

## CATATAN PENTING

1. **Response Format**: Semua API harus mengembalikan response dalam format:
   ```json
   {
     "success": true,
     "message": "Success message",
     "data": { ... }
   }
   ```

2. **Error Handling**: Untuk error, response format:
   ```json
   {
     "success": false,
     "message": "Error message",
     "error": "Error details"
   }
   ```

3. **Pagination**: Untuk endpoint yang support pagination, response format:
   ```json
   {
     "success": true,
     "data": {
       "items": [...],
       "pagination": {
         "page": 1,
         "limit": 10,
         "total": 100,
         "pages": 10
       }
     }
   }
   ```

4. **Authentication**: Semua endpoint (kecuali auth) memerlukan Bearer token di header Authorization.

5. **CORS**: Pastikan backend mengizinkan request dari frontend (localhost:3000).

Dokumen ini dapat digunakan sebagai referensi lengkap untuk pengembangan backend API yang diperlukan oleh aplikasi Project Tracker Frontend.
