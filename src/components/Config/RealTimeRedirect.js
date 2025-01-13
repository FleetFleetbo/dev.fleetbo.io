import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {  db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore'; // Assurez-vous d'importer onSnapshot et doc


const RealTimeRedirect = () => {
  
  const [isLoading, setIsLoading] = useState(true); // Pour gérer l'état de chargement
  const navigate = useNavigate();
  // setter test
  localStorage.setItem('my-key', 'VdaEMM8hrHaAcwGSuuCibn4bZ233');


  useEffect(() => {

    const key = localStorage.getItem('my-key');
    if (!key) {
      console.log('No key found in localStorage');
      navigate('/un')
      setIsLoading(false); // Permet de terminer le chargement si la clé n'existe pas
      return;
    }

    const docRef = doc(db, 'entreprises/WHsQQDGqPAWizwXL3EAg/users', key);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.logged === true) {
          //alert('logged TRUE')
          navigate('/publication'); // Redirection immédiate
          setIsLoading(false); // Si pas de document trouvé, arrêtez le chargement
        } else {
          //alert('logged False')
          navigate('/auth'); // Redirection immédiate
          setIsLoading(false); // Si pas de document trouvé, arrêtez le chargement
        }
      } else {
        console.log('No such document!');
        navigate('/un');
        setIsLoading(false); // Si pas de document trouvé, arrêtez le chargement
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Pendant le chargement, vous pouvez afficher un indicateur visuel de chargement ou simplement retourner null
  if (isLoading) {
    return <div>Chargement...</div>; // Vous pouvez personnaliser l'indicateur de chargement
  }

  // Si aucun chargement, le composant ne fait rien
  return null;
};

export default RealTimeRedirect; // Export par défaut
