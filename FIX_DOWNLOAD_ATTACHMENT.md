# 🔧 Fix Download Attachment Issue

## 📋 Problem Description

**Issue**: Download file attachment tidak berfungsi di Task Attachments.

**Previous Implementation**: 
```typescript
// ❌ Tidak berfungsi
<IconButton 
  href={attachment.file_path} 
  target="_blank" 
  rel="noopener noreferrer"
>
  <DownloadIcon />
</IconButton>
```

**Problems**:
1. **File path mungkin relative** dan tidak bisa diakses langsung
2. **Authentication required** - file mungkin protected
3. **CORS issues** jika file di server berbeda
4. **No proper download handling** - browser mungkin buka file instead of download

## ✅ Solution Implemented

### 1. **Multi-Method Download Strategy**

```typescript
const handleDownload = async (attachment: any) => {
  try {
    // Method 1: API Download Endpoint
    const downloadUrl = `/api/tasks/${taskId}/attachments/${attachment.id}/download`;
    // ... download logic
    
    // Method 2: Direct File Path Fallback
    if (attachment.file_path) {
      // ... fallback logic
    }
    
    // Method 3: Open in New Tab
    window.open(fallbackUrl, '_blank');
  } catch (error) {
    // Error handling
  }
};
```

### 2. **Proper Download Implementation**

#### Method 1: API Download Endpoint
```typescript
// Coba download melalui API endpoint yang proper
const downloadUrl = `/api/tasks/${taskId}/attachments/${attachment.id}/download`;

const link = document.createElement('a');
link.href = downloadUrl;
link.download = attachment.original_name;  // Force download
link.target = '_blank';
link.rel = 'noopener noreferrer';
link.style.display = 'none';  // Hidden link

document.body.appendChild(link);
link.click();  // Trigger download
document.body.removeChild(link);
```

#### Method 2: Direct File Path Fallback
```typescript
// Fallback ke direct file path jika API tidak tersedia
if (attachment.file_path) {
  const link = document.createElement('a');
  link.href = attachment.file_path;
  link.download = attachment.original_name;
  // ... same logic
}
```

#### Method 3: Open in New Tab
```typescript
// Final fallback - open file in new tab
const fallbackUrl = attachment.file_path || downloadUrl;
window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
```

### 3. **User Experience Improvements**

#### Download Button Update:
```typescript
// ❌ Sebelum - href (tidak reliable)
<IconButton 
  href={attachment.file_path} 
  target="_blank" 
  rel="noopener noreferrer"
>

// ✅ Sesudah - onClick handler (reliable)
<IconButton 
  onClick={() => handleDownload(attachment)}
  title={`Download ${attachment.original_name}`}
>
```

#### File Name Button Update:
```typescript
// ❌ Sebelum - href
<Button 
  variant="text" 
  href={attachment.file_path} 
  target="_blank" 
  rel="noopener noreferrer"
>

// ✅ Sesudah - onClick handler
<Button 
  variant="text" 
  onClick={() => handleDownload(attachment)}
  sx={{ textAlign: 'left', justifyContent: 'flex-start' }}
>
```

### 4. **Service Method Addition**

```typescript
// src/services/taskViewService.ts
downloadAttachment: (taskId: string, attachmentId: string): Promise<void> => {
  const downloadUrl = `/api/tasks/${taskId}/attachments/${attachmentId}/download`;
  
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return Promise.resolve();
},
```

## 🧪 Testing Steps

### 1. **Test Download Button**
1. Buka task detail → Attachments
2. Klik download icon (⬇️) pada file
3. **Expected**: File download dimulai atau tab baru terbuka

### 2. **Test File Name Click**
1. Klik nama file (bukan icon)
2. **Expected**: File download dimulai atau tab baru terbuka

### 3. **Test Different File Types**
- ✅ **Documents** (.pdf, .doc, .txt) → Should download
- ✅ **Images** (.jpg, .png, .gif) → Should download or open
- ✅ **Videos** (.mp4, .avi) → Should download
- ✅ **Archives** (.zip, .rar) → Should download

### 4. **Test Error Handling**
1. Coba download file yang tidak ada
2. **Expected**: Error notification muncul

## 📊 Expected Behavior

### Before Fix:
```
Click Download → ❌ Nothing happens / Error / File opens instead of downloads
```

### After Fix:
```
Click Download → ✅ File downloads OR opens in new tab
```

## 🔧 Files Modified

### `src/components/taskView/TaskAttachments.tsx`
- ✅ Added `handleDownload` function with multi-method strategy
- ✅ Updated download button to use `onClick` handler
- ✅ Updated file name button to use `onClick` handler
- ✅ Added proper error handling and user feedback

### `src/services/taskViewService.ts`
- ✅ Added `downloadAttachment` service method
- ✅ Proper download URL construction

## 🚨 Backend Requirements

Untuk download yang optimal, backend harus support:

### 1. **Download Endpoint**
```
GET /api/tasks/{taskId}/attachments/{attachmentId}/download
```

**Response**: 
- File content dengan proper headers
- `Content-Disposition: attachment; filename="original_name"`
- `Content-Type: application/octet-stream` atau proper MIME type

### 2. **Authentication**
- Include user authentication (JWT token)
- Check user permissions untuk access file
- Validate task membership

### 3. **File Serving**
- Serve file dari secure storage
- Handle file not found (404)
- Support range requests untuk large files

## 🔄 Fallback Strategy

### Priority Order:
1. **API Download Endpoint** (Preferred)
   - Proper authentication
   - Controlled access
   - Proper headers

2. **Direct File Path** (Fallback)
   - Jika API tidak tersedia
   - File publicly accessible

3. **Open in New Tab** (Last Resort)
   - Jika download tidak bisa
   - User bisa save manually

## 📱 User Experience

### Notifications:
- ✅ "Downloading filename..." - Info notification
- ✅ "Opening filename in new tab..." - Info notification  
- ❌ "Failed to download file. Please contact support." - Error notification

### Visual Feedback:
- ✅ Download button dengan tooltip
- ✅ File name clickable dengan proper styling
- ✅ Loading states jika diperlukan

---

**Status:** ✅ Fixed  
**Download Methods:** 3 fallback strategies  
**Ready for Testing:** Yes

**Test download file sekarang - seharusnya berfungsi!** 📥
