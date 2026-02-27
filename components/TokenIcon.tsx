
import React from 'react';
import { TOKEN_ICON_URL } from '../constants';

interface TokenIconProps {
    className?: string;
}

const TokenIcon: React.FC<TokenIconProps> = ({ className = "w-4 h-4" }) => {
    return (
        <img 
            src={TOKEN_ICON_URL} 
            alt="Token" 
            className={`object-contain inline-block ${className}`}
            referrerPolicy="no-referrer"
        />
    );
};

export default TokenIcon;
