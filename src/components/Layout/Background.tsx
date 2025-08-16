'use client';

import { useEffect, useState } from 'react';

export function Background() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 -z-10">
      {/* Lo-fi Background Image */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/lo-fi.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
}
