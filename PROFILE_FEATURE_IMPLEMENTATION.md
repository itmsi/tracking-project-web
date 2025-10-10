# 📝 Implementasi Fitur Profil User

Dokumentasi ini menjelaskan implementasi lengkap fitur profil user yang sudah terintegrasi dengan backend API.

## 📋 Fitur yang Diimplementasikan

1. ✅ **View Profile** - Melihat informasi profil user
2. ✅ **Edit Profile** - Mengubah nama depan, nama belakang, dan avatar URL
3. ✅ **Upload Avatar** - Upload foto profil dengan preview dan progress
4. ✅ **Change Password** - Ganti password dengan validasi dan strength indicator
5. ✅ **Form Validation** - Validasi client-side untuk semua form
6. ✅ **Error Handling** - Penanganan error yang baik
7. ✅ **Responsive Design** - Tampilan responsif untuk mobile dan desktop

---

## 📁 Struktur File

```
src/
├── components/
│   └── profile/
│       ├── ProfilePage.tsx          # Halaman utama profil dengan tabs
│       ├── ProfilePage.css          # Styles untuk ProfilePage
│       ├── AvatarUpload.tsx         # Komponen upload avatar
│       ├── AvatarUpload.css         # Styles untuk AvatarUpload
│       ├── ChangePassword.tsx       # Komponen ganti password
│       ├── ChangePassword.css       # Styles untuk ChangePassword
│       └── index.ts                 # Export barrel file
│
├── hooks/
│   └── useProfile.ts                # Custom hook untuk state management profil
│
├── utils/
│   ├── profileValidation.ts        # Validasi form profil dan avatar
│   ├── passwordValidation.ts       # Validasi password dan strength checker
│   └── imagePreview.ts              # Utilities untuk preview dan resize image
│
└── services/
    ├── auth.ts                      # Sudah ada (getProfile, updateProfile, changePassword)
    └── upload.ts                    # Sudah ada (uploadAvatar)
```

---

## 🔧 Penggunaan

### 1. Mengakses Halaman Profil

User dapat mengakses halaman profil melalui:
- **Menu Header**: Klik avatar di header → Pilih "Profil"
- **Direct URL**: `/profile`

### 2. Melihat Profil

Halaman profil menampilkan:
- Avatar user
- Email
- Nama depan & belakang
- Role (dengan badge berwarna)
- Tanggal bergabung

### 3. Edit Profil

1. Klik tombol **"Edit Profil"**
2. Ubah nama depan dan/atau nama belakang
3. (Opsional) Ubah avatar URL
4. Klik **"Simpan"** atau **"Batal"** untuk membatalkan

**Validasi:**
- Nama depan & belakang tidak boleh kosong
- Maksimal 100 karakter
- Avatar URL harus valid (http/https)

### 4. Upload Avatar

1. Klik tombol **"Ganti Avatar"** di bagian atas
2. Pilih file gambar (JPG, PNG, GIF, WEBP)
3. File akan otomatis diupload dengan progress indicator
4. Avatar akan langsung diperbarui setelah upload berhasil

**Batasan:**
- Format: JPG, PNG, GIF, WEBP
- Ukuran maksimal: 10MB
- Preview otomatis sebelum upload

### 5. Ganti Password

1. Klik tab **"Ganti Password"**
2. Masukkan password lama
3. Masukkan password baru (minimal 6 karakter)
4. Konfirmasi password baru
5. Klik **"Ganti Password"**

**Fitur:**
- Toggle visibility password (👁️)
- Password strength indicator (Lemah, Sedang, Kuat, Sangat Kuat)
- Validasi real-time
- Auto logout setelah berhasil (3 detik)

**Persyaratan Password:**
- Minimal 6 karakter
- Mengandung huruf besar dan kecil
- Mengandung angka
- Berbeda dari password lama

---

## 🎨 Komponen Utama

### ProfilePage

Komponen utama dengan 2 tabs:
1. **Tab Profil**: View & Edit profil + Upload avatar
2. **Tab Ganti Password**: Form ganti password

**Props:** Tidak ada (menggunakan hooks)

**State Management:** Menggunakan `useProfile()` hook

### AvatarUpload

Komponen untuk upload foto profil dengan fitur:
- Preview image
- Upload progress indicator
- Validasi file
- Error handling

