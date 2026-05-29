import React, { useEffect } from 'react';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'horizontal' | 'vertical';
  responsive?: boolean;
}

const AdBanner: React.FC<AdBannerProps> = ({ slot, format = 'auto', responsive = true }) => {
  useEffect(() => {
    // Push AdSense script to window
    try {
      if (window.adsbygoogle === undefined) {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }
      
      // Push ad
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.log('AdSense failed to load', error);
    }
  }, []);

  return (
    <div className="my-4 flex justify-center">
      <ins
        className={`adsbygoogle ${responsive ? 'ad-responsive' : ''}`}
        style={{
          display: format === 'auto' ? 'block' : 'inline-block',
          textAlign: 'center',
          width: format === 'vertical' ? '300px' : 'auto',
          height: format === 'vertical' ? '600px' : 'auto'
        }}
        data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
};

// Declare window types for AdSense
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default AdBanner;
