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
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/lo-fi.webp')",
          // Fallback gradient if image doesn't load
          background: `
            url('/lo-fi.webp') center/cover no-repeat,
            linear-gradient(135deg, 
              #FFE4D1 0%,
              #FFD1DC 25%,
              #E6D6FF 50%,
              #D1E7FF 75%,
              #FFE4D1 100%
            )
          `
        }}
      />
    </div>
  );
}