**Props:**
```typescript
interface AvatarUploadProps {
  currentAvatar?: string;
  onUploadSuccess?: (updatedProfile: User) => void;
}
```

### ChangePassword

Komponen form ganti password dengan fitur:
- Password visibility toggle
- Strength indicator dengan visual bar
- Validasi real-time
- Auto logout setelah sukses

**Props:** Tidak ada (menggunakan hooks)

---

## 🪝 Custom Hook: useProfile

Hook untuk mengelola state dan operasi profil.

```typescript
const {
  profile,          // User profile data
  loading,          // Loading state
  error,            // Error message
  uploading,        // Upload state
  uploadProgress,   // Upload progress (0-100%)
  fetchProfile,     // Fetch profile function
  updateProfile,    // Update profile function
  uploadAvatar,     // Upload avatar function
  changePassword,   // Change password function
  clearError        // Clear error function
} = useProfile();
```

**Contoh Penggunaan:**

```typescript
import { useProfile } from '../../hooks/useProfile';

function MyComponent() {
  const { profile, loading, updateProfile } = useProfile();
  
  const handleUpdate = async () => {
    try {
      await updateProfile({
        first_name: 'John',
        last_name: 'Doe'
      });
      console.log('Profile updated!');
    } catch (error) {
      console.error('Update failed:', error);
    }
  };
  
  return (
    <div>
      {loading ? 'Loading...' : profile?.first_name}
    </div>
  );
}
```

---

## 🛠 Utilities

### profileValidation.ts

Fungsi untuk validasi form profil:

```typescript
// Validate profile form
const validation = validateProfileForm({
  first_name: 'John',
  last_name: 'Doe',
  avatar_url: 'https://example.com/avatar.jpg'
});

if (!validation.isValid) {
  console.log(validation.errors);
}

// Validate avatar file
const fileValidation = validateAvatarFile(file);
if (!fileValidation.isValid) {
  console.log(fileValidation.error);
}
```

### passwordValidation.ts

Fungsi untuk validasi password:

```typescript
// Validate password form
const validation = validatePasswordForm({
  current_password: 'oldpass',
  new_password: 'NewPass123',
  confirm_password: 'NewPass123'
});

// Check password strength
const strength = getPasswordStrength('MyPassword123');
console.log(strength.level);    // 'weak' | 'medium' | 'strong' | 'very-strong'
console.log(strength.score);    // 0-6
console.log(strength.message);  // 'Lemah' | 'Sedang' | 'Kuat' | 'Sangat Kuat'
```

### imagePreview.ts

Utilities untuk preview dan manipulasi image:

```typescript
// Preview image sebelum upload
previewImage(file, (imageUrl) => {
  setPreview(imageUrl);
});

// Resize image (opsional)
resizeImage(file, 800, 800, (resizedFile) => {
  uploadAvatar(resizedFile);
});
```

---

## 🎯 API Endpoints yang Digunakan

| Endpoint | Method | Fungsi |
|----------|--------|--------|
| `/api/auth/me` | GET | Get profile user |
| `/api/auth/profile` | PUT | Update profile |
| `/api/auth/change-password` | PUT | Ganti password |
| `/api/upload` | POST | Upload file (avatar) |

---

## 🎨 Styling & Tema

### CSS Custom Properties

Komponen menggunakan CSS dengan variabel untuk konsistensi:

```css
/* Primary Colors */
--primary-color: #3498db
--primary-hover: #2980b9

/* Status Colors */
--success-color: #27ae60
--error-color: #e74c3c
--warning-color: #f39c12

/* Password Strength Colors */
--weak: #e74c3c (merah)
--medium: #f39c12 (kuning)
--strong: #27ae60 (hijau)
--very-strong: #16a085 (hijau gelap)
```

### Responsive Breakpoints

- Desktop: > 768px
- Mobile: ≤ 768px

---

## ✅ Checklist Testing

Berikut checklist untuk testing fitur profil:

### View Profile
- [ ] Profile data tampil dengan benar
- [ ] Avatar tampil (atau placeholder jika tidak ada)
- [ ] Badge role tampil dengan warna yang sesuai
- [ ] Tanggal bergabung tampil dengan format yang benar

