
import { useState, useEffect } from 'react';
import Fleetbo from 'api/fleetbo'; 


const useModalLauncher = () => {
    // 1. Le hook gère son propre état interne
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 2. Le hook contient toute la logique de l'effet
    useEffect(() => {
        console.log("✅ ATTACHE de l'écouteur de modal");

        const handleShowModal = () => {
            console.log("➡️ Événement 'showModalRequest' REÇU");
            setIsModalOpen(true);
        };

        window.addEventListener('showModalRequest', handleShowModal);

        return () => {
            console.log("❌ NETTOYAGE de l'écouteur de modal");
            window.removeEventListener('showModalRequest', handleShowModal);
        };
    }, []); 

    // 3. Le hook expose une fonction pour fermer le modal
    const closeModal = () => {
        setIsModalOpen(false);
        if (window.Fleetbo && window.Fleetbo.setNavbarVisible) {
            Fleetbo.setNavbarVisible();
        }
    };

    // 4. Le hook retourne l'état et la fonction de fermeture
    return { isModalOpen, closeModal };
};

export default useModalLauncher;
