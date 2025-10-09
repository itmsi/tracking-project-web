import { useEffect, useRef } from 'react';

/**
 * Custom hook untuk menangani focus management pada modal/menu
 * Mencegah error accessibility ketika ada elemen focusable di dalam aria-hidden
 */
export const useFocusManagement = (isOpen: boolean) => {
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const firstFocusableElement = useRef<HTMLElement | null>(null);
  const lastFocusableElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Simpan elemen yang sedang aktif sebelum modal dibuka
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Cari elemen focusable pertama dan terakhir dalam modal
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;
      
      if (focusableElements.length > 0) {
        firstFocusableElement.current = focusableElements[0];
        lastFocusableElement.current = focusableElements[focusableElements.length - 1];
        
        // Focus ke elemen pertama
        firstFocusableElement.current.focus();
      }
    } else {
      // Kembalikan focus ke elemen sebelumnya ketika modal ditutup
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (event.key === 'Tab') {
      if (event.shiftKey) {
        // Shift + Tab: focus ke elemen sebelumnya
        if (document.activeElement === firstFocusableElement.current) {
          event.preventDefault();
          lastFocusableElement.current?.focus();
        }
      } else {
        // Tab: focus ke elemen berikutnya
        if (document.activeElement === lastFocusableElement.current) {
          event.preventDefault();
          firstFocusableElement.current?.focus();
        }
      }
    }
  };

  return { handleKeyDown };
};