### Edit Profile
- [ ] Form pre-filled dengan data saat ini
- [ ] Validasi nama depan bekerja
- [ ] Validasi nama belakang bekerja
- [ ] Validasi avatar URL bekerja
- [ ] Tombol "Simpan" menyimpan perubahan
- [ ] Tombol "Batal" membatalkan perubahan
- [ ] Success message tampil setelah berhasil
- [ ] Error message tampil jika gagal

### Upload Avatar
- [ ] File picker terbuka saat klik "Ganti Avatar"
- [ ] Preview image tampil sebelum upload
- [ ] Progress indicator tampil saat upload
- [ ] Validasi file type bekerja
- [ ] Validasi file size bekerja (max 10MB)
- [ ] Avatar berubah setelah upload berhasil
- [ ] Error message tampil jika upload gagal

### Change Password
- [ ] Toggle visibility password bekerja
- [ ] Password strength indicator bekerja
- [ ] Validasi password lama bekerja
- [ ] Validasi password baru bekerja
- [ ] Validasi konfirmasi password bekerja
- [ ] Error tampil jika password lama salah
- [ ] Success message tampil setelah berhasil
- [ ] Auto logout setelah 3 detik
- [ ] Redirect ke login page setelah logout

### Responsive Design
- [ ] Tampilan baik di desktop
- [ ] Tampilan baik di tablet
- [ ] Tampilan baik di mobile
- [ ] Semua tombol accessible di mobile
- [ ] Scroll bekerja dengan baik

### Error Handling
- [ ] Network error dihandle dengan baik
- [ ] 401 error (unauthorized) dihandle
- [ ] 400 error (validation) dihandle
- [ ] 500 error (server) dihandle
- [ ] Timeout dihandle

---

## 🐛 Troubleshooting

### Avatar tidak tampil

**Penyebab:**
- URL avatar tidak valid
- CORS issue
- File tidak ditemukan

**Solusi:**
- Cek console untuk error
- Pastikan URL avatar valid
- Cek CORS setting di backend

### Upload avatar gagal

**Penyebab:**
- File terlalu besar (> 10MB)
- Format file tidak didukung
- Network error

**Solusi:**
- Compress image sebelum upload
- Gunakan format JPG, PNG, GIF, atau WEBP
- Cek koneksi internet

### Password tidak bisa diganti

**Penyebab:**
- Password lama salah
- Password baru tidak memenuhi syarat
- Token expired

**Solusi:**
- Cek password lama
- Pastikan password baru memenuhi persyaratan
- Login ulang jika token expired

### Form validation tidak bekerja

**Penyebab:**
- JavaScript error
- Validation function tidak terimport

**Solusi:**
- Cek console untuk error
- Pastikan semua import sudah benar
- Clear cache dan reload

---

## 🚀 Future Enhancements

Berikut beberapa enhancement yang bisa ditambahkan:

1. **Two-Factor Authentication (2FA)**
   - Enable/disable 2FA
   - QR code generator
   - Backup codes

2. **Activity Log**
   - Login history
   - Password change history
   - Profile update history

3. **Privacy Settings**
   - Profile visibility
   - Email notifications preferences
   - Data export

4. **Avatar Cropper**
   - Crop image sebelum upload
   - Zoom & rotate
   - Aspect ratio presets

5. **Social Media Links**
   - LinkedIn, GitHub, Twitter
   - Portfolio website
   - Contact information

6. **Email Change**
   - Verify dengan kode
   - Confirmation email

7. **Account Deletion**
   - Soft delete
   - Data export sebelum delete
   - Confirmation dialog

---

## 📚 Referensi

- [Backend API Documentation](./API_INTEGRATION.md)
- [User Profile API Guide](./Untitled-13) - Dokumen panduan integrasi
- [React Hooks Documentation](https://react.dev/reference/react)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

**Last Updated**: Oktober 2025  
**Version**: 1.0.0  
**Maintainer**: Development Team

---

## 💡 Tips

1. **Gunakan custom hook `useProfile()` untuk state management** - Lebih mudah dan konsisten
2. **Validasi di client-side sebelum kirim ke server** - UX lebih baik
3. **Show loading indicator saat operasi** - User tahu proses sedang berjalan
4. **Handle error dengan baik** - Show error message yang jelas
5. **Test di berbagai device** - Pastikan responsive
6. **Compress image sebelum upload** - Performance lebih baik
7. **Auto logout setelah ganti password** - Security best practice

---

**Selamat menggunakan fitur profil! 🎉**

