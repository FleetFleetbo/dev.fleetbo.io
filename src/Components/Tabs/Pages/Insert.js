
import React, { useState, useEffect } from 'react';
import Fleetbo from 'systemHelper';
import { fleetboDB } from 'db';
import {  Link  } from 'react-router-dom';


const Insert = () => {
    
    const  db                                   = "items";
    
    const [loading,  setLoading]                = useState();
    const [resultMessage, setResultMessage]     = useState();
    const [messageType, setMessageType]         = useState(''); // 'success' or 'error'
    const [imageURL, setImageURL]               = useState(""); // State pour l'URL de l'image
    const [token, setToken]                     = useState('');
    const [formData, setFormData]               = useState({
            title: "",
            content: "",
            image: ""
            // No need to store current date. Automatic
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
        // Define the displayImage function in the global scope when component mounts
        window.displayImage = (escapedImageBase64) => {
            try {
                const decodedImageBase64 = decodeURIComponent(escapedImageBase64); // Decode the image
                setImageURL(decodedImageBase64); // Update the image URL for display
                setFormData((prevData) => ({
                    ...prevData,
                    image: decodedImageBase64, // Add the image to the form data
                }));
                // Close gallery if needed - depends on your implementation
                // Fleetbo.closeGalleryView();
            } catch (error) {
                console.error("Error decoding image:", error);
            }
        };

        // Cleanup function to remove the global function when component unmounts
        return () => {
            window.displayImage = undefined;
        };
    }, []);


    const handleSubmit = (e) => {
        setLoading(true);
        e.preventDefault();
        setResultMessage("");
        setMessageType("");

        if (!formData.title || !formData.content) {
            setLoading(false);
            setResultMessage('Required fields');
            setMessageType('danger');
            return;
        }
        
        // Définir les données directement pour éviter les problèmes d'asynchronicité
        const notificationData = {
            title: formData.title,
            body: formData.content, 
            image: ""
        };
        const jsonDataNotification    = JSON.stringify(notificationData); 
        const jsonData                = JSON.stringify(formData);

        // Insertion
        setTimeout(() => {
            Fleetbo.add(fleetboDB, db, jsonData);
            Fleetbo.startNotification(jsonDataNotification);
            setFormData({ title: "", content: "", image: "" });
            setImageURL("");
            setLoading(false);
        }, 1000);
    };


    window.onAddResult = (success) => {
        if (success) {
            setResultMessage('✅ Added successfully.');
            setMessageType('success');
            return;
        } else {
            setResultMessage("❌ Sending error.");
            setMessageType('danger');
            return;
        }
    };
    
    
    return (
        <>
            <header className='navbar pt-4'> 
                <div className=''> 
                    <button onClick={() => Fleetbo.back() }  className="logout fs-5 fw-bold">
                        <i className="fa-solid fa-arrow-left"></i> <span className='ms-3'>Insert</span>
                    </button>
                </div>
                <div className="navbar-right">
                    <button onClick={() => Fleetbo.openGalleryView() }  className="logout fw-bold">
                         <i className="fa-solid fs-5 fa-image"></i>
                    </button>
                </div>
            </header>

            {/* Container avec gestion du loader */}
            <div className="p-3" >
        
                <div className="p-2 mt-2">          
                    <form onSubmit={handleSubmit} >
                                  
                        <div className='mt-3 mb-3'>
                            <div className='mt-1'>
                                <h3 className="float-start fw-bolder text-success" style={{ fontFamily: 'arial' }}>
                                    Add item 
                                </h3>
                            </div>
                        </div>
                        <br /> <br />

                                       
                        <div className="mt-3 mb-4" style={{ width: '100%' }}>
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
       
                                    {/* Gallery photo  */}
                                    <Link
                                        onClick={() => Fleetbo.openGalleryView() } 
                                        style={{
                                            position: 'absolute',
                                            bottom: '1px',
                                            right: '1px',
                                            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fond semi-transparent
                                            borderRadius: '20%',
                                            padding: '7px',
                                            paddingLeft: '13px',
                                            paddingRight: '13px',
                                            color: '#fff',
                                        }}
                                    >
                                        <i className="fa fa-camera" style={{ fontSize: '17px' }}></i>
                                    </Link>
                            </div>
                        </div>
  
                        <div className="mb-3">
                            <label className="float-start fs-5 mb-2">Title</label>
                            <input
                                type='text'
                                className="form-control input"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                           
                            />
                        </div>
       
                        <div className="mb-3">
                            <label className="float-start fs-5 mb-2">Description</label>
                            <textarea
                                type="text"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                className="form-control input"
                                rows={4}
                                           
                            >
                            </textarea>
                        </div>
       
                        <button
                                className="go mt-2 mb-2 fw-bold" 
                                onClick={handleSubmit} 
                                type="submit"
                                disabled={loading}
                        >
                                {loading ? 'Loading...' : 'Add'} 
                        </button>
                        <div className="text-success fw-normal mt-1" style={{ height: '20px'}}>
                                {/* Result Message */}
                                {resultMessage && (
                                    <div className={`input-box mt-3 fs-6 text-${messageType === 'success' ? 'success' : 'danger'}`}>
                                        {resultMessage}  
                                    </div>
                                )}
                        </div>
       
                    </form>
                </div>
          
            </div>
        </>
    );
};

export default Insert;

