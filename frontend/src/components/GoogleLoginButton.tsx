import { useEffect, useRef } from 'react';

interface GoogleLoginButtonProps {
  onSuccess: (idToken: string) => void;
  onError?: () => void;
}

export function GoogleLoginButton({ onSuccess, onError }: GoogleLoginButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn('VITE_GOOGLE_CLIENT_ID manquant : le bouton Google ne peut pas s\'initialiser.');
      return;
    }

    function initialize() {
      if (!window.google || !buttonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (response.credential) {
            onSuccess(response.credential);
          } else {
            onError?.();
          }
        },
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        width: 320,
        text: 'continue_with',
        shape: 'pill',
      });
    }

    // Le script Google (charge dans index.html) peut ne pas etre pret immediatement
    if (window.google) {
      initialize();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          clearInterval(interval);
          initialize();
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [onSuccess, onError]);

  return <div ref={buttonRef} className="flex justify-center" />;
}