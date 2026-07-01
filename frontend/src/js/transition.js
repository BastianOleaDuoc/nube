import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function usePageTransition() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleLinkClick = (e) => {
      const link = e.target.closest('a');
      
      if (!link || e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;

      const href = link.getAttribute('href');
      const target = link.getAttribute('target');

      if (
        href && 
        !href.startsWith('#') && 
        !href.startsWith('http') &&
        !href.startsWith('mailto:') &&
        target !== '_blank'
      ) {
        e.preventDefault();
        
        document.body.classList.add('page-exit');

        setTimeout(() => {
          document.body.classList.remove('page-exit');
          navigate(href);
        }, 350);
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, [navigate, location]);
}