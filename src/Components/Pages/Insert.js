
import React, { useState, useEffect } from 'react';
import {  Link  } from 'react-router-dom';


const Insert = () => {
    

    const [imageURL, setImageURL] = useState(""); // State pour l'URL de l'image
    const [message,  setMessage]  = useState("");
    const [loading,  setLoading]  = useState(false);
    const [loadpage, setLoadPage] = useState(true); 


    const [formData, setFormData] = useState({
        image: "", // Ajouter un champ pour l'image encodée en base64
        ville: "",
        quartier: "",
        complement: "",
        prix: "",
        country: "Cameroun",
        dateCreated: new Date().toLocaleString(),
    });

    // Gérer les changements dans les champs du formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    /****   Camera  ****/
	const openPicker = () => {
        if (typeof window.fleetbo !== 'undefined' && typeof window.fleetbo.openImagePicker === 'function') {
            window.fleetbo.openImagePicker(); // Appel de la fonction Kotlin pour ouvrir la caméra
        } else {
            setMessage("L'interface Android n'est pas disponible");
        }
    };

    // Fonction globale pour recevoir l'image encodée en base64 depuis Kotlin
    window.displayImage = (escapedImageBase64) => {
        try {
            const decodedImageBase64 = decodeURIComponent(escapedImageBase64); // Décoder l'image
            setImageURL(decodedImageBase64); // Met à jour l'URL de l'image
            setFormData((prevData) => ({
                ...prevData,
                image: escapedImageBase64, // Ajouter l'image au formulaire
            }));
        } catch (error) {
            console.error("Erreur lors du décodage de l'image:", error);
            setMessage("Erreur lors du décodage de l'image.");
        }
    };

    // Gérer la soumission du formulaire
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        // Vérification des champs obligatoires
        if (!formData.ville || !formData.quartier || !formData.prix) {
            setMessage("Tous les champs doivent être remplis !");
            setLoading(false);
            return;
        }

        if (!imageURL) {
            setMessage("Veuillez d'abord sélectionner une image !");
            setLoading(false);
            return;
        }

        // Vérifiez si l'interface Android et la méthode existent
        if (window.fleetbo && typeof window.fleetbo.ndf043 === "function") {
            const collectionPath = "chambres";

            // Appel de la méthode Kotlin
            try {
                // Appel de la méthode Kotlin
                window.fleetbo.ndf043(
                    collectionPath,
                    JSON.stringify(formData) // Convertir les données en JSON
                );
            } catch (error) {
                console.error("Erreur lors de l'appel de NewDocWithFile :", error);
                setMessage("Erreur lors de l'envoi des données.");
            }
        } else {
            console.error("La méthode NewDocWithFile n'est pas disponible.");
            setMessage("Erreur : Interface Android non disponible.");
            setLoading(false); // Désactiver le chargement
        }
    };

    const openFragment = async (e) => {
        e.preventDefault(); 
        if (typeof window.fleetbo.openFragment === 'function') {
          window.fleetbo.openFragment();
        } 
    };

    const back= async () => {
        if (typeof window.fleetbo.back === 'function') {
            window.fleetbo.back();
        } 
    };


    useEffect(() => {
            setTimeout(() => {  setLoadPage(false); }, 300);   
    }, [loadpage]);
    

    return (
        <>
            <header className='navbar pt-4'> 
                <div className=''> 
                    <button onClick={back} className="logout fs-5 fw-bold">
                        <i className="fa-solid fa-arrow-left"></i> <span className='ms-3'>Insert</span>
                    </button>
                </div>
                <div className="navbar-right">
                    <button onClick={openFragment} className="logout fw-bold">
                         <i className="fa-solid fs-5 fa-image"></i>
                    </button>
                </div>
            </header>

            {/* Container avec gestion du loader */}
            <div className="center-container " >
            {loadpage ? (
                <div className="center-container">
                   <div className="loader"></div>
                </div>
            ) : (
                <>
                      <div className="row">
                               
                               <form onSubmit={handleSubmit} >
                                  
                                   <div className='mb-3'>
                                       <div className='mt-1'>
                                           <h3 className="float-start fw-bolder text-success" style={{ fontFamily: 'tahoma' }}>
                                                Add image
                                            </h3>
                                        </div>
                                   </div>
                                   <br /> <br />
                                       
                                   <div className="mb-4" style={{ width: '100%' }}>
                                       <div
                                           className="bg-light d-flex align-items-center justify-content-center"
                                           style={{
                                               width: '100px',
                                               height: '90px',
                                               borderRadius: '9%',
                                               position: 'relative',
                                           }}
                                       >
                                                   {/* Image */}
                                            <img
                                               id="imageView"
                                               src={imageURL || `${process.env.PUBLIC_URL}/logo512.png`}
                                               alt="default"
                                               style={{
                                                   width: '100%',
                                                   height: '100%',
                                                   borderRadius: '9%',
                                                   objectFit: 'cover', // Ajuste l'image pour qu'elle remplisse le conteneur
                                               }}
                                           />
       
                                           {/* Icône caméra */}
                                           <Link
                                               onClick={openPicker}
                                               style={{
                                                       position: 'absolute',
                                                       bottom: '10px',
                                                       right: '10px',
                                                       backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fond semi-transparent
                                                       borderRadius: '20%',
                                                       padding: '7px',
                                                       color: '#fff',
                                               }}
                                           >
                                               <i className="fa fa-camera" style={{ fontSize: '18px' }}></i>
                                           </Link>
                                       </div>
                                   </div>
                                           
                                   <div className="mb-3">
                                       <label className="float-start fs-5">Category</label>
                                       <select
                                           className="form-control input"
                                           name="ville"
                                           value={formData.ville}
                                           onChange={handleChange}
                                           required
                                       >
                                           <option value=""> Select a Category</option>
                                           <option value="Douala">Douala</option>
                                           <option value="Yaoundé">Yaoundé</option>
                                       </select>
                                   </div>
       
                                   <div className="mb-3">
                                       <label className="float-start fs-5">Description</label>
                                       <input
                                           type="text"
                                           name="complement"
                                           value={formData.complement}
                                           onChange={handleChange}
                                           className="form-control input"
                                           placeholder="Ex: Face petit terrain"
                                           required
                                       />
                                   </div>
       
                                   <button type="submit" className="go mt-3" >
                                       {loading ? "Chargement..." : "Ajouter"}
                                   </button>
                                   <div className="text-success fw-normal mt-1" style={{ height: '20px'}}>
                                       {message && <p>{message}</p>}
                                   </div>
       
                               </form>
                       </div>
                </>
            )}
            </div>
        </>
    );
};

export default Insert;

