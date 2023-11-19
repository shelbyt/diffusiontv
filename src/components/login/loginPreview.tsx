import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { usePopup } from '../../state/PopupContext'; // Adjust the import path as needed
import Image from 'next/image';
import { Drawer } from 'vaul';

const LoginModal = () => {
    const router = useRouter();
    const { showLoginModal, handleCloseModal } = usePopup();
    const [open, setOpen] = useState(showLoginModal);

    const handleAuth0Login = () => {
        router.push('/api/auth/login');
    };

    // Synchronize internal open state with external showLoginModal state
    React.useEffect(() => {
        setOpen(showLoginModal);
    }, [showLoginModal]);

    const closeModal = () => {
        setOpen(false);
        handleCloseModal();
    };

    return (
        <Drawer.Root open={open} onClose={closeModal}>
            <Drawer.Trigger asChild onClick={() => setOpen(true)}>
                <div />
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Overlay 
                    className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" 
                    onClick={closeModal} 
                />
                <Drawer.Content 
                    className="m-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-base-100 bottom-0 fixed"
                    onClick={(e) => e.stopPropagation()} // Prevent click from propagating to overlay
                >
                    <div className="text-center">
                        <Image
                            src="/logohq.png" 
                            alt="Diffusion TV Logo"
                            width={144} 
                            height={50}
                            layout="fixed"
                        />

                        <h2 className="text-xl font-bold text-base-content mt-4">Login to Diffusion TV</h2>
                        <h3 className="text-sm leading-6 font-medium text-base-content mb-4">
                            Save videos, follow creators, and find your next inspiration.
                        </h3>
                        <div className="mt-2 mb-8">
                            <button
                                className="btn btn-wide btn-primary"
                                onClick={handleAuth0Login}
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
};

export default LoginModal;


// import React from 'react';
// import { useRouter } from 'next/router';
// import { usePopup } from '../../state/PopupContext'; // Adjust the import path as needed
// import Image from 'next/image';


// const LoginModal = () => {
//     const router = useRouter();
//     const { showLoginModal, handleCloseModal } = usePopup();

//     const handleAuth0Login = () => {
//         // Assuming Auth0 redirection is handled by the route '/api/auth/login'
//         router.push('/api/auth/login');
//     };
//     const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
//         if (e.currentTarget.id === 'modal-overlay') {
//             handleCloseModal();
//         }
//     };

//     const handleSheetClick = (e: React.MouseEvent<HTMLDivElement>) => {
//         e.stopPropagation(); // Prevents the click from propagating to the overlay
//     };

//     // Return null to render nothing if the modal should not be shown
//     if (!showLoginModal) {
//         return null;
//     }

//     return (
//         <div
//             id="modal-overlay"
//             className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full ${showLoginModal ? 'flex' : 'hidden'}`}
//             onClick={handleOutsideClick}
//         >
//             <div className="m-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-base-100 bottom-0 fixed"
//                 onClick={handleSheetClick}
//             >
//                 <div className="text-center">
//                     <Image
//                         src="/logohq.png" 
//                         alt="Diffusion TV Logo"
//                         width={144} 
//                         height={50}
//                         layout="fixed"
//                     />

//                     <h2 className="text-xl font-bold text-base-content mt-4">Login to Diffusion TV</h2> {/* Header with Tailwind styling */}
//                     <h3 className="text-sm leading-6 font-medium text-base-content mb-4">Save videos, follow creators, and find your next inspiration.
//                     </h3>
//                     <div className="mt-2">
//                         <button
//                             className="btn btn-wide btn-primary"
//                             onClick={handleAuth0Login}
//                         >
//                             Login
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default LoginModal;

