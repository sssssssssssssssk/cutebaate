import { useState, useCallback } from 'react';

export const useRazorpay = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const openCheckout = useCallback(async (options: any) => {
    setLoading(true);
    setError(null);
    try {
      const isLoaded = await loadScript();
      if (!isLoaded) {
        throw new Error('Failed to load Razorpay SDK. Please check your internet connection.');
      }
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      const errMsg = err.message || 'Payment initiation failed';
      setError(errMsg);
      console.error('Razorpay SDK error:', err);
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  return { openCheckout, loading, error };
};
