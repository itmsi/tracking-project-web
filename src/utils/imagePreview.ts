/**
 * Preview image file before upload
 */
export function previewImage(file: File, callback: (imageUrl: string) => void): void {
  const reader = new FileReader();
  
  reader.onloadend = () => {
    if (reader.result && typeof reader.result === 'string') {
      callback(reader.result);
    }
  };
  
  if (file) {
    reader.readAsDataURL(file);
  }
}

/**
 * Convert base64 to blob
 */
export function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

/**
 * Resize image before upload (optional)
 */
export function resizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
  callback: (resizedFile: File) => void
): void {
  const reader = new FileReader();
  
  reader.onload = (e) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            callback(resizedFile);
          }
        }, file.type);
      }
    };
    
    if (e.target?.result && typeof e.target.result === 'string') {
      img.src = e.target.result;
    }
  };
  
  reader.readAsDataURL(file);
}

