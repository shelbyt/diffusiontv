import React from 'react';
import { useRouter } from 'next/router';

interface AppLinkProps {
    displayText: string;
    link: string;
    className?: string; // Add a className prop
}

const AppLink: React.FC<AppLinkProps> = ({ displayText, link, className }) => {
    const router = useRouter();

    const handleNavigation = () => {
        if (!link) return;

        // Check if the link is an external URL
        if (link.startsWith('http://') || link.startsWith('https://')) {
            window.open(link, '_blank')?.focus(); // Open external links in a new tab
        } else {
            // Use Next.js router with shallow routing for internal links
            router.push(link, undefined, { shallow: true });
        }
    };
    const combinedClassName = `flex items-center text-base font-bold cursor-pointer ${className || ''}`;

    return (
        <div
            className={combinedClassName}
            onClick={handleNavigation}
        >
            {displayText}
        </div>
    );
};

export default AppLink;
