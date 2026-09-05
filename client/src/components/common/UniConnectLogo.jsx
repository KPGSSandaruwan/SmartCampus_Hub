import React from 'react';
import logoDark from '../../assets/logo-dark.png';
import logoLight from '../../assets/logo-light.png';

const UniConnectLogo = ({ size = 'medium', color = '#09090B' }) => {
  const isLarge = size === 'large';
  const isSmall = size === 'small';
  
  const height = isLarge ? 36 : isSmall ? 22 : 28;
  const isWhite = color.toUpperCase() === '#FFFFFF' || color.toUpperCase() === '#FFF';
  const logoSrc = isWhite ? logoLight : logoDark;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', userSelect: 'none' }}>
      <img 
        src={logoSrc} 
        alt="UniConnect Logo" 
        style={{ height: `${height}px`, width: 'auto', objectFit: 'contain' }} 
      />
    </div>
  );
};

export default UniConnectLogo;
