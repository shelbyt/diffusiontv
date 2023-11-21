import React from 'react';
import { useRouter } from 'next/router';

interface AppLinkProps {
    displayText: string;
    link: string;
}

const AppLink: React.FC<AppLinkProps> = ({ displayText, link }) => {
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

    return (
        <div
            className="flex items-center text-base font-semibold cursor-pointer"
            onClick={handleNavigation}
        >
            {displayText}
        </div>
    );
};

export default AppLink;
