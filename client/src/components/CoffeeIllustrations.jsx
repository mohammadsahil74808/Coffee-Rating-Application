import React from 'react';

// Custom, handcrafted coffee illustrations matching the artisanal reference design
export const CoffeeBeanIllustration = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Drop shadow */}
    <ellipse cx="50" cy="78" rx="36" ry="9" fill="#2b1c14" fillOpacity="0.25" />
    
    {/* Left Bean */}
    <g transform="rotate(-22 42 50)">
      <path
        d="M26 24C36 14 56 16 62 28C68 40 64 62 52 70C40 78 22 74 16 60C10 46 16 34 26 24Z"
        fill="#6f4327"
        stroke="#4a2c17"
        strokeWidth="3.5"
      />
      <path
        d="M28 26C36 18 52 20 57 30C62 40 58 58 48 65C38 72 24 69 19 57C14 45 20 34 28 26Z"
        fill="#8a5331"
      />
      {/* S-curve Crease */}
      <path
        d="M40 22C42 32 32 44 42 58C46 64 42 70 42 70"
        stroke="#331c0e"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Specular Highlight */}
      <path
        d="M24 38C26 30 32 25 38 23"
        stroke="#b87a4c"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </g>

    {/* Right Bean */}
    <g transform="rotate(26 62 48)">
      <path
        d="M46 22C56 12 76 14 82 26C88 38 84 60 72 68C60 76 42 72 36 58C30 44 36 32 46 22Z"
        fill="#5a351e"
        stroke="#3a2010"
        strokeWidth="3.5"
      />
      <path
        d="M48 24C56 16 72 18 77 28C82 38 78 56 68 63C58 70 44 67 39 55C34 43 40 32 48 24Z"
        fill="#754324"
      />
      <path
        d="M60 20C62 30 52 42 62 56C66 62 62 68 62 68"
        stroke="#271408"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M44 36C46 28 52 23 58 21"
        stroke="#a2683d"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </g>
  </svg>
);

export const ColdBrewIllustration = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Shadow */}
    <ellipse cx="50" cy="85" rx="20" ry="6" fill="#2b1c14" fillOpacity="0.25" />
    
    {/* Glass Tumbler Outline */}
    <path
      d="M32 20L36 78C36.5 82 40 85 45 85H55C60 85 63.5 82 64 78L68 20H32Z"
      fill="#e3edf2"
      fillOpacity="0.4"
      stroke="#4b5d66"
      strokeWidth="3"
    />
    
    {/* Dark Cold Brew Liquid */}
    <path
      d="M33.5 28L36.8 77C37.2 80 40 82 44 82H56C60 82 62.8 80 63.2 77L66.5 28C62 30 54 27 50 28.5C46 29.5 38 27 33.5 28Z"
      fill="#2a160d"
    />
    
    {/* Cold Brew Crema / Foam head */}
    <path
      d="M33 26C37 28 44 26 50 27.5C56 26 63 28 67 26L67.5 32C63 34 56 31 50 32.5C44 31 37 34 32.5 32L33 26Z"
      fill="#c29160"
    />

    {/* Floating Ice Cubes */}
    <rect x="40" y="36" width="13" height="13" rx="2.5" transform="rotate(14 40 36)" fill="#ffffff" fillOpacity="0.55" stroke="#ffffff" strokeWidth="1.5" />
    <rect x="47" y="52" width="12" height="12" rx="2.5" transform="rotate(-18 47 52)" fill="#ffffff" fillOpacity="0.45" stroke="#ffffff" strokeWidth="1.5" />
    
    {/* Condensation drips */}
    <circle cx="38" cy="48" r="1.5" fill="#ffffff" fillOpacity="0.7" />
    <circle cx="61" cy="62" r="1.5" fill="#ffffff" fillOpacity="0.7" />

    {/* Glass Sheen */}
    <path d="M35 24L38 76" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
  </svg>
);

export const LatteIllustration = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Saucer shadow */}
    <ellipse cx="50" cy="80" rx="36" ry="8" fill="#2b1c14" fillOpacity="0.25" />
    
    {/* Saucer */}
    <ellipse cx="50" cy="76" rx="34" ry="7" fill="#f4ede2" stroke="#4a372c" strokeWidth="3" />
    <ellipse cx="50" cy="75" rx="24" ry="4.5" fill="#e5dacb" />

    {/* Cup Handle */}
    <path
      d="M68 45C76 46 80 54 78 62C76 68 70 70 65 67"
      fill="none"
      stroke="#4a372c"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M67 46C73 47 76 53 75 59C73 64 68 66 65 64"
      fill="none"
      stroke="#f4ede2"
      strokeWidth="2.5"
    />

    {/* Cup Body */}
    <path
      d="M26 38C26 38 28 70 50 70C72 70 74 38 74 38H26Z"
      fill="#f4ede2"
      stroke="#4a372c"
      strokeWidth="3.5"
    />

    {/* Coffee & Crema Surface */}
    <ellipse cx="50" cy="38" rx="23" ry="8" fill="#996038" stroke="#4a372c" strokeWidth="2.5" />
    <ellipse cx="50" cy="38" rx="20.5" ry="6.5" fill="#bb8150" />

    {/* Rosetta Latte Art Foam */}
    <path
      d="M50 34C48 36 44 38 50 40C56 38 52 36 50 34Z"
      fill="#fff6eb"
    />
    <path
      d="M50 37C46 39 42 41 50 43C58 41 54 39 50 37Z"
      fill="#fff6eb"
    />
    <path
      d="M50 33V44"
      stroke="#fff6eb"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const CoffeeIllustration = ({ type = 'beans', className }) => {
  switch (type) {
    case 'cold_brew':
      return <ColdBrewIllustration className={className} />;
    case 'latte':
      return <LatteIllustration className={className} />;
    case 'beans':
    default:
      return <CoffeeBeanIllustration className={className} />;
  }
};

