import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Ensures that every route transition scrolls window to top (0, 0)
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return null;
}
