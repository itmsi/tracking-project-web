import { useEffect } from 'react';

/**
 * Custom hook untuk memperbaiki masalah aria-hidden pada Material-UI components
 * Menggunakan inert attribute sebagai gantinya untuk mencegah focus pada elemen yang seharusnya tidak bisa difokus
 */
export const useAriaHiddenFix = (isOpen: boolean) => {
  useEffect(() => {
    const rootElement = document.getElementById('root');
    
    if (isOpen) {
      // Remove focus from any focused elements in the background
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && activeElement !== document.body && !activeElement.closest('[role="menu"]')) {
        activeElement.blur();
      }
      
      // Use inert attribute instead of aria-hidden
      if (rootElement) {
        rootElement.setAttribute('inert', 'true');
        // Remove aria-hidden if it exists
        rootElement.removeAttribute('aria-hidden');
      }
    } else {
      // Remove inert attribute when menu is closed
      if (rootElement) {
        rootElement.removeAttribute('inert');
      }
    }

    // Cleanup function
    return () => {
      if (rootElement) {
        rootElement.removeAttribute('inert');
        rootElement.removeAttribute('aria-hidden');
      }
    };
  }, [isOpen]);
};

/**
 * Global hook untuk memantau dan memperbaiki masalah aria-hidden di seluruh aplikasi
 * Updated: Hanya apply fix untuk dialog/modal MUI, tidak untuk Select/Menu
 */
export const useGlobalAriaHiddenFix = () => {
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
          const target = mutation.target as HTMLElement;
          
          // Only apply fix for root element when aria-hidden is set
          if (target.id === 'root' && target.getAttribute('aria-hidden') === 'true') {
            // Check if there's a MUI Menu or Select open (they use Popover)
            const hasOpenMenu = document.querySelector('.MuiPopover-root[aria-hidden="false"]');
            const hasOpenSelect = document.querySelector('.MuiMenu-root');
            
            // Don't interfere with MUI Select/Menu - let them handle aria-hidden
            if (hasOpenMenu || hasOpenSelect) {
              return;
            }
            
            // Only replace aria-hidden with inert for non-menu cases (e.g., Dialogs)
            target.removeAttribute('aria-hidden');
            target.setAttribute('inert', 'true');
          }
        }
      });
    });

    const rootElement = document.getElementById('root');
    if (rootElement) {
      observer.observe(rootElement, {
        attributes: true,
        attributeFilter: ['aria-hidden']
      });
    }

    return () => {
      observer.disconnect();
      
      // Cleanup: remove any inert attributes
      if (rootElement) {
        rootElement.removeAttribute('inert');
      }
    };
  }, []);
};
