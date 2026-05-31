import React, { useEffect, useState } from 'react';

const InteractiveBackground: React.FC = () => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  return (
    <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden bg-gradient-to-br from-indigo-50/50 via-pink-50/50 to-blue-50/50 dark:from-slate-950 dark:via-purple-950/10 dark:to-slate-950">
      {/* Soft glowing mesh background blobs */}
      <div 
        className="absolute w-[500px] h-[500px] bg-purple-300/20 dark:bg-purple-900/10 rounded-full blur-[100px] animate-pulse"
        style={{
          top: '10%',
          left: '15%',
          animationDuration: '8s'
        }}
      />
      <div 
        className="absolute w-[600px] h-[600px] bg-pink-300/20 dark:bg-pink-900/10 rounded-full blur-[120px] animate-pulse"
        style={{
          bottom: '15%',
          right: '15%',
          animationDuration: '12s',
          animationDelay: '2s'
        }}
      />
      <div 
        className="absolute w-[400px] h-[400px] bg-blue-300/20 dark:bg-blue-900/10 rounded-full blur-[80px] animate-pulse"
        style={{
          top: '40%',
          right: '25%',
          animationDuration: '10s',
          animationDelay: '1s'
        }}
      />

      {/* Dynamic spot-glow cursor follower */}
      {!isMobile && (
        <div
          className="absolute rounded-full pointer-events-none opacity-60 dark:opacity-40 blur-[80px] transition-all duration-300 ease-out"
          style={{
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(236,72,153,0.05) 50%, transparent 100%)',
            transform: 'translate(-50%, -50%)',
            left: `${coords.x}px`,
            top: `${coords.y}px`,
          }}
        />
      )}

      {/* CSS grid dot overlay pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px), radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px',
        }}
      />
    </div>
  );
};

export default InteractiveBackground;
